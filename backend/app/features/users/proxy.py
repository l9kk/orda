from abc import ABC, abstractmethod

class UserDetail(ABC):
    """
    #PROXY
    Interface for user details.
    """
    @abstractmethod
    def get_contact_info(self) -> str:
        pass

class RealUserDetail(UserDetail):
    """
    #PROXY
    Real object containing sensitive information.
    """
    def __init__(self, phone: str, telegram: str):
        self._phone = phone
        self._telegram = telegram

    def get_contact_info(self) -> str:
        return f"Phone: {self._phone}, Telegram: {self._telegram}"

class UserDetailProxy(UserDetail):
    """
    #PROXY
    Proxy object that controls access to RealUserDetail.
    """
    def __init__(self, real_user_detail: RealUserDetail, current_user_id: int | None, target_user_id: int):
        self._real_user_detail = real_user_detail
        self._current_user_id = current_user_id
        self._target_user_id = target_user_id

    def get_contact_info(self) -> str:
        print(f"DEBUG: Proxy Pattern checking access for UserDetail (Current: {self._current_user_id}, Target: {self._target_user_id})")
        # Allow access if authenticated AND (is owner OR is admin - simplified)
        if self._current_user_id is not None:
            return self._real_user_detail.get_contact_info()
        else:
            return "[HIDDEN] - Please login to view contact info"
