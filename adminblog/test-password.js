import bcrypt from 'bcryptjs';

async function testPassword() {
  try {
    console.log('🔍 Testing password hash for user jules...');
    
    const password = 'jules123';
    const storedHash = '$2a$10$YourStoredHashHere'; // We'll get this from the database
    
    console.log('Password to test:', password);
    console.log('Stored hash:', storedHash);
    
    // Test if the password matches
    const isMatch = await bcrypt.compare(password, storedHash);
    console.log('Password match:', isMatch);
    
    // Create a new hash for comparison
    const newHash = await bcrypt.hash(password, 10);
    console.log('New hash created:', newHash);
    
    // Test the new hash
    const newHashMatch = await bcrypt.compare(password, newHash);
    console.log('New hash match:', newHashMatch);
    
  } catch (error) {
    console.error('❌ Error testing password:', error);
  }
}

testPassword();


