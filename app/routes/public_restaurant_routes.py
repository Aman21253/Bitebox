from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.restaurant_model import Restaurant
from app.models.menu_category_model import MenuCategory
from app.models.menu_item_model import MenuItem
from app.models.menu_item_variant_model import MenuItemVariant
from app.models.menu_item_addon_model import MenuItemAddon

router = APIRouter(
    prefix="/api/restaurants",
    tags=["Public Restaurants"]
)


# ─────────────────────────────────────────────────────────────
# GET ALL RESTAURANTS
# ─────────────────────────────────────────────────────────────

@router.get("")
def get_restaurants(
    db: Session = Depends(get_db)
):

    restaurants = db.query(Restaurant).filter(
        Restaurant.status.in_(["approved", "pending"])
    ).all()

    formatted_restaurants = []

    for restaurant in restaurants:

        total_items = db.query(MenuItem).filter(
            MenuItem.restaurant_id == restaurant.id,
            MenuItem.is_available == True
        ).count()

        formatted_restaurants.append({
            "id": restaurant.id,
            "name": restaurant.name,
            "description": restaurant.description,
            "image_url": restaurant.image_url,
            "cuisine": restaurant.cuisine,
            "city": restaurant.city,
            "rating": 4.5,
            "delivery_time": "25-30 min",
            "delivery_fee": 40,
            "total_items": total_items
        })

    return formatted_restaurants


# ─────────────────────────────────────────────────────────────
# GET SINGLE RESTAURANT
# ─────────────────────────────────────────────────────────────

@router.get("/{restaurant_id}")
def get_restaurant_details(
    restaurant_id: int,
    db: Session = Depends(get_db)
):

    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id,
        Restaurant.status == "approved"
    ).first()

    if not restaurant:

        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    total_categories = db.query(MenuCategory).filter(
        MenuCategory.restaurant_id == restaurant.id,
        MenuCategory.is_active == True
    ).count()

    total_items = db.query(MenuItem).filter(
        MenuItem.restaurant_id == restaurant.id,
        MenuItem.is_available == True
    ).count()

    return {
        "id": restaurant.id,
        "name": restaurant.name,
        "description": restaurant.description,
        "image_url": restaurant.image_url,
        "address": restaurant.address,
        "city": restaurant.city,
        "state": restaurant.state,
        "pincode": restaurant.pincode,
        "phone": restaurant.phone,
        "cuisine": restaurant.cuisine,
        "delivery_radius": restaurant.delivery_radius,
        "rating": 4.5,
        "delivery_time": "25-30 min",
        "delivery_fee": 40,
        "total_categories": total_categories,
        "total_items": total_items
    }


# ─────────────────────────────────────────────────────────────
# GET RESTAURANT MENU
# ─────────────────────────────────────────────────────────────

@router.get("/{restaurant_id}/menu")
def get_restaurant_menu(
    restaurant_id: int,
    db: Session = Depends(get_db)
):

    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id,
        Restaurant.status == "approved"
    ).first()

    if not restaurant:

        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    categories = db.query(MenuCategory).filter(
        MenuCategory.restaurant_id == restaurant.id,
        MenuCategory.is_active == True
    ).all()

    formatted_categories = []

    for category in categories:

        items = db.query(MenuItem).filter(
            MenuItem.category_id == category.id,
            MenuItem.is_available == True
        ).all()

        formatted_items = []

        for item in items:

            variants = db.query(MenuItemVariant).filter(
                MenuItemVariant.menu_item_id == item.id
            ).all()

            addons = db.query(MenuItemAddon).filter(
                MenuItemAddon.menu_item_id == item.id
            ).all()

            formatted_variants = []

            for variant in variants:

                formatted_variants.append({
                    "id": variant.id,
                    "name": variant.name,
                    "price": variant.price
                })

            formatted_addons = []

            for addon in addons:

                formatted_addons.append({
                    "id": addon.id,
                    "name": addon.name,
                    "price": addon.price
                })

            formatted_items.append({
                "id": item.id,
                "name": item.name,
                "description": item.description,
                "image_url": item.image_url,
                "is_veg": item.is_veg,
                "base_price": item.base_price,
                "preparation_time": item.preparation_time,
                "variants": formatted_variants,
                "addons": formatted_addons
            })

        formatted_categories.append({
            "category_id": category.id,
            "category_name": category.name,
            "items": formatted_items
        })

    return {
        "restaurant_id": restaurant.id,
        "restaurant_name": restaurant.name,
        "categories": formatted_categories
    }