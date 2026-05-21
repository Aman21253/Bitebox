from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy import extract

from app.database.db import get_db

from app.middleware.role_middleware import (
    require_role
)

from app.models.restaurant_model import (
    Restaurant
)

from app.models.order_model import (
    Order
)

from app.models.order_item_model import (
    OrderItem
)

from app.models.menu_item_model import (
    MenuItem
)

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

    restaurant = db.query(
        Restaurant
    ).filter(
        Restaurant.owner_id ==
        current_user.id
    ).first()

    total_orders = db.query(
        Order
    ).filter(
        Order.restaurant_id ==
        restaurant.id
    ).count()

    delivered_orders = db.query(
        Order
    ).filter(
        Order.restaurant_id ==
        restaurant.id,
        Order.status == "delivered"
    ).count()

    total_revenue = db.query(
        func.sum(Order.total_amount)
    ).filter(
        Order.restaurant_id ==
        restaurant.id,
        Order.status == "delivered"
    ).scalar()

    active_items = db.query(
        MenuItem
    ).filter(
        MenuItem.restaurant_id ==
        restaurant.id,
        MenuItem.is_available == True
    ).count()

    pending_orders = db.query(
        Order
    ).filter(
        Order.restaurant_id ==
        restaurant.id,
        Order.status == "pending"
    ).count()

    preparing_orders = db.query(
        Order
    ).filter(
        Order.restaurant_id ==
        restaurant.id,
        Order.status == "preparing"
    ).count()

    return {

        "total_orders":
        total_orders,

        "delivered_orders":
        delivered_orders,

        "total_revenue":
        float(total_revenue or 0),

        "active_items":
        active_items,

        "pending_orders":
        pending_orders,

        "preparing_orders":
        preparing_orders

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

    restaurant = db.query(
        Restaurant
    ).filter(
        Restaurant.owner_id ==
        current_user.id
    ).first()

    items = db.query(

        OrderItem.item_name,

        func.sum(
            OrderItem.quantity
        ).label("total_quantity"),

        func.sum(
            OrderItem.total_price
        ).label("revenue")

    ).join(

        Order,
        Order.id ==
        OrderItem.order_id

    ).filter(

        Order.restaurant_id ==
        restaurant.id

    ).group_by(

        OrderItem.item_name

    ).order_by(

        func.sum(
            OrderItem.quantity
        ).desc()

    ).limit(5).all()

    formatted_items = []

    for item in items:

        formatted_items.append({

            "item_name":
            item.item_name,

            "total_quantity":
            int(item.total_quantity),

            "revenue":
            float(item.revenue)

        })

    return formatted_items


# ─────────────────────────────────────────────
# REVENUE CHART
# ─────────────────────────────────────────────

@router.get("/revenue-chart")
def revenue_chart(

    current_user=Depends(
        require_role(["restaurant"])
    ),

    db: Session = Depends(get_db)

):

    restaurant = db.query(
        Restaurant
    ).filter(
        Restaurant.owner_id ==
        current_user.id
    ).first()

    revenue = db.query(

        Order.id.label("day"),

        func.sum(
            Order.total_amount
        ).label("revenue")

    ).filter(

        Order.restaurant_id ==
        restaurant.id,

        Order.status ==
        "delivered"

    ).group_by(

        Order.id

    ).order_by(

        Order.id

    ).limit(7).all()

    chart_data = []

    counter = 1

    for item in revenue:

        chart_data.append({

            "day":
            f"Day {counter}",

            "revenue":
            float(item.revenue)

        })

        counter += 1

    return chart_data


# ─────────────────────────────────────────────
# ORDERS STATUS CHART
# ─────────────────────────────────────────────

@router.get("/orders-chart")
def orders_chart(

    current_user=Depends(
        require_role(["restaurant"])
    ),

    db: Session = Depends(get_db)

):

    restaurant = db.query(
        Restaurant
    ).filter(
        Restaurant.owner_id ==
        current_user.id
    ).first()

    statuses = [

        "pending",
        "preparing",
        "delivered",
        "cancelled"

    ]

    result = []

    for status in statuses:

        count = db.query(
            Order
        ).filter(
            Order.restaurant_id ==
            restaurant.id,
            Order.status == status
        ).count()

        result.append({

            "status":
            status.capitalize(),

            "orders":
            count

        })

    return result