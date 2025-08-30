import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB Atlas connection configuration - Use environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'mad2moi_blog';

let client;
let db;

/**
 * Connect to MongoDB Atlas
 */
export async function connectToMongoDB() {
  try {
    if (!client) {
      // Create a MongoClient with MongoClientOptions object to set the Stable API version
      client = new MongoClient(MONGODB_URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      
      await client.connect();
      console.log('✅ Connected to MongoDB Atlas');
      
      db = client.db(DB_NAME);
      console.log(`✅ Using database: ${DB_NAME}`);
      
      // Send a ping to confirm successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
    }
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Get database instance
 */
export function getDB() {
  if (!db) {
    throw new Error('Database not connected. Call connectToMongoDB() first.');
  }
  return db;
}

/**
 * Get collection
 */
export function getCollection(collectionName) {
  const db = getDB();
  return db.collection(collectionName);
}

/**
 * Close MongoDB connection
 */
export async function closeMongoDBConnection() {
  try {
    if (client) {
      await client.close();
      console.log('✅ MongoDB connection closed');
      client = null;
      db = null;
    }
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
}

/**
 * Test MongoDB connection
 */
export async function testMongoDBConnection() {
  try {
    const { client, db } = await connectToMongoDB();
    
    // Test the connection
    await db.admin().ping();
    console.log('✅ MongoDB ping successful');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📚 Available collections:', collections.map(c => c.name));
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB test failed:', error);
    return false;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeMongoDBConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeMongoDBConnection();
  process.exit(0);
});
