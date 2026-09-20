(() => {
  "use strict";

  const API_URL = "api/public";
  const sections = {
    events: document.querySelector("#events-list"),
    news: document.querySelector("#news-list"),
    partners: document.querySelector("#partners-list"),
  };

  init();

  async function init() {
    await Promise.all([
      import("./events.js"),
      import("./news-home.js"),
      import("./partners-home.js"),
    ]);
    if (!Object.values(sections).some(Boolean)) {
      return;
    }

    const results = await Promise.allSettled([
      fetchJson(`${API_URL}/events/fake-all.json`),
      fetchJson(`${API_URL}/news/home/fake-all.json`),
      fetchJson(`${API_URL}/partners/fake-all.json`),
    ]);

    renderSection("events", results[0], "renderEvents", "événements");
    renderSection("news", results[1], "renderArticles", "actualités");
    renderSection("partners", results[2], "renderPartners", "partenaires");
  }

  async function fetchJson(url) {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new TypeError("Le format de réponse de l'API est invalide.");
    }

    return data;
  }

  function renderSection(sectionName, result, rendererName, label) {
    const section = sections[sectionName];
    const renderer = window.RCBAHomeRenderers?.[rendererName];

    if (!section) {
      return;
    }

    if (result.status === "fulfilled" && renderer) {
      renderer(result.value);
    } else {
      section.replaceChildren(
        createErrorMessage(`Impossible de charger les ${label}.`),
      );
    }

    section.setAttribute("aria-busy", "false");
  }

  function createLoadingIndicator() {
    const loading = document.createElement("div");
    loading.className = "home-loading";
    loading.setAttribute("role", "status");
    loading.setAttribute("aria-label", "Chargement en cours");

    for (let index = 0; index < 3; index += 1) {
      const bar = document.createElement("span");
      bar.className = "home-loading__bar";
      loading.appendChild(bar);
    }

    return loading;
  }

  function createErrorMessage(message) {
    const paragraph = document.createElement("p");
    paragraph.className = "text-muted";
    paragraph.textContent = message;
    return paragraph;
  }
})();
