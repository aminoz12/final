#!/usr/bin/env node

/**
 * Initialize Database and Sync Articles Script
 * This script sets up the database and syncs existing articles to the blog
 */

import { initializeDatabase, closeDatabase } from '../src/utils/database.js';
import { BlogSyncService } from '../src/services/blogSyncService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../config.env') });

async function main() {
  try {
    console.log('🚀 Starting database initialization and article sync...');
    
    // Initialize database
    console.log('📊 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    // Check if there are existing articles
    console.log('📝 Checking for existing articles...');
    const { executeQuery } = await import('../src/utils/database.js');
    
    const articles = await executeQuery('SELECT COUNT(*) as count FROM articles');
    const articleCount = articles[0]?.count || 0;
    
    if (articleCount > 0) {
      console.log(`📚 Found ${articleCount} existing articles`);
      
      // Sync all published articles
      console.log('🔄 Syncing published articles to blog...');
      const syncResult = await BlogSyncService.bulkSyncAllArticles();
      
      console.log(`✅ Sync completed: ${syncResult.successCount} success, ${syncResult.errorCount} errors`);
      
      if (syncResult.errorCount > 0) {
        console.log('⚠️ Some articles failed to sync. Check the logs above for details.');
      }
    } else {
      console.log('ℹ️ No existing articles found. Database is ready for new articles.');
    }
    
    // Close database connection
    await closeDatabase();
    console.log('✅ Database connection closed');
    
    console.log('\n🎉 Setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Start the admin panel: npm run dev');
    console.log('2. Start the blog: cd ../blog && npm run dev');
    console.log('3. Create articles in the admin panel');
    console.log('4. Articles will automatically sync to the blog when published');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the script
main();

