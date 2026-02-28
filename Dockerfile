# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base

# Build the popser library (needed for web's "file:.." dependency)
FROM base AS lib
WORKDIR /repo
COPY package.json package-lock.json tsup.config.ts tsconfig.json ./
COPY src/ ./src/
RUN npm ci --ignore-scripts && npm run build

# Install web dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /repo
# Copy built library so file:.. resolves during npm ci
COPY --from=lib /repo/package.json ./package.json
COPY --from=lib /repo/dist/ ./dist/
# Copy web dependency files
COPY web/package.json web/package-lock.json web/source.config.ts ./web/
COPY web/next.config.mjs ./web/
WORKDIR /repo/web
RUN npm ci

# Build the web app
FROM base AS builder
WORKDIR /repo/web
COPY --from=deps /repo/web/node_modules ./node_modules
COPY web/ .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /repo/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
