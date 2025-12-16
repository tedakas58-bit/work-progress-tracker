import dotenv from 'dotenv';

// Load environment variables from backend directory
dotenv.config({ path: './backend/.env' });

// Import the database connection
import('./backend/src/database/db.js').then(async (dbModule) => {
  const pool = dbModule.default;
  await addWoredaRoles(pool);
}).catch(err => {
  console.error('Error importing database module:', err);
  process.exit(1);
});

async function addWoredaRoles(pool) {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Adding woreda sector roles...\n');
    
    // Update the role constraint to include woreda sector roles
    await client.query(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
      ALTER TABLE users ADD CONSTRAINT users_role_check 
      CHECK (role IN (
        'admin', 
        'main_branch', 
        'branch_user',
        'organization_sector', 
        'information_sector', 
        'operation_sector', 
        'peace_value_sector',
        'woreda_organization',
        'woreda_information', 
        'woreda_operation',
        'woreda_peace_value'
      ));
    `);
    
    console.log('✅ Woreda sector roles added successfully!');
    
    // Verify the constraint
    const constraintResult = await client.query(`
      SELECT constraint_name, check_clause
      FROM information_schema.check_constraints 
      WHERE constraint_name = 'users_role_check'
    `);
    
    if (constraintResult.rows.length > 0) {
      console.log('\n📋 Updated role constraint:');
      console.log(constraintResult.rows[0].check_clause);
    }
    
    console.log('\n🎯 New Woreda Sector Roles Available:');
    console.log('- woreda_organization (Woreda Organization Sector User)');
    console.log('- woreda_information (Woreda Information Sector User)');
    console.log('- woreda_operation (Woreda Operation Sector User)');
    console.log('- woreda_peace_value (Woreda Peace & Value Sector User)');
    
    console.log('\n📝 Admin can now create users with these roles for each woreda');
    
  } catch (error) {
    console.error('❌ Error adding woreda roles:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}