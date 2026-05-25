from pydantic import BaseModel
from typing import Optional


class UpdateOrderLifecycleRequest(
    BaseModel
):
    status: str
    reason: Optional[str] = None


class UpdateDeliveryLifecycleRequest(
    BaseModel
):
    delivery_status: str


class OrderStatusUpdate(BaseModel):
    status: str