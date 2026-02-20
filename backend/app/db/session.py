"""
app/db/session.py — SQLAlchemy engine, session factory, and DB dependency.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database stored at backend/finguard.db
DATABASE_URL = "sqlite:///./finguard.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # required for SQLite + FastAPI
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency: yields a DB session and ensures it is closed after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
