(() => {
  "use strict";

  const API_URL = "/api/public/volunteers";

  const volunteersList = document.querySelector("#volunteers-list");

  init();

  async function init() {
    if (!volunteersList) {
      return;
    }

    setLoading(true);

    try {
      const volunteers = await fetchVolunteers();

      renderVolunteers(volunteers);
    } catch (error) {
      console.error("Erreur lors du chargement des bénévoles :", error);

      showError("Impossible de charger les bénévoles.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchVolunteers() {
    const response = await fetch(API_URL + "/fake-all.json", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API ${response.status} ${response.statusText}`);
    }

    const volunteers = await response.json();

    if (!Array.isArray(volunteers)) {
      throw new TypeError("Le format de réponse de l'API est invalide.");
    }

    return volunteers;
  }

  function renderVolunteers(volunteers) {
    volunteersList.replaceChildren();

    if (volunteers.length === 0) {
      volunteersList.appendChild(
        createEmptyMessage("Aucun bénévole n'est actuellement renseigné."),
      );

      return;
    }

    volunteers.forEach((person) => {
      volunteersList.appendChild(createVolunteerCard(person));
    });
  }

  function createVolunteerCard(person) {
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

    content.append(name);

    article.append(avatar, content);

    return article;
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
    volunteersList.setAttribute("aria-busy", String(isLoading));
  }

  function showError(message) {
    volunteersList.replaceChildren(createEmptyMessage(message));
  }
})();
