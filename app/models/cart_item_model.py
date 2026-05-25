from sqlalchemy import (
    Column,
    Integer,
    Float,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class CartItem(Base):

    __tablename__ = "cart_items"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    cart_id = Column(
        Integer,
        ForeignKey("carts.id"),
        nullable=False
    )

    restaurant_id = Column(
        Integer,
        ForeignKey("restaurants.id"),
        nullable=False
    )

    menu_item_id = Column(
        Integer,
        ForeignKey("menu_items.id"),
        nullable=False
    )

    variant_id = Column(
        Integer,
        ForeignKey("menu_item_variants.id"),
        nullable=True
    )

    quantity = Column(
        Integer,
        default=1
    )

    item_price = Column(
        Float,
        nullable=False
    )

    total_price = Column(
        Float,
        nullable=False
    )

    cart = relationship("Cart", back_populates="items")

    menu_item = relationship("MenuItem")

    variant = relationship("MenuItemVariant")

    restaurant = relationship("Restaurant")

    # ✅ FIXED: Added missing addons relationship
    addons = relationship(
        "CartItemAddon",
        cascade="all, delete",
        lazy="joined"
    )