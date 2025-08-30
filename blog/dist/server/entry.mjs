import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BIr3_qe0.mjs';
import { manifest } from './manifest_qyv6ZiHJ.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/api/blog.astro.mjs');
const _page3 = () => import('./pages/api/categories.astro.mjs');
const _page4 = () => import('./pages/api/chat.astro.mjs');
const _page5 = () => import('./pages/api/chat-stream.astro.mjs');
const _page6 = () => import('./pages/api/stats.astro.mjs');
const _page7 = () => import('./pages/api/uploads/_---filename_.astro.mjs');
const _page8 = () => import('./pages/api/webhook/rebuild.astro.mjs');
const _page9 = () => import('./pages/blog/_slug_.astro.mjs');
const _page10 = () => import('./pages/blog.astro.mjs');
const _page11 = () => import('./pages/categories.astro.mjs');
const _page12 = () => import('./pages/contact.astro.mjs');
const _page13 = () => import('./pages/faq.astro.mjs');
const _page14 = () => import('./pages/privacy.astro.mjs');
const _page15 = () => import('./pages/rss.xml.astro.mjs');
const _page16 = () => import('./pages/services.astro.mjs');
const _page17 = () => import('./pages/sitemap.astro.mjs');
const _page18 = () => import('./pages/terms.astro.mjs');
const _page19 = () => import('./pages/test-search.astro.mjs');
const _page20 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/api/blog.ts", _page2],
    ["src/pages/api/categories.ts", _page3],
    ["src/pages/api/chat.js", _page4],
    ["src/pages/api/chat-stream.js", _page5],
    ["src/pages/api/stats.ts", _page6],
    ["src/pages/api/uploads/[...filename].js", _page7],
    ["src/pages/api/webhook/rebuild.ts", _page8],
    ["src/pages/blog/[slug].astro", _page9],
    ["src/pages/blog/index.astro", _page10],
    ["src/pages/categories.astro", _page11],
    ["src/pages/contact.astro", _page12],
    ["src/pages/faq.astro", _page13],
    ["src/pages/privacy.astro", _page14],
    ["src/pages/rss.xml.js", _page15],
    ["src/pages/services.astro", _page16],
    ["src/pages/sitemap.astro", _page17],
    ["src/pages/terms.astro", _page18],
    ["src/pages/test-search.astro", _page19],
    ["src/pages/index.astro", _page20]
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
    "client": "file:///C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/dist/client/",
    "server": "file:///C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/dist/server/",
    "host": false,
    "port": 4321,
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
