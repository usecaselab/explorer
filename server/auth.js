import { betterAuth } from 'better-auth';
import { db } from './db.js';

const socialProviders = {};

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

// X / Twitter sign-in is intentionally disabled. The Free tier's /2/users/me
// endpoint returns 403 client-not-enrolled in practice even when the app is in
// a Project, and the reliable fix is the $200/mo Basic tier. Re-enable later
// if the tier is acquired.

if (Object.keys(socialProviders).length === 0) {
  console.warn(
    '⚠ No social providers configured. Set GITHUB_CLIENT_ID/SECRET to enable sign-in.'
  );
}

// Allow sign-in flows from the apex, www, and the legacy explorer subdomain so
// any of the three URLs work end-to-end.
const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000';
const trustedOrigins = [baseURL];
if (baseURL.includes('usecaselab.org')) {
  trustedOrigins.push(
    'https://usecaselab.org',
    'https://www.usecaselab.org',
    'https://explorer.usecaselab.org'
  );
}

export const auth = betterAuth({
  database: db,
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET || 'dev-secret-change-me',
  socialProviders,
  trustedOrigins: Array.from(new Set(trustedOrigins)),
  advanced: {
    // Sign in once on usecaselab.org and the cookie is valid on www and
    // explorer subdomains too.
    crossSubDomainCookies: {
      enabled: baseURL.includes('usecaselab.org'),
      domain: '.usecaselab.org',
    },
  },
});
