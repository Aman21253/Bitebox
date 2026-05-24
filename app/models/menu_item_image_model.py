from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.database.db import Base


class MenuItemImage(Base):

    __tablename__ = "menu_item_images"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    menu_item_id = Column(
        Integer,
        ForeignKey("menu_items.id")
    )

    image_url = Column(
        String(500)
    )