#!/bin/bash

# Setup script for Article Synchronization System
# This script sets up the database and initializes the sync between admin panel and blog

echo "🚀 Setting up Article Synchronization System..."
echo "================================================"

# Check if MySQL is running
echo "📊 Checking MySQL connection..."
if ! mysqladmin ping -h"localhost" -u"root" --silent; then
    echo "❌ MySQL is not running. Please start MySQL and try again."
    exit 1
fi
echo "✅ MySQL is running"

# Navigate to admin panel directory
cd adminblog

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing admin panel dependencies..."
    npm install
fi

# Initialize database and sync
echo "🔧 Initializing database and sync system..."
node scripts/init-sync.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start the admin panel: npm run dev"
    echo "2. Start the blog: cd ../blog && npm run dev"
    echo "3. Create articles in the admin panel"
    echo "4. Articles will automatically sync to the blog when published"
    echo ""
    echo "To test the sync:"
    echo "node scripts/test-sync.js"
else
    echo "❌ Setup failed. Please check the error messages above."
    exit 1
fi

