from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.otp_model import OtpToken
from app.models.user_model import User

from app.schemas.otp_schema import (
    OtpSendRequest,
    OtpVerifyRequest,
    ResendOtpRequest,
    ForgotPasswordRequest
)

from app.services.sms_service import (
    generate_otp,
    send_otp_sms
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

OTP_EXPIRE_MINUTES = 10
OTP_RATE_LIMIT = 5
MAX_VERIFY_ATTEMPTS = 5


# ─────────────────────────────────────────────────────────────
# Send OTP
# ─────────────────────────────────────────────────────────────

@router.post("/otp/send")
def send_otp(
    body: OtpSendRequest,
    db: Session = Depends(get_db)
):

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

    db.query(OtpToken).filter(
        OtpToken.phone == body.phone,
        OtpToken.purpose == body.purpose,
        OtpToken.is_used == False,
    ).update({
        "is_used": True
    })

    code = generate_otp()

    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=OTP_EXPIRE_MINUTES
    )

    otp_record = OtpToken(
        phone=body.phone,
        code=code,
        purpose=body.purpose,
        expires_at=expires_at,
    )

    db.add(otp_record)
    db.commit()

    sms_sent = send_otp_sms(
        body.phone,
        code,
        body.purpose
    )

    if not sms_sent:
        raise HTTPException(
            status_code=502,
            detail="Failed to send OTP"
        )

    return {
        "message": f"OTP sent to {body.phone}",
        "expires_in_minutes": OTP_EXPIRE_MINUTES
    }


# ─────────────────────────────────────────────────────────────
# Resend OTP
# ─────────────────────────────────────────────────────────────

@router.post("/otp/resend")
def resend_otp(
    body: ResendOtpRequest,
    db: Session = Depends(get_db)
):

    db.query(OtpToken).filter(
        OtpToken.phone == body.phone,
        OtpToken.purpose == body.purpose,
        OtpToken.is_used == False,
    ).update({
        "is_used": True
    })

    code = generate_otp()

    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=OTP_EXPIRE_MINUTES
    )

    otp_record = OtpToken(
        phone=body.phone,
        code=code,
        purpose=body.purpose,
        expires_at=expires_at,
    )

    db.add(otp_record)
    db.commit()

    sms_sent = send_otp_sms(
        body.phone,
        code,
        body.purpose
    )

    if not sms_sent:
        raise HTTPException(
            status_code=502,
            detail="Failed to resend OTP"
        )

    return {
        "message": "OTP resent successfully"
    }


# ─────────────────────────────────────────────────────────────
# Verify OTP
# ─────────────────────────────────────────────────────────────

@router.post("/otp/verify")
def verify_otp(
    body: OtpVerifyRequest,
    db: Session = Depends(get_db)
):

    now = datetime.now(timezone.utc)

    otp_record = (
        db.query(OtpToken)
        .filter(
            OtpToken.phone == body.phone,
            OtpToken.purpose == body.purpose,
            OtpToken.is_used == False,
        )
        .order_by(OtpToken.created_at.desc())
        .first()
    )

    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail="OTP not found"
        )

    if otp_record.attempt_count >= MAX_VERIFY_ATTEMPTS:
        raise HTTPException(
            status_code=429,
            detail="Too many invalid attempts"
        )

    if otp_record.expires_at < now:
        raise HTTPException(
            status_code=400,
            detail="OTP expired"
        )

    if otp_record.code != body.code:

        otp_record.attempt_count += 1

        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    otp_record.is_used = True
    otp_record.is_verified = True

    db.commit()

    return {
        "message": "OTP verified successfully",
        "phone": body.phone,
        "purpose": body.purpose
    }


# ─────────────────────────────────────────────────────────────
# Forgot Password
# ─────────────────────────────────────────────────────────────

@router.post("/forgot-password")
def forgot_password(
    body: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.phone == body.phone
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    code = generate_otp()

    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=OTP_EXPIRE_MINUTES
    )

    otp_record = OtpToken(
        phone=body.phone,
        code=code,
        purpose="password_reset",
        expires_at=expires_at,
    )

    db.add(otp_record)
    db.commit()

    sms_sent = send_otp_sms(
        body.phone,
        code,
        "password_reset"
    )

    if not sms_sent:
        raise HTTPException(
            status_code=502,
            detail="Failed to send OTP"
        )

    return {
        "message": "Password reset OTP sent successfully"
    }