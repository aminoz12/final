import { testMongoDBConnection, getCollection, closeMongoDBConnection } from '../src/utils/mongodb.js';

async function testMongoDB() {
  console.log('🧪 Testing MongoDB Atlas connection and operations...\n');
  
  try {
    // Test connection
    const isConnected = await testMongoDBConnection();
    if (!isConnected) {
      console.log('❌ MongoDB connection failed');
      return;
    }
    
    // Test basic operations
    const usersCollection = getCollection('users');
    
    // Test insert
    const testUser = {
      username: 'test_user',
      email: 'test@example.com',
      createdAt: new Date(),
      test: true,
      source: 'MongoDB Atlas Test'
    };
    
    console.log('📝 Testing insert operation...');
    const insertResult = await usersCollection.insertOne(testUser);
    console.log('✅ Insert successful:', insertResult.insertedId);
    
    // Test find
    console.log('🔍 Testing find operation...');
    const foundUser = await usersCollection.findOne({ username: 'test_user' });
    console.log('✅ Find successful:', foundUser);
    
    // Test update
    console.log('✏️ Testing update operation...');
    const updateResult = await usersCollection.updateOne(
      { username: 'test_user' },
      { $set: { updated: true, updatedAt: new Date() } }
    );
    console.log('✅ Update successful:', updateResult.modifiedCount, 'document(s) modified');
    
    // Test delete (clean up test data)
    console.log('🗑️ Cleaning up test data...');
    const deleteResult = await usersCollection.deleteOne({ username: 'test_user' });
    console.log('✅ Delete successful:', deleteResult.deletedCount, 'document(s) deleted');
    
    console.log('\n🎉 All MongoDB Atlas tests passed successfully!');
    console.log('🌐 Connected to: cluster0.jzw94.mongodb.net');
    
  } catch (error) {
    console.error('❌ MongoDB test error:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your internet connection');
    console.log('2. Verify MongoDB Atlas credentials');
    console.log('3. Check if your IP is whitelisted in Atlas');
    console.log('4. Ensure the cluster is running');
  } finally {
    // Close connection
    await closeMongoDBConnection();
    console.log('\n👋 MongoDB Atlas connection closed');
  }
}

// Run the test
testMongoDB().catch(console.error);
