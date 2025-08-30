#!/usr/bin/env node

/**
 * Initialize Categories Script
 * This script sets up the categories table with default categories
 */

import { initializeDatabase, closeDatabase, executeQuery } from '../src/utils/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../config.env') });

async function initCategories() {
  try {
    console.log('🚀 Starting categories initialization...');
    
    // Initialize database
    console.log('📊 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    // Check if categories table exists and has data
    console.log('📝 Checking existing categories...');
    const existingCategories = await executeQuery('SELECT COUNT(*) as count FROM categories');
    const categoryCount = existingCategories[0]?.count || 0;
    
    if (categoryCount > 0) {
      console.log(`ℹ️ Found ${categoryCount} existing categories`);
      
      // Show existing categories
      const categories = await executeQuery('SELECT name, slug, color FROM categories ORDER BY name');
      console.log('📚 Existing categories:');
      categories.forEach(cat => {
        console.log(`  - ${cat.name} (${cat.slug}) - ${cat.color}`);
      });
    } else {
      console.log('ℹ️ No categories found, creating default categories...');
      
      // Create default categories
      const defaultCategories = [
        {
          name: 'BDSM',
          slug: 'bdsm',
          description: 'Articles sur le BDSM, la domination, la soumission et les pratiques sécurisées',
          color: '#EF4444',
          icon: '🔗',
          sort_order: 1
        },
        {
          name: 'Libertinage',
          slug: 'libertinage',
          description: 'Guide du libertinage, échangisme et exploration en couple',
          color: '#8B5CF6',
          icon: '💋',
          sort_order: 2
        },
        {
          name: 'Roleplay',
          slug: 'roleplay',
          description: 'Scénarios de roleplay, costumes et jeux de rôle érotiques',
          color: '#3B82F6',
          icon: '🎭',
          sort_order: 3
        },
        {
          name: 'Sex Toys',
          slug: 'sex-toys',
          description: 'Guide des sex toys, choix et utilisation sécurisée',
          color: '#EC4899',
          icon: '🦄',
          sort_order: 4
        },
        {
          name: 'Fantasmes',
          slug: 'fantasmes',
          description: 'Exploration des fantasmes et tabous de manière consciente',
          color: '#F59E0B',
          icon: '✨',
          sort_order: 5
        },
        {
          name: 'Communication',
          slug: 'communication',
          description: 'Communication sexuelle et relationnelle dans le couple',
          color: '#10B981',
          icon: '💬',
          sort_order: 6
        },
        {
          name: 'Sécurité',
          slug: 'securite',
          description: 'Pratiques sécurisées et protocoles de sécurité',
          color: '#059669',
          icon: '🛡️',
          sort_order: 7
        },
        {
          name: 'Bien-être',
          slug: 'bien-etre',
          description: 'Bien-être sexuel et santé relationnelle',
          color: '#06B6D4',
          icon: '💙',
          sort_order: 8
        }
      ];
      
      // Insert default categories
      for (const category of defaultCategories) {
        try {
          await executeQuery(`
            INSERT INTO categories (name, slug, description, color, icon, sort_order) 
            VALUES (?, ?, ?, ?, ?, ?)
          `, [category.name, category.slug, category.description, category.color, category.icon, category.sort_order]);
          
          console.log(`✅ Created category: ${category.name}`);
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            console.log(`ℹ️ Category already exists: ${category.name}`);
          } else {
            console.error(`❌ Error creating category ${category.name}:`, error.message);
          }
        }
      }
      
      console.log('✅ Default categories created successfully');
    }
    
    // Close database connection
    await closeDatabase();
    console.log('✅ Database connection closed');
    
    console.log('\n🎉 Categories initialization completed!');
    console.log('\nNext steps:');
    console.log('1. Start the admin panel: npm run dev');
    console.log('2. Go to /admin/categories to manage categories');
    console.log('3. Create articles and assign them to categories');
    console.log('4. Categories will automatically sync to the blog');
    
  } catch (error) {
    console.error('❌ Categories initialization failed:', error);
    process.exit(1);
  }
}

// Run the script
initCategories();
