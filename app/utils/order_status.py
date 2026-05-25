VALID_ORDER_STATUSES = [

    "pending",
    "confirmed",
    "preparing",
    "ready_for_pickup",
    "completed",
    "cancelled",
    "rejected",
    "refunded"
]


VALID_DELIVERY_STATUSES = [

    "waiting_for_driver",
    "driver_assigned",
    "picked_up",
    "on_the_way",
    "delivered"
]


ORDER_STATUS_FLOW = {

    # NEW ORDER

    "pending": [
        "confirmed",
        "preparing",
        "ready_for_pickup",
        "completed",
        "cancelled"
    ],

    # CONFIRMED

    "confirmed": [
        "preparing",
        "ready_for_pickup",
        "completed",
        "cancelled"
    ],

    # PREPARING

    "preparing": [
        "ready_for_pickup",
        "completed"
    ],

    # READY

    "ready_for_pickup": [
        "completed"
    ],

    # FINAL STATES

    "completed": [],

    "cancelled": [],

    "rejected": [],

    "refunded": []
}


DELIVERY_STATUS_FLOW = {

    "waiting_for_driver": [
        "driver_assigned"
    ],

    "driver_assigned": [
        "picked_up"
    ],

    "picked_up": [
        "on_the_way"
    ],

    "on_the_way": [
        "delivered"
    ],

    "delivered": []
}