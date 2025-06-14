
# Habit Tracker CLI

A simple command-line habit tracker application written in pure Node.js. It uses no external libraries and follows a clear layered architecture (`router`, `controllers`, `services`, `models`).

---

## Installation

```bash
npm install
```

---

## Usage

Run commands via:

```bash
node index.js <command> [options]
```

---

## Available Commands

| Command   | Example                                                | Description                          |
|-----------|--------------------------------------------------------|--------------------------------------|
| `add`     | `node index.js add --name "Read Bible" --freq daily`   | Add a new habit                      |
| `list`    | `node index.js list`                                    | Show all habits in a table           |
| `done`    | `node index.js done --id <id>`                          | Mark a habit as done for today       |
| `update`  | `node index.js update --id <id> --name "New Name"`     | Update a habit's name or frequency   |
| `delete`  | `node index.js delete --id <id>`                        | Delete a habit                       |
| `stats`   | `node index.js stats`                                   | View % completion over last 7 days   |

---

## Date Offset Testing

You can simulate other dates by using the `DATE_OFFSET` environment variable.

#### PowerShell:
```powershell
$env:DATE_OFFSET = -1
node index.js done --id <id>
```

#### CMD:
```cmd
set DATE_OFFSET=-1 && node index.js done --id <id>
```

---

## Linting

```bash
npm run lint
npm run lint:fix
```