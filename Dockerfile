# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# --- Stage 2: Production runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

RUN apk add --no-cache openssl

# Copy standalone Next.js output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy ALL node_modules (needed for seed)
COPY --from=builder /app/node_modules ./node_modules

# Copy Prisma schema and migrations
COPY --from=builder /app/prisma ./prisma

# Install Prisma CLI + tsx globally
RUN npm install -g prisma@6 tsx

# Create data directory for persistent SQLite
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["sh", "-c", "prisma migrate deploy && node server.js"]
