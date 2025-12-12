import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configure SSL for Supabase or other cloud databases
const sslConfig = process.env.DB_SSL === 'true' ? {
  rejectUnauthorized: false
} : false;

// Support both individual env vars and DATABASE_URL
const pool = new Pool(
  process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: sslConfig,
  } : {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: sslConfig,
  }
);

pool.on('connect', () => {
  console.log('✅ Database connected');
  console.log(`📍 Connected to: ${process.env.DB_HOST}`);
});

pool.on('error', (err) => {
  console.error('❌ Database error:', err);
});

export default pool;
