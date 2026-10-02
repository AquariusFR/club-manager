import { toggleMenu } from "./menu.js";
export function setNavigation(page) {
  const href = window.location.href;

  // until it's on development, /public-site/ is after site root, so we need to remove it from the href
  const basePath = document.querySelector("base").getAttribute("href") || "/public-site/";

  // remove path from href after basePath
  const baseIndex = href.indexOf(basePath);
  const newHref = href.substring(0, baseIndex + basePath.length);
  window.history.pushState({ pageTitle: page }, "", `${newHref}${page}`);
  toggleMenu(); // Close the menu after navigation
}

export function setUpNavigationLinks(renderMainContent) {
  const replaceNavigation = (link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      let page = link.getAttribute("href").substring(2); // Remove "./" prefix

      if(page ==="") page = "index";

      console.log(`Navigating to page: ${page}`);
      renderMainContent(page);
    });
  };
  // replace href navigation links with click event listeners for SPA navigation
  // select all element with href attribute starting with "./" and add click event listener
  // do not take use element
  const navigationLinksSelector = "[href^='./']:not([href^='./assets/']):not(use)";
  const menuLinks = document.querySelector("header").querySelectorAll(navigationLinksSelector);
  const mainLinks = document.querySelectorAll(`main ${navigationLinksSelector}`);
  menuLinks.forEach(replaceNavigation);
  mainLinks.forEach(replaceNavigation);
}
