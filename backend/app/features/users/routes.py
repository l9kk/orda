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
    username: str
    email: str
    contact_info: str

@router.get("/{user_id}", response_model=UserRead)
def get_user(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    real_detail = RealUserDetail(phone=user.phone or "N/A", telegram=user.telegram or "N/A")
    
    # Use Proxy Pattern to control access to contact info
    proxy = UserDetailProxy(
        real_user_detail=real_detail,
        current_user_id=current_user.id if current_user else None,
        target_user_id=user.id
    )
    
    return UserRead(
        id=user.id,
        username=user.username,
        email=user.email,
        contact_info=proxy.get_contact_info()
    )
