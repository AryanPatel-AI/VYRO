# VYRO

VYRO is an AI Social and Brand Platform. It provides a comprehensive ecosystem for managing social media brands, analytics, content generation via AI, scheduling, and managing sponsorships.

## Architecture

This repository is structured as a monorepo using [Turborepo](https://turbo.build/repo) and [pnpm](https://pnpm.io/) workspaces.

- **Frontend (`frontend/web`)**: Next.js application acting as the main interface and admin dashboard.
- **Backend API (`backend/api`)**: NestJS application serving as the core business logic, handling AI requests, social account integrations, and analytics.
- **Database (`backend/database`)**: Prisma ORM schema, migrations, and database access logic.
- **Shared Types (`packages/shared-types`)**: Shared TypeScript interfaces and types between the frontend and backend.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, TypeScript
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL (via Prisma ORM), Redis
- **Monorepo Tooling**: Turborepo, pnpm

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (v10+)
- PostgreSQL
- Redis

### Setup

1. Install dependencies from the root:
   ```bash
   pnpm install
   ```

2. Setup environment variables: Ensure you have your `.env` configured properly based on the `.env.example` file.

3. Setup the database schema:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

### Running the Application

To run all apps simultaneously in development mode:
```bash
pnpm run dev
```

Alternatively, you can run specific packages individually:
- Backend API: `pnpm --filter @vyro/api run dev`
- Frontend: `pnpm --filter web run dev`

### Useful Scripts

- `pnpm build`: Build all packages and apps.
- `pnpm lint`: Run linting across the monorepo.
- `pnpm type-check`: Run TypeScript type checking.
- `pnpm db:studio`: Open Prisma Studio to inspect the database.
