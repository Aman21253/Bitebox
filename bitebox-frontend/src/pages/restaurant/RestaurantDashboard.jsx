import {
  ShoppingBag,
  IndianRupee,
  Clock3,
  Bike,
  Bell,
  UtensilsCrossed,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import RestaurantSidebar from "../../components/restaurant/RestaurantSidebar";

function RestaurantDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [stats, setStats] =
    useState(null);

  const [recentOrders, setRecentOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchDashboardData();

  }, []);

  const fetchDashboardData = async () => {

    try {

      const [
        statsResponse,
        ordersResponse
      ] = await Promise.all([

        API.get(
          "/restaurant/dashboard/stats"
        ),

        API.get(
          "/restaurant/dashboard/recent-orders"
        )
      ]);

      setStats(
        statsResponse.data
      );

      setRecentOrders(
        ordersResponse.data
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

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

  const dashboardStats = [
    {
      title: "Total Orders",
      value: stats?.total_orders || 0,
      icon: ShoppingBag,
    },
    {
      title: "Revenue",
      value: `₹${stats?.total_revenue || 0}`,
      icon: IndianRupee,
    },
    {
      title: "Preparing",
      value: stats?.preparing_orders || 0,
      icon: Clock3,
    },
    {
      title: "Active Deliveries",
      value: stats?.active_deliveries || 0,
      icon: Bike,
    },
    {
      title: "Menu Items",
      value: stats?.total_menu_items || 0,
      icon: UtensilsCrossed,
    },
  ];

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
      flex
    ">

      <RestaurantSidebar />

      <div className="
        flex-1
        px-10
        py-10
        overflow-y-auto
      ">

        <div className="
          max-w-[1600px]
          mx-auto
        ">

          {/* TOPBAR */}

          <div className="
            flex
            items-center
            justify-between
            mb-14
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
                Restaurant Dashboard
              </p>

              <h1 className="
                text-5xl
                font-black
                tracking-tight
              ">
                Welcome,
                {" "}
                {user?.name}
              </h1>

            </div>

            <button className="
              w-14
              h-14
              rounded-2xl
              bg-white/[0.04]
              border
              border-white/10
              flex
              items-center
              justify-center
            ">

              <Bell size={22} />

            </button>

          </div>

          {/* STATS */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-5
            gap-8
            mb-14
          ">

            {
              dashboardStats.map((stat) => {

                const Icon = stat.icon;

                return (

                  <div
                    key={stat.title}
                    className="
                      relative
                      overflow-hidden
                      rounded-[30px]
                      border
                      border-white/10
                      bg-white/[0.03]
                      backdrop-blur-2xl
                      p-7
                    "
                  >

                    <div className="
                      absolute
                      top-[-40px]
                      right-[-30px]
                      w-[120px]
                      h-[120px]
                      rounded-full
                      bg-orange-500/10
                      blur-[60px]
                    " />

                    <div className="
                      relative
                      z-10
                    ">

                      <div className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-orange-500/10
                        flex
                        items-center
                        justify-center
                        mb-6
                      ">

                        <Icon
                          size={26}
                          className="
                            text-orange-400
                          "
                        />

                      </div>

                      <p className="
                        text-gray-400
                        mb-3
                        text-sm
                      ">
                        {stat.title}
                      </p>

                      <h2 className="
                        text-4xl
                        font-black
                      ">
                        {stat.value}
                      </h2>

                    </div>

                  </div>
                );
              })
            }

          </div>

          {/* RECENT ORDERS */}

          <div className="
            bg-white/[0.03]
            border
            border-white/10
            rounded-[36px]
            overflow-hidden
            p-2
          ">

            <div className="
              px-8
              py-7
              border-b
              border-white/10
            ">

              <h2 className="
                text-3xl
                font-black
              ">
                Recent Orders
              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="
                    text-left
                    border-b
                    border-white/10
                  ">

                    <th className="
                      px-8
                      py-6
                      text-gray-400
                    ">
                      Order ID
                    </th>

                    <th className="
                      px-8
                      py-6
                      text-gray-400
                    ">
                      Amount
                    </th>

                    <th className="
                      px-8
                      py-6
                      text-gray-400
                    ">
                      Payment
                    </th>

                    <th className="
                      px-8
                      py-6
                      text-gray-400
                    ">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {
                    recentOrders.map((order) => (

                      <tr
                        key={order.id}
                        className="
                          border-b
                          border-white/5
                        "
                      >

                        <td className="
                          px-8
                          py-6
                          font-bold
                        ">
                          #{order.id}
                        </td>

                        <td className="
                          px-8
                          py-6
                          text-orange-400
                          font-semibold
                        ">
                          ₹{order.total_amount}
                        </td>

                        <td className="
                          px-8
                          py-6
                          capitalize
                        ">
                          {order.payment_status}
                        </td>

                        <td className="
                          px-8
                          py-6
                        ">

                          <span className="
                            px-4
                            py-2
                            rounded-xl
                            bg-orange-500/10
                            border
                            border-orange-500/20
                            text-orange-300
                            text-sm
                            font-semibold
                            capitalize
                          ">

                            {order.status}

                          </span>

                        </td>

                      </tr>
                    ))
                  }

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RestaurantDashboard;