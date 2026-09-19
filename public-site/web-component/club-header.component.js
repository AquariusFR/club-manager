class ClubHeaderComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
    <link rel="stylesheet" href="./assets/css/layout.css">
    <link rel="stylesheet" href="./assets/css/utilities.css">
    <link rel="stylesheet" href="./assets/css/reset.css">

    <header class="header__wrapper">
        <div class="container">

            <a href="./" class="site-header__brand">
                <img src="./assets/icons/rcba_flat_logo.svg" alt="RCBA" width="52" height="52">

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
                    <li><a href="./" aria-current="page">
                        <svg width="24" height="24"><use width="24" height="24" href="./assets/icons/home.svg" alt="Accueil"></use></svg>
                        Accueil
                    </a></li>
                    <li><a href="./news.html">
                        <svg width="24" height="24"><use width="24" height="24" href="./assets/icons/rss.svg" alt="Actualités"></use></svg>
                        Actualités
                    </a></li>
                    <li><a href="./equipes.html">
                        <svg width="24" height="24"><use width="24" height="24" href="./assets/icons/teams.svg" alt="Équipes"></use></svg>
                        Équipes
                    </a></li>
                    <li><a href="./educateurs.html">
                        <svg width="24" height="24"><use width="24" height="24" href="./assets/icons/educators.svg" alt="Éducateurs"></use></svg>
                        Éducateurs
                    </a></li>
                    <li><a href="./benevoles.html">
                        <svg width="24" height="24"><use width="24" height="24" href="./assets/icons/benevoles.svg" alt="Bénévoles"></use></svg>
                        Bénévoles
                    </a></li>
                    <li><a href="./valeurs.html">
                        <svg width="24" height="24"><use width="24" height="24" href="./assets/icons/thumbs-up.svg" alt="Valeurs"></use></svg>
                        Valeurs
                    </a></li>
                    <li><a href="./licences.html">
                        <svg width="24" height="24"><use width="24" height="24" href="./assets/icons/document-list.svg" alt="Licences"></use></svg>
                        Licences
                    </a></li>
                    <li><a href="./palmares.html">
                        <svg width="24" height="24"><use width="24" height="24" href="./assets/icons/sun.svg" alt="Palmarès"></use></svg>
                        Palmarès
                    </a></li>
                    <li><a href="./contact.html">
                        <svg width="24" height="24"><use width="24" height="24" href="./assets/icons/map-marker.svg" alt="Nous trouver"></use></svg>
                        Nous
                     trouver</a></li>
                    <li class="shop"><a href="https://boutique.rcba.club" aria-current="page" >
                        <svg width="24" height="24"><use width="24" height="24" href="./assets/icons/intersport-logo.svg" alt="Boutique"></use></svg>
                        Boutique
                    </a></li>
                </ul>

            </nav>

        </div>
</header>`;

    const wrapper = shadow.querySelector(".header__wrapper");
    const menuButton = shadow.querySelector(".site-header__menu-button");
    const navigation = shadow.querySelector("#main-navigation");

    if (menuButton && navigation) {
      menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("is-open");
        wrapper.classList.toggle("is-open", isOpen);
        menuButton.classList.toggle("is-active", isOpen);
        menuButton.setAttribute("aria-expanded", isOpen);
      });
    }
  }
}

customElements.define("club-header", ClubHeaderComponent);

function updateHeader() {
  const header = document.querySelector("club-header");
  header.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
