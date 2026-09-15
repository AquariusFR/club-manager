(() => {
  "use strict";

  const API_URL = "/api/public/staff";

  const staffList = document.querySelector("#staff-list");

  init();

  async function init() {
    if (!staffList) {
      return;
    }

    setLoading(true);

    try {
      const staff = await fetchStaff();

      renderStaff(staff);
    } catch (error) {
      console.error("Erreur lors du chargement des éducateurs :", error);

      showError("Impossible de charger les éducateurs.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchStaff() {
    const response = await fetch(API_URL + "/fake-all.json", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API ${response.status} ${response.statusText}`);
    }

    const staff = await response.json();

    if (!Array.isArray(staff)) {
      throw new TypeError("Le format de réponse de l'API est invalide.");
    }

    return staff;
  }

  function renderStaff(staff) {
    staffList.replaceChildren();

    if (staff.length === 0) {
      staffList.appendChild(
        createEmptyMessage("Aucun éducateur n'est actuellement renseigné."),
      );

      return;
    }

    staff.forEach((person) => {
      staffList.appendChild(createStaffCard(person));
    });
  }

  function createStaffCard(person) {
    const article = document.createElement("article");
    article.className = "person-card";

    const avatar = document.createElement("div");
    avatar.className = "person-card__avatar";
    avatar.setAttribute("aria-hidden", "true");

    avatar.textContent = getInitials(person.firstName, person.lastName);

    const content = document.createElement("div");
    content.className = "person-card__content";

    const name = document.createElement("h2");
    name.textContent = formatPersonName(person);

    const role = document.createElement("p");
    role.className = "person-card__role";
    role.textContent = person.role || "Éducateur";

    content.append(name, role);

    if (Array.isArray(person.teams) && person.teams.length > 0) {
      content.appendChild(createTeams(person.teams));
    }

    article.append(avatar, content);

    return article;
  }

  function createTeams(teams) {
    const container = document.createElement("div");
    container.className = "person-card__teams";

    teams.forEach((team) => {
      const link = document.createElement("a");

      link.className = "meta-pill";
      link.href = `./equipe.html?id=${encodeURIComponent(team.id)}`;

      link.textContent = team.label || formatTeamLabel(team);

      container.appendChild(link);
    });

    return container;
  }

  function formatTeamLabel(team) {
    const category = team.category || "Équipe";

    return team.teamNumber ? `${category} Équipe ${team.teamNumber}` : category;
  }

  function formatPersonName(person) {
    return [person.firstName, person.lastName].filter(Boolean).join(" ");
  }

  function getInitials(firstName = "", lastName = "") {
    const first = firstName.trim().charAt(0);

    const last = lastName.trim().charAt(0);

    return `${first}${last}`.toUpperCase() || "?";
  }

  function createEmptyMessage(message) {
    const paragraph = document.createElement("p");

    paragraph.className = "text-muted";
    paragraph.textContent = message;

    return paragraph;
  }

  function setLoading(isLoading) {
    staffList.setAttribute("aria-busy", String(isLoading));
  }

  function showError(message) {
    staffList.replaceChildren(createEmptyMessage(message));
  }
})();
