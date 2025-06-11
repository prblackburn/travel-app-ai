import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase(): Promise<void> {
  try {
    console.log('Setting up database...');
    
    const db = new Database('travel-app.db');
    
    // Enable WAL mode for better concurrency
    db.pragma('journal_mode = WAL');
    
    // Read and execute the migration SQL
    const migrationPath = join(__dirname, 'migrations', '0000_naive_blindfold.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    // Split by statement breakpoint and execute each statement
    const statements = migrationSQL.split('--> statement-breakpoint');
    
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed) {
        db.exec(trimmed);
      }
    }
    
    db.close();
    console.log('✅ Database setup completed successfully');
    console.log('   - Tables created: trips, activities, packing_lists, packing_items');
    console.log('   - WAL mode enabled');
    console.log('   - Foreign key constraints established');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();