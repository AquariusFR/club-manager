(() => {
  "use strict";

  const API_URL = "/api/public/news";

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
})();
