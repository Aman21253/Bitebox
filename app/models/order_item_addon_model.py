from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class OrderItemAddon(Base):

    __tablename__ = "order_item_addons"

    id = Column(Integer, primary_key=True, index=True)

    order_item_id = Column(
        Integer,
        ForeignKey("order_items.id"),
        nullable=False
    )

    addon_name = Column(String(150))

    addon_price = Column(Float)

    order_item = relationship("OrderItem")