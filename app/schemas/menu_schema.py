from pydantic import BaseModel
from typing import Optional


# ─────────────────────────────────────────────────────────────
# Menu Category
# ─────────────────────────────────────────────────────────────

class MenuCategoryCreate(BaseModel):

    name: str
    description: Optional[str] = None


class MenuCategoryUpdate(BaseModel):

    name: str
    description: Optional[str] = None
    is_active: bool = True


# ─────────────────────────────────────────────────────────────
# Menu Item
# ─────────────────────────────────────────────────────────────

class MenuItemCreate(BaseModel):

    category_id: int
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_veg: bool = True
    base_price: float
    preparation_time: int = 15


class MenuItemUpdate(BaseModel):

    category_id: int
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_veg: bool = True
    base_price: float
    preparation_time: int = 15
    is_available: bool = True


# ─────────────────────────────────────────────────────────────
# Menu Item Variant
# ─────────────────────────────────────────────────────────────

class MenuItemVariantCreate(BaseModel):

    name: str
    price: float


# ─────────────────────────────────────────────────────────────
# Menu Item Addon
# ─────────────────────────────────────────────────────────────

class MenuItemAddonCreate(BaseModel):

    name: str
    price: float