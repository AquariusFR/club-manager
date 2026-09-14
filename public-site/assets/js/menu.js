const menuButton = document.querySelector(".site-header__menu-button");
const navigation = document.querySelector("#main-navigation");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", isOpen);

    menuButton.classList.toggle("is-active", isOpen);
  });
}
