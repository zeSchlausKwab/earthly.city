import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema/schema'

const pool = new Pool({
  connectionString: process.env.EARTHLY_DB_URL || 'postgresql://earthly:earthlypassword@localhost:5432/earthly_db',
})

export const db = drizzle(pool)

export * from 'drizzle-orm'
export { schema }
