# Deploying April AI on a VPS

The app self-hosts as a standalone Next.js server. It runs with **zero
configuration** (demo mode) and each capability turns on when you add its env
vars — see the table at the bottom.

Two supported paths: **Docker** (recommended) or **bare metal** (Node + PM2).

---

## Option A — Docker (recommended)

Prereqs: Docker + the Compose plugin on the VPS.

```sh
git clone <repo-url> april-ai && cd april-ai
git checkout claude/code-analysis-26q3oe

# Optional: real keys. Skip entirely to run in demo mode.
cp .env.example .env.production && nano .env.production

# Demo mode (no DB):
docker compose up -d --build app

# OR full stack with local Postgres + pgvector (persistence + RAG):
#   set DATABASE_URL=postgres://april:april@db:5432/april in .env.production
docker compose --profile db up -d --build
```

The app listens on **:3000**. Verify:

```sh
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000    # 200
```

**Database migrations** (only if you set `DATABASE_URL`). Run once, from the host
with the DB reachable:

```sh
# with the compose Postgres running and DATABASE_URL exported locally:
DATABASE_URL=postgres://april:april@localhost:5432/april npm run db:push
```

Update to a new version:

```sh
git pull && docker compose up -d --build app
```

---

## Option B — Bare metal (Node 22 + PM2)

```sh
# 1. Node 22 (via nvm or NodeSource), then:
git clone <repo-url> april-ai && cd april-ai
git checkout claude/code-analysis-26q3oe
npm ci
cp .env.example .env.local && nano .env.local   # optional keys
npm run build

# 2. The standalone server lives in .next/standalone.
#    Copy static assets next to it (Next does not do this automatically):
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# 3. Run under PM2:
npm i -g pm2
PORT=3000 pm2 start .next/standalone/server.js --name april-ai
pm2 save && pm2 startup     # survive reboots
```

Migrations (if using a DB): `npm run db:push`.

---

## Reverse proxy + TLS (Nginx)

Point a domain at the VPS, then proxy to :3000 and let Certbot handle HTTPS.

```nginx
server {
  server_name your-domain.com;

  location / {
    proxy_pass         http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection 'upgrade';
    proxy_set_header   Host $host;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    # Streaming (chat) — don't buffer SSE responses:
    proxy_buffering    off;
  }
}
```

```sh
sudo certbot --nginx -d your-domain.com
```

> `proxy_buffering off` matters — it keeps the streaming chat responses flowing
> token-by-token instead of arriving all at once.

---

## Turning on capabilities

Add these to `.env.production` (Docker) or `.env.local` (bare metal), then
rebuild/restart. All optional and independent.

| Add | Enables |
| --- | --- |
| `ANTHROPIC_API_KEY` | Real AI answers (replaces demo mode) |
| `OPENAI_API_KEY` | Embeddings for RAG (and GPT chat if `AI_PROVIDER=openai`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` | Auth + route protection |
| `DATABASE_URL` (Postgres + pgvector) | Conversation history + document storage |
| `TAVILY_API_KEY` | Live web search tool |

RAG needs **both** `DATABASE_URL` and `OPENAI_API_KEY`, and the Postgres must
have the `vector` extension available (the migration runs `CREATE EXTENSION`).
The bundled `pgvector/pgvector` image already includes it.
