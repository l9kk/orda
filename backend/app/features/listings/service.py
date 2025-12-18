from sqlalchemy.orm import Session, joinedload
from typing import Optional
from fastapi import HTTPException
from . import models, schemas
from .factory import ListingFactory
from .strategies import (
    SortContext,
    PriceSortStrategy,
    DateSortStrategy,
    LocationSortStrategy,
)
from app.features.notifications.models import Subscription
from app.features.notifications.observer import NotificationService, StudentObserver
from app.features.users.proxy import UserDetailProxy, RealUserDetail
from app.features.users.models import User

class ListingService:
    @staticmethod
    def create_listing(db: Session, listing_in: schemas.ListingCreate, current_user: User):
        try:
            # Use the Factory to create the listing object
            listing_data = listing_in.model_dump(exclude={"category"})
            listing_data["owner_id"] = current_user.id

            new_listing = ListingFactory.create_listing(
                category=listing_in.category, **listing_data
            )

            db.add(new_listing)
            db.commit()
            db.refresh(new_listing)

            # OBSERVER: Check for matching subscriptions and notify
            ListingService._notify_subscribers(db, new_listing)

            return new_listing
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def _notify_subscribers(db: Session, listing: models.Listing):
        subscriptions = db.query(Subscription).all()
        notification_service = NotificationService()

        for sub in subscriptions:
            if (
                sub.keyword.lower() in listing.title.lower()
                or sub.keyword.lower() in (listing.description or "").lower()
            ):
                observer = StudentObserver(
                    user_id=sub.user_id, student_name=sub.student_name, db=db
                )
                notification_service.attach(observer)

        notification_service.notify(listing.title)

    @staticmethod
    def get_listings(
        db: Session, 
        sort_by: Optional[str] = None, 
        owner_id: Optional[int] = None,
        current_user_id: Optional[int] = None
    ):
        query = db.query(models.Listing).options(joinedload(models.Listing.owner))
        if owner_id:
            query = query.filter(models.Listing.owner_id == owner_id)

        listings = query.all()

        if sort_by:
            # STRATEGY
            strategy = None
            if sort_by == "price":
                strategy = PriceSortStrategy()
            elif sort_by == "date":
                strategy = DateSortStrategy()
            elif sort_by == "location":
                strategy = LocationSortStrategy()
            
            if strategy:
                context = SortContext(strategy)
                listings = context.execute_sort(listings)

        # PROXY: Apply proxy for contact info
        for listing in listings:
            ListingService._apply_contact_proxy(listing, current_user_id)

        return listings

    @staticmethod
    def get_listing_by_id(db: Session, listing_id: int, current_user_id: Optional[int] = None):
        listing = db.query(models.Listing).options(joinedload(models.Listing.owner)).filter(models.Listing.id == listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        ListingService._apply_contact_proxy(listing, current_user_id)
        return listing

    @staticmethod
    def _apply_contact_proxy(listing: models.Listing, current_user_id: Optional[int]):
        owner = listing.owner
        if owner:
            real_detail = RealUserDetail(
                email=owner.email, phone=owner.phone, telegram=owner.telegram
            )
            proxy = UserDetailProxy(
                real_user_detail=real_detail,
                current_user_id=current_user_id,
                target_user_id=owner.id,
            )
            listing.contact_info = proxy.get_contact_info()
        else:
            listing.contact_info = "Contact info unavailable"
