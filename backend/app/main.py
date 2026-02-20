from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.orm import Session

from ml.predict import predict_fraud
from app.db.session import engine, get_db, Base
from app.models.transaction import Transaction           # noqa: F401 — registers model
from app.schemas.transaction import TransactionResponse
from app.services.transaction import save_transaction, get_all_transactions, block_transaction


# ── Startup ────────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

    # SQLite migration: add `status` column if it was added after initial creation
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE transactions ADD COLUMN status VARCHAR DEFAULT 'ACTIVE'"))
            conn.commit()
        except Exception:
            pass  # Column already exists — safe to ignore

    yield


# ── App ────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="FinGuard AI",
    description="Financial Guardian AI Backend",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ────────────────────────────────────────────────────────────────────

class TransactionInput(BaseModel):
    amount: float = Field(..., gt=0, description="Transaction amount in USD")
    time: float   = Field(..., ge=0, le=23, description="Hour of day (0-23)")


# ── Endpoints ──────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "Backend running"}


@app.post("/predict", tags=["Fraud Detection"])
async def predict(transaction: TransactionInput, db: Session = Depends(get_db)):
    """Predict whether a transaction is fraudulent and store the result."""
    result = predict_fraud(
        amount=transaction.amount,
        time=transaction.time,
    )
    save_transaction(
        db=db,
        amount=transaction.amount,
        time=transaction.time,
        prediction=result["prediction"],
        risk_score=result["risk_score"],
    )
    return result


@app.get("/transactions", response_model=list[TransactionResponse], tags=["History"])
async def get_transactions(db: Session = Depends(get_db)):
    """Return all stored transactions, most recent first."""
    return get_all_transactions(db)


@app.patch("/transactions/{transaction_id}/block", response_model=TransactionResponse, tags=["Actions"])
async def block_transaction_endpoint(transaction_id: int, db: Session = Depends(get_db)):
    """Block a fraudulent transaction by ID."""
    record = block_transaction(db, transaction_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Transaction {transaction_id} not found")
    return record
