import { useEffect, useState } from "react";
import {
  MapPin,
  Clock3,
  CircleDollarSign,
  Navigation,
} from "lucide-react";
import API from "../../api/axios";
import { createTrackingSocket } from "../../socket/socket";

function ActiveDelivery() {
  const [activeOrders, setActiveOrders] = useState([]);

  // ─────────────────────────────────────
  // FETCH ACTIVE ORDERS
  // FIX: was calling /drivers/my-deliveries which didn't exist in backend
  // ─────────────────────────────────────

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  const fetchActiveOrders = async () => {
    try {
      const response = await API.get("/drivers/my-deliveries");
      setActiveOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch active orders:", error);
    }
  };

  // ─────────────────────────────────────
  // UPDATE DELIVERY STATUS
  // ─────────────────────────────────────

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/drivers/delivery-status/${orderId}`, {
        delivery_status: status,
      });
      fetchActiveOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(error.response?.data?.detail || "Failed to update status");
    }
  };

  // ─────────────────────────────────────
  // START LIVE GPS STREAM
  // ─────────────────────────────────────

  const startLiveTracking = (orderId) => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    const socket = createTrackingSocket(orderId);

    socket.onopen = () => {
      console.log("✅ Driver tracking socket connected");

      navigator.geolocation.watchPosition(
        (position) => {
          const payload = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            delivery_status: "on_the_way",
            timestamp: new Date().toISOString(),
          };
          console.log("📍 Sending GPS:", payload);
          socket.send(JSON.stringify(payload));
        },
        (error) => {
          console.error("GPS ERROR", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    };

    socket.onerror = (error) => console.error("SOCKET ERROR", error);
    socket.onclose = () => console.log("❌ Driver socket disconnected");
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white px-6 lg:px-10 py-10">
      <div className="max-w-[1500px] mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <p className="text-orange-400 font-semibold mb-3">
            DRIVER DELIVERY PANEL
          </p>
          <h1 className="text-5xl font-black">Active Deliveries</h1>
        </div>

        {/* EMPTY STATE */}
        {activeOrders.length === 0 && (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="text-8xl mb-6">🛵</div>
            <h2 className="text-4xl font-black mb-4">No Active Deliveries</h2>
            <p className="text-gray-400 text-lg">
              Accept orders from dashboard
            </p>
          </div>
        )}

        {/* ACTIVE ORDERS GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white/[0.04] border border-white/10 rounded-[32px] p-7 backdrop-blur-xl"
            >
              {/* TOP */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Order ID</p>
                  <h2 className="text-4xl font-black">#{order.id}</h2>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-300 font-semibold capitalize">
                  {order.delivery_status}
                </div>
              </div>

              {/* INFO */}
              <div className="space-y-5">

                {/* AMOUNT */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                    <CircleDollarSign className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Order Amount</p>
                    <h3 className="text-2xl font-black text-green-400">
                      ₹{order.total_amount}
                    </h3>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <MapPin className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      Delivery Address
                    </p>
                    <p className="text-lg leading-relaxed">
                      {order.delivery_address}
                    </p>
                  </div>
                </div>

                {/* ETA */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <Clock3 className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">ETA</p>
                    <h3 className="text-xl font-bold">
                      {order.estimated_delivery_time} mins
                    </h3>
                  </div>
                </div>

              </div>

              {/* ACTIONS — only show buttons relevant to current status */}
              <div className="mt-8 flex flex-wrap gap-4">

                {order.delivery_status === "driver_assigned" && (
                  <button
                    onClick={() => updateStatus(order.id, "picked_up")}
                    className="flex-1 min-w-[160px] h-14 rounded-2xl bg-blue-500 hover:bg-blue-400 transition font-bold"
                  >
                    Picked Up
                  </button>
                )}

                {order.delivery_status === "picked_up" && (
                  <button
                    onClick={() => {
                      updateStatus(order.id, "on_the_way");
                      startLiveTracking(order.id);
                    }}
                    className="flex-1 min-w-[160px] h-14 rounded-2xl bg-orange-500 hover:bg-orange-400 transition font-bold flex items-center justify-center gap-2"
                  >
                    <Navigation size={18} />
                    Start Live Tracking
                  </button>
                )}

                {order.delivery_status === "on_the_way" && (
                  <button
                    onClick={() => updateStatus(order.id, "delivered")}
                    className="w-full h-14 rounded-2xl bg-green-500 hover:bg-green-400 transition font-black text-lg"
                  >
                    Mark Delivered
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ActiveDelivery;