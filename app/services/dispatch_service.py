from math import (
    radians,
    sin,
    cos,
    sqrt,
    atan2
)

from datetime import datetime

from sqlalchemy.orm import Session

from app.models.driver_model import Driver
from app.models.order_model import Order
from app.models.restaurant_model import Restaurant


# ─────────────────────────────────────────────
# HAVERSINE DISTANCE
# ─────────────────────────────────────────────

def calculate_distance(

    lat1,
    lon1,
    lat2,
    lon2

):

    R = 6371

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (

        sin(dlat / 2) ** 2

        +

        cos(radians(lat1))
        *
        cos(radians(lat2))
        *
        sin(dlon / 2) ** 2

    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a)
    )

    return R * c


# ─────────────────────────────────────────────
# GET AVAILABLE DRIVER POOL
# ─────────────────────────────────────────────

def get_available_driver_pool(

    db: Session,

    order: Order

):

    restaurant = db.query(
        Restaurant
    ).filter(
        Restaurant.id == order.restaurant_id
    ).first()

    if not restaurant:

        return []

    if (
        restaurant.latitude is None
        or
        restaurant.longitude is None
    ):

        print("Restaurant coordinates missing")

        return []

    restaurant_lat = restaurant.latitude
    restaurant_lng = restaurant.longitude

    available_drivers = db.query(
        Driver
    ).filter(

        Driver.is_online == True,

        Driver.is_available == True

    ).all()

    filtered_drivers = []

    for driver in available_drivers:

        if (
            driver.current_latitude is None
            or
            driver.current_longitude is None
        ):
            continue

        # SKIP DECLINED DRIVERS

        if (
            order.declined_driver_ids
            and
            driver.id in order.declined_driver_ids
        ):
            continue

        distance = calculate_distance(

            restaurant_lat,
            restaurant_lng,

            driver.current_latitude,
            driver.current_longitude
        )

        print("────────────")
        print("Driver:", driver.id)
        print(
            "Driver Location:",
            driver.current_latitude,
            driver.current_longitude
        )

        print(
            "Restaurant:",
            restaurant.name
        )

        print(
            "Restaurant Location:",
            restaurant.latitude,
            restaurant.longitude
        )

        print("Distance:", distance)

        MAX_DRIVER_RADIUS_KM = 15

        # ONLY DRIVERS INSIDE 15KM

        if distance <= MAX_DRIVER_RADIUS_KM:

            filtered_drivers.append({

                "driver": driver,

                "distance": distance

            })

    filtered_drivers.sort(
        key=lambda x: x["distance"]
    )

    return filtered_drivers


# ─────────────────────────────────────────────
# FIND NEAREST DRIVER
# ─────────────────────────────────────────────

def find_nearest_driver(

    db: Session,

    order: Order

):

    drivers = get_available_driver_pool(
        db,
        order
    )

    if not drivers:

        return None

    return drivers[0]["driver"]


# ─────────────────────────────────────────────
# AUTO ASSIGN DRIVER
# ─────────────────────────────────────────────

def auto_assign_driver(

    db: Session,

    order: Order

):

    nearest_driver = find_nearest_driver(
        db,
        order
    )

    if not nearest_driver:

        return None

    order.driver_id = nearest_driver.id

    order.current_dispatch_driver_id = (
        nearest_driver.id
    )

    order.delivery_status = (
        "driver_assigned"
    )

    order.driver_request_sent_at = (
        datetime.utcnow()
    )

    order.dispatch_attempts += 1

    nearest_driver.is_available = False

    db.commit()

    db.refresh(order)

    return nearest_driver


# ─────────────────────────────────────────────
# REASSIGN NEXT DRIVER
# ─────────────────────────────────────────────

def reassign_next_driver(

    db: Session,

    order: Order,

    declined_driver_id: int

):

    declined_list = (
        order.declined_driver_ids or []
    )

    if declined_driver_id not in declined_list:

        declined_list.append(
            declined_driver_id
        )

    order.declined_driver_ids = (
        declined_list
    )

    order.driver_id = None

    order.current_dispatch_driver_id = None

    order.delivery_status = (
        "waiting_for_driver"
    )

    declined_driver = db.query(
        Driver
    ).filter(
        Driver.id == declined_driver_id
    ).first()

    if declined_driver:

        declined_driver.is_available = True

    db.commit()

    if order.dispatch_attempts >= 5:

        return None

    next_driver = auto_assign_driver(
        db,
        order
    )

    return next_driver