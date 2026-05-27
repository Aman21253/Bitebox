from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.restaurant_model import Restaurant

from app.schemas.restaurant_schema import (
    RestaurantCreate
)

from app.middleware.role_middleware import (
    require_role
)

from app.utils.geocode import (
    get_coordinates
)

router = APIRouter(
    prefix="/api/restaurants",
    tags=["Restaurant Management"]
)


# ─────────────────────────────────────────────
# CREATE RESTAURANT
# ─────────────────────────────────────────────

@router.post("/register")
def create_restaurant(

    restaurant: RestaurantCreate,

    current_user=Depends(
        require_role(["restaurant"])
    ),

    db: Session = Depends(get_db)
):

    existing_restaurant = db.query(
        Restaurant
    ).filter(
        Restaurant.owner_id == current_user.id
    ).first()

    if existing_restaurant:

        raise HTTPException(
            status_code=400,
            detail="Restaurant already exists"
        )

    # ─────────────────────────────────────
    # FULL ADDRESS
    # ─────────────────────────────────────

    full_address = f"""
    {restaurant.address},
    {restaurant.city},
    {restaurant.state},
    {restaurant.pincode}
    """

    # ─────────────────────────────────────
    # AUTO GET LAT/LNG
    # ─────────────────────────────────────

    latitude, longitude = get_coordinates(
        full_address
    )

    print("────────────")
    print("Restaurant Address:", full_address)
    print("Latitude:", latitude)
    print("Longitude:", longitude)

    # ─────────────────────────────────────
    # CREATE RESTAURANT
    # ─────────────────────────────────────

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
        delivery_radius=restaurant.delivery_radius,
        latitude=latitude,
        longitude=longitude
    )

    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)

    return {

        "message":
        "Restaurant created successfully",

        "restaurant_id":
        new_restaurant.id,

        "latitude":
        new_restaurant.latitude,

        "longitude":
        new_restaurant.longitude
    }


# ─────────────────────────────────────────────
# GET MY RESTAURANT
# ─────────────────────────────────────────────

@router.get("/my-restaurant")
def get_my_restaurant(

    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):
    restaurant = db.query(
        Restaurant
    ).filter(
        Restaurant.owner_id == current_user.id
    ).first()

    if not restaurant:

        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )
    return restaurant