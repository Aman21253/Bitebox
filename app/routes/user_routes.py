from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db

from app.middleware.auth_middleware import get_current_user

from app.models.user_model import User
from app.models.user_address_model import UserAddress

from app.schemas.user_schema import (
    UserProfileUpdate,
    UserAddressCreate,
    UserAddressUpdate
)

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
    body: UserProfileUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    current_user.name = body.name
    current_user.phone = body.phone

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


# ─────────────────────────────────────────────────────────────
# Add Address
# ─────────────────────────────────────────────────────────────

@router.post("/addresses")
def add_address(
    body: UserAddressCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    existing_default = db.query(UserAddress).filter(
        UserAddress.user_id == current_user.id,
        UserAddress.is_default == True
    ).first()

    new_address = UserAddress(
        user_id=current_user.id,
        label=body.label,
        address_line=body.address_line,
        landmark=body.landmark,
        city=body.city,
        state=body.state,
        pincode=body.pincode,
        latitude=body.latitude,
        longitude=body.longitude,
        is_default=False if existing_default else True
    )

    db.add(new_address)
    db.commit()
    db.refresh(new_address)

    return {
        "message": "Address added successfully",
        "address_id": new_address.id
    }


# ─────────────────────────────────────────────────────────────
# Get All Addresses
# ─────────────────────────────────────────────────────────────

@router.get("/addresses")
def get_addresses(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    addresses = db.query(UserAddress).filter(
        UserAddress.user_id == current_user.id
    ).all()

    return addresses


# ─────────────────────────────────────────────────────────────
# Update Address
# ─────────────────────────────────────────────────────────────

@router.put("/addresses/{address_id}")
def update_address(
    address_id: int,
    body: UserAddressUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    address = db.query(UserAddress).filter(
        UserAddress.id == address_id,
        UserAddress.user_id == current_user.id
    ).first()

    if not address:
        raise HTTPException(
            status_code=404,
            detail="Address not found"
        )

    address.label = body.label
    address.address_line = body.address_line
    address.landmark = body.landmark
    address.city = body.city
    address.state = body.state
    address.pincode = body.pincode
    address.latitude = body.latitude
    address.longitude = body.longitude

    db.commit()

    return {
        "message": "Address updated successfully"
    }


# ─────────────────────────────────────────────────────────────
# Delete Address
# ─────────────────────────────────────────────────────────────

@router.delete("/addresses/{address_id}")
def delete_address(
    address_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    address = db.query(UserAddress).filter(
        UserAddress.id == address_id,
        UserAddress.user_id == current_user.id
    ).first()

    if not address:
        raise HTTPException(
            status_code=404,
            detail="Address not found"
        )

    db.delete(address)

    db.commit()

    return {
        "message": "Address deleted successfully"
    }


# ─────────────────────────────────────────────────────────────
# Set Default Address
# ─────────────────────────────────────────────────────────────

@router.put("/addresses/{address_id}/default")
def set_default_address(
    address_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    address = db.query(UserAddress).filter(
        UserAddress.id == address_id,
        UserAddress.user_id == current_user.id
    ).first()

    if not address:
        raise HTTPException(
            status_code=404,
            detail="Address not found"
        )

    db.query(UserAddress).filter(
        UserAddress.user_id == current_user.id
    ).update({
        "is_default": False
    })

    address.is_default = True

    db.commit()

    return {
        "message": "Default address updated successfully"
    }