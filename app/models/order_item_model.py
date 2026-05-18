from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class OrderItem(Base):

    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        nullable=False
    )

    menu_item_id = Column(
        Integer,
        ForeignKey("menu_items.id"),
        nullable=False
    )

    item_name = Column(String(200))

    variant_name = Column(String(200), nullable=True)

    quantity = Column(Integer)

    item_price = Column(Float)

    total_price = Column(Float)

    order = relationship("Order")

    menu_item = relationship("MenuItem")