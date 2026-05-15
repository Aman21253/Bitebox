from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db

from app.middleware.auth_middleware import get_current_user

from app.models.user_model import User

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)


# ─────────────────────────────────────────────────────────────
# Current User
# ─────────────────────────────────────────────────────────────

@router.get("/me")
def get_me(current_user=Depends(get_current_user)):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role.value,
        "status": current_user.status
    }


# ─────────────────────────────────────────────────────────────
# Update Profile
# ─────────────────────────────────────────────────────────────

@router.put("/profile")
def update_profile(
    name: str,
    phone: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    current_user.name = name
    current_user.phone = phone

    db.commit()

    return {
        "message": "Profile updated successfully"
    }


# ─────────────────────────────────────────────────────────────
# Deactivate Account
# ─────────────────────────────────────────────────────────────

@router.put("/deactivate")
def deactivate_account(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    current_user.status = "inactive"

    db.commit()

    return {
        "message": "Account deactivated successfully"
    }