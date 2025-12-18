from sqlalchemy.orm import Session
from . import models, schemas
from app.features.users.models import User

class NotificationService:
    @staticmethod
    def create_subscription(db: Session, subscription_in: schemas.SubscriptionCreate, current_user: User):
        db_subscription = models.Subscription(
            user_id=current_user.id,
            keyword=subscription_in.keyword,
            student_name=current_user.email,
        )
        db.add(db_subscription)
        db.commit()
        db.refresh(db_subscription)
        return db_subscription

    @staticmethod
    def get_subscriptions(db: Session, user_id: int):
        return (
            db.query(models.Subscription)
            .filter(models.Subscription.user_id == user_id)
            .all()
        )

    @staticmethod
    def get_notifications(db: Session, user_id: int):
        return (
            db.query(models.Notification)
            .filter(models.Notification.user_id == user_id)
            .order_by(models.Notification.created_at.desc())
            .all()
        )

    @staticmethod
    def mark_as_read(db: Session, user_id: int, notification_id: int):
        notification = (
            db.query(models.Notification)
            .filter(
                models.Notification.id == notification_id,
                models.Notification.user_id == user_id,
            )
            .first()
        )
        if notification:
            notification.is_read = True
            db.commit()
        return {"status": "success"}

    @staticmethod
    def mark_all_as_read(db: Session, user_id: int):
        db.query(models.Notification).filter(
            models.Notification.user_id == user_id,
            models.Notification.is_read.is_(False),
        ).update({"is_read": True})
        db.commit()
        return {"status": "success"}
