import { testMongoDBConnection, getCollection, closeMongoDBConnection } from '../src/utils/mongodb.js';

async function testBlogMongoDB() {
  console.log('🧪 Testing Blog MongoDB Atlas connection and operations...\n');
  
  try {
    // Test connection
    const isConnected = await testMongoDBConnection();
    if (!isConnected) {
      console.log('❌ Blog MongoDB connection failed');
      return;
    }
    
    // Test basic operations
    const articlesCollection = getCollection('articles');
    
    // Test insert
    const testArticle = {
      title: 'Test Article from Blog',
      slug: 'test-article-from-blog',
      content: 'This is a test article created by the blog system',
      createdAt: new Date(),
      test: true,
      source: 'Blog MongoDB Test'
    };
    
    console.log('📝 Testing insert operation...');
    const insertResult = await articlesCollection.insertOne(testArticle);
    console.log('✅ Insert successful:', insertResult.insertedId);
    
    // Test find
    console.log('🔍 Testing find operation...');
    const foundArticle = await articlesCollection.findOne({ slug: 'test-article-from-blog' });
    console.log('✅ Find successful:', foundArticle);
    
    // Test update
    console.log('✏️ Testing update operation...');
    const updateResult = await articlesCollection.updateOne(
      { slug: 'test-article-from-blog' },
      { $set: { updated: true, updatedAt: new Date() } }
    );
    console.log('✅ Update successful:', updateResult.modifiedCount, 'document(s) modified');
    
    // Test delete (clean up test data)
    console.log('🗑️ Cleaning up test data...');
    const deleteResult = await articlesCollection.deleteOne({ slug: 'test-article-from-blog' });
    console.log('✅ Delete successful:', deleteResult.deletedCount, 'document(s) deleted');
    
    console.log('\n🎉 All Blog MongoDB Atlas tests passed successfully!');
    console.log('🌐 Connected to: cluster0.jzw94.mongodb.net');
    console.log('📊 Sharing database with admin panel');
    
  } catch (error) {
    console.error('❌ Blog MongoDB test error:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your internet connection');
    console.log('2. Verify MongoDB Atlas credentials');
    console.log('3. Check if your IP is whitelisted in Atlas');
    console.log('4. Ensure the cluster is running');
  } finally {
    // Close connection
    await closeMongoDBConnection();
    console.log('\n👋 Blog MongoDB Atlas connection closed');
  }
}

// Run the test
testBlogMongoDB().catch(console.error);
