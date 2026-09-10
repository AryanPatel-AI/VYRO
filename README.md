# VYRO

> **VYRO is an AI-powered Social & Brand Management Platform currently in active development.**

VYRO is a full-stack AI Social and Brand Platform designed to provide a unified ecosystem for managing social media brands, generating content with AI, analyzing performance, scheduling posts, and managing sponsorships.

The project is currently **under active development**, with the core architecture, backend services, database layer, and frontend being built and integrated progressively.

## 🚧 Project Status

**VYRO is currently in working development mode.**

The core application is actively being developed and tested. Features are being implemented incrementally across the frontend, backend, AI engine, social integrations, analytics, and database layers.

> ⚠️ VYRO is not yet considered production-ready. APIs, database schemas, features, and internal architecture may change during development.

### Current Development Areas

* ✅ Monorepo architecture
* ✅ Next.js frontend
* ✅ NestJS backend API
* ✅ PostgreSQL + Prisma database
* ✅ Redis infrastructure
* 🚧 AI content generation
* 🚧 AI brand/content intelligence
* 🚧 Social media integrations
* 🚧 Analytics and insights
* 🚧 Content scheduling
* 🚧 Sponsorship management
* 🚧 AI engine
* 🚧 Authentication and authorization
* 🚧 Admin dashboard
* 🚧 Production deployment

---

# Architecture

VYRO is structured as a **monorepo** using [Turborepo](https://turbo.build/repo) and [pnpm](https://pnpm.io/) workspaces.

```text
VYRO
│
├── frontend/
│   └── web/                  # Next.js frontend & dashboard
│
├── backend/
│   ├── api/                  # NestJS backend API
│   └── database/             # Prisma schema & database layer
│
├── packages/
│   └── shared-types/         # Shared TypeScript types
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Applications & Packages

### Frontend — `frontend/web`

The main web application and dashboard built with:

* Next.js
* React
* TypeScript
* Tailwind CSS

The frontend provides the user interface for managing brands, social accounts, content, analytics, scheduling, and other VYRO functionality.

### Backend API — `backend/api`

The core business logic is powered by **NestJS**.

The backend is responsible for:

* REST APIs
* Authentication
* AI requests
* Social media integrations
* Content management
* Scheduling
* Analytics
* Brand management
* Sponsorship management
* Background processing
* Business logic

### Database — `backend/database`

Database management is handled using **PostgreSQL** and **Prisma ORM**.

This layer contains:

* Prisma schema
* Database models
* Migrations
* Database access logic
* Generated Prisma client

### Shared Types — `packages/shared-types`

Shared TypeScript types and interfaces used across the frontend and backend.

This helps maintain type consistency across the entire application.

---

# Core Platform

VYRO is being designed around several major capabilities.

## 🤖 AI Content Generation

AI-powered tools for:

* Social media captions
* Content ideas
* Content rewriting
* Brand-aware content
* Platform-specific content
* Content repurposing
* AI-assisted social strategies

## 🎨 Brand Management

Manage brand identity and content intelligence including:

* Brand profiles
* Brand voice
* Content guidelines
* Brand information
* Content strategy
* Social presence

## 📱 Social Media Management

VYRO is being built to provide centralized management for social platforms, including:

* Social account connections
* Content publishing
* Post management
* Scheduling
* Platform-specific content
* Social analytics

## 📊 Analytics

Analytics infrastructure for understanding:

* Post performance
* Engagement
* Reach
* Audience growth
* Content performance
* Social trends
* Brand performance

## 📅 Content Scheduling

Plan and schedule social media content through a centralized content calendar.

Planned capabilities include:

* Scheduled posts
* Content calendar
* Publishing queues
* Automated publishing
* Scheduling workflows
* Post status tracking

## 🤝 Sponsorship Management

VYRO is also being designed to help brands and creators manage sponsorship workflows.

Potential capabilities include:

* Sponsorship opportunities
* Campaign management
* Brand partnerships
* Sponsorship tracking
* Deliverables
* Campaign analytics

---

# Tech Stack

## Frontend

* Next.js
* React
* Tailwind CSS
* TypeScript

## Backend

* NestJS
* Node.js
* TypeScript

## Database

* PostgreSQL
* Prisma ORM

## Infrastructure

* Redis
* Turborepo
* pnpm

## Architecture

```text
                 ┌─────────────────────┐
                 │      Next.js        │
                 │      Frontend       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      NestJS API     │
                 │      Backend        │
                 └──────────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
       ┌────────────┐ ┌───────────┐ ┌────────────┐
       │ PostgreSQL │ │   Redis   │ │ AI Engine  │
       │   Prisma   │ │   Queue   │ │   Services │
       └────────────┘ └───────────┘ └────────────┘
```

---

# Getting Started

## Prerequisites

Make sure you have the following installed:

* Node.js `18+`
* pnpm `10+`
* PostgreSQL
* Redis

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd VYRO
```

Install dependencies from the root:

```bash
pnpm install
```

## Environment Variables

Create your environment configuration based on the provided example:

```bash
cp .env.example .env
```

Configure the required environment variables for:

* PostgreSQL
* Redis
* Authentication
* AI services
* Social media APIs
* Other external services

## Database Setup

Generate the Prisma client:

```bash
pnpm db:generate
```

Run database migrations:

```bash
pnpm db:migrate
```

To inspect the database using Prisma Studio:

```bash
pnpm db:studio
```

---

# Running the Project

Run the complete monorepo in development mode:

```bash
pnpm run dev
```

Or run individual applications.

### Backend

```bash
pnpm --filter @vyro/api run dev
```

### Frontend

```bash
pnpm --filter web run dev
```

---

# Useful Commands

Build the entire project:

```bash
pnpm build
```

Run linting:

```bash
pnpm lint
```

Run TypeScript type checking:

```bash
pnpm type-check
```

Generate Prisma client:

```bash
pnpm db:generate
```

Run database migrations:

```bash
pnpm db:migrate
```

Open Prisma Studio:

```bash
pnpm db:studio
```

---

# Development

VYRO is being developed as a modular platform so individual services and packages can evolve independently while sharing common types and infrastructure.

The development workflow generally follows:

```text
Feature
   ↓
Frontend
   ↓
NestJS API
   ↓
Business Logic
   ↓
Database / Redis / AI Services
   ↓
External APIs
```

The project is currently focused on building a stable foundation before moving toward production deployment.

---

# Roadmap

### Foundation

* [x] Monorepo setup
* [x] Turborepo configuration
* [x] pnpm workspaces
* [x] Next.js application
* [x] NestJS API
* [x] PostgreSQL
* [x] Prisma
* [x] Redis
* [x] Shared TypeScript types

### Core Platform

* [ ] Authentication
* [ ] User management
* [ ] Brand management
* [ ] Social account management
* [ ] Content management
* [ ] AI content generation
* [ ] Content calendar
* [ ] Post scheduling
* [ ] Analytics

### Advanced Features

* [ ] AI brand intelligence
* [ ] Content repurposing
* [ ] AI recommendations
* [ ] Social inbox
* [ ] Sponsorship management
* [ ] Campaign management
* [ ] Advanced analytics
* [ ] AI social assistant

### Production

* [ ] Automated testing
* [ ] CI/CD
* [ ] Production infrastructure
* [ ] Monitoring
* [ ] Error tracking
* [ ] Security hardening
* [ ] Performance optimization
* [ ] Production release

---

# Contributing

VYRO is currently under active development.

As the architecture and APIs are still evolving, contribution guidelines and development conventions may change as the project matures.

If you would like to contribute, please open an issue or submit a pull request.

---

# License

License information will be added as the project approaches its public release.

---

👨‍💻 Developer

Aryan Patel

VYRO is designed, developed, and maintained by Aryan Patel.

## VYRO

**AI-powered tools for the next generation of social and brand management.**

> **Status: 🟢 Active Development**
>
> VYRO is currently being actively built, tested, and improved. The project is not yet production-ready, but the core platform architecture is operational and development is ongoing.
