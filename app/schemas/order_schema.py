from pydantic import BaseModel


class PlaceOrderRequest(BaseModel):

    delivery_address: str


class UpdateOrderStatusRequest(BaseModel):

    status: str