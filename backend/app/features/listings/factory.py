import logging
from .models import BookListing, DormItemListing, RideSharingListing, Listing

logger = logging.getLogger(__name__)


class ListingFactory:
    """
    #FACTORY
    Encapsulates the instantiation of different Listing types.
    """

    @staticmethod
    def create_listing(category: str, **kwargs) -> Listing:
        logger.info(f"FACTORY: Creating {category.capitalize()} Listing")

        # Base fields common to all listings
        base_fields = {"title", "description", "price", "location", "owner_id"}

        if category == "textbook":
            # Filter for base fields only
            filtered_kwargs = {k: v for k, v in kwargs.items() if k in base_fields}
            return BookListing(**filtered_kwargs)
        elif category == "dorm":
            # Filter for base fields + item_type
            dorm_fields = base_fields | {"item_type"}
            filtered_kwargs = {k: v for k, v in kwargs.items() if k in dorm_fields}
            return DormItemListing(**filtered_kwargs)
        elif category == "ride":
            # Filter for base fields + origin + destination
            ride_fields = base_fields | {"origin", "destination"}
            filtered_kwargs = {k: v for k, v in kwargs.items() if k in ride_fields}
            return RideSharingListing(**filtered_kwargs)
        else:
            raise ValueError(f"Unknown category: {category}")
