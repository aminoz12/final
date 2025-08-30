// Debug script for categories API
import { initializeDatabase, executeQuery, closeDatabase } from './src/utils/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config.env') });

async function debugCategories() {
  try {
    console.log('🔧 Debug Categories: Starting debug process...');
    
    // Check environment variables
    console.log('🔧 Environment Variables:');
    console.log('  NODE_ENV:', process.env.NODE_ENV);
    console.log('  DB_DRIVER:', process.env.DB_DRIVER);
    console.log('  DB_HOST:', process.env.DB_HOST);
    console.log('  DB_PORT:', process.env.DB_PORT);
    console.log('  DB_USER:', process.env.DB_USER);
    console.log('  DB_NAME:', process.env.DB_NAME);
    
    // Test database connection
    console.log('\n🔧 Testing database connection...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    // Test simple query
    console.log('\n🔧 Testing simple query...');
    const testQuery = await executeQuery('SELECT 1 as test, datetime(\'now\') as timestamp');
    console.log('✅ Test query successful:', testQuery);
    
    // Check if categories table exists
    console.log('\n🔧 Checking if categories table exists...');
    try {
      const tableCheck = await executeQuery(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='categories'
      `);
      console.log('✅ Categories table check:', tableCheck);
      
      if (tableCheck.length === 0) {
        console.log('❌ Categories table does not exist!');
        return;
      }
    } catch (tableError) {
      console.error('❌ Error checking categories table:', tableError);
      return;
    }
    
    // Check categories table structure
    console.log('\n🔧 Checking categories table structure...');
    try {
      const structureCheck = await executeQuery(`
        PRAGMA table_info(categories)
      `);
      console.log('✅ Categories table structure:', structureCheck);
    } catch (structureError) {
      console.error('❌ Error checking table structure:', structureError);
    }
    
    // Count existing categories
    console.log('\n🔧 Counting existing categories...');
    try {
      const countQuery = await executeQuery('SELECT COUNT(*) as count FROM categories');
      const count = countQuery[0].count;
      console.log('✅ Found', count, 'categories in database');
      
      if (count > 0) {
        // Show sample categories
        const sampleCategories = await executeQuery(`
          SELECT id, name, slug, is_active 
          FROM categories 
          LIMIT 5
        `);
        console.log('✅ Sample categories:', sampleCategories);
      }
    } catch (countError) {
      console.error('❌ Error counting categories:', countError);
    }
    
    // Close database connection
    await closeDatabase();
    console.log('\n✅ Debug completed successfully');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    console.error('❌ Error stack:', error.stack);
    
    try {
      await closeDatabase();
    } catch (closeError) {
      console.error('❌ Error closing database:', closeError);
    }
  }
}

// Run the debug
debugCategories();
