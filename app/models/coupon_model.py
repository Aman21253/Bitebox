from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime
)

from datetime import datetime

from app.database.db import Base


class Coupon(Base):

    __tablename__ = "coupons"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    code = Column(
        String(50),
        unique=True,
        nullable=False
    )

    description = Column(
        String(300),
        nullable=True
    )

    discount_type = Column(
        String(20),
        default="percentage"
    )

    discount_value = Column(
        Float,
        nullable=False
    )

    minimum_order_amount = Column(
        Float,
        default=0
    )

    maximum_discount_amount = Column(
        Float,
        default=0
    )

    usage_limit = Column(
        Integer,
        default=100
    )

    used_count = Column(
        Integer,
        default=0
    )

    is_active = Column(
        Boolean,
        default=True
    )

    first_order_only = Column(
        Boolean,
        default=False
    )

    expiry_date = Column(
        DateTime,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )