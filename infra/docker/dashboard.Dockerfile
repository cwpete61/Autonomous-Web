FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat curl
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# Build stage
FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@agency/dashboard

# Production
FROM base AS runner
ENV NODE_ENV=production

COPY --from=builder /app/apps/dashboard/.next/standalone ./
COPY --from=builder /app/apps/dashboard/.next/static ./apps/dashboard/.next/static

EXPOSE 3000
WORKDIR /app
CMD ["node", "apps/dashboard/server.js"]
