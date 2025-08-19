# Mini Auth API

Simple NestJS project for homework #19.

## Requirements
- Node.js 18+
- pnpm

## Setup
1) Install dependencies:
   ```bash
   pnpm install
   ```

2) Create a `.env` file in the project root:
   ```
   PORT=3000
   JWT_ACCESS_SECRET=super-access-secret
   JWT_REFRESH_SECRET=super-refresh-secret
   ```

## Run
```bash
pnpm start:dev
```

## Endpoints
- `POST /auth/login` — JSON `{email, password}` or Basic Auth
- `POST /auth/refresh` — body `{refreshToken}`
- `GET /auth/profile` — requires `Authorization: Bearer <accessToken>`
- `GET /admin/metrics` — requires admin role

Demo users:
- `demo@example.com / P@ssw0rd!` (role: user)
- `admin@example.com / P@ssw0rd!` (role: admin)
