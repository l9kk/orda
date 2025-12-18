from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.features.users.models import User
from app.features.users.proxy import RealUserDetail, UserDetailProxy
from app.core.auth import get_optional_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/users", tags=["users"])

class UserRead(BaseModel):
    id: int
    email: str
    phone: Optional[str] = None
    telegram: Optional[str] = None
    contact_info: str

class UserUpdate(BaseModel):
    phone: Optional[str] = None
    telegram: Optional[str] = None

@router.get("/{user_id}", response_model=UserRead)
def get_user(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    real_detail = RealUserDetail(
        email=user.email,
        phone=user.phone,
        telegram=user.telegram
    )
    
    # Use Proxy Pattern to control access to contact info
    proxy = UserDetailProxy(
        real_user_detail=real_detail,
        current_user_id=current_user.id if current_user else None,
        target_user_id=user.id
    )
    
    return UserRead(
        id=user.id,
        email=user.email,
        phone=user.phone,
        telegram=user.telegram,
        contact_info=proxy.get_contact_info()
    )

@router.put("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.phone is not None:
        user.phone = user_update.phone
    if user_update.telegram is not None:
        user.telegram = user_update.telegram
        
    db.commit()
    db.refresh(user)
    
    real_detail = RealUserDetail(
        email=user.email,
        phone=user.phone,
        telegram=user.telegram
    )
    
    proxy = UserDetailProxy(
        real_user_detail=real_detail,
        current_user_id=current_user.id,
        target_user_id=user.id
    )
    
    return UserRead(
        id=user.id,
        email=user.email,
        phone=user.phone,
        telegram=user.telegram,
        contact_info=proxy.get_contact_info()
    )
