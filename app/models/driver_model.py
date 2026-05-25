from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class Driver(Base):

    __tablename__ = "drivers"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    full_name = Column(
        String(255),
        nullable=False
    )

    phone = Column(
        String(20),
        nullable=False
    )

    vehicle_type = Column(
        String(100),
        nullable=False
    )

    vehicle_number = Column(
        String(100),
        nullable=False
    )

    is_online = Column(
        Boolean,
        default=False
    )

    is_available = Column(
        Boolean,
        default=True
    )

    current_latitude = Column(
        Float,
        nullable=True
    )

    current_longitude = Column(
        Float,
        nullable=True
    )

    total_deliveries = Column(
        Integer,
        default=0
    )

    total_earnings = Column(
        Float,
        default=0
    )

    last_active_at = Column(
        String(100),
        nullable=True
    )

    user = relationship("User")