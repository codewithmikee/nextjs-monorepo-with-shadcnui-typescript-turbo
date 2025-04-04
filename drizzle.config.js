/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema: './server/schema/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || '',
  },
};
