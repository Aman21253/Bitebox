import {
  ShoppingBag,
  IndianRupee,
  Clock3,
 Bike,
  Bell,
} from "lucide-react";

import RestaurantSidebar from "../../components/restaurant/RestaurantSidebar";

function RestaurantDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const stats = [
    {
      title: "Today's Orders",
      value: "48",
      icon: ShoppingBag,
    },
    {
      title: "Revenue",
      value: "₹12,480",
      icon: IndianRupee,
    },
    {
      title: "Preparing",
      value: "9",
      icon: Clock3,
    },
    {
      title: "Active Deliveries",
      value: "5",
      icon: Bike,
    },
  ];

  const recentOrders = [
    {
      id: 1024,
      customer: "Rahul Sharma",
      amount: "₹420",
      status: "Preparing",
    },
    {
      id: 1025,
      customer: "Priya Verma",
      amount: "₹299",
      status: "Pending",
    },
    {
      id: 1026,
      customer: "Aman Gupta",
      amount: "₹580",
      status: "Out For Delivery",
    },
  ];

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
      flex
    ">

      {/* REUSABLE SIDEBAR */}

      <RestaurantSidebar />

      {/* MAIN */}

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
              hover:bg-white/10
              transition
            ">

              <Bell size={22} />

            </button>

          </div>

          {/* STATS */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-8
            mb-14
          ">

            {
              stats.map((stat) => {

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

            {/* HEADER */}

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

            {/* TABLE */}

            <div className="overflow-x-auto">

              <table className="
                w-full
              ">

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
                      Customer
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
                          hover:bg-white/[0.02]
                          transition
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
                        ">
                          {order.customer}
                        </td>

                        <td className="
                          px-8
                          py-6
                          font-semibold
                          text-orange-400
                        ">
                          {order.amount}
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