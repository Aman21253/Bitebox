from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class Refund(Base):

    __tablename__ = "refunds"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

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

    refund_type = Column(
        String(50),
        default="full"
    )

    refund_reason = Column(
        String(500),
        nullable=False
    )

    refund_amount = Column(
        Float,
        nullable=False
    )

    refund_status = Column(
        String(50),
        default="pending"
    )

    payment_reversal_status = Column(
        String(50),
        default="not_processed"
    )

    admin_note = Column(
        String(500),
        nullable=True
    )

    order = relationship("Order")

    customer = relationship("User")