VALID_ORDER_STATUSES = [

    "placed",
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

    "placed": [
        "confirmed",
        "cancelled",
        "rejected"
    ],

    "confirmed": [
        "preparing",
        "cancelled"
    ],

    "preparing": [
        "ready_for_pickup"
    ],

    "ready_for_pickup": [
        "completed"
    ],

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