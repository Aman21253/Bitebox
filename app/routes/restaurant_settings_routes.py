from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.middleware.role_middleware import require_role

from app.models.restaurant_model import Restaurant

router = APIRouter(
    prefix="/api/restaurant/settings",
    tags=["Restaurant Settings"]
)


# GET SETTINGS

@router.get("/")
def get_restaurant_settings(
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = db.query(Restaurant).filter(
        Restaurant.owner_id == current_user.id
    ).first()

    if not restaurant:

        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    return restaurant


# UPDATE SETTINGS

@router.put("/")
def update_restaurant_settings(
    body: dict,
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = db.query(Restaurant).filter(
        Restaurant.owner_id == current_user.id
    ).first()

    if not restaurant:

        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    restaurant.name = body.get(
        "name",
        restaurant.name
    )

    restaurant.description = body.get(
        "description",
        restaurant.description
    )

    restaurant.cuisine = body.get(
        "cuisine",
        restaurant.cuisine
    )

    restaurant.phone = body.get(
        "phone",
        restaurant.phone
    )

    restaurant.image_url = body.get(
        "image_url",
        restaurant.image_url
    )

    restaurant.banner_image = body.get(
        "banner_image",
        restaurant.banner_image
    )

    restaurant.delivery_radius = body.get(
        "delivery_radius",
        restaurant.delivery_radius
    )

    restaurant.delivery_fee = body.get(
        "delivery_fee",
        restaurant.delivery_fee
    )

    restaurant.minimum_order = body.get(
        "minimum_order",
        restaurant.minimum_order
    )

    restaurant.estimated_delivery_time = body.get(
        "estimated_delivery_time",
        restaurant.estimated_delivery_time
    )

    restaurant.is_open = body.get(
        "is_open",
        restaurant.is_open
    )

    restaurant.opening_time = body.get(
        "opening_time",
        restaurant.opening_time
    )

    restaurant.closing_time = body.get(
        "closing_time",
        restaurant.closing_time
    )

    db.commit()

    return {
        "message": "Restaurant settings updated successfully"
    }