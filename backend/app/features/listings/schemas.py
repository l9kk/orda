from pydantic import BaseModel
from typing import Optional

class ListingBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    category: str

class ListingCreate(ListingBase):
    # Fields for BookListing
    course_code: Optional[str] = None
    isbn: Optional[str] = None
    # Fields for DormItemListing
    item_type: Optional[str] = None
    # Fields for RideSharingListing
    origin: Optional[str] = None
    destination: Optional[str] = None

class ListingResponse(ListingBase):
    id: int
    course_code: Optional[str] = None
    isbn: Optional[str] = None
    item_type: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    contact_info: Optional[str] = None

    class Config:
        from_attributes = True
