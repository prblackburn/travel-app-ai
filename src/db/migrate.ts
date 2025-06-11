import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './index.js';

async function runMigrations(): Promise<void> {
  try {
    console.log('Running database migrations...');
    migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();