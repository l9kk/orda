import logging
from abc import ABC, abstractmethod
from typing import List

from sqlalchemy.orm import Session
from .models import Notification

logger = logging.getLogger(__name__)


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

    def __init__(self, user_id: int, student_name: str, db: Session):
        self.user_id = user_id
        self.student_name = student_name
        self.db = db

    def update(self, item_name: str):
        logger.debug(f"DEBUG: StudentObserver.update called for {self.student_name} with {item_name}")
        
        new_notification = Notification(
            user_id=self.user_id,
            message=f"New item matching your alert: {item_name}"
        )
        self.db.add(new_notification)
        self.db.commit()

        logger.info(
            f"OBSERVER: Alerting Student {self.student_name} about new item: {item_name}"
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
