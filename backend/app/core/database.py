from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://orda_user:orda_password@localhost:5432/orda_db"
)

# #SINGLETON
# The engine and sessionmaker are created once and shared across the app.
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    """
    #ITERATOR
    Uses the yield keyword to provide a database session as an iterator.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
