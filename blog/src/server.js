import { handler } from '../dist/server/entry.mjs';
import { createServer } from 'http';
import { connectToMongoDB } from './utils/mongodb.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get port from environment or use default
const port = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(handler);

// Initialize MongoDB connection
async function startServer() {
  try {
    // Connect to MongoDB in production
    if (process.env.NODE_ENV === 'production') {
      await connectToMongoDB();
      console.log('✅ Blog MongoDB connected successfully');
    }

    // Start the server
    server.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Blog server running on port ${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Server bound to 0.0.0.0:${port}`);
    });
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
