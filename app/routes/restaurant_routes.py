from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.middleware.role_middleware import require_role

from app.database.db import get_db

from app.models.restaurant_model import Restaurant
from app.models.order_model import Order

from app.schemas.order_schema import (
    UpdateOrderStatusRequest
)

router = APIRouter(
    prefix="/api/restaurant",
    tags=["Restaurant"]
)


@router.get("/dashboard")
def restaurant_dashboard(
    current_user=Depends(
        require_role(["restaurant"])
    )
):

    return {
        "message": f"Welcome Restaurant Owner {current_user.name}"
    }


# ─────────────────────────────────────────────────────────────
# Get Restaurant Orders
# ─────────────────────────────────────────────────────────────

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

    orders = db.query(Order).filter(
        Order.restaurant_id == restaurant.id
    ).all()

    return orders


# ─────────────────────────────────────────────────────────────
# Update Order Status
# ─────────────────────────────────────────────────────────────

@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    body: UpdateOrderStatusRequest,
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = db.query(Restaurant).filter(
        Restaurant.owner_id == current_user.id
    ).first()

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.restaurant_id == restaurant.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = body.status

    db.commit()

    return {
        "message": "Order status updated successfully",
        "status": order.status
    }