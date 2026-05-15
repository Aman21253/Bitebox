from pydantic import BaseModel
from typing import Literal


class OtpSendRequest(BaseModel):
    phone: str
    purpose: Literal[
        "registration",
        "login",
        "password_reset"
    ] = "registration"


class OtpVerifyRequest(BaseModel):
    phone: str
    code: str
    purpose: Literal[
        "registration",
        "login",
        "password_reset"
    ] = "registration"


# NEW
class ResendOtpRequest(BaseModel):
    phone: str
    purpose: Literal[
        "registration",
        "login",
        "password_reset"
    ] = "registration"


# NEW
class ForgotPasswordRequest(BaseModel):
    phone: str


# NEW
class ResetPasswordRequest(BaseModel):
    phone: str
    new_password: str