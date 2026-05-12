from pydantic import BaseModel
from typing import Literal


class OtpSendRequest(BaseModel):
    phone: str
    purpose: Literal["registration", "login", "password_reset"] = "registration"


class OtpVerifyRequest(BaseModel):
    phone: str
    code: str
    purpose: Literal["registration", "login", "password_reset"] = "registration"