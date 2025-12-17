from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from . import schemas, models
from .factory import ListingFactory
from .strategies import SortContext, PriceSortStrategy, DateSortStrategy
from app.features.notifications.models import Subscription
from app.features.notifications.observer import NotificationService, StudentObserver
from app.features.users.proxy import UserDetailProxy, RealUserDetail

router = APIRouter(prefix="/listings", tags=["listings"])

@router.post("/", response_model=schemas.ListingResponse)
def create_listing(listing: schemas.ListingCreate, db: Session = Depends(get_db)):
    try:
        # Use the Factory to create the listing object
        # #FACTORY
        new_listing = ListingFactory.create_listing(
            category=listing.category,
            **listing.model_dump(exclude={"category"})
        )
        
        db.add(new_listing)
        db.commit()
        db.refresh(new_listing)
        
        # #OBSERVER
        # Check for matching subscriptions and notify
        subscriptions = db.query(Subscription).all()
        notification_service = NotificationService()
        
        for sub in subscriptions:
            if sub.keyword.lower() in new_listing.title.lower() or sub.keyword.lower() in (new_listing.description or "").lower():
                observer = StudentObserver(sub.student_name)
                notification_service.attach(observer)
        
        notification_service.notify(new_listing.title)
        
        return new_listing
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[schemas.ListingResponse])
def get_listings(
    sort_by: Optional[str] = Query(None, enum=["price", "date"]),
    is_authenticated: bool = Header(False, alias="X-Authenticated"),
    db: Session = Depends(get_db)
):
    listings = db.query(models.Listing).all()
    
    if sort_by:
        # #STRATEGY
        if sort_by == "price":
            strategy = PriceSortStrategy()
        elif sort_by == "date":
            strategy = DateSortStrategy()
        else:
            return listings
            
        context = SortContext(strategy)
        listings = context.execute_sort(listings)
    
    # #PROXY
    # Apply proxy for contact info
    # For simulation, we'll use dummy contact info
    for listing in listings:
        real_detail = RealUserDetail(phone="+77001234567", telegram="@sdu_student")
        proxy = UserDetailProxy(real_detail, is_authenticated)
        listing.contact_info = proxy.get_contact_info()
        
    return listings
