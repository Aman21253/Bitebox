from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):

        # STORE CONNECTIONS BY ORDER ID

        self.active_connections = {}

    # CONNECT

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

    # DISCONNECT

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

    # SEND TO SPECIFIC ORDER ROOM

    async def send_location_update(

        self,

        order_id: int,

        data: dict

    ):

        if order_id in self.active_connections:

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

            # CLEAN DEAD SOCKETS

            for connection in disconnected:

                self.disconnect(
                    order_id,
                    connection
                )

    # GLOBAL BROADCAST

    async def broadcast(
        self,
        message: dict
    ):

        for order_connections in self.active_connections.values():

            for connection in order_connections:

                try:

                    await connection.send_json(
                        message
                    )

                except:
                    pass


manager = ConnectionManager()