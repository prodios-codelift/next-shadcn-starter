# ============================================
# Stage 1: Dependencies Installation Stage
# ============================================

# This Dockerfile is configured for Bun (see bun.lock).
# Official Next.js standalone + Bun pattern:
# https://github.com/vercel/next.js/tree/canary/examples/with-docker

FROM oven/bun:1 AS dependencies

WORKDIR /app

COPY package.json bun.lock ./

RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install --no-save --frozen-lockfile

# ============================================
# Stage 2: Build Next.js application in standalone mode
# ============================================

FROM oven/bun:1 AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=true
# ENV NEXT_TELEMETRY_DISABLED=1

# public/ is optional in this repo; the runner COPY expects the directory.
RUN mkdir -p public

RUN bun run build

# ============================================
# Stage 3: Run Next.js standalone server
# ============================================

FROM oven/bun:1 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=bun:bun /app/public ./public

RUN mkdir .next && chown bun:bun .next

# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static

USER bun

EXPOSE 3000

CMD ["bun", "server.js"]
