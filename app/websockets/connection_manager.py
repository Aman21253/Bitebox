from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):

        # STORE SOCKETS BY ORDER ID

        self.active_connections = {}

    # ─────────────────────────────────────────
    # CONNECT
    # ─────────────────────────────────────────

    async def connect(

        self,

        order_id: int,

        websocket: WebSocket

    ):

        await websocket.accept()

        if order_id not in self.active_connections:

            self.active_connections[
                order_id
            ] = []

        self.active_connections[
            order_id
        ].append(websocket)

    # ─────────────────────────────────────────
    # DISCONNECT
    # ─────────────────────────────────────────

    def disconnect(

        self,

        order_id: int,

        websocket: WebSocket

    ):

        if order_id in self.active_connections:

            if websocket in self.active_connections[
                order_id
            ]:

                self.active_connections[
                    order_id
                ].remove(websocket)

            # REMOVE EMPTY ROOM

            if not self.active_connections[
                order_id
            ]:

                del self.active_connections[
                    order_id
                ]

    # ─────────────────────────────────────────
    # SEND TO SPECIFIC ORDER
    # ─────────────────────────────────────────

    async def send_order_update(

        self,

        order_id: int,

        data: dict

    ):

        if order_id not in self.active_connections:

            return

        disconnected = []

        for connection in self.active_connections[
            order_id
        ]:

            try:

                await connection.send_json(
                    data
                )

            except:

                disconnected.append(
                    connection
                )

        # REMOVE DEAD SOCKETS

        for connection in disconnected:

            self.disconnect(
                order_id,
                connection
            )

    # ─────────────────────────────────────────
    # SEND LOCATION UPDATE
    # ─────────────────────────────────────────

    async def send_location_update(

        self,

        order_id: int,

        data: dict

    ):

        await self.send_order_update(
            order_id,
            data
        )

    # ─────────────────────────────────────────
    # GLOBAL BROADCAST
    # ─────────────────────────────────────────

    async def broadcast(

        self,

        data: dict

    ):

        disconnected = []

        for order_id in self.active_connections:

            for connection in self.active_connections[
                order_id
            ]:

                try:

                    await connection.send_json(
                        data
                    )

                except:

                    disconnected.append(
                        (
                            order_id,
                            connection
                        )
                    )

        # CLEAN DEAD SOCKETS

        for order_id, connection in disconnected:

            self.disconnect(
                order_id,
                connection
            )


manager = ConnectionManager()