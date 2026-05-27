import {
  useEffect,
  useState,
} from "react";

import {
  Users,
  Store,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Activity,
  BarChart3,
} from "lucide-react";

import API from "../../api/axios";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatCard from "../../components/admin/AdminStatCard";
import AdminCard from "../../components/admin/AdminCard";
import AdminEmptyState from "../../components/admin/AdminEmptyState";
import AdminSkeleton from "../../components/admin/AdminSkeleton";

function AdminAnalytics() {

  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    fetchAnalytics();

  }, []);

  // ─────────────────────────────────────
  // FETCH ANALYTICS
  // ─────────────────────────────────────

  const fetchAnalytics = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await API.get(
          "/admin/analytics"
        );

      setStats(response.data);

    } catch (error) {

      console.log(error);

      setError(
        "Failed to load analytics"
      );

    } finally {

      setLoading(false);
    }
  };

  // ─────────────────────────────────────
  // STATS CARDS
  // ─────────────────────────────────────

  const cards = [

    {
      title: "Users",

      value:
        stats?.total_users || 0,

      icon: (
        <Users
          className="
            text-blue-400
          "
          size={28}
        />
      ),

      valueColor:
        "text-blue-400",
    },

    {
      title: "Restaurants",

      value:
        stats?.total_restaurants || 0,

      icon: (
        <Store
          className="
            text-orange-400
          "
          size={28}
        />
      ),

      valueColor:
        "text-orange-400",
    },

    {
      title: "Orders",

      value:
        stats?.total_orders || 0,

      icon: (
        <ShoppingBag
          className="
            text-purple-400
          "
          size={28}
        />
      ),

      valueColor:
        "text-purple-400",
    },

    {
      title: "Revenue",

      value: `₹${stats?.total_revenue || 0}`,

      icon: (
        <IndianRupee
          className="
            text-green-400
          "
          size={28}
        />
      ),

      valueColor:
        "text-green-400",
    },

  ];

  return (

    <AdminLayout>

      {/* PAGE HEADER */}

      <AdminPageHeader

        eyebrow="Admin Analytics"

        title="Platform Insights"

        description="
          Monitor platform growth,
          revenue, customer activity
          and business performance
          across BiteBox.
        "
      />

      {/* ERROR STATE */}

      {
        error && (

          <div className="
            mb-8
            rounded-[30px]
            border
            border-red-500/20
            bg-red-500/10
            p-6
          ">

            <h2 className="
              text-2xl
              font-black
              text-red-400
              mb-3
            ">
              Analytics Failed
            </h2>

            <p className="
              text-gray-300
            ">
              {error}
            </p>

            <button
              onClick={fetchAnalytics}
              className="
                mt-5
                h-12
                px-6
                rounded-2xl
                bg-red-500
                hover:bg-red-400
                transition-all
                duration-300
                font-bold
              "
            >
              Retry
            </button>

          </div>
        )
      }

      {/* STATS */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-6
        mb-10
      ">

        {
          loading
            ? Array(4)
                .fill(0)
                .map((_, index) => (

                  <AdminSkeleton
                    key={index}
                    height="h-[170px]"
                  />
                ))

            : cards.map((card) => (

                <AdminStatCard

                  key={card.title}

                  title={card.title}

                  value={card.value}

                  icon={card.icon}

                  valueColor={
                    card.valueColor
                  }
                />
              ))
        }

      </div>

      {/* ANALYTICS GRID */}

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-3
        gap-6
      ">

        {/* MAIN OVERVIEW */}

        <AdminCard
          className="
            xl:col-span-2
          "
        >

          <div className="
            flex
            items-center
            justify-between
            mb-8
          ">

            <div>

              <p className="
                text-orange-400
                font-semibold
                mb-2
              ">
                GROWTH OVERVIEW
              </p>

              <h2 className="
                text-3xl
                font-black
              ">
                Platform Performance
              </h2>

            </div>

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-orange-500/10
              flex
              items-center
              justify-center
            ">

              <TrendingUp
                className="
                  text-orange-400
                "
              />

            </div>

          </div>

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-5
          ">

            <div className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
              p-6
            ">

              <p className="
                text-gray-400
                mb-3
              ">
                Monthly Growth
              </p>

              <h2 className="
                text-4xl
                font-black
                text-green-400
              ">
                +24%
              </h2>

            </div>

            <div className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
              p-6
            ">

              <p className="
                text-gray-400
                mb-3
              ">
                Conversion Rate
              </p>

              <h2 className="
                text-4xl
                font-black
                text-blue-400
              ">
                82%
              </h2>

            </div>

            <div className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
              p-6
            ">

              <p className="
                text-gray-400
                mb-3
              ">
                Order Success
              </p>

              <h2 className="
                text-4xl
                font-black
                text-purple-400
              ">
                96%
              </h2>

            </div>

          </div>

          {/* ANALYTICS PREVIEW */}

          <div className="
            mt-8
            h-[250px]
            rounded-[30px]
            border
            border-dashed
            border-white/10
            bg-white/[0.02]
            flex
            flex-col
            items-center
            justify-center
            text-center
          ">

            <BarChart3
              size={60}
              className="
                text-orange-400
                mb-5
              "
            />

            <h2 className="
              text-2xl
              font-black
              mb-3
            ">
              Advanced Analytics
            </h2>

            <p className="
              text-gray-400
              max-w-md
            ">
              Revenue graphs, order trends,
              live customer analytics and
              charts can be integrated here.
            </p>

          </div>

        </AdminCard>

        {/* LIVE METRICS */}

        <AdminCard>

          <div className="
            flex
            items-center
            justify-between
            mb-8
          ">

            <div>

              <p className="
                text-orange-400
                font-semibold
                mb-2
              ">
                LIVE METRICS
              </p>

              <h2 className="
                text-3xl
                font-black
              ">
                Activity
              </h2>

            </div>

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-green-500/10
              flex
              items-center
              justify-center
            ">

              <Activity
                className="
                  text-green-400
                "
              />

            </div>

          </div>

          <div className="
            space-y-5
          ">

            <div className="
              rounded-2xl
              bg-white/[0.03]
              border
              border-white/10
              p-5
            ">

              <p className="
                text-gray-400
                text-sm
                mb-2
              ">
                Active Users
              </p>

              <h3 className="
                text-3xl
                font-black
              ">
                {stats?.total_users || 0}
              </h3>

            </div>

            <div className="
              rounded-2xl
              bg-white/[0.03]
              border
              border-white/10
              p-5
            ">

              <p className="
                text-gray-400
                text-sm
                mb-2
              ">
                Running Orders
              </p>

              <h3 className="
                text-3xl
                font-black
              ">
                {stats?.total_orders || 0}
              </h3>

            </div>

            <div className="
              rounded-2xl
              bg-white/[0.03]
              border
              border-white/10
              p-5
            ">

              <p className="
                text-gray-400
                text-sm
                mb-2
              ">
                System Health
              </p>

              <h3 className="
                text-2xl
                font-black
                text-green-400
              ">
                Excellent
              </h3>

            </div>

          </div>

        </AdminCard>

      </div>

      {/* EMPTY STATE */}

      {
        !loading &&
        stats?.total_users === 0 && (

          <div className="
            mt-10
          ">

            <AdminEmptyState

              icon={
                <BarChart3
                  size={40}
                  className="
                    text-orange-400
                  "
                />
              }

              title="
                No Analytics Data
              "

              description="
                Your platform analytics
                will appear here once
                users, restaurants and
                orders start growing.
              "
            />

          </div>
        )
      }

    </AdminLayout>
  );
}

export default AdminAnalytics;