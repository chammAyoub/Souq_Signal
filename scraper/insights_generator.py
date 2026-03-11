import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
from google import genai

# ==========================================
# 1. INITIALISATION & VARIABLES
# ==========================================
load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")
gemini_api_key = os.getenv("GEMINI_API_KEY")

print("🚀 Démarrage du Générateur d'Insights...")

# ==========================================
# 2. CONNEXION POSTGRESQL & EXTRACTION
# ==========================================
try:
    connexion_string = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(connexion_string)
except Exception as e:
    print(f"❌ Erreur SQLAlchemy : {e}")
    exit()

try:
    print("🕵️‍♂️ Récupération des données depuis PostgreSQL...")
    requete_sql = """
        SELECT c.id_annonce, c.marque, c.modele, c.annee_modele, a.prix, a.ville 
        FROM car_details c
        INNER JOIN annonce_base a ON c.id_annonce = a.id_annoce
    """
    df_voitures = pd.read_sql(requete_sql, engine)

    if df_voitures.empty:
        print("⚠️ La base de données est vide. Lance le scraper d'abord !")
        exit()
    else:
        print(f"✅ BINGO ! {len(df_voitures)} voitures récupérées.")

except Exception as e:
    print(f"❌ Erreur SQL : {e}")
    exit()

# ==========================================
# 3. INTELLIGENCE ARTIFICIELLE : PANDAS
# ==========================================
print("\n🧹 Nettoyage des données (Suppression des locations et faux prix)...")
# On supprime tout ce qui est en dessous de 20 000 DH (Locations, Vélos, Traites mensuelles)
df_voitures = df_voitures[df_voitures['prix'] > 20000]

# On supprime les fausses marques détectées
fausses_marques = ['location', 'offre', 'vélo', 'quad', 'neuf', 'meilleur', 'meilleurs']
df_voitures = df_voitures[~df_voitures['marque'].str.lower().isin(fausses_marques)]

print("🧠 Analyse des données et recherche de Hmizat...")

# On calcule le prix médian
df_voitures['prix_median'] = df_voitures.groupby(['marque', 'modele', 'annee_modele'])['prix'].transform('median')

# On calcule l'écart
df_voitures['ecart_pourcentage'] = ((df_voitures['prix'] - df_voitures['prix_median']) / df_voitures['prix_median']) * 100

# On cherche les Hmizas à -10% pour tester,
# et on s'assure qu'on ne compare pas une voiture toute seule (prix != prix_median)
hmizas = df_voitures[(df_voitures['ecart_pourcentage'] <= -10) & (df_voitures['prix'] != df_voitures['prix_median'])]

if hmizas.empty:
    print("🤷‍♂️ Aucune Hmiza détectée pour le moment.")
    print("💡 Astuce : Laisse le scraper tourner sur 20 pages pour avoir plus de Data !")
else:
    print("-" * 50)
    print(f"🎯 {len(hmizas)} HMIZAS DÉTECTÉES !")
    print(hmizas[['marque', 'modele', 'annee_modele', 'prix', 'prix_median', 'ecart_pourcentage']].to_string(index=False))
    print("-" * 50)

    # ==========================================
    # 4. INTELLIGENCE ARTIFICIELLE : GEMINI
    # ==========================================
    if gemini_api_key:
        client = genai.Client(api_key=gemini_api_key)

        # On prend la meilleure hmiza (celle avec le plus grand écart négatif)
        top_hmiza = hmizas.sort_values(by='ecart_pourcentage').iloc[0]

        prompt = f"""
        Tu es un expert automobile au Maroc. Analyse cette opportunité réelle tirée de la base de données :
        - Véhicule : {top_hmiza['marque']} {top_hmiza['modele']} ({top_hmiza['annee_modele']})
        - Prix demandé : {top_hmiza['prix']} DH
        - Prix médian du marché : {top_hmiza['prix_median']} DH
        - Écart : {abs(round(top_hmiza['ecart_pourcentage']))}% moins cher.
        - Ville : {top_hmiza['ville']}
        
        Rédige un "Market Insight" très court et percutant (2 phrases maximum) pour le Dashboard d'un investisseur. Parle en français.
        """

        print(f"\n🤖 Envoi de la {top_hmiza['marque']} {top_hmiza['modele']} à Gemini pour rédaction...")
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            print("\n✨ INSIGHT GÉNÉRÉ PAR L'IA :")
            print(">" * 20)
            print(response.text.strip())
            print("<" * 20)
        except Exception as e:
            print(f"❌ Erreur avec Gemini : {e}")
    else:
        print("⚠️ Clé GEMINI_API_KEY introuvable dans le fichier .env !")