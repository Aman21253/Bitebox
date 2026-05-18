from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class MenuItem(Base):

    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)

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

    name = Column(String(150), nullable=False)

    description = Column(String(500), nullable=True)

    image_url = Column(String(500), nullable=True)

    is_veg = Column(Boolean, default=True)

    base_price = Column(Float, nullable=False)

    is_available = Column(Boolean, default=True)

    preparation_time = Column(Integer, default=15)

    restaurant = relationship("Restaurant")

    category = relationship("MenuCategory")