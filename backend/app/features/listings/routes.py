from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from . import schemas, models
from .factory import ListingFactory

router = APIRouter(prefix="/listings", tags=["listings"])

@router.post("/", response_model=schemas.ListingResponse)
def create_listing(listing: schemas.ListingCreate, db: Session = Depends(get_db)):
    try:
        # Use the Factory to create the listing object
        # FACTORY
        new_listing = ListingFactory.create_listing(
            category=listing.category,
            **listing.model_dump(exclude={"category"})
        )
        
        db.add(new_listing)
        db.commit()
        db.refresh(new_listing)
        return new_listing
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[schemas.ListingResponse])
def get_listings(db: Session = Depends(get_db)):
    return db.query(models.Listing).all()
