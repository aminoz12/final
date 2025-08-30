// Proxy route to forward image requests from blog server to adminblog server
export async function GET({ params, request }) {
  try {
    const { file } = params;
    
    // Security: Prevent directory traversal
    if (file.includes('..') || file.includes('/')) {
      return new Response('Invalid file path', { status: 400 });
    }
    
    // Forward the request to the adminblog server
    const adminblogUrl = `http://localhost:4322/uploads/${file}`;
    console.log('🔄 Proxying image request to adminblog:', adminblogUrl);
    
    const response = await fetch(adminblogUrl);
    
    if (!response.ok) {
      console.error('❌ Adminblog server responded with error:', response.status);
      return new Response('Image not found', { status: 404 });
    }
    
    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    
    // Determine content type based on file extension
    const ext = file.split('.').pop().toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
    }
    
    // Return the proxied image
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('❌ Error proxying image request:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
