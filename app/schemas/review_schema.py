from pydantic import BaseModel

from typing import Optional


class CreateReviewRequest(BaseModel):

    order_id: int

    rating: float

    review_text: Optional[str] = None

    image_url: Optional[str] = None

    restaurant_id: Optional[int] = None

    driver_id: Optional[int] = None

    menu_item_id: Optional[int] = None