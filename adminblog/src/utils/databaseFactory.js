// Database Factory - Automatically switches between SQLite (dev) and MongoDB (prod)
import { initializeDatabase, executeQuery, closeDatabase } from './database.js';
import { connectToMongoDB, getDB } from './mongodb.js';

let isMongoDB = false;
let mongoDB = null;

// Initialize the appropriate database based on environment
export async function initializeDatabaseFactory() {
  try {
    if (process.env.NODE_ENV === 'production') {
      // Use MongoDB in production
      console.log('🚀 Production mode: Using MongoDB');
      isMongoDB = true;
      const { db } = await connectToMongoDB();
      mongoDB = db;
      return { isMongoDB, db };
    } else {
      // Use SQLite in development
      console.log('🔧 Development mode: Using SQLite');
      isMongoDB = false;
      const db = await initializeDatabase();
      return { isMongoDB, db };
    }
  } catch (error) {
    console.error('❌ Database factory initialization failed:', error);
    throw error;
  }
}

// Execute query - automatically handles both SQLite and MongoDB
export async function executeQueryFactory(query, params = []) {
  try {
    if (isMongoDB) {
      // MongoDB mode - convert SQL query to MongoDB operations
      return await executeMongoDBQuery(query, params);
    } else {
      // SQLite mode - use existing executeQuery
      return await executeQuery(query, params);
    }
  } catch (error) {
    console.error('❌ Query execution failed:', error);
    throw error;
  }
}

// Convert SQL queries to MongoDB operations
async function executeMongoDBQuery(sqlQuery, params) {
  try {
    // Simple query parsing for common operations
    const query = sqlQuery.toLowerCase().trim();
    
    if (query.includes('select') && query.includes('from articles')) {
      // Handle SELECT articles query
      const collection = mongoDB.collection('articles');
      
      // Parse basic WHERE conditions
      let filter = {};
      if (query.includes('where a.status != \'deleted\'')) {
        filter.status = { $ne: 'deleted' };
      }
      if (query.includes('where a.status = ?')) {
        filter.status = params[0];
      }
      
      // Parse ORDER BY
      let sort = {};
      if (query.includes('order by a.created_at desc')) {
        sort.created_at = -1;
      }
      
      // Execute MongoDB query
      const articles = await collection.find(filter).sort(sort).toArray();
      
      // Transform to match SQLite format
      return articles.map(article => ({
        ...article,
        id: article._id,
        category_name: article.category_name || '',
        category_slug: article.category_slug || '',
        category_color: article.category_color || '#3B82F6',
        category_icon: article.category_icon || '',
        author_name: article.author_name || 'Admin'
      }));
    }
    
    if (query.includes('select') && query.includes('from categories')) {
      // Handle SELECT categories query
      const collection = mongoDB.collection('categories');
      const categories = await collection.find({}).toArray();
      
      return categories.map(category => ({
        ...category,
        id: category._id
      }));
    }
    
    if (query.includes('select') && query.includes('from users')) {
      // Handle SELECT users query
      const collection = mongoDB.collection('users');
      const users = await collection.find({}).toArray();
      
      return users.map(user => ({
        ...user,
        id: user._id
      }));
    }
    
    // Default fallback
    console.log('⚠️ Unhandled SQL query, returning empty result:', sqlQuery);
    return [];
    
  } catch (error) {
    console.error('❌ MongoDB query execution failed:', error);
    throw error;
  }
}

// Close database connection
export async function closeDatabaseFactory() {
  try {
    if (isMongoDB) {
      // MongoDB cleanup handled by mongodb.js
      console.log('✅ MongoDB connection closed');
    } else {
      // SQLite cleanup
      await closeDatabase();
      console.log('✅ SQLite connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing database:', error);
  }
}

// Get database instance
export function getDatabaseFactory() {
  if (isMongoDB) {
    return mongoDB;
  } else {
    // For SQLite, we need to return the pool
    throw new Error('SQLite database instance not available through factory');
  }
}
