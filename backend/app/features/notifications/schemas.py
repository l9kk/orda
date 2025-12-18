from pydantic import BaseModel


class SubscriptionBase(BaseModel):
    keyword: str


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionResponse(SubscriptionBase):
    id: int
    user_id: int
    student_name: str

    class Config:
        from_attributes = True
