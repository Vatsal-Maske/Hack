"""
app/services/transaction.py — Business logic for saving and retrieving transactions.
"""

from sqlalchemy.orm import Session

from app.models.transaction import Transaction


def save_transaction(
    db: Session,
    amount: float,
    time: float,
    prediction: str,
    risk_score: float,
) -> Transaction:
    """Persist a new transaction record and return it."""
    record = Transaction(
        amount=amount,
        time=time,
        prediction=prediction,
        risk_score=risk_score,
        status="ACTIVE",
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_all_transactions(db: Session) -> list[Transaction]:
    """Return all transactions ordered by most-recent first."""
    return (
        db.query(Transaction)
        .order_by(Transaction.created_at.desc())
        .all()
    )


def block_transaction(db: Session, transaction_id: int) -> Transaction | None:
    """Set a transaction's status to BLOCKED. Returns None if not found."""
    record = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if record is None:
        return None
    record.status = "BLOCKED"
    db.commit()
    db.refresh(record)
    return record
