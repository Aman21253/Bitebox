import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Clock3,
  CircleDollarSign,
  PackageCheck,
  Bike,
} from "lucide-react";

import API from "../../api/axios";

function MyOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

      const response = await API.get(
        "/orders/my-orders"
      );

      setOrders(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const getStatusColor = (status) => {

    switch (status) {

      case "pending":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";

      case "confirmed":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";

      case "preparing":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";

      case "delivered":
        return "text-green-400 bg-green-500/10 border-green-500/20";

      default:
        return "text-gray-300 bg-white/5 border-white/10";
    }
  };

  if (loading) {

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
        Loading Orders...
      </div>
    );
  }

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
      px-5
      md:px-8
      xl:px-12
      py-8
    ">

      {/* TOP */}

      <div className="
        max-w-[1700px]
        mx-auto
      ">

        {/* HEADER */}

        <div className="
          flex
          items-center
          gap-4
          mb-14
        ">

          <button
            onClick={() => navigate("/")}
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
              hover:bg-white/10
              transition-all
              duration-300
              shrink-0
            "
          >

            <ArrowLeft size={20} />

          </button>

          <div>

            <h1 className="
              text-4xl
              md:text-5xl
              font-black
              tracking-tight
            ">
              My Orders
            </h1>

            <p className="
              text-gray-400
              mt-2
              text-sm
              md:text-base
            ">
              Track and manage all your orders
            </p>

          </div>

        </div>

        {/* EMPTY */}

        {
          orders.length === 0 && (

            <div className="
              h-[60vh]
              flex
              flex-col
              items-center
              justify-center
              text-center
            ">

              <div className="
                text-8xl
                mb-6
              ">
                🍔
              </div>

              <h2 className="
                text-4xl
                font-black
                mb-4
              ">
                No Orders Yet
              </h2>

              <p className="
                text-gray-400
                max-w-[500px]
                text-lg
                leading-relaxed
              ">
                Your delicious journey starts here.
                Explore restaurants and place your
                first order.
              </p>

              <button
                onClick={() => navigate("/")}
                className="
                  mt-8
                  bg-orange-500
                  hover:bg-orange-400
                  px-8
                  py-4
                  rounded-2xl
                  font-bold
                  text-lg
                  transition-all
                  duration-300
                "
              >
                Explore Restaurants
              </button>

            </div>
          )
        }

        {/* ORDERS */}

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-8
          xl:gap-10
        ">

          {
            orders.map((order) => (

              <div
                key={order.id}
                className="
                  bg-white/[0.03]
                  border
                  border-white/10
                  rounded-[28px]
                  hover:border-orange-500/30
                  hover:-translate-y-1
                  hover:shadow-[0_20px_80px_rgba(249,115,22,0.12)]
                  transition-all
                  duration-500
                "
              >

                {/* HEADER */}

                <div className="
                  p-6
                  xl:p-7
                  border-b
                  border-white/10
                  flex
                  items-start
                  justify-between
                  gap-5
                  flex-wrap
                ">

                  <div>

                    <p className="
                      text-sm
                      text-gray-400
                      mb-2
                    ">
                      Order ID
                    </p>

                    <h2 className="
                      text-3xl
                      md:text-4xl
                      font-black
                    ">
                      #{order.id}
                    </h2>

                  </div>

                  <div className={`
                    px-4
                    py-2
                    rounded-2xl
                    border
                    text-sm
                    font-bold
                    capitalize
                    shrink-0
                    ${getStatusColor(order.status)}
                  `}>

                    {order.status}

                  </div>

                </div>

                {/* BODY */}

                <div className="
                  p-6
                  xl:p-7
                ">

                  {/* STATS */}

                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-5
                  ">

                    {/* TOTAL */}

                    <div className="
                      bg-white/[0.03]
                      border
                      border-white/10
                      rounded-2xl
                      p-5
                      min-h-[140px]
                    ">

                      <div className="
                        flex
                        items-center
                        gap-3
                        mb-4
                      ">

                        <CircleDollarSign
                          size={20}
                          className="
                            text-orange-400
                          "
                        />

                        <p className="
                          text-gray-400
                          text-sm
                        ">
                          Total
                        </p>

                      </div>

                      <h3 className="
                        text-3xl
                        font-black
                        text-orange-400
                        break-words
                      ">
                        ₹{order.total_amount}
                      </h3>

                    </div>

                    {/* ETA */}

                    <div className="
                      bg-white/[0.03]
                      border
                      border-white/10
                      rounded-2xl
                      p-5
                      min-h-[140px]
                    ">

                      <div className="
                        flex
                        items-center
                        gap-3
                        mb-4
                      ">

                        <Clock3
                          size={20}
                          className="
                            text-orange-400
                          "
                        />

                        <p className="
                          text-gray-400
                          text-sm
                        ">
                          ETA
                        </p>

                      </div>

                      <h3 className="
                        text-3xl
                        font-black
                      ">
                        {order.estimated_delivery_time}m
                      </h3>

                    </div>

                    {/* DELIVERY */}

                    <div className="
                      bg-white/[0.03]
                      border
                      border-white/10
                      rounded-2xl
                      p-5
                      min-h-[140px]
                    ">

                      <div className="
                        flex
                        items-center
                        gap-3
                        mb-4
                      ">

                        <Bike
                          size={20}
                          className="
                            text-orange-400
                          "
                        />

                        <p className="
                          text-gray-400
                          text-sm
                        ">
                          Delivery
                        </p>

                      </div>

                      <h3 className="
                        text-base
                        xl:text-lg
                        font-bold
                        capitalize
                        break-words
                        leading-relaxed
                      ">
                        {
                          order.delivery_status
                            ?.replaceAll("_", " ")
                        }
                      </h3>

                    </div>

                  </div>

                  {/* ADDRESS */}

                  <div className="
                    mt-7
                    bg-white/[0.03]
                    border
                    border-white/10
                    rounded-2xl
                    p-5
                  ">

                    <div className="
                      flex
                      items-center
                      gap-3
                      mb-3
                    ">

                      <PackageCheck
                        size={18}
                        className="
                          text-orange-400
                        "
                      />

                      <p className="
                        text-sm
                        text-gray-400
                      ">
                        Delivery Address
                      </p>

                    </div>

                    <p className="
                      text-lg
                      leading-relaxed
                      break-words
                    ">
                      {order.delivery_address}
                    </p>

                  </div>

                  {/* FOOTER */}

                  <div className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    justify-between
                    gap-5
                    mt-8
                  ">

                    <div>

                      <p className="
                        text-sm
                        text-gray-400
                        mb-1
                      ">
                        Payment Status
                      </p>

                      <p className="
                        font-bold
                        capitalize
                        text-lg
                      ">
                        {order.payment_status}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/track-order/${order.id}`
                        )
                      }
                      className="
                        bg-orange-500
                        hover:bg-orange-400
                        px-6
                        py-3
                        rounded-2xl
                        font-bold
                        transition-all
                        duration-300
                        hover:scale-[1.02]
                        w-full
                        md:w-auto
                      "
                    >
                      Track Order
                    </button>

                  </div>

                </div>

              </div>
            ))
          }

        </div>

      </div>

    </div>
  );
}

export default MyOrders;