from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.middleware.role_middleware import (
    require_role
)

from app.models.restaurant_model import Restaurant
from app.models.order_model import Order
from app.models.driver_model import Driver
from datetime import datetime
from app.services.dispatch_service import (
    auto_assign_driver
)

from app.websockets.connection_manager import (
    manager
)

router = APIRouter(
    prefix="/api/restaurant",
    tags=["Restaurant Orders"]
)


# ─────────────────────────────────────────────
# GET RESTAURANT ORDERS
# ─────────────────────────────────────────────

@router.get("/orders")
def get_restaurant_orders(

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

    orders = db.query(Order).filter(
        Order.restaurant_id == restaurant.id
    ).order_by(Order.id.desc()).all()

    return orders


# ─────────────────────────────────────────────
# UPDATE ORDER STATUS
# ─────────────────────────────────────────────

@router.put("/orders/{order_id}/status")
async def update_order_status(

    order_id: int,

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

    order = db.query(Order).filter(

        Order.id == order_id,

        Order.restaurant_id == restaurant.id

    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    status = body.get("status")

    allowed_statuses = [

        "confirmed",
        "preparing",
        "ready_for_pickup",
        "cancelled",
        "delivered"

    ]

    if status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    order.status = status

    # IF READY FOR PICKUP
    # DRIVER CAN SEE THIS

    if status == "ready_for_pickup":

        order.delivery_status = (
            "waiting_for_driver"
        )

    db.commit()

    # REALTIME EVENT

    await manager.broadcast({

        "type": "order_status_updated",

        "order_id": order.id,

        "status": status

    })

    return {
        "message":
        f"Order updated to {status}"
    }


# ─────────────────────────────────────────────
# AUTO ASSIGN DRIVER
# ─────────────────────────────────────────────

@router.put(
    "/orders/{order_id}/auto-assign"
)
async def auto_assign_driver(

    order_id: int,

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

    order = db.query(Order).filter(

        Order.id == order_id,

        Order.restaurant_id == restaurant.id

    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    # FIND AVAILABLE DRIVER

    driver = db.query(Driver).filter(

        Driver.is_online == True,

        Driver.is_available == True

    ).first()

    if not driver:

        raise HTTPException(
            status_code=404,
            detail="No available drivers"
        )

    # ASSIGN DRIVER

    order.driver_id = driver.id

    order.delivery_status = (
        "driver_assigned"
    )

    driver.is_available = False

    db.commit()

    # REALTIME EVENT

    await manager.broadcast({

        "type": "driver_assigned",

        "order_id": order.id,

        "driver_id": driver.id

    })

    return {
        "message":
        "Driver assigned successfully"
    }