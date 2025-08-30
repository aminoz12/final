/* empty css                                     */
import { c as createComponent, f as renderHead, r as renderTemplate } from '../chunks/astro/server_Ji_6uJhi.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                       */
export { renderers } from '../renderers.mjs';

const $$DebugLogin = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="fr" data-astro-cid-i744wt6q> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Debug Login - Mad2Moi</title>${renderHead()}</head> <body class="min-h-screen bg-gray-100 p-4" data-astro-cid-i744wt6q> <div class="max-w-6xl mx-auto" data-astro-cid-i744wt6q> <h1 class="text-2xl font-bold mb-4 text-gray-900" data-astro-cid-i744wt6q>🔍 Debug Login - Mad2Moi</h1> <div class="grid grid-cols-1 lg:grid-cols-2 gap-4" data-astro-cid-i744wt6q> <!-- Left Column --> <div class="space-y-4" data-astro-cid-i744wt6q> <!-- Environment Info --> <div class="bg-white rounded-lg shadow-lg p-4" data-astro-cid-i744wt6q> <h2 class="text-lg font-semibold mb-3" data-astro-cid-i744wt6q>🌐 Environment Info</h2> <div class="debug-log bg-gray-50 p-3 rounded text-xs space-y-1" data-astro-cid-i744wt6q> <div data-astro-cid-i744wt6q>URL: <span id="currentUrl" class="break-all" data-astro-cid-i744wt6q></span></div> <div data-astro-cid-i744wt6q>Protocol: <span id="protocol" data-astro-cid-i744wt6q></span></div> <div data-astro-cid-i744wt6q>Host: <span id="host" data-astro-cid-i744wt6q></span></div> <div data-astro-cid-i744wt6q>localStorage: <span id="localStorageSupport" data-astro-cid-i744wt6q></span></div> </div> </div> <!-- Login Test --> <div class="bg-white rounded-lg shadow-lg p-4" data-astro-cid-i744wt6q> <h2 class="text-lg font-semibold mb-3" data-astro-cid-i744wt6q>🔐 Login Test</h2> <form id="debugLoginForm" class="space-y-3" data-astro-cid-i744wt6q> <div data-astro-cid-i744wt6q> <label class="block text-sm font-medium text-gray-700" data-astro-cid-i744wt6q>Username</label> <input type="text" id="debugUsername" value="Amine" class="w-full p-2 border rounded text-sm" data-astro-cid-i744wt6q> </div> <div data-astro-cid-i744wt6q> <label class="block text-sm font-medium text-gray-700" data-astro-cid-i744wt6q>Password</label> <input type="password" id="debugPassword" value="123456" class="w-full p-2 border rounded text-sm" data-astro-cid-i744wt6q> </div> <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm" data-astro-cid-i744wt6q>
Test Login
</button> </form> </div> <!-- Test Results --> <div class="bg-white rounded-lg shadow-lg p-4" data-astro-cid-i744wt6q> <h2 class="text-lg font-semibold mb-3" data-astro-cid-i744wt6q>✅ Test Results</h2> <div id="testResults" class="space-y-2 max-h-32 overflow-y-auto" data-astro-cid-i744wt6q></div> </div> </div> <!-- Right Column --> <div class="space-y-4" data-astro-cid-i744wt6q> <!-- Debug Output --> <div class="bg-white rounded-lg shadow-lg p-4" data-astro-cid-i744wt6q> <div class="flex justify-between items-center mb-3" data-astro-cid-i744wt6q> <h2 class="text-lg font-semibold" data-astro-cid-i744wt6q>📝 Debug Log</h2> <button id="clearLog" class="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700" data-astro-cid-i744wt6q>
Clear
</button> </div> <div id="debugOutput" class="debug-log bg-gray-50 p-3 rounded text-xs h-80 overflow-y-auto" data-astro-cid-i744wt6q></div> </div> </div> </div> </div>  </body> </html>`;
}, "C:/Users/pc/Desktop/ASHRAF1/ASHRAF/adminblog/src/pages/debug-login.astro", void 0);

const $$file = "C:/Users/pc/Desktop/ASHRAF1/ASHRAF/adminblog/src/pages/debug-login.astro";
const $$url = "/debug-login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$DebugLogin,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
