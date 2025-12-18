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
