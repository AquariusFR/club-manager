(() => {
  "use strict";

  function renderHome(data) {
    const sections = {
      events: document.querySelector("#events-list"),
      news: document.querySelector("#news-list"),
      partners: document.querySelector("#partners-list"),
    };
    renderSection(sections.events, data.events, "renderEvents", "événements");
    renderSection(sections.news, data.news, "renderArticles", "actualités");
    renderSection(sections.partners, data.partners, "renderPartners", "partenaires");
  }

  window.renderHome = renderHome;

  function renderSection(section, data, rendererName, label) {
    const renderer = window.RCBAHomeRenderers?.[rendererName];

    if (!section) {
      return;
    }

    renderer(data);

    section.setAttribute("aria-busy", "false");
  }
})();
