# 💾 ACID Lab — PostgreSQL + NestJS + Transactions

This project is a simple demonstration of ACID properties in PostgreSQL using NestJS and TypeORM.

---

## 🧪 Level 1 — Atomic Money Transfer

### ✅ What it does:
- Transfers money from one account to another using a database transaction.
- If the sender doesn’t have enough money, the transfer is rejected.
- No partial changes are saved (atomicity is preserved).

### 📦 API

#### `POST /transfer`
```json
{
  "fromId": "uuid",
  "toId": "uuid",
  "amount": 100
}
```

- ❌ Returns 400 if balance is not enough
- ✅ Creates a movement record if successful

### 🧪 Test

Run the e2e test to check that:
- The transfer is rejected when balance is not enough.
- The database remains unchanged.

```bash
pnpm test:e2e
```

---

## 🔁 Level 2 — Parallel Writer & Reader (Read Phenomena)

### ✅ What it does:
- Simulates **concurrent updates** using `writer.ts`.
- Simulates **reading during updates** using `reader.ts`.

You can observe:
- Dirty reads
- Non-repeatable reads
- Phantom reads

### 🔄 Run demo:

```bash
pnpm demo
```

This will:
- Run `writer.ts` and `reader.ts` in parallel using child processes.
- Print operations to the console to show how concurrent reads and writes behave.

---

## 🐳 PostgreSQL Setup with Docker

Start the DB:
```bash
pnpm db:up
```

Apply schema (includes account & movement tables):
```bash
pnpm db:migrate
```

Stop containers:
```bash
pnpm db:down
```

---

## 📁 Folder Structure

```
src/
├── transfer/
│   ├── transfer.service.ts
│   ├── controller.ts
│   ├── entities/
│   │   ├── account.entity.ts
│   │   └── movement.entity.ts
├── demo/
│   ├── demo.ts
│   ├── writer.ts
│   └── reader.ts
```

