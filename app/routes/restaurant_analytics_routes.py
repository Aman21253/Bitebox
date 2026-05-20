from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.db import get_db

from app.middleware.role_middleware import require_role

from app.models.restaurant_model import Restaurant
from app.models.order_model import Order
from app.models.order_item_model import OrderItem
from app.models.menu_item_model import MenuItem

router = APIRouter(
    prefix="/api/restaurant/analytics",
    tags=["Restaurant Analytics"]
)


# ─────────────────────────────────────────────
# OVERVIEW ANALYTICS
# ─────────────────────────────────────────────

@router.get("/overview")
def analytics_overview(
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = db.query(Restaurant).filter(
        Restaurant.owner_id == current_user.id
    ).first()

    total_orders = db.query(Order).filter(
        Order.restaurant_id == restaurant.id
    ).count()

    delivered_orders = db.query(Order).filter(
        Order.restaurant_id == restaurant.id,
        Order.status == "delivered"
    ).count()

    total_revenue = db.query(
        func.sum(Order.total_amount)
    ).filter(
        Order.restaurant_id == restaurant.id,
        Order.status == "delivered"
    ).scalar()

    active_items = db.query(MenuItem).filter(
        MenuItem.restaurant_id == restaurant.id,
        MenuItem.is_available == True
    ).count()

    pending_orders = db.query(Order).filter(
        Order.restaurant_id == restaurant.id,
        Order.status == "pending"
    ).count()

    preparing_orders = db.query(Order).filter(
        Order.restaurant_id == restaurant.id,
        Order.status == "preparing"
    ).count()

    return {
        "total_orders": total_orders,
        "delivered_orders": delivered_orders,
        "total_revenue": total_revenue or 0,
        "active_items": active_items,
        "pending_orders": pending_orders,
        "preparing_orders": preparing_orders
    }


# ─────────────────────────────────────────────
# TOP SELLING ITEMS
# ─────────────────────────────────────────────

@router.get("/top-items")
def top_selling_items(
    current_user=Depends(
        require_role(["restaurant"])
    ),
    db: Session = Depends(get_db)
):

    restaurant = db.query(Restaurant).filter(
        Restaurant.owner_id == current_user.id
    ).first()

    items = db.query(
        OrderItem.item_name,
        func.sum(OrderItem.quantity).label("total_quantity"),
        func.sum(OrderItem.total_price).label("revenue")
    ).join(
        Order,
        Order.id == OrderItem.order_id
    ).filter(
        Order.restaurant_id == restaurant.id
    ).group_by(
        OrderItem.item_name
    ).order_by(
        func.sum(OrderItem.quantity).desc()
    ).limit(5).all()

    return items