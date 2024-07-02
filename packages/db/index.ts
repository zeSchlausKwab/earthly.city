import { Pool } from 'postgres';

export const db = new Pool({
  user: 'earthly',
  password: 'earthlypassword',
  host: 'localhost',
  port: 5432,
  database: 'earthly_db',
});

export const schema = {
  // Define your schema here
};

export default {
  db,
  schema,
};
