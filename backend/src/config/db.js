import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err);
});

export default pool;