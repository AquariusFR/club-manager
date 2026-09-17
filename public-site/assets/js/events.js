(() => {
  "use strict";

  const API_URL = "api/public/events";

  const eventsList = document.querySelector("#events-list");

  init();

  async function init() {
    if (!eventsList) {
      return;
    }
    setLoading(true);

    eventsList.replaceChildren();

    try {
      const events = await fetchEvents();

      renderEvents(events);
    } catch (error) {
      console.error("Erreur lors du chargement des evenements :", error);

      showError("Impossible de charger les evenements.");
    } finally { 
      setLoading(false);
    }
  }
  function setLoading(isLoading) {
    eventsList.setAttribute("aria-busy", String(isLoading));
  }

  function showError(message) {
    eventsList.replaceChildren(createEmptyMessage(message));
  }

  /*
   * API
   */

  async function fetchEvents() {
    const response = await fetch(API_URL + "/fake-all.json", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API ${response.status} ${response.statusText}`);
    }

    const events = await response.json();

    if (!Array.isArray(events)) {
      throw new TypeError("Le format de réponse de l'API est invalide.");
    }

    return events;
  }

  function renderEvents(events) {
    const eventsRendered = events.sort(compareArticlesByDate).map((event) => {
      if (event.type === "match") {
        return renderMatch(event);
      } else if (event.type === "event") {
        return renderEvent(event);
      }
    });

    eventsRendered.forEach((eventRendered) => {
      eventsList.insertAdjacentHTML("beforeend", eventRendered);
    });
  }
  function renderEvent (event) {
    const address = event.adress
      ? `<div>
        <a class="typography-button-2 text-content-secondary md:typography-button-1 gap-xs duration-medium-1 hover:text-content-primary relative z-50 flex items-center transition-colors"
                    aria-label="Résumé" href="${event.adress}">${event.adress}</a>
        </div>`
      : '<div class="h-4" aria-hidden="true"></div>';
    const eventPhoto = event.photoUrl ? `<div class="relative">
                        <img alt="${event.title} logo" loading="lazy" width="32" height="32" decoding="async"
                        data-nimg="1" class="h-8 w-8 object-contain" style="color:transparent" sizes="64px"
                        src="${event.photoUrl}"></div>` : 
                        '<div style="height: 32px" aria-hidden="true"></div>'
    return `<article
            class="calendar__event event min-w-0 shrink-0 grow-0 clip-corner duration-medium-1 bg-background-secondary p-lg lg:p-xl relative flex w-[220px] flex-col overflow-hidden md:w-[293px] hover:bg-background-secondary-hover">
            <div class="gap-lg d-flex h-100 flex-column justify-between w-100">
              <div class="typography-overline-2 gap-sm flex items-center">
                <div class="gap-sm flex items-center">
                  <div class="gap-sm flex flex-none items-center">
                    <time datetime="${event.date}" class="gap-xs flex"><span
                        class="text-content-secondary">${event.shortDate}</span><span class="text-content-black">${event.shortHour}</span></time>
                  </div>
                </div>
              </div>
              <div class="gap-lg d-flex flex-column">
                <div class="gap-md pointer-events-none flex flex-column relative">
                  <div class="gap-sm flex items-center" style="z-index: 15;">
                    ${eventPhoto}
                    <div class="typography-title-4 gap-sm top-0-5 relative flex h-8 items-center leading-none">
                      <span>${event.title}</span>
                    </div>
                  </div>
                  <div class="gap-sm flex items-center" style="z-index: 15;">
                    <div class="relative">
                    <div class="typography-title-4 gap-sm top-0-5 relative flex h-8 items-center leading-none">
                      <span></span>
                    </div>
                  </div>
                </div>
                ${address}
              </div>
            </div>
          </article>`;
  }
  function renderMatch(match) {
    const overTag =
      parseDate(match.date) < new Date()
        ? '<span class="mt-0.5 leading-none">Terminé</span>'
        : "";

    const forfaitBanner = match.forfait
      ? `<div class="bg-background-tertiary px-xs pt-0.75 pb-0.5 uppercase" style="
    rotate: 45deg;
    position: absolute;
    right: -50px;
    top: -50px;
    width: 100px;
    background-color: #FF5722;
">forfait</div>`
      : "";

    const summary = match.summaryUrl
      ? `<div>
        <a class="typography-button-2 text-content-secondary md:typography-button-1 gap-xs duration-medium-1 hover:text-content-primary relative z-50 flex items-center transition-colors"
                    aria-label="Résumé" href="${match.summaryUrl}">Résumé<svg
                      class="inline h-4 w-4">
                      <use href="./assets/icons/chevron-right.svg"></use>
                    </svg></a>
        </div>`
      : '<div class="h-4" aria-hidden="true"></div>';

    return `<article
            class="calendar__event min-w-0 shrink-0 grow-0 clip-corner duration-medium-1 bg-background-secondary p-lg lg:p-xl relative flex w-[220px] flex-col overflow-hidden md:w-[293px] hover:bg-background-secondary-hover">
            <div class="gap-lg d-flex h-100 flex-column justify-between w-100">
              <div class="typography-overline-2 gap-sm flex items-center">
                <div class="gap-sm flex items-center">
                  <div class="gap-sm flex flex-none items-center">
                    <span class="bg-background-tertiary px-xs pt-0.75 pb-0.5 uppercase">${match.category}</span>
                    ${overTag}
                    <time datetime="${match.date}" class="gap-xs flex"><span
                        class="text-content-secondary">${match.shortDate}</span><span class="text-content-black">${match.shortHour}</span></time>
                  </div>
                </div>
              </div>
              <div class="gap-lg d-flex flex-column">
                <div class="gap-md pointer-events-none flex flex-column relative">
                  <div class="gap-sm flex items-center" style="z-index: 15;">
                    <div class="relative">
                        <img alt="${match.homeTeam} logo" loading="lazy" width="32" height="32" decoding="async"
                        data-nimg="1" class="h-8 w-8 object-contain" style="color:transparent" sizes="64px"
                        src="${match.homeTeamLogo}"></div>
                    <div class="typography-title-4 gap-sm top-0-5 relative flex h-8 items-center leading-none">
                      <span>${match.homeTeam}</span><span class="text-content-secondary">${match.homeTeamScore}</span>
                    </div>
                  </div>
                  <div class="gap-sm flex items-center" style="z-index: 15;">
                    <div class="relative">
                        <img alt="${match.awayTeam} logo" loading="lazy" width="32" height="32" decoding="async"
                        data-nimg="1" class="h-8 w-8 object-contain" style="color:transparent" sizes="64px"
                        src="${match.awayTeamLogo}"></div>
                    <div class="typography-title-4 gap-sm top-0-5 relative flex h-8 items-center leading-none">
                      <span>${match.awayTeam}</span><span class="text-content-secondary">${match.awayTeamScore}</span>
                    </div>
                  </div>
                  <div class="typography-overline-2 bg-background-tertiary px-xs pt-0.75 pb-0.5 uppercase" style="
    width: 50px;
    height: 50px;
    position: absolute;
    right: -10px;
    align-content: center;
    z-index: 10;
">${match.competition}</div>
                  ${forfaitBanner}
                </div>
                ${summary}
              </div>
            </div>
          </article>`;
  }
  function compareArticlesByDate(a, b) {
    const dateA = parseDate(a.date)?.getTime() || 0;

    const dateB = parseDate(b.date)?.getTime() || 0;

    return dateA - dateB;
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
})();
