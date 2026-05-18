from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.middleware.role_middleware import require_role

from app.database.db import get_db

from app.models.order_model import Order

from app.schemas.order_schema import (
    UpdateOrderStatusRequest
)

router = APIRouter(
    prefix="/api/driver",
    tags=["Driver"]
)


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