from .models import BookListing, DormItemListing, RideSharingListing, Listing


class ListingFactory:
    """
    #FACTORY
    Encapsulates the instantiation of different Listing types.
    """

    @staticmethod
    def create_listing(category: str, **kwargs) -> Listing:
        print(f"DEBUG: Factory Method creating {category.capitalize()}Listing")

        if category == "textbook":
            return BookListing(**kwargs)
        elif category == "dorm":
            return DormItemListing(**kwargs)
        elif category == "ride":
            return RideSharingListing(**kwargs)
        else:
            raise ValueError(f"Unknown category: {category}")
