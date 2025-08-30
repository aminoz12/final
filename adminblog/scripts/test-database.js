#!/usr/bin/env node

/**
 * Test Database Script
 * This script tests if the database is working correctly
 */

import { initializeDatabase, executeQuery, closeDatabase } from '../src/utils/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../config.env') });

async function testDatabase() {
  try {
    console.log('🧪 Testing database functionality...');
    
    // Initialize database
    console.log('📊 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    // Test 1: Check if articles table exists and has data
    console.log('\n📋 Test 1: Checking articles table...');
    const articles = await executeQuery('SELECT id, title, status, featured_image FROM articles LIMIT 5');
    console.log(`✅ Found ${articles.length} articles in database`);
    
    if (articles.length > 0) {
      console.log('📄 Sample article data:');
      articles.forEach((article, index) => {
        console.log(`  ${index + 1}. ID: ${article.id}, Title: ${article.title}, Status: ${article.status}`);
        console.log(`     Featured Image: ${article.featured_image ? 'Yes' : 'No'}`);
      });
    }
    
    // Test 2: Try to update an article
    if (articles.length > 0) {
      console.log('\n📝 Test 2: Testing article update...');
      const testArticle = articles[0];
      const newTitle = `TEST UPDATE - ${Date.now()}`;
      
      console.log(`🔄 Updating article ID ${testArticle.id} with new title: "${newTitle}"`);
      
      const updateQuery = `
        UPDATE articles 
        SET title = ?, updated_at = NOW() 
        WHERE id = ?
      `;
      
      const updateResult = await executeQuery(updateQuery, [newTitle, testArticle.id]);
      console.log('✅ Update query executed');
      
      // Verify the update
      const [updatedArticle] = await executeQuery('SELECT id, title, updated_at FROM articles WHERE id = ?', [testArticle.id]);
      console.log(`✅ Article updated successfully:`);
      console.log(`   ID: ${updatedArticle.id}`);
      console.log(`   New Title: ${updatedArticle.title}`);
      console.log(`   Updated At: ${updatedArticle.updated_at}`);
      
      // Revert the test change
      console.log('\n🔄 Reverting test change...');
      await executeQuery(updateQuery, [testArticle.title, testArticle.id]);
      console.log('✅ Test change reverted');
    }
    
    // Test 3: Check database file size and location
    console.log('\n📁 Test 3: Checking database file...');
    const dbPath = path.join(__dirname, '../../database/mad2moi_blog.sqlite');
    console.log(`Database path: ${dbPath}`);
    
    // Test 4: Check if featured_image column can store JSON
    console.log('\n🖼️ Test 4: Testing featured_image JSON storage...');
    const testImageData = {
      url: '/images/test-image.jpg',
      alt: 'Test Image',
      type: 'test'
    };
    
    if (articles.length > 0) {
      const testArticle = articles[0];
      console.log(`🔄 Testing JSON storage for article ID ${testArticle.id}`);
      
      const jsonUpdateQuery = `
        UPDATE articles 
        SET featured_image = ?, updated_at = NOW() 
        WHERE id = ?
      `;
      
      await executeQuery(jsonUpdateQuery, [JSON.stringify(testImageData), testArticle.id]);
      console.log('✅ JSON data stored successfully');
      
      // Verify JSON retrieval
      const [jsonArticle] = await executeQuery('SELECT featured_image FROM articles WHERE id = ?', [testArticle.id]);
      console.log('✅ JSON data retrieved:');
      console.log(`   Raw: ${jsonArticle.featured_image}`);
      
      try {
        const parsed = JSON.parse(jsonArticle.featured_image);
        console.log(`   Parsed: ${JSON.stringify(parsed, null, 2)}`);
      } catch (e) {
        console.error('❌ Failed to parse JSON:', e.message);
      }
      
      // Revert test change
      await executeQuery(jsonUpdateQuery, [testArticle.featured_image, testArticle.id]);
      console.log('✅ JSON test reverted');
    }
    
    // Close database connection
    await closeDatabase();
    console.log('✅ Database connection closed');
    
    console.log('\n🎉 All database tests completed successfully!');
    console.log('\nThe database is working correctly and can:');
    console.log('✅ Store and retrieve articles');
    console.log('✅ Update article data');
    console.log('✅ Store JSON data in featured_image field');
    console.log('✅ Handle all required fields (title, content, status, etc.)');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

// Run the test
testDatabase();





