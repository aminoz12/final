#!/usr/bin/env node

import { initializeDatabase, testConnection, closeDatabase } from '../src/utils/database.js';
import bcrypt from 'bcryptjs';

console.log('🚀 Initializing Mad2Moi Blog Admin Database...\n');

async function main() {
  try {
    // Initialize database and create tables
    await initializeDatabase();
    
    // Test connection
    await testConnection();
    
    // Create default admin user
    await createDefaultAdmin();
    
    // Create sample categories
    await createSampleCategories();
    
    // Create sample subscribers
    await createSampleSubscribers();
    
    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update config.env with your MySQL credentials');
    console.log('2. Start your development server: npm run dev');
    console.log('3. Access your admin dashboard at: http://localhost:4322/admin');
    
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is running on your system');
    console.log('2. Check your MySQL credentials in config.env');
    console.log('3. Ensure MySQL user has CREATE DATABASE privileges');
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

async function createDefaultAdmin() {
  try {
    const { executeQuery } = await import('../src/utils/database.js');
    
    // Create Jules (replacing Ricklen)
    const julesPasswordHash = await bcrypt.hash('jules123', 12);
    await executeQuery(`
      INSERT IGNORE INTO users (username, email, password_hash, role, first_name, last_name, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['jules', 'jules@mad2moi.com', julesPasswordHash, 'admin', 'Jules', 'Admin', true]);
    
    // Create Alicia as admin
    const aliciaPasswordHash = await bcrypt.hash('alicia123', 12);
    await executeQuery(`
      INSERT IGNORE INTO users (username, email, password_hash, role, first_name, last_name, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['alicia', 'alicia@mad2moi.com', aliciaPasswordHash, 'admin', 'Alicia', 'Admin', true]);
    
    console.log('✅ Admin users created:');
    console.log('   Jules - Email: jules@mad2moi.com, Password: jules123');
    console.log('   Alicia - Email: alicia@mad2moi.com, Password: alicia123');
  } catch (error) {
    console.error('❌ Error creating admin users:', error.message);
  }
}

async function createSampleCategories() {
  try {
    const { executeQuery } = await import('../src/utils/database.js');
    
    const categories = [
      { name: 'Technologie', slug: 'technologie', description: 'Articles sur la technologie et l\'innovation', color: '#3B82F6' },
      { name: 'Lifestyle', slug: 'lifestyle', description: 'Conseils et astuces pour un meilleur mode de vie', color: '#10B981' },
      { name: 'Business', slug: 'business', description: 'Actualités et conseils business', color: '#F59E0B' },
      { name: 'Santé', slug: 'sante', description: 'Conseils santé et bien-être', color: '#EF4444' },
      { name: 'Voyage', slug: 'voyage', description: 'Destinations et conseils de voyage', color: '#8B5CF6' }
    ];
    
    for (const category of categories) {
      await executeQuery(`
        INSERT IGNORE INTO categories (name, slug, description, color)
        VALUES (?, ?, ?, ?)
      `, [category.name, category.slug, category.description, category.color]);
    }
    
    console.log('✅ Sample categories created');
  } catch (error) {
    console.error('❌ Error creating categories:', error.message);
  }
}

async function createSampleSubscribers() {
  try {
    const { executeQuery } = await import('../src/utils/database.js');
    
    const subscribers = [
      { name: 'Jean Dupont', email: 'jean.dupont@email.com', location: 'Paris, France', source: 'site_web', status: 'actif', engagement_score: 85 },
      { name: 'Marie Laurent', email: 'marie.laurent@email.com', location: 'Lyon, France', source: 'reseaux_sociaux', status: 'actif', engagement_score: 92 },
      { name: 'Pierre Martin', email: 'pierre.martin@email.com', location: 'Marseille, France', source: 'newsletter', status: 'inactif', engagement_score: 45 },
      { name: 'Sophie Bernard', email: 'sophie.bernard@email.com', location: 'Toulouse, France', source: 'referencement', status: 'actif', engagement_score: 78 },
      { name: 'Lucas Moreau', email: 'lucas.moreau@email.com', location: 'Nantes, France', source: 'site_web', status: 'desabonne', engagement_score: 0 }
    ];
    
    for (const subscriber of subscribers) {
      await executeQuery(`
        INSERT IGNORE INTO subscribers (name, email, location, source, status, engagement_score)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [subscriber.name, subscriber.email, subscriber.location, subscriber.source, subscriber.status, subscriber.engagement_score]);
    }
    
    console.log('✅ Sample subscribers created');
  } catch (error) {
    console.error('❌ Error creating subscribers:', error.message);
  }
}

// Run the initialization
main().catch(console.error);

