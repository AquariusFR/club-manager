const menuButton = document.querySelector(".site-header__menu-button");
const navigation = document.querySelector("#main-navigation");

const isMenuVisible = menuButton.checkVisibility();

if (isMenuVisible && navigation) {
  menuButton.addEventListener("click", () => toggleMenu());
}

export function toggleMenu() {
    if(!isMenuVisible) return;
    const isOpen = navigation.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", isOpen);
}

function updateHeader() {
  const header = document.querySelector("header");
  header.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();