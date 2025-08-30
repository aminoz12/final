@echo off
REM Setup script for Article Synchronization System (Windows)
REM This script sets up the database and initializes the sync between admin panel and blog

echo 🚀 Setting up Article Synchronization System...
echo ================================================

REM Check if MySQL is running
echo 📊 Checking MySQL connection...
mysqladmin ping -h"localhost" -u"root" --silent >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL is not running. Please start MySQL and try again.
    pause
    exit /b 1
)
echo ✅ MySQL is running

REM Navigate to admin panel directory
cd adminblog

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing admin panel dependencies...
    npm install
)

REM Initialize database and sync
echo 🔧 Initializing database and sync system...
node scripts/init-sync.js

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Setup completed successfully!
    echo.
    echo Next steps:
    echo 1. Start the admin panel: npm run dev
    echo 2. Start the blog: cd ../blog ^&^& npm run dev
    echo 3. Create articles in the admin panel
    echo 4. Articles will automatically sync to the blog when published
    echo.
    echo To test the sync:
    echo node scripts/test-sync.js
) else (
    echo ❌ Setup failed. Please check the error messages above.
    pause
    exit /b 1
)

pause

