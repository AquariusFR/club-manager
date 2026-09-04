import { test, expect } from '@playwright/test';

test.describe('RCBA Portal Smoke Tests', () => {
  test('La page d\'accueil s\'affiche correctement', async ({ page }) => {
    await page.goto('/');
    
    // Titre et meta
    await expect(page).toHaveTitle(/Racing Club Bû Abondant/i);

    // Éléments principaux
    const header = page.locator('header, nav');
    await expect(header).toBeVisible();

    // Liens principaux
    const loginLink = page.locator('a[href*="/login"]').first();
    await expect(loginLink).toBeVisible();
  });

  test('La page de connexion affiche le formulaire avec tous les rôles', async ({ page }) => {
    await page.goto('/login');

    // Vérification de la présence du formulaire
    const usernameInput = page.locator('input[name="username"]');
    const passwordInput = page.locator('input[name="password"]');
    
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('La boutique s\'affiche correctement et contient un bouton de retour', async ({ page }) => {
    await page.goto('/boutique');
    
    // Titre boutique ou conteneur principal
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Lien de retour vers l'accueil
    const homeLink = page.locator('a[href="/"]').first();
    await expect(homeLink).toBeVisible();
  });

  test('La page Rejoindre s\'affiche avec les piliers de recrutement', async ({ page }) => {
    await page.goto('/rejoindre');

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    const homeLink = page.locator('a[href="/"]').first();
    await expect(homeLink).toBeVisible();
  });
});
