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

// Get port from environment or fallback
const PORT = process.env.PORT || 3000;

// Create HTTP server using Astro handler
const server = createServer(handler);

async function startServer() {
  try {
    // Bind server to 0.0.0.0 for Render
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Blog server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Server bound to 0.0.0.0:${PORT}`);
    });

    // Connect to MongoDB if URI is provided
    if (process.env.MONGO_URI) {
      try {
        await connectToMongoDB(process.env.MONGO_URI);
        console.log('✅ Blog MongoDB connected successfully');
      } catch (mongoError) {
        console.error('❌ Failed to connect to MongoDB:', mongoError.message);
        console.log('📝 Blog will work with static content only');
      }
    } else {
      console.warn('⚠️ No MONGO_URI provided. Skipping MongoDB connection.');
    }
  } catch (error) {
    console.error('❌ Failed to start blog server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
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

startServer();

export default server;
