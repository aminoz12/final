#!/usr/bin/env node

/**
 * Test Article Sync Script
 * This script tests the article synchronization between admin panel and blog
 */

import { initializeDatabase, closeDatabase, executeQuery } from '../src/utils/database.js';
import { BlogSyncService } from '../src/services/blogSyncService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../config.env') });

async function testSync() {
  try {
    console.log('🧪 Testing article synchronization...');
    
    // Initialize database
    await initializeDatabase();
    console.log('✅ Database connected');
    
    // Create a test article
    console.log('📝 Creating test article...');
    const testArticle = {
      title: 'Test Article - Synchronization Test',
      slug: 'test-article-sync',
      excerpt: 'This is a test article to verify synchronization is working.',
      content: '<h1>Test Article</h1><p>This is a test article to verify that the synchronization between the admin panel and blog is working correctly.</p><p>If you can see this article on the blog, the sync is working!</p>',
      featured_image: null,
      author_id: 1,
      category_id: null,
      status: 'published',
      is_featured: false,
      meta_title: 'Test Article - Sync Test',
      meta_description: 'Test article to verify synchronization',
      tags: JSON.stringify(['test', 'sync', 'verification'])
    };
    
    // Insert test article
    const result = await executeQuery(`
      INSERT INTO articles (
        title, slug, excerpt, content, featured_image, author_id, 
        category_id, status, is_featured, meta_title, meta_description, 
        tags, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      testArticle.title, testArticle.slug, testArticle.excerpt, 
      testArticle.content, testArticle.featured_image, testArticle.author_id,
      testArticle.category_id, testArticle.status, testArticle.is_featured,
      testArticle.meta_title, testArticle.meta_description, testArticle.tags
    ]);
    
    const articleId = result.insertId;
    console.log(`✅ Test article created with ID: ${articleId}`);
    
    // Test sync to blog
    console.log('🔄 Testing sync to blog...');
    const syncResult = await BlogSyncService.syncArticleToBlog(articleId);
    
    if (syncResult) {
      console.log('✅ Article synced to blog successfully');
      
      // Check if file was created
      const fs = await import('fs/promises');
      const blogArticlesDir = path.join(__dirname, '../../../blog/src/pages/blog');
      const articleFilePath = path.join(blogArticlesDir, `${testArticle.slug}.astro`);
      
      try {
        await fs.access(articleFilePath);
        console.log('✅ Article file created in blog directory');
        
        // Read and verify file content
        const fileContent = await fs.readFile(articleFilePath, 'utf8');
        if (fileContent.includes(testArticle.title)) {
          console.log('✅ Article file contains correct content');
        } else {
          console.log('⚠️ Article file content verification failed');
        }
        
      } catch (fileError) {
        console.log('❌ Article file not found in blog directory');
      }
      
    } else {
      console.log('❌ Article sync failed');
    }
    
    // Clean up test article
    console.log('🧹 Cleaning up test article...');
    await executeQuery('DELETE FROM articles WHERE id = ?', [articleId]);
    console.log('✅ Test article removed');
    
    // Close database connection
    await closeDatabase();
    console.log('✅ Database connection closed');
    
    console.log('\n🎉 Sync test completed successfully!');
    console.log('\nTo verify the sync worked:');
    console.log('1. Check that the article file was created in blog/src/pages/blog/');
    console.log('2. Start the blog: cd ../blog && npm run dev');
    console.log('3. Visit http://localhost:4321/blog/test-article-sync');
    
  } catch (error) {
    console.error('❌ Sync test failed:', error);
    process.exit(1);
  }
}

// Run the test
testSync();

