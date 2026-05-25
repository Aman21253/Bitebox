from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.middleware.role_middleware import (
    require_role
)

from app.models.user_address_model import (
    UserAddress
)

from app.schemas.address_schema import (
    CreateAddressRequest,
    UpdateAddressRequest
)

router = APIRouter(
    prefix="/api/customer/addresses",
    tags=["Customer Addresses"]
)


# ─────────────────────────────────────────────
# CREATE ADDRESS
# ─────────────────────────────────────────────

@router.post("")
def create_address(

    body: CreateAddressRequest,

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)
):

    # REMOVE OLD DEFAULT

    if body.is_default:

        db.query(UserAddress).filter(

            UserAddress.user_id ==
            current_user.id

        ).update({

            "is_default": False
        })

    # FIRST ADDRESS AUTO DEFAULT

    existing_count = db.query(
        UserAddress
    ).filter(
        UserAddress.user_id ==
        current_user.id
    ).count()

    is_default = (
        True if existing_count == 0
        else body.is_default
    )

    address = UserAddress(

        user_id=current_user.id,

        full_name=body.full_name,
        phone=body.phone,

        label=body.label,

        address_line_1=body.address_line_1,
        address_line_2=body.address_line_2,

        landmark=body.landmark,

        city=body.city,
        state=body.state,
        pincode=body.pincode,

        latitude=body.latitude,
        longitude=body.longitude,

        is_default=is_default
    )

    db.add(address)

    db.commit()

    db.refresh(address)

    return {

        "message":
        "Address added successfully",

        "address":
        address
    }


# ─────────────────────────────────────────────
# GET ALL ADDRESSES
# ─────────────────────────────────────────────

@router.get("")
def get_addresses(

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)
):

    addresses = db.query(
        UserAddress
    ).filter(
        UserAddress.user_id ==
        current_user.id
    ).order_by(
        UserAddress.is_default.desc(),
        UserAddress.id.desc()
    ).all()

    return addresses


# ─────────────────────────────────────────────
# UPDATE ADDRESS
# ─────────────────────────────────────────────

@router.put("/{address_id}")
def update_address(

    address_id: int,

    body: UpdateAddressRequest,

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)
):

    address = db.query(
        UserAddress
    ).filter(

        UserAddress.id == address_id,

        UserAddress.user_id ==
        current_user.id

    ).first()

    if not address:

        raise HTTPException(
            status_code=404,
            detail="Address not found"
        )

    for key, value in body.dict(
        exclude_unset=True
    ).items():

        setattr(address, key, value)

    db.commit()

    db.refresh(address)

    return {

        "message":
        "Address updated successfully",

        "address":
        address
    }


# ─────────────────────────────────────────────
# DELETE ADDRESS
# ─────────────────────────────────────────────

@router.delete("/{address_id}")
def delete_address(

    address_id: int,

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)
):

    address = db.query(
        UserAddress
    ).filter(

        UserAddress.id == address_id,

        UserAddress.user_id ==
        current_user.id

    ).first()

    if not address:

        raise HTTPException(
            status_code=404,
            detail="Address not found"
        )

    db.delete(address)

    db.commit()

    return {
        "message":
        "Address deleted successfully"
    }


# ─────────────────────────────────────────────
# SET DEFAULT ADDRESS
# ─────────────────────────────────────────────

@router.put("/{address_id}/default")
def set_default_address(

    address_id: int,

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)
):

    address = db.query(
        UserAddress
    ).filter(

        UserAddress.id == address_id,

        UserAddress.user_id ==
        current_user.id

    ).first()

    if not address:

        raise HTTPException(
            status_code=404,
            detail="Address not found"
        )

    # REMOVE OLD DEFAULT

    db.query(UserAddress).filter(

        UserAddress.user_id ==
        current_user.id

    ).update({

        "is_default": False
    })

    address.is_default = True

    db.commit()

    return {
        "message":
        "Default address updated"
    }