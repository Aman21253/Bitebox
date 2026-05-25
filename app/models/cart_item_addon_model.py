from sqlalchemy import (
    Column,
    Integer,
    Float,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class CartItemAddon(Base):

    __tablename__ = "cart_item_addons"

    id = Column(Integer, primary_key=True, index=True)

    cart_item_id = Column(
        Integer,
        ForeignKey("cart_items.id"),
        nullable=False
    )

    addon_id = Column(
        Integer,
        ForeignKey("menu_item_addons.id"),
        nullable=False
    )

    addon_price = Column(Float, nullable=False)

    # ✅ FIXED: back_populates to match CartItem.addons
    cart_item = relationship(
        "CartItem",
        back_populates="addons"
    )

    addon = relationship("MenuItemAddon")