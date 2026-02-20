"""
app/models/transaction.py — SQLAlchemy ORM model for the transactions table.
"""

from datetime import datetime

from sqlalchemy import Column, Integer, Float, String, DateTime

from app.db.session import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    amount      = Column(Float, nullable=False)
    time        = Column(Float, nullable=False)
    prediction  = Column(String, nullable=False)   # "FRAUD" or "NORMAL"
    risk_score  = Column(Float, nullable=False)
    status      = Column(String, nullable=False, default="ACTIVE")  # "ACTIVE" or "BLOCKED"
    created_at  = Column(DateTime, default=datetime.utcnow, nullable=False)
