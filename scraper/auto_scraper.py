import os
import re
from dotenv import load_dotenv
from scrapling.fetchers import StealthySession
import requests

load_dotenv()

# ==========================================
# 🧹 FONCTION DE NETTOYAGE (Data Cleaning - FIX)
# ==========================================
def nettoyer_modele(titre):
    if not titre:
        return "Inconnu"

    # Liste des mots à supprimer
    mots_a_supprimer = ["première main", "premiere main", "1ère main", "1ere main", "1er main", "1ère", "1ere", "jdida", "neuve", "j'accepte reprise", "reprise", "diesel", "essence", "modèle", "modele", "ww", "très bon état", "excellent état", "automatique", "manuelle", "presque", "dedouanee", "dédouanée", "à", "a", "au"]

    titre_clean = titre.lower()

    titre_clean = titre_clean.replace("✋", "").replace("1✋", "")

    for mot in mots_a_supprimer:
        pattern = r'\b' + re.escape(mot) + r'\b'
        titre_clean = re.sub(pattern, ' ', titre_clean)

    titre_clean = re.sub(r'\b20[1-2][0-9]\b', ' ', titre_clean)

    titre_clean = re.sub(r'[^\w\s-]', ' ', titre_clean)

    return " ".join(titre_clean.split()).title()
# ==========================================
# ==========================================

print("🚀 Démarrage du scraper...")
url_cible = os.getenv("TARGET_URL_1")

if not url_cible:
    print("❌ Erreur: TARGET_URL_1 introuvable dans le fichier .env")
    exit()

print(f"🔍 Tentative de connexion à la cible 1 ({url_cible})...")

with StealthySession(headless=False, solve_cloudflare=True) as session:
    page = session.fetch(url_cible)

    print("✅ Connexion réussie à la plateforme !")
    print(f"📝 Statut de la réponse HTTP : {page.status}")
    print("🕵️‍♂️ Extraction des données complètes (Full Object)...")

    cartes_annonces = page.css('a.sc-1jge648-0')
    print(f"🚗 {len(cartes_annonces)} annonces trouvées.")

    vehicules_valides = []
    titres_vus = set()

    for i, carte in enumerate(cartes_annonces):
        textes_bruts = carte.xpath('.//text()')
        texte_complet = ""
        for t in textes_bruts:
            valeur_texte = t.get() if hasattr(t, 'get') else str(t)
            if valeur_texte and valeur_texte.strip():
                texte_complet += valeur_texte.strip() + " "

        titres = carte.css('p.sc-1x0vz2r-0.iHApav')
        villes = carte.css('p.sc-1x0vz2r-0.layWaX')

        if not titres or not villes:
            continue

        titre = titres[0].text

        if titre in titres_vus:
            continue

        ville = villes[-1].text.replace("Voitures d'occasion dans ", "").strip()

        if "demander le prix" in texte_complet.lower():
            continue

        match_prix = re.search(r'((?:\d[\s\u202f\xa0]*)+)DH', texte_complet, re.IGNORECASE)

        if not match_prix:
            continue

        prix_brut = match_prix.group(1)
        prix_propre = re.sub(r'[^\d]', '', prix_brut)

        try:
            prix_float = float(prix_propre)

            annee_el = carte.css('span[title="Année-Modèle"]')
            km_el = carte.css('span[title="Kilométrage"]')
            boite_el = carte.css('span[title*="Boite de vitesses"], span[title*="Boîte de vitesses"]')
            carburant_el = carte.css('span[title="Type de carburant"]')

            urls_images = carte.xpath('.//img/@src | .//img/@srcset | .//img/@data-src').getall()
            image_url = None

            for url_brute in urls_images:
                url_clean = url_brute.split(" ")[0].strip()
                if url_clean.startswith("http") and "avatar" not in url_clean.lower() and "stores" not in url_clean.lower():
                    image_url = url_clean
                    break

            annee = annee_el[0].text.strip() if annee_el else None
            boite = boite_el[0].text.strip() if boite_el else None
            carburant = carburant_el[0].text.strip() if carburant_el else None

            km_float = None
            if km_el:
                km_brut = km_el[0].text
                km_propre = re.sub(r'[^\d]', '', km_brut)
                if km_propre:
                    km_float = float(km_propre)

            titres_vus.add(titre)
            # 6. CONSTRUCTION DE L'OBJET FINAL
            vehicule_obj = {
                "titreAnnonce": titre,
                "prix": prix_float,
                "ville": ville,
                "imageURL": image_url,
                "marque": titre.split(" ")[0].capitalize() if titre else "Inconnue",
                "modele": nettoyer_modele(titre),
                "anneeModele": int(annee) if annee and annee.isdigit() else None,
                "kilometrage": km_float,
                "carburant": carburant,
                "boiteVitesse": boite
            }

            vehicules_valides.append(vehicule_obj)
            print(f"✅ {vehicule_obj['marque']} {vehicule_obj['modele']} | {prix_float} DH | {annee}")
            if len(vehicules_valides) >= 35:
                break

        except ValueError:
            continue

    print("\n" + "="*50)
    print("🚀 INTÉGRATION SPRING BOOT : Envoi des données vers le Backend...")



    api_url = os.getenv("API_BACKEND_URL")

    if not api_url:
        print("⚠️ Attention : API_BACKEND_URL n'est pas définie dans le .env. Rien ne sera envoyé.")
    elif len(vehicules_valides) > 0:
        try:
            reponse = requests.post(api_url, json=vehicules_valides)
            if reponse.status_code in [200, 201]:
                print(f"✅ BINGO ! {len(vehicules_valides)} véhicules ont été envoyés et sauvegardés avec succès !")
            else:
                print(f"❌ Le backend a refusé les données (Statut {reponse.status_code}) :")
                print(reponse.text)
        except Exception as e:
            print(f"❌ Impossible de joindre le backend. Ton serveur Spring Boot est-il bien allumé ?")
    else:
        print("ℹ️ Aucun véhicule valide à envoyer.")

    input("\n⏳ Appuyez sur Entrée dans le terminal pour fermer le navigateur...")