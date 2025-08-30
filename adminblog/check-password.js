import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkPassword() {
  try {
    const dbPath = path.join(__dirname, '../database', 'mad2moi_blog.sqlite');
    console.log('🔍 Checking password hash for user jules...');
    
    const db = await open({ filename: dbPath, driver: sqlite3.Database });
    
    // Get the stored password hash
    const user = await db.get('SELECT password_hash FROM users WHERE username = ?', ['jules']);
    
    if (user) {
      console.log('✅ User jules found');
      console.log('Stored password hash:', user.password_hash);
      
      // Test if the password matches
      const password = 'jules123';
      const isMatch = await bcrypt.compare(password, user.password_hash);
      console.log('Password "jules123" matches stored hash:', isMatch);
      
      // Create a new hash for comparison
      const newHash = await bcrypt.hash(password, 10);
      console.log('New hash for "jules123":', newHash);
      
      // Test the new hash
      const newHashMatch = await bcrypt.compare(password, newHash);
      console.log('New hash test:', newHashMatch);
      
    } else {
      console.log('❌ User jules not found!');
    }
    
    await db.close();
    
  } catch (error) {
    console.error('❌ Error checking password:', error);
  }
}

checkPassword();
