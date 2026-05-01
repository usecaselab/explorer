import { betterAuth } from 'better-auth';
import { db } from './db.js';

const socialProviders = {};

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
  socialProviders.twitter = {
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
    // X requires apps to enable "Request email from users" (with privacy/ToS URLs)
    // to grant the users.email scope. Skip it; we fall back to username.
    disableDefaultScope: true,
    scope: ['users.read', 'tweet.read', 'offline.access'],
    // Custom getUserInfo so we can see what X actually returns when it fails —
    // Better Auth's default swallows the error detail and just returns null.
    getUserInfo: async (token) => {
      const res = await fetch(
        'https://api.x.com/2/users/me?user.fields=profile_image_url',
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      );
      const text = await res.text();
      if (!res.ok) {
        console.error(
          `[twitter getUserInfo] ${res.status} ${res.statusText} :: ${text.slice(0, 500)}`
        );
        return null;
      }
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        console.error(`[twitter getUserInfo] non-JSON response: ${text.slice(0, 500)}`);
        return null;
      }
      const u = parsed?.data;
      if (!u?.id) {
        console.error(`[twitter getUserInfo] no .data.id in response: ${text.slice(0, 500)}`);
        return null;
      }
      return {
        user: {
          id: u.id,
          name: u.name || u.username,
          email: u.username ? `${u.username}@x.com` : `${u.id}@x.com`,
          image: u.profile_image_url || null,
          emailVerified: false,
        },
        data: parsed,
      };
    },
  };
}

if (Object.keys(socialProviders).length === 0) {
  console.warn(
    '⚠ No social providers configured. Set GITHUB_CLIENT_ID/SECRET or TWITTER_CLIENT_ID/SECRET to enable sign-in.'
  );
}

export const auth = betterAuth({
  database: db,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET || 'dev-secret-change-me',
  socialProviders,
  trustedOrigins: [process.env.BETTER_AUTH_URL || 'http://localhost:3000'],
});
