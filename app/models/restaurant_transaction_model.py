from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    DateTime
)

from datetime import datetime

from app.database.db import Base


class RestaurantTransaction(Base):

    __tablename__ = "restaurant_transactions"

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

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        nullable=True
    )

    transaction_type = Column(
        String(50)
    )

    amount = Column(
        Float,
        nullable=False
    )

    description = Column(
        String(500),
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )