from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship

from app.database.db import Base


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    name = Column(String(150), nullable=False)
    description = Column(String(500), nullable=True)
    address = Column(String(300), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(20), nullable=False)
    phone = Column(String(20), nullable=False)
    cuisine = Column(String(150), nullable=True)
    delivery_radius = Column(Float, default=5.0)
    status = Column(String(50), default="pending")
    image_url = Column(String(500), nullable=True)
    owner = relationship("User")