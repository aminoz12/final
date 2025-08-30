import { getMessagesByUserId, getActiveConversations, getChatStats, getAdminStatus, setAdminStatus } from '../../../chunks/chatDatabase_YrCGCuUv.mjs';
export { renderers } from '../../../renderers.mjs';

// GET /api/admin/chat - Get chat data for admin panel
async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    if (action === 'messages') {
      const userId = url.searchParams.get('user_id');
      if (!userId) {
        return new Response(JSON.stringify({ 
          error: 'User ID required' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const messages = await getMessagesByUserId(userId);
      return new Response(JSON.stringify(messages), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'conversations') {
      const conversations = await getActiveConversations();
      return new Response(JSON.stringify(conversations), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'stats') {
      const stats = await getChatStats();
      return new Response(JSON.stringify(stats), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'status') {
      const status = await getAdminStatus();
      return new Response(JSON.stringify({ available: status }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Invalid action' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Error in admin chat API GET:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch chat data' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/admin/chat - Admin actions
async function POST({ request }) {
  try {
    const body = await request.json();
    const { action, user_id, message, session_id, admin_name } = body;
    
    if (action === 'send_message') {
      if (!user_id || !message || !session_id || !admin_name) {
        return new Response(JSON.stringify({ 
          error: 'user_id, message, session_id, and admin_name are required' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Import the WebSocket service to send the message
      const { chatWebSocketService } = await import('../../../chunks/chatWebSocket_DBzOrpzX.mjs');
      const messageId = await chatWebSocketService.sendAdminMessage(
        user_id, 
        message, 
        session_id, 
        admin_name
      );
      
      return new Response(JSON.stringify({
        success: true,
        messageId,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'availability') {
      const { available } = body;
      if (typeof available !== 'boolean') {
        return new Response(JSON.stringify({ 
          error: 'available must be a boolean' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      await setAdminStatus(available);
      
      return new Response(JSON.stringify({
        success: true,
        available,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'approve_gpt') {
      const { user_id, message, session_id, original_message } = body;
      if (!user_id || !message || !session_id) {
        return new Response(JSON.stringify({ 
          error: 'user_id, message, and session_id are required' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Import the WebSocket service to approve GPT response
      const { chatWebSocketService } = await import('../../../chunks/chatWebSocket_DBzOrpzX.mjs');
      await chatWebSocketService.handleApproveGPTResponse(null, {
        userId: user_id,
        message,
        sessionId: session_id,
        originalMessage: original_message
      });
      
      return new Response(JSON.stringify({
        success: true,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Invalid action' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Error in admin chat API POST:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process admin request' 
    }), {
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
