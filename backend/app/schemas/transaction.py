"""
app/schemas/transaction.py — Pydantic response schema for transaction records.
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class TransactionResponse(BaseModel):
    id:         int
    amount:     float
    time:       float
    prediction: str
    risk_score: float
    status:     str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
