import { executeQuery, initializeDatabase } from '../../chunks/database_Cczcxvx-.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
export { renderers } from '../../renderers.mjs';

const __filename$1 = fileURLToPath(import.meta.url);
path.dirname(__filename$1);

/**
 * Blog Sync Service
 * Handles synchronization between admin panel and blog
 */
class BlogSyncService {
  
  /**
   * Sync article to blog when created/updated
   */
  static async syncArticleToBlog(articleId) {
    try {
      // Get the article with all related data
      const article = await this.getArticleWithDetails(articleId);
      
      if (!article) {
        console.error(`❌ Article ${articleId} not found for sync`);
        return false;
      }
      
      // If article is published, sync to blog
      if (article.status === 'published') {
        // Create the article file in the blog system
        await this.createArticleFile(article);
        
        // Trigger blog rebuild
        await this.triggerBlogRebuild(article);
        console.log(`✅ Article ${articleId} synced to blog successfully`);
        return true;
      } else {
        console.log(`ℹ️ Article ${articleId} is not published, skipping blog sync`);
        return true;
      }
      
    } catch (error) {
      console.error('❌ Error syncing article to blog:', error);
      return false;
    }
  }
  
  /**
   * Remove article from blog when deleted
   */
  static async removeArticleFromBlog(articleId) {
    try {
      // Get article details before deletion
      const article = await this.getArticleWithDetails(articleId);
      
      if (article) {
        // Remove the article file from the blog system
        await this.removeArticleFile(article);
      }
      
      // Trigger blog rebuild to remove the article
      await this.triggerBlogRebuild({ id: articleId, action: 'delete' });
      console.log(`✅ Article ${articleId} removed from blog successfully`);
      return true;
      
    } catch (error) {
      console.error('❌ Error removing article from blog:', error);
      return false;
    }
  }
  
  /**
   * Create article file in the blog system
   */
  static async createArticleFile(article) {
    try {
      // No need to create static files anymore - articles are served dynamically from database
      console.log(`📝 Article ${article.slug} will be served dynamically from database`);
      return true;
      
    } catch (error) {
      console.error('❌ Error processing article:', error);
      throw error;
    }
  }
  
  /**
   * Remove article file from the blog system
   */
  static async removeArticleFile(article) {
    try {
      // No need to remove static files anymore - articles are served dynamically from database
      console.log(`🗑️ Article ${article.slug} will be removed dynamically from database`);
      return true;
      
    } catch (error) {
      console.error('❌ Error processing article removal:', error);
      throw error;
    }
  }
  
  /**
   * Get article with all related details
   */
  static async getArticleWithDetails(articleId) {
    try {
      const query = `
        SELECT 
          a.*,
          c.name as category_name,
          c.slug as category_slug,
          c.color as category_color,
          u.username as author_name
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.id = ?
      `;
      
      const articles = await executeQuery(query, [articleId]);
      return articles.length > 0 ? articles[0] : null;
      
    } catch (error) {
      console.error('❌ Error getting article details:', error);
      return null;
    }
  }
  
  /**
   * Trigger blog rebuild via webhook
   */
  static async triggerBlogRebuild(article) {
    try {
      // Option 1: Webhook to trigger rebuild
      if (process.env.BLOG_REBUILD_WEBHOOK) {
        await this.callRebuildWebhook(article);
      }
      
      // Option 2: File-based sync (for development)
      else if (process.env.NODE_ENV === 'development') {
        await this.syncToFileSystem(article);
      }
      
      // Option 3: Database notification (for real-time updates)
      else {
        await this.notifyBlogUpdate(article);
      }
      
      return true;
      
    } catch (error) {
      console.error('❌ Error triggering blog rebuild:', error);
      return false;
    }
  }
  
  /**
   * Call webhook to trigger blog rebuild
   */
  static async callRebuildWebhook(article) {
    try {
      const response = await fetch(process.env.BLOG_REBUILD_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BLOG_REBUILD_TOKEN || ''}`
        },
        body: JSON.stringify({
          action: article.action || 'update',
          articleId: article.id,
          slug: article.slug,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }
      
      console.log('✅ Blog rebuild webhook called successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error calling rebuild webhook:', error);
      throw error;
    }
  }
  
  /**
   * Sync to file system (development mode)
   */
  static async syncToFileSystem(article) {
    try {
      // This creates/updates the actual article files for the blog
      if (article.action === 'delete') {
        await this.removeArticleFile(article);
      } else {
        await this.createArticleFile(article);
      }
      
      console.log('📝 File system sync completed for article:', article.slug);
      return true;
      
    } catch (error) {
      console.error('❌ Error syncing to file system:', error);
      throw error;
    }
  }
  
  /**
   * Notify blog of update via database
   */
  static async notifyBlogUpdate(article) {
    try {
      // Cross-dialect upsert: MySQL uses ON DUPLICATE KEY, SQLite uses INSERT OR IGNORE then UPDATE
      const insertRes = await executeQuery(
        `INSERT IGNORE INTO blog_sync_notifications (article_id, action, slug, status, created_at)
         VALUES (?, ?, ?, 'pending', NOW())`,
        [article.id, article.action || 'update', article.slug]
      );
      // If already existed, perform update
      await executeQuery(
        `UPDATE blog_sync_notifications SET action = ?, status = 'pending', updated_at = NOW() WHERE slug = ?`,
        [article.action || 'update', article.slug]
      );
      
      console.log('✅ Blog update notification created');
      return true;
      
    } catch (error) {
      console.error('❌ Error creating blog notification:', error);
      throw error;
    }
  }
  
  /**
   * Get pending blog sync notifications
   */
  static async getPendingSyncNotifications() {
    try {
      const query = `
        SELECT * FROM blog_sync_notifications 
        WHERE status = 'pending' 
        ORDER BY created_at ASC
      `;
      
      return await executeQuery(query);
      
    } catch (error) {
      console.error('❌ Error getting pending sync notifications:', error);
      return [];
    }
  }
  
  /**
   * Mark sync notification as processed
   */
  static async markSyncNotificationProcessed(notificationId) {
    try {
      const query = `
        UPDATE blog_sync_notifications 
        SET status = 'processed', processed_at = NOW() 
        WHERE id = ?
      `;
      
      await executeQuery(query, [notificationId]);
      return true;
      
    } catch (error) {
      console.error('❌ Error marking notification as processed:', error);
      return false;
    }
  }
  
  /**
   * Bulk sync all published articles
   */
  static async bulkSyncAllArticles() {
    try {
      const query = `
        SELECT id FROM articles 
        WHERE status = 'published'
        ORDER BY updated_at DESC
      `;
      
      const articles = await executeQuery(query);
      let successCount = 0;
      let errorCount = 0;
      
      for (const article of articles) {
        try {
          const success = await this.syncArticleToBlog(article.id);
          if (success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error(`❌ Error syncing article ${article.id}:`, error);
          errorCount++;
        }
      }
      
      console.log(`✅ Bulk sync completed: ${successCount} success, ${errorCount} errors`);
      return { successCount, errorCount };
      
    } catch (error) {
      console.error('❌ Error in bulk sync:', error);
      throw error;
    }
  }
}

/**
 * Image Handler Utility
 * Handles image processing, validation, and storage
 */


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Image storage configuration
const IMAGE_STORAGE_PATH = path.join(process.cwd(), 'public/uploads');
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validate image file
 */
function validateImage(file) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.' };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: 'File size too large. Maximum size is 10MB.' };
  }

  return { valid: true };
}

/**
 * Generate unique filename
 */
function generateImageFilename(originalName, extension = 'jpg') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}_${random}.${extension}`;
}

/**
 * Save image to local storage
 */
async function saveImageToLocal(file) {
  try {
    console.log('📁 saveImageToLocal called with file:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    console.log('🔍 IMAGE_STORAGE_PATH:', IMAGE_STORAGE_PATH);
    console.log('🔍 process.cwd():', process.cwd());
    console.log('🔍 __dirname:', __dirname);
    
    // Ensure upload directory exists
    await fs.mkdir(IMAGE_STORAGE_PATH, { recursive: true });
    console.log('✅ Upload directory ensured');

    // Generate filename
    const extension = file.name.split('.').pop().toLowerCase();
    const filename = generateImageFilename(file.name, extension);
    const filepath = path.join(IMAGE_STORAGE_PATH, filename);
    
    console.log('🔍 Generated filepath:', filepath);

    // Convert file to buffer and save
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filepath, buffer);
    
    console.log('✅ File saved successfully to:', filepath);
    
    // Verify file was actually written
    try {
      const stats = await fs.stat(filepath);
      console.log('✅ File verification - size:', stats.size, 'bytes');
    } catch (verifyError) {
      console.error('❌ File verification failed:', verifyError);
    }

    // Return public URL - use absolute URL for cross-server access
    const baseUrl = process.env.ADMINBLOG_URL || 'http://localhost:4322';
    const result = {
      url: `${baseUrl}/uploads/${filename}`,
      filename: filename,
      size: file.size,
      type: file.type
    };
    
    console.log('🔍 Returning result:', result);
    return result;
  } catch (error) {
    console.error('❌ Error saving image:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    throw new Error('Failed to save image');
  }
}

/**
 * Process featured image data
 */
async function processFeaturedImage(imageData) {
  console.log('🔍 processFeaturedImage called with:', {
    type: typeof imageData,
    isObject: typeof imageData === 'object',
    hasUrl: typeof imageData === 'object' && imageData ? !!imageData.url : false,
    hasFile: typeof imageData === 'object' && imageData ? !!imageData.file : false,
    isFile: imageData instanceof File,
    data: imageData
  });

  if (!imageData) return null;

  // If it's already a processed object, return as is
  if (typeof imageData === 'object' && imageData.url) {
    console.log('✅ Returning processed object with URL:', imageData.url);
    return imageData;
  }

  // If it's a File object (file upload), save it
  if (imageData instanceof File || (typeof imageData === 'object' && imageData && typeof imageData.arrayBuffer === 'function' && imageData.name)) {
    try {
      console.log('📁 Processing file upload:', imageData.name, imageData.size, imageData.type);
      console.log('🔍 File object details:', {
        name: imageData.name,
        size: imageData.size,
        type: imageData.type,
        instanceofFile: imageData instanceof File,
        hasArrayBuffer: typeof imageData.arrayBuffer === 'function'
      });
      const savedImage = await saveImageToLocal(imageData);
      console.log('✅ Image saved successfully:', savedImage);
      return savedImage;
    } catch (error) {
      console.error('❌ Error saving uploaded image:', error);
      throw error;
    }
  }

  // If it's a string (URL), convert to object format
  if (typeof imageData === 'string') {
    console.log('📁 Processing string URL:', imageData);
    // Check if it's a valid URL
    try {
      new URL(imageData);
      const result = {
        url: imageData,
        alt: '',
        type: 'url'
      };
      console.log('✅ URL processed:', result);
      return result;
    } catch (e) {
      // If it's not a valid URL, treat as local path
      const result = {
        url: imageData,
        alt: '',
        type: 'local'
      };
      console.log('✅ Local path processed:', result);
      return result;
    }
  }

  // If it's an object with file data (from form submission)
  if (typeof imageData === 'object' && imageData.file) {
    try {
      console.log('📁 Processing file data from form:', imageData);
      // Convert the file data back to a File object if possible
      if (imageData.file instanceof File) {
        const savedImage = await saveImageToLocal(imageData.file);
        console.log('✅ Image saved successfully from form data:', savedImage);
        return savedImage;
      }
    } catch (error) {
      console.error('❌ Error processing form file data:', error);
      throw error;
    }
  }

  console.log('⚠️ Unrecognized image data format:', typeof imageData, imageData);
  return null;
}

// Export for global use (so GPT service can access it)
if (typeof window !== 'undefined') {
  window.imageHandler = {
    saveImageToLocal,
    processFeaturedImage,
    validateImage,
    generateImageFilename
  };
}

// GET - Get all articles (excluding deleted ones by default)
async function GET({ request }) {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    const url = new URL(request.url);
    const includeDeleted = url.searchParams.get('includeDeleted') === 'true';
    const status = url.searchParams.get('status');
    
    let query = `
      SELECT 
        a.*,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color,
        c.icon as category_icon,
        COALESCE(NULLIF(CONCAT(IFNULL(u.first_name, ''), ' ', IFNULL(u.last_name, '')), ' '), u.username) AS author_name
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.author_id = u.id
    `;
    
    // Add status filtering
    if (status) {
      query += ` WHERE a.status = ?`;
    } else if (!includeDeleted) {
      query += ` WHERE a.status != 'deleted'`;
    }
    
    query += ` ORDER BY a.created_at DESC`;
    
    const queryParams = status ? [status] : [];
    const articles = await executeQuery(query, queryParams);
    
    return new Response(JSON.stringify(articles), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('❌ Error fetching articles:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch articles' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// POST - Create new article
async function POST({ request }) {
  try {
    // Check if the request is FormData (for file uploads) or JSON
    const contentType = request.headers.get('content-type');
    let body;
    
    if (contentType && contentType.includes('multipart/form-data')) {
      // Handle FormData
      body = await request.formData();
      console.log('📁 Received FormData request with fields:', Array.from(body.keys()));
    } else {
      // Handle JSON
      body = await request.json();
      console.log('📄 Received JSON request');
    }
    
    // Extract data from either FormData or JSON
    const title = body.get ? body.get('title') : body.title;
    const content = body.get ? body.get('content') : body.content;
    const excerpt = body.get ? body.get('excerpt') : body.excerpt;
    const category = body.get ? body.get('category') : body.category;
    const category_id = body.get ? body.get('category_id') : body.category_id;
    const author_id = body.get ? body.get('authorId') : body.authorId;
    const status = body.get ? body.get('status') : body.status;
    const featured_image = body.get ? body.get('featured_image') : body.featured_image;
    const tags = body.get ? body.get('tags') : body.tags;
    const keywords = body.get ? body.get('keywords') : body.keywords;
    const is_featured = body.get ? body.get('is_featured') : body.is_featured;
    
    // Debug FormData extraction
    if (body.get) {
      console.log('🔍 FormData extraction details (POST):');
      console.log('  - featured_image type:', typeof featured_image);
      console.log('  - featured_image name:', featured_image?.name);
      console.log('  - featured_image size:', featured_image?.size);
      console.log('  - All FormData keys:', Array.from(body.keys()));
      
      // Log all FormData entries for debugging
      for (const [key, value] of body.entries()) {
        console.log(`  - ${key}:`, {
          type: typeof value,
          instanceofFile: value instanceof File,
          value: value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value
        });
      }
    }
    
    console.log('📝 Extracted article data:', {
      title, content, excerpt, category, category_id, author_id, status, 
      has_featured_image: !!featured_image, tags, keywords, is_featured
    });
    
    if (!title || !content) {
      return new Response(JSON.stringify({ error: 'Title and content are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Initialize database connection
    await initializeDatabase();
    
    // Resolve category_id from category name or use provided category_id
    let finalCategoryId = null;
    if (category_id) {
      // Use provided category_id directly
      finalCategoryId = parseInt(category_id);
      console.log('✅ Using provided category_id:', finalCategoryId);
    } else if (category) {
      // Resolve category_id from category name
      const categoryQuery = 'SELECT id FROM categories WHERE name = ?';
      const categoryResult = await executeQuery(categoryQuery, [category]);
      if (categoryResult && categoryResult.length > 0) {
        finalCategoryId = categoryResult[0].id;
        console.log('✅ Category resolved:', category, '-> ID:', finalCategoryId);
      } else {
        console.log('⚠️ Category not found:', category, '- creating article without category');
      }
    }
    
    console.log('🔍 Final category ID for article:', finalCategoryId);
    
    // Generate slug from title
    let slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    // Ensure slug uniqueness by adding a number if it already exists
    let counter = 1;
    let originalSlug = slug;
    while (true) {
      const existingSlug = await executeQuery('SELECT id FROM articles WHERE slug = ?', [slug]);
      if (existingSlug.length === 0) {
        break; // Slug is unique
      }
      slug = `${originalSlug}-${counter}`;
      counter++;
      
      // Prevent infinite loop (max 100 attempts)
      if (counter > 100) {
        slug = `${originalSlug}-${Date.now()}`;
        break;
      }
    }
    
    // Combine tags/keywords into one tags field (SQLite schema has no keywords)
    const tagsValue = Array.isArray(tags) ? tags : (Array.isArray(keywords) ? keywords : null);

    // Process featured image
    let processedFeaturedImage = null;
    if (featured_image) {
      try {
        console.log('📁 Processing featured image:', featured_image);
        console.log('🔍 Featured image details:', {
          type: typeof featured_image,
          isObject: typeof featured_image === 'object',
          hasUrl: typeof featured_image === 'object' && featured_image ? !!featured_image.url : false,
          hasFile: typeof featured_image === 'object' && featured_image ? !!featured_image.file : false,
          isFile: featured_image instanceof File,
          keys: typeof featured_image === 'object' && featured_image ? Object.keys(featured_image) : [],
          data: featured_image
        });
        processedFeaturedImage = await processFeaturedImage(featured_image);
        console.log('✅ Featured image processed:', processedFeaturedImage);
      } catch (error) {
        console.error('❌ Error processing featured image:', error);
        // Continue without image rather than failing the entire article creation
        processedFeaturedImage = null;
      }
    } else {
      console.log('📁 No featured image provided');
    }

    const query = `
      INSERT INTO articles (
        title, slug, content, excerpt, category_id, author_id, status, 
        featured_image, tags, is_featured, published_at,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 'published' THEN datetime('now') ELSE NULL END, datetime('now'), datetime('now'))
    `;
    
    console.log('🔍 SQL Query:', query);
    console.log('🔍 Query Parameters:', [
      title, 
      slug, 
      content, 
      excerpt || '', 
      finalCategoryId || null, 
      author_id || 1, // Default author
      status || 'draft', 
      processedFeaturedImage ? JSON.stringify(processedFeaturedImage) : null,
      tagsValue ? JSON.stringify(tagsValue) : null,
      is_featured || false,
      status || 'draft'
    ]);
    
    const result = await executeQuery(query, [
      title, 
      slug, 
      content, 
      excerpt || '', 
      finalCategoryId || null, 
      author_id || 1, // Default author
      status || 'draft', 
      processedFeaturedImage ? JSON.stringify(processedFeaturedImage) : null,
      tagsValue ? JSON.stringify(tagsValue) : null,
      is_featured || false,
      status || 'draft'
    ]);
    
    // Get the created article
    const getQuery = 'SELECT * FROM articles WHERE id = ?';
    const [article] = await executeQuery(getQuery, [result.lastID || result.insertId]);

    // Sync to blog if published
    try {
      await BlogSyncService.syncArticleToBlog(result.lastID || result.insertId);
    } catch (syncError) {
      console.error('⚠️ Blog sync failed after create:', syncError);
    }
    
    return new Response(JSON.stringify(article), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('❌ Error creating article:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno
    });
    return new Response(JSON.stringify({ 
      error: 'Failed to create article',
      details: error.message,
      code: error.code || 'unknown'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// PUT - Update article
async function PUT({ request }) {
  try {
    // Check if the request is FormData (for file uploads) or JSON
    const contentType = request.headers.get('content-type');
    let body;
    
    if (contentType && contentType.includes('multipart/form-data')) {
      // Handle FormData
      body = await request.formData();
      console.log('📁 Received FormData request with fields:', Array.from(body.keys()));
    } else {
      // Handle JSON
      body = await request.json();
      console.log('📄 Received JSON request');
    }
    
    // Extract data from either FormData or JSON
    const id = body.get ? body.get('id') : body.id;
    const title = body.get ? body.get('title') : body.title;
    const content = body.get ? body.get('content') : body.content;
    const excerpt = body.get ? body.get('excerpt') : body.excerpt;
    const category_id = body.get ? body.get('category_id') : body.category_id;
    const author_id = body.get ? body.get('author_id') : body.author_id;
    const status = body.get ? body.get('status') : body.status;
    const featured_image = body.get ? body.get('featured_image') : body.featured_image;
    const tags = body.get ? body.get('tags') : body.tags;
    const is_featured = body.get ? body.get('is_featured') : body.is_featured;
    
    // Debug FormData extraction
    if (body.get) {
      console.log('🔍 FormData extraction details:');
      console.log('  - featured_image type:', typeof featured_image);
      console.log('  - featured_image instanceof File:', featured_image instanceof File);
      console.log('  - featured_image name:', featured_image?.name);
      console.log('  - featured_image size:', featured_image?.size);
      console.log('  - All FormData keys:', Array.from(body.keys()));
      
      // Log all FormData entries for debugging
      for (const [key, value] of body.entries()) {
        console.log(`  - ${key}:`, {
          type: typeof value,
          instanceofFile: value instanceof File,
          value: value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value
        });
      }
    }
    
    console.log('📝 Update article data:', {
      id, title, content, excerpt, category_id, author_id, status, 
      has_featured_image: !!featured_image, is_featured
    });
    
    if (!id || !title || !content) {
      return new Response(JSON.stringify({ error: 'ID, title and content are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Initialize database connection
    await initializeDatabase();
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    console.log('🔍 Generated slug:', slug);
    
    // Combine tags/keywords into one tags field
    const tagsValueUpdate = Array.isArray(tags) ? tags : [];
    
    // Process featured image - only if a new one is provided
    let processedFeaturedImage = null;
    let shouldUpdateImage = false;
    
    if (featured_image) {
      try {
        console.log('📁 Processing featured image for update:', featured_image);
        console.log('🔍 Featured image details:', {
          type: typeof featured_image,
          isObject: typeof featured_image === 'object',
          hasUrl: typeof featured_image === 'object' && featured_image ? !!featured_image.url : false,
          hasFile: typeof featured_image === 'object' && featured_image ? !!featured_image.file : false,
          isFile: featured_image instanceof File,
          keys: typeof featured_image === 'object' && featured_image ? Object.keys(featured_image) : [],
          data: featured_image
        });
        
        processedFeaturedImage = await processFeaturedImage(featured_image);
        shouldUpdateImage = true;
        console.log('✅ Featured image processed for update:', processedFeaturedImage);
        console.log('🔍 Processed image will be stored as JSON:', JSON.stringify(processedFeaturedImage));
        console.log('🔍 Processed image type:', typeof processedFeaturedImage);
        console.log('🔍 Processed image has url:', processedFeaturedImage && processedFeaturedImage.url);
        console.log('🔍 Processed image url value:', processedFeaturedImage && processedFeaturedImage.url);
      } catch (error) {
        console.error('❌ Error processing featured image for update:', error);
        // Continue without image rather than failing the entire article update
        processedFeaturedImage = null;
        shouldUpdateImage = false;
      }
    } else {
      console.log('🔄 No new image provided, keeping existing image');
      shouldUpdateImage = false;
      
      // Get the existing article to see what image it currently has
      try {
        const existingArticleQuery = 'SELECT featured_image FROM articles WHERE id = ?';
        const [existingArticle] = await executeQuery(existingArticleQuery, [id]);
        if (existingArticle) {
          console.log('🔍 Existing article image data:', {
            featured_image: existingArticle.featured_image,
            featured_image_type: typeof existingArticle.featured_image,
            has_image: !!existingArticle.featured_image
          });
        }
      } catch (error) {
        console.error('❌ Error fetching existing article image:', error);
      }
    }
    
    // Build dynamic query based on whether we're updating the image
    let query;
    let queryParams;
    
    if (shouldUpdateImage) {
      // Update including featured_image
      query = `
        UPDATE articles 
        SET title = ?, slug = ?, content = ?, excerpt = ?, category_id = ?, 
            author_id = ?, status = ?, featured_image = ?, tags = ?, 
            is_featured = ?, 
            published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, datetime('now')) ELSE published_at END,
            updated_at = datetime('now')
        WHERE id = ?
      `;
      const imageJsonString = JSON.stringify(processedFeaturedImage);
      console.log('🔍 Image JSON string to be stored:', imageJsonString);
      console.log('🔍 Image JSON string length:', imageJsonString.length);
      
      queryParams = [
        title, 
        slug, 
        content, 
        excerpt || '', 
        category_id || null, 
        author_id || 1,
        status || 'draft', 
        imageJsonString,
        tagsValueUpdate ? JSON.stringify(tagsValueUpdate) : null,
        is_featured || false,
        status || 'draft',
        id
      ];
      console.log('🖼️ Will update with new image data:', processedFeaturedImage);
    } else {
      // Update without changing featured_image - but we need to preserve the existing image
      // First, get the existing image data
      let existingImageData = null;
      try {
        const existingArticleQuery = 'SELECT featured_image FROM articles WHERE id = ?';
        const [existingArticle] = await executeQuery(existingArticleQuery, [id]);
        if (existingArticle && existingArticle.featured_image) {
          existingImageData = existingArticle.featured_image;
          console.log('🔄 Preserving existing image data:', existingImageData);
        }
      } catch (error) {
        console.error('❌ Error fetching existing image data:', error);
      }
      
      // Update without changing featured_image
      query = `
        UPDATE articles 
        SET title = ?, slug = ?, content = ?, excerpt = ?, category_id = ?, 
            author_id = ?, status = ?, featured_image = ?, tags = ?, 
            is_featured = ?, 
            published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, datetime('now')) ELSE published_at END,
            updated_at = datetime('now')
        WHERE id = ?
      `;
      queryParams = [
        title, 
        slug, 
        content, 
        excerpt || '', 
        category_id || null, 
        author_id || 1,
        status || 'draft', 
        existingImageData, // Preserve existing image data
        tagsValueUpdate ? JSON.stringify(tagsValueUpdate) : null,
        is_featured || false,
        status || 'draft',
        id
      ];
      console.log('🔄 Will preserve existing image data:', existingImageData);
    }
    
    console.log('🔍 Update SQL Query:', query);
    console.log('🔍 Update Query Parameters:', queryParams);
    console.log('🖼️ Image update strategy:', shouldUpdateImage ? 'Updating with new image' : 'Keeping existing image');
    
    try {
      const updateResult = await executeQuery(query, queryParams);
      console.log('✅ Article update query executed successfully');
      console.log('🔍 Update result:', updateResult);
      
      // Immediately verify the update worked by checking the database
      const verifyQuery = 'SELECT featured_image FROM articles WHERE id = ?';
      const [verifyResult] = await executeQuery(verifyQuery, [id]);
      console.log('🔍 Verification query result:', verifyResult);
      console.log('🔍 Featured image in database after update:', verifyResult.featured_image);
      
    } catch (dbError) {
      console.error('❌ Database update failed:', dbError);
      throw new Error(`Database update failed: ${dbError.message}`);
    }
    console.log('🔍 Database update completed with query:', query);
    console.log('🔍 Database update parameters:', queryParams);
    
    // Log what was actually stored in the database
    if (shouldUpdateImage) {
      console.log('🖼️ NEW image data that was stored:', JSON.stringify(processedFeaturedImage));
    } else {
      console.log('🖼️ EXISTING image data that was preserved:', existingImageData);
    }
    
    // Get the updated article
    const getQuery = 'SELECT * FROM articles WHERE id = ?';
    console.log('🔍 Fetching updated article with query:', getQuery, 'and ID:', id);
    const [article] = await executeQuery(getQuery, [id]);
    
    if (!article) {
      console.error('❌ Article not found after update, ID:', id);
      return new Response(JSON.stringify({ error: 'Article not found after update' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Debug: Log the raw article data from database
    console.log('🔍 Raw article from database:', {
      id: article.id,
      title: article.title,
      featured_image_raw: article.featured_image,
      featured_image_type: typeof article.featured_image,
      featured_image_length: article.featured_image ? article.featured_image.length : 0
    });
    
    // Also check if the image file actually exists on disk
    if (article.featured_image && typeof article.featured_image === 'string') {
      try {
        const parsedImage = JSON.parse(article.featured_image);
        if (parsedImage.url && parsedImage.url.startsWith('/uploads/')) {
          const imagePath = path.join(process.cwd(), 'public', parsedImage.url);
          console.log('🔍 Checking if image file exists on disk:', imagePath);
          try {
            const fs = await import('fs/promises');
            const stats = await fs.stat(imagePath);
            console.log('✅ Image file exists on disk, size:', stats.size, 'bytes');
          } catch (fsError) {
            console.error('❌ Image file NOT found on disk:', fsError.message);
          }
        }
      } catch (parseError) {
        console.error('❌ Could not parse featured_image JSON:', parseError);
      }
    }
    
    // Parse featured_image if it's a JSON string
    if (article.featured_image && typeof article.featured_image === 'string') {
      try {
        const parsedImage = JSON.parse(article.featured_image);
        article.featured_image = parsedImage;
        console.log('✅ Parsed featured_image from JSON:', parsedImage);
      } catch (parseError) {
        console.error('❌ Error parsing featured_image JSON:', parseError);
        console.log('🔍 Raw featured_image value:', article.featured_image);
      }
    }
    
    console.log('🔍 Final article data being returned:', {
      id: article.id,
      title: article.title,
      featured_image: article.featured_image,
      featured_image_type: typeof article.featured_image
    });

    // Sync to blog (handles published/draft logic internally)
    try {
      await BlogSyncService.syncArticleToBlog(id);
      console.log('✅ Blog sync completed successfully');
    } catch (syncError) {
      console.error('⚠️ Blog sync failed after update:', syncError);
      // Don't fail the update if sync fails
    }
    
    console.log('✅ Article update completed successfully, ID:', id);
    return new Response(JSON.stringify(article), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('❌ Error updating article:', error);
    return new Response(JSON.stringify({ error: 'Failed to update article' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// DELETE - Delete article (soft delete by default, hard delete with force=true)
async function DELETE({ request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const force = url.searchParams.get('force') === 'true';
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Article ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    if (force) {
      // Hard delete - completely remove from database
      console.log(`🗑️ Hard deleting article ID: ${id}`);
      
      // First, get article info for cleanup
      const articleQuery = 'SELECT featured_image FROM articles WHERE id = ?';
      const [article] = await executeQuery(articleQuery, [id]);
      
      // Remove from blog
      try {
        await BlogSyncService.removeArticleFromBlog(Number(id));
      } catch (syncError) {
        console.error('⚠️ Blog removal failed before hard delete:', syncError);
      }
      
      // Delete the article record
      const deleteQuery = 'DELETE FROM articles WHERE id = ?';
      await executeQuery(deleteQuery, [id]);
      
      // Clean up associated image files if they exist
      if (article && article.featured_image) {
        try {
          const imageData = JSON.parse(article.featured_image);
          if (imageData.path) {
            const fs = await import('fs/promises');
            const imagePath = path.join(process.cwd(), 'public', imageData.path);
            await fs.unlink(imagePath);
            console.log('✅ Associated image file deleted:', imagePath);
          }
        } catch (cleanupError) {
          console.warn('⚠️ Could not clean up image file:', cleanupError);
        }
      }
      
      return new Response(JSON.stringify({ message: 'Article permanently deleted' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      // Soft delete (set status to deleted)
      console.log(`📁 Soft deleting (archiving) article ID: ${id}`);
      
      const query = 'UPDATE articles SET status = "deleted", updated_at = datetime("now") WHERE id = ?';
      await executeQuery(query, [id]);

      // Remove from blog
      try {
        await BlogSyncService.removeArticleFromBlog(Number(id));
      } catch (syncError) {
        console.error('⚠️ Blog removal failed after soft delete:', syncError);
      }
      
      return new Response(JSON.stringify({ message: 'Article archived successfully' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('❌ Error deleting article:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete article' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// PATCH - Restore archived article
async function PATCH({ request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const action = url.searchParams.get('action');
    
    if (!id || !action) {
      return new Response(JSON.stringify({ error: 'Article ID and action are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    if (action === 'restore') {
      // Restore archived article
      console.log(`📁 Restoring archived article ID: ${id}`);
      
      const query = 'UPDATE articles SET status = "draft", updated_at = datetime("now") WHERE id = ? AND status = "deleted"';
      const result = await executeQuery(query, [id]);
      
      if (result.changes > 0) {
        return new Response(JSON.stringify({ message: 'Article restored successfully' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        return new Response(JSON.stringify({ error: 'Article not found or not archived' }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('❌ Error restoring article:', error);
    return new Response(JSON.stringify({ error: 'Failed to restore article' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PATCH,
  POST,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
