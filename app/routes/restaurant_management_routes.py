from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.restaurant_model import Restaurant
from app.schemas.restaurant_schema import RestaurantCreate

from app.middleware.role_middleware import require_role

router = APIRouter(
    prefix="/api/restaurants",
    tags=["Restaurant Management"]
)


@router.post("/create")
def create_restaurant(
    restaurant: RestaurantCreate,
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    existing_restaurant = db.query(Restaurant).filter(
        Restaurant.owner_id == current_user.id
    ).first()

    if existing_restaurant:
        raise HTTPException(
            status_code=400,
            detail="Restaurant already exists"
        )

    new_restaurant = Restaurant(
        owner_id=current_user.id,
        name=restaurant.name,
        description=restaurant.description,
        address=restaurant.address,
        city=restaurant.city,
        state=restaurant.state,
        pincode=restaurant.pincode,
        phone=restaurant.phone,
        cuisine=restaurant.cuisine,
        delivery_radius=restaurant.delivery_radius
    )

    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)

    return {
        "message": "Restaurant created successfully",
        "restaurant_id": new_restaurant.id
    }


@router.get("/my-restaurant")
def get_my_restaurant(
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