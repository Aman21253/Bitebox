import {
  Store,
  Users,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Activity,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatCard from "../../components/admin/AdminStatCard";
import AdminCard from "../../components/admin/AdminCard";
import AdminEmptyState from "../../components/admin/AdminEmptyState";
import AdminSkeleton from "../../components/admin/AdminSkeleton";

function AdminDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    fetchDashboard();

  }, []);

  // ─────────────────────────────────────
  // FETCH DASHBOARD
  // ─────────────────────────────────────

  const fetchDashboard = async () => {

    try {

      setLoading(true);

      setError("");

      const [

        usersRes,

        restaurantsRes,

      ] = await Promise.all([

        API.get("/admin/users"),

        API.get(
          "/admin/restaurants/pending"
        ),

      ]);

      setStats({

        totalUsers:
          usersRes.data.length,

        pendingRestaurants:
          restaurantsRes.data.length,

        totalOrders: 0,

        totalRevenue: 0,

      });

    } catch (error) {

      console.log(error);

      setError(
        "Failed to load dashboard data"
      );

    } finally {

      setLoading(false);
    }
  };

  // ─────────────────────────────────────
  // STATS
  // ─────────────────────────────────────

  const cards = [

    {
      title: "Users",

      value:
        stats?.totalUsers || 0,

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
      title:
        "Pending Restaurants",

      value:
        stats?.pendingRestaurants || 0,

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
        stats?.totalOrders || 0,

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

      value: `₹${stats?.totalRevenue || 0}`,

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

        eyebrow="Admin Control Center"

        title={`Welcome, ${user?.name}`}

        description="
          Monitor users, restaurants,
          platform growth and live
          operations from one place.
        "
      />

      {/* ERROR STATE */}

      {
        error && (

          <div className="
            mb-8
            rounded-3xl
            border
            border-red-500/20
            bg-red-500/10
            p-6
          ">

            <h2 className="
              text-xl
              font-bold
              text-red-400
              mb-2
            ">
              Something went wrong
            </h2>

            <p className="
              text-gray-300
            ">
              {error}
            </p>

            <button
              onClick={fetchDashboard}
              className="
                mt-5
                h-12
                px-6
                rounded-2xl
                bg-red-500
                hover:bg-red-400
                transition-all
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

        {/* PLATFORM OVERVIEW */}

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
                PLATFORM ANALYTICS
              </p>

              <h2 className="
                text-3xl
                font-black
              ">
                Growth Overview
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
              bg-white/[0.03]
              border
              border-white/10
              p-6
            ">

              <p className="
                text-gray-400
                mb-3
              ">
                User Growth
              </p>

              <h2 className="
                text-4xl
                font-black
                text-blue-400
              ">
                +18%
              </h2>

            </div>

            <div className="
              rounded-3xl
              bg-white/[0.03]
              border
              border-white/10
              p-6
            ">

              <p className="
                text-gray-400
                mb-3
              ">
                Orders Today
              </p>

              <h2 className="
                text-4xl
                font-black
                text-purple-400
              ">
                0
              </h2>

            </div>

            <div className="
              rounded-3xl
              bg-white/[0.03]
              border
              border-white/10
              p-6
            ">

              <p className="
                text-gray-400
                mb-3
              ">
                Revenue Trend
              </p>

              <h2 className="
                text-4xl
                font-black
                text-green-400
              ">
                +12%
              </h2>

            </div>

          </div>

        </AdminCard>

        {/* LIVE ACTIVITY */}

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
                LIVE STATUS
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
                Active Drivers
              </p>

              <h3 className="
                text-3xl
                font-black
              ">
                0
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
                Active Deliveries
              </p>

              <h3 className="
                text-3xl
                font-black
              ">
                0
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
                Platform Status
              </p>

              <h3 className="
                text-2xl
                font-black
                text-green-400
              ">
                Operational
              </h3>

            </div>

          </div>

        </AdminCard>

      </div>

      {/* EMPTY STATE */}

      {
        !loading &&
        stats?.totalUsers === 0 && (

          <div className="
            mt-10
          ">

            <AdminEmptyState

              icon={
                <Users
                  size={40}
                  className="
                    text-orange-400
                  "
                />
              }

              title="
                No Users Found
              "

              description="
                Your platform currently
                has no registered users.
                Once users register,
                they will appear here.
              "
            />

          </div>
        )
      }

    </AdminLayout>
  );
}

export default AdminDashboard;