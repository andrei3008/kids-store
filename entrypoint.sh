#!/bin/sh
set -e

# Ensure data directory exists with correct permissions
mkdir -p /app/data
chown nextjs:nodejs /app/data

# Run migrations as nextjs user, then start app
exec su-exec nextjs sh -c "prisma migrate deploy && node server.js"
