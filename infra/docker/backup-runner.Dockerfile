FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat curl postgresql-client openssl
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# Build stage
FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@agency/backup-service --filter=@agency/storage-service

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/packages/services/backup-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
COPY --from=builder /app/package.json ./package.json

CMD ["node", "dist/index.js"]
