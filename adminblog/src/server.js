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
    // Connect to MongoDB
    await connectToMongoDB();
    console.log('✅ MongoDB connected successfully');
    
    // Start the server
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Start the server
startServer();

export default server;


