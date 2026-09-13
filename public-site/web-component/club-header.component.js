class ClubHeaderComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
    <link rel="stylesheet" href="/assets/css/layout.css">

    <link rel="stylesheet" href="/assets/css/utilities.css">
    <link rel="stylesheet" href="/assets/css/reset.css">

    <header class="header__wrapper">
        <div class="container">

            <a href="/" class="site-header__brand">
                <img src="/assets/icons/rcba_flat_logo.svg" alt="RCBA" width="52" height="52">

                <div class="hidden-mobile">
                    <strong>RCBA</strong>
                    <span>Racing Club Bû Abondant</span>
                </div>
                <div class="site-header__title hidden-desktop">
                    <strong>RCBA</strong>
                </div>
            </a>

            <button class="site-header__menu-button hidden-desktop" aria-label="Ouvrir le menu" aria-expanded="false"
                aria-controls="main-navigation">

                <span></span>
                <span></span>
                <span></span>

            </button>

            <nav id="main-navigation" class="site-header__navigation" aria-label="Navigation principale">

                <ul>
                    <li><a href="/" aria-current="page"><img src="/assets/icons/home.svg" alt="Accueil" width="24" height="24">Accueil</a></li>
                    <li><a href="/equipes.html"><img src="/assets/icons/teams.svg" alt="Équipes" width="24" height="24">Équipes</a></li>
                    <li><a href="/educateurs.html"><img src="/assets/icons/educators.svg" alt="Éducateurs" width="24" height="24">Éducateurs</a></li>
                    <li><a href="/benevoles.html"><img src="/assets/icons/educators.svg" alt="Bénévoles" width="24" height="24">Bénévoles</a></li>
                    <li><a href="/valeurs.html"><img src="/assets/icons/thumbs-up.svg" alt="Valeurs" width="24" height="24">Valeurs</a></li>
                    <li><a href="/licences.html"><img src="/assets/icons/document-list.svg" alt="Licences" width="24" height="24">Licences</a></li>
                    <li><a href="/palmares.html"><img src="/assets/icons/sun.svg" alt="Palmarès" width="24" height="24">Palmarès</a></li>
                    <li><a href="/contact.html"><img src="/assets/icons/map-marker.svg" alt="Nous trouver" width="24" height="24">Nous trouver</a></li>
                </ul>

            </nav>

        </div>
</header>
      <style>
      .header__wrapper {
      
    background: white;

    min-height: var(--header-height);

    border-bottom: 1px solid var(--color-border);

    box-shadow: var(--shadow-sm);
    width: 100%;
  }
      .container {

    display: flex;

    align-items: center;

    justify-content: space-between;

    min-height: var(--header-height);
}

    .hidden-desktop{

        display:none!important;
    }
}
      </style>
    `;
  }
}

customElements.define("club-header", ClubHeaderComponent);
const menuButton = document.querySelector(".site-header__menu-button");
const navigation = document.querySelector("#main-navigation");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", isOpen);

    menuButton.classList.toggle("is-active", isOpen);
  });
}
