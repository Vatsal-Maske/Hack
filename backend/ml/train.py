"""
train.py — Generate synthetic data and train the IsolationForest fraud detection model.
Run this once from the backend/ directory:
    python ml/train.py
"""

import os
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib

# ── Reproducibility ────────────────────────────────────────────────────────────
RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

# ── Synthetic Data Generation ──────────────────────────────────────────────────

# Normal transactions: small/medium amounts, typical daytime hours (8-20)
n_normal = 1000
normal_data = pd.DataFrame({
    "amount": np.random.uniform(1, 500, n_normal),
    "time":   np.random.uniform(8, 20, n_normal),
})

# Fraud transactions: very high amounts, late-night hours (0-5)
n_fraud = 50
fraud_data = pd.DataFrame({
    "amount": np.random.uniform(5000, 20000, n_fraud),
    "time":   np.random.uniform(0, 5, n_fraud),
})

# Combine
df = pd.concat([normal_data, fraud_data], ignore_index=True)
X = df[["amount", "time"]].values

# ── Preprocessing ──────────────────────────────────────────────────────────────
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ── Model Training ─────────────────────────────────────────────────────────────
model = IsolationForest(contamination=0.02, random_state=RANDOM_SEED)
model.fit(X_scaled)

# ── Save Artifacts ─────────────────────────────────────────────────────────────
ml_dir = os.path.dirname(os.path.abspath(__file__))
joblib.dump(model,  os.path.join(ml_dir, "model.pkl"))
joblib.dump(scaler, os.path.join(ml_dir, "scaler.pkl"))

print("Model trained successfully")
print(f"  model.pkl  → {os.path.join(ml_dir, 'model.pkl')}")
print(f"  scaler.pkl → {os.path.join(ml_dir, 'scaler.pkl')}")
