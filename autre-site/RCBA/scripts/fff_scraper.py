import requests
import time
import random
import logging
import json
from datetime import datetime
from typing import Dict, Any, List

# Configuration du logging
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class FffEtlPipeline:
    """
    Pipeline ETL pour extraire les données d'un club de football depuis la FFF.
    Priorité 1: Ingénierie Inverse (API XHR)
    Priorité 2: Scraping Dynamique (Fallback via Playwright/Firecrawl)
    """

    def __init__(self, club_id_or_url: str):
        # Si une URL est fournie, on tente d'extraire l'ID du club (ex: 500000)
        self.club_id = self._parse_club_id(club_id_or_url)
        
        # Endpoint de l'API (Reverse Engineering)
        # Souvent hébergé sur api-dofa.prd-aws.fff.fr ou similaire
        self.api_base_url = "https://api-dofa.prd-aws.fff.fr/api"
        
        # Headers pour simuler un navigateur légitime et accepter le JSON
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json",
            "Origin": "https://www.fff.fr",
            "Referer": "https://www.fff.fr/",
            "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        }
        
        # Structure de données de sortie (Output)
        self.output_data = {
            "club_id": self.club_id,
            "club_name": "",
            "teams": []
        }

    def _parse_club_id(self, input_str: str) -> str:
        """Extrait l'ID du club à partir d'une URL ou le retourne tel quel."""
        if "fff.fr" in input_str:
            # Ex: https://www.fff.fr/competition/club/500000-rc-bu-abondant/equipes.html
            parts = input_str.split('/')
            for part in parts:
                if '-' in part and part.split('-')[0].isdigit():
                    return part.split('-')[0]
                if part.isdigit():
                    return part
        return str(input_str)

    def _make_request(self, endpoint: str) -> Dict[str, Any]:
        """Effectue une requête réseau vers l'API FFF avec Rate Limiting intelligent."""
        url = f"{self.api_base_url}{endpoint}"
        
        # Rate Limiting: Randomisation des délais pour éviter le bannissement IP
        delay = random.uniform(1.5, 4.0)
        logging.debug(f"Waiting {delay:.2f}s before fetching {url}...")
        time.sleep(delay)
        
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code in [401, 403]:
                logging.error(f"Accès refusé ({e.response.status_code}) sur {url}. L'API exige peut-être un token CSRF/JWT ou un bypass anti-bot.")
            else:
                logging.error(f"Erreur HTTP {e.response.status_code} sur {url}")
            return None
        except requests.exceptions.Timeout:
            logging.error(f"Timeout sur l'URL {url}")
            return None
        except Exception as e:
            logging.error(f"Erreur inattendue sur {url}: {str(e)}")
            return None

    def _fallback_dynamic_scraping(self):
        """
        Fallback : Scraping Dynamique avec Playwright.
        Activé si l'API XHR est bloquée par un WAF (Datadome, Cloudflare) ou requiert un token complexe.
        """
        logging.info("--- ACTIVATION DU FALLBACK: Scraping Dynamique (Playwright) ---")
        logging.info("L'API FFF a rejeté notre requête directe. Lancement du navigateur headless...")
        
        # Note d'architecture: Ceci est un pseudo-code pour le fallback.
        # Dans un environnement de prod, on utiliserait playwright.sync_api
        
        """
        from playwright.sync_api import sync_playwright
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent=self.headers["User-Agent"],
                viewport={'width': 1920, 'height': 1080}
            )
            page = context.new_page()
            
            # 1. Aller sur la page du club
            page.goto(f"https://www.fff.fr/competition/club/{self.club_id}/equipes.html", wait_until="networkidle")
            
            # 2. Scraper le nom du club
            self.output_data["club_name"] = page.locator("h1.club-title").inner_text()
            
            # 3. Extraire les liens des équipes
            teams = page.locator(".team-list-item a").all()
            
            # 4. Naviguer vers chaque équipe, puis résultats/classement
            # ...
            browser.close()
        """
        logging.warning("Le fallback dynamique nécessite l'installation de 'playwright'. Fin de l'exécution factice du fallback.")

    def extract_club_and_teams(self):
        """Récupère les informations du club et la liste des équipes actives."""
        logging.info(f"Extraction des données pour le club ID: {self.club_id}")
        
        # Essai sur l'endpoint clubs
        # Note: '.json' est souvent requis par l'API FFF
        data = self._make_request(f"/clubs/{self.club_id}.json")
        
        if not data:
            # L'API directe a échoué, on passe au plan B
            self._fallback_dynamic_scraping()
            return False

        # Hydratation du JSON avec les données de l'API
        self.output_data["club_name"] = data.get("nom", f"Club {self.club_id}")
        
        # Extraction des équipes (Structure hypothétique basée sur les APIs FFF communes)
        equipes = data.get("equipes", [])
        for eq in equipes:
            self.output_data["teams"].append({
                "team_api_id": eq.get("cg_no"), # ID interne pour requêter les compétitions
                "category": eq.get("categorie_label", "Catégorie Inconnue"),
                "competitions": []
            })
            
        logging.info(f"Succès: {len(self.output_data['teams'])} équipes trouvées.")
        return True

    def extract_competitions_and_matches(self):
        """Pour chaque équipe, extrait ses classements et calendriers."""
        for team in self.output_data["teams"]:
            team_id = team.get("team_api_id")
            if not team_id:
                continue
                
            logging.info(f"Extraction Compétitions -> Equipe: {team['category']}")
            
            # Requête vers l'endpoint des compétitions de l'équipe
            comp_data = self._make_request(f"/equipes/{team_id}/competitions.json")
            if not comp_data:
                continue
                
            for comp in comp_data.get("competitions", []):
                competition_obj = {
                    "competition_name": comp.get("nom", "Compétition"),
                    "ranking": [],
                    "matches": []
                }
                
                # Extraction Classement
                phase_id = comp.get("phase_id")
                poule_id = comp.get("poule_id")
                if phase_id and poule_id:
                    ranking_data = self._make_request(f"/competitions/phases/{phase_id}/poules/{poule_id}/classement.json")
                    if ranking_data:
                        for row in ranking_data.get("classement", []):
                            competition_obj["ranking"].append({
                                "position": row.get("rang"),
                                "team": row.get("equipe_nom"),
                                "points": row.get("points"),
                                "played": row.get("joues"),
                                "won": row.get("gagnes"),
                                "drawn": row.get("nuls"),
                                "lost": row.get("perdus")
                            })

                # Extraction Matchs (Calendrier/Résultats)
                matches_data = self._make_request(f"/equipes/{team_id}/matchs.json?phase_id={phase_id}")
                if matches_data:
                    for match in matches_data.get("matchs", []):
                        competition_obj["matches"].append({
                            "date": match.get("date", datetime.now().isoformat()),
                            "home_team": match.get("equipe1_nom", "Domicile"),
                            "away_team": match.get("equipe2_nom", "Exterieur"),
                            "home_score": match.get("score1"),
                            "away_score": match.get("score2"),
                            "status": match.get("statut", "À venir")
                        })
                
                team["competitions"].append(competition_obj)
            
            # Nettoyage de l'ID interne qui n'est pas dans le schéma final
            del team["team_api_id"]

    def run(self) -> str:
        """Exécute le pipeline ETL complet et retourne le JSON formaté."""
        logging.info("--- DÉBUT DU PIPELINE ETL FFF ---")
        
        success = self.extract_club_and_teams()
        if success:
            self.extract_competitions_and_matches()
            
        logging.info("--- FIN DU PIPELINE ETL FFF ---")
        
        # Retourne le résultat final en format JSON strict
        return json.dumps(self.output_data, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    # Test du pipeline avec l'ID du RCBA (Ex: 500000 - à remplacer par le vrai numéro d'affiliation)
    pipeline = FffEtlPipeline("500000")
    result_json = pipeline.run()
    
    # Écriture du résultat dans un fichier local
    with open("fff_results.json", "w", encoding="utf-8") as f:
        f.write(result_json)
    
    print("ETL Terminé. Résultat sauvegardé dans fff_results.json")
