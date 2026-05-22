from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session
from sqlalchemy import func

from datetime import datetime

from app.middleware.role_middleware import (
    require_role
)

from app.middleware.restaurant_approval_middleware import (
    require_approved_restaurant
)

from app.database.db import get_db

from app.models.restaurant_model import Restaurant
from app.models.order_model import Order
from app.models.user_model import User
from app.models.menu_item_model import MenuItem

from app.schemas.order_status_schema import (
    UpdateOrderLifecycleRequest
)

from app.utils.order_status import (
    ORDER_STATUS_FLOW
)

from app.websockets.connection_manager import (
    manager
)

router = APIRouter(
    prefix="/api/restaurant",
    tags=["Restaurant"]
)


# ─────────────────────────────────────────────
# DASHBOARD STATS
# ─────────────────────────────────────────────

@router.get("/dashboard/stats")
def restaurant_dashboard_stats(

    current_user=Depends(
        require_role(["restaurant"])
    ),

    restaurant=Depends(
        require_approved_restaurant()
    ),

    db: Session = Depends(get_db)
):

    total_orders = db.query(
        Order
    ).filter(
        Order.restaurant_id == restaurant.id
    ).count()

    total_revenue = db.query(
        func.sum(Order.total_amount)
    ).filter(
        Order.restaurant_id == restaurant.id,
        Order.payment_status == "paid"
    ).scalar()

    preparing_orders = db.query(
        Order
    ).filter(
        Order.restaurant_id == restaurant.id,
        Order.status == "preparing"
    ).count()

    active_deliveries = db.query(
        Order
    ).filter(
        Order.restaurant_id == restaurant.id,
        Order.delivery_status.in_([
            "driver_assigned",
            "picked_up",
            "on_the_way"
        ])
    ).count()

    total_menu_items = db.query(
        MenuItem
    ).filter(
        MenuItem.restaurant_id == restaurant.id
    ).count()

    completed_orders = db.query(
        Order
    ).filter(
        Order.restaurant_id == restaurant.id,
        Order.status == "completed"
    ).count()

    cancelled_orders = db.query(
        Order
    ).filter(
        Order.restaurant_id == restaurant.id,
        Order.status == "cancelled"
    ).count()

    return {

        "total_orders":
        total_orders,

        "total_revenue":
        total_revenue or 0,

        "preparing_orders":
        preparing_orders,

        "active_deliveries":
        active_deliveries,

        "total_menu_items":
        total_menu_items,

        "completed_orders":
        completed_orders,

        "cancelled_orders":
        cancelled_orders
    }


# ─────────────────────────────────────────────
# RECENT ORDERS
# ─────────────────────────────────────────────

@router.get("/dashboard/recent-orders")
def get_recent_orders(

    current_user=Depends(
        require_role(["restaurant"])
    ),

    restaurant=Depends(
        require_approved_restaurant()
    ),

    db: Session = Depends(get_db)
):

    orders = db.query(Order).filter(
        Order.restaurant_id == restaurant.id
    ).order_by(
        Order.id.desc()
    ).limit(10).all()

    return orders


# ─────────────────────────────────────────────
# DASHBOARD
# ─────────────────────────────────────────────

@router.get("/dashboard")
def restaurant_dashboard(

    current_user=Depends(
        require_role(["restaurant"])
    ),

    restaurant=Depends(
        require_approved_restaurant()
    )
):

    return {
        "message":
        f"Welcome Restaurant Owner {current_user.name}"
    }


# ─────────────────────────────────────────────
# GET RESTAURANT ORDERS
# ─────────────────────────────────────────────

@router.get("/orders")
def get_restaurant_orders(

    current_user=Depends(
        require_role(["restaurant"])
    ),

    restaurant=Depends(
        require_approved_restaurant()
    ),

    db: Session = Depends(get_db)
):

    orders = db.query(Order).filter(
        Order.restaurant_id == restaurant.id
    ).order_by(
        Order.id.desc()
    ).all()

    return orders


# ─────────────────────────────────────────────
# UPDATE ORDER STATUS
# ─────────────────────────────────────────────

@router.put("/orders/{order_id}/status")
async def update_order_status(

    order_id: int,

    body: UpdateOrderLifecycleRequest,

    current_user=Depends(
        require_role(["restaurant"])
    ),

    restaurant=Depends(
        require_approved_restaurant()
    ),

    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(

        Order.id == order_id,

        Order.restaurant_id ==
        restaurant.id

    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    current_status = order.status

    allowed_statuses = ORDER_STATUS_FLOW.get(
        current_status,
        []
    )

    if body.status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail=f"Cannot move from {current_status} to {body.status}"
        )

    # UPDATE STATUS

    order.status = body.status

    # ─────────────────────────────────────
    # TIMESTAMPS
    # ─────────────────────────────────────

    if body.status == "confirmed":

        order.confirmed_at = datetime.utcnow()

    elif body.status == "preparing":

        order.preparing_at = datetime.utcnow()

    elif body.status == "ready_for_pickup":

        order.ready_for_pickup_at = datetime.utcnow()

        order.delivery_status = "waiting_for_driver"

    elif body.status == "completed":

        order.delivered_at = datetime.utcnow()

    elif body.status == "cancelled":

        order.cancelled_at = datetime.utcnow()

        order.cancellation_reason = body.reason

        order.delivery_status = "cancelled"

    elif body.status == "rejected":

        order.rejection_reason = body.reason

        order.refund_status = "processing"

        order.delivery_status = "cancelled"

    db.commit()

    db.refresh(order)

    # ─────────────────────────────────────
    # REALTIME SOCKET EVENT
    # ─────────────────────────────────────

    await manager.broadcast({

        "type":
        "order_status_updated",

        "order_id":
        order.id,

        "status":
        order.status,

        "delivery_status":
        order.delivery_status
    })

    return {

        "message":
        "Order status updated successfully",

        "status":
        order.status
    }


# ─────────────────────────────────────────────
# ASSIGN DRIVER
# ─────────────────────────────────────────────

@router.put("/orders/{order_id}/assign-driver")
async def assign_driver(

    order_id: int,

    driver_id: int,

    current_user=Depends(
        require_role(["restaurant"])
    ),

    restaurant=Depends(
        require_approved_restaurant()
    ),

    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(

        Order.id == order_id,

        Order.restaurant_id ==
        restaurant.id

    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    if order.status != "ready_for_pickup":

        raise HTTPException(
            status_code=400,
            detail="Order is not ready for pickup"
        )

    driver = db.query(User).filter(

        User.id == driver_id,

        User.role == "driver",

        User.is_available == True,

        User.status == "active"

    ).first()

    if not driver:

        raise HTTPException(
            status_code=404,
            detail="Available driver not found"
        )

    order.driver_id = driver.id

    order.delivery_status = "driver_assigned"

    driver.is_available = False

    db.commit()

    await manager.broadcast({

        "type":
        "driver_assigned",

        "order_id":
        order.id,

        "driver_id":
        driver.id
    })

    return {

        "message":
        "Driver assigned successfully",

        "driver_id":
        driver.id
    }


# ─────────────────────────────────────────────
# AUTO ASSIGN DRIVER
# ─────────────────────────────────────────────

@router.put("/orders/{order_id}/auto-assign")
async def auto_assign_driver(

    order_id: int,

    current_user=Depends(
        require_role(["restaurant"])
    ),

    restaurant=Depends(
        require_approved_restaurant()
    ),

    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(

        Order.id == order_id,

        Order.restaurant_id ==
        restaurant.id

    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    if order.status != "ready_for_pickup":

        raise HTTPException(
            status_code=400,
            detail="Order must be ready for pickup"
        )

    available_driver = db.query(User).filter(

        User.role == "driver",

        User.is_available == True,

        User.status == "active"

    ).first()

    if not available_driver:

        raise HTTPException(
            status_code=404,
            detail="No available drivers"
        )

    order.driver_id = available_driver.id

    order.delivery_status = "driver_assigned"

    available_driver.is_available = False

    db.commit()

    await manager.broadcast({

        "type":
        "driver_auto_assigned",

        "order_id":
        order.id,

        "driver_id":
        available_driver.id
    })

    return {

        "message":
        "Driver auto-assigned successfully",

        "driver_id":
        available_driver.id
    }