import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToMongoDB, getMongoDB } from '../blog/utils/mongodb.js'; // Adjust path

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const dbConfig = {
  database: 'mad2moi_blog'
};

// Detect driver: MongoDB in production, SQLite otherwise
const dbDriver = process.env.NODE_ENV === 'production' ? 'mongodb' : 'sqlite';

console.log('🔧 AdminBlog Database Debug Info:');
console.log('  Driver:', dbDriver);

let pool = null;        // SQLite handle
let mongoDb = null;     // MongoDB database instance

// Initialize database connection
export async function initializeDatabase() {
  try {
    if (dbDriver === 'mongodb') {
      if (mongoDb) return mongoDb;

      const mongoUri = process.env.MONGO_URI;
      if (!mongoUri) throw new Error('MONGO_URI not defined in environment');

      await connectToMongoDB(mongoUri);
      mongoDb = getMongoDB();
      console.log('✅ AdminBlog MongoDB connected');
      return mongoDb;
    }

    // SQLite setup
    if (pool) return pool;

    const dbDir = path.join(__dirname, '../../../database');
    const dbFile = path.join(dbDir, `${dbConfig.database}.sqlite`);

    if (!fs.existsSync(dbDir)) {
      await fsp.mkdir(dbDir, { recursive: true });
    }

    pool = await open({ filename: dbFile, driver: sqlite3.Database });
    await pool.exec('PRAGMA foreign_keys = ON;');
    await pool.exec('PRAGMA journal_mode = WAL;');
    await createTablesSqlite(pool);

    console.log('✅ AdminBlog SQLite database initialized at', dbFile);
    return pool;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Execute a query
export async function executeQuery(query, params = []) {
  await initializeDatabase();

  if (dbDriver === 'mongodb') {
    // Basic SQL-to-Mongo mapping
    const upperQuery = query.trim().toUpperCase();

    // Example: Articles collection
    const articlesCollection = mongoDb.collection('articles');
    const categoriesCollection = mongoDb.collection('categories');
    const usersCollection = mongoDb.collection('users');

    if (upperQuery.startsWith('SELECT')) {
      if (query.includes('FROM articles')) {
        const pipeline = [];

        if (query.includes("WHERE a.status = 'published'")) {
          pipeline.push({ $match: { status: 'published' } });
        }

        if (query.includes('ORDER BY a.published_at DESC')) {
          pipeline.push({ $sort: { published_at: -1, created_at: -1 } });
        }

        if (query.includes('LEFT JOIN categories')) {
          pipeline.push({
            $lookup: {
              from: 'categories',
              localField: 'category_id',
              foreignField: '_id',
              as: 'category'
            }
          });
          pipeline.push({
            $addFields: {
              category_name: { $arrayElemAt: ['$category.name', 0] }
            }
          });
        }

        if (query.includes('LEFT JOIN users')) {
          pipeline.push({
            $lookup: {
              from: 'users',
              localField: 'author_id',
              foreignField: '_id',
              as: 'author'
            }
          });
          pipeline.push({
            $addFields: {
              author_name: { $arrayElemAt: ['$author.username', 0] }
            }
          });
        }

        return await articlesCollection.aggregate(pipeline).toArray();
      }

      if (query.includes('FROM categories')) {
        return await categoriesCollection.find({}).toArray();
      }

      if (query.includes('FROM users')) {
        return await usersCollection.find({}).toArray();
      }
    }

    if (upperQuery.startsWith('INSERT')) {
      const collection = mongoDb.collection(query.includes('articles') ? 'articles' : 'categories');
      return await collection.insertOne(params[0]);
    }

    if (upperQuery.startsWith('UPDATE')) {
      const collection = mongoDb.collection(query.includes('articles') ? 'articles' : 'categories');
      return await collection.updateOne({ _id: params[0] }, { $set: params[1] });
    }

    if (upperQuery.startsWith('DELETE')) {
      const collection = mongoDb.collection(query.includes('articles') ? 'articles' : 'categories');
      return await collection.deleteOne({ _id: params[0] });
    }

    return [];
  }

  // SQLite
  let translated = query.replace(/NOW\(\)/gi, 'CURRENT_TIMESTAMP').replace(/INSERT\s+IGNORE/gi, 'INSERT OR IGNORE');
  const upper = translated.trim().toUpperCase();

  if (upper.startsWith('SELECT')) return await pool.all(translated, params);
  if (upper.startsWith('INSERT')) {
    const result = await pool.run(translated, params);
    return { insertId: result.lastID, affectedRows: result.changes };
  }
  if (upper.startsWith('UPDATE') || upper.startsWith('DELETE')) {
    const result = await pool.run(translated, params);
    return { affectedRows: result.changes };
  }

  return await pool.exec(translated);
}

// Close database
export async function closeDatabase() {
  if (dbDriver === 'mongodb' && mongoDb) {
    const client = mongoDb.client; // from your mongodb.js
    await client.close();
    mongoDb = null;
    console.log('✅ MongoDB connection closed');
  }

  if (dbDriver === 'sqlite' && pool) {
    await pool.close();
    pool = null;
    console.log('✅ SQLite connection closed');
  }
}

// SQLite table creation
async function createTablesSqlite(db) {
  // You can reuse your existing createTablesSqlite function
  // from your current AdminBlog code
}

