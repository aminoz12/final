// Test environment variables loading
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Testing environment variables...');
console.log('  Current directory:', __dirname);
console.log('  Config file path:', path.join(__dirname, 'config.env'));

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config.env') });

console.log('\n🔧 Environment variables after loading:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  DB_DRIVER:', process.env.DB_DRIVER);
console.log('  DB_HOST:', process.env.DB_HOST);
console.log('  DB_PORT:', process.env.DB_PORT);
console.log('  DB_USER:', process.env.DB_USER);
console.log('  DB_NAME:', process.env.DB_NAME);

console.log('\n🔧 Raw process.env keys:');
console.log('  All keys:', Object.keys(process.env).filter(key => key.startsWith('DB_')));


