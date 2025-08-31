// src/pages/api/openai/chat.js
export async function POST({ request }) {
  try {
    // Optional protection: set ADMIN_SECRET in env to require x-admin-secret header.
    const ADMIN_SECRET = process.env.ADMIN_SECRET || '';
    if (ADMIN_SECRET) {
      const provided = request.headers.get('x-admin-secret') || '';
      if (provided !== ADMIN_SECRET) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Server missing OPENAI_API_KEY' }), { status: 500 });
    }

    const bodyText = await request.text(); // forward raw body
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: bodyText
    });

    const text = await resp.text();
    return new Response(text, { status: resp.status, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('OpenAI chat proxy error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
