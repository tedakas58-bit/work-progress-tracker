import bcrypt from 'bcrypt';

async function generateHash() {
  try {
    const password = 'sector123';
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nUse this hash in your SQL script:');
    console.log(`'${hash}'`);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();