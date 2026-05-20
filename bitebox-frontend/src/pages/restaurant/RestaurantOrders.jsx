import {
  useEffect,
  useState,
} from "react";

import {
  ClipboardList,
  RefreshCcw,
} from "lucide-react";

import API from "../../api/axios";

import RestaurantSidebar from "../../components/restaurant/RestaurantSidebar";

import OrderCard from "../../components/restaurant/OrderCard";

function RestaurantOrders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

      const response = await API.get(
        "/restaurant/orders"
      );

      if (
        Array.isArray(response.data)
      ) {

        setOrders(response.data);

      } else {

        setOrders([]);
      }

    } catch (error) {

      console.log(error);

      setOrders([]);

    } finally {

      setLoading(false);
    }
  };

  const updateStatus = async (
    orderId,
    status
  ) => {

    try {

      await API.put(
        `/restaurant/orders/${orderId}/status`,
        {
          status,
        }
      );

      fetchOrders();

    } catch (error) {

      console.log(error);
    }
  };

  const autoAssignDriver = async (
    orderId
  ) => {

    try {

      await API.put(
        `/restaurant/orders/${orderId}/auto-assign`
      );

      fetchOrders();

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
      flex
    ">

      <RestaurantSidebar />

      {/* MAIN */}

      <div className="
        flex-1
        p-8
        overflow-y-auto
      ">

        {/* TOP */}

        <div className="
          flex
          items-center
          justify-between
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
              Restaurant Panel
            </p>

            <h1 className="
              text-5xl
              font-black
              tracking-tight
            ">
              Live Orders
            </h1>

          </div>

          <button
            onClick={fetchOrders}
            className="
              w-14
              h-14
              rounded-2xl
              bg-white/[0.04]
              border
              border-white/10
              flex
              items-center
              justify-center
              hover:bg-white/10
              transition
            "
          >

            <RefreshCcw size={22} />

          </button>

        </div>

        {/* LOADING */}

        {
          loading ? (

            <div className="
              h-[70vh]
              flex
              items-center
              justify-center
              text-3xl
              font-black
            ">
              Loading Orders...
            </div>

          ) : orders.length === 0 ? (

            <div className="
              h-[70vh]
              flex
              flex-col
              items-center
              justify-center
              text-center
            ">

              <ClipboardList
                size={90}
                className="
                  text-orange-400
                  mb-6
                "
              />

              <h2 className="
                text-4xl
                font-black
                mb-4
              ">
                No Orders Yet
              </h2>

              <p className="
                text-gray-400
                text-lg
              ">
                Incoming customer orders
                will appear here.
              </p>

            </div>

          ) : (

            <div className="
              grid
              grid-cols-1
              xl:grid-cols-2
              gap-8
            ">

              {
                orders.map((order) => (

                  <OrderCard
                    key={order.id}
                    order={order}
                    updateStatus={
                      updateStatus
                    }
                    autoAssignDriver={
                      autoAssignDriver
                    }
                  />
                ))
              }

            </div>

          )
        }

      </div>

    </div>
  );
}

export default RestaurantOrders;