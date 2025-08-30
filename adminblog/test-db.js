import { initializeDatabase, executeQuery, closeDatabase } from './src/utils/database.js';

async function testDatabase() {
  try {
    console.log('🚀 Testing database connection...');
    
    // Initialize database
    await initializeDatabase();
    console.log('✅ Database initialized');
    
    // Test if chat tables exist
    console.log('🔍 Checking chat tables...');
    
    try {
      const conversations = await executeQuery('SELECT COUNT(*) as count FROM chat_conversations');
      console.log('✅ chat_conversations table exists, count:', conversations[0].count);
    } catch (error) {
      console.log('❌ chat_conversations table error:', error.message);
    }
    
    try {
      const messages = await executeQuery('SELECT COUNT(*) as count FROM chat_messages');
      console.log('✅ chat_messages table exists, count:', messages[0].count);
    } catch (error) {
      console.log('❌ chat_messages table error:', error.message);
    }
    
    // Test inserting a conversation
    console.log('📝 Testing conversation insertion...');
    try {
      const result = await executeQuery(
        'INSERT INTO chat_conversations (session_id, visitor_name, visitor_email, status) VALUES (?, ?, ?, ?)',
        ['test_session_' + Date.now(), 'Test User', 'test@example.com', 'active']
      );
      console.log('✅ Conversation inserted, ID:', result.insertId);
      
      // Test inserting a message
      console.log('💬 Testing message insertion...');
      const messageResult = await executeQuery(
        'INSERT INTO chat_messages (conversation_id, sender_type, message) VALUES (?, ?, ?)',
        [result.insertId, 'visitor', 'Test message']
      );
      console.log('✅ Message inserted, ID:', messageResult.insertId);
      
      // Test fetching
      console.log('📖 Testing data retrieval...');
      const fetchedMessages = await executeQuery(
        'SELECT * FROM chat_messages WHERE conversation_id = ?',
        [result.insertId]
      );
      console.log('✅ Retrieved messages:', fetchedMessages);
      
    } catch (error) {
      console.log('❌ Insert/select test failed:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await closeDatabase();
    console.log('🔌 Database connection closed');
  }
}

testDatabase();






