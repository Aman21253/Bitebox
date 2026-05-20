from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class MenuItemVariant(Base):

    __tablename__ = "menu_item_variants"

    id = Column(Integer, primary_key=True, index=True)

    menu_item_id = Column(
        Integer,
        ForeignKey("menu_items.id"),
        nullable=False
    )

    name = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    menu_item = relationship("MenuItem")