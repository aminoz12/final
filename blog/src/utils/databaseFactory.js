import mysql from 'mysql2/promise';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import fsp from 'fs/promises';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../config.env') });

// Database configuration
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

// MongoDB configuration
const mongoConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: process.env.MONGODB_DB_NAME || 'mad2moi_blog'
};

// Driver: mysql (default) or sqlite
const dbDriver = (process.env.DB_DRIVER || 'mysql').toLowerCase();

// Create connection pool
let pool = null; // MySQL pool or SQLite handle
let mongoClient = null; // MongoDB client

// Initialize database connection
export async function initializeDatabaseFactory() {
  try {
    // In production, use MongoDB
    if (process.env.NODE_ENV === 'production') {
      if (mongoClient) return mongoClient;
      
      // Import MongoDB dynamically to avoid issues in development
      const { MongoClient } = await import('mongodb');
      
      mongoClient = new MongoClient(mongoConfig.uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      
      await mongoClient.connect();
      console.log('✅ Blog MongoDB connection established');
      return mongoClient;
    }

    // In development, use existing MySQL/SQLite logic
    if (pool) return pool;

    if (dbDriver === 'sqlite') {
      const dbDir = path.join(__dirname, '../../../database');
      const dbFile = path.join(dbDir, `${dbConfig.database}.sqlite`);
      
      if (!fs.existsSync(dbDir)) {
        await fsp.mkdir(dbDir, { recursive: true });
      }
      
      pool = await open({ filename: dbFile, driver: sqlite3.Database });
      await pool.exec('PRAGMA foreign_keys = ON;');
      await pool.exec('PRAGMA journal_mode = WAL;');
      console.log('✅ Blog SQLite connection established');
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

// Execute a query with automatic database selection
export async function executeQueryFactory(query, params = []) {
  try {
    console.log('🔍 Debug: Executing query:', query);
    console.log('🔍 Debug: Query params:', params);
    
    await initializeDatabaseFactory();
    
    // In production, use MongoDB
    if (process.env.NODE_ENV === 'production') {
      const db = mongoClient.db(mongoConfig.dbName);
      
      // Basic SQL to MongoDB query conversion for common operations
      const upperQuery = query.trim().toUpperCase();
      
      if (upperQuery.startsWith('SELECT')) {
        // Handle SELECT queries for articles, categories, users
        if (query.includes('FROM articles')) {
          const collection = db.collection('articles');
          const pipeline = [];
          
          // Basic WHERE clause handling for status = 'published'
          if (query.includes("WHERE a.status = 'published'")) {
            pipeline.push({ $match: { status: 'published' } });
          }
          
          // Basic ORDER BY handling
          if (query.includes('ORDER BY a.published_at DESC')) {
            pipeline.push({ $sort: { published_at: -1, created_at: -1 } });
          }
          
          // Basic JOIN simulation for categories and users
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
                category_name: { $arrayElemAt: ['$category.name', 0] },
                category_slug: { $arrayElemAt: ['$category.slug', 0] },
                category_color: { $arrayElemAt: ['$category.color', 0] },
                category_icon: { $arrayElemAt: ['$category.icon', 0] }
              }
            });
          }
          
          if (query.includes('LEFT JOIN users')) {
            pipeline.push({
              $lookup: {
                from: 'users',
                localField: 'author_id',
                foreignField: '_id',
                as: 'user'
              }
            });
            pipeline.push({
              $addFields: {
                author_name: {
                  $cond: {
                    if: { $and: [{ $ne: ['$user.first_name', null] }, { $ne: ['$user.last_name', null] }] },
                    then: { $concat: ['$user.first_name', ' ', '$user.last_name'] },
                    else: '$user.username'
                  }
                }
              }
            });
          }
          
          const result = await collection.aggregate(pipeline).toArray();
          console.log('🔍 Debug: MongoDB result:', result);
          return result;
        }
        
        if (query.includes('FROM categories')) {
          const collection = db.collection('categories');
          const result = await collection.find({}).toArray();
          console.log('🔍 Debug: MongoDB categories result:', result);
          return result;
        }
        
        if (query.includes('FROM users')) {
          const collection = db.collection('users');
          const result = await collection.find({}).toArray();
          console.log('🔍 Debug: MongoDB users result:', result);
          return result;
        }
        
        // Default fallback
        const collection = db.collection('articles');
        const result = await collection.find({}).toArray();
        return result;
      }
      
      if (upperQuery.startsWith('INSERT')) {
        // Handle INSERT queries
        const collection = db.collection('articles');
        const result = await collection.insertOne(params[0]);
        return result;
      }
      
      if (upperQuery.startsWith('UPDATE')) {
        // Handle UPDATE queries
        const collection = db.collection('articles');
        const result = await collection.updateOne(
          { _id: params[0] },
          { $set: params[1] }
        );
        return result;
      }
      
      if (upperQuery.startsWith('DELETE')) {
        // Handle DELETE queries
        const collection = db.collection('articles');
        const result = await collection.deleteOne({ _id: params[0] });
        return result;
      }
      
      if (upperQuery.startsWith('SELECT COUNT(*)')) {
        // Handle COUNT queries
        if (query.includes('FROM categories')) {
          const collection = db.collection('categories');
          const count = await collection.countDocuments();
          return [{ count }];
        }
        if (query.includes('FROM articles')) {
          const collection = db.collection('articles');
          const count = await collection.countDocuments();
          return [{ count }];
        }
        return [{ count: 0 }];
      }
    }
    
    // In development, use existing MySQL/SQLite logic
    if (dbDriver === 'sqlite') {
      let translated = query
        .replace(/NOW\(\)/gi, 'CURRENT_TIMESTAMP')
        .replace(/INSERT\s+IGNORE/gi, 'INSERT OR IGNORE');
      
      const upper = translated.trim().toUpperCase();
      
      if (upper.startsWith('SELECT')) {
        const result = await pool.all(translated, params);
        return result;
      }
      if (upper.startsWith('INSERT')) {
        const result = await pool.run(translated, params);
        return result;
      }
      if (upper.startsWith('UPDATE')) {
        const result = await pool.run(translated, params);
        return result;
      }
      if (upper.startsWith('DELETE')) {
        const result = await pool.run(translated, params);
        return result;
      }
    } else {
      // MySQL
      const [rows] = await pool.execute(query, params);
      return rows;
    }
  } catch (error) {
    console.error('❌ Query execution error:', error);
    throw error;
  }
}

// Close database connections
export async function closeDatabaseFactory() {
  try {
    if (mongoClient) {
      await mongoClient.close();
      mongoClient = null;
      console.log('✅ MongoDB connection closed');
    }
    if (pool) {
      if (dbDriver === 'sqlite') {
        await pool.close();
      } else {
        await pool.end();
      }
      pool = null;
      console.log('✅ Database connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing database:', error);
  }
}

// Get database connection (for backward compatibility)
export function getConnectionPool() {
  if (process.env.NODE_ENV === 'production') {
    if (!mongoClient) {
      throw new Error('MongoDB not initialized. Call initializeDatabaseFactory() first.');
    }
    return mongoClient;
  }
  
  if (!pool) {
    throw new Error('Database not initialized. Call initializeDatabaseFactory() first.');
  }
  return pool;
}
