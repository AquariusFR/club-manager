(() => {
  "use strict";

  const API_URL = "/api/public/news/";

  let articlesList;

  if (window.spaEnabled) {
    init();
  }

  async function init() {
    if (!articlesList) {
      return;
    }

    try {
      const articles = await fetchArticles();

      renderNews(articles);
    } catch (error) {
      console.error("Erreur lors du chargement des actualités :", error);

      showError("Impossible de charger les actualités.");
    }
  }

  /* API */
  async function fetchArticles() {
    const response = await fetch(API_URL, {
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

  /*
   * ARTICLES
   */

  function renderNews(articles) {
    articlesList = document.querySelector("#articles-list");

    articlesList.replaceChildren();

    if (articles.length === 0) {
      articlesList.appendChild(
        createEmptyMessage("Aucune actualité n'est disponible."),
      );

      return;
    }

    const sortedArticles = [...articles].sort(compareArticlesByDate);

    articlesList.insertAdjacentHTML(
      "beforeend",
      sortedArticles.map(createArticle).join(""),
    );
  }

  window.renderNews = renderNews;

  function createArticle(article) {
    const title = article.title || "Sans titre";
    const date = toIsoDate(article.date);
    const photo = article.photo || "";
    const category = article.category || "";
    const id = article.id || "";

    const articleHTML = `
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
            src="${photo}"></div>
    </div>
    <div class="gap-sm pt-md d-flex flex-column">
        <div class="gap-xs d-flex h-5 items-center self-stretch">
        <h3 class="typography-overline-2 d-block text-content-secondary">${category}</h3>
        </div>
        <a
        class="static before:absolute before:inset-0 before:cursor-pointer typography-body-4-semibold gap-sm d-flex items-center"
        href="./news/${id}">
            <span class="[display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">${title}</span>
        </a>
        <time datetime="2026-09-14T12:25:48.657Z" class="typography-body-6 d-d-block text-content-secondary">${date}</time>
    </div>
    </div>
</div>
    `;
    return articleHTML;
  }

  /*
   * FORMATAGE
   */

  function formatDate(value) {
    const date = parseDate(value);

    if (!date) {
      return value || "";
    }

    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  function toIsoDate(value) {
    const date = parseDate(value);

    if (!date) {
      return "";
    }

    return date.toISOString().slice(0, 10);
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
