import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('backend/src/data/db.json');

const initialState = {
  users: [],
  leads: [],
  workflows: [],
  runs: [],
  notifications: []
};

function ensureDb() {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(initialState, null, 2));
  }
}

export function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

export function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function withDb(updater) {
  const db = readDb();
  const updated = updater(db) || db;
  writeDb(updated);
  return updated;
}
