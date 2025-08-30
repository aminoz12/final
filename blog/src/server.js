import { handler } from '../dist/server/entry.mjs';
import { createServer } from 'http';
import { connectToMongoDB } from './utils/mongodb.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from config.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../config.env') });

// Get port from environment or use default
const port = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(handler);

// Initialize MongoDB connection
async function startServer() {
  try {
    // Start the server first (so Render can detect the port)
    server.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Blog server running on port ${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Server bound to 0.0.0.0:${port}`);
    });

    // Try to connect to MongoDB in production (but don't fail if it doesn't work)
    if (process.env.NODE_ENV === 'production') {
      try {
        await connectToMongoDB();
        console.log('✅ Blog MongoDB connected successfully');
      } catch (mongoError) {
        console.warn('⚠️ MongoDB connection failed, continuing without database:', mongoError.message);
        console.log('📝 Blog will work with static content only');
      }
    }
  } catch (error) {
    console.error('❌ Failed to start blog server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down blog server...');
  server.close(() => {
    console.log('✅ Blog server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down blog server...');
  server.close(() => {
    console.log('✅ Blog server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

export default server;
