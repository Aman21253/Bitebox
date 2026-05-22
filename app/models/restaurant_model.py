from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Float,
    Boolean
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class Restaurant(Base):

    __tablename__ = "restaurants"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # BASIC INFO

    name = Column(
        String(150),
        nullable=False
    )

    description = Column(
        String(500),
        nullable=True
    )

    cuisine = Column(
        String(150),
        nullable=True
    )

    image_url = Column(
        String(500),
        nullable=True
    )

    banner_image = Column(
        String(500),
        nullable=True
    )

    phone = Column(
        String(20),
        nullable=False
    )

    # LOCATION

    address = Column(
        String(300),
        nullable=False
    )

    city = Column(
        String(100),
        nullable=False
    )

    state = Column(
        String(100),
        nullable=False
    )

    pincode = Column(
        String(20),
        nullable=False
    )

    # DELIVERY

    delivery_radius = Column(
        Float,
        default=5.0
    )

    delivery_fee = Column(
        Float,
        default=40
    )

    minimum_order = Column(
        Float,
        default=199
    )

    estimated_delivery_time = Column(
        Integer,
        default=30
    )

    # OPEN/CLOSE

    is_open = Column(
        Boolean,
        default=True
    )

    opening_time = Column(
        String(20),
        default="10:00 AM"
    )

    closing_time = Column(
        String(20),
        default="11:00 PM"
    )

    # APPROVAL FLOW

    approval_status = Column(
        String(50),
        default="pending"
    )

    rejection_reason = Column(
        String(500),
        nullable=True
    )

    approved_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    # STATUS

    status = Column(
        String(50),
        default="active"
    )

    # RELATIONSHIP

    owner = relationship(
        "User",
        foreign_keys=[owner_id]
    )