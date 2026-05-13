# =============================================================================
# TechShop Backend — multi-stage Dockerfile
# Development: docker compose uses `target: development` with src volume mount
# Production:  docker build --target production
# =============================================================================

# ── Stage 1: dependencies + Prisma client ─────────────────────────────────────
FROM node:20-alpine AS development
WORKDIR /app

# OpenSSL is required by the Prisma query engine native library
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

# Generate Prisma client from schema (needed before app can start)
COPY prisma ./prisma
RUN npx prisma generate

# In development, source code is mounted as a volume from the host — no COPY src
EXPOSE 3001
CMD ["npm", "run", "dev"]


# ── Stage 2: compile TypeScript ───────────────────────────────────────────────
FROM development AS builder
COPY src ./src
COPY tsconfig.json ./
RUN npm run build


# ── Stage 3: minimal production image ─────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl

COPY --from=builder /app/dist          ./dist
COPY --from=builder /app/node_modules  ./node_modules
COPY --from=builder /app/prisma        ./prisma
COPY package*.json ./

EXPOSE 3001
CMD ["npm", "run", "start"]
