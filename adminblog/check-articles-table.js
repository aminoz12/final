// Check the articles table structure
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkArticlesTable() {
  try {
    console.log('🔍 Checking articles table structure...');
    
    const dbPath = path.join(__dirname, '../database/mad2moi_blog.sqlite');
    console.log('📁 Database path:', dbPath);
    
    const db = await open({ filename: dbPath, driver: sqlite3.Database });
    
    // Check articles table structure
    const structure = await db.all("PRAGMA table_info(articles)");
    console.log('🏗️ Articles table structure:', structure);
    
    // Check if there's any data
    const count = await db.get("SELECT COUNT(*) as count FROM articles");
    console.log('📊 Articles count:', count);
    
    if (count.count > 0) {
      const sample = await db.get("SELECT * FROM articles LIMIT 1");
      console.log('📝 Sample article:', sample);
    }
    
    await db.close();
    
  } catch (error) {
    console.error('❌ Error checking articles table:', error);
  }
}

checkArticlesTable();


