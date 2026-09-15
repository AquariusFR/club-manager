(() => {
  "use strict";

  const API_BASE_URL = "/api/public/teams";

  const params = new URLSearchParams(window.location.search);
  const teamId = params.get("id");

  const elements = {
    main: document.querySelector("main"),

    heroTitle: document.querySelector(".team-hero h1"),
    heroTeamNumber: document.querySelector(".team-hero__team-number"),

    season: document
      .querySelector(".team-information-grid")
      ?.closest(".section")
      ?.querySelector(".section__eyebrow"),

    informationCards: document.querySelectorAll(
      ".team-information-grid .information-card",
    ),

    staffGrid: document.querySelector(".staff-grid"),
    playersGrid: document.querySelector(".players-grid"),
    eventsList: document.querySelector(".events-list"),
  };

  init();

  async function init() {
    if (!teamId || !isValidId(teamId)) {
      showError("Équipe introuvable.");
      return;
    }

    setLoading(true);

    try {
      const team = await fetchTeam(teamId);

      if (!team) {
        showError("Cette équipe n'existe pas.");
        return;
      }

      renderTeam(team);
    } catch (error) {
      console.error("Erreur lors du chargement de l'équipe :", error);

      showError("Impossible de charger les informations de cette équipe.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchTeam(id) {
    const response = await fetch(
      `${API_BASE_URL}/fake.json?id=${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`API ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  function renderTeam(team) {
    renderHero(team);
    renderInformation(team);
    renderStaff(team.staff);
    renderPlayers(team.players);
    renderEvents(team.events);

    updateMeta(team);
  }

  /*
   * Hero
   */
  function renderHero(team) {
    if (elements.heroTitle) {
      elements.heroTitle.textContent = team.category ?? "Équipe";
    }

    if (elements.heroTeamNumber) {
      elements.heroTeamNumber.textContent = formatTeamNumber(team.teamNumber);
    }
  }

  /*
   * INFORMATIONS
   */
  function renderInformation(team) {
    const cards = elements.informationCards;

    if (!cards || cards.length < 4) {
      return;
    }

    setInformationCard(cards[0], "Catégorie", team.category);
    setInformationCard(cards[1], "Équipe", team.teamNumber);
    setInformationCard(cards[2], "Compétition", team.competition || "À venir");
    setInformationCard(cards[3], "Éducateur", getMainCoachName(team.staff));

    if (elements.season) {
      elements.season.textContent = team.season
        ? `Saison ${formatSeason(team.season)}`
        : "Saison";
    }
  }

  function setInformationCard(card, label, value) {
    const labelElement = card.querySelector(".information-card__label");

    const valueElement = card.querySelector("strong");

    if (labelElement) {
      labelElement.textContent = label;
    }

    if (valueElement) {
      valueElement.textContent =
        value !== undefined && value !== null && value !== ""
          ? String(value)
          : "À venir";
    }
  }

  /*
   * STAFF
   */
  function renderStaff(staff = []) {
    if (!elements.staffGrid) {
      return;
    }

    elements.staffGrid.replaceChildren();

    if (isArrayEmpty(staff)) {
      elements.staffGrid.appendChild(
        createEmptyMessage("Aucun éducateur renseigné."),
      );
      return;
    }

    staff.forEach((person) => {
      elements.staffGrid.appendChild(createStaffCard(person));
    });
  }

  function createStaffCard(person) {
    const article = document.createElement("article");
    article.className = "person-card";

    const avatar = document.createElement("div");
    avatar.setAttribute("aria-hidden", "true");

    if (person.photoUrl) {
      avatar.className = "person-card__photo";
      avatar.style.backgroundImage = `url(${person.photoUrl})`;
    } else {
      avatar.className = "person-card__avatar";
      avatar.textContent = getInitials(person.firstName, person.lastName);
    }

    const content = document.createElement("div");

    const name = document.createElement("h3");
    name.textContent = formatPersonName(person);

    const role = document.createElement("p");
    role.textContent = person.role || "Éducateur";

    content.append(name, role);
    article.append(avatar, content);

    return article;
  }

  function getMainCoachName(staff = []) {
    if (isArrayEmpty(staff)) {
      return "À venir";
    }

    const coach =
      staff.find((person) => person.role === "Éducateur principal") ||
      staff.find((person) => person.role === "Coach") ||
      staff[0];

    return formatPersonName(coach) || "À venir";
  }

  /*
   * PLAYERS
   */
  function renderPlayers(players = []) {
    if (!elements.playersGrid) {
      return;
    }

    elements.playersGrid.replaceChildren();

    if (isArrayEmpty(players)) {
      elements.playersGrid.appendChild(
        createEmptyMessage("Aucun joueur renseigné."),
      );
      return;
    }

    players.forEach((player) => {
      elements.playersGrid.appendChild(createPlayerCard(player));
    });
  }

  function createPlayerCard(player) {
    const article = document.createElement("article");
    article.className = "player-card";

    const number = document.createElement("div");
    number.className = "player-card__number";

    number.textContent =
      player.number !== undefined && player.number !== null
        ? String(player.number).padStart(2, "0")
        : "—";

    const identity = document.createElement("div");
    identity.className = "player-card__identity";

    const firstName = document.createElement("strong");
    firstName.textContent = player.firstName || "";

    const lastName = document.createElement("span");
    lastName.textContent = player.lastName || "";

    identity.append(firstName, lastName);
    article.append(number, identity);

    return article;
  }

  /*
   * EVENTS
   */
  function renderEvents(events = []) {
    if (!elements.eventsList) {
      return;
    }

    elements.eventsList.replaceChildren();

    if (isArrayEmpty(events)) {
      elements.eventsList.appendChild(
        createEmptyMessage("Aucun rendez-vous à venir."),
      );
      return;
    }

    events.forEach((event) => {
      elements.eventsList.appendChild(createEventCard(event));
    });
  }

  function createEventCard(event) {
    const article = document.createElement("article");
    article.className = "event-card";

    const date = createEventDate(event.date);

    const content = document.createElement("div");
    content.className = "event-card__content";

    const type = document.createElement("span");
    type.className = "event-card__type";
    type.textContent = event.type || "Événement";

    const title = document.createElement("h3");
    title.textContent = event.title || "Rendez-vous";

    const details = document.createElement("p");
    details.textContent = formatEventDetails(event);

    content.append(type, title, details);
    article.append(date, content);

    return article;
  }

  function createEventDate(dateValue) {
    const dateElement = document.createElement("div");
    dateElement.className = "event-card__date";

    if (!dateValue) {
      dateElement.textContent = "—";
      return dateElement;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      dateElement.textContent = "—";
      return dateElement;
    }

    const weekday = new Intl.DateTimeFormat("fr-FR", { weekday: "short" })
      .format(date)
      .replace(".", "")
      .toUpperCase();

    const month = new Intl.DateTimeFormat("fr-FR", { month: "short" })
      .format(date)
      .replace(".", "")
      .toUpperCase();

    const day = document.createElement("strong");
    day.textContent = String(date.getDate());

    const weekdayElement = document.createElement("span");
    weekdayElement.textContent = weekday;

    const monthElement = document.createElement("span");
    monthElement.textContent = month;

    dateElement.append(weekdayElement, day, monthElement);

    return dateElement;
  }

  function formatEventDetails(event) {
    const details = [];

    if (event.time) {
      details.push(event.time);
    }

    if (event.location) {
      details.push(event.location);
    }

    return details.length > 0
      ? details.join(" — ")
      : "Horaire et lieu à confirmer";
  }

  /*
   * META
   */

  function updateMeta(team) {
    const category = team.category || "Équipe";

    const teamNumber = team.teamNumber ? ` Équipe ${team.teamNumber}` : "";

    document.title = `${category}${teamNumber} — RCBA`;

    const description = document.querySelector('meta[name="description"]');

    if (description) {
      description.setAttribute(
        "content",
        `Découvrez ${category}${teamNumber} du Racing Club Bû Abondant.`,
      );
    }
  }

  /*
   * UI
   */
  function setLoading(isLoading) {
    if (!elements.main) {
      return;
    }

    elements.main.setAttribute("aria-busy", String(isLoading));
  }

  /*
   * Erreur
   */
  function showError(message) {
    if (!elements.main) {
      return;
    }

    elements.main.replaceChildren();

    const section = document.createElement("section");
    section.className = "section";

    const container = document.createElement("div");
    container.className = "container text-center";

    const title = document.createElement("h1");
    title.textContent = "Équipe introuvable";

    const text = document.createElement("p");
    text.textContent = message;

    const link = document.createElement("a");
    link.className = "button";
    link.href = "./equipes.html";
    link.textContent = "← Retour aux équipes";

    container.append(title, text, link);
    section.append(container);

    elements.main.append(section);
  }

  /*
   * Message vide
   */
  function createEmptyMessage(message) {
    const paragraph = document.createElement("p");
    paragraph.className = "text-muted";
    paragraph.textContent = message;

    return paragraph;
  }

  /*
   * UTILITAIRES
   */

  function isValidId(value) {
    const id = Number(value);

    return Number.isInteger(id) && id > 0;
  }

  function formatTeamNumber(number) {
    return number ? `Équipe ${number}` : "Équipe";
  }

  function formatSeason(season) {
    return String(season).replace("-", " / ");
  }

  function isArrayEmpty(value) {
    return !Array.isArray(value) || value.length === 0;
  }

  function formatPersonName(person) {
    return [person?.firstName, person?.lastName].filter(Boolean).join(" ");
  }

  function getInitials(firstName = "", lastName = "") {
    const first = firstName.trim().charAt(0);

    const last = lastName.trim().charAt(0);

    return `${first}${last}`.toUpperCase() || "?";
  }
})();
