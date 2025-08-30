import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dbPath = path.join(__dirname, '../../database/mad2moi_blog.sqlite');

console.log('🔍 Checking database for images...');
console.log('📁 Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err);
    return;
  }
  console.log('✅ Connected to database');
  
  // Check all articles with images
  const query = 'SELECT id, title, featured_image FROM articles WHERE featured_image IS NOT NULL';
  
  db.all(query, (err, rows) => {
    if (err) {
      console.error('❌ Error querying database:', err);
    } else {
      console.log(`📊 Found ${rows.length} articles with images:`);
      
      if (rows.length === 0) {
        console.log('✅ No articles with images found - database is clean!');
      } else {
        rows.forEach(row => {
          console.log(`\n📄 Article ID ${row.id}: "${row.title}"`);
          console.log(`🖼️ Image data: ${row.featured_image}`);
          
          // Check if it's an Azure Blob Storage URL
          if (row.featured_image && row.featured_image.includes('blob.core.windows.net')) {
            console.log('🚨 WARNING: This is an Azure Blob Storage URL that will cause 409 errors!');
          }
        });
      }
    }
    db.close();
  });
});
