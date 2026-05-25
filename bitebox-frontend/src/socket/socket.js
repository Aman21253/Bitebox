export const createTrackingSocket = (
    orderId
) => {

    return new WebSocket(

        `ws://127.0.0.1:8000/ws/order-tracking/${orderId}`

    );
};