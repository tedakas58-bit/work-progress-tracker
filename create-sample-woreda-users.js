import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables from backend directory
dotenv.config({ path: './backend/.env' });

// Import the database connection
import('./backend/src/database/db.js').then(async (dbModule) => {
  const pool = dbModule.default;
  await createSampleWoredaUsers(pool);
}).catch(err => {
  console.error('Error importing database module:', err);
  process.exit(1);
});

async function createSampleWoredaUsers(pool) {
  const client = await pool.connect();
  
  try {
    console.log('🏢 Creating sample woreda sector users...\n');
    
    // Hash password for all users (password: "woreda123")
    const hashedPassword = await bcrypt.hash('woreda123', 10);
    
    // Sample woreda users for demonstration
    const woredaUsers = [
      // Woreda 1 - All 4 sectors
      {
        username: 'woreda1_organization',
        role: 'woreda_organization',
        branch_name: 'Woreda 1',
        email: 'woreda1.org@example.com',
        sector: 'organization'
      },
      {
        username: 'woreda1_information',
        role: 'woreda_information',
        branch_name: 'Woreda 1',
        email: 'woreda1.info@example.com',
        sector: 'information'
      },
      {
        username: 'woreda1_operation',
        role: 'woreda_operation',
        branch_name: 'Woreda 1',
        email: 'woreda1.ops@example.com',
        sector: 'operation'
      },
      {
        username: 'woreda1_peace_value',
        role: 'woreda_peace_value',
        branch_name: 'Woreda 1',
        email: 'woreda1.peace@example.com',
        sector: 'peace_value'
      },
      
      // Woreda 2 - All 4 sectors
      {
        username: 'woreda2_organization',
        role: 'woreda_organization',
        branch_name: 'Woreda 2',
        email: 'woreda2.org@example.com',
        sector: 'organization'
      },
      {
        username: 'woreda2_information',
        role: 'woreda_information',
        branch_name: 'Woreda 2',
        email: 'woreda2.info@example.com',
        sector: 'information'
      },
      {
        username: 'woreda2_operation',
        role: 'woreda_operation',
        branch_name: 'Woreda 2',
        email: 'woreda2.ops@example.com',
        sector: 'operation'
      },
      {
        username: 'woreda2_peace_value',
        role: 'woreda_peace_value',
        branch_name: 'Woreda 2',
        email: 'woreda2.peace@example.com',
        sector: 'peace_value'
      }
    ];
    
    for (const user of woredaUsers) {
      try {
        await client.query(
          `INSERT INTO users (username, password, role, branch_name, email, sector) 
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (username) DO UPDATE SET
           role = EXCLUDED.role,
           branch_name = EXCLUDED.branch_name,
           email = EXCLUDED.email,
           sector = EXCLUDED.sector`,
          [user.username, hashedPassword, user.role, user.branch_name, user.email, user.sector]
        );
        console.log(`✅ Created/Updated user: ${user.username} (${user.role})`);
      } catch (err) {
        console.error(`❌ Error creating user ${user.username}:`, err.message);
      }
    }
    
    console.log('\n🎉 Sample woreda sector users created successfully!');
    console.log('\n📋 Login Credentials (Password: woreda123):');
    console.log('\n🏢 Woreda 1:');
    console.log('- Organization: woreda1_organization / woreda123');
    console.log('- Information: woreda1_information / woreda123');
    console.log('- Operation: woreda1_operation / woreda123');
    console.log('- Peace & Value: woreda1_peace_value / woreda123');
    
    console.log('\n🏢 Woreda 2:');
    console.log('- Organization: woreda2_organization / woreda123');
    console.log('- Information: woreda2_information / woreda123');
    console.log('- Operation: woreda2_operation / woreda123');
    console.log('- Peace & Value: woreda2_peace_value / woreda123');
    
    console.log('\n📝 Each woreda now has 4 sector-specific users!');
    console.log('📝 Admin can create more using the updated admin dashboard.');
    
  } catch (error) {
    console.error('❌ Error creating woreda users:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}