import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dbPath = path.join(__dirname, '../../database/mad2moi_blog.sqlite');

console.log('🧹 Clearing ALL Azure Blob Storage URLs...');
console.log('📁 Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err);
    return;
  }
  console.log('✅ Connected to database');
  
  // Clear ALL Azure Blob Storage URLs
  const clearQuery = `
    UPDATE articles 
    SET featured_image = NULL 
    WHERE featured_image LIKE '%blob.core.windows.net%'
  `;
  
  db.run(clearQuery, (err) => {
    if (err) {
      console.error('❌ Error clearing Azure URLs:', err);
    } else {
      console.log('✅ Cleared ALL Azure Blob Storage URLs');
      
      // Verify the cleanup
      db.all('SELECT id, title, featured_image FROM articles WHERE featured_image IS NOT NULL', (err, rows) => {
        if (err) {
          console.error('❌ Error checking remaining images:', err);
        } else {
          console.log(`📊 Remaining articles with images: ${rows.length}`);
          if (rows.length === 0) {
            console.log('🎉 SUCCESS: All problematic URLs cleared! No more 409 errors!');
          } else {
            console.log('⚠️ Some articles still have images:');
            rows.forEach(row => {
              console.log(`   ID ${row.id}: ${row.title}`);
            });
          }
        }
        db.close();
      });
    }
  });
});
