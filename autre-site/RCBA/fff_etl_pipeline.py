"""
Pipeline ETL FFF - Extraction de Données Club
Utilisation de Playwright pour intercepter les requêtes réseau (Fallback API).

Pré-requis:
1. pip install playwright
2. playwright install chromium
"""

import json
import time
import asyncio
import logging
from typing import Dict, Any, List

try:
    from playwright.async_api import async_playwright, Page, Response
except ImportError:
    print("Erreur: Playwright n'est pas installé. Exécutez 'pip install playwright' et 'playwright install chromium'.")
    exit(1)

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FFFPlaywrightScraper:
    def __init__(self, club_affiliation_number: str):
        self.club_id = club_affiliation_number
        self.base_url = f"https://www.fff.fr/competition/club/{self.club_id}-club/equipes.html"
        self.extracted_data = {
            "club_id": self.club_id,
            "club_name": "",
            "teams": []
        }

    async def _handle_response(self, response: Response):
        """Intercepte et analyse les réponses réseau pour extraire les JSON de l'API."""
        url = response.url
        if "api-dofa.fff.fr/api/clubs" in url or "api-dofa.fff.fr/api/equipes" in url or "api-dofa.fff.fr/api/competitions" in url:
            if response.request.resource_type == "fetch" or response.request.resource_type == "xhr":
                try:
                    data = await response.json()
                    
                    # Capture des infos du club
                    if url.endswith(f"/api/clubs/{self.club_id}"):
                        logger.info("Données du club interceptées.")
                        self.extracted_data["club_name"] = data.get("name", "")

                    # Capture des équipes
                    elif f"/api/clubs/{self.club_id}/equipes" in url:
                        logger.info("Données des équipes interceptées.")
                        teams_data = data.get("hydra:member", []) if isinstance(data, dict) else data
                        for t in teams_data:
                            # Ajout de l'équipe si non présente
                            team_info = {
                                "id": t.get("id", ""),
                                "category": t.get("category_name", t.get("short_name", "Inconnue")),
                                "competitions": []
                            }
                            self.extracted_data["teams"].append(team_info)

                    # Capture des classements
                    elif "/classement" in url:
                        logger.info(f"Classement intercepté: {url}")
                        # Logique d'attachement à la bonne équipe
                        # Note: L'API FFF structure différemment, on collecte les classements de manière brute ici
                        if "rankings_raw" not in self.extracted_data:
                            self.extracted_data["rankings_raw"] = []
                        self.extracted_data["rankings_raw"].append(data)

                    # Capture des calendriers
                    elif "/calendrier" in url:
                        logger.info(f"Calendrier intercepté: {url}")
                        if "calendars_raw" not in self.extracted_data:
                            self.extracted_data["calendars_raw"] = []
                        self.extracted_data["calendars_raw"].append(data)
                        
                except Exception as e:
                    logger.debug(f"Impossible de parser la réponse JSON pour {url}: {e}")

    async def extract_all_data(self) -> Dict[str, Any]:
        """Lance le navigateur, navigue sur le site et collecte les requêtes."""
        logger.info(f"Démarrage de l'extraction Playwright pour le club: {self.club_id}")
        
        async with async_playwright() as p:
            # Lancement du navigateur en mode headless
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                viewport={'width': 1920, 'height': 1080}
            )
            page = await context.new_page()
            
            # Écoute des requêtes réseau
            page.on("response", self._handle_response)
            
            try:
                logger.info(f"Navigation vers {self.base_url}")
                await page.goto(self.base_url, wait_until="networkidle", timeout=60000)
                
                # Attendre un peu que toutes les requêtes asynchrones se terminent
                await page.wait_for_timeout(5000)

                # TODO: Pour capturer tous les calendriers et classements, il faudrait
                # simuler des clics sur chaque onglet ou chaque équipe de la page,
                # afin que le frontend FFF déclenche les requêtes API correspondantes.
                
                # Exemple de clic sur les onglets si nécessaire:
                # await page.click("text='Résultats'")
                # await page.wait_for_timeout(2000)
                
            except Exception as e:
                logger.error(f"Erreur lors de la navigation: {e}")
            finally:
                await browser.close()
                
        logger.info("Extraction terminée.")
        return self.extracted_data

    def save_to_json(self, data: Dict[str, Any], filename: str = "fff_data.json"):
        """Sauvegarde les données extraites dans un fichier JSON."""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        logger.info(f"Données sauvegardées dans {filename}")

async def main():
    # Affiliation du RC Bû Abondant
    CLUB_AFFILIATION = "560503"
    
    scraper = FFFPlaywrightScraper(CLUB_AFFILIATION)
    extracted_data = await scraper.extract_all_data()
    scraper.save_to_json(extracted_data, "rcba_fff_data.json")

if __name__ == "__main__":
    asyncio.run(main())
