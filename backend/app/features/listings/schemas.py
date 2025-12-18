from pydantic import BaseModel
from typing import Optional


class ListingBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    category: str
    location: Optional[str] = None


class ListingCreate(ListingBase):
    # Fields for DormItemListing
    item_type: Optional[str] = None
    # Fields for RideSharingListing
    origin: Optional[str] = None
    destination: Optional[str] = None


class ListingResponse(ListingBase):
    id: int
    owner_id: int
    item_type: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    location: Optional[str] = None
    contact_info: Optional[str] = None

    class Config:
        from_attributes = True
