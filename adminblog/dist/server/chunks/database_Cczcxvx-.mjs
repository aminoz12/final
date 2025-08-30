import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import fs$1 from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration for SQLite
const dbConfig = {
  database: 'mad2moi_blog'
};

// Driver: sqlite (default)
const dbDriver = 'sqlite';

console.log('🔧 Database Debug Info:');
console.log('  Using SQLite database:', dbConfig.database);
console.log('  Database path:', path.join(__dirname, '../../../database', `${dbConfig.database}.sqlite`));

// Create connection pool / handle
let pool = null; // SQLite Database handle

// Initialize database connection
async function initializeDatabase() {
  try {
    if (pool) {
      return pool;
    }

    if (dbDriver === 'sqlite') {
      const dbDir = path.join(__dirname, '../../../database');
      const dbFile = path.join(dbDir, `${dbConfig.database}.sqlite`);
      if (!fs.existsSync(dbDir)) {
        await fs$1.mkdir(dbDir, { recursive: true });
      }
      pool = await open({ filename: dbFile, driver: sqlite3.Database });
      await pool.exec('PRAGMA foreign_keys = ON;');
      await pool.exec('PRAGMA journal_mode = WAL;');
      await createTablesSqlite(pool);
      console.log('✅ SQLite database initialized at', dbFile);
      return pool;
    }

    // MySQL path
    // const tempConfig = { ...dbConfig };
    // delete tempConfig.database;
    // const tempConnection = await mysql.createConnection(tempConfig);
    // await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    // await tempConnection.query(`USE ${dbConfig.database}`);
    // await createTables(tempConnection);
    
    // Create default categories for MySQL
    // await createDefaultCategories(tempConnection);
    
    // await tempConnection.end();
    // pool = mysql.createPool(dbConfig);
    // console.log('✅ MySQL database initialized successfully');
    // return pool;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Create all necessary tables for SQLite
async function createTablesSqlite(db) {
  try {
    // Users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'author',
        first_name TEXT,
        last_name TEXT,
        avatar_url TEXT,
        is_active INTEGER DEFAULT 1,
        last_login TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        parent_id INTEGER,
        color TEXT DEFAULT '#3B82F6',
        icon TEXT,
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES categories(id)
      )
    `);

    // Articles table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        featured_image TEXT,
        author_id INTEGER NOT NULL,
        category_id INTEGER,
        status TEXT DEFAULT 'draft',
        is_featured INTEGER DEFAULT 0,
        meta_title TEXT,
        meta_description TEXT,
        tags TEXT,
        view_count INTEGER DEFAULT 0,
        published_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    // Subscribers table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        is_active INTEGER DEFAULT 1,
        subscribed_at TEXT DEFAULT CURRENT_TIMESTAMP,
        unsubscribed_at TEXT
      )
    `);

    // Chat Conversations table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS chat_conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE NOT NULL,
        visitor_name TEXT,
        visitor_email TEXT,
        status TEXT DEFAULT 'active',
        last_message_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Chat Messages table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        sender_type TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ All tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}

// Execute a query
async function executeQuery(query, params = []) {
  try {
    if (!pool) {
      await initializeDatabase();
    }
    if (dbDriver === 'sqlite') {
      // Translate basic syntax differences
      let translated = query
        .replace(/NOW\(\)/gi, 'CURRENT_TIMESTAMP')
        .replace(/INSERT\s+IGNORE/gi, 'INSERT OR IGNORE');
      const upper = translated.trim().toUpperCase();
      if (upper.startsWith('SELECT')) {
        const rows = await pool.all(translated, params);
        return rows;
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

    // const connectionPool = getConnectionPool();
    // const [rows] = await connectionPool.execute(query, params);
    // return rows;
  } catch (error) {
    console.error('❌ Query execution error:', error);
    throw error;
  }
}

// Close database connection
async function closeDatabase() {
  if (pool) {
    {
      await pool.close();
    }
    pool = null;
    console.log('✅ Database connection closed');
  }
}

export { closeDatabase, executeQuery, initializeDatabase };
