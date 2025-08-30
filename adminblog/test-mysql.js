// Test MySQL connection directly
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config.env') });

async function testMySQL() {
  try {
    console.log('🔧 Testing MySQL connection...');
    console.log('  DB_HOST:', process.env.DB_HOST);
    console.log('  DB_PORT:', process.env.DB_PORT);
    console.log('  DB_USER:', process.env.DB_USER);
    console.log('  DB_NAME:', process.env.DB_NAME);
    
    // Test connection without database first
    const tempConfig = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    };
    
    console.log('\n🔧 Attempting to connect to MySQL server...');
    const connection = await mysql.createConnection(tempConfig);
    console.log('✅ Connected to MySQL server successfully');
    
    // Test if we can create and use the database
    console.log('\n🔧 Testing database creation...');
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log('✅ Database created/verified successfully');
    
    // Use the database
    await connection.query(`USE ${process.env.DB_NAME}`);
    console.log('✅ Database selected successfully');
    
    // Test simple query
    console.log('\n🔧 Testing simple query...');
    const [rows] = await connection.execute('SELECT 1 as test, NOW() as timestamp');
    console.log('✅ Query executed successfully:', rows);
    
    // Check if categories table exists
    console.log('\n🔧 Checking if categories table exists...');
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME, TABLE_ROWS 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories'
    `, [process.env.DB_NAME]);
    
    if (tables.length > 0) {
      console.log('✅ Categories table exists:', tables);
      
      // Check table structure
      const [structure] = await connection.execute('DESCRIBE categories');
      console.log('✅ Categories table structure:', structure);
      
      // Count categories
      const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM categories');
      console.log('✅ Categories count:', countResult[0].count);
    } else {
      console.log('❌ Categories table does not exist');
    }
    
    await connection.end();
    console.log('\n✅ MySQL test completed successfully');
    
  } catch (error) {
    console.error('❌ MySQL test failed:', error);
    console.error('❌ Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
  }
}

// Run the test
testMySQL();


