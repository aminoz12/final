#!/usr/bin/env node

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import fsp from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Initializing Chat System Database...\n');

async function main() {
  try {
    // Create database directory if it doesn't exist
    const dbDir = path.join(__dirname, '../database');
    const dbFile = path.join(dbDir, 'chat_system.sqlite');
    
    if (!fs.existsSync(dbDir)) {
      await fsp.mkdir(dbDir, { recursive: true });
    }

    // Open SQLite database
    const db = await open({ filename: dbFile, driver: sqlite3.Database });
    
    // Enable foreign keys and WAL mode
    await db.exec('PRAGMA foreign_keys = ON;');
    await db.exec('PRAGMA journal_mode = WAL;');

    console.log('📊 Creating chat system tables...');

    // Create users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        session_id TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create messages table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        sender TEXT NOT NULL CHECK (sender IN ('user', 'gpt', 'admin')),
        intercepted INTEGER DEFAULT 0,
        has_attachment INTEGER DEFAULT 0,
        attachment_url TEXT,
        attachment_type TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Create admin_status table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS admin_status (
        id INTEGER PRIMARY KEY,
        available INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default admin status (not available)
    await db.exec(`
      INSERT OR IGNORE INTO admin_status (id, available) VALUES (1, 0)
    `);

    // Create indexes for better performance
    await db.exec('CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages (user_id)');
    await db.exec('CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages (timestamp)');
    await db.exec('CREATE INDEX IF NOT EXISTS idx_users_session_id ON users (session_id)');

    console.log('✅ Chat system tables created successfully!');
    console.log(`📁 Database location: ${dbFile}`);

    // Test the tables
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('\n📋 Created tables:');
    tables.forEach(table => {
      console.log(`   - ${table.name}`);
    });

    await db.close();
    console.log('\n🎉 Chat system database initialization completed!');

  } catch (error) {
    console.error('\n❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

main();


