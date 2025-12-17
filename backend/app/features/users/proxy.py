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
    def __init__(self, real_user_detail: RealUserDetail, is_authenticated: bool):
        self._real_user_detail = real_user_detail
        self._is_authenticated = is_authenticated

    def get_contact_info(self) -> str:
        print("DEBUG: Proxy Pattern checking access for UserDetail")
        if self._is_authenticated:
            return self._real_user_detail.get_contact_info()
        else:
            return "[HIDDEN] - Please login to view contact info"
