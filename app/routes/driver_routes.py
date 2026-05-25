from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from datetime import datetime
from datetime import timedelta

from random import randint

from app.database.db import get_db

from app.middleware.role_middleware import require_role

from app.models.driver_model import Driver
from app.models.order_model import Order

from app.schemas.driver_schema import (

    DriverCreate,
    DriverLocationUpdate,
    DriverStatusUpdate,
    DriverAvailabilityRequest,
    DeliveryStatusUpdate,
    DeliveryOTPVerifyRequest
)

router = APIRouter(
    prefix="/api/drivers",
    tags=["Drivers"]
)


# REGISTER DRIVER

@router.post("/register")
def register_driver(

    body: DriverCreate,

    current_user=Depends(
        require_role(["driver"])
    ),

    db: Session = Depends(get_db)
):

    existing_driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if existing_driver:

        raise HTTPException(
            status_code=400,
            detail="Driver already exists"
        )

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

    return {
        "message": "Driver registered successfully"
    }


# DRIVER PROFILE

@router.get("/me")
def get_driver_profile(

    current_user=Depends(
        require_role(["driver"])
    ),

    db: Session = Depends(get_db)
):

    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:

        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    return driver


# UPDATE ONLINE STATUS

@router.put("/status")
def update_driver_status(

    body: DriverStatusUpdate,

    current_user=Depends(
        require_role(["driver"])
    ),

    db: Session = Depends(get_db)
):

    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:

        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    driver.is_online = body.is_online

    db.commit()

    return {
        "message": "Status updated"
    }


# UPDATE LOCATION

@router.put("/location")
def update_driver_location(

    body: DriverLocationUpdate,

    current_user=Depends(
        require_role(["driver"])
    ),

    db: Session = Depends(get_db)
):

    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:

        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    driver.current_latitude = body.latitude
    driver.current_longitude = body.longitude

    db.commit()

    return {
        "message": "Location updated"
    }


# AVAILABLE ORDERS

@router.get("/available-orders")
def get_available_orders(

    current_user=Depends(
        require_role(["driver"])
    ),

    db: Session = Depends(get_db)
):

    orders = db.query(Order).filter(

        Order.delivery_status == "waiting_for_driver"

    ).all()

    return orders


# CURRENT ACTIVE DELIVERY

@router.get("/active-delivery")
def get_active_delivery(

    current_user=Depends(
        require_role(["driver"])
    ),

    db: Session = Depends(get_db)
):

    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:

        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    order = db.query(Order).filter(

        Order.driver_id == driver.id,

        Order.delivery_status.in_([
            "driver_assigned",
            "picked_up",
            "on_the_way",
            "otp_verification_pending"
        ])

    ).first()

    if not order:

        return {
            "active_order": None
        }

    return order


# ACCEPT ORDER

@router.put("/accept-order/{order_id}")
def accept_order(

    order_id: int,

    current_user=Depends(
        require_role(["driver"])
    ),

    db: Session = Depends(get_db)
):

    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:

        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    if not driver.is_online:

        raise HTTPException(
            status_code=400,
            detail="Driver is offline"
        )

    if not driver.is_available:

        raise HTTPException(
            status_code=400,
            detail="Complete current delivery first"
        )

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    if order.driver_id:

        raise HTTPException(
            status_code=400,
            detail="Order already assigned"
        )

    order.driver_id = driver.id

    order.delivery_status = "driver_assigned"

    driver.is_available = False

    db.commit()

    return {
        "message": "Order accepted successfully"
    }


# UPDATE DELIVERY STATUS

@router.put("/delivery-status/{order_id}")
def update_delivery_status(

    order_id: int,

    body: DeliveryStatusUpdate,

    current_user=Depends(
        require_role(["driver"])
    ),

    db: Session = Depends(get_db)
):

    allowed_statuses = [
        "picked_up",
        "on_the_way",
        "delivered"
    ]

    if body.delivery_status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail="Invalid delivery status"
        )

    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:

        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    order = db.query(Order).filter(

        Order.id == order_id,

        Order.driver_id == driver.id

    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    # DELIVERY OTP FLOW

    if body.delivery_status == "delivered":

        otp = str(
            randint(1000, 9999)
        )

        order.delivery_otp = otp

        order.delivery_otp_expiry = (
            datetime.utcnow()
            + timedelta(minutes=10)
        )

        order.delivery_status = (
            "otp_verification_pending"
        )

        db.commit()

        return {
            "message":
            "Delivery OTP generated",
            "otp": otp
        }

    order.delivery_status = body.delivery_status

    db.commit()

    return {
        "message":
        f"Order marked as {body.delivery_status}"
    }


# VERIFY DELIVERY OTP

@router.put(
    "/verify-delivery-otp/{order_id}"
)
def verify_delivery_otp(

    order_id: int,

    body: DeliveryOTPVerifyRequest,

    current_user=Depends(
        require_role(["driver"])
    ),

    db: Session = Depends(get_db)
):

    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:

        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    order = db.query(Order).filter(

        Order.id == order_id,

        Order.driver_id == driver.id

    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    if order.delivery_otp != body.otp:

        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    if (
        datetime.utcnow()
        >
        order.delivery_otp_expiry
    ):

        raise HTTPException(
            status_code=400,
            detail="OTP expired"
        )

    order.delivery_otp_verified = True

    order.delivery_status = (
        "delivered"
    )

    order.status = "completed"

    order.payment_status = "completed"

    order.delivered_at = (
        datetime.utcnow()
    )

    driver.is_available = True

    driver.total_deliveries += 1

    driver.total_earnings += 80

    db.commit()

    return {
        "message":
        "Order delivered successfully"
    }


# DELIVERY HISTORY

@router.get("/delivery-history")
def get_delivery_history(

    current_user=Depends(
        require_role(["driver"])
    ),

    db: Session = Depends(get_db)
):

    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    orders = db.query(Order).filter(

        Order.driver_id == driver.id,

        Order.delivery_status == "delivered"

    ).order_by(Order.id.desc()).all()

    return orders