from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Optional
from .models import User
from .schemas import UserUpdate
from .proxy import RealUserDetail, UserDetailProxy

class UserService:
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def update_user(db: Session, user_id: int, user_in: UserUpdate):
        db_user = UserService.get_user_by_id(db, user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user_in.phone is not None:
            db_user.phone = user_in.phone
        if user_in.telegram is not None:
            db_user.telegram = user_in.telegram
            
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user_profile(db: Session, user_id: int, current_user_id: Optional[int]):
        db_user = UserService.get_user_by_id(db, user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        real_detail = RealUserDetail(
            email=db_user.email, phone=db_user.phone, telegram=db_user.telegram
        )

        proxy = UserDetailProxy(
            real_user_detail=real_detail,
            current_user_id=current_user_id,
            target_user_id=db_user.id,
        )

        return {
            "id": db_user.id,
            "email": db_user.email,
            "phone": db_user.phone,
            "telegram": db_user.telegram,
            "contact_info": proxy.get_contact_info(),
        }
