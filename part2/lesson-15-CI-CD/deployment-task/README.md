# NestJS CI/CD Deployment Task

This project is a minimal NestJS app used for CI/CD practice and schema checks with TypeORM.

## Completed Requirements

- Dockerized PostgreSQL database (`docker-compose.yml`)
- TypeORM `UserEntity` + `data-source.ts`
- `.env` with PostgreSQL config
- `schema:log` and `schema:sync` scripts (via `ts-node`)
- `schema-check.cjs` script to detect schema drift
- Build and run scripts:
  - `pnpm run build`
  - `pnpm run start`
  - `pnpm run schema:log`
  - `pnpm run schema:sync`
  - `pnpm run schema:check`
- App responds with "Hello World!" at `http://localhost:3000`

## Scripts

```bash
pnpm run build         # Compile TypeScript -> dist/
pnpm run start         # Run built app (dist/main.js)
pnpm run start:dev     # Run in dev mode (watch)
pnpm run schema:log    # Show SQL schema changes
pnpm run schema:sync   # Apply schema changes
pnpm run schema:check  # Fail if schema drift is detected
```

## Run PostgreSQL

```bash
docker-compose up -d
```

## Access

```http
GET http://localhost:3000/
# → Hello World!
```

## How to Verify

1. Run `docker-compose up -d`
2. Run `pnpm install`
3. Run `pnpm run schema:sync`
4. Run `pnpm run build`
5. Run `pnpm run start`
6. Open `http://localhost:3000` → "Hello World!"
