# Simple ORM Example (TypeScript + PostgreSQL)

This project shows a minimal generic ORM implementation in TypeScript using PostgreSQL and `sql-template-strings`.

## 📁 Project Structure

```
src/
├── orm/orm.ts                 # Generic ORM<T> class with basic CRUD
├── repositories/user.repo.ts # Repository for the "users" table
└── demo.ts                    # Script that runs all CRUD operations
```

## 🚀 Local Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root with:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/orm_demo
```

3. Start PostgreSQL manually or using Docker.

4. Run the demo:
```bash
npm run demo
```

## 🐳 Run with Docker

```bash
docker-compose up --build
```

This will start PostgreSQL and run the demo script.

## ✅ ORM Methods

- `find(filters?)`
- `findOne(id)`
- `save(entity)`
- `update(id, patch)`
- `delete(id)`
