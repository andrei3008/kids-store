#!/bin/sh
# Run this inside the container to seed the database:
# docker exec kids-store sh /app/seed-prod.sh

echo "Seeding production database..."
npx tsx prisma/seed.ts
echo "Done!"
