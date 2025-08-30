/* empty css                                 */
import { c as createAstro, a as createComponent, f as renderHead, b as addAttribute, r as renderTemplate } from '../chunks/astro/server_BNe_LUEH.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                       */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://your-domain.com");
const $$TestSearch = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TestSearch;
  const { searchParams } = Astro2.url;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  console.log("\u{1F50D} Test Search Page Debug:");
  console.log("  URL:", Astro2.url.toString());
  console.log("  Search:", search);
  console.log("  Category:", category);
  console.log("  Search params:", Object.fromEntries(searchParams.entries()));
  return renderTemplate`<html lang="fr" data-astro-cid-sw26df6b> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Test Search - Mad2Moi</title>${renderHead()}</head> <body data-astro-cid-sw26df6b> <h1 data-astro-cid-sw26df6b>🔍 Test Search Functionality</h1> <div class="debug" data-astro-cid-sw26df6b> <h3 data-astro-cid-sw26df6b>Debug Information:</h3> <p data-astro-cid-sw26df6b><strong data-astro-cid-sw26df6b>Current URL:</strong> ${Astro2.url.toString()}</p> <p data-astro-cid-sw26df6b><strong data-astro-cid-sw26df6b>Search Parameter:</strong> "${search}"</p> <p data-astro-cid-sw26df6b><strong data-astro-cid-sw26df6b>Category Parameter:</strong> "${category}"</p> <p data-astro-cid-sw26df6b><strong data-astro-cid-sw26df6b>All Parameters:</strong> ${JSON.stringify(Object.fromEntries(searchParams.entries()))}</p> </div> <div class="form-group" data-astro-cid-sw26df6b> <h3 data-astro-cid-sw26df6b>Test Search Form:</h3> <form method="GET" action="/test-search" data-astro-cid-sw26df6b> <input type="search" name="search"${addAttribute(search, "value")} placeholder="Enter search term..." data-astro-cid-sw26df6b> <input type="text" name="category"${addAttribute(category, "value")} placeholder="Category (optional)" data-astro-cid-sw26df6b> <button type="submit" data-astro-cid-sw26df6b>Search</button> </form> </div> <div class="form-group" data-astro-cid-sw26df6b> <h3 data-astro-cid-sw26df6b>Test Links:</h3> <p data-astro-cid-sw26df6b><a href="/test-search?search=test" data-astro-cid-sw26df6b>Test search for "test"</a></p> <p data-astro-cid-sw26df6b><a href="/test-search?search=entrepreneuriat" data-astro-cid-sw26df6b>Test search for "entrepreneuriat"</a></p> <p data-astro-cid-sw26df6b><a href="/test-search?category=roleplay" data-astro-cid-sw26df6b>Test category "roleplay"</a></p> <p data-astro-cid-sw26df6b><a href="/test-search?search=chiffre&category=roleplay" data-astro-cid-sw26df6b>Test search "chiffre" in category "roleplay"</a></p> </div> <div class="form-group" data-astro-cid-sw26df6b> <h3 data-astro-cid-sw26df6b>Results:</h3> ${search && renderTemplate`<p data-astro-cid-sw26df6b>🔍 Search term: <strong data-astro-cid-sw26df6b>${search}</strong></p>`} ${category && renderTemplate`<p data-astro-cid-sw26df6b>📂 Category: <strong data-astro-cid-sw26df6b>${category}</strong></p>`} ${!search && !category && renderTemplate`<p data-astro-cid-sw26df6b>No search or category specified</p>`} </div> <p data-astro-cid-sw26df6b><a href="/blog" data-astro-cid-sw26df6b>← Back to Blog</a></p> </body></html>`;
}, "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/pages/test-search.astro", void 0);

const $$file = "C:/Users/pc/Desktop/PROJECT/ASHRAF/blog/src/pages/test-search.astro";
const $$url = "/test-search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$TestSearch,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
