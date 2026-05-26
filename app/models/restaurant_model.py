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

    # ─────────────────────────────────────
    # BASIC INFO
    # ─────────────────────────────────────

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

    # ─────────────────────────────────────
    # LOCATION
    # ─────────────────────────────────────

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

    latitude = Column(
        Float,
        nullable=True
    )

    longitude = Column(
        Float,
        nullable=True
    )

    # ─────────────────────────────────────
    # DELIVERY
    # ─────────────────────────────────────

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

    # ─────────────────────────────────────
    # OPEN/CLOSE
    # ─────────────────────────────────────

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

    # ─────────────────────────────────────
    # APPROVAL FLOW
    # ─────────────────────────────────────

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

    # ─────────────────────────────────────
    # STATUS
    # ─────────────────────────────────────

    status = Column(
        String(50),
        default="active"
    )

    # ─────────────────────────────────────
    # REVIEW SYSTEM
    # ─────────────────────────────────────

    average_rating = Column(
        Float,
        default=0
    )

    total_reviews = Column(
        Integer,
        default=0
    )

    # ─────────────────────────────────────
    # RELATIONSHIP
    # ─────────────────────────────────────

    owner = relationship(
        "User",
        foreign_keys=[owner_id]
    )

    # ─────────────────────────────────────
    # GST / FSSAI
    # ─────────────────────────────────────
    
    gst_number = Column(
        String(50),
        nullable=True
    )
    
    fssai_number = Column(
        String(50),
        nullable=True
    )
    
    gst_certificate_url = Column(
        String(500),
        nullable=True
    )
    
    fssai_certificate_url = Column(
        String(500),
        nullable=True
    )
    
    pan_card_url = Column(
        String(500),
        nullable=True
    )
    
    cancelled_cheque_url = Column(
        String(500),
        nullable=True
    )
    
    # ─────────────────────────────────────
    # BANK DETAILS
    # ─────────────────────────────────────
    
    bank_account_holder = Column(
        String(150),
        nullable=True
    )
    
    bank_name = Column(
        String(150),
        nullable=True
    )
    
    bank_account_number = Column(
        String(100),
        nullable=True
    )
    
    bank_ifsc = Column(
        String(50),
        nullable=True
    )
    
    upi_id = Column(
        String(100),
        nullable=True
    )
    
    # ─────────────────────────────────────
    # PAYOUTS
    # ─────────────────────────────────────
    
    available_balance = Column(
        Float,
        default=0
    )
    
    lifetime_earnings = Column(
        Float,
        default=0
    )