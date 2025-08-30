/* empty css                                        */
import { c as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Ji_6uJhi.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_CmQeeK4k.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$GptArticles = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "GPT-5 Articles" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", `<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Header --> <div class="mb-8"> <div class="flex items-center justify-between"> <div> <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
G\xE9n\xE9ration d'Articles avec GPT-5
</h1> <p class="text-lg text-gray-600 dark:text-gray-300">
Cr\xE9ez des articles de blog automatiquement avec l'intelligence artificielle
</p> </div> <div class="flex space-x-4"> <a href="/admin/new-article" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 font-semibold"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg> <span>Nouvel Article Manuel</span> </a> </div> </div> </div> <!-- GPT-5 Service Status --> <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-8 text-white"> <div class="flex items-center justify-between"> <div> <h3 class="text-xl font-semibold mb-2">GPT-5 Service Actif</h3> <p class="text-blue-100">API Key configur\xE9e et pr\xEAte \xE0 g\xE9n\xE9rer du contenu</p> </div> <div class="text-right"> <div class="text-2xl font-bold">GPT-5</div> <div class="text-sm text-blue-100">Mod\xE8le actuel</div> </div> </div> </div> <!-- Main Content Grid --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8"> <!-- Article Generation Panel --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"> <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
\u{1F680} G\xE9n\xE9rer un Nouvel Article
</h2> <form id="gptArticleForm" class="space-y-6"> <!-- Article Type Selection --> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Type de G\xE9n\xE9ration
</label> <div class="grid grid-cols-2 gap-3"> <label class="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"> <input type="radio" name="generationType" value="prompt" class="mr-2" checked> <span class="text-sm">Par Prompt</span> </label> <label class="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"> <input type="radio" name="generationType" value="title" class="mr-2"> <span class="text-sm">Par Titre</span> </label> </div> </div> <!-- Prompt Input --> <div id="promptSection"> <label for="articlePrompt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Prompt de G\xE9n\xE9ration
</label> <textarea id="articlePrompt" rows="4" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="Ex: \xC9cris un article sur les tendances technologiques de 2024..."></textarea> </div> <!-- Title Input --> <div id="titleSection" class="hidden"> <label for="articleTitle" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Titre de l'Article
</label> <input type="text" id="articleTitle" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" placeholder="Ex: Les 10 Tendances Tech qui R\xE9volutionnent 2024"> </div> <!-- Category Selection --> <div> <label for="articleCategory" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Cat\xE9gorie *
</label> <select id="articleCategory" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"> <option value="">S\xE9lectionner une cat\xE9gorie</option> <!-- Les cat\xE9gories seront charg\xE9es dynamiquement depuis localStorage --> </select> </div> <!-- Tone Selection --> <div> <label for="articleTone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Ton de l'Article
</label> <select id="articleTone" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"> <option value="professional">Professionnel</option> <option value="casual">D\xE9contract\xE9</option> <option value="friendly">Amical</option> <option value="authoritative">Autoritaire</option> <option value="conversational">Conversationnel</option> </select> </div> <!-- Length Selection --> <div> <label for="articleLength" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Longueur de l'Article (nombre de mots)
</label> <select id="articleLength" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"> <option value="short">Petit (600 mots)</option> <option value="medium" selected>Moyen (1500 mots)</option> <option value="long">Long (3000 mots)</option> <option value="extra-long">Tr\xE8s Long (4000+ mots)</option> </select> </div> <!-- Image Style Selection --> <div> <label for="imageStyle" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Style d'Image
</label> <select id="imageStyle" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"> <option value="realistic" selected>R\xE9aliste</option> <option value="artistic">Artistique</option> <option value="minimalist">Minimaliste</option> <option value="modern">Moderne</option> <option value="vintage">Vintage</option> </select> </div> <!-- Generate Button --> <button type="submit" id="generateBtn" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"> <span class="flex items-center justify-center"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg>
G\xE9n\xE9rer l'Article + Image avec GPT-5
</span> </button> </form> </div> <!-- Article Ideas Panel --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"> <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
\u{1F4A1} Id\xE9es d'Articles
</h2> <div class="space-y-4"> <div> <label for="ideasCategory" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Cat\xE9gorie pour les Id\xE9es *
</label> <select id="ideasCategory" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"> <option value="">Toutes les cat\xE9gories</option> <!-- Les cat\xE9gories seront charg\xE9es dynamiquement depuis localStorage --> </select> </div> <button id="generateIdeasBtn" class="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"> <span class="flex items-center justify-center"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path> </svg>
G\xE9n\xE9rer des Id\xE9es
</span> </button> <!-- Ideas Display --> <div id="ideasContainer" class="space-y-3"> <!-- Ideas will be populated here --> </div> </div> </div> </div> <!-- Generated Article Preview --> <div id="articlePreview" class="hidden mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"> <div class="flex items-center justify-between mb-6"> <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
\u{1F4DD} Aper\xE7u de l'Article G\xE9n\xE9r\xE9
</h2> <div class="flex space-x-3"> <button id="enhanceBtn" class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
\u2728 Am\xE9liorer
</button> <button id="publishBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
\u{1F4E4} Publier
</button> </div> </div> <div id="previewContent" class="prose prose-lg dark:prose-invert max-w-none"> <!-- Generated content will be displayed here --> </div> </div> <!-- Loading States --> <div id="loadingState" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> <div class="bg-white dark:bg-gray-800 rounded-lg p-8 text-center"> <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div> <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
G\xE9n\xE9ration en cours...
</h3> <p class="text-gray-600 dark:text-gray-300">
GPT-5 est en train de cr\xE9er votre article
</p> </div> </div> </div>  <script src="/scripts/gpt5-service.js"><\/script> <script src="/scripts/gpt-articles.js"><\/script>  <script>
    // Clear any cached versions
    if (window.gptArticlesManager) {
      console.log('\u{1F504} Clearing existing gptArticlesManager instance');
      delete window.gptArticlesManager;
    }
    if (window.GPT5Service) {
      console.log('\u{1F504} Clearing existing GPT5Service class');
      delete window.GPT5Service;
    }
  <\/script>  <script>
    console.log('\u{1F50D} Debug: Checking GPT5Service availability...');
    if (typeof GPT5Service !== 'undefined') {
      console.log('\u2705 GPT5Service class is available');
      console.log('\u{1F50D} GPT5Service methods:', Object.getOwnPropertyNames(GPT5Service));
      console.log('\u{1F50D} GPT5Service prototype methods:', Object.getOwnPropertyNames(GPT5Service.prototype));
    } else {
      console.error('\u274C GPT5Service class is NOT available');
    }
    
    console.log('\u{1F50D} Debug: Checking GPT5ArticlesManager availability...');
    if (typeof GPT5ArticlesManager !== 'undefined') {
      console.log('\u2705 GPT5ArticlesManager class is available');
    } else {
      console.error('\u274C GPT5ArticlesManager class is NOT available');
    }
  <\/script>  <script>
    document.addEventListener('DOMContentLoaded', function() {
      console.log('GPT-5 Articles: Page loaded, checking categories...');
      
      // Load categories into dropdowns
      try {
        const userCategories = JSON.parse(localStorage.getItem('userCategories') || '[]');
        console.log('GPT-5 Articles: Found categories:', userCategories);
        
        // Populate article category dropdown
        const articleCategorySelect = document.getElementById('articleCategory');
        if (articleCategorySelect) {
          articleCategorySelect.innerHTML = '<option value="">S\xE9lectionner une cat\xE9gorie</option>';
          userCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            articleCategorySelect.appendChild(option);
          });
          console.log('GPT-5 Articles: Article category dropdown populated');
        }
        
        // Populate ideas category dropdown
        const ideasCategorySelect = document.getElementById('ideasCategory');
        if (ideasCategorySelect) {
          ideasCategorySelect.innerHTML = '<option value="">Toutes les cat\xE9gories</option>';
          userCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            ideasCategorySelect.appendChild(option);
          });
          console.log('GPT-5 Articles: Ideas category dropdown populated');
        }
        
        // Add debug info for form submission
        const gptArticleForm = document.getElementById('gptArticleForm');
        if (gptArticleForm) {
          console.log('GPT-5 Articles: Form found, adding debug listeners');
        }
        
        // Check if GPT5Service is available
        if (typeof GPT5Service !== 'undefined') {
          console.log('GPT-5 Articles: GPT5Service is available');
        } else {
          console.error('GPT-5 Articles: GPT5Service is NOT available!');
        }
        
        // Check if GPT5ArticlesManager is available
        if (typeof GPT5ArticlesManager !== 'undefined') {
          console.log('GPT-5 Articles: GPT5ArticlesManager is available');
        } else {
          console.error('GPT-5 Articles: GPT5ArticlesManager is NOT available!');
        }
        
      } catch (error) {
        console.error('GPT-5 Articles: Erreur lors du chargement des cat\xE9gories:', error);
      }
    });
  <\/script> `])), maybeRenderHead()) })}`;
}, "C:/Users/pc/Desktop/ASHRAF1/ASHRAF/adminblog/src/pages/admin/gpt-articles.astro", void 0);

const $$file = "C:/Users/pc/Desktop/ASHRAF1/ASHRAF/adminblog/src/pages/admin/gpt-articles.astro";
const $$url = "/admin/gpt-articles";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$GptArticles,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
