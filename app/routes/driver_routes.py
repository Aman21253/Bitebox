from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.middleware.role_middleware import require_role

from app.database.db import get_db

from app.models.order_model import Order
from app.models.user_model import User

from app.schemas.order_schema import (
    UpdateOrderStatusRequest
)

from app.schemas.driver_schema import (
    DriverAvailabilityRequest,
    DriverLocationUpdateRequest
)

router = APIRouter(
    prefix="/api/driver",
    tags=["Driver"]
)


# ─────────────────────────────────────────────────────────────
# Driver Dashboard
# ─────────────────────────────────────────────────────────────

@router.get("/dashboard")
def driver_dashboard(
    current_user=Depends(
        require_role(["driver"])
    )
):

    return {
        "message": f"Welcome Driver {current_user.name}"
    }


# ─────────────────────────────────────────────────────────────
# Driver Availability
# ─────────────────────────────────────────────────────────────

@router.put("/availability")
def update_driver_availability(
    body: DriverAvailabilityRequest,
    current_user=Depends(
        require_role(["driver"])
    ),
    db: Session = Depends(get_db)
):

    current_user.is_available = body.is_available

    db.commit()

    return {
        "message": "Availability updated successfully",
        "is_available": current_user.is_available
    }


# ─────────────────────────────────────────────────────────────
# Update Driver Location
# ─────────────────────────────────────────────────────────────

@router.put("/location")
def update_driver_location(
    body: DriverLocationUpdateRequest,
    current_user=Depends(
        require_role(["driver"])
    ),
    db: Session = Depends(get_db)
):

    current_user.latitude = body.latitude

    current_user.longitude = body.longitude

    db.commit()

    return {
        "message": "Driver location updated successfully"
    }


# ─────────────────────────────────────────────────────────────
# Assigned Orders
# ─────────────────────────────────────────────────────────────

@router.get("/orders")
def assigned_orders(
    current_user=Depends(
        require_role(["driver"])
    ),
    db: Session = Depends(get_db)
):

    orders = db.query(Order).filter(
        Order.driver_id == current_user.id
    ).all()

    return orders


# ─────────────────────────────────────────────────────────────
# Pick Order
# ─────────────────────────────────────────────────────────────

@router.put("/orders/{order_id}/pickup")
def pickup_order(
    order_id: int,
    current_user=Depends(
        require_role(["driver"])
    ),
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.driver_id == current_user.id
    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = "picked_up"

    order.delivery_status = "on_the_way"

    db.commit()

    return {
        "message": "Order picked successfully"
    }


# ─────────────────────────────────────────────────────────────
# Deliver Order
# ─────────────────────────────────────────────────────────────

@router.put("/orders/{order_id}/deliver")
def deliver_order(
    order_id: int,
    current_user=Depends(
        require_role(["driver"])
    ),
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.driver_id == current_user.id
    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = "delivered"

    order.delivery_status = "completed"

    db.commit()

    return {
        "message": "Order delivered successfully"
    }


# ─────────────────────────────────────────────────────────────
# Update Delivery Status
# ─────────────────────────────────────────────────────────────

@router.put("/orders/{order_id}/status")
def update_delivery_status(
    order_id: int,
    body: UpdateOrderStatusRequest,
    current_user=Depends(
        require_role(["driver"])
    ),
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.driver_id == current_user.id
    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = body.status

    db.commit()

    return {
        "message": "Delivery status updated",
        "status": order.status
    }