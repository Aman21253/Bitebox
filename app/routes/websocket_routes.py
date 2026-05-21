from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect

from app.websockets.connection_manager import (
    manager
)

router = APIRouter()


@router.websocket("/ws/orders")
async def websocket_orders(
    websocket: WebSocket
):
    await manager.connect(
        websocket
    )
    print("✅ WebSocket Connected")

    try:
        while True:
            await websocket.receive()

    except WebSocketDisconnect:
        print(
            "❌ WebSocket Disconnected"
        )
        manager.disconnect(
            websocket
        )