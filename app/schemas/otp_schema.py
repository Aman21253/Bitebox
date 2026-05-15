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


class ResendOtpRequest(BaseModel):
    phone: str
    purpose: Literal[
        "registration",
        "login",
        "password_reset"
    ] = "registration"


class ForgotPasswordRequest(BaseModel):
    phone: str


# ─────────────────────────────────────────────────────────────
# Reset Password
# ─────────────────────────────────────────────────────────────

class ResetPasswordRequest(BaseModel):
    phone: str
    otp_code: str
    new_password: str


# ─────────────────────────────────────────────────────────────
# Change Password
# ─────────────────────────────────────────────────────────────

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str