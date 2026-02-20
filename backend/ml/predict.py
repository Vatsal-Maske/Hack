"""
predict.py — Load trained model and expose predict_fraud().
"""

import os
import numpy as np
import joblib

# ── Load model artifacts at import time ────────────────────────────────────────
_ml_dir = os.path.dirname(os.path.abspath(__file__))
_model_path  = os.path.join(_ml_dir, "model.pkl")
_scaler_path = os.path.join(_ml_dir, "scaler.pkl")

try:
    _model  = joblib.load(_model_path)
    _scaler = joblib.load(_scaler_path)
except FileNotFoundError as e:
    raise RuntimeError(
        "Model artifacts not found. Please run `python ml/train.py` first."
    ) from e


def predict_fraud(amount: float, time: float) -> dict:
    """
    Predict whether a transaction is fraudulent.

    Args:
        amount: Transaction amount in USD.
        time:   Hour of the day (0–23).

    Returns:
        {
            "prediction": "FRAUD" or "NORMAL",
            "risk_score": float  (higher = more suspicious)
        }
    """
    features = np.array([[amount, time]])
    features_scaled = _scaler.transform(features)

    # IsolationForest: -1 = anomaly (fraud), 1 = normal
    raw_prediction = _model.predict(features_scaled)[0]

    # score_samples returns negative anomaly scores; negate so higher = riskier
    anomaly_score   = _model.score_samples(features_scaled)[0]
    risk_score      = float(-anomaly_score)  # positive, higher means more fraud-like

    prediction = "FRAUD" if raw_prediction == -1 else "NORMAL"

    return {
        "prediction": prediction,
        "risk_score": round(risk_score, 4),
    }
