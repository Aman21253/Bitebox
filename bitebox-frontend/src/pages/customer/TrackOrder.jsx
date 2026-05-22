import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  MapPin,
  Bike,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import API from "../../api/axios";

import LiveTrackingMap from "../../components/maps/LiveTrackingMap";

function TrackOrder() {

  const { id } = useParams();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [driverLocation, setDriverLocation] =
    useState(null);

  const [animatedLocation, setAnimatedLocation] =
    useState(null);

  // ─────────────────────────────────────────
  // DRIVER MOVEMENT ANIMATION
  // ─────────────────────────────────────────

  const animateDriverMovement = (
    start,
    end
  ) => {

    let frame = 0;

    const totalFrames = 60;

    const interval = setInterval(() => {

      frame++;

      const progress =
        frame / totalFrames;

      const lat =
        start.lat +
        (end.lat - start.lat) *
        progress;

      const lng =
        start.lng +
        (end.lng - start.lng) *
        progress;

      setAnimatedLocation({
        lat,
        lng,
      });

      if (
        frame >= totalFrames
      ) {

        clearInterval(interval);

        setAnimatedLocation(end);
      }

    }, 16);
  };

  // ─────────────────────────────────────────
  // INITIAL FETCH
  // ─────────────────────────────────────────

  useEffect(() => {

    fetchOrder();

  }, []);

  // ─────────────────────────────────────────
  // REALTIME SOCKET
  // ─────────────────────────────────────────

  useEffect(() => {

    if (!id) return;

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/order-tracking/${id}`
    );

    ws.onopen = () => {

      console.log(
        "✅ Customer socket connected"
      );
    };

    ws.onmessage = (event) => {

      const message = JSON.parse(
        event.data
      );

      console.log(message);

      if (
        message.type ===
        "location_update"
      ) {

        const data = message.data;

        const newLocation = {

          lat: data.latitude,

          lng: data.longitude,
        };

        // SMOOTH ANIMATION

        setAnimatedLocation((prev) => {

          if (!prev) {
          
            return newLocation;
          }
        
          animateDriverMovement(
            prev,
            newLocation
          );
        
          return prev;
        });

        setDriverLocation(
          newLocation
        );

        // UPDATE ORDER STATUS

        setOrder((prev) => ({

          ...prev,

          delivery_status:
            data.delivery_status ||
            prev.delivery_status,
        }));
      }
    };

    ws.onerror = (error) => {

      console.log(error);
    };

    ws.onclose = () => {

      console.log(
        "❌ Customer socket disconnected"
      );
    };

    return () => {

      ws.close();
    };

  }, [id]);

  // ─────────────────────────────────────────
  // FETCH ORDER
  // ─────────────────────────────────────────

  const fetchOrder = async () => {

    try {

      const response = await API.get(
        `/orders/track/${id}`
      );

      setOrder(response.data);

      // INITIAL DRIVER LOCATION

      if (response.data.driver) {

        const initialLocation = {

          lat:
            response.data.driver.latitude ||
            28.6139,

          lng:
            response.data.driver.longitude ||
            77.2090,
        };

        setDriverLocation(
          initialLocation
        );

        setAnimatedLocation(
          initialLocation
        );
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // DELIVERY STEP STATUS
  // ─────────────────────────────────────────

  const getStepStatus = (step) => {

    const current =
      order?.delivery_status;

    const steps = [

      "waiting_for_driver",

      "driver_assigned",

      "picked_up",

      "on_the_way",

      "delivered"
    ];

    return (
      steps.indexOf(current) >=
      steps.indexOf(step)
    );
  };

  // ─────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────

  if (loading || !order) {

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

        Tracking Order...

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
      py-10
    ">

      <div className="
        max-w-[1200px]
        mx-auto
      ">

        {/* HEADER */}

        <div className="mb-10">

          <p className="
            text-orange-400
            font-semibold
            mb-3
          ">
            LIVE ORDER TRACKING
          </p>

          <h1 className="
            text-5xl
            font-black
            mb-4
          ">
            Order #{order.order_id}
          </h1>

          <p className="
            text-gray-400
            text-lg
          ">
            Real-time delivery updates
          </p>

        </div>

        {/* STATUS CARD */}

        <div className="
          bg-white/[0.03]
          border
          border-white/10
          rounded-[35px]
          p-8
          mb-8
        ">

          <div className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-8
          ">

            <div>

              <p className="
                text-gray-400
                mb-2
              ">
                Delivery Status
              </p>

              <h2 className="
                text-5xl
                font-black
                capitalize
              ">

                {
                  order.delivery_status
                    ?.replaceAll("_", " ")
                }

              </h2>

            </div>

            <div className="
              flex
              items-center
              gap-4
            ">

              <div className="
                w-16
                h-16
                rounded-3xl
                bg-orange-500/10
                flex
                items-center
                justify-center
              ">

                <Clock3
                  className="
                    text-orange-400
                  "
                />

              </div>

              <div>

                <p className="
                  text-gray-400
                ">
                  ETA
                </p>

                <h2 className="
                  text-4xl
                  font-black
                ">

                  {
                    order.estimated_delivery_time
                  } mins

                </h2>

              </div>

            </div>

          </div>

        </div>

        {/* LIVE MAP */}

        {
          driverLocation && (

            <div className="
              mb-8
            ">

              <div className="
                flex
                items-center
                gap-4
                mb-5
              ">

                <MapPin
                  className="
                    text-orange-400
                  "
                />

                <h2 className="
                  text-3xl
                  font-black
                ">
                  Live Delivery Map
                </h2>

              </div>

              <LiveTrackingMap

                driverLocation={
                  animatedLocation ||
                  driverLocation
                }

                customerLocation={{
                  lat: 28.6139,
                  lng: 77.2090,
                }}

                restaurantLocation={{
                  lat: 28.6229,
                  lng: 77.2195,
                }}
              />

            </div>
          )
        }

        {/* DELIVERY TIMELINE */}

        <div className="
          bg-white/[0.03]
          border
          border-white/10
          rounded-[35px]
          p-8
          mb-8
        ">

          <h2 className="
            text-3xl
            font-black
            mb-8
          ">
            Delivery Progress
          </h2>

          <div className="
            space-y-8
          ">

            {
              [
                {
                  key:
                    "waiting_for_driver",
                  label:
                    "Waiting for driver"
                },

                {
                  key:
                    "driver_assigned",
                  label:
                    "Driver assigned"
                },

                {
                  key:
                    "picked_up",
                  label:
                    "Order picked up"
                },

                {
                  key:
                    "on_the_way",
                  label:
                    "On the way"
                },

                {
                  key:
                    "delivered",
                  label:
                    "Delivered"
                }

              ].map((step) => (

                <div
                  key={step.key}
                  className="
                    flex
                    items-center
                    gap-5
                  "
                >

                  <div className={`
                    w-12
                    h-12
                    rounded-full
                    flex
                    items-center
                    justify-center

                    ${
                      getStepStatus(
                        step.key
                      )
                      ? "bg-green-500"
                      : "bg-white/10"
                    }
                  `}>

                    <CheckCircle2 size={20} />

                  </div>

                  <div>

                    <h3 className="
                      text-xl
                      font-bold
                    ">
                      {step.label}
                    </h3>

                  </div>

                </div>
              ))
            }

          </div>

        </div>

        {/* DRIVER DETAILS */}

        {
          order.driver && (

            <div className="
              bg-white/[0.03]
              border
              border-white/10
              rounded-[35px]
              p-8
            ">

              <div className="
                flex
                items-center
                gap-4
                mb-8
              ">

                <Bike
                  className="
                    text-orange-400
                  "
                />

                <h2 className="
                  text-3xl
                  font-black
                ">
                  Driver Details
                </h2>

              </div>

              <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
              ">

                <div>

                  <p className="
                    text-gray-400
                    mb-2
                  ">
                    Driver Name
                  </p>

                  <h3 className="
                    text-2xl
                    font-black
                  ">
                    {
                      order.driver.full_name
                    }
                  </h3>

                </div>

                <div>

                  <p className="
                    text-gray-400
                    mb-2
                  ">
                    Phone
                  </p>

                  <h3 className="
                    text-2xl
                    font-black
                  ">
                    {
                      order.driver.phone
                    }
                  </h3>

                </div>

                <div>

                  <p className="
                    text-gray-400
                    mb-2
                  ">
                    Vehicle
                  </p>

                  <h3 className="
                    text-2xl
                    font-black
                  ">
                    {
                      order.driver.vehicle_type
                    }
                  </h3>

                </div>

                <div>

                  <p className="
                    text-gray-400
                    mb-2
                  ">
                    Vehicle Number
                  </p>

                  <h3 className="
                    text-2xl
                    font-black
                  ">
                    {
                      order.driver.vehicle_number
                    }
                  </h3>

                </div>

              </div>

              {/* LIVE COORDINATES */}

              <div className="
                mt-8
                bg-orange-500/10
                border
                border-orange-500/20
                rounded-3xl
                p-6
              ">

                <div className="
                  flex
                  items-center
                  gap-4
                ">

                  <MapPin
                    className="
                      text-orange-400
                    "
                  />

                  <div>

                    <p className="
                      text-orange-300
                      font-semibold
                    ">
                      Live Driver Coordinates
                    </p>

                    <h3 className="
                      text-xl
                      font-black
                      mt-1
                    ">

                      {
                        animatedLocation?.lat
                      },

                      {
                        animatedLocation?.lng
                      }

                    </h3>

                  </div>

                </div>

              </div>

            </div>
          )
        }

      </div>

    </div>
  );
}

export default TrackOrder;