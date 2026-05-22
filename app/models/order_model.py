from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    DateTime,
    Text
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.db import Base


class Order(Base):

    __tablename__ = "orders"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

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
        ForeignKey("drivers.id"),
        nullable=True
    )

    # ─────────────────────────────────────
    # ORDER STATUS
    # ─────────────────────────────────────

    status = Column(
        String(50),
        default="placed"
    )

    delivery_status = Column(
        String(50),
        default="waiting_for_driver"
    )

    payment_status = Column(
        String(50),
        default="paid"
    )

    refund_status = Column(
        String(50),
        nullable=True
    )

    cancellation_reason = Column(
        Text,
        nullable=True
    )

    rejection_reason = Column(
        Text,
        nullable=True
    )

    # ─────────────────────────────────────
    # MONEY
    # ─────────────────────────────────────

    total_amount = Column(
        Float,
        nullable=False
    )

    delivery_fee = Column(
        Float,
        default=0
    )

    packaging_charges = Column(
        Float,
        default=0
    )

    tax_amount = Column(
        Float,
        default=0
    )

    refund_status = Column(
        String(50),
        default="not_requested"
    )

    coupon_code = Column(
        String(50),
        nullable=True
    )
    
    discount_amount = Column(
        Float,
        default=0
    )
    
    original_amount = Column(
        Float,
        default=0
    )

    # ─────────────────────────────────────
    # DELIVERY
    # ─────────────────────────────────────

    delivery_address = Column(
        String(500)
    )

    estimated_delivery_time = Column(
        Integer,
        default=30
    )

    # ─────────────────────────────────────
    # TIMESTAMPS
    # ─────────────────────────────────────

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    confirmed_at = Column(
        DateTime,
        nullable=True
    )

    preparing_at = Column(
        DateTime,
        nullable=True
    )

    ready_for_pickup_at = Column(
        DateTime,
        nullable=True
    )

    picked_up_at = Column(
        DateTime,
        nullable=True
    )

    delivered_at = Column(
        DateTime,
        nullable=True
    )

    cancelled_at = Column(
        DateTime,
        nullable=True
    )

    # ─────────────────────────────────────
    # RELATIONSHIPS
    # ─────────────────────────────────────

    customer = relationship(
        "User",
        foreign_keys=[customer_id]
    )

    restaurant = relationship(
        "Restaurant"
    )

    driver = relationship(
        "Driver"
    )
