from pydantic import BaseModel, EmailStr, Field
from app.features.users.schemas import UserRead

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=16)

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserRead
