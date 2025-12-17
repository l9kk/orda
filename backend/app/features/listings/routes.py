from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from . import schemas, models
from .factory import ListingFactory
from .strategies import SortContext, PriceSortStrategy, DateSortStrategy

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
def get_listings(
    sort_by: Optional[str] = Query(None, enum=["price", "date"]),
    db: Session = Depends(get_db)
):
    listings = db.query(models.Listing).all()
    
    if sort_by:
        # STRATEGY
        if sort_by == "price":
            strategy = PriceSortStrategy()
        elif sort_by == "date":
            strategy = DateSortStrategy()
        else:
            return listings
            
        context = SortContext(strategy)
        listings = context.execute_sort(listings)
        
    return listings
