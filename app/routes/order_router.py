from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.middleware.role_middleware import require_role

from app.models.cart_model import Cart
from app.models.cart_item_model import CartItem
from app.models.cart_item_addon_model import CartItemAddon
from app.models.menu_item_variant_model import MenuItemVariant
from app.models.menu_item_addon_model import MenuItemAddon
from app.models.menu_item_model import MenuItem
from app.models.order_model import Order
from app.models.driver_model import Driver
from app.models.order_item_model import OrderItem
from app.models.order_item_addon_model import OrderItemAddon
from app.models.user_model import User

from app.schemas.order_schema import PlaceOrderRequest
from app.websockets.connection_manager import manager
from app.services.sms_service import generate_otp, send_otp_sms

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
    current_user=Depends(require_role(["customer"])),
    db: Session = Depends(get_db)
):
    try:
        cart = db.query(Cart).filter(
            Cart.customer_id == current_user.id
        ).first()

        if not cart:
            raise HTTPException(status_code=404, detail="Cart is empty")

        cart_items = db.query(CartItem).filter(
            CartItem.cart_id == cart.id
        ).all()

        if not cart_items:
            raise HTTPException(status_code=404, detail="Cart items not found")

        grouped_items = {}
        for item in cart_items:
            if item.restaurant_id not in grouped_items:
                grouped_items[item.restaurant_id] = []
            grouped_items[item.restaurant_id].append(item)

        created_orders = []

        for restaurant_id, items in grouped_items.items():

            restaurant_total = sum(item.total_price for item in items)

            # ─────────────────────────────────────
            # GENERATE DELIVERY OTP AT ORDER TIME
            # ─────────────────────────────────────
            delivery_otp = generate_otp()

            new_order = Order(
                customer_id=current_user.id,
                restaurant_id=restaurant_id,
                total_amount=restaurant_total,
                delivery_address=body.delivery_address,
                status="pending",
                payment_status="completed",
                delivery_status="waiting_for_driver",
                delivery_otp=delivery_otp,
                delivery_otp_verified=False
            )

            db.add(new_order)
            db.commit()
            db.refresh(new_order)

            for cart_item in items:
                variant_name = None

                if cart_item.variant_id:
                    variant = db.query(MenuItemVariant).filter(
                        MenuItemVariant.id == cart_item.variant_id
                    ).first()
                    if variant:
                        variant_name = variant.name

                menu_item = db.query(MenuItem).filter(
                    MenuItem.id == cart_item.menu_item_id
                ).first()

                if not menu_item:
                    continue

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

                cart_addons = db.query(CartItemAddon).filter(
                    CartItemAddon.cart_item_id == cart_item.id
                ).all()

                for cart_addon in cart_addons:
                    addon = db.query(MenuItemAddon).filter(
                        MenuItemAddon.id == cart_addon.addon_id
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
            # SMS OTP TO CUSTOMER
            # ─────────────────────────────────────
            customer = db.query(User).filter(
                User.id == current_user.id
            ).first()

            if customer and customer.phone:
                send_otp_sms(
                    phone=customer.phone,
                    code=delivery_otp,
                    purpose="delivery"
                )

            created_orders.append({
                "order_id": new_order.id,
                "restaurant_id": restaurant_id,
                "amount": restaurant_total
            })

            await manager.broadcast({
                "type": "new_order",
                "message": "New order received",
                "order_id": new_order.id,
                "restaurant_id": restaurant_id,
                "total_amount": restaurant_total
            })

        # ─────────────────────────────────────
        # CLEAR CART
        # ─────────────────────────────────────
        for cart_item in cart_items:
            db.query(CartItemAddon).filter(
                CartItemAddon.cart_item_id == cart_item.id
            ).delete()

        db.query(CartItem).filter(
            CartItem.cart_id == cart.id
        ).delete()

        db.delete(cart)
        db.commit()

        return {
            "message": "Orders placed successfully",
            "orders": created_orders
        }

    except Exception as e:
        print("ORDER ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# GET CUSTOMER ORDERS
# ─────────────────────────────────────────────

@router.get("/my-orders")
def get_my_orders(
    current_user=Depends(require_role(["customer"])),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).filter(
        Order.customer_id == current_user.id
    ).order_by(Order.id.desc()).all()

    formatted_orders = []
    for order in orders:
        formatted_orders.append({
            "id": order.id,
            "restaurant_id": order.restaurant_id,
            "status": order.status,
            "payment_status": order.payment_status,
            "delivery_status": order.delivery_status,
            "total_amount": order.total_amount,
            "delivery_address": order.delivery_address,
            "estimated_delivery_time": order.estimated_delivery_time
        })

    return formatted_orders


# ─────────────────────────────────────────────
# LIVE TRACK ORDER
# ─────────────────────────────────────────────

@router.get("/track/{order_id}")
def track_order(
    order_id: int,
    current_user=Depends(require_role(["customer"])),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.customer_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    driver_data = None
    if order.driver_id:
        driver = db.query(Driver).filter(Driver.id == order.driver_id).first()
        if driver:
            driver_data = {
                "id": driver.id,
                "full_name": driver.full_name,
                "phone": driver.phone,
                "vehicle_type": driver.vehicle_type,
                "vehicle_number": driver.vehicle_number,
                "latitude": driver.current_latitude,
                "longitude": driver.current_longitude,
                "is_online": driver.is_online
            }

    return {
        "order_id": order.id,
        "restaurant_id": order.restaurant_id,
        "status": order.status,
        "delivery_status": order.delivery_status,
        "estimated_delivery_time": order.estimated_delivery_time,
        "delivery_address": order.delivery_address,
        "total_amount": order.total_amount,
        "driver": driver_data
    }