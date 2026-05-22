from pydantic import BaseModel

from typing import Optional


class CreateRefundRequest(
    BaseModel
):

    refund_reason: str

    refund_type: str = "full"

    refund_amount: float


class UpdateRefundRequest(
    BaseModel
):

    refund_status: str

    admin_note: Optional[str] = None