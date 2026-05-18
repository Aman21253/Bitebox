from pydantic import BaseModel, EmailStr
from typing import Optional


# ─────────────────────────────────────────────────────────────
# Authentication
# ─────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str]
    password: str
    role: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ─────────────────────────────────────────────────────────────
# Update Profile
# ─────────────────────────────────────────────────────────────

class UserProfileUpdate(BaseModel):
    name: str
    phone: str


# ─────────────────────────────────────────────────────────────
# User Address
# ─────────────────────────────────────────────────────────────

class UserAddressCreate(BaseModel):

    label: str
    address_line: str
    landmark: Optional[str] = None
    city: str
    state: str
    pincode: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class UserAddressUpdate(BaseModel):

    label: str
    address_line: str
    landmark: Optional[str] = None
    city: str
    state: str
    pincode: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None