from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import re
import os

app = FastAPI()

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LOAD MODEL ARTIFACTS ---
# We load these once when the server starts
try:
    model = joblib.load("svm_tfidf_sarcasm_model.pkl")
    vectorizer = joblib.load("tfidf_vectorizer.pkl")
    print("✅ Model and Vectorizer loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None
    vectorizer = None

# --- PREPROCESSING FUNCTION ---
# Must match EXACTLY what you did in training (minus the heavy POS tagging for speed)
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'[^a-z\s]', '', text)
    return text.strip()

class InputText(BaseModel):
    headline: str

@app.get("/")
def health_check():
    return {"status": "online", "model_loaded": model is not None}

@app.post("/predict")
def predict_sarcasm(data: InputText):
    if not model or not vectorizer:
        raise HTTPException(status_code=500, detail="Model not initialized")
    
    # 1. Clean
    cleaned = clean_text(data.headline)
    
    # 2. Vectorize
    # Note: We use .transform(), NOT .fit_transform()
    vec = vectorizer.transform([cleaned])
    
    # 3. Predict
    prediction = model.predict(vec)[0]  # 0 or 1
    
    # 4. Get Probability (Confidence Score)
    # LinearSVC doesn't support predict_proba by default unless calibrated.
    # If your model crashes here, use decision_function instead.
    try:
        prob = model.predict_proba(vec)[0]
        confidence = max(prob)
    except:
        # Fallback for SVM: Use distance from margin as a proxy for confidence
        score = model.decision_function(vec)[0]
        confidence = min(abs(score), 1.0) # Cap at 1.0 for simplicity

    return {
        "is_sarcastic": int(prediction),
        "label": "Sarcastic" if prediction == 1 else "Genuine",
        "confidence": float(confidence)
    }