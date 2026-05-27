// FILE: src/pages/driver/DriverDashboard.jsx

import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  Bike,
  Clock3,
  CircleDollarSign,
  Power,
  MapPin,
  Truck,
  LogOut,
  Navigation,
  ShieldCheck,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../../api/axios";

const WS_BASE =
  import.meta.env.VITE_WS_URL ||
  "ws://127.0.0.1:8000";

function DriverDashboard() {

  const navigate = useNavigate();

  const [availableOrders, setAvailableOrders] =
    useState([]);

  const [activeOrder, setActiveOrder] =
    useState(null);

  const [driver, setDriver] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [notRegistered, setNotRegistered] =
    useState(false);

  // OTP

  const [otpInput, setOtpInput] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [otpVerified, setOtpVerified] =
    useState(false);

  const [otpLoading, setOtpLoading] =
    useState(false);

  // REGISTER

  const [regForm, setRegForm] =
    useState({
      full_name: "",
      phone: "",
      vehicle_type: "",
      vehicle_number: "",
    });

  const [regLoading, setRegLoading] =
    useState(false);

  const socketRef = useRef(null);

  const activeOrderRef = useRef(null);

  // ─────────────────────────────────────
  // ACTIVE ORDER REF
  // ─────────────────────────────────────

  useEffect(() => {

    activeOrderRef.current =
      activeOrder;

  }, [activeOrder]);

  // ─────────────────────────────────────
  // INITIAL LOAD
  // ─────────────────────────────────────

  useEffect(() => {

    fetchDashboard();

    const interval = setInterval(() => {

      fetchDashboard();

    }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  // ─────────────────────────────────────
  // SOCKET
  // ─────────────────────────────────────

  useEffect(() => {

    if (!activeOrder) {

      if (socketRef.current) {

        socketRef.current.close();

        socketRef.current = null;
      }

      return;
    }

    const ws = new WebSocket(
      `${WS_BASE}/ws/order-tracking/${activeOrder.id}`
    );

    ws.onopen = () =>
      console.log(
        "Driver socket connected"
      );

    ws.onerror = (e) =>
      console.error(
        "Socket error:",
        e
      );

    ws.onclose = () =>
      console.log(
        "Driver socket disconnected"
      );

    socketRef.current = ws;

    return () => {

      ws.close();

      socketRef.current = null;
    };

  }, [activeOrder?.id]);

  // ─────────────────────────────────────
  // GPS
  // ─────────────────────────────────────

  useEffect(() => {

    if (notRegistered) return;

    if (!navigator.geolocation)
      return;

    const watchId =
      navigator.geolocation.watchPosition(

        async (position) => {

          const {
            latitude,
            longitude
          } = position.coords;

          try {

            await API.put(
              "/drivers/location",
              {
                latitude,
                longitude
              }
            );

            const socket =
              socketRef.current;

            const order =
              activeOrderRef.current;

            if (
              socket &&
              order &&
              socket.readyState ===
                WebSocket.OPEN
            ) {

              socket.send(
                JSON.stringify({
                  latitude,
                  longitude,
                  delivery_status:
                    order.delivery_status,
                })
              );
            }

          } catch (err) {

            console.error(
              "Location update failed:",
              err
            );
          }
        },

        (err) =>
          console.error(
            "GPS error:",
            err
          ),

        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );

    return () =>
      navigator.geolocation.clearWatch(
        watchId
      );

  }, [notRegistered]);

  // ─────────────────────────────────────
  // FETCH DASHBOARD
  // ─────────────────────────────────────

  const fetchDashboard = async () => {

    try {

      const [
        ordersRes,
        activeRes,
        driverRes
      ] = await Promise.all([

        API.get(
          "/drivers/available-orders"
        ),

        API.get(
          "/drivers/active-delivery"
        ),

        API.get("/drivers/me"),
      ]);

      setAvailableOrders(
        ordersRes.data
      );

      setActiveOrder(
        activeRes.data || null
      );

      if (
        driverRes.data?.registered ===
        false
      ) {

        setDriver(null);

        setNotRegistered(true);

      } else {

        setDriver(driverRes.data);

        setNotRegistered(false);
      }

    } catch (err) {

      console.error(
        "Dashboard fetch failed:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  // ─────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────

  const logout = () => {

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem("user");

    navigate("/login");
  };

  // ─────────────────────────────────────
  // REGISTER DRIVER
  // ─────────────────────────────────────

  const handleRegister = async () => {

    if (
      !regForm.full_name ||
      !regForm.phone ||
      !regForm.vehicle_type ||
      !regForm.vehicle_number
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    setRegLoading(true);

    try {

      await API.post(
        "/drivers/register",
        regForm
      );

      await fetchDashboard();

    } catch (err) {

      alert(
        err.response?.data?.detail ||
        "Registration failed"
      );

    } finally {

      setRegLoading(false);
    }
  };

  // ─────────────────────────────────────
  // ACCEPT ORDER
  // ─────────────────────────────────────

  const acceptOrder = async (
    orderId
  ) => {

    try {

      await API.put(
        `/drivers/accept-order/${orderId}`
      );

      alert("Order Accepted");

      fetchDashboard();

    } catch (err) {

      alert(
        err.response?.data?.detail ||
        "Failed to accept order"
      );
    }
  };

  // ─────────────────────────────────────
  // SEND OTP
  // ─────────────────────────────────────

  const sendDeliveryOtp =
    async () => {

      setOtpLoading(true);

      try {

        await API.post(
          `/drivers/send-delivery-otp/${activeOrder.id}`
        );

        setOtpSent(true);

        alert(
          "OTP sent successfully"
        );

      } catch (err) {

        alert(
          err.response?.data?.detail ||
          "Failed to send OTP"
        );

      } finally {

        setOtpLoading(false);
      }
    };

  // ─────────────────────────────────────
  // VERIFY OTP
  // ─────────────────────────────────────

  const verifyDeliveryOtp =
    async () => {

      if (
        !otpInput ||
        otpInput.length < 4
      ) {

        alert("Enter OTP");

        return;
      }

      setOtpLoading(true);

      try {

        await API.post(
          `/drivers/verify-delivery-otp/${activeOrder.id}`,
          {
            otp: otpInput
          }
        );

        setOtpVerified(true);

        alert(
          "OTP verified successfully"
        );

      } catch (err) {

        alert(
          err.response?.data?.detail ||
          "Wrong OTP"
        );

      } finally {

        setOtpLoading(false);
      }
    };

  // ─────────────────────────────────────
  // UPDATE STATUS
  // ─────────────────────────────────────

  const updateDeliveryStatus =
    async (status) => {

      if (
        status === "delivered" &&
        !otpVerified
      ) {

        alert(
          "Verify OTP first"
        );

        return;
      }

      try {

        await API.put(
          `/drivers/delivery-status/${activeOrder.id}`,
          {
            delivery_status: status
          }
        );

        alert(
          `Order marked as ${status}`
        );

        setOtpSent(false);

        setOtpVerified(false);

        setOtpInput("");

        fetchDashboard();

      } catch (err) {

        alert(
          err.response?.data?.detail ||
          "Failed to update status"
        );
      }
    };

  // ─────────────────────────────────────
  // ONLINE STATUS
  // ─────────────────────────────────────

  const toggleOnlineStatus =
    async () => {

      try {

        await API.put(
          "/drivers/status",
          {
            is_online:
              !driver.is_online
          }
        );

        fetchDashboard();

      } catch (err) {

        console.error(
          "Status toggle failed:",
          err
        );
      }
    };

  // ─────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────

  if (loading) {

    return (

      <div className="
        min-h-screen
        bg-[#070b14]
        flex
        items-center
        justify-center
        text-white
        text-4xl
        font-black
      ">
        Loading Dashboard...
      </div>
    );
  }

  // ─────────────────────────────────────
  // REGISTER SCREEN
  // ─────────────────────────────────────

  if (notRegistered) {

    return (

      <div className="
        min-h-screen
        bg-[#070b14]
        flex
        items-center
        justify-center
        text-white
        px-5
      ">

        <div className="
          w-full
          max-w-lg
          bg-white/[0.04]
          border
          border-white/10
          rounded-[35px]
          p-10
          space-y-5
        ">

          <div>

            <p className="
              text-orange-400
              uppercase
              tracking-[3px]
              text-xs
              font-bold
              mb-3
            ">
              One More Step
            </p>

            <h1 className="
              text-4xl
              font-black
            ">
              Complete Driver Profile
            </h1>

            <p className="
              text-gray-400
              mt-3
            ">
              Enter your vehicle details to start deliveries.
            </p>

          </div>

          <input
            className="
              w-full
              h-14
              rounded-2xl
              bg-white/[0.06]
              border
              border-white/10
              px-5
              outline-none
            "
            placeholder="Full Name"
            value={regForm.full_name}
            onChange={(e) =>
              setRegForm({
                ...regForm,
                full_name:
                  e.target.value
              })
            }
          />

          <input
            className="
              w-full
              h-14
              rounded-2xl
              bg-white/[0.06]
              border
              border-white/10
              px-5
              outline-none
            "
            placeholder="Phone Number"
            value={regForm.phone}
            onChange={(e) =>
              setRegForm({
                ...regForm,
                phone:
                  e.target.value
              })
            }
          />

          <select
            className="
              w-full
              h-14
              rounded-2xl
              bg-[#0d1220]
              border
              border-white/10
              px-5
              outline-none
            "
            value={regForm.vehicle_type}
            onChange={(e) =>
              setRegForm({
                ...regForm,
                vehicle_type:
                  e.target.value
              })
            }
          >

            <option
              value=""
              disabled
            >
              Select Vehicle Type
            </option>

            <option value="bike">
              Bike
            </option>

            <option value="scooter">
              Scooter
            </option>

            <option value="bicycle">
              Bicycle
            </option>

            <option value="car">
              Car
            </option>

          </select>

          <input
            className="
              w-full
              h-14
              rounded-2xl
              bg-white/[0.06]
              border
              border-white/10
              px-5
              outline-none
            "
            placeholder="Vehicle Number"
            value={regForm.vehicle_number}
            onChange={(e) =>
              setRegForm({
                ...regForm,
                vehicle_number:
                  e.target.value
              })
            }
          />

          <button
            onClick={handleRegister}
            disabled={regLoading}
            className="
              w-full
              h-14
              rounded-2xl
              bg-orange-500
              hover:bg-orange-400
              font-black
              text-lg
              transition-all
              disabled:opacity-50
            "
          >

            {
              regLoading
                ? "Registering..."
                : "Start Driving"
            }

          </button>

        </div>

      </div>
    );
  }

  // ─────────────────────────────────────
  // MAIN UI
  // ─────────────────────────────────────

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
      px-5
      lg:px-10
      py-8
    ">

      <div className="
        max-w-[1700px]
        mx-auto
      ">

        {/* HEADER */}

        <div className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-6
          mb-10
        ">

          <div>

            <p className="
              text-orange-400
              uppercase
              tracking-[3px]
              text-xs
              font-bold
              mb-3
            ">
              Driver Panel
            </p>

            <h1 className="
              text-5xl
              font-black
            ">
              Driver Dashboard
            </h1>

            <p className="
              text-gray-400
              mt-3
              text-lg
            ">
              Welcome back,
              {" "}
              {driver?.full_name}
            </p>

          </div>

          <div className="
            flex
            flex-wrap
            gap-4
          ">

            <button
              onClick={
                toggleOnlineStatus
              }
              className={`
                h-14
                px-7
                rounded-2xl
                font-bold
                flex
                items-center
                gap-3
                transition-all

                ${
                  driver?.is_online

                    ? `
                      bg-green-500
                      hover:bg-green-400
                    `

                    : `
                      bg-red-500
                      hover:bg-red-400
                    `
                }
              `}
            >

              <Power size={20} />

              {
                driver?.is_online
                  ? "Online"
                  : "Offline"
              }

            </button>

            <button
              onClick={logout}
              className="
                h-14
                px-7
                rounded-2xl
                font-bold
                flex
                items-center
                gap-3
                bg-white/[0.05]
                border
                border-white/10
                hover:bg-red-500
                hover:border-red-500
                transition-all
              "
            >

              <LogOut size={18} />

              Logout

            </button>

          </div>

        </div>

        {/* STATS */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
          mb-10
        ">

          <div className="
            rounded-[30px]
            bg-white/[0.03]
            border
            border-white/10
            p-7
          ">

            <div className="
              flex
              items-center
              gap-4
            ">

              <Bike
                className="
                  text-orange-400
                "
                size={28}
              />

              <div>

                <p className="
                  text-gray-400
                ">
                  Deliveries
                </p>

                <h2 className="
                  text-4xl
                  font-black
                ">
                  {
                    driver?.total_deliveries ||
                    0
                  }
                </h2>

              </div>

            </div>

          </div>

          <div className="
            rounded-[30px]
            bg-white/[0.03]
            border
            border-white/10
            p-7
          ">

            <div className="
              flex
              items-center
              gap-4
            ">

              <CircleDollarSign
                className="
                  text-green-400
                "
                size={28}
              />

              <div>

                <p className="
                  text-gray-400
                ">
                  Earnings
                </p>

                <h2 className="
                  text-4xl
                  font-black
                  text-green-400
                ">
                  ₹
                  {
                    driver?.total_earnings ||
                    0
                  }
                </h2>

              </div>

            </div>

          </div>

          <div className="
            rounded-[30px]
            bg-white/[0.03]
            border
            border-white/10
            p-7
          ">

            <div className="
              flex
              items-center
              gap-4
            ">

              <Truck
                className="
                  text-blue-400
                "
                size={28}
              />

              <div>

                <p className="
                  text-gray-400
                ">
                  Availability
                </p>

                <h2 className="
                  text-3xl
                  font-black
                ">
                  {
                    driver?.is_available
                      ? "Available"
                      : "Busy"
                  }
                </h2>

              </div>

            </div>

          </div>

          <div className="
            rounded-[30px]
            bg-white/[0.03]
            border
            border-white/10
            p-7
          ">

            <div className="
              flex
              items-center
              gap-4
            ">

              <Navigation
                className="
                  text-purple-400
                "
                size={28}
              />

              <div>

                <p className="
                  text-gray-400
                ">
                  Vehicle
                </p>

                <h2 className="
                  text-2xl
                  font-black
                  capitalize
                ">
                  {
                    driver?.vehicle_type
                  }
                </h2>

              </div>

            </div>

          </div>

        </div>

        {/* ACTIVE ORDER */}

        {activeOrder && (

          <div className="
            bg-orange-500/10
            border
            border-orange-500/20
            rounded-[35px]
            p-8
            mb-10
          ">

            <div className="
              flex
              items-center
              justify-between
              flex-wrap
              gap-4
              mb-6
            ">

              <h2 className="
                text-5xl
                font-black
              ">
                Active Order
              </h2>

              <div className="
                px-4
                py-2
                rounded-2xl
                bg-orange-500/20
                border
                border-orange-500/20
                text-orange-300
                font-semibold
              ">
                Order #{activeOrder.id}
              </div>

            </div>

            <div className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-5
              mb-8
            ">

              <div className="
                rounded-3xl
                bg-white/[0.04]
                border
                border-white/10
                p-5
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <MapPin
                    size={18}
                    className="
                      text-orange-400
                      shrink-0
                    "
                  />

                  <p className="
                    text-gray-200
                  ">
                    {
                      activeOrder.delivery_address
                    }
                  </p>

                </div>

              </div>

              <div className="
                rounded-3xl
                bg-white/[0.04]
                border
                border-white/10
                p-5
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <CircleDollarSign
                    size={18}
                    className="
                      text-green-400
                    "
                  />

                  <p className="
                    text-gray-200
                  ">
                    ₹
                    {
                      activeOrder.total_amount
                    }
                  </p>

                </div>

              </div>

              <div className="
                rounded-3xl
                bg-white/[0.04]
                border
                border-white/10
                p-5
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <Clock3
                    size={18}
                    className="
                      text-blue-400
                    "
                  />

                  <p className="
                    capitalize
                    text-gray-200
                  ">
                    {
                      activeOrder.delivery_status
                    }
                  </p>

                </div>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="
              flex
              flex-wrap
              gap-4
            ">

              {
                activeOrder.delivery_status ===
                "driver_assigned"

                &&

                <button
                  onClick={() =>
                    updateDeliveryStatus(
                      "picked_up"
                    )
                  }
                  className="
                    h-14
                    px-8
                    rounded-2xl
                    bg-yellow-500
                    hover:bg-yellow-400
                    font-black
                    transition-all
                  "
                >
                  Mark Picked Up
                </button>
              }

              {
                activeOrder.delivery_status ===
                "picked_up"

                &&

                <button
                  onClick={() =>
                    updateDeliveryStatus(
                      "on_the_way"
                    )
                  }
                  className="
                    h-14
                    px-8
                    rounded-2xl
                    bg-blue-500
                    hover:bg-blue-400
                    font-black
                    transition-all
                  "
                >
                  On The Way
                </button>
              }

            </div>

            {/* OTP FLOW */}

            {
              activeOrder.delivery_status ===
              "on_the_way"

              &&

              <div className="
                mt-8
              ">

                {
                  !otpSent &&
                  !otpVerified && (

                  <div className="
                    bg-blue-500/10
                    border
                    border-blue-500/20
                    rounded-3xl
                    p-6
                  ">

                    <div className="
                      flex
                      items-center
                      gap-3
                      mb-4
                    ">

                      <ShieldCheck
                        className="
                          text-blue-400
                        "
                        size={22}
                      />

                      <h3 className="
                        text-2xl
                        font-black
                      ">
                        Send Delivery OTP
                      </h3>

                    </div>

                    <button
                      onClick={
                        sendDeliveryOtp
                      }
                      disabled={otpLoading}
                      className="
                        h-14
                        px-8
                        rounded-2xl
                        bg-blue-500
                        hover:bg-blue-400
                        font-black
                        transition-all
                        disabled:opacity-50
                      "
                    >

                      {
                        otpLoading
                          ? "Sending..."
                          : "Send OTP"
                      }

                    </button>

                  </div>
                )}

                {
                  otpSent &&
                  !otpVerified && (

                  <div className="
                    bg-yellow-500/10
                    border
                    border-yellow-500/20
                    rounded-3xl
                    p-6
                  ">

                    <h3 className="
                      text-2xl
                      font-black
                      mb-5
                    ">
                      Verify OTP
                    </h3>

                    <div className="
                      flex
                      flex-col
                      md:flex-row
                      gap-4
                    ">

                      <input
                        className="
                          flex-1
                          h-14
                          rounded-2xl
                          bg-white/[0.06]
                          border
                          border-white/10
                          px-5
                          text-xl
                          text-center
                          tracking-[8px]
                          outline-none
                        "
                        placeholder="OTP"
                        value={otpInput}
                        maxLength={6}
                        onChange={(e) =>
                          setOtpInput(
                            e.target.value
                          )
                        }
                      />

                      <button
                        onClick={
                          verifyDeliveryOtp
                        }
                        disabled={otpLoading}
                        className="
                          h-14
                          px-8
                          rounded-2xl
                          bg-yellow-500
                          hover:bg-yellow-400
                          font-black
                          transition-all
                          disabled:opacity-50
                        "
                      >

                        {
                          otpLoading
                            ? "Verifying..."
                            : "Verify OTP"
                        }

                      </button>

                    </div>

                  </div>
                )}

                {
                  otpVerified && (

                  <div className="
                    bg-green-500/10
                    border
                    border-green-500/20
                    rounded-3xl
                    p-6
                  ">

                    <h3 className="
                      text-2xl
                      font-black
                      text-green-300
                      mb-5
                    ">
                      OTP Verified Successfully
                    </h3>

                    <button
                      onClick={() =>
                        updateDeliveryStatus(
                          "delivered"
                        )
                      }
                      className="
                        h-14
                        px-8
                        rounded-2xl
                        bg-green-500
                        hover:bg-green-400
                        font-black
                        transition-all
                      "
                    >
                      Mark Delivered
                    </button>

                  </div>
                )}

              </div>
            }

          </div>
        )}

        {/* AVAILABLE ORDERS */}

        <div>

          <div className="
            flex
            items-center
            justify-between
            flex-wrap
            gap-4
            mb-8
          ">

            <div>

              <h2 className="
                text-4xl
                font-black
              ">
                Available Orders
              </h2>

              <p className="
                text-gray-400
                mt-2
              ">
                Nearby delivery requests
              </p>

            </div>

            <div className="
              px-4
              py-2
              rounded-2xl
              bg-orange-500/10
              border
              border-orange-500/20
              text-orange-300
              text-sm
              font-semibold
            ">
              {
                availableOrders.length
              } Orders Nearby
            </div>

          </div>

          {
            availableOrders.length ===
            0

            &&

            <div className="
              bg-white/[0.02]
              border
              border-white/10
              rounded-[30px]
              p-12
              text-center
            ">

              <p className="
                text-gray-400
                text-xl
              ">
                No nearby orders available
              </p>

              <p className="
                text-gray-600
                mt-2
              ">
                Stay online to receive new orders.
              </p>

            </div>
          }

          <div className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
          ">

            {
              availableOrders.map(
                (order) => (

                <div
                  key={order.id}
                  className="
                    bg-white/[0.03]
                    border
                    border-white/10
                    rounded-[30px]
                    p-7
                    hover:border-orange-500/30
                    transition-all
                  "
                >

                  <div className="
                    flex
                    items-center
                    justify-between
                    mb-6
                  ">

                    <h2 className="
                      text-3xl
                      font-black
                    ">
                      Order #{order.id}
                    </h2>

                    <span className="
                      px-3
                      py-1
                      rounded-xl
                      bg-blue-500/10
                      border
                      border-blue-500/20
                      text-blue-300
                      text-sm
                      font-semibold
                    ">
                      {
                        order.distance_km
                      } km
                    </span>

                  </div>

                  <div className="
                    space-y-4
                    mb-8
                  ">

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">

                      <Truck
                        size={16}
                        className="
                          text-orange-400
                        "
                      />

                      <p>
                        {
                          order.restaurant_name
                        }
                      </p>

                    </div>

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">

                      <CircleDollarSign
                        size={16}
                        className="
                          text-green-400
                        "
                      />

                      <p>
                        ₹
                        {
                          order.total_amount
                        }
                      </p>

                    </div>

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">

                      <MapPin
                        size={16}
                        className="
                          text-orange-400
                        "
                      />

                      <p>
                        {
                          order.delivery_address
                        }
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      acceptOrder(
                        order.id
                      )
                    }
                    className="
                      w-full
                      h-14
                      rounded-2xl
                      bg-orange-500
                      hover:bg-orange-400
                      font-black
                      transition-all
                    "
                  >
                    Accept Order
                  </button>

                </div>
              ))
            }

          </div>

        </div>

      </div>

    </div>
  );
}

export default DriverDashboard;