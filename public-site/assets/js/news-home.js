(() => {
  "use strict";

  const API_URL = "api/public/news";

  const articlesList = document.querySelector("#news-list");
  init();

  async function init() {
    if (!articlesList) {
      return;
    }

    try {
      const articles = await fetchArticles();

      renderArticles(articles);
    } catch (error) {
      console.error("Erreur lors du chargement des actualités :", error);

      showError("Impossible de charger les actualités.");
    }
  }

  /*
   * API
   */

  async function fetchArticles() {
    const response = await fetch(API_URL + "/home/fake-all.json", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API ${response.status} ${response.statusText}`);
    }

    const articles = await response.json();

    if (!Array.isArray(articles)) {
      throw new TypeError("Le format de réponse de l'API est invalide.");
    }

    return articles;
  }

  function renderArticles(articles) {
    articlesList.replaceChildren();

    if (articles.length === 0) {
      articlesList.appendChild(
        createEmptyMessage("Aucune actualité n'est disponible."),
      );

      return;
    }

    const sortedArticles = [...articles].sort(compareArticlesByDate);

    const firstMain = sortedArticles.find(a=>a.main === true);
    const main = firstMain ?? sortedArticles[0];
    const otherNews = sortedArticles.filter(a => a.id !== main.id)

    const mainRendered = renderMainArticle(main);
    const otherRendered = otherNews.map(article => renderOtherArticle(article)).join('');

    const structureRendered = renderNewsStructure(mainRendered, otherRendered);

    articlesList.insertAdjacentHTML('beforeend', structureRendered)

  }

  function renderNewsStructure(mainNew, otherNews) {
    return `
        <div class="mt-2xl md:mt-10">
          <div class="gap-y-2xl md:gap-x-2xl d-grid grid-cols-12">
            <!-- news principale -->
            <div class="col-span-12 md:col-span-6">
              <div class="top-0 md:sticky">
                <div class="group relative cursor-pointer group">
                  <div class="relative opacity-0 animate-fade-in" >${mainNew}</div>
                </div>
              </div>
            </div>
            <!-- autres news -->
            <div class="col-span-12 md:col-span-6">
              <div class="gap-x-md gap-y-2xl md:gap-2xl d-grid grid-cols-12">${otherNews}</div>
            </div>
          </div>
        </div>
    `;
  }

  /*
   * ARTICLES
   */

  function renderMainArticle(article) {
    return `
            <div class="col-span-12 md:col-span-6">
              <div class="top-0 md:sticky">
                <div class="group relative cursor-pointer group">
                  <div class="relative opacity-0 animate-fade-in">
                    <!-- article image -->
                    <div class="relative h-100 w-100 overflow-hidden object-cover">
                      <div class="aspect-square h-100 w-100 animate-image-scale-in">
                        <div class="relative h-100 w-100">
                          <img alt="" loading="lazy" width="2000" height="1334" decoding="async" data-nimg="1"
                            class="aspect-square duration-300 ease-in duration-medium-1 ease-standard scale-100 transition-all group-hover:scale-105"
                            style="color:transparent; object-fit: cover;" sizes="(max-width: 719px) 100vw, 50vw"
                            src="${article.photo}">
                        </div>
                      </div>
                    </div>
                    <!-- article shadow -->
                    <div class="absolute inset-0 h-100 w-100" style="background:var(--Gradient-G2, linear-gradient(0deg, rgb(20, 20, 40) 0%, rgba(20, 20, 40, 0) 75%))"></div>
                    <!-- article tags-->
                    <div class="p-lg md:p-2xl absolute inset-0 d-flex w-100 flex-column items-start justify-end">
                      <div>
                        <span class="typography-overline-2 text-dark-content-secondary mb-sm">${article.category}</span>
                      </div>
                        <a
                          class="static before:absolute before:inset-0 before:cursor-pointer mb-sm flex-column items-center overflow-hidden"
                          href="./news/${article.id}">
                          <h3
                            class="typography-title-3 text-content-primary-inverse opacity-0 animate-reveal-text-vertical">${article.title}</h3>
                        </a>
                        <time datetime="2026-09-14T11:50:19.000Z" class="typography-body-6 text-dark-content-secondary mb-xl d-block">${article.date}</time>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    `;
  }
  function renderOtherArticle(article) {
    return `
            <div class="col-span-6">
              <div
                class="group cursor-pointer relative d-flex flex-column text-content-primary opacity-0 animate-slide-in-fade-up"
                style="animation-delay: calc(0 * var(--duration-instant));">
                <div class="relative aspect-video overflow-hidden">
                  <div class="relative h-100 w-100"><img alt="" loading="lazy" width="6822" height="4548"
                      decoding="async" data-nimg="1"
                      class="duration-300 ease-in duration-medium-1 ease-standard scale-100 transition-all group-hover:scale-105"
                      sizes="(max-width: 719px) 50vw, 293px"
                      style="color: transparent;"
                      src="${article.photo}"></div>
                </div>
                <div class="gap-sm pt-md d-flex flex-column">
                  <div class="gap-xs d-flex h-5 items-center self-stretch">
                    <h3 class="typography-overline-2 d-block text-content-secondary">${article.category}</h3>
                  </div>
                  <a
                    class="static before:absolute before:inset-0 before:cursor-pointer typography-body-4-semibold gap-sm d-flex items-center"
                    href="./news/${article.id}">
                      <span class="[display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">${article.title}</span>
                  </a>
                  <time datetime="2026-09-14T12:25:48.657Z" class="typography-body-6 d-d-block text-content-secondary">Il y a 9 heures</time>
                </div>
              </div>
            </div>
    `;
  }

  function parseDate(value) {
    if (!value) {
      return null;
    }

    /*
     * Format actuel :
     * DD-MM-YYYY
     */

    const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);

    if (match) {
      const [, day, month, year] = match;

      const date = new Date(Number(year), Number(month) - 1, Number(day));

      return Number.isNaN(date.getTime()) ? null : date;
    }

    /*
     * Support futur du format ISO :
     * YYYY-MM-DD
     */

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  function compareArticlesByDate(a, b) {
    const dateA = parseDate(a.date)?.getTime() || 0;

    const dateB = parseDate(b.date)?.getTime() || 0;

    return dateB - dateA;
  }

  /*
   * ERREUR / EMPTY
   */

  function showError(message) {
    articlesList.replaceChildren(createEmptyMessage(message));
  }

  function createEmptyMessage(message) {
    const paragraph = document.createElement("p");

    paragraph.className = "text-muted";

    paragraph.textContent = message;

    return paragraph;
  }
})();
