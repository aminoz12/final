export { renderers } from '../../../renderers.mjs';

// WebSocket endpoint for chat system
// This file handles WebSocket upgrade requests

async function GET({ request, response }) {
  // This endpoint is for WebSocket upgrade
  // The actual WebSocket handling is done by the chatWebSocketService
  return new Response('WebSocket endpoint', { status: 200 });
}

// Handle WebSocket upgrade
async function POST({ request }) {
  // This would handle WebSocket upgrade in a real implementation
  // For now, we'll return a simple response
  return new Response('WebSocket upgrade not implemented in this endpoint', { status: 501 });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
