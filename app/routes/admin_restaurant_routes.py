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

from app.models.restaurant_model import (
    Restaurant
)

router = APIRouter(
    prefix="/api/admin/restaurants",
    tags=["Admin Restaurant"]
)


# GET ALL RESTAURANTS

@router.get("/")
def get_all_restaurants(

    current_user=Depends(
        require_role(["admin"])
    ),

    db: Session = Depends(get_db)
):

    restaurants = db.query(
        Restaurant
    ).all()

    return restaurants


# GET PENDING RESTAURANTS

@router.get("/pending")
def get_pending_restaurants(

    current_user=Depends(
        require_role(["admin"])
    ),

    db: Session = Depends(get_db)
):

    restaurants = db.query(
        Restaurant
    ).filter(

        Restaurant.approval_status
        == "pending"

    ).all()

    return restaurants


# APPROVE RESTAURANT

@router.put("/{restaurant_id}/approve")
def approve_restaurant(

    restaurant_id: int,

    current_user=Depends(
        require_role(["admin"])
    ),

    db: Session = Depends(get_db)
):

    restaurant = db.query(
        Restaurant
    ).filter(

        Restaurant.id ==
        restaurant_id

    ).first()

    if not restaurant:

        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    restaurant.approval_status = "approved"

    restaurant.rejection_reason = None

    restaurant.approved_by = current_user.id

    db.commit()

    return {
        "message":
        "Restaurant approved successfully"
    }


# REJECT RESTAURANT

@router.put("/{restaurant_id}/reject")
def reject_restaurant(

    restaurant_id: int,

    reason: str,

    current_user=Depends(
        require_role(["admin"])
    ),

    db: Session = Depends(get_db)
):

    restaurant = db.query(
        Restaurant
    ).filter(

        Restaurant.id ==
        restaurant_id

    ).first()

    if not restaurant:

        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    restaurant.approval_status = "rejected"

    restaurant.rejection_reason = reason

    db.commit()

    return {
        "message":
        "Restaurant rejected successfully"
    }


# SUSPEND RESTAURANT

@router.put("/{restaurant_id}/suspend")
def suspend_restaurant(

    restaurant_id: int,

    current_user=Depends(
        require_role(["admin"])
    ),

    db: Session = Depends(get_db)
):

    restaurant = db.query(
        Restaurant
    ).filter(

        Restaurant.id ==
        restaurant_id

    ).first()

    if not restaurant:

        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    restaurant.approval_status = "suspended"

    db.commit()

    return {
        "message":
        "Restaurant suspended successfully"
    }