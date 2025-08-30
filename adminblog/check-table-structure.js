// Check the actual table structure
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkTableStructure() {
  try {
    console.log('🔍 Checking actual table structure...');
    
    const dbPath = path.join(__dirname, '../database/mad2moi_blog.sqlite');
    console.log('📁 Database path:', dbPath);
    
    const db = await open({ filename: dbPath, driver: sqlite3.Database });
    
    // Check what tables exist
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('📋 Tables in database:', tables);
    
    // Check categories table structure
    const structure = await db.all("PRAGMA table_info(categories)");
    console.log('🏗️ Categories table structure:', structure);
    
    // Check if there's any data
    const count = await db.get("SELECT COUNT(*) as count FROM categories");
    console.log('📊 Categories count:', count);
    
    if (count.count > 0) {
      const sample = await db.get("SELECT * FROM categories LIMIT 1");
      console.log('📝 Sample category:', sample);
    }
    
    await db.close();
    
  } catch (error) {
    console.error('❌ Error checking table structure:', error);
  }
}

checkTableStructure();


