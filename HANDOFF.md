# Use Case Lab — Maintainer Handoff

Welcome. This doc gets a new maintainer productive on the project in under an hour.

## What this is

Use Case Lab ([usecaselab.org](https://usecaselab.org)) is an interactive compendium of real-world Ethereum use cases across 30+ domains. It's a React SPA backed by a small Express + SQLite server with social auth, idea submissions, edits, votes, and "working on" signals.

- Repo: https://github.com/usecaselab/explorer
- Live: https://usecaselab.org (also served at https://usecaselab.eth.limo via IPFS)

## Tech stack

- **Frontend:** React 19, TypeScript, Vite 6, Tailwind (CDN), Lucide icons, Three.js + R3F
- **Backend:** Express 5, better-sqlite3, Better Auth (Google / GitHub OAuth)
- **AI:** Google Gemini (`@google/genai`) for the brainstorm feature
- **Container:** Dockerfile, deployed via Coolify
- **Package manager:** pnpm preferred (lockfile committed); npm also works

## Repo layout

```
App.tsx, index.tsx, constants.ts, types.ts, utils.ts  # SPA entry + shared
components/        # All React components (modals, pages, buttons)
lib/               # Client API wrapper, auth client, hooks
server.js          # Express entrypoint
server/
  auth.js          # Better Auth config
  db.js            # SQLite schema + connection
  seed-ideas.js    # Seeds curated ideas on boot
  routes/
    ideas.js       # GET ideas, votes, "working on"
    submissions.js # New idea submissions + admin approval
    edits.js       # Edit proposals + admin approval
public/data/       # Domain markdown + project manifests (content source)
public/about/      # Static sub-sites (Argentina Onchain, Commerce, etc.)
public/verifiable-cities/  # Static sub-site
Dockerfile, nixpacks.toml  # Deploy configs
```

Content (domains, ideas, projects) lives as markdown in `public/data/` — non-code contributors can edit it directly.

## Running locally

```bash
pnpm install
cp .env.example .env   # fill in secrets (see below)
pnpm dev               # Vite on :3000, proxies /api to :3001
pnpm dev:server        # Express on :3001 (separate terminal)
```

Build / preview:
```bash
pnpm build && pnpm preview
```

Production single-process (what the container runs):
```bash
pnpm build && pnpm start   # Express serves dist/ + /api on PORT
```

## Required env vars

See `.env.example` for the canonical list. Minimum to boot:

- `BETTER_AUTH_SECRET` — long random string
- `BETTER_AUTH_URL` — `http://localhost:3000` locally, `https://usecaselab.org` in prod
- At least one OAuth provider pair (`GOOGLE_CLIENT_ID`/`SECRET`, `GITHUB_CLIENT_ID`/`SECRET`)
- `DB_PATH` — `./data/explorer.db` locally, `/data/explorer.db` in prod (mounted volume)
- `ADMIN_EMAILS` — comma-separated emails allowed to access `/admin`
- `GEMINI_API_KEY` — for the brainstorm feature
- `PORT` — defaults to 3000 in prod, 3001 for local dev:server

**OAuth note:** each OAuth app has one callback URL, so you need separate Google/GitHub apps for dev vs. prod. Twitter/X support was removed (see commits `7d7199c`, `217bd85`).

## Database

- SQLite via `better-sqlite3`, file at `DB_PATH`.
- Schema is created on boot in `server/db.js`.
- Curated ideas are seeded by `server/seed-ideas.js` on every boot (idempotent).
- In prod, the DB lives on a Coolify-mounted volume at `/data`. **Back it up before any redeploy that touches the volume.**

## Deployment

Hosted on **Coolify** at `pblvrt.com`.

- SSH: `ssh streameth@pblvrt.com`
- Dockerfile-based build; Coolify pulls from `main` and rebuilds on push.
- `.github/workflows/deploy.yml` exists for the CI-driven path.
- Persistent volume: mount Coolify volume to `/data` so `explorer.db` survives redeploys.

To deploy: merge to `main` → Coolify auto-builds. Manual redeploy via Coolify UI if needed.

The IPFS mirror (`usecaselab.eth.limo`) is a separate pipeline — `public/about/` and `public/verifiable-cities/` are pre-built static sub-sites included in the bundle.

## Auth model

Better Auth handles sessions via httpOnly cookies. The handler is mounted at `/api/auth/*` **before** `express.json()` (it parses bodies itself — don't reorder). Auth client lives in `lib/auth-client.ts`. Protected routes check session server-side via Better Auth helpers in route files.

Admin gating: any email in `ADMIN_EMAILS` can hit `/admin` and approve/reject submissions and edits.

## Contribution flow

- **Content (domains, projects):** edit markdown in `public/data/`. No code needed.
- **Use case submissions:** users submit via `SubmitIdeaModal`; admins approve in `/admin`.
- **Edits to existing ideas:** users propose via `EditIdeaModal`; admins approve in `/admin`.
- **Code:** PRs into `main`. No formal test suite — verify manually by running locally and exercising affected flows.

## Known quirks / gotchas

- **No automated tests.** Manual verification only — at minimum: sign in, submit an idea, approve as admin, edit, vote, "working on".
- **Tailwind via CDN** (in `index.html`) — fast to ship, but no purge / JIT customization.
- **Two lockfiles** (`package-lock.json` + `pnpm-lock.yaml`) — prefer pnpm; the npm one is legacy.
- **Better Auth handler ordering** in `server.js` is load-bearing — see comment in file.
- **Seed function runs on every boot** — keep it idempotent if you extend it.
- **OAuth callback URLs** are per-environment; you cannot share OAuth apps across dev/prod.

## Where to look first when things break

| Symptom | Look at |
|---|---|
| Sign-in fails | `server/auth.js`, OAuth provider dashboard, `BETTER_AUTH_URL` matches origin |
| 500 on `/api/*` | Coolify logs; check `DB_PATH` is writable |
| Missing ideas after deploy | DB volume not mounted; check Coolify volume config |
| Brainstorm errors | `GEMINI_API_KEY`, Gemini quota |
| Build fails in Docker | `better-sqlite3` needs `python3 make g++` (already in Dockerfile) |

## Contacts

- Previous maintainer: Pablo Voorvaart — pablo@streameth.org, GitHub [@pblvrt](https://github.com/pblvrt)
- Org: [Use Case Lab](https://github.com/usecaselab) (Ethereum Foundation)

## Suggested first week

1. Get it running locally end-to-end (auth, submit, admin approve).
2. SSH into the VPS, locate the DB, set up a backup cron if none exists.
3. Rotate `BETTER_AUTH_SECRET` and OAuth credentials.
4. Add yourself to `ADMIN_EMAILS` in prod.
5. Skim open issues and recent PRs to catch the active threads.
