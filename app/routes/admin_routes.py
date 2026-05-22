from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from sqlalchemy import func

from app.database.db import get_db

from app.middleware.role_middleware import (
    require_role,
    require_permission
)

from app.models.user_model import User

from app.models.restaurant_model import (
    Restaurant
)

from app.models.order_model import Order

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)

# ─────────────────────────────────────────────────────────────
# ADMIN DASHBOARD
# ─────────────────────────────────────────────────────────────

@router.get("/dashboard")
def admin_dashboard(

    current_user=Depends(
        require_role(["admin"])
    )

):

    return {
        "message":
        f"Welcome Admin {current_user.name}"
    }

# ─────────────────────────────────────────────────────────────
# GET ALL USERS
# ─────────────────────────────────────────────────────────────

@router.get("/users")
def get_all_users(

    current_user=Depends(
        require_permission(
            "manage_users"
        )
    ),

    db: Session = Depends(get_db)

):

    users = db.query(User).all()

    return users

# ─────────────────────────────────────────────────────────────
# SUSPEND USER
# ─────────────────────────────────────────────────────────────

@router.put("/users/{user_id}/suspend")
def suspend_user(

    user_id: int,

    current_user=Depends(
        require_role(["admin"])
    ),

    db: Session = Depends(get_db)

):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.status = "suspended"

    db.commit()

    return {
        "message":
        "User suspended successfully"
    }

# ─────────────────────────────────────────────────────────────
# ACTIVATE USER
# ─────────────────────────────────────────────────────────────

@router.put("/users/{user_id}/activate")
def activate_user(

    user_id: int,

    current_user=Depends(
        require_role(["admin"])
    ),

    db: Session = Depends(get_db)

):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.status = "active"

    db.commit()

    return {
        "message":
        "User activated successfully"
    }

# ─────────────────────────────────────────────────────────────
# GET PENDING RESTAURANTS
# ─────────────────────────────────────────────────────────────

@router.get("/restaurants/pending")
def get_pending_restaurants(

    current_user=Depends(
        require_permission(
            "approve_restaurant"
        )
    ),

    db: Session = Depends(get_db)

):

    restaurants = db.query(
        Restaurant
    ).filter(

        Restaurant.approval_status ==
        "pending"

    ).all()

    return restaurants

# ─────────────────────────────────────────────────────────────
# APPROVE RESTAURANT
# ─────────────────────────────────────────────────────────────

@router.post(
    "/restaurants/{restaurant_id}/approve"
)
def approve_restaurant(

    restaurant_id: int,

    current_user=Depends(
        require_permission(
            "approve_restaurant"
        )
    ),

    db: Session = Depends(get_db)

):

    restaurant = db.query(
        Restaurant
    ).filter(
        Restaurant.id == restaurant_id
    ).first()

    if not restaurant:

        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    restaurant.approval_status = (
        "approved"
    )

    restaurant.approved_by = (
        current_user.id
    )

    db.commit()

    return {
        "message":
        "Restaurant approved successfully"
    }

# ─────────────────────────────────────────────────────────────
# REJECT RESTAURANT
# ─────────────────────────────────────────────────────────────

@router.post(
    "/restaurants/{restaurant_id}/reject"
)
def reject_restaurant(

    restaurant_id: int,

    current_user=Depends(
        require_permission(
            "approve_restaurant"
        )
    ),

    db: Session = Depends(get_db)

):

    restaurant = db.query(
        Restaurant
    ).filter(
        Restaurant.id == restaurant_id
    ).first()

    if not restaurant:

        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    restaurant.approval_status = (
        "rejected"
    )

    db.commit()

    return {
        "message":
        "Restaurant rejected successfully"
    }

# ─────────────────────────────────────────────────────────────
# GET ALL ORDERS
# ─────────────────────────────────────────────────────────────

@router.get("/orders")
def get_all_orders(

    current_user=Depends(
        require_role(["admin"])
    ),

    db: Session = Depends(get_db)

):

    orders = db.query(
        Order
    ).all()

    return orders

# ─────────────────────────────────────────────────────────────
# PLATFORM ANALYTICS
# ─────────────────────────────────────────────────────────────

@router.get("/analytics")
def platform_analytics(

    current_user=Depends(
        require_role(["admin"])
    ),

    db: Session = Depends(get_db)

):

    total_users = db.query(
        User
    ).count()

    total_restaurants = db.query(
        Restaurant
    ).count()

    total_orders = db.query(
        Order
    ).count()

    total_revenue = db.query(
        func.sum(Order.total_amount)
    ).scalar()

    return {

        "total_users":
        total_users,

        "total_restaurants":
        total_restaurants,

        "total_orders":
        total_orders,

        "total_revenue":
        total_revenue or 0
    }