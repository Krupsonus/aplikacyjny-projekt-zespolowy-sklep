# TechShop — Backend API

Node.js / Express REST API with TypeScript, Prisma ORM, and Swagger documentation.

## Tech stack

| Tool | Purpose |
|------|---------|
| Node.js 20 | Runtime |
| Express 4 | HTTP framework |
| TypeScript 5 | Type safety |
| Prisma 5 | Database ORM / type generation |
| PostgreSQL 16 | Database (managed by `db/` layer) |
| swagger-jsdoc + swagger-ui-express | Auto-generated API docs |
| tsx | TypeScript hot-reload in development |

## Structure

```
backend/
├── prisma/
│   └── schema.prisma      — Prisma models (mirrors db/init/01_schema.sql)
├── src/
│   ├── lib/
│   │   └── prisma.ts      — Prisma client singleton
│   ├── middleware/
│   │   └── errorHandler.ts — AppError class + Express error middleware
│   ├── routes/
│   │   ├── categories.ts  — GET /api/categories
│   │   └── products.ts    — GET /api/products, GET /api/products/:id
│   └── app.ts             — Express setup, Swagger config, server start
├── .env.example           — Template for local development
├── Dockerfile
├── package.json
└── tsconfig.json
```

## API Endpoints (Sprint 1)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/categories` | List all categories |
| GET | `/api/products` | Paginated product list (filters: `?category=slug&page=1&limit=12`) |
| GET | `/api/products/:id` | Single product detail |
| GET | `/api-docs` | Swagger UI |

## Running via Docker Compose (recommended)

```bash
# From repo root — starts DB + Backend
docker compose up --build

# Logs only
docker compose logs -f backend
```

## Running locally (outside Docker)

```bash
cd backend

# 1. Copy env template
cp .env.example .env
# Edit .env if your local DB credentials differ

# 2. Install dependencies
npm install

# 3. Generate Prisma client
npm run db:generate

# 4. Start dev server (hot reload)
npm run dev
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | — | PostgreSQL connection string |
| `PORT` | `3001` | HTTP port |
| `NODE_ENV` | `development` | Environment mode |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |

## Prisma note

This project uses **raw SQL** in `db/init/` for schema management (not Prisma Migrate).
`schema.prisma` is used **only** to generate the typed Prisma Client.

If the DB schema changes (new sprint), update `schema.prisma` and run:
```bash
docker compose exec backend npm run db:generate
```
