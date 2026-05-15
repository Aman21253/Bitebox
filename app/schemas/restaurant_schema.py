from pydantic import BaseModel
from typing import Optional


class RestaurantCreate(BaseModel):

    name: str
    description: Optional[str] = None
    address: str
    city: str
    state: str
    pincode: str
    phone: str
    cuisine: Optional[str] = None
    delivery_radius: Optional[float] = 5.0