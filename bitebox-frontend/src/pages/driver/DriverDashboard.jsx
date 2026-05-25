import { useEffect, useState, useRef } from "react";
import { Bike, Clock3, CircleDollarSign, Power, MapPin, Truck } from "lucide-react";
import API from "../../api/axios";

const WS_BASE = import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000";

function DriverDashboard() {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notRegistered, setNotRegistered] = useState(false);

  // OTP STATE
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // REGISTRATION FORM
  const [regForm, setRegForm] = useState({
    full_name: "", phone: "", vehicle_type: "", vehicle_number: "",
  });
  const [regLoading, setRegLoading] = useState(false);

  const socketRef = useRef(null);
  const activeOrderRef = useRef(null);

  useEffect(() => { activeOrderRef.current = activeOrder; }, [activeOrder]);
  useEffect(() => { fetchDashboard(); }, []);

  // ─────────────────────────────────────
  // SOCKET
  // ─────────────────────────────────────

  useEffect(() => {
    if (!activeOrder) {
      if (socketRef.current) { socketRef.current.close(); socketRef.current = null; }
      return;
    }
    const ws = new WebSocket(`${WS_BASE}/ws/order-tracking/${activeOrder.id}`);
    ws.onopen = () => console.log("Driver socket connected");
    ws.onerror = (e) => console.error("Socket error:", e);
    ws.onclose = () => console.log("Driver socket disconnected");
    socketRef.current = ws;
    return () => { ws.close(); socketRef.current = null; };
  }, [activeOrder?.id]);

  // ─────────────────────────────────────
  // GPS — only after registered
  // ─────────────────────────────────────

  useEffect(() => {
    if (notRegistered) return;
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await API.put("/drivers/location", { latitude, longitude });
          const socket = socketRef.current;
          const order = activeOrderRef.current;
          if (socket && order && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ latitude, longitude, delivery_status: order.delivery_status }));
          }
        } catch (err) {
          console.error("Location update failed:", err);
        }
      },
      (err) => console.error("GPS error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [notRegistered]);

  // ─────────────────────────────────────
  // FETCH DASHBOARD
  // ─────────────────────────────────────

  const fetchDashboard = async () => {
    try {
      const [ordersRes, activeRes, driverRes] = await Promise.all([
        API.get("/drivers/available-orders"),
        API.get("/drivers/active-delivery"),
        API.get("/drivers/me"),
      ]);

      setAvailableOrders(ordersRes.data);
      setActiveOrder(activeRes.data?.active_order === null ? null : activeRes.data);

      if (driverRes.data?.registered === false) {
        setDriver(null);
        setNotRegistered(true);
      } else {
        setDriver(driverRes.data);
        setNotRegistered(false);
      }
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────
  // REGISTER DRIVER
  // ─────────────────────────────────────

  const handleRegister = async () => {
    if (!regForm.full_name || !regForm.phone || !regForm.vehicle_type || !regForm.vehicle_number) {
      alert("Please fill all fields");
      return;
    }
    setRegLoading(true);
    try {
      await API.post("/drivers/register", regForm);
      await fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  // ─────────────────────────────────────
  // ACCEPT ORDER
  // ─────────────────────────────────────

  const acceptOrder = async (orderId) => {
    try {
      await API.put(`/drivers/accept-order/${orderId}`);
      alert("Order Accepted");
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to accept order");
    }
  };

  // ─────────────────────────────────────
  // SEND DELIVERY OTP
  // ─────────────────────────────────────

  const sendDeliveryOtp = async () => {
    setOtpLoading(true);
    try {
      await API.post(`/drivers/send-delivery-otp/${activeOrder.id}`);
      setOtpSent(true);
      alert("OTP sent to customer's phone");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // ─────────────────────────────────────
  // VERIFY DELIVERY OTP
  // ─────────────────────────────────────

  const verifyDeliveryOtp = async () => {
    if (!otpInput || otpInput.length < 4) {
      alert("Enter the OTP from the customer");
      return;
    }
    setOtpLoading(true);
    try {
      await API.post(`/drivers/verify-delivery-otp/${activeOrder.id}`, { otp: otpInput });
      setOtpVerified(true);
      alert("OTP verified! You can now mark as delivered.");
    } catch (err) {
      alert(err.response?.data?.detail || "Wrong OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // ─────────────────────────────────────
  // UPDATE DELIVERY STATUS
  // ─────────────────────────────────────

  const updateDeliveryStatus = async (status) => {
    if (status === "delivered" && !otpVerified) {
      alert("You must verify the delivery OTP before marking as delivered.");
      return;
    }
    try {
      await API.put(`/drivers/delivery-status/${activeOrder.id}`, { delivery_status: status });
      alert(`Order marked as ${status}`);
      // Reset OTP state
      setOtpSent(false);
      setOtpVerified(false);
      setOtpInput("");
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update status");
    }
  };

  // ─────────────────────────────────────
  // TOGGLE ONLINE
  // ─────────────────────────────────────

  const toggleOnlineStatus = async () => {
    try {
      await API.put("/drivers/status", { is_online: !driver.is_online });
      fetchDashboard();
    } catch (err) {
      console.error("Status toggle failed:", err);
    }
  };

  // ─────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white text-4xl font-black">
        Loading Dashboard...
      </div>
    );
  }

  // ─────────────────────────────────────
  // INLINE REGISTRATION
  // ─────────────────────────────────────

  if (notRegistered) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white px-5">
        <div className="w-full max-w-lg bg-white/[0.04] border border-white/10 rounded-[35px] p-10 space-y-5">
          <div className="mb-2">
            <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">One More Step</p>
            <h1 className="text-4xl font-black">Complete Driver Profile</h1>
            <p className="text-gray-400 mt-3">Enter your vehicle details to start accepting orders.</p>
          </div>
          <input
            className="w-full h-14 rounded-2xl bg-white/[0.06] border border-white/10 px-5 text-white placeholder-gray-500 outline-none"
            placeholder="Full Name"
            value={regForm.full_name}
            onChange={(e) => setRegForm({ ...regForm, full_name: e.target.value })}
          />
          <input
            className="w-full h-14 rounded-2xl bg-white/[0.06] border border-white/10 px-5 text-white placeholder-gray-500 outline-none"
            placeholder="Phone Number"
            value={regForm.phone}
            onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
          />
          <select
            className="w-full h-14 rounded-2xl bg-[#0d1220] border border-white/10 px-5 text-white outline-none"
            value={regForm.vehicle_type}
            onChange={(e) => setRegForm({ ...regForm, vehicle_type: e.target.value })}
          >
            <option value="" disabled>Select Vehicle Type</option>
            <option value="bike">Bike</option>
            <option value="scooter">Scooter</option>
            <option value="bicycle">Bicycle</option>
            <option value="car">Car</option>
          </select>
          <input
            className="w-full h-14 rounded-2xl bg-white/[0.06] border border-white/10 px-5 text-white placeholder-gray-500 outline-none"
            placeholder="Vehicle Number (e.g. RJ14 AB 1234)"
            value={regForm.vehicle_number}
            onChange={(e) => setRegForm({ ...regForm, vehicle_number: e.target.value })}
          />
          <button
            onClick={handleRegister}
            disabled={regLoading}
            className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-400 font-black text-lg disabled:opacity-50 transition-colors"
          >
            {regLoading ? "Registering..." : "Start Driving"}
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────
  // MAIN DASHBOARD
  // ─────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#070b14] text-white px-5 lg:px-10 py-8">
      <div className="max-w-[1700px] mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-black">Driver Dashboard</h1>
            <p className="text-gray-400 mt-3 text-lg">Welcome, {driver?.full_name}</p>
          </div>
          <button
            onClick={toggleOnlineStatus}
            className={`h-14 px-7 rounded-2xl font-bold flex items-center gap-3 transition-colors ${
              driver?.is_online ? "bg-green-500 hover:bg-green-400" : "bg-red-500 hover:bg-red-400"
            }`}
          >
            <Power size={20} />
            {driver?.is_online ? "Online" : "Offline"}
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-7">
            <div className="flex items-center gap-4">
              <Bike className="text-orange-400" size={28} />
              <div>
                <p className="text-gray-400">Total Deliveries</p>
                <h2 className="text-4xl font-black">{driver?.total_deliveries || 0}</h2>
              </div>
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-7">
            <div className="flex items-center gap-4">
              <CircleDollarSign className="text-green-400" size={28} />
              <div>
                <p className="text-gray-400">Total Earnings</p>
                <h2 className="text-4xl font-black text-green-400">Rs.{driver?.total_earnings || 0}</h2>
              </div>
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-7">
            <div className="flex items-center gap-4">
              <Truck className="text-blue-400" size={28} />
              <div>
                <p className="text-gray-400">Availability</p>
                <h2 className="text-3xl font-black">{driver?.is_available ? "Available" : "Busy"}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE ORDER */}
        {activeOrder && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-[35px] p-8 mb-10">
            <h2 className="text-5xl font-black mb-6">Active — Order #{activeOrder.id}</h2>

            <div className="space-y-4 text-lg mb-8">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-orange-400 shrink-0" />
                {activeOrder.delivery_address}
              </div>
              <div className="flex items-center gap-3">
                <CircleDollarSign size={18} className="text-green-400 shrink-0" />
                Rs.{activeOrder.total_amount}
              </div>
              <div className="flex items-center gap-3">
                <Clock3 size={18} className="text-blue-400 shrink-0" />
                {activeOrder.delivery_status}
              </div>
            </div>

            {/* STATUS BUTTONS */}
            <div className="flex gap-4 flex-wrap">
              {activeOrder.delivery_status === "driver_assigned" && (
                <button
                  onClick={() => updateDeliveryStatus("picked_up")}
                  className="h-14 px-8 rounded-2xl bg-yellow-500 hover:bg-yellow-400 font-black transition-colors"
                >
                  Mark Picked Up
                </button>
              )}
              {activeOrder.delivery_status === "picked_up" && (
                <button
                  onClick={() => updateDeliveryStatus("on_the_way")}
                  className="h-14 px-8 rounded-2xl bg-blue-500 hover:bg-blue-400 font-black transition-colors"
                >
                  On The Way
                </button>
              )}

              {/* ─────────────────────────────────────
                  OTP FLOW — only shows when on_the_way
              ───────────────────────────────────── */}
              {activeOrder.delivery_status === "on_the_way" && (
                <div className="w-full mt-2">

                  {/* STEP 1 — Send OTP */}
                  {!otpSent && !otpVerified && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 space-y-4">
                      <p className="text-blue-300 font-semibold">
                        Step 1: Send delivery OTP to customer
                      </p>
                      <p className="text-gray-400 text-sm">
                        When you arrive at the delivery location, send the OTP to the customer phone.
                      </p>
                      <button
                        onClick={sendDeliveryOtp}
                        disabled={otpLoading}
                        className="h-12 px-8 rounded-2xl bg-blue-500 hover:bg-blue-400 font-black transition-colors disabled:opacity-50"
                      >
                        {otpLoading ? "Sending..." : "Send OTP to Customer"}
                      </button>
                    </div>
                  )}

                  {/* STEP 2 — Enter OTP */}
                  {otpSent && !otpVerified && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 space-y-4">
                      <p className="text-yellow-300 font-semibold">
                        Step 2: Ask customer for their OTP
                      </p>
                      <p className="text-gray-400 text-sm">
                        OTP has been sent to the customer. Enter it below to confirm delivery.
                      </p>
                      <div className="flex gap-3">
                        <input
                          className="flex-1 h-14 rounded-2xl bg-white/[0.06] border border-white/10 px-5 text-white text-xl tracking-widest text-center outline-none"
                          placeholder="Enter OTP"
                          value={otpInput}
                          maxLength={6}
                          onChange={(e) => setOtpInput(e.target.value)}
                        />
                        <button
                          onClick={verifyDeliveryOtp}
                          disabled={otpLoading}
                          className="h-14 px-8 rounded-2xl bg-yellow-500 hover:bg-yellow-400 font-black transition-colors disabled:opacity-50"
                        >
                          {otpLoading ? "Verifying..." : "Verify"}
                        </button>
                      </div>
                      <button
                        onClick={sendDeliveryOtp}
                        disabled={otpLoading}
                        className="text-sm text-gray-400 hover:text-white underline"
                      >
                        Resend OTP
                      </button>
                    </div>
                  )}

                  {/* STEP 3 — Mark Delivered */}
                  {otpVerified && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 space-y-4">
                      <p className="text-green-300 font-semibold">
                        OTP Verified! Complete the delivery.
                      </p>
                      <button
                        onClick={() => updateDeliveryStatus("delivered")}
                        className="h-14 px-8 rounded-2xl bg-green-500 hover:bg-green-400 font-black transition-colors"
                      >
                        Mark Delivered
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        )}

        {/* AVAILABLE ORDERS */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-4xl font-black">Available Orders</h2>
            <span className="px-4 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-semibold">
              Within 15km
            </span>
          </div>

          {availableOrders.length === 0 && (
            <div className="bg-white/[0.02] border border-white/10 rounded-[30px] p-10 text-center">
              <p className="text-gray-400 text-lg">No orders within 15km right now.</p>
              <p className="text-gray-600 mt-2">Stay online to receive nearby orders.</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {availableOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white/[0.03] border border-white/10 rounded-[30px] p-7"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-3xl font-black">Order #{order.id}</h2>
                  <span className="px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-semibold">
                    {order.distance_km} km away
                  </span>
                </div>
                <div className="space-y-3 text-lg">
                  <div className="flex items-center gap-3">
                    <Truck size={16} className="text-orange-400 shrink-0" />
                    {order.restaurant_name}
                  </div>
                  <div className="flex items-center gap-3">
                    <CircleDollarSign size={16} className="text-green-400 shrink-0" />
                    Rs.{order.total_amount}
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-orange-400 shrink-0" />
                    {order.delivery_address}
                  </div>
                </div>
                <button
                  onClick={() => acceptOrder(order.id)}
                  className="mt-8 w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-400 font-black transition-colors"
                >
                  Accept Order
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default DriverDashboard;