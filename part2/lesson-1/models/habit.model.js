
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../database.json');

export function readDatabase() {
  try {
    const content = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export function writeDatabase(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}