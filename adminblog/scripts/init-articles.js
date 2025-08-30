#!/usr/bin/env node

/**
 * Initialize Sample Articles Script
 * This script creates sample articles in the database for testing
 */

import { initializeDatabase, closeDatabase, executeQuery } from '../src/utils/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../config.env') });

async function initArticles() {
  try {
    console.log('🚀 Starting articles initialization...');
    
    // Initialize database
    console.log('📊 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    // Check if articles table exists and has data
    console.log('📝 Checking existing articles...');
    const existingArticles = await executeQuery('SELECT COUNT(*) as count FROM articles');
    const articleCount = existingArticles[0]?.count || 0;
    
    if (articleCount > 0) {
      console.log(`ℹ️ Found ${articleCount} existing articles`);
      
      // Show existing articles
      const articles = await executeQuery('SELECT id, title, status FROM articles ORDER BY created_at DESC LIMIT 5');
      console.log('📚 Existing articles:');
      articles.forEach(article => {
        console.log(`  - ID: ${article.id}, Title: ${article.title}, Status: ${article.status}`);
      });
    } else {
      console.log('ℹ️ No articles found, creating sample articles...')
      
      // Create sample articles
      const sampleArticles = [
        {
          title: 'Guide complet du BDSM pour débutants',
          slug: 'guide-bdsm-debutants',
          excerpt: 'Découvrez les bases du BDSM de manière sécurisée et éthique. Un guide complet pour les débutants.',
          content: `<h1>Guide complet du BDSM pour débutants</h1>
<p>Le BDSM (Bondage, Discipline, Dominance, Soumission, Sado-masochisme) est une pratique qui nécessite une approche responsable et éthique.</p>
<h2>Les fondamentaux</h2>
<p>Avant de commencer, il est essentiel de comprendre les principes de base :</p>
<ul>
<li><strong>Consentement mutuel</strong> : Toute activité doit être consentie par les deux parties</li>
<li><strong>Sécurité</strong> : Utilisez des équipements appropriés et respectez les limites</li>
<li><strong>Communication</strong> : Parlez ouvertement de vos désirs et limites</li>
</ul>
<h2>Premiers pas</h2>
<p>Commencez par des pratiques simples et augmentez progressivement l'intensité selon vos conforts respectifs.</p>`,
          author_id: 1,
          category_id: 1, // BDSM
          status: 'published',
          is_featured: true,
          meta_title: 'Guide BDSM débutants - Conseils et sécurité',
          meta_description: 'Guide complet et sécurisé pour débuter dans le BDSM. Conseils, sécurité et bonnes pratiques.',
          tags: JSON.stringify(['bdsm', 'débutants', 'sécurité', 'guide'])
        },
        {
          title: 'Libertinage en couple : Guide pratique',
          slug: 'libertinage-couple-guide',
          excerpt: 'Comment aborder le libertinage en couple de manière saine et respectueuse. Conseils et bonnes pratiques.',
          content: `<h1>Libertinage en couple : Guide pratique</h1>
<p>Le libertinage en couple peut enrichir votre relation si abordé avec maturité et respect mutuel.</p>
<h2>Préparer la discussion</h2>
<p>Avant de franchir le pas, il est crucial de :</p>
<ul>
<li>Discuter ouvertement de vos fantasmes</li>
<li>Établir des règles claires</li>
<li>Définir vos limites respectives</li>
<li>Prévoir des moments de débriefing</li>
</ul>
<h2>Premières expériences</h2>
<p>Commencez par des situations simples et augmentez progressivement selon votre confort.</p>`,
          author_id: 1,
          category_id: 2, // Libertinage
          status: 'published',
          is_featured: false,
          meta_title: 'Libertinage en couple - Guide complet',
          meta_description: 'Guide pratique pour aborder le libertinage en couple de manière saine et respectueuse.',
          tags: JSON.stringify(['libertinage', 'couple', 'communication', 'fantasmes'])
        },
        {
          title: 'Roleplay : Scénarios et conseils',
          slug: 'roleplay-scenarios-conseils',
          excerpt: 'Découvrez l\'art du roleplay avec des scénarios créatifs et des conseils pour une expérience réussie.',
          content: `<h1>Roleplay : Scénarios et conseils</h1>
<p>Le roleplay permet d'explorer des fantasmes de manière créative et sécurisée.</p>
<h2>Scénarios populaires</h2>
<p>Voici quelques idées de scénarios :</p>
<ul>
<li><strong>Le médecin et le patient</strong> : Un classique qui permet l'exploration</li>
<li><strong>Le professeur et l'étudiant</strong> : Dynamique de pouvoir et d'apprentissage</li>
<li><strong>Le policier et le suspect</strong> : Jeu d'autorité et de soumission</li>
</ul>
<h2>Préparation</h2>
<p>Préparez votre scénario à l'avance et discutez des détails avec votre partenaire.</p>`,
          author_id: 1,
          category_id: 3, // Roleplay
          status: 'draft',
          is_featured: false,
          meta_title: 'Roleplay - Scénarios et conseils',
          meta_description: 'Guide complet du roleplay avec scénarios créatifs et conseils pratiques.',
          tags: JSON.stringify(['roleplay', 'scénarios', 'fantasmes', 'créativité'])
        }
      ];
      
      // Insert sample articles
      for (const article of sampleArticles) {
        try {
          const result = await executeQuery(`
            INSERT INTO articles (
              title, slug, excerpt, content, author_id, category_id, 
              status, is_featured, meta_title, meta_description, 
              tags, published_at, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
              CASE WHEN ? = 'published' THEN NOW() ELSE NULL END, 
              NOW(), NOW())
          `, [
            article.title, article.slug, article.excerpt, article.content,
            article.author_id, article.category_id, article.status, 
            article.is_featured, article.meta_title, article.meta_description,
            article.tags, article.status
          ]);
          
          console.log(`✅ Created article: ${article.title} (ID: ${result.insertId})`);
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            console.log(`ℹ️ Article already exists: ${article.title}`);
          } else {
            console.error(`❌ Error creating article ${article.title}:`, error.message);
          }
        }
      }
      
      console.log('✅ Sample articles created successfully');
    }
    
    // Close database connection
    await closeDatabase();
    console.log('✅ Database connection closed');
    
    console.log('\n🎉 Articles initialization completed!');
    console.log('\nNext steps:');
    console.log('1. Start the admin panel: npm run dev');
    console.log('2. Go to /admin/articles to see your articles');
    console.log('3. Test the edit functionality by clicking the edit button');
    console.log('4. Articles will automatically sync to the blog when published');
    
  } catch (error) {
    console.error('❌ Articles initialization failed:', error);
    process.exit(1);
  }
}

// Run the script
initArticles();
