import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://earthly:earthlypassword@localhost:5432/earthly_db',
});

export const db = drizzle(pool);

// Define your schema here
// Example:
// import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
// export const users = pgTable('users', {
//   id: serial('id').primaryKey(),
//   name: text('name'),
//   email: text('email'),
//   createdAt: timestamp('created_at').defaultNow(),
// });

export default {
  db,
  // Add your schema exports here
};
