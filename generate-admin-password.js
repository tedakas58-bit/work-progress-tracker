// Generate fresh password hash for admin user
import bcrypt from 'bcryptjs';

async function generatePasswordHash() {
  const password = 'admin123';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('Hash:', hash);
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash validation:', isValid ? 'VALID' : 'INVALID');
    
    console.log('\nSQL to update admin user:');
    console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

generatePasswordHash();