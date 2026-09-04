import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connection credentials provided by user: localhost, password root
const password = process.env.DB_PASSWORD || 'root';
const user = process.env.DB_USER || 'postgres';
const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '5432', 10);
const dbName = process.env.DB_NAME || 'astrology';

async function runMigrations() {
  console.log(`🔌 Connecting to PostgreSQL at ${host}:${port} as ${user}...`);

  // 1. Initial connection to default 'postgres' database to ensure 'astrology' DB exists
  const rootClient = new pg.Client({ user, password, host, port, database: 'postgres' });
  try {
    await rootClient.connect();
    const dbCheck = await rootClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (dbCheck.rows.length === 0) {
      console.log(`📦 Creating database '${dbName}'...`);
      await rootClient.query(`CREATE DATABASE "${dbName}"`);
    } else {
      console.log(`✅ Database '${dbName}' exists.`);
    }
  } catch (err) {
    console.log(`⚠️ Root DB connection note: ${err.message}`);
  } finally {
    await rootClient.end();
  }

  // 2. Connect to 'astrology' database & execute migration
  const dbClient = new pg.Client({ user, password, host, port, database: dbName });
  try {
    await dbClient.connect();
    console.log(`🚀 Executing migration 001_initial_schema.sql...`);
    const sqlPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await dbClient.query(sql);
    console.log(`🎉 Master Database Schema successfully initialized!`);

    // Verify feature flags
    const res = await dbClient.query(`SELECT key, enabled FROM feature_flags`);
    console.log(`🚩 Initial Feature Flags:`, res.rows);
  } catch (err) {
    console.error(`❌ Migration failed:`, err.message);
  } finally {
    await dbClient.end();
  }
}

runMigrations();
