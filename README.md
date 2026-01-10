# Being Sarcastic  
### NLP-Based Sarcasm Detection for News Headlines

**Being Sarcastic** is an end-to-end Natural Language Processing (NLP) application that detects sarcasm in short news headlines using supervised machine learning techniques.  
This project was developed as part of a **Master of Science in Artificial Intelligence (NLP module)** and focuses on **interpretability, comparative evaluation, and bias awareness**, rather than relying on opaque, black-box models.

---

## Project Overview

Sarcasm is a challenging NLP problem because the literal meaning of a sentence often contradicts the intended meaning.  
This project explores whether **classical NLP models**, when carefully engineered and evaluated, can effectively detect sarcasm in short texts such as news headlines.

The system:
- Trains and compares multiple supervised learning models
- Evaluates different text representations (statistical vs semantic)
- Provides real-time predictions through a web-based interface
- Explicitly documents model failures and dataset bias

---

## Key Concepts Covered

- Text preprocessing and POS-aware lemmatization  
- Feature engineering using **TF-IDF with n-grams**  
- Semantic representation using **Word2Vec embeddings**  
- Supervised text classification  
- Hyperparameter tuning with cross-validation  
- Model interpretability and bias analysis  

---

## Dataset

The project uses the **Sarcasm Headlines Dataset**, consisting of:
- Sarcastic headlines sourced from *The Onion*
- Genuine headlines sourced from *HuffPost*

Each record contains:
- A news headline  
- A binary label indicating whether the headline is sarcastic  

This dataset was selected because sarcasm is implicit and not marked by hashtags or emojis, forcing models to learn subtle linguistic cues.

---

## Models Implemented

The following models are trained and evaluated under identical conditions:

- **Naïve Bayes** (baseline probabilistic classifier)  
- **Logistic Regression**  
- **Support Vector Machine (Linear SVM)**  
- **Deep Learning – Multi-Layer Perceptron (MLP)**  

After hyperparameter tuning, the **Linear SVM with TF-IDF features** achieved the best balance between accuracy and stability for headline-length text.

---

## Feature Representations

Two contrasting approaches are evaluated:

### 1. TF-IDF with N-Grams
- Unigrams and bigrams
- Sparse, interpretable representation
- Strong performance on short texts

### 2. Word2Vec Embeddings
- Dense semantic vectors
- Sentence representations created by averaging word vectors
- Useful for semantic similarity, but less effective for short sarcastic headlines

---

## Application Architecture

### Backend
- Built using **FastAPI**
- Handles preprocessing, feature extraction, and model inference
- Supports runtime model selection (SVM or Deep Learning)

### Frontend
- Built using **React**
- Allows users to input headlines and select classification models
- Displays predictions along with confidence scores

### Integration
- Frontend and backend communicate via JSON-based HTTP requests
- Clean separation between UI logic and NLP inference logic

---

## Bias & Failure Awareness

A key goal of this project is transparency.  
During testing, the model was observed to incorrectly classify certain genuine headlines as sarcastic (e.g., headlines containing the word *“NASA”*).  
This behaviour was traced back to **dataset bias**, where specific entities appeared more frequently in sarcastic examples.

Rather than hiding these cases, they are explicitly documented and surfaced in the application to highlight real-world NLP limitations.

---

## Academic Context

This project was developed for the module:

**CT052-3-M-NLP – Natural Language Processing**  
**Master of Science in Artificial Intelligence**  
Asia Pacific University of Technology & Innovation, Kuala Lumpur

The emphasis is on:
- Understanding how models work  
- Evaluating trade-offs between approaches  
- Analysing why and how models fail  

---

## Author

**Rohan Mazumdar**  
MSc Artificial Intelligence  
Asia Pacific University of Technology & Innovation
