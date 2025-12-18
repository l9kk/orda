from sqlalchemy import String, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from typing import Optional

class Listing(Base):
    """
    #TEMPLATE_METHOD
    Defines the skeleton of a listing in the database.
    Subclasses implement specific details (polymorphism).
    """
    __tablename__ = "listings"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    category: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String)
    
    __mapper_args__ = {
        "polymorphic_identity": "listing",
        "polymorphic_on": category,
    }

class BookListing(Listing):
    course_code: Mapped[Optional[str]] = mapped_column(String)
    isbn: Mapped[Optional[str]] = mapped_column(String)
    
    __mapper_args__ = {
        "polymorphic_identity": "textbook",
    }

class DormItemListing(Listing):
    item_type: Mapped[Optional[str]] = mapped_column(String) # Electronics, Furniture
    
    __mapper_args__ = {
        "polymorphic_identity": "dorm",
    }

class RideSharingListing(Listing):
    origin: Mapped[Optional[str]] = mapped_column(String)
    destination: Mapped[Optional[str]] = mapped_column(String)
    
    __mapper_args__ = {
        "polymorphic_identity": "ride",
    }
