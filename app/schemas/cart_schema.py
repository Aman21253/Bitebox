from pydantic import BaseModel
from typing import Optional, List


class AddToCartRequest(BaseModel):

    menu_item_id: int

    variant_id: Optional[int] = None

    # ✅ FIXED: Use default_factory for mutable default
    addon_ids: Optional[List[int]] = None

    quantity: int = 1


class UpdateCartQuantityRequest(BaseModel):

    quantity: int