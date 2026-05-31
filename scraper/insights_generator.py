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
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8080/api/v1/insights")

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
    import time # Nzido time bach n3tiw nfs l-Gemini bin kol requete

    if gemini_api_key:
        client = genai.Client(api_key=gemini_api_key)

        # 🌟 L-7el: Nakhdo Top 5 dyal l-hmizat (les plus rentables)
        top_hmizas = hmizas.sort_values(by='ecart_pourcentage').head(5)

        print(f"\n🚀 Lancement du traitement pour les {len(top_hmizas)} meilleures Hmizas...")

        # 🌟 L-Boucle li kador 3la kol hmiza
        for index, hmiza in top_hmizas.iterrows():
            prompt = f"""
            Tu es un expert automobile au Maroc. Analyse cette opportunité réelle :
            - Véhicule : {hmiza['marque']} {hmiza['modele']} ({hmiza['annee_modele']})
            - Prix : {hmiza['prix']} DH (Médiane: {hmiza['prix_median']} DH)
            - Écart : {abs(round(hmiza['ecart_pourcentage']))}% moins cher.
            - Ville : {hmiza['ville']}
            
            Rédige une description très courte et percutante (1 phrases max) pour un investisseur. Parle en français.
            """

            print(f"\n🤖 Envoi de la {hmiza['marque']} {hmiza['modele']} à Gemini...")
            try:
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt
                )
                texte_insight = response.text.strip()
                print(f"✨ INSIGHT GÉNÉRÉ : {texte_insight[:50]}...") # Kan-affichiw ghir chwya bach mayt3mrch l-terminal

                insight_payload = {
                    "pourcentage": f"-{abs(int(hmiza['ecart_pourcentage']))}%",
                    "titreRapide": f"Hmiza : {hmiza['marque']} {hmiza['modele']}",
                    "description": texte_insight,
                    "categorie": "Auto"
                }

                res = requests.post(API_BASE_URL, json=insight_payload)

                if res.status_code == 201:
                    print("✅ Sauvegardé avec succès dans PostgreSQL !")
                else:
                    print(f"❌ Erreur Spring Boot (Statut {res.status_code}) : {res.text}")
                time.sleep(2)

            except Exception as e:
                print(f"❌ Erreur (Gemini ou Réseau) pour la {hmiza['marque']} : {e}")
    else:
        print("⚠️ Clé GEMINI_API_KEY introuvable !")