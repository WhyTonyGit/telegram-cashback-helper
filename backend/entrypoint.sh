#!/bin/sh
set -e

echo "Applying database migrations..."
bun run db:push

echo "Starting backend..."
exec bun run src/index.ts
