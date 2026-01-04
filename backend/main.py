from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import re
import numpy as np
import os

# TensorFlow serves the DL model
# We hide TF logs to keep the terminal clean
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' 
import tensorflow as tf

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GLOBAL VARIABLES ---
svm_model = None
dl_model = None
vectorizer = None

# --- LOAD MODELS ON STARTUP ---
@app.on_event("startup")
def load_artifacts():
    global svm_model, dl_model, vectorizer
    try:
        # Load SVM & Vectorizer
        svm_model = joblib.load("svm_tfidf_sarcasm_model.pkl")
        vectorizer = joblib.load("tfidf_vectorizer.pkl")
        print("✅ SVM & Vectorizer loaded.")
        
        # Load Deep Learning Model
        # Note: We use compile=False to avoid needing custom metric definitions if any
        dl_model = tf.keras.models.load_model("dl_sarcasm_model.h5", compile=False)
        print("✅ Deep Learning Model loaded.")
        
    except Exception as e:
        print(f"❌ Critical Error loading models: {e}")

# --- PREPROCESSING ---
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'[^a-z\s]', '', text)
    return text.strip()

# --- INPUT SCHEMA ---
class InputPayload(BaseModel):
    headline: str
    model_type: str = "svm" # Options: "svm" or "dl"

@app.get("/")
def health_check():
    return {
        "status": "online",
        "svm_loaded": svm_model is not None,
        "dl_loaded": dl_model is not None
    }

@app.post("/predict")
def predict_sarcasm(data: InputPayload):
    if not vectorizer:
        raise HTTPException(status_code=500, detail="Vectorizer not initialized")

    # 1. Clean
    cleaned = clean_text(data.headline)
    
    # 2. Vectorize (Sparse Matrix)
    vec_sparse = vectorizer.transform([cleaned])
    
    # 3. Predict based on Model Type
    prediction = 0
    confidence = 0.0
    
    if data.model_type == "dl":
        if not dl_model:
            raise HTTPException(status_code=500, detail="DL Model not available")
        
        # DL needs a Dense Array, not Sparse
        vec_dense = vec_sparse.toarray()
        
        # Predict (Returns a float between 0 and 1)
        prob = dl_model.predict(vec_dense, verbose=0)[0][0]
        
        prediction = 1 if prob > 0.5 else 0
        confidence = prob if prediction == 1 else (1 - prob)
        
    else: # Default to SVM
        if not svm_model:
            raise HTTPException(status_code=500, detail="SVM Model not available")
            
        prediction = svm_model.predict(vec_sparse)[0]
        
        # Estimate confidence for SVM
        try:
            score = svm_model.decision_function(vec_sparse)[0]
            confidence = min(abs(score), 1.0) # Simple scaling for display
        except:
            confidence = 0.85 # Fallback

    return {
        "model_used": "Deep Learning (ANN)" if data.model_type == "dl" else "SVM (Linear)",
        "is_sarcastic": int(prediction),
        "label": "Sarcastic" if prediction == 1 else "Genuine",
        "confidence": float(confidence)
    }