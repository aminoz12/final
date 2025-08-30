/* empty css                                 */
import { c as createAstro, a as createComponent, r as renderTemplate, e as defineScriptVars, d as renderComponent, m as maybeRenderHead, F as Fragment, b as addAttribute } from '../chunks/astro/server_BNe_LUEH.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DmzNGBki.mjs';
import { initializeDatabase, getCategories } from '../chunks/database_CcuPA5-H.mjs';
/* empty css                                      */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://your-domain.com");
const $$Categories = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Categories;
  function getColorClasses(hexColor) {
    const defaultColor = {
      gradient: "from-blue-500 to-blue-700",
      bg: "bg-blue-500/20",
      border: "border-blue-500/30",
      text: "text-blue-300"
    };
    if (!hexColor.startsWith("#")) {
      return defaultColor;
    }
    const colorMap = {
      "#3B82F6": {
        // Blue
        gradient: "from-blue-500 to-blue-700",
        bg: "bg-blue-500/20",
        border: "border-blue-500/30",
        text: "text-blue-300"
      },
      "#EF4444": {
        // Red
        gradient: "from-red-500 to-red-700",
        bg: "bg-red-500/20",
        border: "border-red-500/30",
        text: "text-red-300"
      },
      "#10B981": {
        // Green
        gradient: "from-green-500 to-green-700",
        bg: "bg-green-500/20",
        border: "border-green-500/30",
        text: "text-green-300"
      },
      "#F59E0B": {
        // Yellow
        gradient: "from-yellow-500 to-yellow-700",
        bg: "bg-yellow-500/20",
        border: "border-yellow-500/30",
        text: "text-yellow-300"
      },
      "#8B5CF6": {
        // Purple
        gradient: "from-purple-500 to-purple-700",
        bg: "bg-purple-500/20",
        border: "border-purple-500/30",
        text: "text-purple-300"
      },
      "#EC4899": {
        // Pink
        gradient: "from-pink-500 to-pink-700",
        bg: "bg-pink-500/20",
        border: "border-pink-500/30",
        text: "text-pink-300"
      },
      "#06B6D4": {
        // Cyan
        gradient: "from-cyan-500 to-cyan-700",
        bg: "bg-cyan-500/20",
        border: "border-cyan-500/30",
        text: "text-cyan-300"
      },
      "#84CC16": {
        // Lime
        gradient: "from-lime-500 to-lime-700",
        bg: "bg-lime-500/20",
        border: "border-lime-500/30",
        text: "text-lime-300"
      }
    };
    return colorMap[hexColor.toUpperCase()] || defaultColor;
  }
  await initializeDatabase();
  let categories = [];
  try {
    categories = await getCategories();
    categories = categories.map((cat) => {
      const dbColor = cat.color || "#3B82F6";
      const colorClasses = getColorClasses(dbColor);
      return {
        name: cat.name,
        slug: cat.slug,
        description: cat.description || `D\xE9couvrez nos articles sur ${cat.name}`,
        icon: cat.icon || "\u{1F4C1}",
        color: colorClasses.gradient,
        bgColor: colorClasses.bg,
        borderColor: colorClasses.border,
        textColor: colorClasses.text,
        count: cat.article_count || 0,
        featuredPosts: [],
        // Will be populated if we add featured posts logic
        tags: cat.tags ? JSON.parse(cat.tags) : [],
        featured: cat.featured || false
        // Add featured status
      };
    });
  } catch (error) {
    console.error("\u274C Error fetching categories from database:", error);
    categories = [];
  }
  const { searchParams } = Astro2.url;
  const search = searchParams.get("search") || "";
  let filteredCategories = categories;
  if (search) {
    filteredCategories = categories.filter(
      (cat) => cat.name.toLowerCase().includes(search.toLowerCase()) || cat.description.toLowerCase().includes(search.toLowerCase()) || cat.tags && cat.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    );
  }
  return renderTemplate(_a || (_a = __template(["", " <!-- Pass categories data to JavaScript --> <script>(function(){", `
  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    
    // Use categories data passed from server-side
    console.log('\u{1F50D} Categories data available for search:', categoriesData);
    console.log('\u{1F50D} Total categories loaded:', categoriesData.length);
    
    // Log sample category structure for debugging
    if (categoriesData.length > 0) {
      console.log('\u{1F50D} Sample category structure:', categoriesData[0]);
    }
    
    let currentFocus = -1;
    let filteredCategories = [];

    // Search input event handlers
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleKeydown);
    searchInput.addEventListener('focus', handleFocus);
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        hideSuggestions();
      }
    });

    function handleSearchInput() {
      const query = searchInput.value.trim();
      
      if (query.length === 0) {
        hideSuggestions();
        // Show all categories when search is cleared
        window.location.href = '/categories';
        return;
      }

      // Filter categories based on search query
      filteredCategories = categoriesData.filter(category => {
        const searchLower = query.toLowerCase();
        const nameMatch = category.name.toLowerCase().includes(searchLower);
        const descMatch = (category.description || '').toLowerCase().includes(searchLower);
        const tagMatch = category.tags && category.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        return nameMatch || descMatch || tagMatch;
      });

      console.log('\u{1F50D} Search query:', query);
      console.log('\u{1F50D} Filtered results:', filteredCategories.length);
      
      displaySearchSuggestions(filteredCategories, query);
    }

    function handleKeydown(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentFocus = Math.min(currentFocus + 1, filteredCategories.length - 1);
        updateFocus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentFocus = Math.max(currentFocus - 1, -1);
        updateFocus();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFocus >= 0 && filteredCategories[currentFocus]) {
          selectCategory(filteredCategories[currentFocus]);
        } else if (searchInput.value.trim()) {
          // Perform search with current input
          window.location.href = \`/blog?category=\${searchInput.value.trim().toLowerCase()}\`;
        }
      } else if (e.key === 'Escape') {
        hideSuggestions();
        searchInput.blur();
      }
    }

    function handleFocus() {
      if (searchInput.value.trim().length > 0) {
        handleSearchInput();
      }
    }

    function displaySearchSuggestions(categories, query) {
      if (categories.length === 0) {
        searchSuggestions.innerHTML = \`
          <div class="p-4 text-center text-secondary-400">
            <div class="text-2xl mb-2">\u{1F50D}</div>
            <p>Aucune cat\xE9gorie trouv\xE9e pour "\${query}"</p>
            <p class="text-sm mt-2">Essayez d'autres mots-cl\xE9s</p>
          </div>
        \`;
        showSuggestions();
        return;
      }

      const suggestionsHTML = categories.map((category, index) => {
        const highlightedName = highlightSearchTerms(category.name, query);
        const highlightedDesc = highlightSearchTerms(category.description || '', query);
        
        return \`
          <div class="suggestion-item p-4 hover:bg-secondary-700/50 cursor-pointer transition-colors \${index === currentFocus ? 'bg-secondary-700/50' : ''}" 
               data-category-slug="\${category.slug}">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br \${category.color} rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                \${category.icon || '\u{1F4C1}'}
              </div>
              <div class="flex-1">
                <div class="font-semibold text-white mb-1">\${highlightedName}</div>
                <div class="text-sm text-secondary-300 mb-2">\${highlightedDesc}</div>
                <div class="flex items-center gap-2 text-xs text-secondary-400">
                  <span>\${category.count || 0} article\${(category.count || 0) > 1 ? 's' : ''}</span>
                  \${category.featured ? '<span class="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">\u2B50 \xC0 la une</span>' : ''}
                </div>
              </div>
            </div>
          </div>
        \`;
      }).join('');
      
      const scrollIndicator = categories.length > 5 ? \`
        <div class="p-3 text-center text-secondary-400 text-sm border-t border-secondary-600/30">
          \u{1F4A1} Utilisez \u2191\u2193 pour naviguer \u2022 Appuyez sur Entr\xE9e pour s\xE9lectionner
        </div>
      \` : '';
      
      searchSuggestions.innerHTML = suggestionsHTML + scrollIndicator;
      
      // Add click handlers to suggestion items
      searchSuggestions.querySelectorAll('.suggestion-item').forEach((item, index) => {
        item.addEventListener('click', () => {
          selectCategory(categories[index]);
        });
      });
      
      showSuggestions();
    }

    function selectCategory(category) {
      console.log('\u{1F3AF} Selected category:', category);
      hideSuggestions();
      searchInput.value = category.name;
      
      // Navigate to the category
      if (category.slug) {
        window.location.href = \`/blog?category=\${category.slug}\`;
      } else {
        // Fallback to name-based search if no slug
        window.location.href = \`/blog?category=\${category.name.toLowerCase()}\`;
      }
    }

    function highlightSearchTerms(text, query) {
      if (!query) return text;
      const regex = new RegExp(\`(\${query})\`, 'gi');
      return text.replace(regex, '<mark class="bg-primary-500/30 text-primary-200 px-1 rounded">$1</mark>');
    }

    function showSuggestions() {
      searchSuggestions.classList.remove('hidden');
      currentFocus = -1;
    }

    function hideSuggestions() {
      searchSuggestions.classList.add('hidden');
      currentFocus = -1;
    }

    function updateFocus() {
      document.querySelectorAll('.suggestion-item').forEach((item, index) => {
        item.classList.toggle('bg-secondary-700/50', index === currentFocus);
      });
      
      // Scroll to focused item
      if (currentFocus >= 0) {
        const focusedItem = document.querySelector(\`[data-index="\${currentFocus}"]\`);
        if (focusedItem) {
          focusedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  });
})();<\/script> `], ["", " <!-- Pass categories data to JavaScript --> <script>(function(){", `
  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    
    // Use categories data passed from server-side
    console.log('\u{1F50D} Categories data available for search:', categoriesData);
    console.log('\u{1F50D} Total categories loaded:', categoriesData.length);
    
    // Log sample category structure for debugging
    if (categoriesData.length > 0) {
      console.log('\u{1F50D} Sample category structure:', categoriesData[0]);
    }
    
    let currentFocus = -1;
    let filteredCategories = [];

    // Search input event handlers
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleKeydown);
    searchInput.addEventListener('focus', handleFocus);
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        hideSuggestions();
      }
    });

    function handleSearchInput() {
      const query = searchInput.value.trim();
      
      if (query.length === 0) {
        hideSuggestions();
        // Show all categories when search is cleared
        window.location.href = '/categories';
        return;
      }

      // Filter categories based on search query
      filteredCategories = categoriesData.filter(category => {
        const searchLower = query.toLowerCase();
        const nameMatch = category.name.toLowerCase().includes(searchLower);
        const descMatch = (category.description || '').toLowerCase().includes(searchLower);
        const tagMatch = category.tags && category.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        return nameMatch || descMatch || tagMatch;
      });

      console.log('\u{1F50D} Search query:', query);
      console.log('\u{1F50D} Filtered results:', filteredCategories.length);
      
      displaySearchSuggestions(filteredCategories, query);
    }

    function handleKeydown(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentFocus = Math.min(currentFocus + 1, filteredCategories.length - 1);
        updateFocus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentFocus = Math.max(currentFocus - 1, -1);
        updateFocus();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFocus >= 0 && filteredCategories[currentFocus]) {
          selectCategory(filteredCategories[currentFocus]);
        } else if (searchInput.value.trim()) {
          // Perform search with current input
          window.location.href = \\\`/blog?category=\\\${searchInput.value.trim().toLowerCase()}\\\`;
        }
      } else if (e.key === 'Escape') {
        hideSuggestions();
        searchInput.blur();
      }
    }

    function handleFocus() {
      if (searchInput.value.trim().length > 0) {
        handleSearchInput();
      }
    }

    function displaySearchSuggestions(categories, query) {
      if (categories.length === 0) {
        searchSuggestions.innerHTML = \\\`
          <div class="p-4 text-center text-secondary-400">
            <div class="text-2xl mb-2">\u{1F50D}</div>
            <p>Aucune cat\xE9gorie trouv\xE9e pour "\\\${query}"</p>
            <p class="text-sm mt-2">Essayez d'autres mots-cl\xE9s</p>
          </div>
        \\\`;
        showSuggestions();
        return;
      }

      const suggestionsHTML = categories.map((category, index) => {
        const highlightedName = highlightSearchTerms(category.name, query);
        const highlightedDesc = highlightSearchTerms(category.description || '', query);
        
        return \\\`
          <div class="suggestion-item p-4 hover:bg-secondary-700/50 cursor-pointer transition-colors \\\${index === currentFocus ? 'bg-secondary-700/50' : ''}" 
               data-category-slug="\\\${category.slug}">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br \\\${category.color} rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                \\\${category.icon || '\u{1F4C1}'}
              </div>
              <div class="flex-1">
                <div class="font-semibold text-white mb-1">\\\${highlightedName}</div>
                <div class="text-sm text-secondary-300 mb-2">\\\${highlightedDesc}</div>
                <div class="flex items-center gap-2 text-xs text-secondary-400">
                  <span>\\\${category.count || 0} article\\\${(category.count || 0) > 1 ? 's' : ''}</span>
                  \\\${category.featured ? '<span class="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">\u2B50 \xC0 la une</span>' : ''}
                </div>
              </div>
            </div>
          </div>
        \\\`;
      }).join('');
      
      const scrollIndicator = categories.length > 5 ? \\\`
        <div class="p-3 text-center text-secondary-400 text-sm border-t border-secondary-600/30">
          \u{1F4A1} Utilisez \u2191\u2193 pour naviguer \u2022 Appuyez sur Entr\xE9e pour s\xE9lectionner
        </div>
      \\\` : '';
      
      searchSuggestions.innerHTML = suggestionsHTML + scrollIndicator;
      
      // Add click handlers to suggestion items
      searchSuggestions.querySelectorAll('.suggestion-item').forEach((item, index) => {
        item.addEventListener('click', () => {
          selectCategory(categories[index]);
        });
      });
      
      showSuggestions();
    }

    function selectCategory(category) {
      console.log('\u{1F3AF} Selected category:', category);
      hideSuggestions();
      searchInput.value = category.name;
      
      // Navigate to the category
      if (category.slug) {
        window.location.href = \\\`/blog?category=\\\${category.slug}\\\`;
      } else {
        // Fallback to name-based search if no slug
        window.location.href = \\\`/blog?category=\\\${category.name.toLowerCase()}\\\`;
      }
    }

    function highlightSearchTerms(text, query) {
      if (!query) return text;
      const regex = new RegExp(\\\`(\\\${query})\\\`, 'gi');
      return text.replace(regex, '<mark class="bg-primary-500/30 text-primary-200 px-1 rounded">$1</mark>');
    }

    function showSuggestions() {
      searchSuggestions.classList.remove('hidden');
      currentFocus = -1;
    }

    function hideSuggestions() {
      searchSuggestions.classList.add('hidden');
      currentFocus = -1;
    }

    function updateFocus() {
      document.querySelectorAll('.suggestion-item').forEach((item, index) => {
        item.classList.toggle('bg-secondary-700/50', index === currentFocus);
      });
      
      // Scroll to focused item
      if (currentFocus >= 0) {
        const focusedItem = document.querySelector(\\\`[data-index="\\\${currentFocus}"]\\\`);
        if (focusedItem) {
          focusedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  });
})();<\/script> `])), renderComponent($$result, "Layout", $$Layout, { "title": "Cat\xE9gories - Mad2Moi Blog", "description": "Explorez nos cat\xE9gories de contenu sur l'exploration \xE9rotique et le bien-\xEAtre sexuel. Trouvez le contenu qui correspond \xE0 vos int\xE9r\xEAts.", "data-astro-cid-hioekb44": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative py-20 overflow-hidden" data-astro-cid-hioekb44> <div class="absolute inset-0 bg-gradient-to-br from-secondary-900 via-primary-900 to-secondary-800" data-astro-cid-hioekb44> <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=" 60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" %3E%3Cg fill="none" fill-rule="evenodd" %3E%3Cg fill="%23ec4899" fill-opacity="0.05" %3E%3Ccircle cx="30" cy="30" r="2" %3E%3C g%3E%3C g%3E%3C svg%3E')] opacity-30" data-astro-cid-hioekb44></div> </div> <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-astro-cid-hioekb44> <h1 class="text-5xl md:text-6xl font-bold text-white mb-6 font-elegant text-glow" data-astro-cid-hioekb44>
Catégories <span class="text-primary-400" data-astro-cid-hioekb44>Mad2Moi</span> </h1> <p class="text-xl text-secondary-300 mb-8 max-w-3xl mx-auto" data-astro-cid-hioekb44>
Explorez nos différentes catégories de contenu et trouvez ce qui vous intéresse le plus
</p> <!-- Search Bar --> <div class="max-w-2xl mx-auto mb-8" data-astro-cid-hioekb44> <div class="relative" data-astro-cid-hioekb44> <input type="search" id="search-input" placeholder="Rechercher une catégorie (ex: BDSM, Libertin, Roleplay...)" class="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-white/60 backdrop-blur-sm text-lg" autocomplete="off" data-astro-cid-hioekb44> <!-- Search Suggestions --> <div id="search-suggestions" class="hidden absolute top-full left-0 right-0 mt-2 bg-secondary-800/95 backdrop-blur-sm border border-secondary-600 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary-600 scrollbar-track-secondary-800" data-astro-cid-hioekb44> <!-- Suggestions will be populated by JavaScript --> </div> <!-- Search Icon --> <div class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60" data-astro-cid-hioekb44> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-hioekb44> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-hioekb44></path> </svg> </div> </div> <!-- Search Tip --> <p class="text-sm text-secondary-400 mt-3 text-center" data-astro-cid-hioekb44>
💡 Tapez pour voir les suggestions • Utilisez ↑↓ pour naviguer • Appuyez sur Entrée pour rechercher
</p> </div> <!-- Active search filter --> ${search && renderTemplate`<div class="flex justify-center mb-6" data-astro-cid-hioekb44> <div class="flex items-center gap-3" data-astro-cid-hioekb44> <span class="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm border border-primary-500/30" data-astro-cid-hioekb44>
Recherche: ${search} </span> <a href="/categories" class="px-3 py-1 bg-secondary-500/20 text-secondary-300 rounded-full text-sm border border-secondary-500/30 hover:bg-secondary-500/30 transition-colors" data-astro-cid-hioekb44>
✕ Effacer
</a> </div> </div>`} </div> </section>  <section class="py-20 bg-gradient-to-b from-secondary-900 to-secondary-800" data-astro-cid-hioekb44> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-hioekb44> ${filteredCategories.length > 0 ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-hioekb44": true }, { "default": async ($$result3) => renderTemplate` <div class="text-center mb-16" data-astro-cid-hioekb44> <h2 class="text-3xl font-bold text-white mb-4 font-elegant" data-astro-cid-hioekb44> ${search ? `R\xE9sultats de recherche` : "Toutes nos cat\xE9gories"} </h2> <p class="text-secondary-300" data-astro-cid-hioekb44> ${filteredCategories.length} catégorie${filteredCategories.length > 1 ? "s" : ""} trouvée${filteredCategories.length > 1 ? "s" : ""} </p> </div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8" data-astro-cid-hioekb44> ${filteredCategories.map((category) => renderTemplate`<div class="card-sensual hover:border-glow group transform hover:scale-105 transition-all duration-500" data-astro-cid-hioekb44> <!-- Category Header --> <div class="flex items-center gap-4 mb-6" data-astro-cid-hioekb44> <div${addAttribute(`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`, "class")} data-astro-cid-hioekb44> <span class="text-3xl" data-astro-cid-hioekb44>${category.icon}</span> </div> <div class="flex-1" data-astro-cid-hioekb44> <h3 class="text-2xl font-bold text-white mb-2 font-elegant group-hover:text-primary-400 transition-colors" data-astro-cid-hioekb44> ${category.name} </h3> <div class="flex items-center gap-4" data-astro-cid-hioekb44> <span${addAttribute(`px-3 py-1 ${category.bgColor} ${category.textColor} rounded-full text-sm font-medium border ${category.borderColor}`, "class")} data-astro-cid-hioekb44> ${category.count} article${category.count > 1 ? "s" : ""} </span> <a${addAttribute(`/blog?category=${category.slug}`, "href")} class="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors" data-astro-cid-hioekb44>
Voir tous les articles →
</a> </div> </div> </div> <!-- Category Description --> <p class="text-secondary-300 mb-6 leading-relaxed" data-astro-cid-hioekb44> ${category.description} </p> <!-- Tags --> ${category.tags && category.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-6" data-astro-cid-hioekb44> ${category.tags.map((tag) => renderTemplate`<span${addAttribute(`px-2 py-1 ${category.bgColor} ${category.textColor} rounded text-xs border ${category.borderColor}`, "class")} data-astro-cid-hioekb44> ${tag} </span>`)} </div>`} <!-- Explore Button --> <div class="mt-6 pt-6 border-t border-secondary-600/30" data-astro-cid-hioekb44> <a${addAttribute(`/blog?category=${category.slug}`, "href")}${addAttribute(`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${category.color} text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg`, "class")} data-astro-cid-hioekb44> <span data-astro-cid-hioekb44>Explorer ${category.name}</span> <span class="group-hover:translate-x-1 transition-transform" data-astro-cid-hioekb44>→</span> </a> </div> </div>`)} </div> ` })}` : renderTemplate`<div class="text-center py-20" data-astro-cid-hioekb44> <div class="text-8xl mb-6 opacity-60" data-astro-cid-hioekb44>🔍</div> <h2 class="text-3xl font-bold text-white mb-4 font-elegant" data-astro-cid-hioekb44> ${categories.length === 0 ? "Aucune cat\xE9gorie disponible" : "Aucune cat\xE9gorie trouv\xE9e"} </h2> <p class="text-secondary-300 mb-8 max-w-md mx-auto" data-astro-cid-hioekb44> ${categories.length === 0 ? "Aucune cat\xE9gorie n'est encore cr\xE9\xE9e. Cr\xE9ez des cat\xE9gories dans le panneau d'administration." : "Aucune cat\xE9gorie ne correspond \xE0 votre recherche. Essayez avec d'autres mots-cl\xE9s ou parcourez toutes nos cat\xE9gories."} </p> ${categories.length === 0 ? renderTemplate`<a href="/admin" class="btn-primary" data-astro-cid-hioekb44>
🏗️ Créer des catégories
</a>` : renderTemplate`<a href="/categories" class="btn-primary" data-astro-cid-hioekb44>
🏷️ Voir toutes les catégories
</a>`} </div>`} </div> </section>  <section class="py-20 bg-gradient-to-b from-secondary-800 to-secondary-900" data-astro-cid-hioekb44> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-hioekb44> <div class="text-center mb-16" data-astro-cid-hioekb44> <h2 class="text-3xl font-bold text-white mb-4 font-elegant" data-astro-cid-hioekb44>
Statistiques du Blog
</h2> <p class="text-secondary-300" data-astro-cid-hioekb44>
Découvrez l'étendue de notre contenu éducatif
</p> </div> <div class="grid grid-cols-2 md:grid-cols-4 gap-8" data-astro-cid-hioekb44> <div class="text-center group" data-astro-cid-hioekb44> <div class="text-4xl font-bold text-white mb-2" data-astro-cid-hioekb44>${categories.length}</div> <p class="text-secondary-400" data-astro-cid-hioekb44>Catégories</p> </div> <div class="text-center group" data-astro-cid-hioekb44> <div class="text-4xl font-bold text-white mb-2" data-astro-cid-hioekb44>${categories.reduce((sum, cat) => sum + (cat.count || 0), 0)}</div> <p class="text-secondary-400" data-astro-cid-hioekb44>Articles Totaux</p> </div> <div class="text-center group" data-astro-cid-hioekb44> <div class="text-4xl font-bold text-white mb-2" data-astro-cid-hioekb44>${categories.filter((cat) => cat.featured).length}</div> <p class="text-secondary-400" data-astro-cid-hioekb44>Catégories à la Une</p> </div> <div class="text-center group" data-astro-cid-hioekb44> <div class="text-4xl font-bold text-white mb-2" data-astro-cid-hioekb44>${Math.max(...categories.map((cat) => cat.count || 0))}</div> <p class="text-secondary-400" data-astro-cid-hioekb44>Plus Populaire</p> </div> </div> </div> </section> ` }), defineScriptVars({ categoriesData: categories }));
}, "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/pages/categories.astro", void 0);

const $$file = "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/pages/categories.astro";
const $$url = "/categories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Categories,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
