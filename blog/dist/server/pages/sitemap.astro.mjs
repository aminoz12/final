/* empty css                                 */
import { a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_BNe_LUEH.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DmzNGBki.mjs';
import { getCategories, getPublishedArticles } from '../chunks/database_CcuPA5-H.mjs';
export { renderers } from '../renderers.mjs';

const $$Sitemap = createComponent(async ($$result, $$props, $$slots) => {
  let categories = [];
  let featuredArticles = [];
  try {
    categories = await getCategories();
    featuredArticles = await getPublishedArticles();
  } catch (error) {
    console.error("\u274C Error loading sitemap data:", error);
  }
  const pageTitle = "Plan du Site - Mad2Moi Blog";
  const pageDescription = "\u{1F680} Explorez notre blog complet ! \u{1F48B} Navigation facile vers tous nos articles sur l'exploration \xE9rotique et le bien-\xEAtre sexuel \u2728";
  const ogImage = "/images/og-sitemap.jpg";
  const twitterImage = "/images/twitter-sitemap.jpg";
  const keywords = ["plan du site", "navigation", "sitemap", "exploration \xE9rotique", "bien-\xEAtre sexuel", "articles", "cat\xE9gories"];
  const siteStructure = {
    main: [
      { name: "Accueil", url: "/", description: "Page d'accueil du blog" },
      { name: "Blog", url: "/blog", description: "Tous nos articles" },
      { name: "Cat\xE9gories", url: "/categories", description: "Explorer par cat\xE9gorie" },
      { name: "\xC0 propos", url: "/about", description: "Qui sommes-nous" },
      { name: "Contact", url: "/contact", description: "Nous contacter" },
      { name: "FAQ", url: "/faq", description: "Questions fr\xE9quentes" },
      { name: "Services", url: "/services", description: "Nos services" }
    ],
    blog: {
      categories: categories.map((cat) => ({
        name: cat.name,
        url: `/blog?category=${cat.slug}`,
        count: cat.article_count || 0,
        description: cat.description || `Articles sur ${cat.name}`
      })),
      featured: featuredArticles.slice(0, 5)
      // Limit to 5 featured articles
    },
    resources: [
      { name: "Lexique \xE9rotique", url: "/lexique", description: "D\xE9finitions et termes sp\xE9cialis\xE9s" },
      { name: "Ressources d'aide", url: "/ressources-aide", description: "Organisations et professionnels" },
      { name: "Bibliographie", url: "/bibliographie", description: "Livres et r\xE9f\xE9rences recommand\xE9s" }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "ogImage": ogImage, "twitterImage": twitterImage, "tags": keywords }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative py-20 overflow-hidden"> <div class="absolute inset-0 bg-gradient-to-br from-secondary-900 via-primary-900 to-secondary-800"> <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=" 60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" %3E%3Cg fill="none" fill-rule="evenodd" %3E%3Cg fill="%23ec4899" fill-opacity="0.05" %3E%3Ccircle cx="30" cy="30" r="2" %3E%3C g%3E%3C g%3E%3C svg%3E')] opacity-30"></div> </div> <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h1 class="text-5xl md:text-6xl font-bold text-white mb-6 font-elegant text-glow" data-translate="Plan du Site">
Plan du <span class="text-primary-400">Site</span> </h1> <p class="text-xl text-secondary-300 mb-8 max-w-3xl mx-auto leading-relaxed" data-translate="Naviguez facilement dans tous nos contenus sur l'exploration érotique et le bien-être sexuel. Trouvez rapidement ce que vous cherchez.">
Naviguez facilement dans tous nos contenus sur l'exploration érotique et 
        le bien-être sexuel. Trouvez rapidement ce que vous cherchez.
</p> </div> </section>  <section class="py-20 bg-gradient-to-b from-secondary-900 to-secondary-800"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-white mb-12 text-center font-elegant" data-translate="🏠 Navigation Principale">
🏠 Navigation Principale
</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${siteStructure.main.map((item) => renderTemplate`<a${addAttribute(item.url, "href")} class="group block p-6 bg-secondary-800/50 border border-secondary-700/30 rounded-xl hover:border-primary-500/50 hover:bg-secondary-800/70 transition-all duration-300"> <h3 class="text-xl font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors"> ${item.name} </h3> <p class="text-secondary-300 text-sm leading-relaxed"> ${item.description} </p> <div class="mt-4 text-primary-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
Visiter →
</div> </a>`)} </div> </div> </section>  <section class="py-20 bg-gradient-to-b from-secondary-800 to-secondary-900"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-white mb-12 text-center font-elegant" data-translate="📚 Catégories du Blog">
📚 Catégories du Blog
</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${siteStructure.blog.categories.map((category) => renderTemplate`<a${addAttribute(category.url, "href")} class="group block p-6 bg-secondary-800/50 border border-secondary-700/30 rounded-xl hover:border-primary-500/50 hover:bg-secondary-800/70 transition-all duration-300"> <div class="flex items-center justify-between mb-3"> <h3 class="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors"> ${category.name} </h3> <span class="text-sm text-primary-400 bg-primary-500/20 px-2 py-1 rounded-full"> ${category.count} articles
</span> </div> <p class="text-secondary-300 text-sm leading-relaxed"> ${category.description} </p> <div class="mt-4 text-primary-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
Explorer →
</div> </a>`)} </div> </div> </section>  <section class="py-20 bg-gradient-to-b from-secondary-900 to-secondary-800"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-white mb-12 text-center font-elegant" data-translate="⭐ Articles à la Une">
⭐ Articles à la Une
</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> ${siteStructure.blog.featured.map((article) => renderTemplate`<a${addAttribute(article.url, "href")} class="group block p-6 bg-secondary-800/50 border border-secondary-700/30 rounded-xl hover:border-primary-500/50 hover:bg-secondary-800/70 transition-all duration-300"> <h3 class="text-lg font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors line-clamp-2"${addAttribute(article.name, "data-translate")}> ${article.name} </h3> <div class="text-primary-400 text-sm font-medium group-hover:translate-x-1 transition-transform" data-translate="Lire l'article →">
Lire l'article →
</div> </a>`)} </div> </div> </section>  <section class="py-20 bg-gradient-to-b from-secondary-800 to-secondary-900"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <h2 class="text-3xl font-bold text-white mb-12 text-center font-elegant" data-translate="📖 Ressources & Guides">
📖 Ressources & Guides
</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> ${siteStructure.resources.map((resource) => renderTemplate`<a${addAttribute(resource.url, "href")} class="group block p-6 bg-secondary-800/50 border border-secondary-700/30 rounded-xl hover:border-primary-500/50 hover:bg-secondary-800/70 transition-all duration-300"> <h3 class="text-xl font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors"${addAttribute(resource.name, "data-translate")}> ${resource.name} </h3> <p class="text-secondary-300 text-sm leading-relaxed"${addAttribute(resource.description, "data-translate")}> ${resource.description} </p> <div class="mt-4 text-primary-400 text-sm font-medium group-hover:translate-x-1 transition-transform" data-translate="Consulter →">
Consulter →
</div> </a>`)} </div> </div> </section>  <section class="py-20 bg-gradient-to-r from-primary-900 to-secondary-900"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <h2 class="text-3xl font-bold text-white mb-8 font-elegant" data-translate="🔗 Liens Rapides">
🔗 Liens Rapides
</h2> <div class="grid grid-cols-2 md:grid-cols-4 gap-4"> <a href="/blog" class="p-4 bg-primary-500/20 border border-primary-500/30 rounded-lg hover:bg-primary-500/30 transition-colors"> <div class="text-2xl mb-2">📝</div> <div class="text-white font-medium" data-translate="Blog">Blog</div> </a> <a href="/faq" class="p-4 bg-sensual-500/20 border border-sensual-500/30 rounded-lg hover:bg-sensual-500/30 transition-colors"> <div class="text-2xl mb-2">❓</div> <div class="text-white font-medium" data-translate="FAQ">FAQ</div> </a> <a href="/contact" class="p-4 bg-secondary-500/20 border border-secondary-500/30 rounded-lg hover:bg-secondary-500/30 transition-colors"> <div class="text-2xl mb-2">📞</div> <div class="text-white font-medium" data-translate="Contact">Contact</div> </a> <a href="https://mad2moi.com" target="_blank" rel="noopener noreferrer" class="p-4 bg-primary-500/20 border border-primary-500/30 rounded-lg hover:bg-primary-500/30 transition-colors"> <div class="text-2xl mb-2">🚀</div> <div class="text-white font-medium" data-translate="Mad2Moi.com">Mad2Moi.com</div> </a> </div> </div> </section>  ${renderComponent($$result2, "LiveChat", LiveChat, {})}  ${renderComponent($$result2, "JoinMad2MoiCTA", JoinMad2MoiCTA, {})} ` })}`;
}, "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/pages/sitemap.astro", void 0);

const $$file = "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/pages/sitemap.astro";
const $$url = "/sitemap";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Sitemap,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
