import mysql from 'mysql2/promise';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import fs$1 from 'fs/promises';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../config.env') });

// Database configuration - same as admin panel
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mad2moi_blog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Driver: mysql (default) or sqlite
const dbDriver = (process.env.DB_DRIVER || 'mysql').toLowerCase();

// Create connection pool
let pool = null; // MySQL pool or SQLite handle

// Initialize database connection
async function initializeDatabase() {
  try {
    if (pool) return pool;

    if (dbDriver === 'sqlite') {
      const dbDir = path.join(__dirname, '../../../database');
      const dbFile = path.join(dbDir, `${dbConfig.database}.sqlite`);
      
      console.log('🔍 Debug: Database directory:', dbDir);
      console.log('🔍 Debug: Database file:', dbFile);
      console.log('🔍 Debug: Directory exists:', fs.existsSync(dbDir));
      console.log('🔍 Debug: File exists:', fs.existsSync(dbFile));
      
      if (!fs.existsSync(dbDir)) {
        await fs$1.mkdir(dbDir, { recursive: true });
        console.log('📁 Created database directory');
      }
      
      if (!fs.existsSync(dbFile)) {
        console.log('⚠️ Database file does not exist, creating new one');
      }
      
      pool = await open({ filename: dbFile, driver: sqlite3.Database });
      await pool.exec('PRAGMA foreign_keys = ON;');
      await pool.exec('PRAGMA journal_mode = WAL;');
      console.log('✅ Blog SQLite connection established at', dbFile);
      return pool;
    }

    pool = mysql.createPool(dbConfig);
    console.log('✅ Blog MySQL connection established');
    return pool;
  } catch (error) {
    console.error('❌ Blog database initialization failed:', error);
    throw error;
  }
}

// Get database connection pool
function getConnectionPool() {
  if (!pool) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return pool;
}

// Execute a query
async function executeQuery(query, params = []) {
  try {
    console.log('🔍 Debug: Executing query:', query);
    console.log('🔍 Debug: Query params:', params);
    
    await initializeDatabase();
    if (dbDriver === 'sqlite') {
      let translated = query
        .replace(/NOW\(\)/gi, 'CURRENT_TIMESTAMP')
        .replace(/INSERT\s+IGNORE/gi, 'INSERT OR IGNORE');
      const upper = translated.trim().toUpperCase();
      
      console.log('🔍 Debug: Translated query:', translated);
      
      if (upper.startsWith('SELECT')) {
        const result = await pool.all(translated, params);
        console.log('🔍 Debug: SELECT result:', result);
        return result;
      }
      if (upper.startsWith('INSERT')) {
        const result = await pool.run(translated, params);
        return { insertId: result.lastID, affectedRows: result.changes };
      }
      if (upper.startsWith('UPDATE') || upper.startsWith('DELETE')) {
        const result = await pool.run(translated, params);
        return { affectedRows: result.changes };
      }
      const result = await pool.exec(translated);
      return result;
    }
    const poolRef = getConnectionPool();
    const [rows] = await poolRef.execute(query, params);
    return rows;
  } catch (error) {
    console.error('❌ Query execution error:', error);
    throw error;
  }
}

/**
 * Get published articles with category information
 */
async function getPublishedArticles() {
    try {
        await initializeDatabase();
        const query = `
            SELECT 
                a.*,
                c.name as category_name,
                c.slug as category_slug,
                c.color as category_color,
                c.icon as category_icon,
                COALESCE(u.first_name || ' ' || u.last_name, u.username) AS author_name
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            LEFT JOIN users u ON a.author_id = u.id
            WHERE a.status = 'published'
            ORDER BY a.published_at DESC, a.created_at DESC
        `;
        const rows = await executeQuery(query);
        console.log('📚 Debug: Raw articles from database:', rows);
        return rows;
    } catch (error) {
        console.error('Error fetching published articles:', error);
        return [];
    }
}

/**
 * Get ALL articles for debugging (regardless of status)
 */
async function getAllArticles() {
    try {
        await initializeDatabase();
        const query = `
            SELECT 
                a.*,
                c.name as category_name,
                c.slug as category_slug,
                c.color as category_color,
                c.icon as category_icon,
                COALESCE(u.first_name || ' ' || u.last_name, u.username) AS author_name
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            LEFT JOIN users u ON a.author_id = u.id
            ORDER BY a.created_at DESC
        `;
        console.log('🔍 Debug: Executing getAllArticles query:', query);
        const rows = await executeQuery(query);
        console.log('🔍 Debug: ALL articles from database:', rows);
        
        if (rows && rows.length > 0) {
            console.log('🔍 Debug: First article sample:', rows[0]);
            console.log('🔍 Debug: Article statuses:', rows.map(r => ({ id: r.id, title: r.title, status: r.status })));
            console.log('🔍 Debug: Article category_ids:', rows.map(r => ({ id: r.id, title: r.title, category_id: r.category_id, category_name: r.category_name })));
        } else {
            console.log('⚠️ No articles found in database');
        }
        
        return rows;
    } catch (error) {
        console.error('Error fetching all articles:', error);
        return [];
    }
}

// Get all categories
async function getCategories() {
  try {
    await initializeDatabase();
    
    // First, let's check if categories table has data
    const checkQuery = 'SELECT COUNT(*) as count FROM categories';
    const countResult = await executeQuery(checkQuery);
    console.log('🔍 Debug: Categories table count:', countResult);
    
    const query = `
      SELECT 
        c.id, c.name, c.slug, c.description, c.color, c.icon, c.parent_id,
        COUNT(a.id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
      WHERE c.is_active = 1
      GROUP BY c.id, c.name, c.slug, c.description, c.color, c.icon, c.parent_id
      ORDER BY c.sort_order ASC, c.name ASC
    `;
    
    const categories = await executeQuery(query);
    console.log('📚 Debug: Raw categories from database:', categories);
    
    // Also check raw categories without JOIN
    const rawCategoriesQuery = 'SELECT * FROM categories WHERE is_active = 1';
    const rawCategories = await executeQuery(rawCategoriesQuery);
    console.log('🔍 Debug: Raw categories (no JOIN):', rawCategories);
    
    return categories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
}

// Increment article view count
async function incrementViewCount(articleId) {
  try {
    await initializeDatabase();
    
    const query = `
      UPDATE articles 
      SET view_count = view_count + 1 
      WHERE id = ?
    `;
    
    await executeQuery(query, [articleId]);
    return true;
  } catch (error) {
    console.error('❌ Error incrementing view count:', error);
    return false;
  }
}

export { executeQuery, getAllArticles, getCategories, getConnectionPool, getPublishedArticles, incrementViewCount, initializeDatabase };
