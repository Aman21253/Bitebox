import {
  useEffect,
  useState,
} from "react";

import {
  Bike,
  Clock3,
  CircleDollarSign,
  Power,
  MapPin,
  Truck,
  XCircle,
  Timer,
} from "lucide-react";

import API from "../../api/axios";

function DriverDashboard() {

  const [availableOrders, setAvailableOrders] =
    useState([]);

  const [activeOrder, setActiveOrder] =
    useState(null);

  const [driver, setDriver] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [socket, setSocket] =
    useState(null);

  const [showOTPModal, setShowOTPModal] =
    useState(false);

  const [deliveryOTP, setDeliveryOTP] =
    useState("");

  const [
    countdowns,
    setCountdowns
  ] = useState({});

  // ─────────────────────────────────────
  // INITIAL FETCH
  // ─────────────────────────────────────

  useEffect(() => {

    fetchDashboard();

  }, []);

  // ─────────────────────────────────────
  // AUTO REFRESH AVAILABLE ORDERS
  // ─────────────────────────────────────

  useEffect(() => {

    const interval = setInterval(() => {

      fetchDashboard();

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  // ─────────────────────────────────────
  // SOCKET CONNECTION
  // ─────────────────────────────────────

  useEffect(() => {

    if (!activeOrder) return;

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/order-tracking/${activeOrder.id}`
    );

    ws.onopen = () => {

      console.log(
        "✅ Driver socket connected"
      );
    };

    ws.onerror = (error) => {

      console.log(error);
    };

    ws.onclose = () => {

      console.log(
        "❌ Driver socket disconnected"
      );
    };

    setSocket(ws);

    return () => {

      ws.close();
    };

  }, [activeOrder]);

  // ─────────────────────────────────────
  // LIVE GPS TRACKING
  // ─────────────────────────────────────

  useEffect(() => {

    if (!activeOrder) return;

    const watchId =
      navigator.geolocation.watchPosition(

        async (position) => {

          try {

            const latitude =
              position.coords.latitude;

            const longitude =
              position.coords.longitude;

            // UPDATE DB

            await API.put(
              "/drivers/location",
              {
                latitude,
                longitude,
              }
            );

            // SOCKET EVENT

            if (

              socket &&

              activeOrder &&

              socket.readyState === 1

            ) {

              socket.send(

                JSON.stringify({

                  latitude,
                  longitude,

                  delivery_status:
                    activeOrder.delivery_status

                })

              );
            }

          } catch (error) {

            console.log(error);
          }
        },

        (error) => {

          console.log(error);
        },

        {

          enableHighAccuracy: true,

          maximumAge: 0,

          timeout: 5000,
        }

      );

    return () => {

      navigator.geolocation.clearWatch(
        watchId
      );
    };

  }, [socket, activeOrder]);

  // ─────────────────────────────────────
  // COUNTDOWN TIMER
  // ─────────────────────────────────────

  useEffect(() => {

    const interval = setInterval(() => {

      const updated = {};

      availableOrders.forEach((order) => {

        if (
          !order.driver_request_sent_at
        ) {

          updated[order.id] = 30;

          return;
        }

        const startTime = new Date(
          order.driver_request_sent_at
        ).getTime();

        const now = Date.now();

        const diff = Math.floor(
          30 - (
            now - startTime
          ) / 1000
        );

        updated[order.id] =
          diff > 0 ? diff : 0;
      });

      setCountdowns(updated);

    }, 1000);

    return () => clearInterval(interval);

  }, [availableOrders]);

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

        API.get(
          "/drivers/me"
        )
      ]);

      setAvailableOrders(
        ordersRes.data
      );

      if (
        activeRes.data.active_order === null
      ) {

        setActiveOrder(null);

      } else {

        setActiveOrder(
          activeRes.data
        );
      }

      setDriver(driverRes.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
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

      alert(
        "Order Accepted"
      );

      fetchDashboard();

    } catch (error) {

      alert(
        error.response?.data?.detail
      );
    }
  };

  // ─────────────────────────────────────
  // DECLINE ORDER
  // ─────────────────────────────────────

  const declineOrder = async (
    orderId
  ) => {

    try {

      await API.put(
        `/drivers/decline-order/${orderId}`
      );

      fetchDashboard();

    } catch (error) {

      console.log(error);
    }
  };

  // ─────────────────────────────────────
  // UPDATE DELIVERY STATUS
  // ─────────────────────────────────────

  const updateDeliveryStatus =
    async (status) => {

      try {

        const response = await API.put(

          `/drivers/delivery-status/${activeOrder.id}`,

          {
            delivery_status: status,
          }

        );

        if (
          status === "delivered"
        ) {

          alert(
            `Delivery OTP: ${response.data.otp}`
          );

          fetchDashboard();

        } else {

          alert(
            `Order marked as ${status}`
          );

          fetchDashboard();
        }

      } catch (error) {

        console.log(error);
      }
    };

  // ─────────────────────────────────────
  // VERIFY OTP
  // ─────────────────────────────────────

  const verifyDeliveryOTP =
    async () => {

      try {

        await API.put(

          `/drivers/verify-delivery-otp/${activeOrder.id}`,

          {
            otp: deliveryOTP
          }
        );

        alert(
          "Order Delivered Successfully"
        );

        setShowOTPModal(false);

        setDeliveryOTP("");

        fetchDashboard();

      } catch (error) {

        alert(
          error.response?.data?.detail
        );
      }
    };

  // ─────────────────────────────────────
  // TOGGLE ONLINE STATUS
  // ─────────────────────────────────────

  const toggleOnlineStatus =
    async () => {

      try {

        await API.put(
          "/drivers/status",
          {
            is_online:
              !driver.is_online,
          }
        );

        fetchDashboard();

      } catch (error) {

        console.log(error);
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
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-6
          mb-10
        ">

          <div>

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
              Manage deliveries
            </p>

          </div>

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

              ${
                driver?.is_online
                ? "bg-green-500"
                : "bg-red-500"
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

        </div>

        {/* ACTIVE ORDER */}

        {
          activeOrder && (

            <div className="
              bg-orange-500/10
              border
              border-orange-500/20
              rounded-[35px]
              p-8
              mb-10
            ">

              <h2 className="
                text-5xl
                font-black
                mb-6
              ">
                Order #{activeOrder.id}
              </h2>

              <div className="
                space-y-4
                text-lg
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <MapPin size={18} />

                  {
                    activeOrder.delivery_address
                  }

                </div>

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <CircleDollarSign size={18} />

                  ₹{
                    activeOrder.total_amount
                  }

                </div>

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <Clock3 size={18} />

                  {
                    activeOrder.delivery_status
                  }

                </div>

              </div>

              {/* ACTIONS */}

              <div className="
                flex
                gap-4
                mt-8
                flex-wrap
              ">

                {
                  activeOrder.delivery_status ===
                  "driver_assigned" && (

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
                        font-black
                      "
                    >

                      Picked Up

                    </button>
                  )
                }

                {
                  activeOrder.delivery_status ===
                  "picked_up" && (

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
                        font-black
                      "
                    >

                      On The Way

                    </button>
                  )
                }

                {
                  activeOrder.delivery_status ===
                  "on_the_way" && (

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
                        font-black
                      "
                    >

                      Generate OTP

                    </button>
                  )
                }

                {
                  activeOrder.delivery_status ===
                  "otp_verification_pending" && (

                    <button

                      onClick={() =>
                        setShowOTPModal(true)
                      }

                      className="
                        h-14
                        px-8
                        rounded-2xl
                        bg-yellow-500
                        font-black
                      "
                    >

                      Verify OTP

                    </button>
                  )
                }

              </div>

            </div>
          )
        }

        {/* AVAILABLE ORDERS */}

        <div>

          <h2 className="
            text-4xl
            font-black
            mb-8
          ">
            Available Orders
          </h2>

          <div className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
          ">

            {
              availableOrders.map((order) => (

                <div

                  key={order.id}

                  className="
                    bg-white/[0.03]
                    border
                    border-white/10
                    rounded-[30px]
                    p-7
                    relative
                    overflow-hidden
                  "
                >

                  <div className="
                    absolute
                    top-5
                    right-5
                    flex
                    items-center
                    gap-2
                    bg-red-500/10
                    border
                    border-red-500/20
                    px-4
                    py-2
                    rounded-2xl
                  ">

                    <Timer
                      size={16}
                      className="
                        text-red-400
                      "
                    />

                    <span className="
                      text-red-400
                      font-black
                    ">

                      {
                        countdowns[
                          order.id
                        ] || 0
                      }s

                    </span>

                  </div>

                  <h2 className="
                    text-3xl
                    font-black
                    mb-5
                  ">
                    Order #{order.id}
                  </h2>

                  <div className="
                    space-y-4
                    text-lg
                  ">

                    <p>
                      💰 ₹{
                        order.total_amount
                      }
                    </p>

                    <p>
                      📍 {
                        order.delivery_address
                      }
                    </p>

                    <p>
                      🚚 {
                        order.delivery_status
                      }
                    </p>

                  </div>

                  <div className="
                    mt-8
                    flex
                    gap-4
                  ">

                    <button

                      onClick={() =>
                        acceptOrder(order.id)
                      }

                      className="
                        flex-1
                        h-14
                        rounded-2xl
                        bg-orange-500
                        hover:bg-orange-400
                        transition
                        font-black
                      "
                    >

                      Accept

                    </button>

                    <button

                      onClick={() =>
                        declineOrder(order.id)
                      }

                      className="
                        w-16
                        h-14
                        rounded-2xl
                        bg-red-500/10
                        border
                        border-red-500/20
                        flex
                        items-center
                        justify-center
                        hover:bg-red-500/20
                        transition
                      "
                    >

                      <XCircle
                        className="
                          text-red-400
                        "
                      />

                    </button>

                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* OTP MODAL */}

        {
          showOTPModal && (

            <div className="
              fixed
              inset-0
              bg-black/70
              flex
              items-center
              justify-center
              z-50
            ">

              <div className="
                bg-[#111827]
                p-8
                rounded-3xl
                w-[400px]
              ">

                <h2 className="
                  text-3xl
                  font-black
                  mb-6
                ">
                  Verify Delivery OTP
                </h2>

                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={deliveryOTP}
                  onChange={(e) =>
                    setDeliveryOTP(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    bg-black/30
                    border
                    border-white/10
                    px-5
                    outline-none
                  "
                />

                <button
                  onClick={verifyDeliveryOTP}
                  className="
                    mt-6
                    w-full
                    h-14
                    rounded-2xl
                    bg-green-500
                    font-black
                  "
                >
                  Verify OTP
                </button>

              </div>

            </div>
          )
        }

      </div>

    </div>
  );
}

export default DriverDashboard;