from pydantic import BaseModel
from typing import Optional


class CreateAddressRequest(BaseModel):

    full_name: str
    phone: str

    label: str

    address_line_1: str
    address_line_2: Optional[str] = None

    landmark: Optional[str] = None

    city: str
    state: str
    pincode: str

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    is_default: Optional[bool] = False


class UpdateAddressRequest(BaseModel):

    full_name: Optional[str] = None
    phone: Optional[str] = None

    label: Optional[str] = None

    address_line_1: Optional[str] = None
    address_line_2: Optional[str] = None

    landmark: Optional[str] = None

    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

    latitude: Optional[float] = None
    longitude: Optional[float] = None