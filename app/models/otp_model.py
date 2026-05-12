from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.db import Base


class OtpToken(Base):
    __tablename__ = "otp_tokens"

    id = Column(Integer, primary_key=True, index=True)

    phone = Column(String(20), nullable=False, index=True)

    code = Column(String(6), nullable=False)

    # Purpose: registration | login | password_reset
    purpose = Column(String(30), nullable=False, default="registration")

    is_used = Column(Boolean, default=False)

    expires_at = Column(DateTime(timezone=True), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())