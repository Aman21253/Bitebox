from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from pydantic import BaseModel

from app.database.db import get_db

from app.middleware.role_middleware import (
    require_role
)

from app.models.restaurant_model import (
    Restaurant
)

from app.services.notification_service import (
    create_notification
)

router = APIRouter(
    prefix="/api/admin/restaurants",
    tags=["Admin Restaurant"]
)


class RejectRestaurantBody(BaseModel):
    reason: str


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
async def approve_restaurant(

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

    await create_notification(

        db=db,

        user_id=restaurant.owner_id,

        title="Restaurant Approved",

        message=f"{restaurant.name} has been approved and is now live.",

        notification_type="restaurant_approval"
    )

    return {
        "message":
        "Restaurant approved successfully"
    }


# REJECT RESTAURANT

@router.put("/{restaurant_id}/reject")
async def reject_restaurant(

    restaurant_id: int,

    body: RejectRestaurantBody,

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

    restaurant.rejection_reason = body.reason

    db.commit()

    await create_notification(

        db=db,

        user_id=restaurant.owner_id,

        title="Restaurant Rejected",

        message=body.reason,

        notification_type="restaurant_rejection"
    )

    return {
        "message":
        "Restaurant rejected successfully"
    }


# SUSPEND RESTAURANT

@router.put("/{restaurant_id}/suspend")
async def suspend_restaurant(

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

    await create_notification(

        db=db,
        user_id=restaurant.owner_id,
        title="Restaurant Suspended",
        message="Your restaurant has been suspended by admin.",
        notification_type="restaurant_suspension"
    )

    return {
        "message":
        "Restaurant suspended successfully"
    }