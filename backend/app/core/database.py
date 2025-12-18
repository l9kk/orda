from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

#SINGLETON
#The engine and sessionmaker are created once and shared across the app.
engine = create_engine(settings.DATABASE_URL)
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
