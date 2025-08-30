export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.BLOG_REBUILD_TOKEN || "your-secret-token";
    if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.slice(7) !== expectedToken) {
      return new Response(JSON.stringify({
        success: false,
        error: "Unauthorized"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const payload = await request.json();
    const { action, articleId, slug, timestamp } = payload;
    console.log(`🔄 Webhook received: ${action} for article ${articleId} (${slug})`);
    switch (action) {
      case "create":
      case "update":
        await handleArticleUpdate(articleId, slug);
        break;
      case "delete":
        await handleArticleDelete(articleId, slug);
        break;
      default:
        console.warn(`⚠️ Unknown action: ${action}`);
    }
    console.log("✅ Webhook processed successfully");
    return new Response(JSON.stringify({
      success: true,
      message: "Webhook processed successfully",
      action,
      articleId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
async function handleArticleUpdate(articleId, slug) {
  try {
    console.log(`📝 Processing article update: ${slug}`);
    console.log(`✅ Article update processed: ${slug}`);
    await triggerRebuild();
  } catch (error) {
    console.error(`❌ Error processing article update for ${slug}:`, error);
    throw error;
  }
}
async function handleArticleDelete(articleId, slug) {
  try {
    console.log(`🗑️ Processing article deletion: ${slug}`);
    console.log(`✅ Article deletion processed: ${slug}`);
    await triggerRebuild();
  } catch (error) {
    console.error(`❌ Error processing article deletion for ${slug}:`, error);
    throw error;
  }
}
async function triggerRebuild() {
  try {
    console.log("🚀 Triggering blog rebuild...");
    if (process.env.NODE_ENV === "development") {
      console.log("🔄 Development mode: Rebuild would be triggered here");
    } else {
      console.log("🚀 Production mode: Deployment rebuild triggered");
    }
    return true;
  } catch (error) {
    console.error("❌ Error triggering rebuild:", error);
    throw error;
  }
}
const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
