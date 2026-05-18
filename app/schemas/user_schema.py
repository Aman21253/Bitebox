from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum


# ─────────────────────────────────────────────────────────────
# User Roles
# ─────────────────────────────────────────────────────────────

class UserRole(str, Enum):

    admin = "admin"
    restaurant = "restaurant"
    customer = "customer"
    driver = "driver"


# ─────────────────────────────────────────────────────────────
# Authentication
# ─────────────────────────────────────────────────────────────

class UserRegister(BaseModel):

    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    email: EmailStr

    phone: str = Field(
        ...,
        min_length=10,
        max_length=15
    )

    password: str = Field(
        ...,
        min_length=6,
        max_length=100
    )

    role: UserRole = UserRole.customer


class UserLogin(BaseModel):

    email: EmailStr

    password: str = Field(
        ...,
        min_length=6
    )


# ─────────────────────────────────────────────────────────────
# Update Profile
# ─────────────────────────────────────────────────────────────

class UserProfileUpdate(BaseModel):

    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    phone: str = Field(
        ...,
        min_length=10,
        max_length=15
    )


# ─────────────────────────────────────────────────────────────
# User Address
# ─────────────────────────────────────────────────────────────

class UserAddressCreate(BaseModel):

    label: str = Field(
        ...,
        min_length=2,
        max_length=50
    )

    address_line: str = Field(
        ...,
        min_length=5,
        max_length=300
    )

    landmark: Optional[str] = Field(
        None,
        max_length=150
    )

    city: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    state: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    pincode: str = Field(
        ...,
        min_length=4,
        max_length=10
    )

    latitude: Optional[float] = None

    longitude: Optional[float] = None


class UserAddressUpdate(BaseModel):

    label: str = Field(
        ...,
        min_length=2,
        max_length=50
    )

    address_line: str = Field(
        ...,
        min_length=5,
        max_length=300
    )

    landmark: Optional[str] = Field(
        None,
        max_length=150
    )

    city: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    state: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    pincode: str = Field(
        ...,
        min_length=4,
        max_length=10
    )

    latitude: Optional[float] = None

    longitude: Optional[float] = None