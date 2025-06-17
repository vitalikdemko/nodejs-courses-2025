# User Management API

A simple Node.js API for managing users. The project is structured with separated routes, services, and a JSON-based database.

## Installation

```bash
npm install
```

## Running the App

```bash
npm start
```

or

```bash
node index.js
```

## API Endpoints

- `GET /users` — Get all users
- `GET /users/:id` — Get a user by ID
- `POST /users` — Create a new user
- `PUT /users/:id` — Update a user
- `DELETE /users/:id` — Delete a user

Data is stored in `database.json`

## Configuration

```
PORT=3000
```

## Project Structure

- `routes/` — Route definitions
- `services/` — Business logic
- `lib/router.js` — Main router setup
- `database.json` — JSON-based data storage