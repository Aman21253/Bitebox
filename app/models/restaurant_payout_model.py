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


class RestaurantPayout(Base):

    __tablename__ = "restaurant_payouts"

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

    amount = Column(
        Float,
        nullable=False
    )

    status = Column(
        String(50),
        default="pending"
    )

    rejection_reason = Column(
        String(500),
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )