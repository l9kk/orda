from abc import ABC, abstractmethod
from typing import List
from .models import Listing

class SortStrategy(ABC):
    """
    #STRATEGY
    Abstract base class for sorting strategies.
    """
    @abstractmethod
    def sort(self, listings: List[Listing]) -> List[Listing]:
        pass

class PriceSortStrategy(SortStrategy):
    """
    #STRATEGY
    Sorts listings by price in ascending order.
    """
    def sort(self, listings: List[Listing]) -> List[Listing]:
        print("DEBUG: Strategy Pattern switched to PriceMode")
        return sorted(listings, key=lambda x: x.price)

class DateSortStrategy(SortStrategy):
    """
    #STRATEGY
    Sorts listings by ID (as a proxy for date/newest) in descending order.
    """
    def sort(self, listings: List[Listing]) -> List[Listing]:
        print("DEBUG: Strategy Pattern switched to DateMode")
        return sorted(listings, key=lambda x: x.id, reverse=True)

class SortContext:
    """
    #STRATEGY
    Context class that uses a SortStrategy.
    """
    def __init__(self, strategy: SortStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: SortStrategy):
        self._strategy = strategy

    def execute_sort(self, listings: List[Listing]) -> List[Listing]:
        return self._strategy.sort(listings)
