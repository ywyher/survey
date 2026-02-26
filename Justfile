dev:
  bun dev
generate:
  bunx drizzle-kit generate
migrate:
  bunx drizzle-kit migrate
migrate-prod:
  NODE_ENV=production bunx drizzle-kit migrate
push-prod:
  NODE_ENV=production bunx drizzle-kit push
studio:
  bunx drizzle-kit studio