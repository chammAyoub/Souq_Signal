import os
import re
import time
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

print("🚀 Démarrage du scraper Massif (Pagination & Isolation)...")
url_cible_base = os.getenv("TARGET_URL_1")

if not url_cible_base:
    print("❌ Erreur: TARGET_URL_1 introuvable dans le fichier .env")
    exit()

# N-7iydou ay pagination 9dima f l-URL (.env) bach n-saybouha d-jdida
url_cible_base = url_cible_base.split('?')[0]
api_url = os.getenv("API_BACKEND_URL")

# 🌟 CH7AL MN PAGE BGHITI T-SCRAPI ? 🌟
NOMBRE_DE_PAGES = 20

print(f"🔍 Cible de base : {url_cible_base}")

# BOUCLE POUR PAGINATION
for page_num in range(1, NOMBRE_DE_PAGES + 1):
    url_page = f"{url_cible_base}?o={page_num}"
    print(f"\n📄 --- SCRAPING DE LA PAGE {page_num}/{NOMBRE_DE_PAGES} ---")
    print(f"🔍 Lien : {url_page}")

    try:
        with StealthySession(headless=False, solve_cloudflare=True) as session:
            page = session.fetch(url_page)
            print(f"📝 Statut HTTP : {page.status}")

            cartes_annonces = page.css('a.sc-1jge648-0')
            print(f"🚗 {len(cartes_annonces)} annonces trouvées sur cette page.")

            vehicules_valides = []
            titres_vus = set()

            for i, carte in enumerate(cartes_annonces):
                url_annonce = carte.xpath('@href').get()

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


                    annee_brute = annee_el[0].text.strip() if annee_el else None
                    annee_finale = None

                    if annee_brute and annee_brute.isdigit():
                        annee_finale = int(annee_brute)
                    else:
                        # PLAN B : On cherche l'année dans le titre
                        match_annee = re.search(r'\b(19[8-9]\d|20[0-2]\d)\b', titre)
                        if match_annee:
                            annee_finale = int(match_annee.group(1))

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
                        "urlAnnonce": url_annonce,
                        "marque": titre.split(" ")[0].capitalize() if titre else "Inconnue",
                        "modele": nettoyer_modele(titre),
                        "anneeModele": annee_finale,
                        "kilometrage": km_float,
                        "carburant": carburant,
                        "boiteVitesse": boite
                    }

                    vehicules_valides.append(vehicule_obj)
                    print(f"✅ {vehicule_obj['marque']} {vehicule_obj['modele']} | {prix_float} DH | Année: {annee_finale}")

                except ValueError:
                    continue

            print(f"\n🚀 Envoi de {len(vehicules_valides)} véhicules de la Page {page_num} vers Spring Boot...")

            if not api_url:
                print("⚠️ Attention : API_BACKEND_URL n'est pas définie dans le .env. Rien ne sera envoyé.")
            elif len(vehicules_valides) > 0:
                reponse = requests.post(api_url, json=vehicules_valides)
                if reponse.status_code in [200, 201]:
                    print(f"✅ BINGO ! Page {page_num} sauvegardée avec succès dans la Base de Données !")
                else:
                    print(f"❌ Le backend a refusé les données (Statut {reponse.status_code}) : {reponse.text}")
            else:
                print("ℹ️ Aucun véhicule valide à envoyer sur cette page.")

    except Exception as e:
        print(f"❌ Erreur critique sur la page {page_num} : {e}")
        print("⏭️ Le Bot passe à la page suivante...")

    # Pause avant de passer à la page suivante (sauf pour la dernière page)
    if page_num < NOMBRE_DE_PAGES:
        print("⏳ Pause de 4 secondes pour ne pas alerter les serveurs d'Avito...")
        time.sleep(4)

print("\n" + "="*50)
print("🏁 FIN DU SCRAPING MASSIF ! MISSION ACCOMPLIE 🦅")
input("\n⏳ Appuyez sur Entrée dans le terminal pour fermer le navigateur...")