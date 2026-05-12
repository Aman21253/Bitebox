from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.otp_model import OtpToken
from app.schemas.otp_schema import OtpSendRequest, OtpVerifyRequest
from app.services.sms_service import generate_otp, send_otp_sms

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

OTP_EXPIRE_MINUTES = 10
OTP_RATE_LIMIT = 5          # max OTPs per phone per hour (per spec)


# ── Send OTP ──────────────────────────────────────────────────────────────────

@router.post("/otp/send")
def send_otp(body: OtpSendRequest, db: Session = Depends(get_db)):

    # ── Rate limit: max 5 requests per phone in the last hour ─────────────────
    one_hour_ago = datetime.now(timezone.utc) - timedelta(hours=1)

    recent_count = (
        db.query(OtpToken)
        .filter(
            OtpToken.phone == body.phone,
            OtpToken.purpose == body.purpose,
            OtpToken.created_at >= one_hour_ago,
        )
        .count()
    )

    if recent_count >= OTP_RATE_LIMIT:
        raise HTTPException(
            status_code=429,
            detail="Too many OTP requests. Please try again after 1 hour."
        )

    # ── Invalidate any previous unused OTPs for same phone + purpose ──────────
    db.query(OtpToken).filter(
        OtpToken.phone == body.phone,
        OtpToken.purpose == body.purpose,
        OtpToken.is_used == False,
    ).update({"is_used": True})

    # ── Generate and store new OTP ────────────────────────────────────────────
    code = generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)

    otp_record = OtpToken(
        phone=body.phone,
        code=code,
        purpose=body.purpose,
        expires_at=expires_at,
    )

    db.add(otp_record)
    db.commit()

    # ── Send SMS ──────────────────────────────────────────────────────────────
    sms_sent = send_otp_sms(body.phone, code, body.purpose)

    if not sms_sent:
        raise HTTPException(
            status_code=502,
            detail="Failed to send OTP. Please try again."
        )

    return {
        "message": f"OTP sent to {body.phone}",
        "expires_in_minutes": OTP_EXPIRE_MINUTES
    }


# ── Verify OTP ────────────────────────────────────────────────────────────────

@router.post("/otp/verify")
def verify_otp(body: OtpVerifyRequest, db: Session = Depends(get_db)):

    now = datetime.now(timezone.utc)

    otp_record = (
        db.query(OtpToken)
        .filter(
            OtpToken.phone == body.phone,
            OtpToken.code == body.code,
            OtpToken.purpose == body.purpose,
            OtpToken.is_used == False,
            OtpToken.expires_at > now,
        )
        .order_by(OtpToken.created_at.desc())
        .first()
    )

    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP"
        )

    # ── Mark OTP as used ──────────────────────────────────────────────────────
    otp_record.is_used = True
    db.commit()

    return {
        "message": "OTP verified successfully",
        "phone": body.phone,
        "purpose": body.purpose
    }