/* empty css                                    */
import { c as createAstro, a as createComponent, m as maybeRenderHead, r as renderTemplate, b as addAttribute, d as renderComponent, u as unescapeHTML } from '../../chunks/astro/server_BNe_LUEH.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_DmzNGBki.mjs';
import { incrementViewCount, initializeDatabase } from '../../chunks/database_CcuPA5-H.mjs';
import 'clsx';
import { $ as $$CategoryBadge } from '../../chunks/CategoryBadge_BSXgJVo4.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const $$Astro$5 = createAstro("https://your-domain.com");
const $$Breadcrumbs = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Breadcrumbs;
  const { items } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<nav class="mb-8" aria-label="Breadcrumb"> <ol class="flex items-center space-x-2 text-sm"> ${items.map((item, index) => renderTemplate`<li class="flex items-center"> ${index > 0 && renderTemplate`<svg class="w-4 h-4 text-secondary-400 mx-2" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path> </svg>`} ${item.current ? renderTemplate`<span class="text-primary-400 font-medium" aria-current="page"> ${item.label} </span>` : item.href ? renderTemplate`<a${addAttribute(item.href, "href")} class="text-secondary-300 hover:text-primary-400 transition-colors duration-200 hover:underline"> ${item.label} </a>` : renderTemplate`<span class="text-secondary-400">${item.label}</span>`} </li>`)} </ol> </nav>`;
}, "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/components/blog/Breadcrumbs.astro", void 0);

const $$Astro$4 = createAstro("https://your-domain.com");
const $$SocialShare = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$SocialShare;
  const { url, title, description = "", image = "" } = Astro2.props;
  const socialPlatforms = [
    {
      name: "Facebook",
      icon: "\u{1F4D8}",
      color: "bg-blue-600 hover:bg-blue-700",
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    {
      name: "X (Twitter)",
      icon: "\u{1F426}",
      color: "bg-black hover:bg-gray-800",
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    },
    {
      name: "Instagram",
      icon: "\u{1F4F7}",
      color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      shareUrl: `https://www.instagram.com/?url=${encodeURIComponent(url)}`
    },
    {
      name: "WhatsApp",
      icon: "\u{1F4AC}",
      color: "bg-green-600 hover:bg-green-700",
      shareUrl: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`
    },
    {
      name: "Messenger",
      icon: "\u{1F499}",
      color: "bg-blue-500 hover:bg-blue-600",
      shareUrl: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(url)}`
    },
    {
      name: "Email",
      icon: "\u{1F4E7}",
      color: "bg-gray-600 hover:bg-gray-700",
      shareUrl: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + "\n\n" + url)}`
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="p-8 bg-gradient-to-r from-secondary-800/50 to-secondary-900/50 rounded-2xl border border-secondary-700/30 shadow-xl"> <div class="text-center mb-8"> <h3 class="text-2xl font-bold text-white mb-2 font-elegant">📤 Partager cet article</h3> <p class="text-secondary-300">Aidez-nous à faire connaître cet article en le partageant sur vos réseaux sociaux</p> </div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"> ${socialPlatforms.map((platform) => renderTemplate`<a${addAttribute(platform.shareUrl, "href")} target="_blank" rel="noopener noreferrer"${addAttribute(`${platform.color} text-white p-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex flex-col items-center gap-2 shadow-lg hover:shadow-xl`, "class")}${addAttribute(`Partager sur ${platform.name}`, "title")}> <span class="text-2xl">${platform.icon}</span> <span class="text-sm font-medium">${platform.name}</span> </a>`)} </div> <!-- Copy Link Button --> <div class="p-6 bg-secondary-700/20 rounded-xl border border-secondary-600/20"> <h4 class="text-lg font-semibold text-white mb-4 text-center">🔗 Copier le lien</h4> <div class="flex flex-col sm:flex-row items-center gap-4"> <input type="text"${addAttribute(url, "value")} readonly class="flex-1 px-4 py-3 bg-secondary-700/50 border border-secondary-600/30 rounded-lg text-secondary-200 text-sm font-mono" id="share-url-{title.replace(/\s+/g, '-').toLowerCase()}"> <button onclick="copyToClipboard('share-url-{title.replace(/\s+/g, '-').toLowerCase()}')" class="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap" title="Copier le lien"> <span>📋</span> <span>Copier le lien</span> </button> </div> <div id="copy-success-{title.replace(/\s+/g, '-').toLowerCase()}" class="hidden mt-3 text-center"> <p class="text-green-400 text-sm font-medium">✅ Lien copié avec succès !</p> </div> </div> </section> `;
}, "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/components/blog/SocialShare.astro", void 0);

const $$Astro$3 = createAstro("https://your-domain.com");
const $$CommentSection = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$CommentSection;
  const { postSlug, postTitle } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="mt-16 p-8 bg-secondary-800/50 rounded-xl border border-secondary-700/30 shadow-xl"> <h3 class="text-3xl font-bold text-white mb-8 font-elegant text-center">
💬 Commentaires (${Math.floor(Math.random() * 50) + 10})
</h3> <!-- Comment Form --> <div class="mb-10 p-8 bg-secondary-700/30 rounded-xl border border-secondary-600/30 shadow-lg"> <h4 class="text-xl font-semibold text-white mb-6 flex items-center gap-3"> <span class="text-2xl">✍️</span>
Ajouter un commentaire
</h4> <form id="comment-form" class="space-y-6"> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label class="block text-sm font-medium text-secondary-300 mb-2">Votre nom *</label> <input type="text" name="name" placeholder="Entrez votre nom" class="w-full px-4 py-3 bg-secondary-600/50 border border-secondary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-secondary-300 transition-all duration-200" required> </div> <div> <label class="block text-sm font-medium text-secondary-300 mb-2">Votre email</label> <input type="email" name="email" placeholder="Entrez votre email (optionnel)" class="w-full px-4 py-3 bg-secondary-600/50 border border-secondary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-secondary-300 transition-all duration-200"> </div> </div> <div> <label class="block text-sm font-medium text-secondary-300 mb-2">Votre commentaire *</label> <textarea name="comment" placeholder="Partagez vos pensées sur cet article..." rows="5" class="w-full px-4 py-3 bg-secondary-600/50 border border-secondary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-secondary-300 resize-none transition-all duration-200" required></textarea> </div> <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"> <label class="flex items-center gap-3 text-sm text-secondary-300 hover:text-secondary-200 transition-colors cursor-pointer"> <input type="checkbox" name="notify" class="w-4 h-4 rounded border-secondary-500/30 bg-secondary-600/50 text-primary-400 focus:ring-primary-400 focus:ring-2"> <span>M'notifier des réponses</span> </label> <button type="submit" class="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"> <span>💬</span> <span>Publier le commentaire</span> </button> </div> </form> </div> <!-- Comments List --> <div class="space-y-6"> <!-- Sample Comments --> <div class="comment-item p-6 bg-secondary-700/20 rounded-xl border border-secondary-600/20 hover:border-secondary-500/40 transition-all duration-200"> <div class="flex items-start gap-4 mb-4"> <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
M
</div> <div class="flex-1"> <div class="flex flex-wrap items-center gap-3 mb-2"> <span class="font-semibold text-white text-lg">Marie Sensuelle</span> <span class="text-sm text-secondary-400">Il y a 2 heures</span> <span class="text-xs px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full border border-primary-500/30">Auteur</span> </div> <p class="text-secondary-200 leading-relaxed text-base">
Excellent article ! J'ai particulièrement apprécié la section sur la sécurité. C'est tellement important de bien s'informer avant de commencer. Merci pour ce contenu de qualité ! 🌟
</p> <div class="flex items-center gap-6 mt-4"> <button class="flex items-center gap-2 text-sm text-secondary-400 hover:text-primary-400 transition-colors hover:scale-105"> <span class="text-lg">👍</span> <span class="font-medium">12</span> </button> <button class="flex items-center gap-2 text-sm text-secondary-400 hover:text-primary-400 transition-colors hover:scale-105"> <span class="text-lg">💬</span> <span class="font-medium">Répondre</span> </button> </div> </div> </div> </div> <div class="comment-item p-6 bg-secondary-700/20 rounded-xl border border-secondary-600/20 hover:border-secondary-500/40 transition-all duration-200 ml-8 md:ml-12"> <div class="flex items-start gap-4 mb-4"> <div class="w-10 h-10 bg-gradient-to-br from-sensual-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-base shadow-lg">
L
</div> <div class="flex-1"> <div class="flex flex-wrap items-center gap-3 mb-2"> <span class="font-semibold text-white">Luc Libertine</span> <span class="text-sm text-secondary-400">Il y a 1 heure</span> </div> <p class="text-secondary-200 leading-relaxed text-base">
@Marie Sensuelle Je suis d'accord ! La sécurité est primordiale. Avez-vous des conseils spécifiques pour les débutants ? 🤔
</p> <div class="flex items-center gap-6 mt-4"> <button class="flex items-center gap-2 text-sm text-secondary-400 hover:text-primary-400 transition-colors hover:scale-105"> <span class="text-lg">👍</span> <span class="font-medium">3</span> </button> <button class="flex items-center gap-2 text-sm text-secondary-400 hover:text-primary-400 transition-colors hover:scale-105"> <span class="text-lg">💬</span> <span class="font-medium">Répondre</span> </button> </div> </div> </div> </div> <div class="comment-item p-6 bg-secondary-700/20 rounded-xl border border-secondary-600/20 hover:border-secondary-500/40 transition-all duration-200"> <div class="flex items-start gap-4 mb-4"> <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
S
</div> <div class="flex-1"> <div class="flex flex-wrap items-center gap-3 mb-2"> <span class="font-semibold text-white text-lg">Sophie Explorer</span> <span class="text-sm text-secondary-400">Il y a 3 heures</span> </div> <p class="text-secondary-200 leading-relaxed text-base">
Très informatif ! J'ai appris beaucoup de choses sur les protocoles de sécurité. C'est rassurant de voir qu'il y a une approche aussi structurée. 👏
</p> <div class="flex items-center gap-6 mt-4"> <button class="flex items-center gap-2 text-sm text-secondary-400 hover:text-primary-400 transition-colors hover:scale-105"> <span class="text-lg">👍</span> <span class="font-medium">8</span> </button> <button class="flex items-center gap-2 text-sm text-secondary-400 hover:text-primary-400 transition-colors hover:scale-105"> <span class="text-lg">💬</span> <span class="font-medium">Répondre</span> </button> </div> </div> </div> </div> </div> <!-- Load More Comments --> <div class="text-center mt-8 pt-6 border-t border-secondary-600/30"> <button class="px-6 py-3 bg-secondary-700/50 hover:bg-secondary-600/50 text-secondary-300 hover:text-white rounded-lg transition-all duration-200 border border-secondary-600/30 hover:border-secondary-500/50 flex items-center gap-2 mx-auto"> <span>📄</span> <span>Charger plus de commentaires</span> </button> </div> </section> `;
}, "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/components/blog/CommentSection.astro", void 0);

const $$Astro$2 = createAstro("https://your-domain.com");
const $$CallToAction = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$CallToAction;
  const {
    type,
    title,
    description,
    buttonText,
    buttonLink,
    icon = "\u2728",
    variant = "primary"
  } = Astro2.props;
  const variants = {
    primary: "bg-gradient-to-r from-primary-900 to-primary-800 border-primary-600/30",
    secondary: "bg-gradient-to-r from-secondary-900 to-secondary-800 border-secondary-600/30",
    accent: "bg-gradient-to-br from-sensual-900 to-sensual-800 border-sensual-600/30"
  };
  const getContent = () => {
    switch (type) {
      case "newsletter":
        return {
          title: title || "Restez Connect\xE9 avec Mad2Moi",
          description: description || "Recevez nos derniers articles, conseils exclusifs et offres sp\xE9ciales directement dans votre bo\xEEte mail.",
          buttonText: buttonText || "S'abonner \xE0 la Newsletter",
          buttonLink: buttonLink || "#newsletter-signup",
          icon: "\u{1F4E7}"
        };
      case "related-posts":
        return {
          title: title || "D\xE9couvrez d'Autres Articles",
          description: description || "Continuez votre exploration avec nos articles similaires qui pourraient vous int\xE9resser.",
          buttonText: buttonText || "Voir Plus d'Articles",
          buttonLink: buttonLink || "/blog",
          icon: "\u{1F4DA}"
        };
      case "contact":
        return {
          title: title || "Besoin d'Aide ou de Conseils ?",
          description: description || "Notre \xE9quipe d'experts est l\xE0 pour vous accompagner dans votre exploration \xE9rotique.",
          buttonText: buttonText || "Contactez-Nous",
          buttonLink: buttonLink || "/contact",
          icon: "\u{1F4AC}"
        };
      case "social-follow":
        return {
          title: title || "Suivez-Nous sur les R\xE9seaux Sociaux",
          description: description || "Restez connect\xE9 avec notre communaut\xE9 et d\xE9couvrez du contenu exclusif en temps r\xE9el.",
          buttonText: buttonText || "Nous Suivre",
          buttonLink: buttonLink || "#social-links",
          icon: "\u{1F31F}"
        };
      default:
        return {
          title: title || "Appel \xE0 l'Action",
          description: description || "Cliquez ici pour en savoir plus.",
          buttonText: buttonText || "En Savoir Plus",
          buttonLink: buttonLink || "#",
          icon
        };
    }
  };
  const content = getContent();
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(`mt-12 p-8 rounded-xl border ${variants[variant]} relative overflow-hidden shadow-2xl`, "class")}> <!-- Background Pattern --> <div class="absolute inset-0 opacity-10"> <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=" 60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" %3E%3Cg fill="none" fill-rule="evenodd" %3E%3Cg fill="%23ec4899" fill-opacity="0.1" %3E%3Ccircle cx="30" cy="30" r="2" %3E%3C g%3E%3C g%3E%3C svg%3E')]"></div> </div> <div class="relative z-10 flex flex-col lg:flex-row items-center gap-8"> <!-- Icon and Content --> <div class="flex-1 text-center lg:text-left"> <div class="text-5xl mb-4 drop-shadow-lg">${content.icon}</div> <h3 class="text-2xl font-bold text-white mb-4 font-elegant leading-tight"> ${content.title} </h3> <p class="text-lg text-white/90 leading-relaxed max-w-2xl"> ${content.description} </p> </div> <!-- Action Button --> <div class="flex-shrink-0"> <a${addAttribute(content.buttonLink, "href")} class="inline-block px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-all duration-300 hover:scale-105 text-center shadow-lg hover:shadow-xl"> ${content.buttonText} </a> </div> </div> </section>`;
}, "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/components/blog/CallToAction.astro", void 0);

const $$Astro$1 = createAstro("https://your-domain.com");
const $$EngagementStats = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$EngagementStats;
  const { postSlug, likes = 0, shares = 0, comments = 0, bookmarks = 0 } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="p-6 bg-gradient-to-r from-secondary-800/50 to-secondary-900/50 rounded-2xl border border-secondary-700/30 shadow-xl"> <h3 class="text-xl font-semibold text-white mb-6 text-center font-elegant">
📊 Statistiques d'Engagement
</h3> <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6"> <!-- Likes --> <div class="text-center p-4 bg-secondary-700/20 rounded-xl border border-secondary-600/20 hover:border-primary-500/30 transition-all duration-200 group"> <button class="w-full flex flex-col items-center gap-2 text-secondary-300 hover:text-primary-400 transition-all duration-200 group-hover:scale-105" onclick="toggleLike('{postSlug}')" id="like-btn-{postSlug}"> <span class="text-3xl group-hover:scale-110 transition-transform duration-200">❤️</span> <span class="font-bold text-lg" id="like-count-{postSlug}">${likes}</span> <span class="text-sm opacity-80">J'aime</span> </button> </div> <!-- Comments --> <div class="text-center p-4 bg-secondary-700/20 rounded-xl border border-secondary-600/20"> <div class="w-full flex flex-col items-center gap-2 text-secondary-300"> <span class="text-3xl">💬</span> <span class="font-bold text-lg">${comments}</span> <span class="text-sm opacity-80">Commentaires</span> </div> </div> <!-- Shares --> <div class="text-center p-4 bg-secondary-700/20 rounded-xl border border-secondary-600/20"> <div class="w-full flex flex-col items-center gap-2 text-secondary-300"> <span class="text-3xl">📤</span> <span class="font-bold text-lg">${shares}</span> <span class="text-sm opacity-80">Partages</span> </div> </div> <!-- Bookmarks --> <div class="text-center p-4 bg-secondary-700/20 rounded-xl border border-secondary-600/20 hover:border-yellow-500/30 transition-all duration-200 group"> <button class="w-full flex flex-col items-center gap-2 text-secondary-300 hover:text-yellow-400 transition-all duration-200 group-hover:scale-105" onclick="toggleBookmark('{postSlug}')" id="bookmark-btn-{postSlug}"> <span class="text-3xl group-hover:scale-110 transition-transform duration-200">🔖</span> <span class="font-bold text-lg" id="bookmark-count-{postSlug}">${bookmarks}</span> <span class="text-sm opacity-80">Sauvegardes</span> </button> </div> </div> <!-- Reading Progress --> <div class="text-center p-4 bg-primary-900/20 rounded-xl border border-primary-700/30"> <div class="flex items-center justify-center gap-3 text-primary-300"> <span class="text-xl">📖</span> <span class="text-sm font-medium">Progression de lecture</span> <span class="text-lg font-bold" id="reading-progress-{postSlug}">0%</span> </div> <div class="w-full bg-secondary-700/30 rounded-full h-2 mt-3"> <div class="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300 ease-out" id="reading-progress-bar-{postSlug}" style="width: 0%"></div> </div> </div> </div> `;
}, "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/components/blog/EngagementStats.astro", void 0);

const $$Astro = createAstro("https://your-domain.com");
async function getStaticPaths() {
  try {
    await initializeDatabase();
    const { getPublishedArticles } = await import('../../chunks/database_CcuPA5-H.mjs');
    const articles = await getPublishedArticles();
    return articles.map((article) => ({
      params: { slug: article.slug },
      props: { article }
    }));
  } catch (error) {
    console.error("\u274C Error generating static paths:", error);
    return [];
  }
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { article } = Astro2.props;
  if (article?.id) {
    try {
      await incrementViewCount(article.id);
    } catch (error) {
      console.error("\u274C Error incrementing view count:", error);
    }
  }
  const tags = article?.tags ? typeof article.tags === "string" ? JSON.parse(article.tags) : article.tags : [];
  const featuredImage = article?.featured_image ? typeof article.featured_image === "string" ? JSON.parse(article.featured_image) : article.featured_image : null;
  const publishedDate = article?.published_at ? new Date(article.published_at) : new Date(article?.created_at);
  const formattedDate = publishedDate.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const pageTitle = article?.meta_title || article?.title || "Article";
  const pageDescription = article?.meta_description || article?.excerpt || "D\xE9couvrez cet article sur Mad2Moi";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-4sn4zg3r": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-primary-800" data-astro-cid-4sn4zg3r> <!-- Hero Section --> <div class="relative overflow-hidden" data-astro-cid-4sn4zg3r> <!-- Background Image --> ${featuredImage && renderTemplate`<div class="absolute inset-0 z-0" data-astro-cid-4sn4zg3r> <img${addAttribute(featuredImage.url, "src")}${addAttribute(article.title, "alt")} class="w-full h-full object-cover opacity-20" data-astro-cid-4sn4zg3r> <div class="absolute inset-0 bg-gradient-to-b from-transparent via-secondary-900/50 to-secondary-900" data-astro-cid-4sn4zg3r></div> </div>`} <!-- Content --> <div class="relative z-10 container mx-auto px-4 py-16" data-astro-cid-4sn4zg3r> <div class="max-w-4xl mx-auto text-center" data-astro-cid-4sn4zg3r> <!-- Category Badge --> ${article?.category_name && renderTemplate`${renderComponent($$result2, "CategoryBadge", $$CategoryBadge, { "name": article.category_name, "color": article.category_color, "size": "lg", "className": "mb-6", "data-astro-cid-4sn4zg3r": true })}`} <!-- Title --> <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" data-astro-cid-4sn4zg3r> ${article?.title} </h1> <!-- Excerpt --> ${article?.excerpt && renderTemplate`<p class="text-xl text-secondary-300 mb-8 max-w-3xl mx-auto leading-relaxed" data-astro-cid-4sn4zg3r> ${article.excerpt} </p>`} <!-- Meta Information --> <div class="flex flex-wrap items-center justify-center gap-6 text-secondary-400 text-sm" data-astro-cid-4sn4zg3r> <div class="flex items-center gap-2" data-astro-cid-4sn4zg3r> <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-4sn4zg3r> <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" data-astro-cid-4sn4zg3r></path> </svg> <span data-astro-cid-4sn4zg3r>${article?.author_name || "Mad2Moi Team"}</span> </div> <div class="flex items-center gap-2" data-astro-cid-4sn4zg3r> <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-4sn4zg3r> <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" data-astro-cid-4sn4zg3r></path> </svg> <span data-astro-cid-4sn4zg3r>${formattedDate}</span> </div> <div class="flex items-center gap-2" data-astro-cid-4sn4zg3r> <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-4sn4zg3r> <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" data-astro-cid-4sn4zg3r></path> <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" data-astro-cid-4sn4zg3r></path> </svg> <span data-astro-cid-4sn4zg3r>${article?.view_count || 0} vues</span> </div> </div> </div> </div> </div> <!-- Breadcrumbs --> <div class="container mx-auto px-4 -mt-8 mb-8" data-astro-cid-4sn4zg3r> ${renderComponent($$result2, "Breadcrumbs", $$Breadcrumbs, { "items": [
    { label: "Accueil", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: article?.category_name || "Article", href: `/blog?category=${article?.category_slug || ""}` },
    { label: article?.title || "Article", href: "#" }
  ], "data-astro-cid-4sn4zg3r": true })} </div> <!-- Article Content --> <div class="container mx-auto px-4 pb-16" data-astro-cid-4sn4zg3r> <div class="max-w-4xl mx-auto" data-astro-cid-4sn4zg3r> <article class="prose prose-lg prose-invert prose-primary max-w-none" data-astro-cid-4sn4zg3r> <!-- Featured Image --> ${featuredImage && renderTemplate`<div class="mb-8 rounded-lg overflow-hidden" data-astro-cid-4sn4zg3r> <img${addAttribute(featuredImage.url, "src")}${addAttribute(article?.title, "alt")} class="w-full h-auto" data-astro-cid-4sn4zg3r> </div>`} <!-- Article Content --> <div class="text-secondary-300 leading-relaxed" data-astro-cid-4sn4zg3r>${unescapeHTML(article?.content || "")}</div> <!-- Tags --> ${tags && tags.length > 0 && renderTemplate`<div class="mt-8 pt-8 border-t border-secondary-700" data-astro-cid-4sn4zg3r> <h3 class="text-lg font-semibold text-white mb-4" data-astro-cid-4sn4zg3r>Tags</h3> <div class="flex flex-wrap gap-2" data-astro-cid-4sn4zg3r> ${tags.map((tag) => renderTemplate`<span class="px-3 py-1 bg-primary-900/30 border border-primary-700/50 rounded-full text-sm text-primary-400" data-astro-cid-4sn4zg3r> ${tag} </span>`)} </div> </div>`} </article> <!-- Engagement Stats --> <div class="mt-12" data-astro-cid-4sn4zg3r> ${renderComponent($$result2, "EngagementStats", $$EngagementStats, { "views": article?.view_count || 0, "likes": 0, "shares": 0, "data-astro-cid-4sn4zg3r": true })} </div> <!-- Social Share --> <div class="mt-8" data-astro-cid-4sn4zg3r> ${renderComponent($$result2, "SocialShare", $$SocialShare, { "title": article?.title, "url": Astro2.url.href, "description": article?.excerpt, "data-astro-cid-4sn4zg3r": true })} </div> <!-- Call to Action --> <div class="mt-12" data-astro-cid-4sn4zg3r> ${renderComponent($$result2, "CallToAction", $$CallToAction, { "data-astro-cid-4sn4zg3r": true })} </div> <!-- Comments Section --> <div class="mt-12" data-astro-cid-4sn4zg3r> ${renderComponent($$result2, "CommentSection", $$CommentSection, { "articleId": article?.id, "data-astro-cid-4sn4zg3r": true })} </div> </div> </div> </div> ` })} `;
}, "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/pages/blog/[slug].astro", void 0);

const $$file = "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
