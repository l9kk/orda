from abc import ABC, abstractmethod
from typing import List


class Observer(ABC):
    """
    #OBSERVER
    Abstract base class for observers.
    """

    @abstractmethod
    def update(self, item_name: str):
        pass


class StudentObserver(Observer):
    """
    #OBSERVER
    Concrete observer representing a student.
    """

    def __init__(self, student_name: str):
        self.student_name = student_name

    def update(self, item_name: str):
        print(
            f"[Observer Alert] Student {self.student_name}: A new {item_name} is now available!"
        )


class Subject(ABC):
    """
    #OBSERVER
    Abstract base class for subjects.
    """

    @abstractmethod
    def attach(self, observer: Observer):
        pass

    @abstractmethod
    def detach(self, observer: Observer):
        pass

    @abstractmethod
    def notify(self, item_name: str):
        pass


class NotificationService(Subject):
    """
    #OBSERVER
    Concrete subject that manages observers and triggers notifications.
    """

    def __init__(self):
        self._observers: List[Observer] = []

    def attach(self, observer: Observer):
        self._observers.append(observer)

    def detach(self, observer: Observer):
        self._observers.remove(observer)

    def notify(self, item_name: str):
        for observer in self._observers:
            observer.update(item_name)
