import os
import pandas as pd
from dotenv import load_dotenv
from google import genai

# On charge le fichier .env
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")

# ==========================================
# 1. DATA FACTICE (Mock Data pour le Test)
# ==========================================
data = [
    {"id": 1, "marque": "Renault", "modele": "Clio 4", "anneeModele": 2019, "prix": 105000, "ville": "Casablanca"},
    {"id": 2, "marque": "Renault", "modele": "Clio 4", "anneeModele": 2019, "prix": 110000, "ville": "Rabat"},
    {"id": 3, "marque": "Renault", "modele": "Clio 4", "anneeModele": 2019, "prix": 70000,  "ville": "Laayoune"}, # 🚨 HMIZA !
    {"id": 4, "marque": "Renault", "modele": "Clio 4", "anneeModele": 2019, "prix": 108000, "ville": "Agadir"},
    {"id": 5, "marque": "Renault", "modele": "Clio 4", "anneeModele": 2019, "prix": 112000, "ville": "Tanger"}
]

df = pd.DataFrame(data)
print("📊 Data de Test (Pandas) :")
print(df.to_string(index=False))
print("-" * 50)

# ==========================================
# 2. CALCUL DES ANOMALIES (Le Cerveau Pandas)
# ==========================================
prix_median = df['prix'].median()
print(f"🧠 Prix Médian calculé du marché : {prix_median} DH")

df['ecart_pourcentage'] = ((df['prix'] - prix_median) / prix_median) * 100
hmizas = df[df['ecart_pourcentage'] <= -20]

print("-" * 50)
print(f"🎯 HMIZAS DÉTECTÉES ({len(hmizas)}) :")
print(hmizas[['ville', 'prix', 'ecart_pourcentage']].to_string(index=False))
print("-" * 50)

# ==========================================
# 3. GÉNÉRATION DES INSIGHTS (Gemini AI RAG)
# ==========================================
if gemini_api_key:
    # Nouvelle méthode d'initialisation de l'API Gemini
    client = genai.Client(api_key=gemini_api_key)

    if not hmizas.empty:
        hmiza_test = hmizas.iloc[0]

        prompt = f"""
        Tu es un expert automobile au Maroc. Analyse cette opportunité trouvée sur le marché :
        - Véhicule : {hmiza_test['marque']} {hmiza_test['modele']} ({hmiza_test['anneeModele']})
        - Prix demandé : {hmiza_test['prix']} DH
        - Prix médian du marché : {prix_median} DH
        - Écart : {abs(round(hmiza_test['ecart_pourcentage']))}% moins cher.
        - Ville : {hmiza_test['ville']}
        
        Rédige un "Market Insight" très court, professionnel et percutant (2 à 3 phrases maximum).
        Il doit expliquer pourquoi c'est une excellente affaire pour un investisseur. Parle en français.
        """

        print("🤖 Envoi des données à Gemini pour rédaction de l'Insight...")
        try:
            # Nouvelle méthode pour appeler le modèle
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            print("\n✨ RÉPONSE DE GEMINI :")
            print(">" * 20)
            print(response.text.strip())
            print("<" * 20)
        except Exception as e:
            print(f"❌ Erreur avec Gemini : {e}")
else:
    print("⚠️ Attention : GEMINI_API_KEY est introuvable dans le fichier .env !")