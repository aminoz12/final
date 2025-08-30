import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_aRtY8AMs.mjs';
import { manifest } from './manifest_D0yLdrUU.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/analytics.astro.mjs');
const _page2 = () => import('./pages/admin/articles.astro.mjs');
const _page3 = () => import('./pages/admin/categories.astro.mjs');
const _page4 = () => import('./pages/admin/chat.astro.mjs');
const _page5 = () => import('./pages/admin/dashboard.astro.mjs');
const _page6 = () => import('./pages/admin/gpt-articles.astro.mjs');
const _page7 = () => import('./pages/admin/new-article.astro.mjs');
const _page8 = () => import('./pages/admin/settings.astro.mjs');
const _page9 = () => import('./pages/admin/subscribers.astro.mjs');
const _page10 = () => import('./pages/api/admin/chat.astro.mjs');
const _page11 = () => import('./pages/api/articles.astro.mjs');
const _page12 = () => import('./pages/api/categories.astro.mjs');
const _page13 = () => import('./pages/api/chat.astro.mjs');
const _page14 = () => import('./pages/api/chat-stream.astro.mjs');
const _page15 = () => import('./pages/api/db-test.astro.mjs');
const _page16 = () => import('./pages/api/health.astro.mjs');
const _page17 = () => import('./pages/api/init-categories.astro.mjs');
const _page18 = () => import('./pages/api/session.astro.mjs');
const _page19 = () => import('./pages/api/uploads/_---file_.astro.mjs');
const _page20 = () => import('./pages/api/uploads/_---filename_.astro.mjs');
const _page21 = () => import('./pages/api/users.astro.mjs');
const _page22 = () => import('./pages/api/ws/chat.astro.mjs');
const _page23 = () => import('./pages/debug-login.astro.mjs');
const _page24 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/admin/analytics.astro", _page1],
    ["src/pages/admin/articles.astro", _page2],
    ["src/pages/admin/categories.astro", _page3],
    ["src/pages/admin/chat.astro", _page4],
    ["src/pages/admin/dashboard.astro", _page5],
    ["src/pages/admin/gpt-articles.astro", _page6],
    ["src/pages/admin/new-article.astro", _page7],
    ["src/pages/admin/settings.astro", _page8],
    ["src/pages/admin/subscribers.astro", _page9],
    ["src/pages/api/admin/chat.js", _page10],
    ["src/pages/api/articles.js", _page11],
    ["src/pages/api/categories.js", _page12],
    ["src/pages/api/chat.js", _page13],
    ["src/pages/api/chat-stream.js", _page14],
    ["src/pages/api/db-test.js", _page15],
    ["src/pages/api/health.js", _page16],
    ["src/pages/api/init-categories.js", _page17],
    ["src/pages/api/session.js", _page18],
    ["src/pages/api/uploads/[...file].js", _page19],
    ["src/pages/api/uploads/[...filename].js", _page20],
    ["src/pages/api/users.js", _page21],
    ["src/pages/api/ws/chat.js", _page22],
    ["src/pages/debug-login.astro", _page23],
    ["src/pages/index.astro", _page24]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///C:/Users/pc/Desktop/ASHRAF1/ASHRAF/adminblog/dist/client/",
    "server": "file:///C:/Users/pc/Desktop/ASHRAF1/ASHRAF/adminblog/dist/server/",
    "host": true,
    "port": 4322,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
{
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
