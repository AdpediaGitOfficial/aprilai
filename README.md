# April AI — Legal Intelligence Workspace

An independent, multi-page AI legal-counsel application built on **Next.js 16
(App Router)**, React 19, Tailwind CSS v4, and the Vercel AI SDK. Migrated off
Lovable/TanStack Start into a clean, scalable, provider-agnostic architecture.

## Stack

| Layer      | Choice                                                     |
| ---------- | ---------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, RSC, Turbopack)                    |
| Language   | TypeScript (strict)                                        |
| UI         | Tailwind CSS v4 + shadcn/ui (new-york) + lucide icons      |
| AI         | Vercel AI SDK 7 with a swappable provider registry         |
| Providers  | Anthropic (default) / OpenAI — switch via `AI_PROVIDER`    |
| Auth       | Clerk (optional — enabled by env)                          |
| Database   | Postgres + Drizzle ORM (optional — enabled by env)         |
| Data fetch | TanStack Query                                             |

## Getting started

```sh
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY (or OPENAI_API_KEY)
npm install
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

### Progressive configuration

Auth and persistence are **optional and env-driven** — the app runs fully with
no configuration (guest identity, in-memory chat) and lights up when you add the
relevant keys:

| Capability            | Turned on by                              | Then                                    |
| --------------------- | ----------------------------------------- | --------------------------------------- |
| AI responses          | `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`) | Chat streams real answers               |
| Auth + route guard    | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (+ secret) | Real users, `/sign-in`, protected app |
| Conversation history  | `DATABASE_URL`                            | Chats persist and appear in the sidebar |
| Web search tool       | `TAVILY_API_KEY`                          | Composer's "Web search" toggle works    |
| Document analysis (RAG) | `DATABASE_URL` + `OPENAI_API_KEY`       | Upload docs; April retrieves + cites    |

With a database set, run migrations once:

```sh
npm run db:generate   # writes SQL from the schema (no DB needed)
npm run db:push       # applies the schema to your database
```

## Architecture

```
app/
  (app)/            # authenticated workspace — shares the AppShell layout
    layout.tsx      # sidebar + top bar + command palette
    page.tsx        # home / general chat
  api/chat/route.ts # streaming chat endpoint (provider-agnostic)
  layout.tsx        # root: fonts, metadata, providers
  globals.css       # Tailwind v4 design system (oklch tokens)
  sign-in/  sign-up/  # Clerk auth pages (redirect home when auth is off)
  auth-provider.tsx   # optional ClerkProvider wrapper
proxy.ts              # route protection (Next 16 proxy convention)
components/
  ui/               # shadcn primitives
  layout/           # sidebar, top-bar, command-palette, app-shell, nav
features/
  chat/             # chat-panel, message-list, composer, empty-view
  documents/        # RAG upload / list manager
lib/
  ai/               # provider registry, prompts, embeddings, tools/
  auth/             # getCurrentUser (Clerk + guest fallback)
  db/               # Drizzle schema, client, conversation + document repos, migrations
  rag/              # extract (PDF/text), chunk, ingest pipeline
  config.ts  types.ts  brand.ts  events.ts  utils.ts
```

### AI capabilities

- **Tool calling** — the chat route assembles a tool set per request and runs
  multi-step (`stopWhen: stepCountIs(5)`): call a tool → read result → answer.
- **Web search** — a Tavily-backed tool, gated by `TAVILY_API_KEY` and the
  composer's "Web search" toggle.
- **RAG** — upload PDFs/text on the Documents page → extracted, chunked, and
  embedded (OpenAI) into Postgres + pgvector. A `searchDocuments` retrieval tool
  lets April ground answers in your documents and cite them. Tool usage is shown
  as pills in the chat.

### Design principles

- **One feature = one folder** under `features/`; pages stay thin.
- **Provider-agnostic AI** (`lib/ai/provider.ts`) — no vendor lock-in.
- **Centralized prompts** (`lib/ai/prompts.ts`) — each surface gives April a
  distinct posture while sharing one engine.
- Design tokens live only in `app/globals.css`; components never hardcode colors.

## Roadmap

- ✅ **Phase 1 — Working chat** with a provider-agnostic engine.
- ✅ **Phase 2 — Foundations:** optional Clerk auth, Postgres + Drizzle,
  conversation persistence, route protection.
- ✅ **Phase 3 — Multi-page features:** legal advice, contract
  drafting/analysis, and landing pages for documents/reports/templates/etc.
- ✅ **Phase 4 — Advanced AI:** tool calling, Tavily web search, and RAG
  document analysis (pgvector) with citations.
- **Phase 5 — Productionize:** billing/credits enforcement, rate limits,
  observability, CI.
