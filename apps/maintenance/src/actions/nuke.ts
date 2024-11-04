import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const { Client } = pg;

export async function deleteAllFromRelay() {

  
  const connectionString = `postgresql://khatru:khatrupassword@localhost:5433/khatru_db?sslmode=disable`;

  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to database');
    
    // Delete all data from each tablea
    await client.query('TRUNCATE event CASCADE');
    console.log('All data deleted from features, communities, and reactions tables');

  } catch (error) {
    console.error('Error deleting data:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}