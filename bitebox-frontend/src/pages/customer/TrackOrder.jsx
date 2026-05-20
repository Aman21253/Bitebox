import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Clock3,
  Bike,
  CheckCircle2,
  ChefHat,
  Package,
  MapPin,
} from "lucide-react";

import API from "../../api/axios";

function TrackOrder() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {

    fetchOrder();

    const interval = setInterval(() => {

      fetchOrder();

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  const fetchOrder = async () => {

    try {

      const response = await API.get(
        "/orders/my-orders"
      );

      const currentOrder =
        response.data.find(
          (o) => o.id == id
        );

      setOrder(currentOrder);

    } catch (error) {

      console.log(error);

    }
  };

  const steps = [
    {
      key: "pending",
      title: "Order Placed",
      icon: Package,
    },
    {
      key: "confirmed",
      title: "Restaurant Accepted",
      icon: CheckCircle2,
    },
    {
      key: "preparing",
      title: "Preparing Food",
      icon: ChefHat,
    },
    {
      key: "out_for_delivery",
      title: "Out For Delivery",
      icon: Bike,
    },
    {
      key: "delivered",
      title: "Delivered",
      icon: MapPin,
    },
  ];

  const currentStepIndex =
    steps.findIndex(
      (step) => step.key === order?.status
    );

  if (!order) {

    return (

      <div className="
        min-h-screen
        bg-[#070b14]
        text-white
        flex
        items-center
        justify-center
        text-3xl
        font-black
      ">
        Loading Tracking...
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
        max-w-[1100px]
        mx-auto
      ">

        {/* TOP */}

        <div className="
          flex
          items-center
          gap-4
          mb-10
        ">

          <button
            onClick={() => navigate(-1)}
            className="
              w-12
              h-12
              rounded-2xl
              bg-white/5
              border
              border-white/10
              flex
              items-center
              justify-center
            "
          >

            <ArrowLeft size={20} />

          </button>

          <div>

            <h1 className="
              text-5xl
              font-black
            ">
              Track Order
            </h1>

            <p className="
              text-gray-400
              mt-2
            ">
              Order #{order.id}
            </p>

          </div>

        </div>

        {/* HERO CARD */}

        <div className="
          relative
          overflow-hidden
          rounded-[40px]
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-2xl
          p-8
        ">

          {/* GLOW */}

          <div className="
            absolute
            top-[-100px]
            right-[-100px]
            w-[300px]
            h-[300px]
            rounded-full
            bg-orange-500/20
            blur-[120px]
          " />

          <div className="relative z-10">

            {/* STATUS */}

            <div className="
              flex
              items-center
              justify-between
              flex-wrap
              gap-5
            ">

              <div>

                <p className="
                  text-sm
                  text-gray-400
                  mb-3
                ">
                  Current Status
                </p>

                <h2 className="
                  text-5xl
                  font-black
                  capitalize
                ">
                  {order.status.replaceAll(
                    "_",
                    " "
                  )}
                </h2>

              </div>

              <div className="
                px-6
                py-4
                rounded-2xl
                bg-orange-500/10
                border
                border-orange-500/20
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <Clock3
                    size={20}
                    className="
                      text-orange-400
                    "
                  />

                  <div>

                    <p className="
                      text-sm
                      text-gray-400
                    ">
                      Estimated Delivery
                    </p>

                    <h3 className="
                      text-2xl
                      font-black
                      text-orange-400
                    ">
                      {order.estimated_delivery_time} mins
                    </h3>

                  </div>

                </div>

              </div>

            </div>

            {/* TIMELINE */}

            <div className="
              mt-16
              relative
            ">

              {/* LINE */}

              <div className="
                absolute
                top-7
                left-0
                w-full
                h-[3px]
                bg-white/10
              " />

              <div className="
                absolute
                top-7
                left-0
                h-[3px]
                bg-orange-500
                transition-all
                duration-700
              "
              style={{
                width: `${
                  (
                    currentStepIndex /
                    (steps.length - 1)
                  ) * 100
                }%`,
              }}
              />

              <div className="
                relative
                grid
                grid-cols-5
                gap-5
              ">

                {
                  steps.map(
                    (
                      step,
                      index
                    ) => {

                      const Icon =
                        step.icon;

                      const active =
                        index <= currentStepIndex;

                      return (

                        <div
                          key={step.key}
                          className="
                            flex
                            flex-col
                            items-center
                            text-center
                          "
                        >

                          <div className={`
                            w-14
                            h-14
                            rounded-full
                            flex
                            items-center
                            justify-center
                            border
                            transition-all
                            duration-500
                            ${
                              active
                              ? "bg-orange-500 border-orange-400 shadow-[0_0_40px_rgba(249,115,22,0.6)]"
                              : "bg-[#111827] border-white/10"
                            }
                          `}>

                            <Icon size={22} />

                          </div>

                          <p className={`
                            mt-4
                            text-sm
                            font-semibold
                            ${
                              active
                              ? "text-white"
                              : "text-gray-500"
                            }
                          `}>

                            {step.title}

                          </p>

                        </div>
                      );
                    }
                  )
                }

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default TrackOrder;