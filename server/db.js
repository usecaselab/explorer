import Database from 'better-sqlite3';
import { dirname } from 'path';
import { mkdirSync } from 'fs';

const DB_PATH = process.env.DB_PATH || './data/explorer.db';

mkdirSync(dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS user (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  emailVerified INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  expiresAt INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  accountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  accessToken TEXT,
  refreshToken TEXT,
  idToken TEXT,
  accessTokenExpiresAt INTEGER,
  refreshTokenExpiresAt INTEGER,
  scope TEXT,
  password TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expiresAt INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS votes (
  ideaId TEXT NOT NULL,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  createdAt INTEGER NOT NULL,
  PRIMARY KEY (ideaId, userId)
);

CREATE TABLE IF NOT EXISTS working (
  ideaId TEXT NOT NULL,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  url TEXT,
  note TEXT,
  createdAt INTEGER NOT NULL,
  PRIMARY KEY (ideaId, userId)
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  solutionSketch TEXT NOT NULL,
  whyEthereum TEXT NOT NULL,
  domains TEXT NOT NULL,
  resources TEXT NOT NULL,
  submitterId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending','approved','rejected')),
  rejectionReason TEXT,
  paymentTxHash TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS edits (
  id TEXT PRIMARY KEY,
  ideaId TEXT NOT NULL,
  title TEXT,
  problem TEXT,
  solutionSketch TEXT,
  whyEthereum TEXT,
  domains TEXT,
  resources TEXT,
  submitterId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending','approved','rejected')),
  rejectionReason TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS idea_overrides (
  ideaId TEXT PRIMARY KEY,
  title TEXT,
  problem TEXT,
  solutionSketch TEXT,
  whyEthereum TEXT,
  domains TEXT,
  resources TEXT,
  approvedAt INTEGER NOT NULL,
  approvedBy TEXT
);

CREATE TABLE IF NOT EXISTS ideas (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  solutionSketch TEXT NOT NULL,
  whyEthereum TEXT NOT NULL,
  domains TEXT NOT NULL,
  resources TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Use Case Lab',
  submitterId TEXT REFERENCES user(id) ON DELETE SET NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_votes_idea ON votes(ideaId);
CREATE INDEX IF NOT EXISTS idx_working_idea ON working(ideaId);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitter ON submissions(submitterId);
CREATE INDEX IF NOT EXISTS idx_edits_status ON edits(status);
CREATE INDEX IF NOT EXISTS idx_edits_idea ON edits(ideaId);
`;

db.exec(SCHEMA);

console.log(`SQLite ready at ${DB_PATH}`);
