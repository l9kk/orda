from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from . import schemas
from .service import NotificationService
from app.core.auth import get_current_user
from app.features.users.models import User

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.post("/", response_model=schemas.SubscriptionResponse)
def create_subscription(
    subscription: schemas.SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return NotificationService.create_subscription(db, subscription, current_user)


@router.get("/", response_model=List[schemas.SubscriptionResponse])
def get_subscriptions(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return NotificationService.get_subscriptions(db, current_user.id)


@router.get("/notifications", response_model=List[schemas.NotificationResponse])
def get_notifications(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return NotificationService.get_notifications(db, current_user.id)


@router.post("/notifications/{notification_id}/read")
def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return NotificationService.mark_as_read(db, current_user.id, notification_id)


@router.post("/notifications/read-all")
def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return NotificationService.mark_all_as_read(db, current_user.id)
