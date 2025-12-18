from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from typing import Optional

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    student_name: Mapped[str] = mapped_column(String, nullable=False)
    keyword: Mapped[str] = mapped_column(String, nullable=False)
