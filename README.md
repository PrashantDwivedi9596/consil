# Council — Privacy-Oriented Temporary Real-Time Communication Platform

Council (TempChat) is a major web application built for privacy-conscious real-time communication. It features invitation-only rooms, temporary data retention by default, explicit consent-governed persistence, uploader-controlled media downloads, and privacy-preserving device identity recognition.

---

## 🚀 Technology Stack

- **Frontend**: Next.js (App Router), React, TypeScript (Strict), Tailwind CSS, Zustand, TanStack Query, Socket.IO Client, PWA (Manifest & Service Worker).
- **Backend**: NestJS, TypeScript, REST APIs, Socket.IO Gateway, DTO Validation, Server-Side Authorization Guards.
- **Database & ORM**: PostgreSQL (Neon-hosted), Prisma ORM & Migrations.
- **Realtime & Ephemeral**: Redis (Pub/Sub, Rate Limiting, Ephemeral Presence), BullMQ (Background Grace Period Expiration & Idempotent Deletion Jobs).
- **Media Storage**: Cloudinary (Direct Browser Upload Intent, Signed URLs, Asset Metadata Tracking).
- **Testing**: Jest (NestJS unit & integration), Vitest (Shared packages / Frontend), Playwright (E2E browser integration).

---

## 🛠️ Prerequisites

- **Node.js**: v18.x or v20.x LTS
- **npm** or **pnpm**: v9+
- **PostgreSQL**: PostgreSQL 14+ instance (or Neon connection string)
- **Redis**: Redis 6+ instance
- **Cloudinary Account**: Cloud Name, API Key, API Secret

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` in the project root and fill in the required keys:

```env
# Database
DATABASE_URL="postgresql://user:password@ep-cool-site-123456.us-east-1.aws.neon.tech/council?sslmode=require"

# Redis
REDIS_URL="redis://localhost:6379"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Application Settings
NODE_ENV="development"
PORT=3001
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
JWT_SECRET="super-secret-jwt-key-change-in-production"
ROOM_GRACE_PERIOD_HOURS=24
DAILY_ROOM_CREATION_LIMIT=15
APPLICATION_TIMEZONE="UTC"
```

---

## 📦 Setup & Migration Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Run Migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Run Development Environment
```bash
# Start backend API (NestJS)
npm run dev --workspace=apps/api

# Start frontend (Next.js)
npm run dev --workspace=apps/web

# Or start all services concurrently:
npm run dev
```

---

## 🧪 Testing Commands

```bash
# Run unit & integration tests for backend
npm run test --workspace=apps/api

# Run shared library tests
npm run test --workspace=packages/shared

# Run Playwright End-to-End tests
npx playwright test
```

---

## 📜 Documentation & Recovery Files

- [`docs/requirements-traceability.md`](file:///d:/PROJECTS/Council/docs/requirements-traceability.md): Complete mapping of all SRS functional and non-functional requirements to implementation stages.
- [`PROJECT_STATUS.md`](file:///d:/PROJECTS/Council/PROJECT_STATUS.md): Current stage status, completed work, blockers, and next steps.
- [`IMPLEMENTATION_LOG.md`](file:///d:/PROJECTS/Council/IMPLEMENTATION_LOG.md): Stage-by-stage implementation history, changes, and verification.
- [`DECISIONS.md`](file:///d:/PROJECTS/Council/DECISIONS.md): Architectural decisions, schema definitions, and business logic specs.
- [`TEST_REPORT.md`](file:///d:/PROJECTS/Council/TEST_REPORT.md): Verified test run logs and coverage results.
