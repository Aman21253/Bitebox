from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    Text,
    DateTime,
    Boolean
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.db import Base


class Review(Base):

    __tablename__ = "reviews"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # ─────────────────────────────────────
    # RELATIONS
    # ─────────────────────────────────────

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        nullable=False
    )

    customer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    restaurant_id = Column(
        Integer,
        ForeignKey("restaurants.id"),
        nullable=True
    )

    driver_id = Column(
        Integer,
        ForeignKey("drivers.id"),
        nullable=True
    )

    menu_item_id = Column(
        Integer,
        ForeignKey("menu_items.id"),
        nullable=True
    )

    # ─────────────────────────────────────
    # REVIEW DATA
    # ─────────────────────────────────────

    rating = Column(
        Float,
        nullable=False
    )

    review_text = Column(
        Text,
        nullable=True
    )

    image_url = Column(
        String(500),
        nullable=True
    )

    # ─────────────────────────────────────
    # MODERATION
    # ─────────────────────────────────────

    status = Column(
        String(50),
        default="pending"
    )
    # pending
    # approved
    # rejected

    rejection_reason = Column(
        Text,
        nullable=True
    )

    admin_reply = Column(
        Text,
        nullable=True
    )

    # ─────────────────────────────────────
    # FLAGS
    # ─────────────────────────────────────

    is_verified_purchase = Column(
        Boolean,
        default=True
    )

    # ─────────────────────────────────────
    # TIMESTAMPS
    # ─────────────────────────────────────

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # ─────────────────────────────────────
    # RELATIONSHIPS
    # ─────────────────────────────────────

    customer = relationship(
        "User"
    )

    restaurant = relationship(
        "Restaurant"
    )

    driver = relationship(
        "Driver"
    )

    menu_item = relationship(
        "MenuItem"
    )

    order = relationship(
        "Order"
    )