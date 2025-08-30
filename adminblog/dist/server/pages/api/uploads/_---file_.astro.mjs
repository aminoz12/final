import { readFile } from 'fs/promises';
import { join } from 'path';
export { renderers } from '../../../renderers.mjs';

async function GET({ params, request }) {
  try {
    const { file } = params;
    
    // Security: Prevent directory traversal
    if (file.includes('..') || file.includes('/')) {
      return new Response('Invalid file path', { status: 400 });
    }
    
    // Construct the file path
    const filePath = join(process.cwd(), 'public', 'uploads', file);
    
    // Read the file
    const fileBuffer = await readFile(filePath);
    
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
    
    // Return the file with appropriate headers
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Error serving upload file:', error);
    return new Response('File not found', { status: 404 });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
