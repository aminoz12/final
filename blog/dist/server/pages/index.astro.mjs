/* empty css                                 */
import { a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_BNe_LUEH.mjs';
import 'kleur/colors';
import { $ as $$Layout, a as $$LiveChat } from '../chunks/Layout_DmzNGBki.mjs';
import { initializeDatabase, getPublishedArticles, getCategories } from '../chunks/database_CcuPA5-H.mjs';
import { $ as $$CategoryBadge } from '../chunks/CategoryBadge_BSXgJVo4.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  await initializeDatabase();
  let featuredPosts = [];
  let recentPosts = [];
  let categories = [];
  let stats = [];
  try {
    const allArticles = await getPublishedArticles();
    featuredPosts = allArticles.filter((article) => article.is_featured).slice(0, 3).map((article) => {
      console.log("\u{1F50D} Debug: Processing featured article:", {
        title: article.title,
        featured_image_raw: article.featured_image,
        has_image: !!article.featured_image
      });
      return {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt || "",
        image: (() => {
          try {
            if (article.featured_image) {
              const parsed = JSON.parse(article.featured_image);
              console.log("\u{1F50D} Debug: Parsed featured_image for featured post:", parsed);
              return parsed?.url || null;
            }
            console.log("\u26A0\uFE0F No featured_image for featured post:", article.title);
            return null;
          } catch (error) {
            console.error("\u274C Error parsing featured_image for featured post:", error, "Raw data:", article.featured_image);
            return null;
          }
        })(),
        category: article.category_name || "Uncategorized",
        categoryColor: article.category_color || "#3B82F6",
        publishedAt: article.published_at ? new Date(article.published_at).toISOString().split("T")[0] : new Date(article.created_at).toISOString().split("T")[0],
        readTime: calculateReadTime(article.content),
        author: article.author_name || "Mad2Moi Team",
        tags: (() => {
          try {
            if (article.tags) {
              return JSON.parse(article.tags);
            }
            return [];
          } catch (error) {
            console.error("\u274C Error parsing tags for featured post:", error, "Raw data:", article.tags);
            return [];
          }
        })(),
        isExplicit: false
        // TODO: Add explicit content flag to database
      };
    });
    recentPosts = allArticles.filter((article) => !article.is_featured).slice(0, 3).map((article) => {
      console.log("\u{1F50D} Debug: Processing recent article:", {
        title: article.title,
        featured_image_raw: article.featured_image,
        has_image: !!article.featured_image
      });
      return {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt || "",
        image: (() => {
          try {
            if (article.featured_image) {
              const parsed = JSON.parse(article.featured_image);
              console.log("\u{1F50D} Debug: Parsed featured_image for recent post:", parsed);
              return parsed?.url || null;
            }
            console.log("\u26A0\uFE0F No featured_image for recent post:", article.title);
            return null;
          } catch (error) {
            console.error("\u274C Error parsing featured_image for recent post:", error, "Raw data:", article.featured_image);
            return null;
          }
        })(),
        category: article.category_name || "Uncategorized",
        categoryColor: article.category_color || "#3B82F6",
        publishedAt: article.published_at ? new Date(article.published_at).toISOString().split("T")[0] : new Date(article.created_at).toISOString().split("T")[0],
        readTime: calculateReadTime(article.content)
      };
    });
    const allCategories = await getCategories();
    categories = allCategories.filter((cat) => cat.article_count > 0).slice(0, 5).map((cat) => ({
      name: cat.name,
      count: cat.article_count,
      color: cat.color ? getColorClasses(cat.color) : getCategoryColor(cat.name),
      // Use database color, fallback to helper
      icon: cat.icon || getCategoryIcon(cat.name)
      // Use database icon, fallback to helper
    }));
    const totalArticles = allArticles.length;
    const totalCategories = allCategories.filter((cat) => cat.article_count > 0).length;
    stats = [
      { number: `${totalArticles}+`, label: "Articles \xC9rotiques", icon: "\u{1F4DA}" },
      { number: "50K+", label: "Lecteurs Mensuels", icon: "\u{1F465}" },
      // Keep this as is
      { number: `${totalCategories}+`, label: "Cat\xE9gories", icon: "\u{1F3F7}\uFE0F" },
      { number: "100%", label: "Contenu Mature", icon: "\u{1F525}" }
      // Keep this as is
    ];
    console.log("\u2705 Homepage data loaded:", {
      featuredPosts: featuredPosts.length,
      recentPosts: recentPosts.length,
      categories: categories.length,
      totalArticles
    });
    if (featuredPosts.length > 0) {
      console.log("\u{1F50D} Debug: Sample featured post:", featuredPosts[0]);
    }
    if (recentPosts.length > 0) {
      console.log("\u{1F50D} Debug: Sample recent post:", recentPosts[0]);
    }
    if (categories.length > 0) {
      console.log("\u{1F50D} Debug: Sample category:", categories[0]);
    }
  } catch (error) {
    console.error("\u274C Error loading homepage data:", error);
    featuredPosts = [];
    recentPosts = [];
    categories = [];
    stats = [
      { number: "0+", label: "Articles \xC9rotiques", icon: "\u{1F4DA}" },
      { number: "50K+", label: "Lecteurs Mensuels", icon: "\u{1F465}" },
      { number: "0+", label: "Cat\xE9gories", icon: "\u{1F3F7}\uFE0F" },
      { number: "100%", label: "Contenu Mature", icon: "\u{1F525}" }
    ];
  }
  function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min`;
  }
  function getCategoryColor(categoryName) {
    return "bg-blue-100 text-blue-800";
  }
  function getCategoryIcon(categoryName) {
    return "\u{1F4C1}";
  }
  function getColorClasses(hexColor) {
    const defaultColor = "bg-blue-100 text-blue-800";
    if (!hexColor || !hexColor.startsWith("#")) {
      return defaultColor;
    }
    const colorMap = {
      "#3B82F6": "bg-blue-100 text-blue-800",
      // Blue
      "#EF4444": "bg-red-100 text-red-800",
      // Red
      "#10B981": "bg-green-100 text-green-800",
      // Green
      "#F59E0B": "bg-yellow-100 text-yellow-800",
      // Yellow
      "#8B5CF6": "bg-purple-100 text-purple-800",
      // Purple
      "#EC4899": "bg-pink-100 text-pink-800",
      // Pink
      "#06B6D4": "bg-cyan-100 text-cyan-800",
      // Cyan
      "#84CC16": "bg-lime-100 text-lime-800"
      // Lime
    };
    return colorMap[hexColor.toUpperCase()] || defaultColor;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Mad2Moi Blog - Exploration \xC9rotique & Bien-\xEAtre", "description": "\u{1F680} D\xE9couvrez l'univers fascinant de l'exploration \xE9rotique ! \u{1F48B} Conseils experts, guides pratiques et t\xE9moignages authentiques pour une vie sexuelle \xE9panouie \u2728", "type": "website", "ogImage": "/images/og-homepage.jpg", "twitterImage": "/images/twitter-homepage.jpg", "tags": ["exploration \xE9rotique", "bien-\xEAtre sexuel", "BDSM", "libertinage", "roleplay", "sex toys", "communication sexuelle", "\xE9ducation sexuelle", "plaisir", "intimit\xE9"], "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative min-h-screen flex items-center justify-center overflow-hidden" data-astro-cid-j7pv25f6> <!-- Background with animated elements --> <div class="absolute inset-0 bg-gradient-to-br from-secondary-900 via-primary-900 to-secondary-800" data-astro-cid-j7pv25f6> <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=" 60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" %3E%3Cg fill="none" fill-rule="evenodd" %3E%3Cg fill="%23ec4899" fill-opacity="0.05" %3E%3Ccircle cx="30" cy="30" r="2" %3E%3C g%3E%3C g%3E%3C svg%3E')] opacity-30" data-astro-cid-j7pv25f6></div> </div> <!-- Floating elements --> <div class="absolute top-20 left-20 w-32 h-32 bg-primary-500/20 rounded-full blur-xl animate-pulse-slow" data-astro-cid-j7pv25f6></div> <div class="absolute bottom-20 right-20 w-40 h-40 bg-sensual-500/20 rounded-full blur-xl animate-pulse-slow delay-1000" data-astro-cid-j7pv25f6></div> <div class="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-j7pv25f6> <div class="mb-8 animate-fade-in-up" data-astro-cid-j7pv25f6> <p class="inline-block px-4 py-2 bg-primary-500/20 backdrop-blur-sm border border-primary-500/30 rounded-full text-primary-300 text-sm font-medium mb-6 hover-glow animate-float" data-translate="🔥 Contenu Mature & Sophistiqué" data-astro-cid-j7pv25f6>
🔥 Contenu Mature & Sophistiqué
</p> </div> <h1 class="text-5xl md:text-7xl font-bold mb-8 text-glow animate-fade-in-up" style="animation-delay: 0.2s;" data-astro-cid-j7pv25f6> <span class="text-white" data-astro-cid-j7pv25f6>Mad2Moi</span> <span class="text-primary-400" data-astro-cid-j7pv25f6>Blog</span> </h1> <p class="text-xl md:text-2xl text-secondary-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style="animation-delay: 0.4s;" data-translate="Explorez l'univers fascinant de l'exploration érotique et du bien-être sexuel à travers des articles éducatifs, des guides pratiques et des témoignages authentiques. Pour adultes consentants uniquement." data-astro-cid-j7pv25f6>
Explorez l'univers fascinant de l'exploration érotique et du bien-être sexuel à travers des articles éducatifs, 
          des guides pratiques et des témoignages authentiques.
<span class="text-primary-400 font-semibold" data-astro-cid-j7pv25f6>Pour adultes consentants uniquement.</span> </p> <div class="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style="animation-delay: 0.6s;" data-astro-cid-j7pv25f6> <a href="/blog" class="btn-primary text-lg px-10 py-4 group" data-astro-cid-j7pv25f6> <span class="mr-2" data-astro-cid-j7pv25f6>🔍</span> <span data-translate="Explorer le Blog" data-astro-cid-j7pv25f6>Explorer le Blog</span> <span class="ml-2 group-hover:translate-x-1 transition-transform" data-astro-cid-j7pv25f6>→</span> </a> <a href="/about" class="btn-secondary text-lg px-10 py-4" data-astro-cid-j7pv25f6> <span class="mr-2" data-astro-cid-j7pv25f6>💡</span> <span data-translate="En savoir plus" data-astro-cid-j7pv25f6>En savoir plus</span> </a> <a href="https://mad2moi.com" target="_blank" rel="noopener noreferrer" class="group relative overflow-hidden bg-gradient-to-r from-primary-500 via-sensual-500 to-primary-600 text-white text-lg px-10 py-4 rounded-lg shadow-2xl hover:shadow-primary-500/50 transition-all duration-500 hover:scale-105 animate-pulse-slow" data-astro-cid-j7pv25f6> <!-- Animated background elements --> <div class="absolute inset-0 bg-gradient-to-r from-primary-600 via-sensual-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" data-astro-cid-j7pv25f6></div> <!-- Floating particles --> <div class="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" data-astro-cid-j7pv25f6></div> <div class="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-100" data-astro-cid-j7pv25f6></div> <div class="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-200" data-astro-cid-j7pv25f6></div> <!-- Button content --> <span class="relative z-10 flex items-center" data-astro-cid-j7pv25f6> <span class="mr-2 group-hover:scale-125 transition-transform duration-300" data-astro-cid-j7pv25f6>🚀</span> <span class="font-semibold" data-translate="Rejoindre Mad2Moi.com" data-astro-cid-j7pv25f6>Rejoindre Mad2Moi.com</span> <span class="ml-2 group-hover:scale-125 transition-transform duration-300" data-astro-cid-j7pv25f6>✨</span> </span> <!-- Shimmer effect --> <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" data-astro-cid-j7pv25f6></div> </a> </div> <!-- Warning banner --> <div class="mt-12 p-4 bg-red-900/30 border border-red-500/50 rounded-lg backdrop-blur-sm" data-astro-cid-j7pv25f6> <p class="text-red-200 text-sm" data-translate="⚠️ Attention : Ce blog contient du contenu explicite destiné aux adultes. Vous devez avoir 18 ans ou plus pour accéder à ce contenu." data-astro-cid-j7pv25f6>
⚠️ <strong data-astro-cid-j7pv25f6>Attention :</strong> Ce blog contient du contenu explicite destiné aux adultes. 
          Vous devez avoir 18 ans ou plus pour accéder à ce contenu.
</p> </div> </div> </section>  <section class="py-20 bg-gradient-to-b from-secondary-900/50 to-secondary-900" data-astro-cid-j7pv25f6> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-j7pv25f6> <div class="text-center mb-16" data-astro-cid-j7pv25f6> <h2 class="text-4xl md:text-5xl font-bold text-white mb-6 font-elegant" data-translate="Articles à la Une" data-astro-cid-j7pv25f6>
Articles à la Une
</h2> <p class="text-xl text-secondary-300 max-w-3xl mx-auto" data-translate="Nos articles les plus populaires et les plus récents sur l'exploration érotique" data-astro-cid-j7pv25f6>
Nos articles les plus populaires et les plus récents sur l'exploration érotique
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-astro-cid-j7pv25f6> ${featuredPosts.map((post, index) => renderTemplate`<article class="card-sensual hover:border-glow group card-hover animate-fade-in-up"${addAttribute(`animation-delay: ${0.8 + index * 0.1}s`, "style")} data-astro-cid-j7pv25f6> <div class="aspect-video bg-gradient-to-br from-primary-800/50 to-secondary-800/50 rounded-xl mb-6 overflow-hidden border border-primary-700/30" data-astro-cid-j7pv25f6> ${post.image ? renderTemplate`<img${addAttribute(post.image, "src")}${addAttribute(post.title, "alt")} class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" data-astro-cid-j7pv25f6>` : renderTemplate`<div class="w-full h-full flex items-center justify-center" data-astro-cid-j7pv25f6> <span class="text-6xl opacity-60" data-astro-cid-j7pv25f6>${post.isExplicit ? "\u{1F525}" : "\u{1F48B}"}</span> </div>`} </div> <div class="flex items-center gap-3 mb-4" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "CategoryBadge", $$CategoryBadge, { "name": post.category, "color": post.categoryColor, "size": "sm", "data-astro-cid-j7pv25f6": true })} ${post.isExplicit && renderTemplate`<p class="text-xs font-medium px-3 py-1 bg-red-500/20 text-red-300 rounded-full border border-red-500/30" data-translate="🔥 Explicite" data-astro-cid-j7pv25f6>
🔥 Explicite
</p>`} <p class="text-sm text-secondary-400" data-astro-cid-j7pv25f6>${post.readTime}</p> </div> <h3 class="text-xl font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors font-elegant" data-astro-cid-j7pv25f6> <a${addAttribute(`/blog/${post.slug}`, "href")}${addAttribute(post.title, "data-translate")} data-astro-cid-j7pv25f6>${post.title}</a> </h3> <!-- Related categories links --> <div class="mb-3" data-astro-cid-j7pv25f6> ${post.tags.slice(0, 2).map((tag) => renderTemplate`<a${addAttribute(`/blog?category=${tag.toLowerCase()}`, "href")} class="inline-block text-xs px-2 py-1 bg-secondary-800/50 text-secondary-300 rounded border border-secondary-600/30 hover:bg-primary-500/20 hover:text-primary-300 transition-colors mr-2" data-astro-cid-j7pv25f6>
#${tag} </a>`)} </div> <p class="text-secondary-300 mb-4 line-clamp-3 leading-relaxed"${addAttribute(post.excerpt, "data-translate")} data-astro-cid-j7pv25f6>${post.excerpt}</p> <div class="flex items-center justify-between text-sm text-secondary-400" data-astro-cid-j7pv25f6> <p class="font-medium text-primary-300" data-astro-cid-j7pv25f6>${post.author}</p> <time${addAttribute(post.publishedAt, "datetime")}${addAttribute(new Date(post.publishedAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }), "data-translate")} data-astro-cid-j7pv25f6> ${new Date(post.publishedAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </time> </div> </article>`)} </div> </div> </section>  <section class="py-20 bg-gradient-to-b from-secondary-900 to-secondary-800" data-astro-cid-j7pv25f6> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-j7pv25f6> <div class="text-center mb-16" data-astro-cid-j7pv25f6> <h2 class="text-4xl md:text-5xl font-bold text-white mb-6 font-elegant" data-translate="Explorez par Catégorie" data-astro-cid-j7pv25f6>
Explorez par Catégorie
</h2> <p class="text-xl text-secondary-300 max-w-3xl mx-auto" data-translate="Trouvez le contenu qui correspond à vos intérêts et vos envies d'exploration" data-astro-cid-j7pv25f6>
Trouvez le contenu qui correspond à vos intérêts et vos envies d'exploration
</p> </div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6" data-astro-cid-j7pv25f6> ${categories.map((category) => renderTemplate`<a${addAttribute(`/blog?category=${category.name.toLowerCase()}`, "href")} class="card text-center group hover:border-primary-500/50 transform hover:scale-105 transition-all duration-300" data-astro-cid-j7pv25f6> <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" data-astro-cid-j7pv25f6> ${category.icon} </div> <div${addAttribute(`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${category.color}`, "class")}${addAttribute(category.name, "data-translate")} data-astro-cid-j7pv25f6> ${category.name} </div> <p class="text-3xl font-bold text-white mb-2" data-astro-cid-j7pv25f6>${category.count}</p> <p class="text-sm text-secondary-400" data-translate="articles" data-astro-cid-j7pv25f6>articles</p> </a>`)} </div> </div> </section>  <section class="py-20 bg-gradient-to-b from-secondary-800 to-secondary-900" data-astro-cid-j7pv25f6> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-j7pv25f6> <div class="flex items-center justify-between mb-16" data-astro-cid-j7pv25f6> <div data-astro-cid-j7pv25f6> <h2 class="text-4xl md:text-5xl font-bold text-white mb-6 font-elegant" data-translate="Articles Récents" data-astro-cid-j7pv25f6>
Articles Récents
</h2> <p class="text-xl text-secondary-300" data-translate="Les dernières publications du blog" data-astro-cid-j7pv25f6>
Les dernières publications du blog
</p> </div> <a href="/blog" class="btn-primary text-lg px-8 py-4" data-astro-cid-j7pv25f6> <span class="mr-2" data-astro-cid-j7pv25f6>📚</span> <span data-translate="Voir tous les articles" data-astro-cid-j7pv25f6>Voir tous les articles</span> </a> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-astro-cid-j7pv25f6> ${recentPosts.map((post) => renderTemplate`<article class="card group hover:border-primary-500/50 transform hover:scale-105 transition-all duration-300" data-astro-cid-j7pv25f6> <div class="aspect-video bg-gradient-to-br from-secondary-800/50 to-secondary-700/50 rounded-xl mb-6 overflow-hidden border border-secondary-600/30" data-astro-cid-j7pv25f6> ${post.image ? renderTemplate`<img${addAttribute(post.image, "src")}${addAttribute(post.title, "alt")} class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" data-astro-cid-j7pv25f6>` : renderTemplate`<div class="w-full h-full flex items-center justify-center" data-astro-cid-j7pv25f6> <span class="text-5xl opacity-60" data-astro-cid-j7pv25f6>💋</span> </div>`} </div> <div class="flex items-center gap-2 mb-4" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "CategoryBadge", $$CategoryBadge, { "name": post.category, "color": post.categoryColor, "size": "sm", "data-astro-cid-j7pv25f6": true })} <p class="text-sm text-secondary-400" data-astro-cid-j7pv25f6>${post.readTime}</p> </div> <h3 class="text-lg font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors font-elegant" data-astro-cid-j7pv25f6> <a${addAttribute(`/blog/${post.slug}`, "href")}${addAttribute(post.title, "data-translate")} data-astro-cid-j7pv25f6>${post.title}</a> </h3> <p class="text-secondary-300 mb-4 line-clamp-2 leading-relaxed"${addAttribute(post.excerpt, "data-translate")} data-astro-cid-j7pv25f6>${post.excerpt}</p> <time class="text-sm text-secondary-400"${addAttribute(post.publishedAt, "datetime")}${addAttribute(new Date(post.publishedAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }), "data-translate")} data-astro-cid-j7pv25f6> ${new Date(post.publishedAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </time> </article>`)} </div> </div> </section>  <section class="py-20 bg-gradient-to-b from-secondary-900 to-black" data-astro-cid-j7pv25f6> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-j7pv25f6> <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" data-astro-cid-j7pv25f6> ${stats.map((stat, index) => renderTemplate`<div class="group animate-fade-in-up hover-lift"${addAttribute(`animation-delay: ${index * 0.1}s`, "style")} data-astro-cid-j7pv25f6> <div class="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300" data-astro-cid-j7pv25f6> ${stat.icon} </div> <p class="text-4xl font-bold text-white mb-2 text-glow" data-astro-cid-j7pv25f6>${stat.number}</p> <p class="text-secondary-400"${addAttribute(stat.label, "data-translate")} data-astro-cid-j7pv25f6>${stat.label}</p> </div>`)} </div> </div> </section>  ${renderComponent($$result2, "LiveChat", $$LiveChat, { "data-astro-cid-j7pv25f6": true })} ` })} `;
}, "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/pages/index.astro", void 0);

const $$file = "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
