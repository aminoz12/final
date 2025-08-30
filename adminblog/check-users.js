import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkUsers() {
  try {
    const dbPath = path.join(__dirname, '../database', 'mad2moi_blog.sqlite');
    console.log('🔍 Checking users table in:', dbPath);
    
    const db = await open({ filename: dbPath, driver: sqlite3.Database });
    
    // Check table structure
    console.log('\n📋 Users table structure:');
    const tableInfo = await db.all('PRAGMA table_info(users)');
    tableInfo.forEach(col => {
      console.log(`  ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    // Check if jules user exists
    console.log('\n👤 Checking for user jules:');
    const julesUser = await db.get('SELECT * FROM users WHERE username = ?', ['jules']);
    
    if (julesUser) {
      console.log('✅ User jules found:', {
        id: julesUser.id,
        username: julesUser.username,
        email: julesUser.email,
        role: julesUser.role,
        is_active: julesUser.is_active
      });
    } else {
      console.log('❌ User jules NOT found!');
      
      // Show all users
      const allUsers = await db.all('SELECT * FROM users');
      console.log('📊 All users in table:', allUsers);
    }
    
    await db.close();
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  }
}

checkUsers();
