from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    ForeignKey,
    Text
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class MenuItem(Base):

    __tablename__ = "menu_items"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    restaurant_id = Column(
        Integer,
        ForeignKey("restaurants.id"),
        nullable=False
    )

    category_id = Column(
        Integer,
        ForeignKey("menu_categories.id"),
        nullable=False
    )

    name = Column(
        String(150),
        nullable=False
    )

    description = Column(
        String(500),
        nullable=True
    )

    image_url = Column(
        String(500),
        nullable=True
    )

    is_veg = Column(
        Boolean,
        default=True
    )

    base_price = Column(
        Float,
        nullable=False
    )

    is_available = Column(
        Boolean,
        default=True
    )

    preparation_time = Column(
        Integer,
        default=15
    )

    # NEW FIELDS

    calories = Column(
        Integer,
        default=0
    )

    serving_info = Column(
        String(100),
        nullable=True
    )

    spice_level = Column(
        String(50),
        default="medium"
    )

    allergens = Column(
        Text,
        nullable=True
    )

    packaging_charge = Column(
        Float,
        default=0
    )

    tags = Column(
        Text,
        nullable=True
    )

    recommended = Column(
        Boolean,
        default=False
    )

    restaurant = relationship(
        "Restaurant"
    )

    category = relationship(
        "MenuCategory"
    )

    images = relationship(
        "MenuItemImage",
        cascade="all, delete"
    )