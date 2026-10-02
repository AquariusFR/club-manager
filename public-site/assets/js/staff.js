(() => {
  "use strict";

  const API_URL = "/api/public/staff";

  if (window.spaEnabled) {
    init();
  }

  async function init() {
    const staffList = document.querySelector("#staff-list");
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
    const response = await fetch(API_URL, {
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
    const staffList = document.querySelector("#staff-list");
    staffList.replaceChildren();

    if (staff.length === 0) {
      staffList.appendChild(
        createEmptyMessage("Aucun éducateur n'est actuellement renseigné."),
      );

      return;
    }

    staffList.insertAdjacentHTML(
      "beforeend",
      staff.map(createStaffCard).join(""),
    );
  }

  function createStaffCard(person) {
    const initials = getInitials(person.firstName, person.lastName)
    const label = formatPersonName(person);
    const role = person.role || "Éducateur";
    const pills = Array.isArray(person.teams) && person.teams.length > 0
      ? person.teams.map((team) => 
        `<a class="meta-pill" href="./equipe.html?id=${encodeURIComponent(team.id)}">${team.label || formatTeamLabel(team)}</a>`
        )
      : [];

    return `
<article class="person-card">
    <div class="person-card__avatar" aria-hidden="true">${initials}</div>
    <div class="person-card__content">
        <h2>${label}</h2>
        <p class="person-card__role">${role}</p>
        <div class="person-card__teams">
            ${pills.join("")}
        </div>
    </div>
</article>
    `;
  }

  function formatTeamLabel(team) {
    const category = team.category || "Équipe";

    return team.teamNumber ? `${category} Équipe ${team.teamNumber}` : category;
  }

  function formatPersonName(person) {
    return `${person.firstName} ${person.lastName}`;
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

  window.renderStaff = renderStaff;
})();
