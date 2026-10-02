import { setNavigation, setUpNavigationLinks } from "./routes.js";

setUpNavigationLinks(renderMainContent);

export async function renderMainContent(page) {
  const mainContent = document.querySelector("main");

  const [template, response] = await Promise.all([
    fetchTemplate(page),
    fetchData(page),
  ]);

  const templateText = await template.text();
  mainContent.innerHTML = templateText;

  if (!response.ok) {
    throw new Error(
      `getting ./${page} ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  console.log(`Received data for page ${page}:`, data);

  const renderer = window[`render${capitalize(page)}`];
  if (typeof renderer !== "function") {
    throw new Error(`No renderer function found for page: ${page}`);
  }

  window[`render${capitalize(page)}`](data);

  setNavigation(page);
}

async function fetchTemplate(page) {
  return await fetch(`./components/${page}.html`, {
    method: "GET",
    headers: {
      Accept: "text/html",
    },
  });
}
async function fetchData(page) {
  return await fetch(`/api/public/${page}/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}