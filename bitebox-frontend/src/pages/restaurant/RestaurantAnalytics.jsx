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
  TrendingUp,
  Activity,
} from "lucide-react";

import {

  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,

} from "recharts";

function RestaurantAnalytics() {

  const [overview, setOverview] =
    useState(null);

  const [topItems, setTopItems] =
    useState([]);

  const [revenueChart, setRevenueChart] =
    useState([]);

  const [ordersChart, setOrdersChart] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchAnalytics();

    // AUTO REFRESH

    const interval = setInterval(() => {

      fetchAnalytics();

    }, 15000);

    return () => clearInterval(interval);

  }, []);

  const fetchAnalytics = async () => {

    try {

      const [
        overviewResponse,
        topItemsResponse,
        revenueResponse,
        ordersResponse
      ] = await Promise.all([

        API.get(
          "/restaurant/analytics/overview"
        ),

        API.get(
          "/restaurant/analytics/top-items"
        ),

        API.get(
          "/restaurant/analytics/revenue-chart"
        ),

        API.get(
          "/restaurant/analytics/orders-chart"
        )

      ]);

      setOverview(
        overviewResponse.data
      );

      setTopItems(
        topItemsResponse.data
      );

      setRevenueChart(
        revenueResponse.data
      );

      setOrdersChart(
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
        Loading Analytics...
      </div>
    );
  }

  const stats = [

    {
      title: "Total Revenue",
      value: `₹${overview.total_revenue}`,
      icon: IndianRupee,
      gradient:
        "from-orange-500/20 to-red-500/10",
    },

    {
      title: "Total Orders",
      value: overview.total_orders,
      icon: ShoppingBag,
      gradient:
        "from-blue-500/20 to-cyan-500/10",
    },

    {
      title: "Delivered Orders",
      value: overview.delivered_orders,
      icon: CheckCircle2,
      gradient:
        "from-green-500/20 to-emerald-500/10",
    },

    {
      title: "Active Menu Items",
      value: overview.active_items,
      icon: UtensilsCrossed,
      gradient:
        "from-purple-500/20 to-pink-500/10",
    },

  ];

  const pieColors = [
    "#f97316",
    "#22c55e",
    "#3b82f6",
    "#ef4444",
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
              tracking-[4px]
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
              Analytics Dashboard
            </h1>

          </div>

          <div className="
            flex
            items-center
            gap-3
            px-5
            py-3
            rounded-2xl
            border
            border-green-500/20
            bg-green-500/10
          ">

            <Activity
              className="
                text-green-400
              "
            />

            <p className="
              font-bold
              text-green-300
            ">
              Live Analytics
            </p>

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

          {
            stats.map((stat) => {

              const Icon = stat.icon;

              return (

                <div
                  key={stat.title}
                  className={`
                    rounded-[32px]
                    border
                    border-white/10
                    bg-gradient-to-br
                    ${stat.gradient}
                    backdrop-blur-xl
                    p-6
                    relative
                    overflow-hidden
                    hover:scale-[1.02]
                    transition
                  `}
                >

                  <div className="
                    absolute
                    -right-8
                    -top-8
                    w-32
                    h-32
                    rounded-full
                    bg-white/5
                  " />

                  <div className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-white/10
                    flex
                    items-center
                    justify-center
                    mb-6
                  ">

                    <Icon size={28} />

                  </div>

                  <p className="
                    text-gray-300
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

        {/* CHARTS */}

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-8
          mb-10
        ">

          {/* REVENUE */}

          <div className="
            bg-white/[0.04]
            border
            border-white/10
            rounded-[32px]
            p-6
          ">

            <div className="
              flex
              items-center
              gap-3
              mb-8
            ">

              <TrendingUp
                className="
                  text-orange-400
                "
              />

              <h2 className="
                text-3xl
                font-black
              ">
                Revenue Trends
              </h2>

            </div>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <LineChart
                data={revenueChart}
              >

                <CartesianGrid
                  stroke="#1f2937"
                />

                <XAxis
                  dataKey="day"
                  stroke="#9ca3af"
                />

                <YAxis
                  stroke="#9ca3af"
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f97316"
                  strokeWidth={4}
                  dot={{
                    r: 6,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

          {/* ORDER STATUS */}

          <div className="
            bg-white/[0.04]
            border
            border-white/10
            rounded-[32px]
            p-6
          ">

            <h2 className="
              text-3xl
              font-black
              mb-8
            ">
              Order Distribution
            </h2>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <PieChart>

                <Pie
                  data={ordersChart}
                  dataKey="orders"
                  nameKey="status"
                  outerRadius={110}
                  label
                >

                  {
                    ordersChart.map(
                      (entry, index) => (

                        <Cell
                          key={index}
                          fill={
                            pieColors[
                              index %
                              pieColors.length
                            ]
                          }
                        />

                      )
                    )
                  }

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

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
          bg-white/[0.04]
          border
          border-white/10
          rounded-[32px]
          p-6
        ">
          <h2 className="
            text-3xl
            font-black
            mb-8
          ">
            Top Selling Items
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart
              data={topItems}
            >
              <CartesianGrid
                stroke="#1f2937"
              />
              <XAxis
                dataKey="item_name"
                stroke="#9ca3af"
              />
              <YAxis
                stroke="#9ca3af"
              />
              <Tooltip />
              <Bar
                dataKey="total_quantity"
                fill="#f97316"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default RestaurantAnalytics;