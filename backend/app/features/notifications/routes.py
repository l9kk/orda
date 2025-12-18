from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from . import schemas, models
from app.core.auth import get_current_user
from app.features.users.models import User

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.post("/", response_model=schemas.SubscriptionResponse)
def create_subscription(
    subscription: schemas.SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Use current_user.id and email for the subscription
    db_subscription = models.Subscription(
        user_id=current_user.id,
        keyword=subscription.keyword,
        student_name=current_user.email,
    )
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription


@router.get("/", response_model=List[schemas.SubscriptionResponse])
def get_subscriptions(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return (
        db.query(models.Subscription)
        .filter(models.Subscription.user_id == current_user.id)
        .all()
    )


@router.get("/notifications", response_model=List[schemas.NotificationResponse])
def get_notifications(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return (
        db.query(models.Notification)
        .filter(models.Notification.user_id == current_user.id)
        .order_by(models.Notification.created_at.desc())
        .all()
    )


@router.post("/notifications/{notification_id}/read")
def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notification = (
        db.query(models.Notification)
        .filter(
            models.Notification.id == notification_id,
            models.Notification.user_id == current_user.id,
        )
        .first()
    )
    if notification:
        notification.is_read = True
        db.commit()
    return {"status": "success"}
