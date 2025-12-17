from pydantic import BaseModel

class SubscriptionBase(BaseModel):
    student_name: str
    keyword: str

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionResponse(SubscriptionBase):
    id: int

    class Config:
        from_attributes = True
