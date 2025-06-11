import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

const sqlite = new Database('travel-app.db');

// Enable WAL mode for better concurrency
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

export type Database = typeof db;

export * from './schema.js';