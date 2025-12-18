from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from . import schemas, models
from .factory import ListingFactory
from .strategies import SortContext, PriceSortStrategy, DateSortStrategy, LocationSortStrategy
from app.features.notifications.models import Subscription
from app.features.notifications.observer import NotificationService, StudentObserver
from app.features.users.proxy import UserDetailProxy, RealUserDetail
from app.core.auth import get_current_user, get_optional_current_user
from app.features.users.models import User

router = APIRouter(prefix="/listings", tags=["listings"])

#DECORATOR
#FastAPI uses decorators to wrap functions with routing and validation logic.
@router.post("/", response_model=schemas.ListingResponse)
def create_listing(
    listing: schemas.ListingCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Use the Factory to create the listing object
        #FACTORY
        listing_data = listing.model_dump(exclude={"category"})
        listing_data["owner_id"] = current_user.id
        
        new_listing = ListingFactory.create_listing(
            category=listing.category,
            **listing_data
        )
        
        db.add(new_listing)
        db.commit()
        db.refresh(new_listing)
        
        #OBSERVER
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

#DECORATOR
@router.get("/", response_model=List[schemas.ListingResponse])
def get_listings(
    sort_by: Optional[str] = Query(None, enum=["price", "date", "location"]),
    owner_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    query = db.query(models.Listing)
    if owner_id:
        query = query.filter(models.Listing.owner_id == owner_id)
    
    listings = query.all()
    
    if sort_by:
        #STRATEGY
        if sort_by == "price":
            strategy = PriceSortStrategy()
        elif sort_by == "date":
            strategy = DateSortStrategy()
        elif sort_by == "location":
            strategy = LocationSortStrategy()
        else:
            return listings
            
        context = SortContext(strategy)
        listings = context.execute_sort(listings)
    
    #PROXY
    # Apply proxy for contact info
    for listing in listings:
        # Fetch owner details for the proxy
        owner = db.query(User).filter(User.id == listing.owner_id).first()
        if owner:
            real_detail = RealUserDetail(
                email=owner.email,
                phone=owner.phone,
                telegram=owner.telegram
            )
            proxy = UserDetailProxy(
                real_user_detail=real_detail,
                current_user_id=current_user.id if current_user else None,
                target_user_id=owner.id
            )
            listing.contact_info = proxy.get_contact_info()
        else:
            listing.contact_info = "[UNKNOWN OWNER]"
        
    return listings
