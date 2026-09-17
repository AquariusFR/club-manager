(() => {
  "use strict";

  const API_URL = "api/public/news";

  const articlesList = document.querySelector("#articles-list");
  const viewer = document.querySelector("#image-viewer");
  const viewerImage = viewer?.querySelector(".image-viewer__image");
  const viewerCounter = viewer?.querySelector(".image-viewer__counter");
  const previousButton = viewer?.querySelector(".image-viewer__previous");
  const nextButton = viewer?.querySelector(".image-viewer__next");
  const closeButton = viewer?.querySelector(".image-viewer__close");

  let currentPhotos = [];
  let currentPhotoIndex = 0;

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
    const response = await fetch(API_URL + "/fake-all.json", {
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

  function renderArticles(articles) {
    articlesList.replaceChildren();

    if (articles.length === 0) {
      articlesList.appendChild(
        createEmptyMessage("Aucune actualité n'est disponible."),
      );

      return;
    }

    const sortedArticles = [...articles].sort(compareArticlesByDate);

    sortedArticles.forEach((article) => {
      articlesList.appendChild(createArticle(article));
    });
  }

  function createArticle(article) {
    const element = document.createElement("article");

    element.className = "article-card";

    /*
     * Galerie
     */

    if (Array.isArray(article.photos) && article.photos.length > 0) {
      element.appendChild(createArticleGallery(article));
    }

    /*
     * Contenu
     */

    const content = document.createElement("div");

    content.className = "article-card__content";

    /*
     * Date
     */

    const date = document.createElement("time");

    date.className = "article-card__date";

    date.dateTime = toIsoDate(article.date);

    date.textContent = formatDate(article.date);

    /*
     * Titre
     */

    const title = document.createElement("h2");

    title.className = "article-card__title";

    title.textContent = article.title || "Sans titre";

    /*
     * Texte
     */

    const text = document.createElement("div");

    text.className = "article-card__text";

    text.textContent = article.text || "";

    content.append(date, title, text);

    element.appendChild(content);

    return element;
  }

  /*
   * GALERIE
   */

  function createArticleGallery(article) {
    const gallery = document.createElement("div");

    gallery.className = "article-card__gallery";

    article.photos.forEach((photo, index) => {
      const button = document.createElement("button");

      button.type = "button";

      button.className = "article-card__photo";

      button.setAttribute("aria-label", `Afficher la photo ${index + 1}`);

      const image = document.createElement("img");

      image.src = photo;

      image.alt = `${article.title || "Actualité"} — photo ${index + 1}`;

      image.loading = index === 0 ? "eager" : "lazy";

      button.appendChild(image);

      button.addEventListener("click", () => {
        openViewer(article.photos, index, article.title);
      });

      gallery.appendChild(button);
    });

    return gallery;
  }

  /*
   * VISIONNEUSE
   */

  function openViewer(photos, index, title) {
    if (
      !viewer ||
      !viewerImage ||
      !Array.isArray(photos) ||
      photos.length === 0
    ) {
      return;
    }

    currentPhotos = photos;
    currentPhotoIndex = index;

    viewerImage.alt = `${title || "Actualité"} — photo ${index + 1}`;

    updateViewer();

    viewer.classList.add("image-viewer--open");

    viewer.setAttribute("aria-hidden", "false");

    document.body.classList.add("no-scroll");

    closeButton?.focus();
  }

  function closeViewer() {
    if (!viewer) {
      return;
    }

    viewer.classList.remove("image-viewer--open");

    viewer.setAttribute("aria-hidden", "true");

    document.body.classList.remove("no-scroll");

    currentPhotos = [];
    currentPhotoIndex = 0;
  }

  function showPreviousPhoto() {
    if (currentPhotos.length === 0) {
      return;
    }

    currentPhotoIndex =
      (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;

    updateViewer();
  }

  function showNextPhoto() {
    if (currentPhotos.length === 0) {
      return;
    }

    currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;

    updateViewer();
  }

  function updateViewer() {
    const photo = currentPhotos[currentPhotoIndex];

    if (!photo || !viewerImage) {
      return;
    }

    viewerImage.src = photo;

    if (viewerCounter) {
      viewerCounter.textContent = `${currentPhotoIndex + 1} / ${currentPhotos.length}`;
    }

    const hasMultiplePhotos = currentPhotos.length > 1;

    previousButton?.classList.toggle("hidden", !hasMultiplePhotos);

    nextButton?.classList.toggle("hidden", !hasMultiplePhotos);
  }

  /*
   * EVENTS VISIONNEUSE
   */

  closeButton?.addEventListener("click", closeViewer);

  previousButton?.addEventListener("click", showPreviousPhoto);

  nextButton?.addEventListener("click", showNextPhoto);

  viewer?.addEventListener("click", (event) => {
    /*
     * Cliquer sur le fond ferme la visionneuse.
     * Cliquer sur l'image ne la ferme pas.
     */
    if (event.target === viewer) {
      closeViewer();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!viewer?.classList.contains("image-viewer--open")) {
      return;
    }

    switch (event.key) {
      case "Escape":
        closeViewer();
        break;

      case "ArrowLeft":
        showPreviousPhoto();
        break;

      case "ArrowRight":
        showNextPhoto();
        break;
    }
  });

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
