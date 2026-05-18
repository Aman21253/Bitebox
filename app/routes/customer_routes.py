from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db

from app.middleware.role_middleware import require_role

from app.models.cart_model import Cart
from app.models.cart_item_model import CartItem
from app.models.cart_item_addon_model import CartItemAddon

from app.models.menu_item_model import MenuItem
from app.models.menu_item_variant_model import MenuItemVariant
from app.models.menu_item_addon_model import MenuItemAddon

from app.schemas.cart_schema import (
    AddToCartRequest,
    UpdateCartQuantityRequest
)

router = APIRouter(
    prefix="/api/customer",
    tags=["Customer"]
)


# ─────────────────────────────────────────────────────────────
# Utility Function
# ─────────────────────────────────────────────────────────────

def recalculate_cart_total(cart_id: int, db: Session):

    cart = db.query(Cart).filter(
        Cart.id == cart_id
    ).first()

    cart_items = db.query(CartItem).filter(
        CartItem.cart_id == cart_id
    ).all()

    total = sum(
        item.total_price for item in cart_items
    )

    cart.total_amount = total

    db.commit()

    return total


# ─────────────────────────────────────────────────────────────
# Customer Dashboard
# ─────────────────────────────────────────────────────────────

@router.get("/dashboard")
def customer_dashboard(
    current_user=Depends(
        require_role(["customer"])
    )
):

    return {
        "message": f"Welcome Customer {current_user.name}"
    }


# ─────────────────────────────────────────────────────────────
# Add To Cart
# ─────────────────────────────────────────────────────────────

@router.post("/cart/add")
def add_to_cart(
    body: AddToCartRequest,
    current_user=Depends(
        require_role(["customer"])
    ),
    db: Session = Depends(get_db)
):

    # ─────────────────────────────────────────────────
    # Quantity Validation
    # ─────────────────────────────────────────────────

    if body.quantity <= 0:

        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than 0"
        )

    # ─────────────────────────────────────────────────
    # Menu Item Validation
    # ─────────────────────────────────────────────────

    menu_item = db.query(MenuItem).filter(
        MenuItem.id == body.menu_item_id,
        MenuItem.is_available == True
    ).first()

    if not menu_item:

        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )

    # ─────────────────────────────────────────────────
    # Get/Create Cart
    # ─────────────────────────────────────────────────

    existing_cart = db.query(Cart).filter(
        Cart.customer_id == current_user.id
    ).first()

    # ─────────────────────────────────────────────────
    # Restaurant Conflict Validation
    # ─────────────────────────────────────────────────

    if existing_cart:

        if existing_cart.restaurant_id != menu_item.restaurant_id:

            raise HTTPException(
                status_code=400,
                detail="You can only order from one restaurant at a time"
            )

    else:

        existing_cart = Cart(
            customer_id=current_user.id,
            restaurant_id=menu_item.restaurant_id,
            total_amount=0
        )

        db.add(existing_cart)
        db.commit()
        db.refresh(existing_cart)

    # ─────────────────────────────────────────────────
    # Variant Pricing
    # ─────────────────────────────────────────────────

    item_price = menu_item.base_price

    selected_variant = None

    if body.variant_id:

        selected_variant = db.query(MenuItemVariant).filter(
            MenuItemVariant.id == body.variant_id,
            MenuItemVariant.menu_item_id == menu_item.id
        ).first()

        if not selected_variant:

            raise HTTPException(
                status_code=404,
                detail="Variant not found"
            )

        item_price = selected_variant.price

    # ─────────────────────────────────────────────────
    # Addon Pricing
    # ─────────────────────────────────────────────────

    addon_total = 0

    addons = []

    if body.addon_ids:

        addons = db.query(MenuItemAddon).filter(
            MenuItemAddon.id.in_(body.addon_ids),
            MenuItemAddon.menu_item_id == menu_item.id
        ).all()

        addon_total = sum(
            addon.price for addon in addons
        )

    final_price = (
        item_price + addon_total
    ) * body.quantity

    # ─────────────────────────────────────────────────
    # Check Existing Cart Item
    # ─────────────────────────────────────────────────

    existing_cart_item = db.query(CartItem).filter(
        CartItem.cart_id == existing_cart.id,
        CartItem.menu_item_id == menu_item.id,
        CartItem.variant_id == body.variant_id
    ).first()

    if existing_cart_item:

        existing_cart_item.quantity += body.quantity

        existing_cart_item.total_price += final_price

        db.commit()

        total = recalculate_cart_total(
            existing_cart.id,
            db
        )

        return {
            "message": "Cart updated successfully",
            "cart_total": total
        }

    # ─────────────────────────────────────────────────
    # Create Cart Item
    # ─────────────────────────────────────────────────

    cart_item = CartItem(
        cart_id=existing_cart.id,
        menu_item_id=menu_item.id,
        variant_id=body.variant_id,
        quantity=body.quantity,
        item_price=item_price,
        total_price=final_price
    )

    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)

    # ─────────────────────────────────────────────────
    # Save Addons
    # ─────────────────────────────────────────────────

    for addon in addons:

        cart_addon = CartItemAddon(
            cart_item_id=cart_item.id,
            addon_id=addon.id,
            addon_price=addon.price
        )

        db.add(cart_addon)

    db.commit()

    # ─────────────────────────────────────────────────
    # Update Cart Total
    # ─────────────────────────────────────────────────

    total = recalculate_cart_total(
        existing_cart.id,
        db
    )

    return {
        "message": "Item added to cart successfully",
        "cart_total": total
    }


# ─────────────────────────────────────────────────────────────
# Get Cart
# ─────────────────────────────────────────────────────────────

@router.get("/cart")
def get_cart(
    current_user=Depends(
        require_role(["customer"])
    ),
    db: Session = Depends(get_db)
):

    cart = db.query(Cart).filter(
        Cart.customer_id == current_user.id
    ).first()

    if not cart:

        return {
            "message": "Cart is empty"
        }

    cart_items = db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).all()

    formatted_items = []

    for item in cart_items:

        menu_item = db.query(MenuItem).filter(
            MenuItem.id == item.menu_item_id
        ).first()

        variant_name = None

        if item.variant_id:

            variant = db.query(MenuItemVariant).filter(
                MenuItemVariant.id == item.variant_id
            ).first()

            if variant:
                variant_name = variant.name

        addons = db.query(CartItemAddon).filter(
            CartItemAddon.cart_item_id == item.id
        ).all()

        addon_data = []

        for addon in addons:

            addon_item = db.query(MenuItemAddon).filter(
                MenuItemAddon.id == addon.addon_id
            ).first()

            if addon_item:

                addon_data.append({
                    "addon_id": addon_item.id,
                    "addon_name": addon_item.name,
                    "addon_price": addon_item.price
                })

        formatted_items.append({
            "cart_item_id": item.id,
            "menu_item_id": menu_item.id,
            "item_name": menu_item.name,
            "variant_name": variant_name,
            "quantity": item.quantity,
            "item_price": item.item_price,
            "total_price": item.total_price,
            "addons": addon_data
        })

    return {
        "cart_id": cart.id,
        "restaurant_id": cart.restaurant_id,
        "total_amount": cart.total_amount,
        "items": formatted_items
    }


# ─────────────────────────────────────────────────────────────
# Update Quantity
# ─────────────────────────────────────────────────────────────

@router.put("/cart/item/{cart_item_id}")
def update_cart_quantity(
    cart_item_id: int,
    body: UpdateCartQuantityRequest,
    current_user=Depends(
        require_role(["customer"])
    ),
    db: Session = Depends(get_db)
):

    if body.quantity <= 0:

        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than 0"
        )

    cart = db.query(Cart).filter(
        Cart.customer_id == current_user.id
    ).first()

    if not cart:

        raise HTTPException(
            status_code=404,
            detail="Cart not found"
        )

    cart_item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not cart_item:

        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    single_item_price = (
        cart_item.total_price / cart_item.quantity
    )

    cart_item.quantity = body.quantity

    cart_item.total_price = (
        single_item_price * body.quantity
    )

    db.commit()

    total = recalculate_cart_total(
        cart.id,
        db
    )

    return {
        "message": "Quantity updated successfully",
        "cart_total": total
    }


# ─────────────────────────────────────────────────────────────
# Remove Item From Cart
# ─────────────────────────────────────────────────────────────

@router.delete("/cart/item/{cart_item_id}")
def remove_cart_item(
    cart_item_id: int,
    current_user=Depends(
        require_role(["customer"])
    ),
    db: Session = Depends(get_db)
):

    cart = db.query(Cart).filter(
        Cart.customer_id == current_user.id
    ).first()

    if not cart:

        raise HTTPException(
            status_code=404,
            detail="Cart not found"
        )

    cart_item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not cart_item:

        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    db.query(CartItemAddon).filter(
        CartItemAddon.cart_item_id == cart_item.id
    ).delete()

    db.delete(cart_item)

    db.commit()

    remaining_items = db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).all()

    if not remaining_items:

        db.delete(cart)

        db.commit()

        return {
            "message": "Cart cleared"
        }

    total = recalculate_cart_total(
        cart.id,
        db
    )

    return {
        "message": "Item removed successfully",
        "cart_total": total
    }