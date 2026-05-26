from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from jose import JWTError
from pydantic import BaseModel

from app.database.db import get_db

from app.models.user_model import User
from app.models.refresh_token_model import RefreshToken
from app.models.otp_model import OtpToken

from app.schemas.user_schema import UserRegister, UserLogin

from app.schemas.otp_schema import (
    ResetPasswordRequest,
    ChangePasswordRequest
)

from app.utils.hash import (
    hash_password,
    verify_password
)

from app.utils.jwt_handler import (
    create_access_token,
    create_refresh_token,
    decode_token,
    REFRESH_TOKEN_EXPIRE_DAYS
)

from app.middleware.auth_middleware import get_current_user

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


class TokenRefreshRequest(BaseModel):
    refresh_token: str


# ─────────────────────────────────────────────────────────────
# Register User
# ─────────────────────────────────────────────────────────────

@router.post("/register")
def register_user(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    verified_otp = db.query(OtpToken).filter(
        OtpToken.phone == user.phone,
        OtpToken.purpose == "registration",
        OtpToken.is_verified == True
    ).order_by(
        OtpToken.created_at.desc()
    ).first()

    if not verified_otp:
        raise HTTPException(
            status_code=400,
            detail="Phone number not verified"
        )

    existing_user = db.query(User).filter(
        (User.email == user.email) |
        (User.phone == user.phone)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email or phone already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)

    verified_otp.is_used = True

    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


# ─────────────────────────────────────────────────────────────
# Login User
# ─────────────────────────────────────────────────────────────

@router.post("/login")
def login_user(
    request: Request,
    user: UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        existing_user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )

    if existing_user.status != "active":
        raise HTTPException(
            status_code=403,
            detail="Account is inactive or banned"
        )

    access_token = create_access_token(
        data={
            "sub": str(existing_user.id),
            "email": existing_user.email,
            "role": existing_user.role.value
        }
    )

    refresh_token = create_refresh_token(
        data={
            "sub": str(existing_user.id)
        }
    )

    refresh_token_entry = RefreshToken(
        user_id=existing_user.id,
        token=refresh_token,
        device_info=request.headers.get("user-agent"),
        ip_address=request.client.host,
        expires_at=datetime.now(timezone.utc) + timedelta(
            days=REFRESH_TOKEN_EXPIRE_DAYS
        )
    )

    db.add(refresh_token_entry)
    db.commit()

    return {
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email,
            "role": existing_user.role.value
        }
    }


# ─────────────────────────────────────────────────────────────
# Refresh Access Token
# ─────────────────────────────────────────────────────────────

@router.post("/token/refresh")
def refresh_access_token(
    body: TokenRefreshRequest,
    db: Session = Depends(get_db)
):

    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid or expired refresh token"
    )

    try:

        payload = decode_token(body.refresh_token)

        if not payload:
            raise credentials_exception

        if payload.get("type") != "refresh":
            raise credentials_exception

        user_id = payload.get("sub")

        if not user_id:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    stored_token = db.query(RefreshToken).filter(
        RefreshToken.token == body.refresh_token,
        RefreshToken.is_revoked == False
    ).first()

    if not stored_token:
        raise credentials_exception

    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    if not user:
        raise credentials_exception

    if user.status != "active":
        raise credentials_exception

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "role": user.role.value
        }
    )

    new_refresh_token = create_refresh_token(
        data={
            "sub": str(user.id)
        }
    )

    stored_token.is_revoked = True

    new_token_entry = RefreshToken(
        user_id=user.id,
        token=new_refresh_token,
        expires_at=datetime.now(timezone.utc) + timedelta(
            days=REFRESH_TOKEN_EXPIRE_DAYS
        )
    )

    db.add(new_token_entry)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }


# ─────────────────────────────────────────────────────────────
# Logout
# ─────────────────────────────────────────────────────────────

@router.post("/logout")
def logout(
    body: TokenRefreshRequest,
    db: Session = Depends(get_db)
):

    stored_token = db.query(RefreshToken).filter(
        RefreshToken.token == body.refresh_token,
        RefreshToken.is_revoked == False
    ).first()

    if not stored_token:
        raise HTTPException(
            status_code=404,
            detail="Token not found"
        )

    stored_token.is_revoked = True

    db.commit()

    return {
        "message": "Logged out successfully"
    }


# ─────────────────────────────────────────────────────────────
# Logout From All Devices
# ─────────────────────────────────────────────────────────────

@router.post("/logout-all")
def logout_all_devices(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db.query(RefreshToken).filter(
        RefreshToken.user_id == current_user.id,
        RefreshToken.is_revoked == False
    ).update({
        "is_revoked": True
    })

    db.commit()

    return {
        "message": "Logged out from all devices"
    }


# ─────────────────────────────────────────────────────────────
# Reset Password
# ─────────────────────────────────────────────────────────────

@router.post("/reset-password")
def reset_password(
    body: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    otp_record = db.query(OtpToken).filter(
        OtpToken.phone == body.phone,
        OtpToken.code == body.otp_code,
        OtpToken.purpose == "password_reset",
        OtpToken.is_verified == True
    ).order_by(
        OtpToken.created_at.desc()
    ).first()

    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail="Invalid or unverified OTP"
        )

    user = db.query(User).filter(
        User.phone == body.phone
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.password = hash_password(
        body.new_password
    )

    otp_record.is_used = True

    db.commit()

    return {
        "message": "Password reset successful"
    }


# ─────────────────────────────────────────────────────────────
# Change Password
# ─────────────────────────────────────────────────────────────

@router.post("/change-password")
def change_password(
    body: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if not verify_password(
        body.current_password,
        current_user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    current_user.password = hash_password(
        body.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully"
    }


# ─────────────────────────────────────────────────────────────
# Current Logged-In User
# ─────────────────────────────────────────────────────────────

# ─────────────────────────────────────────────────────────────
# Current Logged-In User
# ─────────────────────────────────────────────────────────────

@router.get("/me")
def get_me(

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db)

):

    restaurant = None

    # ─────────────────────────────────────
    # LOAD RESTAURANT INFO
    # ─────────────────────────────────────

    if current_user.role.value == "restaurant":

        from app.models.restaurant_model import (
            Restaurant
        )

        restaurant = db.query(
            Restaurant
        ).filter(
            Restaurant.owner_id ==
            current_user.id
        ).first()

    return {

        "id":
        current_user.id,
        "name":
        current_user.name,
        "email":
        current_user.email,
        "phone":
        current_user.phone,
        "role":
        current_user.role.value,
        "status":
        current_user.status,
        "restaurant":

        {
            "id":
            restaurant.id,
            "approval_status":
            restaurant.approval_status,
            "rejection_reason":
            restaurant.rejection_reason

        } if restaurant else None
    }