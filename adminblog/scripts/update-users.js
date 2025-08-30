#!/usr/bin/env node

import { initializeDatabase, executeQuery, closeDatabase } from '../src/utils/database.js';
import bcrypt from 'bcryptjs';

console.log('🔄 Updating Mad2Moi Blog Admin Users...\n');

async function main() {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Update existing users and add new ones
    await updateUsers();
    
    console.log('\n🎉 User update completed successfully!');
    console.log('\n📋 New admin users:');
    console.log('   Jules - Email: jules@mad2moi.com, Password: jules123');
    console.log('   Alicia - Email: alicia@mad2moi.com, Password: alicia123');
    
  } catch (error) {
    console.error('\n❌ User update failed:', error.message);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

async function updateUsers() {
  try {
    // Remove old admin user if exists
    await executeQuery('DELETE FROM users WHERE email = ?', ['admin@mad2moi.com']);
    console.log('✅ Removed old admin user');
    
    // Create Jules (replacing Ricklen)
    const julesPasswordHash = await bcrypt.hash('jules123', 12);
    await executeQuery(`
      INSERT IGNORE INTO users (username, email, password_hash, role, first_name, last_name, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['jules', 'jules@mad2moi.com', julesPasswordHash, 'admin', 'Jules', 'Admin', true]);
    console.log('✅ Jules admin user created/updated');
    
    // Create Alicia as admin
    const aliciaPasswordHash = await bcrypt.hash('alicia123', 12);
    await executeQuery(`
      INSERT IGNORE INTO users (username, email, password_hash, role, first_name, last_name, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['alicia', 'alicia@mad2moi.com', aliciaPasswordHash, 'admin', 'Alicia', 'Admin', true]);
    console.log('✅ Alicia admin user created/updated');
    
  } catch (error) {
    console.error('❌ Error updating users:', error.message);
    throw error;
  }
}

main();
