import os
from dotenv import load_dotenv
import re
from scrapling.fetchers import StealthySession

load_dotenv()

print("🚀 Démarrage du scraper...")
url_cible = os.getenv("TARGET_URL_1")

if not url_cible:
    print("❌ Erreur: TARGET_URL_1 introuvable dans le fichier .env")
    exit()

print("🔍 Tentative de connexion à la cible 1...")

with StealthySession(headless=True, solve_cloudflare=True) as session:
    page = session.fetch(url_cible)

    print("✅ Connexion réussie à la plateforme !")
    print(f"📝 Statut de la réponse HTTP : {page.status}")

    print("🕵️‍♂️ Extraction des données depuis le DOM...")

    # 1. on cherche d'abord toutes les cartes d'annonces
    cartes_annonces = page.css('a.sc-1jge648-0')

    print("--- 🧠 MODE SAUVETAGE : Extraction Avancée (XPath + Regex) ---")

    vehicules_valides = []

    for i, carte in enumerate(cartes_annonces):
        # 1. on vérifie le type avant d'extraire
        textes_bruts = carte.xpath('.//text()')
        texte_complet = ""

        for t in textes_bruts:
            # On extrait le texte
            valeur_texte = t.get() if hasattr(t, 'get') else str(t)
            if valeur_texte and valeur_texte.strip():
                texte_complet += valeur_texte.strip() + " "

        titres = carte.css('p.sc-1x0vz2r-0.iHApav')
        villes = carte.css('p.sc-1x0vz2r-0.layWaX')

        if not titres or not villes:
            continue

        # 2. Le Titre et La Ville
        titre = titres[0].text
        ville_brute = villes[-1].text
        ville = ville_brute.replace("Voitures d'occasion dans ", "").strip()

        # 3. Le Filtre
        if "demander le prix" in texte_complet.lower():
            continue

        # 4. Le Prix via Regex
        match_prix = re.search(r'((?:\d[\s\u202f\xa0]*)+)DH', texte_complet, re.IGNORECASE)

        if match_prix:
            prix_brut = match_prix.group(1)
            prix_propre = re.sub(r'[^\d]', '', prix_brut)

            try:
                prix_float = float(prix_propre)

                # 5. On ajoute à notre liste finale
                vehicules_valides.append({
                    "titre": titre,
                    "prix": prix_float,
                    "ville": ville
                })
                print(f"✅ Succès : {titre} | {prix_float} DH | {ville}")

                # On arrête après 5 véhicules valides
                if len(vehicules_valides) == 5:
                    break

            except ValueError:
                continue

    print("\n" + "="*40)
    print("🎉 RÉSULTAT FINAL DE L'EXTRACTION PROPRE :")
    for i, v in enumerate(vehicules_valides):
        print(f"[{i+1}] {v['titre']} | Prix: {v['prix']} DH | Ville: {v['ville']}")

    input("\n⏳ Appuyez sur Entrée dans le terminal pour fermer le navigateur...")