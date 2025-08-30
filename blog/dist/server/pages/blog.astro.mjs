/* empty css                                 */
import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, F as Fragment } from '../chunks/astro/server_BNe_LUEH.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DmzNGBki.mjs';
import { initializeDatabase, getAllArticles, getCategories } from '../chunks/database_CcuPA5-H.mjs';
import { $ as $$CategoryBadge } from '../chunks/CategoryBadge_BSXgJVo4.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://your-domain.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  await initializeDatabase();
  console.log("\u2705 Database initialized successfully");
  let blogPosts = [];
  let categories = [];
  try {
    console.log("\u{1F50D} Debug: Trying to fetch articles...");
    blogPosts = await getAllArticles();
    console.log("\u{1F50D} Debug: Articles fetched:", blogPosts.length);
    if (blogPosts.length === 0) {
      console.log("\u26A0\uFE0F No articles found in database at all");
    } else {
      console.log("\u{1F50D} Debug: First article sample:", blogPosts[0]);
    }
    blogPosts = blogPosts.map((article) => {
      console.log("\u{1F50D} Debug: Raw article from database:", {
        id: article.id,
        title: article.title,
        category_name: article.category_name,
        category_slug: article.category_slug,
        category_color: article.category_color,
        featured_image: article.featured_image,
        status: article.status
      });
      const transformed = {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt || "",
        content: article.content,
        category: article.category_name || "Uncategorized",
        category_slug: article.category_slug || "",
        category_color: article.category_color || "#3B82F6",
        author: article.author_name || "Mad2Moi Team",
        publishedAt: article.published_at ? new Date(article.published_at).toISOString().split("T")[0] : new Date(article.created_at).toISOString().split("T")[0],
        readTime: calculateReadTime(article.content),
        featured: article.is_featured || false,
        image: (() => {
          try {
            if (article.featured_image) {
              const parsed = JSON.parse(article.featured_image);
              console.log("\u{1F50D} Debug: Parsed featured_image:", parsed);
              return parsed?.url || null;
            }
            return null;
          } catch (error) {
            console.error("\u274C Error parsing featured_image:", error, "Raw data:", article.featured_image);
            return null;
          }
        })(),
        imageAlt: article.title,
        isExplicit: false,
        // TODO: Add explicit content flag to database
        tags: article.tags ? JSON.parse(article.tags) : [],
        views: article.view_count || 0,
        likes: 0,
        // TODO: Implement likes system
        status: article.status
        // Add status for debugging
      };
      console.log("\u{1F50D} Debug: Transformed article:", {
        slug: transformed.slug,
        title: transformed.title,
        category: transformed.category,
        image: transformed.image,
        status: transformed.status,
        featured_image_raw: article.featured_image
      });
      return transformed;
    });
    categories = await getCategories();
    console.log("\u{1F50D} Debug: Articles loaded:", blogPosts.length);
    console.log("\u{1F50D} Debug: Categories loaded:", categories.length);
  } catch (error) {
    console.error("\u274C Error fetching blog data:", error);
    blogPosts = [];
    categories = [];
  }
  function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min`;
  }
  const { searchParams } = Astro2.url;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  console.log("\u{1F50D} Debug: Full URL:", Astro2.url.toString());
  console.log("\u{1F50D} Debug: Search params object:", Object.fromEntries(searchParams.entries()));
  console.log("\u{1F50D} Debug: URL params - search:", search, "category:", category);
  console.log("\u{1F50D} Debug: Search param type:", typeof search, "length:", search.length);
  console.log("\u{1F50D} Debug: Category param type:", typeof category, "length:", category.length);
  let filteredPosts = blogPosts;
  if (search) {
    const searchLower = search.toLowerCase().trim();
    console.log("\u{1F50D} Debug: Searching for:", searchLower);
    filteredPosts = blogPosts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(searchLower);
      const excerptMatch = post.excerpt.toLowerCase().includes(searchLower);
      const categoryMatch = post.category.toLowerCase().includes(searchLower);
      const authorMatch = post.author.toLowerCase().includes(searchLower);
      const tagsMatch = post.tags.some((tag) => tag.toLowerCase().includes(searchLower));
      const matches = titleMatch || excerptMatch || categoryMatch || authorMatch || tagsMatch;
      if (matches) {
        console.log(`\u{1F50D} Debug: Article "${post.title}" matches search:`, {
          title: titleMatch,
          excerpt: excerptMatch,
          category: categoryMatch,
          author: authorMatch,
          tags: tagsMatch
        });
      }
      return matches;
    });
    console.log("\u{1F50D} Debug: Filtered by search:", filteredPosts.length);
    console.log("\u{1F50D} Debug: Search results:", filteredPosts.map((p) => p.title));
  }
  if (category) {
    filteredPosts = filteredPosts.filter(
      (post) => post.category_slug.toLowerCase() === category.toLowerCase()
    );
    console.log("\u{1F50D} Debug: Filtered by category:", filteredPosts.length);
    console.log("\u{1F50D} Debug: Category slug to match:", category);
    console.log("\u{1F50D} Debug: Available category slugs:", blogPosts.map((p) => p.category_slug));
  }
  console.log("\u{1F50D} Debug: Final filtered posts:", filteredPosts.length);
  console.log("\u{1F50D} Debug: All articles available for search:");
  blogPosts.forEach((post, index) => {
    console.log(`  ${index + 1}. "${post.title}" (Category: ${post.category}, Author: ${post.author})`);
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Blog - Mad2Moi", "description": "D\xE9couvrez nos articles sur la sexualit\xE9, les relations et l'exploration personnelle" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-primary-800"> <!-- Hero Section --> <div class="container mx-auto px-4 py-16"> <div class="text-center"> <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
Blog Mad2Moi
</h1> <p class="text-xl text-secondary-300 mb-8 max-w-3xl mx-auto">
Découvrez nos articles sur la sexualité, les relations et l'exploration personnelle
</p> <!-- Search Bar --> <div class="max-w-2xl mx-auto mb-8"> <form method="GET" action="/blog" class="relative" id="searchForm"> <input type="search" name="search"${addAttribute(search, "value")} placeholder="Rechercher un article (ex: BDSM, Libertin, Roleplay...)" class="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-white/60 backdrop-blur-sm text-lg" required minlength="2" id="searchInput" autocomplete="off"> <!-- Preserve category parameter if it exists --> ${category && renderTemplate`<input type="hidden" name="category"${addAttribute(category, "value")}>`} <!-- Search Suggestions --> <div id="searchSuggestions" class="hidden absolute top-full left-0 right-0 mt-2 bg-secondary-800/95 backdrop-blur-sm border border-secondary-600 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary-600 scrollbar-track-secondary-800"> <!-- Suggestions will be populated by JavaScript --> </div> <!-- Search button --> <button type="submit" class="absolute right-4 top-1/2 -translate-y-2 text-white/60 hover:text-white transition-colors"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </button> <!-- Clear search button (only show when there's a search) --> ${search && renderTemplate`<a${addAttribute(category ? `/blog?category=${category}` : "/blog", "href")} class="absolute right-16 top-1/2 -translate-y-2 text-white/40 hover:text-white/60 transition-colors" title="Effacer la recherche"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </a>`} </form> <!-- Search tips --> ${!search && renderTemplate`<div class="text-center text-white/60 text-sm mt-2"> <p>Recherchez par titre, contenu, catégorie ou auteur</p> </div>`} <!-- Search status --> ${search && renderTemplate`<p class="text-center text-white/80 text-sm mt-2">
🔍 Recherche active: "${search}" - ${filteredPosts.length} résultat${filteredPosts.length > 1 ? "s" : ""} </p>`} </div> </div> </div> <!-- Categories Filter --> ${categories.length > 0 && renderTemplate`<div class="container mx-auto px-4 mb-12"> <div class="flex flex-wrap gap-3 justify-center"> <a href="/blog"${addAttribute(`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${!category ? "bg-primary-600 text-white shadow-lg" : "bg-white/10 text-white hover:bg-white/20 border border-white/20"}`, "class")}>
📚 Toutes
</a> ${categories.map((cat) => renderTemplate`<a${addAttribute(`/blog?category=${cat.slug}`, "href")}${addAttribute(`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${category === cat.slug ? "bg-primary-600 text-white shadow-lg" : "bg-white/10 text-white hover:bg-white/20 border border-white/20"}`, "class")}> ${cat.icon || "\u{1F4C1}"} ${cat.name} </a>`)} </div> </div>`} <!-- Active filters display --> ${(search || category) && renderTemplate`<div class="container mx-auto px-4 mb-8"> <div class="flex flex-wrap gap-4 justify-center"> ${search && renderTemplate`<span class="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm border border-primary-500/30">
Recherche: ${search} </span>`} ${category && renderTemplate`<span class="px-3 py-1 bg-secondary-500/20 text-secondary-300 rounded-full text-sm border border-secondary-500/30">
Catégorie: ${categories.find((cat) => cat.slug === category)?.name || category} </span>`} </div> </div>`} <!-- Blog Content --> <div class="container mx-auto px-4 pb-16"> ${filteredPosts.length > 0 ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <div class="text-center mb-12"> <h2 class="text-3xl font-bold text-white mb-4"> ${search || category ? `R\xE9sultats de recherche` : "Tous nos articles"} </h2> <p class="text-secondary-300"> ${search || category ? `${filteredPosts.length} article${filteredPosts.length > 1 ? "s" : ""} trouv\xE9${filteredPosts.length > 1 ? "s" : ""}` : `${filteredPosts.length} article${filteredPosts.length > 1 ? "s" : ""} au total`} </p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> ${filteredPosts.map((post, index) => {
    console.log("\u{1F50D} Debug: Rendering post: image", {
      image: post.image
    });
    return renderTemplate`<article${addAttribute(`${post.featured ? "card-sensual hover:border-glow group card-hover" : "card group hover:border-primary-500/50"} transform hover:scale-105 transition-all duration-300`, "class")}${addAttribute(post.category, "data-category")}${addAttribute(post.author, "data-author")}${addAttribute(post.slug, "data-slug")}${addAttribute(post.title, "data-title")}${addAttribute(post.excerpt, "data-excerpt")}> <div class="aspect-video bg-gradient-to-br from-secondary-800/50 to-secondary-700/50 rounded-xl mb-6 overflow-hidden border border-secondary-600/30"> ${post.image ? renderTemplate`<img${addAttribute(post.image, "src")}${addAttribute(post.imageAlt, "alt")} class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">` : renderTemplate`<div class="w-full h-full flex items-center justify-center"> <span class="text-6xl opacity-60">💋</span> </div>`} ${post.featured && renderTemplate`<div class="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold border border-yellow-400/30">
⭐ À la une
</div>`} </div> <div class="flex items-center gap-3 mb-4"> ${renderComponent($$result3, "CategoryBadge", $$CategoryBadge, { "name": post.category, "color": post.category_color, "size": "sm" })} <p class="text-sm text-secondary-400">${post.readTime}</p> </div> <h3${addAttribute(`${post.featured ? "text-xl" : "text-lg"} font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors font-elegant`, "class")}> <a${addAttribute(`/blog/${post.slug}`, "href")}${addAttribute(post.title, "data-title")}>${post.title}</a> </h3> <!-- Related categories links --> ${post.tags && post.tags.length > 0 && renderTemplate`<div class="mb-3"> ${post.tags.slice(0, 2).map((tag) => renderTemplate`<a${addAttribute(`/blog?category=${tag.toLowerCase()}`, "href")} class="inline-block text-xs px-2 py-1 bg-secondary-800/50 text-secondary-300 rounded border border-secondary-600/30 hover:bg-primary-500/20 hover:text-primary-300 transition-colors mr-2">
#${tag} </a>`)} </div>`} <p class="text-secondary-300 mb-4 line-clamp-3 leading-relaxed"${addAttribute(post.excerpt, "data-excerpt")}>${post.excerpt}</p> <div class="flex items-center justify-between text-sm text-secondary-400"> <p class="font-medium text-primary-300">${post.author}</p> <time${addAttribute(post.publishedAt, "datetime")}${addAttribute(new Date(post.publishedAt).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }), "data-translate")}> ${new Date(post.publishedAt).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })} </time> </div> <!-- Stats row --> <div class="flex items-center gap-4 mt-4 pt-4 border-t border-secondary-700/30 text-sm text-secondary-400"> <span class="flex items-center gap-1"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path> </svg> ${post.views} </span> <span class="flex items-center gap-1"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path> </svg> ${post.likes} </span> </div> </article>`;
  })} </div> ` })}` : renderTemplate`<div class="text-center py-16"> <div class="text-6xl mb-4">📝</div> <h2 class="text-2xl font-bold text-white mb-4">Aucun article trouvé</h2> <p class="text-secondary-300 mb-8"> ${search || category ? `Aucun article ne correspond \xE0 votre recherche. Essayez d'autres mots-cl\xE9s ou consultez nos cat\xE9gories.` : "Les articles appara\xEEtront ici une fois qu'ils seront cr\xE9\xE9s dans le panneau d'administration."} </p> ${(search || category) && renderTemplate`<a href="/blog" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2">
🔄 Voir tous les articles
</a>`} </div>`} </div> </div> ` })} `;
}, "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/pages/blog/index.astro", void 0);

const $$file = "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
