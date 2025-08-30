import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, '../../../database/chat_system.sqlite');

let db = null;

// Initialize database connection
async function getChatDatabase() {
  if (!db) {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    await db.exec('PRAGMA foreign_keys = ON;');
    await db.exec('PRAGMA journal_mode = WAL;');
  }
  return db;
}

// User management
async function createUser(name, email, sessionId) {
  const db = await getChatDatabase();
  try {
    const result = await db.run(
      'INSERT INTO users (name, email, session_id) VALUES (?, ?, ?)',
      [name, email, sessionId]
    );
    return result.lastID;
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      // User already exists, return existing user ID
      const user = await db.get('SELECT id FROM users WHERE session_id = ?', [sessionId]);
      return user.id;
    }
    throw error;
  }
}

async function getUserBySessionId(sessionId) {
  const db = await getChatDatabase();
  return await db.get('SELECT * FROM users WHERE session_id = ?', [sessionId]);
}

// Message management
async function saveMessage(userId, message, sender, intercepted = 0, hasAttachment = 0, attachmentUrl = null, attachmentType = null) {
  const db = await getChatDatabase();
  const result = await db.run(
    'INSERT INTO messages (user_id, message, sender, intercepted, has_attachment, attachment_url, attachment_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [userId, message, sender, intercepted, hasAttachment, attachmentUrl, attachmentType]
  );
  return result.lastID;
}

async function getMessagesByUserId(userId) {
  const db = await getChatDatabase();
  return await db.all(
    'SELECT * FROM messages WHERE user_id = ? ORDER BY timestamp ASC',
    [userId]
  );
}

// Admin status management
async function getAdminStatus() {
  const db = await getChatDatabase();
  const status = await db.get('SELECT * FROM admin_status WHERE id = 1');
  return status ? status.available === 1 : false;
}

async function setAdminStatus(available) {
  const db = await getChatDatabase();
  await db.run(
    'UPDATE admin_status SET available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
    [available ? 1 : 0]
  );
}

// Chat statistics
async function getChatStats() {
  const db = await getChatDatabase();
  const stats = await db.get(`
    SELECT 
      COUNT(DISTINCT u.id) as total_users,
      COUNT(m.id) as total_messages,
      COUNT(CASE WHEN m.sender = 'user' THEN 1 END) as user_messages,
      COUNT(CASE WHEN m.sender = 'gpt' THEN 1 END) as gpt_messages,
      COUNT(CASE WHEN m.sender = 'admin' THEN 1 END) as admin_messages
    FROM users u
    LEFT JOIN messages m ON u.id = m.user_id
  `);
  return stats;
}

// Get active conversations (users with recent messages)
async function getActiveConversations() {
  const db = await getChatDatabase();
  return await db.all(`
    SELECT 
      u.id,
      u.name,
      u.email,
      u.session_id,
      u.created_at,
      COUNT(m.id) as message_count,
      MAX(m.timestamp) as last_message_at,
      MAX(CASE WHEN m.sender = 'user' THEN m.timestamp END) as last_user_message
    FROM users u
    LEFT JOIN messages m ON u.id = m.user_id
    GROUP BY u.id
    HAVING message_count > 0
    ORDER BY last_message_at DESC
  `);
}

export { createUser, getActiveConversations, getAdminStatus, getChatDatabase, getChatStats, getMessagesByUserId, getUserBySessionId, saveMessage, setAdminStatus };
