from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr

class UserUpdate(BaseModel):
    phone: Optional[str] = None
    telegram: Optional[str] = None

class UserRead(UserBase):
    id: int
    phone: Optional[str] = None
    telegram: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserRead
