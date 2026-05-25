from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect
)

from app.websockets.connection_manager import (
    manager
)

router = APIRouter()


# ─────────────────────────────────────────────
# RESTAURANT LIVE SOCKET
# ─────────────────────────────────────────────

@router.websocket(
    "/ws/order-tracking/restaurant"
)
async def restaurant_socket(

    websocket: WebSocket

):

    await websocket.accept()

    print(
        "✅ Restaurant socket connected"
    )

    try:

        while True:

            # KEEP CONNECTION ALIVE

            await websocket.receive_text()

    except WebSocketDisconnect:

        print(
            "❌ Restaurant socket disconnected"
        )


# ─────────────────────────────────────────────
# DRIVER LIVE TRACKING SOCKET
# ─────────────────────────────────────────────

@router.websocket(
    "/ws/order-tracking/{order_id}"
)
async def websocket_tracking(

    websocket: WebSocket,

    order_id: int

):

    await manager.connect(
        order_id,
        websocket
    )

    print(
        f"✅ Order {order_id} socket connected"
    )

    try:

        while True:

            data = await websocket.receive_json()

            # DRIVER LIVE LOCATION

            await manager.send_location_update(

                order_id,

                {
                    "type":
                    "location_update",

                    "data":
                    data
                }
            )

    except WebSocketDisconnect:

        print(
            f"❌ Order {order_id} socket disconnected"
        )

        manager.disconnect(
            order_id,
            websocket
        )