import os
import re
import time
import argparse
import json
import logging
from datetime import datetime
from dotenv import load_dotenv
from scrapling.fetchers import StealthySession
from sqlalchemy import create_engine, text


# Désactive tous les messages INFO et WARNING des bibliothèques externes
logging.disable(logging.WARNING)

# Load the passwords from the .env file
load_dotenv()

parser = argparse.ArgumentParser(description="Souq Signal Smart Scraper")
parser.add_argument('--category', choices=['cars', 'real_estate', 'motos'], required=True, help="Category to scrape")
args = parser.parse_args()

print(f"--------- Démarrage du scraper pour la catégorie : {args.category.upper()}-------------")

if args.category == 'cars':
    url_cible_base = os.getenv("TARGET_URL_1_Cars")
elif args.category == 'real_estate':
    url_cible_base = os.getenv("TARGET_URL_1_RealEstate")
elif args.category == 'motos':
    url_cible_base = os.getenv("TARGET_URL_1_Motos")

if not url_cible_base:
    print(f"❌ Erreur: URL introuvable dans le fichier .env pour la catégorie {args.category}")
    exit(1)

DB_URL = os.getenv("DATABASE_URL")
if not DB_URL:
    print("❌ Erreur: DATABASE_URL introuvable dans le fichier .env")
    exit(1)
engine = create_engine(DB_URL)

url_cible_base = url_cible_base.split('?')[0]

# How many pages to scrape in THIS specific run
NOMBRE_DE_PAGES_A_SCRAPER = int(os.getenv("SCRAPER_PAGES", "10"))
DELAI_ENTRE_PAGES = 4.0
PAGE_LIMITE_MAX = 1000 # If we hit page 1000, loop back to 1

# ==========================================
# STATE MANAGEMENT (The Memory)
# ==========================================
STATE_FILE = "scraper_state.json"

def get_start_page(category):
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            state = json.load(f)
            return state.get(category, 1)
    return 1

def save_current_page(category, current_page):
    state = {}
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            state = json.load(f)
            
    # Reset to 1 if we hit the limit, otherwise save the next page
    if current_page >= PAGE_LIMITE_MAX:
        state[category] = 1
    else:
        state[category] = current_page

    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=4)

# Determine our starting point
start_page = get_start_page(args.category)
end_page = start_page + NOMBRE_DE_PAGES_A_SCRAPER

_UP = "ABCDEFGHIJKLMNOPQRSTUVWXYZÉÈÀÂÎÔÛÇ"
_LO = "abcdefghijklmnopqrstuvwxyzéèàâîôûç"
_FOLD_TABLE = str.maketrans(
    "àâäáãåèéêëìíîïòóôöõùúûüçñÀÂÄÁÃÅÈÉÊËÌÍÎÏÒÓÔÖÕÙÚÛÜÇÑ",
    "aaaaaaeeeeiiiiooooouuuucnAAAAAAEEEEIIIIOOOOOUUUUCN"
)

def _fold(s):
    if not s: return ""
    return s.translate(_FOLD_TABLE).lower()

# ==========================================
# CLEANING
# ==========================================
def nettoyer_modele(titre):
    if not titre: return "Inconnu"
    mots_a_supprimer = ["première main", "premiere main", "1ère main", "1ere main", "1er main", "1ère", "1ere",
                         "jdida", "neuve", "j'accepte reprise", "reprise", "diesel", "essence", "modèle", "modele",
                         "ww", "très bon état", "excellent état", "automatique", "manuelle", "presque",
                         "dedouanee", "dédouanée", "à", "a", "au"]
    titre_clean = titre.lower().replace("✋", "").replace("1✋", "")
    for mot in mots_a_supprimer:
        titre_clean = re.sub(r'\b' + re.escape(mot) + r'\b', ' ', titre_clean)
    titre_clean = re.sub(r'\b20[1-2][0-9]\b', ' ', titre_clean)
    titre_clean = re.sub(r'[^\w\s-]', ' ', titre_clean)
    return " ".join(titre_clean.split()).title()

def get_numbers_only(text_val):
    if not text_val: return None
    digits = re.sub(r'\D', '', text_val)
    return int(digits) if digits else None

def extract_price(carte):
    raw = carte.xpath('.//span[translate(normalize-space(.), "dh", "DH")="DH"]/preceding-sibling::*[1]/text()').get()
    if raw:
        digits = re.sub(r'\D', '', raw)
        if digits: return float(digits)
    for node in carte.xpath('.//*[contains(translate(., "dh", "DH"), "DH")]/text()').getall():
        if re.search(r'dh\s*/\s*mois', node, re.IGNORECASE): continue
        m = re.search(r'([\d\s.,]{2,})\s*dh\b', node, re.IGNORECASE)
        if m:
            digits = re.sub(r'\D', '', m.group(1))
            if digits: return float(digits)
    return None

def extract_ville(carte):
    ville = carte.xpath(
        f'.//span[contains(translate(., "{_UP}", "{_LO}"), "il y a") '
        f'or contains(translate(., "{_UP}", "{_LO}"), "aujourd") '
        f'or contains(translate(., "{_UP}", "{_LO}"), "hier")]'
        '/preceding-sibling::span[1]/text()'
    ).get()
    return ville.strip() if ville else "Inconnue"

def extract_badge(carte, title_name):
    needle = _fold(title_name)
    spans_avec_title = carte.xpath('.//span[@title]')
    for span in spans_avec_title:
        span_title = span.xpath('@title').get() or ''
        if _fold(span_title) == needle:
            text_val = span.xpath('text()').get()
            return text_val.strip() if text_val else None
    return None

ids_inseres = []

# ==========================================
# START SCRAPING (using the memory state)
# ==========================================
for page_num in range(start_page, end_page):
    url_page = f"{url_cible_base}?o={page_num}"
    print(f"\n📄 --- PAGE {page_num} (Objectif: {end_page - 1}) ---")

    stats = {"lues": 0, "sans_titre": 0, "sans_prix": 0, "valides": 0, "erreurs": 0}

    try:
        with StealthySession(headless=True, solve_cloudflare=True) as session:
            page = session.fetch(url_page)
            cartes_annonces = page.css('a[data-testid^="ad-card-v2-"]')
            if not cartes_annonces:
                cartes_annonces = page.xpath('//a[@href and .//h3]')

            if len(cartes_annonces) == 0:
                print("⚠️ Aucune annonce trouvée sur cette page. Réinitialisation de la mémoire à la page 1.")
                save_current_page(args.category, 1)
                break

            valides = []

            for carte in cartes_annonces:
                stats["lues"] += 1
                try:
                    url_annonce = carte.xpath('@href').get()
                    titre_el = carte.css('h3')
                    titre = titre_el[0].text.strip() if titre_el else None

                    if not titre:
                        stats["sans_titre"] += 1
                        continue

                    prix = extract_price(carte)
                    if not prix:
                        stats["sans_prix"] += 1
                        continue

                    ville = extract_ville(carte)

                    image_url = carte.xpath('.//img/@src | .//img/@srcset | .//img/@data-src').get()
                    if image_url:
                        image_url = image_url.split(" ")[0].strip()

                    item = {
                        "titre": titre,
                        "prix": prix,
                        "ville": ville,
                        "date": datetime.now(),
                        "image": image_url,
                        "url": url_annonce
                    }
                    
                    if args.category == 'cars':
                        item["marque"] = titre.split(" ")[0].capitalize()
                        item["modele"] = nettoyer_modele(titre)
                        item["annee"] = get_numbers_only(extract_badge(carte, "Année-Modèle"))
                        item["km"] = get_numbers_only(extract_badge(carte, "Kilométrage"))
                        item["carburant"] = extract_badge(carte, "Type de carburant")
                        item["boite"] = extract_badge(carte, "Boîte de vitesses")

                    elif args.category == 'real_estate':
                        item["chambres"] = get_numbers_only(extract_badge(carte, "Chambres"))
                        item["surface"] = get_numbers_only(extract_badge(carte, "Surface totale"))
                        item["etage"] = get_numbers_only(extract_badge(carte, "Étage"))
                        item["type"] = "Appartement"
                        item["secteur"] = ville

                    elif args.category == 'motos':
                        item["marque"] = titre.split(" ")[0].capitalize()
                        item["modele"] = nettoyer_modele(titre)
                        item["annee"] = get_numbers_only(extract_badge(carte, "Année-Modèle"))
                        item["km"] = get_numbers_only(extract_badge(carte, "Kilométrage"))
                        item["cylindree"] = extract_badge(carte, "Cylindrée (cm3)")

                    valides.append(item)
                    stats["valides"] += 1

                except Exception as e:
                    stats["erreurs"] += 1
                    continue

            print(f"📊 Page {page_num}: {stats['lues']} lues | {stats['valides']} valides")
            
            with engine.begin() as conn:
                for v in valides:
                    try:
                        with conn.begin_nested():
                            # 1. Insertion de l'annonce mère (avec DO NOTHING si elle existe déjà)
                            query_base = text("""
                                INSERT INTO annonce_base (titre_annonce, prix, ville, date_annonce, imageurl, url_annonce)
                                VALUES (:titre, :prix, :ville, :date, :image, :url)
                                ON CONFLICT (url_annonce) DO NOTHING
                                RETURNING id_annoce
                            """)
                            result = conn.execute(query_base, v)
                            row = result.fetchone()

                            # 2. (NOUVEAU) Enregistrement inconditionnel de l'observation de prix
                            # Cela s'exécute toujours, même si l'annonce existe déjà !
                            query_obs = text("""
                                INSERT INTO price_observations (url_annonce, prix, categorie)
                                VALUES (:url, :prix, :categorie)
                            """)
                            v["categorie"] = args.category # Ajout de la catégorie au dictionnaire
                            conn.execute(query_obs, v)

                            # 3. Insertion des détails spécifiques SEULEMENT si c'est une nouvelle annonce
                            if row:
                                v["id"] = row[0]
                                ids_inseres.append(v["id"]) 

                                if args.category == 'cars':
                                    q = text("INSERT INTO car_details (id_annonce, marque, modele, annee_modele, kilometrage, carburant, boite_vitesse) VALUES (:id, :marque, :modele, :annee, :km, :carburant, :boite)")
                                    conn.execute(q, v)
                                elif args.category == 'real_estate':
                                    q = text("INSERT INTO estate_details (id_annonce, chambres, surface_habitable, etage, type_appartement, secteur) VALUES (:id, :chambres, :surface, :etage, :type, :secteur)")
                                    conn.execute(q, v)
                                elif args.category == 'motos':
                                    q = text("INSERT INTO moto_details (id_annonce, marque, modele, annee_modele, kilometrage, cylindree) VALUES (:id, :marque, :modele, :annee, :km, :cylindree)")
                                    conn.execute(q, v)
                    except Exception as e:
                        continue
                        
    except Exception as e:
        print(f"❌ Erreur critique sur la page: {e}")

    # Update the memory state to the next page!
    save_current_page(args.category, page_num + 1)
    time.sleep(DELAI_ENTRE_PAGES)

print("----------------- FIN DU SCRAPING ! -----------------------------")

if ids_inseres:
    print("\n---------------------------- Lancement de l'audit de qualité des données... ---------------------------")
    with engine.connect() as conn:
        id_list = tuple(ids_inseres)
        if len(id_list) == 1: id_list = f"({id_list[0]})"
            
        if args.category == 'cars':
            audit_query = text(f"SELECT COUNT(*) FROM car_details WHERE id_annonce IN {id_list} AND annee_modele IS NULL")
            total = len(ids_inseres)
            null_count = conn.execute(audit_query).scalar()
            null_percentage = (null_count / total) * 100
            print(f" {null_percentage:.1f}% des nouvelles voitures n'ont pas d'année.")
            if null_percentage > 50: raise Exception("🚨 ALERTE: Structure HTML modifiée (Cars).")

        elif args.category == 'real_estate':
            audit_query = text(f"SELECT COUNT(*) FROM estate_details WHERE id_annonce IN {id_list} AND chambres IS NULL")
            total = len(ids_inseres)
            null_count = conn.execute(audit_query).scalar()
            null_percentage = (null_count / total) * 100
            print(f" {null_percentage:.1f}% des nouveaux appartements n'ont pas de chambres.")
            if null_percentage > 50: raise Exception("🚨 ALERTE: Structure HTML modifiée (Immo).")

        elif args.category == 'motos':
            audit_query = text(f"SELECT COUNT(*) FROM moto_details WHERE id_annonce IN {id_list} AND annee_modele IS NULL")
            total = len(ids_inseres)
            null_count = conn.execute(audit_query).scalar()
            null_percentage = (null_count / total) * 100
            print(f" {null_percentage:.1f}% des nouvelles motos n'ont pas d'année.")
            if null_percentage > 50: raise Exception("🚨 ALERTE: Structure HTML modifiée (Motos).")