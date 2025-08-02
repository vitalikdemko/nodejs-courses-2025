# NestJS Kafka with Redis Retry

This is a simple NestJS app that sends events to Kafka when a user signs up. If Kafka consumer is unavailable, events are stored in Redis for retry.

## Prerequisites

- Node.js & npm
- Docker (for Kafka, Zookeeper, Redis)

## Installation

```bash
npm install
```

## Running Services

```bash
docker-compose up -d  # Kafka, Zookeeper
docker run -d -p 6379:6379 redis:latest
```

## Start the App

```bash
npm run start:dev
```

## Test Signup Event

```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

## Simulate Retry

1. Comment out `connectMicroservice()` in `main.ts`
2. Restart the app
3. Send signup again (event goes to Redis)
4. Run retry worker:

```bash
npx ts-node src/retry/retry.worker.ts
```

You should see the event printed from Redis.