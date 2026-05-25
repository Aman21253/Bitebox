from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

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


# ─────────────────────────────────────────────
# RECALCULATE CART TOTAL
# ─────────────────────────────────────────────

def recalculate_cart_total(
    cart_id: int,
    db: Session
):

    cart = db.query(Cart).filter(
        Cart.id == cart_id
    ).first()

    if not cart:
        return 0

    total = sum(
        item.total_price
        for item in cart.items
    )

    cart.total_amount = total

    db.commit()

    return total


# ─────────────────────────────────────────────
# CUSTOMER DASHBOARD
# ─────────────────────────────────────────────

@router.get("/dashboard")
def customer_dashboard(

    current_user=Depends(
        require_role(["customer"])
    )

):

    return {
        "message":
        f"Welcome Customer {current_user.name}"
    }


# ─────────────────────────────────────────────
# ADD TO CART
# ─────────────────────────────────────────────

@router.post("/cart/add")
def add_to_cart(

    body: AddToCartRequest,

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)
):

    # VALIDATE QUANTITY

    if body.quantity <= 0:

        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than 0"
        )

    # GET MENU ITEM

    menu_item = db.query(MenuItem).filter(

        MenuItem.id == body.menu_item_id,

        MenuItem.is_available == True

    ).first()

    if not menu_item:

        raise HTTPException(
            status_code=404,
            detail="Menu item not found"
        )

    # FIND EXISTING CART OF SAME RESTAURANT

    cart = db.query(Cart).filter(

        Cart.customer_id == current_user.id,

        Cart.restaurant_id ==
        menu_item.restaurant_id

    ).first()

    # CREATE CART

    if not cart:

        cart = Cart(

            customer_id=current_user.id,

            restaurant_id=
            menu_item.restaurant_id,

            total_amount=0
        )

        db.add(cart)

        db.commit()

        db.refresh(cart)

    # VARIANT PRICE

    item_price = menu_item.base_price

    if body.variant_id:

        variant = db.query(
            MenuItemVariant
        ).filter(

            MenuItemVariant.id ==
            body.variant_id,

            MenuItemVariant.menu_item_id ==
            menu_item.id

        ).first()

        if not variant:

            raise HTTPException(
                status_code=404,
                detail="Variant not found"
            )

        item_price = variant.price

    # ADDONS

    addons = []

    addon_total = 0

    if body.addon_ids:

        addons = db.query(
            MenuItemAddon
        ).filter(

            MenuItemAddon.id.in_(
                body.addon_ids
            ),

            MenuItemAddon.menu_item_id ==
            menu_item.id

        ).all()

        addon_total = sum(
            addon.price
            for addon in addons
        )

    # FINAL PRICE

    final_price = (

        item_price +

        addon_total

    ) * body.quantity

    # CHECK EXISTING CART ITEM

    existing_item = db.query(
        CartItem
    ).filter(

        CartItem.cart_id == cart.id,

        CartItem.menu_item_id ==
        menu_item.id,

        CartItem.variant_id ==
        body.variant_id

    ).first()

    # UPDATE EXISTING ITEM

    if existing_item:

        existing_item.quantity += (
            body.quantity
        )

        existing_item.total_price += (
            final_price
        )

        db.commit()

        total = recalculate_cart_total(
            cart.id,
            db
        )

        return {

            "message":
            "Cart updated successfully",

            "cart_id":
            cart.id,

            "restaurant_id":
            cart.restaurant_id,

            "cart_total":
            total
        }

    # ✅ FIXED: Added restaurant_id to CartItem
    cart_item = CartItem(

        cart_id=cart.id,

        restaurant_id=
        menu_item.restaurant_id,

        menu_item_id=menu_item.id,

        variant_id=body.variant_id,

        quantity=body.quantity,

        item_price=item_price,

        total_price=final_price
    )

    db.add(cart_item)

    db.commit()

    db.refresh(cart_item)

    # SAVE ADDONS

    for addon in addons:

        cart_addon = CartItemAddon(

            cart_item_id=cart_item.id,

            addon_id=addon.id,

            addon_price=addon.price
        )

        db.add(cart_addon)

    db.commit()

    # RECALCULATE TOTAL

    total = recalculate_cart_total(
        cart.id,
        db
    )

    return {

        "message":
        "Item added successfully",

        "cart_id":
        cart.id,

        "restaurant_id":
        cart.restaurant_id,

        "cart_total":
        total
    }


# ─────────────────────────────────────────────
# GET ALL CARTS
# ─────────────────────────────────────────────

@router.get("/cart")
def get_cart(

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)
):

    carts = db.query(Cart).options(

        joinedload(Cart.items)

    ).filter(

        Cart.customer_id == current_user.id

    ).all()

    if not carts:

        return {
            "message": "Cart is empty",
            "carts": []
        }

    formatted_carts = []

    for cart in carts:

        items_data = []

        for item in cart.items:

            menu_item = db.query(
                MenuItem
            ).filter(
                MenuItem.id == item.menu_item_id
            ).first()

            variant_name = None

            if item.variant_id:

                variant = db.query(
                    MenuItemVariant
                ).filter(

                    MenuItemVariant.id ==
                    item.variant_id

                ).first()

                if variant:
                    variant_name = variant.name

            addons = db.query(
                CartItemAddon
            ).filter(

                CartItemAddon.cart_item_id ==
                item.id

            ).all()

            addon_data = []

            for addon in addons:

                addon_item = db.query(
                    MenuItemAddon
                ).filter(

                    MenuItemAddon.id ==
                    addon.addon_id

                ).first()

                if addon_item:

                    addon_data.append({

                        "addon_id":
                        addon_item.id,

                        "addon_name":
                        addon_item.name,

                        "addon_price":
                        addon_item.price
                    })

            items_data.append({

                "cart_item_id":
                item.id,

                "menu_item_id":
                menu_item.id,

                "item_name":
                menu_item.name,

                "variant_name":
                variant_name,

                "quantity":
                item.quantity,

                "item_price":
                item.item_price,

                "total_price":
                item.total_price,

                "addons":
                addon_data
            })

        formatted_carts.append({

            "cart_id":
            cart.id,

            "restaurant_id":
            cart.restaurant_id,

            "total_amount":
            cart.total_amount,

            "items":
            items_data
        })

    return {
        "carts": formatted_carts
    }


# ─────────────────────────────────────────────
# UPDATE CART ITEM QUANTITY
# ─────────────────────────────────────────────

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

    cart_item = db.query(CartItem).join(
        Cart
    ).filter(

        Cart.customer_id == current_user.id,

        CartItem.id == cart_item_id

    ).first()

    if not cart_item:

        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    single_price = (
        cart_item.total_price /
        cart_item.quantity
    )

    cart_item.quantity = body.quantity

    cart_item.total_price = (
        single_price * body.quantity
    )

    db.commit()

    total = recalculate_cart_total(
        cart_item.cart_id,
        db
    )

    return {

        "message":
        "Quantity updated successfully",

        "cart_total":
        total
    }


# ─────────────────────────────────────────────
# REMOVE CART ITEM
# ─────────────────────────────────────────────

@router.delete("/cart/item/{cart_item_id}")
def remove_cart_item(

    cart_item_id: int,

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)
):

    cart_item = db.query(CartItem).join(
        Cart
    ).filter(

        Cart.customer_id == current_user.id,

        CartItem.id == cart_item_id

    ).first()

    if not cart_item:

        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    cart_id = cart_item.cart_id

    db.query(CartItemAddon).filter(

        CartItemAddon.cart_item_id ==
        cart_item.id

    ).delete()

    db.delete(cart_item)

    db.commit()

    remaining_items = db.query(
        CartItem
    ).filter(

        CartItem.cart_id == cart_id

    ).count()

    # DELETE EMPTY CART

    if remaining_items == 0:

        cart = db.query(Cart).filter(
            Cart.id == cart_id
        ).first()

        if cart:

            db.delete(cart)

            db.commit()

        return {
            "message":
            "Cart cleared successfully"
        }

    total = recalculate_cart_total(
        cart_id,
        db
    )

    return {

        "message":
        "Item removed successfully",

        "cart_total":
        total
    }