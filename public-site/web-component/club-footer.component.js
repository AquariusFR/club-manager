class ClubFooterComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
    <link rel="stylesheet" href="/assets/css/layout.css">

    <link rel="stylesheet" href="/assets/css/utilities.css">
    <link rel="stylesheet" href="/assets/css/reset.css">

    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__content">
          <div class="d-flex items-center gap-2">
            <img
              src="/assets/icons/rcba_flat_logo.svg"
              alt="Logo RCBA"
              width="48"
              height="48"
            />

            <div>
              <strong>Racing Club Bû Abondant</strong>

              <p class="mb-0 text-white">Football • Passion • Respect</p>
            </div>
          </div>

          <nav aria-label="Navigation secondaire">
            <ul class="d-flex flex-column gap-1">
              <li>
                <a href="/mentions-legales.html"> Mentions légales </a>
              </li>
              <li>
                <a href="/politique-confidentialite.html"
                  >Politique de confidentialité</a
                >
              </li>
            </ul>
          </nav>
        </div>

        <p class="site-footer__copyright">
          © 2026 Racing Club Bû Abondant — Tous droits réservés.
        </p>
      </div>
    </footer>
    `;
  }
}

customElements.define("club-footer", ClubFooterComponent);
