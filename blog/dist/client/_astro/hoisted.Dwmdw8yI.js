import"./hoisted.Cf_VPIQS.js";document.addEventListener("DOMContentLoaded",function(){console.log("🔍 Blog page loaded");const x=new URLSearchParams(window.location.search),m=x.get("search"),L=x.get("category");console.log("🔍 Client-side URL params:",{search:m,category:L}),document.querySelectorAll('a[href*="category="]').forEach(i=>{i.addEventListener("click",function(p){console.log("🔍 Category button clicked:",this.href)})});const g=document.getElementById("searchForm"),o=document.getElementById("searchInput"),r=document.getElementById("searchSuggestions");if(g&&o&&r){let i=function(){const e=o.value.trim();if(e.length===0){d();return}if(e.length<2){d();return}u=b.filter(t=>{const s=e.toLowerCase(),y=t.title.toLowerCase().includes(s),a=t.excerpt.toLowerCase().includes(s),h=t.category.toLowerCase().includes(s),v=t.author.toLowerCase().includes(s);return y||a||h||v}),console.log("🔍 Search query:",e),console.log("🔍 Filtered results:",u.length),n(u,e)},p=function(e){e.key==="ArrowDown"?(e.preventDefault(),c=Math.min(c+1,u.length-1),w()):e.key==="ArrowUp"?(e.preventDefault(),c=Math.max(c-1,-1),w()):e.key==="Enter"?(e.preventDefault(),c>=0&&u[c]?l(u[c]):o.value.trim()&&g.submit()):e.key==="Escape"&&(d(),o.blur())},f=function(){o.value.trim().length>=2&&i()},n=function(e,t){if(e.length===0){r.innerHTML=`
          <div class="p-4 text-center text-secondary-400">
            <div class="text-2xl mb-2">🔍</div>
            <p>Aucun article trouvé pour "${t}"</p>
            <p class="text-sm mt-2">Essayez d'autres mots-clés</p>
          </div>
        `,E();return}const s=e.map((a,h)=>{const v=S(a.title,t),k=S(a.excerpt.substring(0,100),t);return`
          <div class="suggestion-item p-4 hover:bg-secondary-700/50 cursor-pointer transition-colors ${h===c?"bg-secondary-700/50":""}" 
               data-article-slug="${a.slug}">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                📄
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-white mb-1">${v}</div>
                <div class="text-sm text-secondary-300 mb-2">${k}...</div>
                <div class="flex items-center gap-2 text-xs text-secondary-400">
                  <span>${a.category}</span>
                  <span>•</span>
                  <span>${a.author}</span>
                </div>
              </div>
            </div>
          </div>
        `}).join(""),y=e.length>5?`
        <div class="p-3 text-center text-secondary-400 text-sm border-t border-secondary-600/30">
          💡 Utilisez ↑↓ pour naviguer • Appuyez sur Entrée pour sélectionner
        </div>
      `:"";r.innerHTML=s+y,r.querySelectorAll(".suggestion-item").forEach((a,h)=>{a.addEventListener("click",()=>{l(e[h])})}),E()},l=function(e){console.log("🎯 Selected article:",e),d(),o.value=e.title,e.url&&(window.location.href=e.url)},S=function(e,t){if(!e||!t)return e;const s=new RegExp(`(${t})`,"gi");return e.replace(s,'<mark class="bg-primary-500/30 text-primary-200 px-1 rounded">$1</mark>')},w=function(){r.querySelectorAll(".suggestion-item").forEach((t,s)=>{t.classList.toggle("bg-secondary-700/50",s===c)})},E=function(){r.classList.remove("hidden")},d=function(){r.classList.add("hidden"),c=-1};console.log("🔍 Search components found:",{searchForm:g,searchInput:o,searchSuggestions:r});const b=Array.from(document.querySelectorAll("article")).map(e=>{const t=e.querySelector("h2 a"),s=e.querySelector("[data-excerpt]");return e.querySelector("[data-category]"),e.querySelector("[data-author]"),{title:e.dataset.title||(t?t.textContent.trim():""),excerpt:e.dataset.excerpt||(s?s.textContent.trim():""),category:e.dataset.category||"",author:e.dataset.author||"",slug:e.dataset.slug||"",url:t?t.href:""}});console.log("🔍 Articles data for search:",b);let c=-1,u=[];o.addEventListener("input",i),o.addEventListener("keydown",p),o.addEventListener("focus",f),document.addEventListener("click",e=>{!o.contains(e.target)&&!r.contains(e.target)&&d()}),g.addEventListener("submit",function(e){const t=o.value.trim();if(console.log("🔍 Search form submitted"),console.log("🔍 Search value:",t),!t||t.length<2)return e.preventDefault(),console.log("🔍 Search validation failed - preventing submission"),alert("Veuillez saisir au moins 2 caractères pour la recherche."),!1;console.log("🔍 Search form submission allowed"),d()}),o.addEventListener("keydown",function(e){e.key==="Escape"&&(this.value="",this.blur(),d(),console.log("🔍 Search cleared with Escape key"))})}else console.error("❌ Search components not found!",{searchForm:g,searchInput:o,searchSuggestions:r});if(m){console.log("🔍 Highlighting search results for:",m);const i=m.toLowerCase(),p=document.querySelectorAll("h2 a"),f=document.querySelectorAll(".line-clamp-3");p.forEach(n=>{const l=n.textContent;l.toLowerCase().includes(i)&&(n.style.backgroundColor="rgba(236, 72, 153, 0.2)",n.style.padding="2px 4px",n.style.borderRadius="4px",console.log("🔍 Highlighted title:",l))}),f.forEach(n=>{const l=n.textContent;l.toLowerCase().includes(i)&&(n.style.backgroundColor="rgba(236, 72, 153, 0.1)",n.style.padding="4px",n.style.borderRadius="4px",console.log("🔍 Highlighted excerpt:",l))})}console.log("🔍 All forms on page:",document.forms),console.log("🔍 Search input elements:",document.querySelectorAll('input[type="search"]')),console.log("🔍 Form with GET method:",document.querySelectorAll('form[method="GET"]'))});
