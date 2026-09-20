(() => {
  "use strict";

  const eventsList = document.querySelector("#events-list");

  function renderEvents(events) {
    const eventsRendered = events.sort(compareArticlesByDate).map((event) => {
      if (event.type === "match") {
        return renderMatch(event);
      } else if (event.type === "event") {
        return renderEvent(event);
      }
    });

    const skeleton__events = eventsList.querySelectorAll(".skeleton__event");
    skeleton__events.forEach((item) => eventsList.removeChild(item));
    eventsList.classList.toggle("skeleton", false);

    eventsRendered.forEach((eventRendered) => {
      eventsList.insertAdjacentHTML("beforeend", eventRendered);
    });
  }
  function renderEvent(event) {
    const address = event.adress
      ? `<div>
        <a class="typography-button-2 text-content-secondary md:typography-button-1 gap-xs duration-medium-1 hover:text-content-primary relative z-50 flex items-center transition-colors"
                    aria-label="Résumé" href="${event.adress}" style="color: antiquewhite;">${event.adress}</a>
        </div>`
      : '<div class="h-4" aria-hidden="true"></div>';
    const eventPhoto = event.photoUrl
      ? `style="background-image: url(${event.photoUrl});"`
      : '';
    return `
<article class="calendar__event event min-w-0 shrink-0 grow-0 clip-corner duration-medium-1 bg-background-secondary relative flex w-[220px] flex-col overflow-hidden md:w-[293px] hover:bg-background-secondary-hover">
  <div class="d-flex flex-column h-100 grow-1 absolute top-0 bottom-0 left-0 right-0" ${eventPhoto}></div>
  <div class="gap-lg d-flex h-100 w-100 flex-column relative p-lg lg:p-xl" style="background: linear-gradient(180deg, rgba(14, 27, 54, 0.4) 0%, rgba(14, 27, 54, 0) 100%), radial-gradient(121.6% 90.18% at 86.15% 0%, rgba(14, 27, 54, 0) 49.83%, rgba(14, 27, 54, 1) 100%);">
    <div class="typography-overline-2 gap-sm flex items-center" style="z-index: 1;">
      <div class="gap-sm flex items-center">
        <div class="gap-sm flex flex-none items-center">
          <time datetime="${event.date}" class="gap-xs flex"><span
              class="text-content-secondary" style="color: white">${event.shortDate}</span><span
              class="text-content-black" style="color: white">${event.shortHour}</span></time>
        </div>
      </div>
    </div>
    <div class="gap-lg d-flex flex-column h-100 grow-1 justify-between">
      <div class="gap-md pointer-events-none flex flex-column relative">
        <div class="gap-sm flex items-center flex-col" style="">
          <div class="typography-title-4 gap-sm top-0-5 relative flex h-8 items-center leading-none">
            <span style="color: white">${event.title}</span>
          </div>
        </div>
      </div>
      ${address}
    </div>
  </div>
</article>
`;
  }
  function renderMatch(match) {
    const overTag =
        !match.forfait &&
      parseDate(match.date) < new Date()
        ? '<span class="mt-0.5 leading-none">Terminé</span>'
        : "";

    const forfaitBanner = match.forfait
      ? `<div class="px-xs pt-0.75 pb-0.5 event-match__forfait-banner">forfait</div>`
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
                  <div class="typography-overline-2 bg-background-tertiary px-xs pt-0.75 pb-0.5 event-match_competition" style="
  box-shadow: var(--shadow-md);">${match.competition}</div>
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

  window.RCBAHomeRenderers = window.RCBAHomeRenderers || {};
  window.RCBAHomeRenderers.renderEvents = renderEvents;
})();
