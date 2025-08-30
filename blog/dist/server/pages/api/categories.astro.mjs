import { initializeDatabase, getCategories } from '../../chunks/database_CcuPA5-H.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async () => {
  try {
    await initializeDatabase();
    const categories = await getCategories();
    return new Response(JSON.stringify({
      success: true,
      data: categories,
      total: categories.length,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Failed to fetch categories" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
