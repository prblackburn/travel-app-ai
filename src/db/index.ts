import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from './schema.js';

const client = createClient({
  url: 'file:travel-app.db',
});

export const db = drizzle(client, { schema });

export type Database = typeof db;

export * from './schema.js';
