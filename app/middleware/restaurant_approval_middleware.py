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


def require_approved_restaurant():

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

        if (
            restaurant.approval_status
            != "approved"
        ):

            raise HTTPException(
                status_code=403,
                detail=f"""
Restaurant is currently {
restaurant.approval_status
}
"""
            )

        return restaurant

    return checker