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
| Data fetch | TanStack Query                                             |

## Getting started

```sh
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY (or OPENAI_API_KEY)
npm install
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Architecture

```
app/
  (app)/            # authenticated workspace — shares the AppShell layout
    layout.tsx      # sidebar + top bar + command palette
    page.tsx        # home / general chat
  api/chat/route.ts # streaming chat endpoint (provider-agnostic)
  layout.tsx        # root: fonts, metadata, providers
  globals.css       # Tailwind v4 design system (oklch tokens)
components/
  ui/               # shadcn primitives
  layout/           # sidebar, top-bar, command-palette, app-shell, nav
features/
  chat/             # chat-panel, message-list, composer, empty-view
lib/
  ai/               # provider registry + prompt library
  brand.ts  events.ts  utils.ts
```

### Design principles

- **One feature = one folder** under `features/`; pages stay thin.
- **Provider-agnostic AI** (`lib/ai/provider.ts`) — no vendor lock-in.
- **Centralized prompts** (`lib/ai/prompts.ts`) — each surface gives April a
  distinct posture while sharing one engine.
- Design tokens live only in `app/globals.css`; components never hardcode colors.

## Roadmap

- **Phase 2 — Foundations:** auth, Postgres + Drizzle, persist conversations.
- **Phase 3 — Multi-page features:** legal advice, contract drafting/analysis,
  documents, reports, templates, marketplace.
- **Phase 4 — Advanced AI:** RAG document analysis, tool calling, web search.
- **Phase 5 — Productionize:** billing/credits, rate limits, observability, CI.
