import { initializeDatabase, executeQuery, closeDatabase } from '../src/utils/database.js';

async function addSyncTable() {
  try {
    console.log('🔄 Adding blog sync notifications table...');
    
    await initializeDatabase();
    
    // Create the blog_sync_notifications table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS blog_sync_notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id INT NOT NULL,
        action ENUM('create', 'update', 'delete') NOT NULL DEFAULT 'update',
        slug VARCHAR(200),
        status ENUM('pending', 'processing', 'processed', 'failed') DEFAULT 'pending',
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        processed_at TIMESTAMP NULL,
        INDEX idx_status (status),
        INDEX idx_article_id (article_id),
        INDEX idx_created_at (created_at)
      )
    `;
    
    await executeQuery(createTableQuery);
    console.log('✅ Blog sync notifications table created successfully');
    
    // Add any additional indexes or constraints
    const addIndexesQuery = `
      ALTER TABLE blog_sync_notifications 
      ADD INDEX idx_status_created (status, created_at),
      ADD INDEX idx_action_status (action, status)
    `;
    
    try {
      await executeQuery(addIndexesQuery);
      console.log('✅ Additional indexes added successfully');
    } catch (indexError) {
      // Indexes might already exist, that's okay
      console.log('ℹ️ Additional indexes already exist or not needed');
    }
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Error adding sync table:', error);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

// Run the migration
addSyncTable();
