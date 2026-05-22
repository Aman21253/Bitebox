from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.middleware.role_middleware import (
    require_role
)

from app.models.cart_model import Cart
from app.models.cart_item_model import CartItem

from app.models.cart_item_addon_model import (
    CartItemAddon
)

from app.models.menu_item_variant_model import (
    MenuItemVariant
)

from app.models.menu_item_addon_model import (
    MenuItemAddon
)

from app.models.menu_item_model import (
    MenuItem
)

from app.models.order_model import Order

from app.models.driver_model import Driver

from app.models.order_item_model import (
    OrderItem
)

from app.models.order_item_addon_model import (
    OrderItemAddon
)

from app.schemas.order_schema import (
    PlaceOrderRequest
)

from app.websockets.connection_manager import (
    manager
)

router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)


# ─────────────────────────────────────────────
# PLACE ORDER
# ─────────────────────────────────────────────

@router.post("/create")
async def place_order(

    body: PlaceOrderRequest,

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)

):

    try:

        # ─────────────────────────────────────
        # GET CART
        # ─────────────────────────────────────

        cart = db.query(Cart).filter(
            Cart.customer_id == current_user.id
        ).first()

        if not cart:

            raise HTTPException(
                status_code=404,
                detail="Cart is empty"
            )

        # ─────────────────────────────────────
        # GET CART ITEMS
        # ─────────────────────────────────────

        cart_items = db.query(CartItem).filter(
            CartItem.cart_id == cart.id
        ).all()

        if not cart_items:

            raise HTTPException(
                status_code=404,
                detail="Cart items not found"
            )

        # ─────────────────────────────────────
        # CREATE ORDER
        # ─────────────────────────────────────

        new_order = Order(

            customer_id=current_user.id,

            restaurant_id=cart.restaurant_id,

            total_amount=cart.total_amount,

            delivery_address=body.delivery_address,

            status="pending",

            payment_status="completed",

            delivery_status="waiting_for_driver"

        )

        db.add(new_order)

        db.commit()

        db.refresh(new_order)

        # ─────────────────────────────────────
        # CREATE ORDER ITEMS
        # ─────────────────────────────────────

        for cart_item in cart_items:

            variant_name = None

            # GET VARIANT NAME

            if cart_item.variant_id:

                variant = db.query(
                    MenuItemVariant
                ).filter(
                    MenuItemVariant.id ==
                    cart_item.variant_id
                ).first()

                if variant:

                    variant_name = variant.name

            # GET MENU ITEM

            menu_item = db.query(
                MenuItem
            ).filter(
                MenuItem.id ==
                cart_item.menu_item_id
            ).first()

            if not menu_item:

                raise HTTPException(
                    status_code=404,
                    detail="Menu item not found"
                )

            # CREATE ORDER ITEM

            order_item = OrderItem(

                order_id=new_order.id,

                menu_item_id=cart_item.menu_item_id,

                item_name=menu_item.name,

                variant_name=variant_name,

                quantity=cart_item.quantity,

                item_price=cart_item.item_price,

                total_price=cart_item.total_price

            )

            db.add(order_item)

            db.commit()

            db.refresh(order_item)

            # ─────────────────────────────────
            # COPY ADDONS
            # ─────────────────────────────────

            cart_addons = db.query(
                CartItemAddon
            ).filter(
                CartItemAddon.cart_item_id ==
                cart_item.id
            ).all()

            for cart_addon in cart_addons:

                addon = db.query(
                    MenuItemAddon
                ).filter(
                    MenuItemAddon.id ==
                    cart_addon.addon_id
                ).first()

                if addon:

                    order_addon = OrderItemAddon(

                        order_item_id=order_item.id,

                        addon_name=addon.name,

                        addon_price=addon.price

                    )

                    db.add(order_addon)

        db.commit()

        # ─────────────────────────────────────
        # CLEAR CART
        # ─────────────────────────────────────

        for cart_item in cart_items:

            db.query(CartItemAddon).filter(
                CartItemAddon.cart_item_id ==
                cart_item.id
            ).delete()

        db.query(CartItem).filter(
            CartItem.cart_id == cart.id
        ).delete()

        db.delete(cart)

        db.commit()

        # ─────────────────────────────────────
        # REALTIME EVENT
        # ─────────────────────────────────────

        await manager.broadcast({

            "type": "new_order",

            "message": "🔥 New order received",

            "order_id": new_order.id,

            "restaurant_id":
            new_order.restaurant_id,

            "total_amount":
            new_order.total_amount

        })

        # ─────────────────────────────────────
        # RESPONSE
        # ─────────────────────────────────────

        return {

            "message":
            "Order placed successfully",

            "order_id":
            new_order.id
        }

    except Exception as e:

        print("ORDER ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ─────────────────────────────────────────────
# GET CUSTOMER ORDERS
# ─────────────────────────────────────────────

@router.get("/my-orders")
def get_my_orders(

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)

):

    orders = db.query(Order).filter(
        Order.customer_id == current_user.id
    ).order_by(
        Order.id.desc()
    ).all()

    formatted_orders = []

    for order in orders:

        formatted_orders.append({

            "id": order.id,

            "status": order.status,

            "payment_status":
            order.payment_status,

            "delivery_status":
            order.delivery_status,

            "total_amount":
            order.total_amount,

            "delivery_address":
            order.delivery_address,

            "estimated_delivery_time":
            order.estimated_delivery_time

        })

    return formatted_orders


# ─────────────────────────────────────────────
# LIVE TRACK ORDER
# ─────────────────────────────────────────────

@router.get("/track/{order_id}")
def track_order(

    order_id: int,

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)

):

    order = db.query(Order).filter(

        Order.id == order_id,

        Order.customer_id ==
        current_user.id

    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    driver_data = None

    if order.driver_id:

        driver = db.query(Driver).filter(
            Driver.id == order.driver_id
        ).first()

        if driver:

            driver_data = {

                "id": driver.id,

                "full_name":
                driver.full_name,

                "phone":
                driver.phone,

                "vehicle_type":
                driver.vehicle_type,

                "vehicle_number":
                driver.vehicle_number,

                "latitude":
                driver.current_latitude,

                "longitude":
                driver.current_longitude,

                "is_online":
                driver.is_online
            }

    return {

        "order_id":
        order.id,

        "status":
        order.status,

        "delivery_status":
        order.delivery_status,

        "estimated_delivery_time":
        order.estimated_delivery_time,

        "delivery_address":
        order.delivery_address,

        "total_amount":
        order.total_amount,

        "driver":
        driver_data
    }