import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Create a PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a drizzle instance using the pool
export const db = drizzle(pool);