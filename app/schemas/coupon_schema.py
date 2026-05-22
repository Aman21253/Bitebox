from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CreateCouponRequest(BaseModel):
    code: str
    description: Optional[str] = None
    discount_type: str
    discount_value: float
    minimum_order_amount: float = 0
    maximum_discount_amount: float = 0
    usage_limit: int = 100
    first_order_only: bool = False
    expiry_date: Optional[datetime] = None


class ApplyCouponRequest(BaseModel):
    code: str
    order_amount: float