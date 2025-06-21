# Redis-like KV Store with Docker

This project implements a minimal Redis-like key-value store and a KV server that interacts with it over HTTP. Both services run in isolated containers using Docker Compose.

## Features

- `redis-like`: a basic in-memory key-value store (GET/SET endpoints)
- `kv-server`: exposes a public HTTP API that communicates with `redis-like`

## API

### Set value

```
POST http://localhost:8080/kv
Content-Type: application/json

{
  "key": "name",
  "value": "Vitalik"
}
```

### Get value

```
GET http://localhost:8080/kv?key=name
```

**Response:**
```json
{ "value": "Vitalik" }
```

## Getting Started

1. Build and start the services:

```bash
docker-compose up --build
```

2. Test the API using Postman or curl.

## Project Structure

```
.
├── kv-server/       # External HTTP API (port 8080)
├── redis-like/      # Internal KV service (port 4000)
└── docker-compose.yml
```

## Requirements

- Docker
- Docker Compose

## License

MIT
