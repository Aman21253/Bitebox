from fastapi import (
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.middleware.auth_middleware import (
    get_current_user
)

from app.models.restaurant_model import (
    Restaurant
)


def get_restaurant_record():

    def checker(

        current_user=Depends(
            get_current_user
        ),

        db: Session = Depends(get_db)

    ):

        restaurant = db.query(
            Restaurant
        ).filter(

            Restaurant.owner_id ==
            current_user.id

        ).first()

        if not restaurant:

            raise HTTPException(
                status_code=404,
                detail="Restaurant not found"
            )

        return restaurant

    return checker


def require_approved_restaurant():

    def checker(

        restaurant=Depends(
            get_restaurant_record()
        )

    ):

        if (
            restaurant.approval_status
            != "approved"
        ):

            raise HTTPException(
                status_code=403,
                detail={
                    "message":
                    "Restaurant not approved",

                    "approval_status":
                    restaurant.approval_status,

                    "rejection_reason":
                    restaurant.rejection_reason
                }
            )

        return restaurant

    return checker