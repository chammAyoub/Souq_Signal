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
# 3. INTELLIGENCE ARTIFICIELLE : PANDAS (Mode Réel)
# ==========================================
print("\n🧹 Nettoyage des données...")
df_voitures = df_voitures[df_voitures['prix'] > 20000]
fausses_marques = ['location', 'offre', 'vélo', 'quad', 'neuf', 'meilleur', 'meilleurs']
df_voitures = df_voitures[~df_voitures['marque'].str.lower().isin(fausses_marques)]

print("🧠 Analyse des données et recherche de Hmizas réelles...")

# 🌟 LE VRAI CERVEAU : On calcule la médiane pour chaque modèle et année spécifiques
df_voitures['prix_median'] = df_voitures.groupby(['marque', 'modele', 'annee_modele'])['prix'].transform('median')

# On calcule le vrai écart en pourcentage
df_voitures['ecart_pourcentage'] = ((df_voitures['prix'] - df_voitures['prix_median']) / df_voitures['prix_median']) * 100

# On cherche les VRAIES Hmizas (au moins 15% moins chères que le marché)
hmizas = df_voitures[(df_voitures['ecart_pourcentage'] <= -7) & (df_voitures['prix'] != df_voitures['prix_median'])]

if hmizas.empty:
    print("🤷‍♂️ Aucune Hmiza réelle détectée pour le moment.")
    print("💡 Le Bot a besoin de scraper plus de données pour comparer les prix d'un même modèle.")
else:
    print("-" * 50)
    print(f"🎯 {len(hmizas)} VRAIES HMIZAS DÉTECTÉES !")
    print("-" * 50)

    # ==========================================
    # 4. INTELLIGENCE ARTIFICIELLE : GEMINI ET SPRING BOOT
    # ==========================================
    import requests

    if gemini_api_key:
        client = genai.Client(api_key=gemini_api_key)

        # On prend la meilleure Hmiza (celle avec le plus grand écart négatif)
        top_hmiza = hmizas.sort_values(by='ecart_pourcentage').iloc[0]

        prompt = f"""
        Tu es un expert automobile au Maroc. Analyse cette opportunité réelle :
        - Véhicule : {top_hmiza['marque']} {top_hmiza['modele']} ({top_hmiza['annee_modele']})
        - Prix : {top_hmiza['prix']} DH (Médiane: {top_hmiza['prix_median']} DH)
        - Écart : {abs(round(top_hmiza['ecart_pourcentage']))}% moins cher.
        - Ville : {top_hmiza['ville']}
        
        Rédige une description très courte et percutante (2 phrases max) pour un investisseur. Parle en français.
        """

        print(f"\n🤖 Envoi de la {top_hmiza['marque']} {top_hmiza['modele']} à Gemini...")
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            texte_insight = response.text.strip()
            print("\n✨ INSIGHT GÉNÉRÉ :")
            print(">" * 20)
            print(texte_insight)
            print("<" * 20)

            print("\n🚀 Sauvegarde de l'Insight dans Spring Boot...")
            insight_payload = {
                "pourcentage": f"-{abs(int(top_hmiza['ecart_pourcentage']))}%",
                "titreRapide": f"Hmiza : {top_hmiza['marque']} {top_hmiza['modele']}",
                "description": texte_insight,
                "categorie": "Auto"
            }

            api_url = "http://localhost:8080/api/v1/insights"
            res = requests.post(api_url, json=insight_payload)

            if res.status_code == 201:
                print("✅ BINGO ! L'Insight a été sauvegardé avec succès dans PostgreSQL !")
            else:
                print(f"❌ Erreur Spring Boot (Statut {res.status_code}) : {res.text}")

        except Exception as e:
            print(f"❌ Erreur (Gemini ou Réseau) : {e}")
    else:
        print("⚠️ Clé GEMINI_API_KEY introuvable !")