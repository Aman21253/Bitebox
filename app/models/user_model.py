from sqlalchemy import (
    Column,
    Integer,
    String,
    Enum,
    Float,
    Boolean
)

from app.database.db import Base

import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    restaurant = "restaurant"
    customer = "customer"
    driver = "driver"


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(150), unique=True, nullable=False)

    phone = Column(String(20), unique=True, nullable=True)

    password = Column(String(255), nullable=False)

    role = Column(
        Enum(UserRole),
        default=UserRole.customer
    )

    status = Column(
        String(50),
        default="active"
    )

    # ─────────────────────────────────────────────
    # DRIVER FEATURES
    # ─────────────────────────────────────────────

    is_available = Column(
        Boolean,
        default=False
    )

    latitude = Column(
        Float,
        nullable=True
    )

    longitude = Column(
        Float,
        nullable=True
    )