export { renderers } from '../../renderers.mjs';

// Chat API Proxy for Blog - Forwards requests to admin panel
async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    // Forward request to admin panel
    const adminUrl = `http://localhost:4323/api/chat?action=${action}`;
    if (action === 'messages') {
      const conversationId = url.searchParams.get('conversation_id');
      adminUrl += `&conversation_id=${conversationId}`;
    }
    
    const response = await fetch(adminUrl);
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Error in blog chat API GET:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch chat data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function POST({ request }) {
  try {
    const body = await request.json();
    
    // Forward request to admin panel
    const response = await fetch('http://localhost:4323/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Error in blog chat API POST:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat action' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
