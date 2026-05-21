const socket = new WebSocket(
    "ws://127.0.0.1:8000/ws/orders"
);

socket.onopen = () => {

    console.log(
        "✅ SOCKET CONNECTED"
    );
};

socket.onerror = (error) => {

    console.log(
        "❌ SOCKET ERROR",
        error
    );
};

socket.onclose = () => {

    console.log(
        "⚠️ SOCKET CLOSED"
    );
};

export default socket;