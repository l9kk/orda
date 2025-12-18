from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from . import schemas
from .service import ListingService
from app.core.auth import get_current_user, get_optional_current_user
from app.features.users.models import User

router = APIRouter(prefix="/listings", tags=["listings"])


@router.post("/", response_model=schemas.ListingResponse)
def create_listing(
    listing: schemas.ListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ListingService.create_listing(db, listing, current_user)


@router.get("/", response_model=List[schemas.ListingResponse])
def get_listings(
    sort_by: Optional[str] = Query(None, enum=["price", "date", "location"]),
    owner_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    return ListingService.get_listings(
        db, sort_by, owner_id, current_user.id if current_user else None
    )


@router.get("/{listing_id}", response_model=schemas.ListingResponse)
def get_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    return ListingService.get_listing_by_id(
        db, listing_id, current_user.id if current_user else None
    )
