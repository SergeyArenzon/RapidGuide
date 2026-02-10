# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HuddleHub (package scope: `@rapid-guide-io/`) is a tour-guide booking platform built as a microservices monorepo deployed on Kubernetes with Helm and Skaffold.

## Architecture

**Services** (each with its own PostgreSQL database):
- `services/auth` — NestJS. Authentication via Better-auth library, JWT token management
- `services/profile` — NestJS. User profiles, guides, cities, countries, languages, categories
- `services/tour` — NestJS. Tour CRUD and guide availability calendar
- `services/reservation` — NestJS. Booking management with double-booking prevention
- `services/notification` — **Go** (Gin). Consumes RabbitMQ events, delivers via email/SMS/WebSocket
- `services/client` — React 19 frontend (Vite, TanStack Router + Query, Shadcn UI, Tailwind)

**Shared packages** (`/shared/`): Contracts (Zod DTOs), decorators, guards (JWT auth), interceptors, pipes, Redis utilities. Published under `@rapid-guide-io/` scope.

**Communication**: Services communicate via REST and RabbitMQ (AMQP). The notification service consumes from a `notifications` queue. WebSocket (`/ws`) pushes in-app notifications to the frontend.

**Infrastructure** (`/k8s/helm/`): Helm charts for each service, per-service databases, gateway, ingress-nginx, RabbitMQ, Redis, secrets.

## Development Commands

### Local Kubernetes development
```bash
skaffold dev                    # Build, deploy, and live-sync all services
```
Skaffold uses `Dockerfile.dev` for NestJS services (hot-reload) and syncs `src/**/*.ts` changes without rebuild.

### NestJS services (auth, profile, tour, reservation)
```bash
cd services/<service>
pnpm run start:dev              # Dev server with hot-reload
pnpm run build                  # Production build
pnpm run test                   # Jest unit tests
pnpm run test:e2e               # End-to-end tests
pnpm run lint                   # ESLint with auto-fix
pnpm run format                 # Prettier
pnpm run migration:up           # Run pending Mikro-ORM migrations
pnpm run migration:fresh        # Drop and re-run all migrations
pnpm run db:seed                # Seed database
pnpm run schema:update          # Sync schema to database
```

### Client (React frontend)
```bash
cd services/client
pnpm run dev                    # Vite dev server (port 3000)
pnpm run build                  # Production build
pnpm run test                   # Vitest
pnpm run check                  # Format + lint
pnpm run storybook              # Storybook (port 6006)
```

### Notification service (Go)
```bash
cd services/notification
go run .
```

### RabbitMQ Management UI
Port-forwarded by Skaffold to `http://localhost:15672` (admin/admin).

## Key Conventions

- **Package manager**: pnpm
- **ORM**: Mikro-ORM with PostgreSQL for all NestJS services; each service owns its database
- **Auth pattern**: Better-auth library + JWT. Shared `JwtAuthGuard` validates audience per-service. JWT payload types in `shared/jwt-token-payload/`
- **NestJS structure**: Controllers → Services → Repositories with dependency injection. Feature modules per domain entity
- **Client UI**: Always use Shadcn components (`pnpx shadcn@latest add <component>`) and lucide-react icons. Do NOT add `"use client"` directives (not a Next.js app). React Compiler is enabled
- **Validation**: Zod schemas in `shared/contracts/` define API boundaries between services
- **RabbitMQ messages**: JSON with `user_id`, `channels[]`, `template`, `subject`, `data` fields (see `services/notification/DESIGN.md`)
- **Git branches**: Feature branches prefixed with ticket ID (e.g., `RAG-73-notification-svc`)
- **Shared package updates**: GitHub Action (`update-shared-version.yml`) auto-updates shared dependency versions across services when `shared/*/package.json` changes
- **Secrets**: Kubernetes secrets created from `.env` files in `k8s/helm/secrets/` and `k8s/helm/auth/templates/` (loaded by Skaffold pre-deploy hook)
