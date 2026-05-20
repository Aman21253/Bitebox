import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import RestaurantSidebar from "../../components/restaurant/RestaurantSidebar";

import {
  ShoppingBag,
  IndianRupee,
  CheckCircle2,
  UtensilsCrossed,
  Clock3,
  Flame,
} from "lucide-react";

function RestaurantAnalytics() {

  const [overview, setOverview] =
    useState(null);

  const [topItems, setTopItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchAnalytics();

  }, []);

  const fetchAnalytics = async () => {

    try {

      const overviewResponse =
        await API.get(
          "/restaurant/analytics/overview"
        );

      const topItemsResponse =
        await API.get(
          "/restaurant/analytics/top-items"
        );

      setOverview(
        overviewResponse.data
      );

      setTopItems(
        topItemsResponse.data
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
        Loading Analytics...
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${overview.total_revenue}`,
      icon: IndianRupee,
    },
    {
      title: "Total Orders",
      value: overview.total_orders,
      icon: ShoppingBag,
    },
    {
      title: "Delivered Orders",
      value: overview.delivered_orders,
      icon: CheckCircle2,
    },
    {
      title: "Active Menu Items",
      value: overview.active_items,
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
        p-8
        overflow-y-auto
      ">

        {/* HEADER */}

        <div className="mb-10">

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
          ">
            Analytics
          </h1>

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

          {
            stats.map((stat) => {

              const Icon = stat.icon;

              return (

                <div
                  key={stat.title}
                  className="
                    rounded-[32px]
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-6
                  "
                >

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
                    mb-2
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
              );
            })
          }

        </div>

        {/* LIVE STATUS */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          mb-10
        ">

          <div className="
            rounded-[32px]
            border
            border-yellow-500/20
            bg-yellow-500/10
            p-7
          ">

            <div className="
              flex
              items-center
              gap-4
              mb-5
            ">

              <Clock3
                className="
                  text-yellow-300
                "
              />

              <h2 className="
                text-2xl
                font-black
              ">
                Pending Orders
              </h2>

            </div>

            <h1 className="
              text-6xl
              font-black
            ">
              {overview.pending_orders}
            </h1>

          </div>

          <div className="
            rounded-[32px]
            border
            border-orange-500/20
            bg-orange-500/10
            p-7
          ">

            <div className="
              flex
              items-center
              gap-4
              mb-5
            ">

              <Flame
                className="
                  text-orange-300
                "
              />

              <h2 className="
                text-2xl
                font-black
              ">
                Preparing Orders
              </h2>

            </div>

            <h1 className="
              text-6xl
              font-black
            ">
              {overview.preparing_orders}
            </h1>

          </div>

        </div>

        {/* TOP ITEMS */}

        <div className="
          rounded-[32px]
          border
          border-white/10
          bg-white/[0.03]
          overflow-hidden
        ">

          <div className="
            p-7
            border-b
            border-white/10
          ">

            <h2 className="
              text-3xl
              font-black
            ">
              Top Selling Items
            </h2>

          </div>

          <div className="p-7 space-y-5">

            {
              topItems.map((item, index) => (

                <div
                  key={index}
                  className="
                    flex
                    items-center
                    justify-between
                    bg-white/[0.03]
                    border
                    border-white/10
                    rounded-2xl
                    p-5
                  "
                >

                  <div>

                    <h3 className="
                      text-2xl
                      font-bold
                    ">
                      {item.item_name}
                    </h3>

                    <p className="
                      text-gray-400
                      mt-1
                    ">
                      {item.total_quantity} orders
                    </p>

                  </div>

                  <h2 className="
                    text-3xl
                    font-black
                    text-orange-400
                  ">
                    ₹{item.revenue}
                  </h2>

                </div>
              ))
            }

          </div>

        </div>

      </div>

    </div>
  );
}

export default RestaurantAnalytics;