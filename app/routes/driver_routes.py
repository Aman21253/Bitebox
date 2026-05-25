from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from math import radians, cos, sin, asin, sqrt
from datetime import datetime

from app.database.db import get_db
from app.middleware.role_middleware import require_role
from app.models.driver_model import Driver
from app.models.order_model import Order
from app.models.user_model import User
from app.services.sms_service import generate_otp, send_otp_sms

from app.schemas.driver_schema import (
    DriverCreate,
    DriverLocationUpdate,
    DriverStatusUpdate,
    DriverAvailabilityRequest,
    DeliveryStatusUpdate
)

router = APIRouter(
    prefix="/api/drivers",
    tags=["Drivers"]
)

# ─────────────────────────────────────
# HAVERSINE — distance in km
# ─────────────────────────────────────

def haversine(lat1, lon1, lat2, lon2) -> float:
    R = 6371
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    return 2 * R * asin(sqrt(a))

DELIVERY_RADIUS_KM = 15


# ─────────────────────────────────────
# REGISTER DRIVER
# ─────────────────────────────────────

@router.post("/register")
def register_driver(
    body: DriverCreate,
    current_user=Depends(require_role(["driver"])),
    db: Session = Depends(get_db)
):
    existing_driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if existing_driver:
        raise HTTPException(status_code=400, detail="Driver already exists")

    driver = Driver(
        user_id=current_user.id,
        full_name=body.full_name,
        phone=body.phone,
        vehicle_type=body.vehicle_type,
        vehicle_number=body.vehicle_number,
        is_online=True,
        is_available=True
    )

    db.add(driver)
    db.commit()
    db.refresh(driver)

    return {"message": "Driver registered successfully"}


# ─────────────────────────────────────
# DRIVER PROFILE
# ─────────────────────────────────────

@router.get("/me")
def get_driver_profile(
    current_user=Depends(require_role(["driver"])),
    db: Session = Depends(get_db)
):
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:
        return {"driver": None, "registered": False}

    return driver


# ─────────────────────────────────────
# UPDATE ONLINE STATUS
# ─────────────────────────────────────

@router.put("/status")
def update_driver_status(
    body: DriverStatusUpdate,
    current_user=Depends(require_role(["driver"])),
    db: Session = Depends(get_db)
):
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    driver.is_online = body.is_online
    driver.last_active_at = func.now()
    db.commit()

    return {"message": "Status updated"}


# ─────────────────────────────────────
# UPDATE LOCATION
# ─────────────────────────────────────

@router.put("/location")
def update_driver_location(
    body: DriverLocationUpdate,
    current_user=Depends(require_role(["driver"])),
    db: Session = Depends(get_db)
):
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    driver.current_latitude = body.latitude
    driver.current_longitude = body.longitude
    db.commit()

    return {"message": "Location updated"}


# ─────────────────────────────────────
# AVAILABLE ORDERS — 15km radius filter
# ─────────────────────────────────────

@router.get("/available-orders")
def get_available_orders(
    current_user=Depends(require_role(["driver"])),
    db: Session = Depends(get_db)
):
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    # If driver has no GPS yet, return empty
    if driver.current_latitude is None or driver.current_longitude is None:
        return []

    orders = db.query(Order).filter(
        Order.delivery_status == "waiting_for_driver"
    ).all()

    nearby_orders = []

    for order in orders:
        restaurant = order.restaurant

        # Skip if restaurant has no coordinates
        if not restaurant or restaurant.latitude is None or restaurant.longitude is None:
            continue

        distance = haversine(
            driver.current_latitude,
            driver.current_longitude,
            restaurant.latitude,
            restaurant.longitude
        )

        if distance <= DELIVERY_RADIUS_KM:
            nearby_orders.append({
                "id": order.id,
                "restaurant_id": order.restaurant_id,
                "restaurant_name": restaurant.name,
                "delivery_address": order.delivery_address,
                "total_amount": order.total_amount,
                "delivery_status": order.delivery_status,
                "distance_km": round(distance, 2)
            })

    # Sort by nearest first
    nearby_orders.sort(key=lambda x: x["distance_km"])

    return nearby_orders


# ─────────────────────────────────────
# ACTIVE DELIVERY
# ─────────────────────────────────────

@router.get("/active-delivery")
def get_active_delivery(
    current_user=Depends(require_role(["driver"])),
    db: Session = Depends(get_db)
):
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:
        return {"active_order": None}

    order = db.query(Order).filter(
        Order.driver_id == driver.id,
        Order.delivery_status.in_([
            "driver_assigned",
            "picked_up",
            "on_the_way"
        ])
    ).first()

    if not order:
        return {"active_order": None}

    return order


# ─────────────────────────────────────
# MY DELIVERIES
# ─────────────────────────────────────

@router.get("/my-deliveries")
def get_my_deliveries(
    current_user=Depends(require_role(["driver"])),
    db: Session = Depends(get_db)
):
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    orders = db.query(Order).filter(
        Order.driver_id == driver.id,
        Order.delivery_status.in_([
            "driver_assigned",
            "picked_up",
            "on_the_way"
        ])
    ).all()

    return orders


# ─────────────────────────────────────
# ACCEPT ORDER
# ─────────────────────────────────────

@router.put("/accept-order/{order_id}")
def accept_order(
    order_id: int,
    current_user=Depends(require_role(["driver"])),
    db: Session = Depends(get_db)
):
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    if not driver.is_online:
        raise HTTPException(status_code=400, detail="Driver is offline")

    if not driver.is_available:
        raise HTTPException(status_code=400, detail="Complete current delivery first")

    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.driver_id:
        raise HTTPException(status_code=400, detail="Order already assigned")

    order.driver_id = driver.id
    order.delivery_status = "driver_assigned"
    driver.is_available = False

    db.commit()

    return {"message": "Order accepted successfully"}


# ─────────────────────────────────────
# UPDATE DELIVERY STATUS
# Blocks "delivered" unless OTP verified
# ─────────────────────────────────────

@router.put("/delivery-status/{order_id}")
def update_delivery_status(
    order_id: int,
    body: DeliveryStatusUpdate,
    current_user=Depends(require_role(["driver"])),
    db: Session = Depends(get_db)
):
    allowed_statuses = ["picked_up", "on_the_way", "delivered"]

    if body.delivery_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed: {allowed_statuses}"
        )

    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.driver_id == driver.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found or not assigned to you")

    # BLOCK delivered unless OTP is verified
    if body.delivery_status == "delivered" and not order.delivery_otp_verified:
        raise HTTPException(
            status_code=400,
            detail="OTP not verified. Ask customer for the delivery OTP first."
        )

    order.delivery_status = body.delivery_status

    if body.delivery_status == "delivered":
        order.status = "delivered"
        order.payment_status = "completed"
        order.delivered_at = datetime.utcnow()
        driver.is_available = True
        driver.total_deliveries += 1
        driver.total_earnings += 80
        driver.last_active_at = func.now()

    db.commit()

    return {"message": f"Order marked as {body.delivery_status}"}


# ─────────────────────────────────────
# SEND DELIVERY OTP TO CUSTOMER
# Driver calls this when they arrive
# ─────────────────────────────────────

@router.post("/send-delivery-otp/{order_id}")
def send_delivery_otp(
    order_id: int,
    current_user=Depends(require_role(["driver"])),
    db: Session = Depends(get_db)
):
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.driver_id == driver.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found or not assigned to you")

    if order.delivery_status != "on_the_way":
        raise HTTPException(
            status_code=400,
            detail="Order must be 'on_the_way' before sending delivery OTP"
        )

    if order.delivery_otp_verified:
        raise HTTPException(status_code=400, detail="OTP already verified")

    # Get customer phone
    customer = db.query(User).filter(User.id == order.customer_id).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    otp = generate_otp()

    order.delivery_otp = otp
    order.delivery_otp_verified = False

    db.commit()

    send_otp_sms(
        phone=customer.phone,
        code=otp,
        purpose="delivery"
    )

    return {"message": f"Delivery OTP sent to customer ({customer.phone})"}


# ─────────────────────────────────────
# VERIFY DELIVERY OTP
# Driver enters OTP given by customer
# ─────────────────────────────────────

@router.post("/verify-delivery-otp/{order_id}")
def verify_delivery_otp(
    order_id: int,
    body: dict,
    current_user=Depends(require_role(["driver"])),
    db: Session = Depends(get_db)
):
    otp_entered = body.get("otp")

    if not otp_entered:
        raise HTTPException(status_code=400, detail="OTP is required")

    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    order = db.query(Order).filter(
        Order.id == order_id,
        Order.driver_id == driver.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found or not assigned to you")

    if order.delivery_otp_verified:
        raise HTTPException(status_code=400, detail="OTP already verified")

    if not order.delivery_otp:
        raise HTTPException(status_code=400, detail="No OTP generated. Send OTP first.")

    if order.delivery_otp != otp_entered:
        raise HTTPException(status_code=400, detail="Wrong OTP. Please try again.")

    order.delivery_otp_verified = True
    db.commit()

    return {"message": "OTP verified successfully. You can now mark as delivered."}


# ─────────────────────────────────────
# DELIVERY HISTORY
# ─────────────────────────────────────

@router.get("/delivery-history")
def get_delivery_history(
    current_user=Depends(require_role(["driver"])),
    db: Session = Depends(get_db)
):
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    orders = db.query(Order).filter(
        Order.driver_id == driver.id,
        Order.delivery_status == "delivered"
    ).order_by(Order.id.desc()).all()

    return orders