# Zipper - Async Image Thumbnail Generator

This project demonstrates asynchronous processing using Node.js worker threads within a NestJS application. It extracts images from a ZIP file and generates thumbnails in parallel using `sharp`.

## Features

- Upload `.zip` archive via HTTP POST
- Extracts and processes image files (`.jpg`, `.jpeg`, `.png`)
- Creates thumbnails (150px width) using worker threads
- Uses `Mutex` to safely update shared counters
- Tracks number of `processed` and `skipped` images
- Returns timing and stats in JSON response

## Technologies

- NestJS
- Worker Threads
- Sharp
- Multer
- Adm-Zip
- Mutex (`async-mutex`)

## How to Run

```bash
pnpm install
pnpm start
