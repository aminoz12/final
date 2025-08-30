export { renderers } from '../../renderers.mjs';

// Initialize default categories endpoint
async function POST() {
  try {
    console.log('🔧 Init Categories: Starting category initialization...');
    
    const { initializeDatabase, executeQuery, closeDatabase } = await import('../../chunks/database_Cczcxvx-.mjs');
    
    // Initialize database connection
    await initializeDatabase();
    
    // Check if categories table exists and has data
    const existingCategories = await executeQuery('SELECT COUNT(*) as count FROM categories');
    const count = existingCategories[0].count;
    
    console.log('🔧 Init Categories: Found', count, 'existing categories');
    
    if (count === 0) {
      // Create default categories
      const defaultCategories = [
        {
          name: 'Général',
          slug: 'general',
          description: 'Catégorie générale pour tous les articles',
          color: '#3B82F6',
          icon: '📁',
          sort_order: 0
        },
        {
          name: 'Technologie',
          slug: 'technologie',
          description: 'Articles sur la technologie et l\'innovation',
          color: '#10B981',
          icon: '💻',
          sort_order: 1
        },
        {
          name: 'Lifestyle',
          slug: 'lifestyle',
          description: 'Articles sur le mode de vie et le bien-être',
          color: '#F59E0B',
          icon: '🌟',
          sort_order: 2
        },
        {
          name: 'Santé',
          slug: 'sante',
          description: 'Articles sur la santé et le bien-être',
          color: '#EF4444',
          icon: '❤️',
          sort_order: 3
        },
        {
          name: 'Business',
          slug: 'business',
          description: 'Articles sur l\'entrepreneuriat et les affaires',
          color: '#8B5CF6',
          icon: '💼',
          sort_order: 4
        }
      ];
      
      for (const category of defaultCategories) {
        await executeQuery(`
          INSERT INTO categories (name, slug, description, color, icon, is_active, sort_order)
          VALUES (?, ?, ?, ?, ?, 1, ?)
        `, [category.name, category.slug, category.description, category.color, category.icon, category.sort_order]);
        
        console.log('✅ Created category:', category.name);
      }
      
      console.log('✅ All default categories created successfully');
    } else {
      console.log('ℹ️ Categories already exist, no initialization needed');
    }
    
    // Close database connection
    await closeDatabase();
    
    return new Response(JSON.stringify({
      success: true,
      message: count === 0 ? 'Default categories created successfully' : 'Categories already exist',
      existingCount: count
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('❌ Init Categories: Error initializing categories:', error);
    
    try {
      const { closeDatabase } = await import('../../chunks/database_Cczcxvx-.mjs');
      await closeDatabase();
    } catch (closeError) {
      console.error('❌ Init Categories: Error closing database:', closeError);
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to initialize categories',
      details: error.message
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
