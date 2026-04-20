# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
RUN npm run build

# --- Stage 2: Production runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

RUN apk add --no-cache openssl

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone Next.js output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema + migrations
COPY --from=builder /app/prisma ./prisma
# Copy ALL node_modules (Prisma needs WASM files scattered across node_modules)
COPY --from=builder /app/node_modules ./node_modules

# Fix permissions
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data && \
    chown -R nextjs:nodejs /app/node_modules/.prisma

USER nextjs
EXPOSE 3000

# Run migrations then start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
