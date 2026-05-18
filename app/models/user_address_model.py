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


class UserAddress(Base):

    __tablename__ = "user_addresses"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    label = Column(String(50), nullable=False)

    address_line = Column(String(300), nullable=False)

    landmark = Column(String(200), nullable=True)

    city = Column(String(100), nullable=False)

    state = Column(String(100), nullable=False)

    pincode = Column(String(20), nullable=False)

    latitude = Column(Float, nullable=True)

    longitude = Column(Float, nullable=True)

    is_default = Column(Boolean, default=False)

    user = relationship("User")