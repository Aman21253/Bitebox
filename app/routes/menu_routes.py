from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db

from app.middleware.role_middleware import require_role

from app.models.menu_item_image_model import MenuItemImage
from app.models.restaurant_model import Restaurant
from app.models.menu_category_model import MenuCategory
from app.models.menu_item_model import MenuItem
from app.models.menu_item_variant_model import MenuItemVariant
from app.models.menu_item_addon_model import MenuItemAddon

from app.schemas.menu_schema import (
    MenuCategoryCreate,
    MenuCategoryUpdate,
    MenuItemCreate,
    MenuItemUpdate,
    MenuItemVariantCreate,
    MenuItemAddonCreate
)

router = APIRouter(
    prefix="/api/menu",
    tags=["Menu"]
)


# ─────────────────────────────────────────────────────────────
# Helper Function
# ─────────────────────────────────────────────────────────────

def get_restaurant_by_owner(current_user, db):

    restaurant = db.query(Restaurant).filter(
        Restaurant.owner_id == current_user.id
    ).first()

    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    return restaurant


# ─────────────────────────────────────────────────────────────
# Create Menu Category
# ─────────────────────────────────────────────────────────────

@router.post("/categories")
def create_menu_category(
    body: MenuCategoryCreate,
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = get_restaurant_by_owner(
        current_user,
        db
    )

    if restaurant.status != "approved":
        raise HTTPException(
            status_code=403,
            detail="Restaurant not approved"
        )

    category = MenuCategory(
        restaurant_id=restaurant.id,
        name=body.name,
        description=body.description
    )

    db.add(category)
    db.commit()
    db.refresh(category)

    return {
        "message": "Menu category created successfully",
        "category_id": category.id
    }


# ─────────────────────────────────────────────────────────────
# Get Categories
# ─────────────────────────────────────────────────────────────

@router.get("/categories")
def get_menu_categories(
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = get_restaurant_by_owner(
        current_user,
        db
    )

    categories = db.query(MenuCategory).filter(
        MenuCategory.restaurant_id == restaurant.id
    ).all()

    return categories


# ─────────────────────────────────────────────────────────────
# Update Category
# ─────────────────────────────────────────────────────────────

@router.put("/categories/{category_id}")
def update_category(
    category_id: int,
    body: MenuCategoryUpdate,
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = get_restaurant_by_owner(
        current_user,
        db
    )

    category = db.query(MenuCategory).filter(
        MenuCategory.id == category_id,
        MenuCategory.restaurant_id == restaurant.id
    ).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    category.name = body.name
    category.description = body.description
    category.is_active = body.is_active

    db.commit()

    return {
        "message": "Category updated successfully"
    }


# ─────────────────────────────────────────────────────────────
# Delete Category
# ─────────────────────────────────────────────────────────────

@router.delete("/categories/{category_id}")
def delete_category(
    category_id: int,
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = get_restaurant_by_owner(
        current_user,
        db
    )

    category = db.query(MenuCategory).filter(
        MenuCategory.id == category_id,
        MenuCategory.restaurant_id == restaurant.id
    ).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    category.is_active = False

    db.commit()

    return {
        "message": "Category deleted successfully"
    }


# ─────────────────────────────────────────────────────────────
# Create Menu Item
# ─────────────────────────────────────────────────────────────

@router.post("/items")
def create_menu_item(
    body: MenuItemCreate,
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = get_restaurant_by_owner(
        current_user,
        db
    )

    if restaurant.status != "approved":
        raise HTTPException(
            status_code=403,
            detail="Restaurant not approved"
        )

    category = db.query(MenuCategory).filter(
        MenuCategory.id == body.category_id,
        MenuCategory.restaurant_id == restaurant.id,
        MenuCategory.is_active == True
    ).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    item = MenuItem(

       restaurant_id=restaurant.id,
       category_id=body.category_id,
       name=body.name,
       description=body.description,
       image_url=body.image_url,
       is_veg=body.is_veg,
       base_price=body.base_price,
       preparation_time=body.preparation_time,
       calories=body.calories,
       serving_info=body.serving_info,
       spice_level=body.spice_level,
       allergens=body.allergens,
       packaging_charge=body.packaging_charge,
       tags=body.tags,
       recommended=body.recommended
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    for image in body.images:

        menu_image = MenuItemImage(
            menu_item_id=item.id,
            image_url=image
        )
        db.add(menu_image)

    db.commit()
    return {
        "message": "Menu item created successfully",
        "item_id": item.id
    }


# ─────────────────────────────────────────────────────────────
# Get Menu Items
# ─────────────────────────────────────────────────────────────

@router.get("/items")
def get_menu_items(
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = get_restaurant_by_owner(
        current_user,
        db
    )

    items = db.query(MenuItem).filter(
        MenuItem.restaurant_id == restaurant.id
    ).all()

    return items


# ─────────────────────────────────────────────────────────────
# Update Menu Item
# ─────────────────────────────────────────────────────────────

@router.put("/items/{item_id}")
def update_menu_item(
    item_id: int,
    body: MenuItemUpdate,
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = get_restaurant_by_owner(
        current_user,
        db
    )

    item = db.query(MenuItem).filter(
        MenuItem.id == item_id,
        MenuItem.restaurant_id == restaurant.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )

    item.category_id = body.category_id
    item.name = body.name
    item.description = body.description
    item.image_url = body.image_url
    item.is_veg = body.is_veg
    item.base_price = body.base_price
    item.preparation_time = body.preparation_time
    item.is_available = body.is_available

    db.commit()

    return {
        "message": "Menu item updated successfully"
    }


# ─────────────────────────────────────────────────────────────
# Delete Menu Item
# ─────────────────────────────────────────────────────────────

@router.delete("/items/{item_id}")
def delete_menu_item(
    item_id: int,
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = get_restaurant_by_owner(
        current_user,
        db
    )

    item = db.query(MenuItem).filter(
        MenuItem.id == item_id,
        MenuItem.restaurant_id == restaurant.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )

    item.is_available = False

    db.commit()

    return {
        "message": "Menu item deleted successfully"
    }


# ─────────────────────────────────────────────────────────────
# Toggle Availability
# ─────────────────────────────────────────────────────────────

@router.put("/items/{item_id}/availability")
def toggle_item_availability(
    item_id: int,
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = get_restaurant_by_owner(
        current_user,
        db
    )

    item = db.query(MenuItem).filter(
        MenuItem.id == item_id,
        MenuItem.restaurant_id == restaurant.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )

    item.is_available = not item.is_available

    db.commit()

    return {
        "message": "Availability updated successfully",
        "is_available": item.is_available
    }


# ─────────────────────────────────────────────────────────────
# Add Variant
# ─────────────────────────────────────────────────────────────

@router.post("/items/{item_id}/variants")
def add_variant(
    item_id: int,
    body: MenuItemVariantCreate,
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = get_restaurant_by_owner(
        current_user,
        db
    )

    item = db.query(MenuItem).filter(
        MenuItem.id == item_id,
        MenuItem.restaurant_id == restaurant.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )

    variant = MenuItemVariant(
        menu_item_id=item.id,
        name=body.name,
        price=body.price
    )

    db.add(variant)
    db.commit()
    db.refresh(variant)

    return {
        "message": "Variant added successfully",
        "variant_id": variant.id
    }


# ─────────────────────────────────────────────────────────────
# Add Addon
# ─────────────────────────────────────────────────────────────

@router.post("/items/{item_id}/addons")
def add_addon(
    item_id: int,
    body: MenuItemAddonCreate,
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = get_restaurant_by_owner(
        current_user,
        db
    )

    item = db.query(MenuItem).filter(
        MenuItem.id == item_id,
        MenuItem.restaurant_id == restaurant.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )

    addon = MenuItemAddon(
        menu_item_id=item.id,
        name=body.name,
        price=body.price
    )

    db.add(addon)
    db.commit()
    db.refresh(addon)

    return {
        "message": "Addon added successfully",
        "addon_id": addon.id
    }