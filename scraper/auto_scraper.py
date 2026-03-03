import os
from dotenv import load_dotenv
from scrapling.fetchers import StealthySession

load_dotenv()

print("🚀 Démarrage du scraper...")
url_cible = os.getenv("TARGET_URL_1")

if not url_cible:
    print("❌ Erreur: TARGET_URL_1 introuvable dans le fichier .env")
    exit()

print("🔍 Tentative de connexion à la cible 1...")

with StealthySession(headless=False, solve_cloudflare=True) as session:
    page = session.fetch(url_cible)

    print("✅ Connexion réussie à la plateforme !")
    print(f"📝 Statut de la réponse HTTP : {page.status}")

    print("🕵️‍♂️ Extraction des données depuis le DOM...")

    # 1. Extraction de toutes les balises contenant les titres des annonces via la classe CSS
    elements_titres = page.css('p.sc-1x0vz2r-0.iHApav')

    # 2. Comptage du nombre de véhicules trouvés sur la page
    print(f"🚗 {len(elements_titres)} véhicules trouvés sur cette page.")

    # 3. Affichage des 5 premiers véhicules pour validation (Test)
    print("--- Les 5 premiers véhicules ---")
    for i in range(5):
        if i < len(elements_titres):
            titre_voiture = elements_titres[i].text
            print(f"- {i+1}: {titre_voiture}")

    # Pause pour maintenir le navigateur ouvert lors du test
    input("⏳ Appuyez sur Entrée dans le terminal pour fermer le navigateur...")