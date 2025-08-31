import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from config.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../config.env') });

let mongoClient = null;

// MongoDB configuration
const mongoConfig = {
  uri: process.env.MONGO_URI || 'mongodb://localhost:27017',
  dbName: process.env.MONGODB_DB_NAME || 'mad2moi_blog'
};

// Connect to MongoDB
export async function connectToMongoDB() {
  try {
    if (mongoClient) return mongoClient;

    // Import MongoDB dynamically
    const { MongoClient } = await import('mongodb');

    mongoClient = new MongoClient(mongoConfig.uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await mongoClient.connect();
    console.log('✅ Blog MongoDB connection established');

    // Test the connection
    const db = mongoClient.db(mongoConfig.dbName);
    await db.admin().ping();
    console.log('✅ Blog MongoDB ping successful');

    return mongoClient;
  } catch (error) {
    console.error('❌ Blog MongoDB connection failed:', error);
    throw error;
  }
}

// Get MongoDB client
export function getMongoClient() {
  if (!mongoClient) {
    throw new Error('MongoDB not connected. Call connectToMongoDB() first.');
  }
  return mongoClient;
}

// Get MongoDB database
export function getMongoDB() {
  if (!mongoClient) {
    throw new Error('MongoDB not connected. Call connectToMongoDB() first.');
  }
  return mongoClient.db(mongoConfig.dbName);
}

// Close MongoDB connection
export async function closeMongoDB() {
  try {
    if (mongoClient) {
      await mongoClient.close();
      mongoClient = null;
      console.log('✅ Blog MongoDB connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing Blog MongoDB connection:', error);
  }
}
