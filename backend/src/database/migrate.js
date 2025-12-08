import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Read and execute schema with IF NOT EXISTS checks
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    // Split by semicolons and execute each statement separately
    const statements = schema.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
        } catch (err) {
          // Ignore "already exists" errors
          if (err.code !== '42P07' && err.code !== '42710') {
            throw err;
          }
        }
      }
    }
    
    console.log('✅ Schema created successfully');
    
    // Create default users
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Main branch admin
    await pool.query(
      `INSERT INTO users (username, password, role, branch_name, email) 
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (username) DO NOTHING`,
      ['admin', hashedPassword, 'main_branch', 'Main Branch', 'admin@company.com']
    );
    
    // 10 Branch users
    for (let i = 1; i <= 10; i++) {
      await pool.query(
        `INSERT INTO users (username, password, role, branch_name, email) 
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT (username) DO NOTHING`,
        [`branch${i}`, hashedPassword, 'branch_user', `Branch ${i}`, `branch${i}@company.com`]
      );
    }
    
    console.log('✅ Default users created (password: admin123)');
    console.log('   - admin (Main Branch)');
    console.log('   - branch1 to branch10 (Branch Users)');
    
    await pool.end();
    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
