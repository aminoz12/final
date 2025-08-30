import { getPublishedArticles, getCategories } from '../../chunks/database_CcuPA5-H.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async () => {
  try {
    const [articles, categories] = await Promise.all([
      getPublishedArticles(),
      getCategories()
    ]);
    const transformedArticles = articles.map((article) => ({
      id: article.slug,
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content,
      category: article.category_name || "Uncategorized",
      tags: article.tags ? JSON.parse(article.tags) : [],
      image: article.featured_image ? JSON.parse(article.featured_image)?.url : null,
      views: article.view_count || 0,
      likes: 0,
      // TODO: Implement likes system
      date: article.published_at ? new Date(article.published_at).toISOString().split("T")[0] : new Date(article.created_at).toISOString().split("T")[0],
      author: article.author_name || "Mad2Moi Team",
      status: article.status,
      slug: article.slug,
      categorySlug: article.category_slug,
      categoryColor: article.category_color,
      metaTitle: article.meta_title,
      metaDescription: article.meta_description,
      isFeatured: article.is_featured,
      createdAt: article.created_at,
      updatedAt: article.updated_at
    }));
    return new Response(JSON.stringify({
      success: true,
      data: transformedArticles,
      categories,
      total: transformedArticles.length,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    console.error("❌ Error fetching blog data:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch blog data",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
