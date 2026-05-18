from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class Order(Base):

    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    restaurant_id = Column(
        Integer,
        ForeignKey("restaurants.id"),
        nullable=False
    )

    driver_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    status = Column(String(50), default="pending")

    payment_status = Column(
        String(50),
        default="pending"
    )

    total_amount = Column(Float, nullable=False)

    delivery_address = Column(String(500))

    customer = relationship(
        "User",
        foreign_keys=[customer_id]
    )

    restaurant = relationship("Restaurant")

    driver = relationship(
        "User",
        foreign_keys=[driver_id]
    )