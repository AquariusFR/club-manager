(() => {
  "use strict";

  const API_URL = "/api/public/teams";

  const elements = {
    main: document.querySelector("main"),
    schoolContainer: document.getElementById("school-teams"),
    preformationContainer: document.getElementById("preformation-teams"),
    seniorContainer: document.getElementById("senior-teams"),
  };

  init();

  async function init() {
    setLoading(true);

    try {
      const teams = await fetchTeams();

      renderTeams(teams.school.teams, elements.schoolContainer);
      renderTeams(teams.preformation.teams, elements.preformationContainer);
      renderTeams(teams.senior.teams, elements.seniorContainer);
    } catch (error) {
      console.error("Erreur lors du chargement des équipes :", error);

      showError("Impossible de charger les équipes.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchTeams() {
    const response = await fetch(`${API_URL}/fake-all.json`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API ${response.status} ${response.statusText}`);
    }

    const teams = await response.json();

    if (!Array.isArray(teams.school?.teams) || !Array.isArray(teams.preformation?.teams) || !Array.isArray(teams.senior?.teams)) {
      throw new Error("Le format de réponse de l'API est invalide.");
    }

    return teams;
  }

  function renderTeams(teams, container) {
    container.replaceChildren();

    if (teams.length === 0) {
      container.appendChild(
        createEmptyMessage("Aucune équipe n'est actuellement disponible."),
      );

      return;
    }

    const sortedTeams = [...teams].sort(compareTeams);

    sortedTeams.forEach((team) => {
      container.appendChild(createTeamCard(team));
    });
  }

  function createTeamCard(team) {
    const card = document.createElement("a");

    card.className = "team-card";
    card.href = `/equipe.html?id=${encodeURIComponent(team.id)}`;

    const category = document.createElement("div");
    category.className = "team-card__category";
    category.textContent = team.category || "Équipe";

    const content = document.createElement("div");
    content.className = "team-card__content";

    const contentSubTitle = document.createElement("p");
    contentSubTitle.className = "team-card__subtitle";
    contentSubTitle.textContent = `Équipe ${team.teamNumber}`;

    const contentDetails = document.createElement("dl");
    contentDetails.className = "team-card__details";

    const detailsStaff = document.createElement("div");
    const detailsStaffTitle = document.createElement("dt");
    const detailsStaffLabel = document.createElement("dd");
    detailsStaffTitle.textContent = "Éducateur";
    detailsStaffLabel.textContent = team.coach || "À venir";

    const detailsPlayerCount = document.createElement("div");
    const detailsPlayerCountTitle = document.createElement("dt");
    const detailsPlayerCountLabel = document.createElement("dd");
    detailsPlayerCountTitle.textContent = "Effectif";
    detailsPlayerCountLabel.textContent = team.playersCount || "À venir";

    const teamLink = document.createElement("a");
    teamLink.href = `/equipe.html?id=${encodeURIComponent(team.id)}`;
    teamLink.className = "team-card__link";
    teamLink.textContent = "Découvrir l'équipe";

    const arrow = document.createElement("span");
    arrow.className = "team-card__arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";

    contentDetails.append(detailsStaff);
    detailsStaff.append(detailsStaffTitle, detailsStaffLabel);
    contentDetails.append(detailsPlayerCount);
    detailsPlayerCount.append(detailsPlayerCountTitle, detailsPlayerCountLabel);
    teamLink.append(arrow);
    content.append(category, contentSubTitle, contentDetails);

    const meta = formatTeamMeta(team);

    card.append(category, content, meta, teamLink);

    return card;
  }

  function formatTeamMeta(team) {
    const metaList = document.createElement("ul");

    if (team.category) {
      addMetaPill(metaList, team.category, "meta-pill--competition");
    }

    if (team.competition) {
      addMetaPill(metaList, team.competition, "meta-pill");
    }

    if (team.season) {
      addMetaPill(metaList, formatSeason(team.season), "meta-pill");
    }

    metaList.className = "team-card__meta";

    return metaList;
  }

  function addMetaPill(metaList, value, className) {
    const metaItem = document.createElement("li");
    metaItem.className = className;
    metaItem.textContent = value;
    metaList.appendChild(metaItem);
  }

  function formatSeason(season) {
    return String(season).replace("-", " / ");
  }

  /*
   * Tri :
   *
   * U7
   * U9
   * U11
   * U13
   * U15
   * U18
   * Senior
   * Vétérans
   */

  function compareTeams(a, b) {
    const categoryOrder = {
      U7: 1,
      U9: 2,
      U11: 3,
      U13: 4,
      U15: 5,
      U18: 6,
      SENIOR: 7,
      SENIORS: 7,
      VETERANS: 8,
      VÉTÉRANS: 8,
    };

    const categoryA = normalizeCategory(a.category);

    const categoryB = normalizeCategory(b.category);

    const orderA = categoryOrder[categoryA] ?? 999;

    const orderB = categoryOrder[categoryB] ?? 999;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return (a.teamNumber ?? 999) - (b.teamNumber ?? 999);
  }

  function normalizeCategory(category) {
    return String(category || "")
      .trim()
      .toUpperCase();
  }

  function setLoading(isLoading) {
    if (elements.main) {
      elements.main.setAttribute("aria-busy", String(isLoading));
    }
  }

  function showError(message) {
    elements.teamsContainer.replaceChildren(createEmptyMessage(message));
  }

  function createEmptyMessage(message) {
    const paragraph = document.createElement("p");
    paragraph.className = "text-muted";
    paragraph.textContent = message;

    return paragraph;
  }
})();
