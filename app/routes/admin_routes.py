from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db

from app.middleware.role_middleware import (
    require_role,
    require_permission
)

from app.models.user_model import User
from app.models.restaurant_model import Restaurant

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


# ─────────────────────────────────────────────────────────────
# Admin Dashboard
# ─────────────────────────────────────────────────────────────

@router.get("/dashboard")
def admin_dashboard(
    current_user=Depends(
        require_role(["admin"])
    )
):

    return {
        "message": f"Welcome Admin {current_user.name}"
    }


# ─────────────────────────────────────────────────────────────
# Get All Users
# ─────────────────────────────────────────────────────────────

@router.get("/users")
def get_all_users(
    current_user=Depends(
        require_permission("manage_users")
    ),
    db: Session = Depends(get_db)
):

    users = db.query(User).all()

    return users


# ─────────────────────────────────────────────────────────────
# Get Pending Restaurants
# ─────────────────────────────────────────────────────────────

@router.get("/restaurants/pending")
def get_pending_restaurants(
    current_user=Depends(
        require_permission("approve_restaurant")
    ),
    db: Session = Depends(get_db)
):

    restaurants = db.query(Restaurant).filter(
        Restaurant.status == "pending"
    ).all()

    return restaurants


# ─────────────────────────────────────────────────────────────
# Approve Restaurant
# ─────────────────────────────────────────────────────────────

@router.post("/restaurants/{restaurant_id}/approve")
def approve_restaurant(
    restaurant_id: int,
    current_user=Depends(
        require_permission("approve_restaurant")
    ),
    db: Session = Depends(get_db)
):

    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()

    if not restaurant:
        return {
            "message": "Restaurant not found"
        }

    restaurant.status = "approved"

    db.commit()

    return {
        "message": "Restaurant approved successfully"
    }


# ─────────────────────────────────────────────────────────────
# Reject Restaurant
# ─────────────────────────────────────────────────────────────

@router.post("/restaurants/{restaurant_id}/reject")
def reject_restaurant(
    restaurant_id: int,
    current_user=Depends(
        require_permission("approve_restaurant")
    ),
    db: Session = Depends(get_db)
):

    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()

    if not restaurant:
        return {
            "message": "Restaurant not found"
        }

    restaurant.status = "rejected"

    db.commit()

    return {
        "message": "Restaurant rejected successfully"
    }