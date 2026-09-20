(() => {
  "use strict";

  const partnersList = document.querySelector("#partners-list");
  function renderPartners(partners) {
    partnersList.replaceChildren();

    if (partners.length === 0) {
      partnersList.appendChild(
        createEmptyMessage("Aucune partneraires n'est disponible."),
      );

      return;
    }
    // TODO manage gold, silver and bronze partners

    const sortedPartners = [...partners];

    const partnersRendered = sortedPartners
      .map((partner) => renderPartner(partner))
      .join("");

    partnersList.insertAdjacentHTML("beforeend", partnersRendered);
  }

  /*
   * ARTICLES
   */

  function renderPartner(partner) {
    return `
          <div class="relative flex items-center flex-column gap-1">
            <a class="flex h-100 items-center transition-transform duration-300 ease-in-out hover:scale-110 md:hover:scale-110"
              aria-label="Visit Qatar" target="_blank" href="${partner.link}" rel="noopener noreferrer">
              <img alt="${partner.name}" title="${partner.desc}" loading="lazy" decoding="async" data-nimg="1"
                class="transition-opacity duration-300 ease-in object-contain"
                src="${partner.logo}"
                style="color: transparent; width: auto; height: 90px;
    max-width: 175px;"></a>
            <h3 class="typography-overline-2 d-block text-content-secondary" style="width: 175px; margin: 0; text-align: center;">${partner.desc}</h3>
          </div>
    `;
  }

  /*
   * ERREUR / EMPTY
   */

  function showError(message) {
    partnersList.replaceChildren(createEmptyMessage(message));
  }

  function createEmptyMessage(message) {
    const paragraph = document.createElement("p");

    paragraph.className = "text-muted";

    paragraph.textContent = message;

    return paragraph;
  }

  window.RCBAHomeRenderers = window.RCBAHomeRenderers || {};
  window.RCBAHomeRenderers.renderPartners = renderPartners;
})();
