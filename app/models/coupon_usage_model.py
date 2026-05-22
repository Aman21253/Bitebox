from sqlalchemy import (
    Column,
    Integer,
    Float,
    ForeignKey,
    DateTime
)

from datetime import datetime

from app.database.db import Base


class CouponUsage(Base):

    __tablename__ = "coupon_usages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    coupon_id = Column(
        Integer,
        ForeignKey("coupons.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    order_id = Column(
        Integer,
        ForeignKey("orders.id")
    )

    discount_amount = Column(
        Float,
        default=0
    )

    used_at = Column(
        DateTime,
        default=datetime.utcnow
    )