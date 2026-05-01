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
    // to grant the users.email scope. Skip it; Better Auth falls back to username.
    disableDefaultScope: true,
    scope: ['users.read', 'tweet.read', 'offline.access'],
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
