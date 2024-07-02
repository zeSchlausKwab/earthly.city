import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://earthly:earthlypassword@localhost:5432/earthly_db',
  },
  migrations: {
    table: 'migrations',
    schema: 'public'
  }
} satisfies Config;

