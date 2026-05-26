import {
  ShoppingBag,
  IndianRupee,
  Clock3,
  Bike,
  Bell,
  UtensilsCrossed,
} from "lucide-react";

import { useEffect, useState } from "react";

import API from "../../api/axios";

import RestaurantSidebar from "../../components/restaurant/RestaurantSidebar";

function RestaurantDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [stats, setStats] = useState(null);

  const [recentOrders, setRecentOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [notRegistered, setNotRegistered] =
    useState(false);

  const [approvalStatus, setApprovalStatus] =
    useState(null);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [regLoading, setRegLoading] =
    useState(false);

  const [regForm, setRegForm] =
    useState({

      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      cuisine: "",
      delivery_radius: 5,
    });

  useEffect(() => {

    fetchDashboardData();

  }, []);

  // ─────────────────────────────────────
  // FETCH DASHBOARD
  // ─────────────────────────────────────

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
        ),
      ]);

      setStats(
        statsResponse.data
      );

      setRecentOrders(
        ordersResponse.data
      );

      setNotRegistered(false);

      setApprovalStatus(null);

    } catch (error) {

      if (
        error.response?.status === 404
      ) {

        setNotRegistered(true);

      } else if (
        error.response?.status === 403
      ) {

        setApprovalStatus(

          error.response?.data
          ?.detail
          ?.approval_status

        );

        setRejectionReason(

          error.response?.data
          ?.detail
          ?.rejection_reason || ""

        );

      } else {

        console.error(
          "Dashboard fetch failed:",
          error
        );
      }

    } finally {

      setLoading(false);
    }
  };

  // ─────────────────────────────────────
  // RESTAURANT SELF REGISTRATION
  // ─────────────────────────────────────

  const handleRegister = async () => {

    if (

      !regForm.name ||
      !regForm.address ||
      !regForm.city ||
      !regForm.state ||
      !regForm.pincode ||
      !regForm.phone ||
      !regForm.cuisine

    ) {

      alert(
        "Please fill all required fields"
      );

      return;
    }

    setRegLoading(true);

    try {

      await API.post(

        "/restaurants/register",

        {

          ...regForm,

          resubmission:
            approvalStatus ===
            "rejected"
        }
      );

      setNotRegistered(false);

      setApprovalStatus("pending");

    } catch (err) {

      alert(

        err.response?.data?.detail ||

        "Registration failed"
      );

    } finally {

      setRegLoading(false);
    }
  };

  // ─────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────

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

  // ─────────────────────────────────────
  // APPROVAL STATUS UI
  // ─────────────────────────────────────

  if (approvalStatus) {

    return (

      <div className="
        min-h-screen
        bg-[#070b14]
        flex
        items-center
        justify-center
        px-5
      ">

        <div className="
          w-full
          max-w-xl
          rounded-[35px]
          border
          border-white/10
          bg-white/[0.04]
          p-10
          text-white
        ">

          <p className="
            text-orange-400
            uppercase
            tracking-[3px]
            text-xs
            font-bold
            mb-4
          ">
            Restaurant Review
          </p>

          <h1 className="
            text-4xl
            font-black
            mb-5
          ">

            {
              approvalStatus ===
              "pending"

              &&

              "Approval Pending"
            }

            {
              approvalStatus ===
              "rejected"

              &&

              "Restaurant Rejected"
            }

            {
              approvalStatus ===
              "suspended"

              &&

              "Restaurant Suspended"
            }

          </h1>

          <div className="
            rounded-2xl
            bg-white/[0.04]
            border
            border-white/10
            p-5
            text-gray-300
            leading-7
          ">

            {

              approvalStatus ===
              "pending"

              &&

              "Your restaurant is currently under admin review. This usually takes a few hours."

            }

            {

              approvalStatus ===
              "suspended"

              &&

              "Your restaurant has been suspended temporarily. Please contact support."

            }

            {

              approvalStatus ===
              "rejected"

              &&

              (
                rejectionReason ||

                "Your restaurant application was rejected."
              )

            }

          </div>

          {

            approvalStatus ===
            "rejected"

            &&

            <button

              onClick={() => {

                setApprovalStatus(null);

                setNotRegistered(true);
              }}

              className="
                mt-6
                w-full
                h-14
                rounded-2xl
                bg-orange-500
                hover:bg-orange-400
                font-black
              "
            >

              Resubmit Restaurant

            </button>
          }

        </div>

      </div>
    );
  }

  // ─────────────────────────────────────
  // INLINE REGISTRATION
  // ─────────────────────────────────────

  if (notRegistered) {

    return (

      <div className="
        min-h-screen
        bg-[#070b14]
        flex
        items-center
        justify-center
        text-white
        px-5
        py-10
      ">

        <div className="
          w-full
          max-w-2xl
          bg-white/[0.04]
          border
          border-white/10
          rounded-[35px]
          p-10
          space-y-5
        ">

          <div className="mb-2">

            <p className="
              text-orange-400
              uppercase
              tracking-[3px]
              text-xs
              font-bold
              mb-3
            ">
              One More Step
            </p>

            <h1 className="
              text-4xl
              font-black
            ">
              Register Your Restaurant
            </h1>

            <p className="
              text-gray-400
              mt-3
            ">
              Fill in your restaurant details to get started.
            </p>

          </div>

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">

            <div>

              <label className="
                text-sm
                text-gray-400
                mb-1
                block
              ">
                Restaurant Name *
              </label>

              <input
                className="
                  w-full
                  h-14
                  rounded-2xl
                  bg-white/[0.06]
                  border
                  border-white/10
                  px-5
                  text-white
                  placeholder-gray-500
                  outline-none
                "
                placeholder="e.g. Spice Garden"
                value={regForm.name}
                onChange={(e) =>
                  setRegForm({
                    ...regForm,
                    name: e.target.value
                  })
                }
              />

            </div>

            <div>

              <label className="
                text-sm
                text-gray-400
                mb-1
                block
              ">
                Cuisine Type *
              </label>

              <input
                className="
                  w-full
                  h-14
                  rounded-2xl
                  bg-white/[0.06]
                  border
                  border-white/10
                  px-5
                  text-white
                  placeholder-gray-500
                  outline-none
                "
                placeholder="e.g. North Indian"
                value={regForm.cuisine}
                onChange={(e) =>
                  setRegForm({
                    ...regForm,
                    cuisine: e.target.value
                  })
                }
              />

            </div>

          </div>

          <div>

            <label className="
              text-sm
              text-gray-400
              mb-1
              block
            ">
              Description
            </label>

            <textarea
              className="
                w-full
                h-24
                rounded-2xl
                bg-white/[0.06]
                border
                border-white/10
                px-5
                py-4
                text-white
                placeholder-gray-500
                outline-none
                resize-none
              "
              placeholder="Restaurant description"
              value={regForm.description}
              onChange={(e) =>
                setRegForm({
                  ...regForm,
                  description:
                  e.target.value
                })
              }
            />

          </div>

          <div>

            <label className="
              text-sm
              text-gray-400
              mb-1
              block
            ">
              Address *
            </label>

            <input
              className="
                w-full
                h-14
                rounded-2xl
                bg-white/[0.06]
                border
                border-white/10
                px-5
                text-white
                placeholder-gray-500
                outline-none
              "
              placeholder="Full address"
              value={regForm.address}
              onChange={(e) =>
                setRegForm({
                  ...regForm,
                  address:
                  e.target.value
                })
              }
            />

          </div>

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-5
          ">

            <input
              className="
                h-14
                rounded-2xl
                bg-white/[0.06]
                border
                border-white/10
                px-5
                text-white
                outline-none
              "
              placeholder="City"
              value={regForm.city}
              onChange={(e) =>
                setRegForm({
                  ...regForm,
                  city:
                  e.target.value
                })
              }
            />

            <input
              className="
                h-14
                rounded-2xl
                bg-white/[0.06]
                border
                border-white/10
                px-5
                text-white
                outline-none
              "
              placeholder="State"
              value={regForm.state}
              onChange={(e) =>
                setRegForm({
                  ...regForm,
                  state:
                  e.target.value
                })
              }
            />

            <input
              className="
                h-14
                rounded-2xl
                bg-white/[0.06]
                border
                border-white/10
                px-5
                text-white
                outline-none
              "
              placeholder="Pincode"
              value={regForm.pincode}
              onChange={(e) =>
                setRegForm({
                  ...regForm,
                  pincode:
                  e.target.value
                })
              }
            />

          </div>

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">

            <input
              className="
                h-14
                rounded-2xl
                bg-white/[0.06]
                border
                border-white/10
                px-5
                text-white
                outline-none
              "
              placeholder="Phone Number"
              value={regForm.phone}
              onChange={(e) =>
                setRegForm({
                  ...regForm,
                  phone:
                  e.target.value
                })
              }
            />

            <input
              type="number"
              className="
                h-14
                rounded-2xl
                bg-white/[0.06]
                border
                border-white/10
                px-5
                text-white
                outline-none
              "
              placeholder="Delivery Radius"
              value={regForm.delivery_radius}
              onChange={(e) =>
                setRegForm({
                  ...regForm,
                  delivery_radius:
                  Number(e.target.value)
                })
              }
            />

          </div>

          <div className="
            bg-orange-500/10
            border
            border-orange-500/20
            rounded-2xl
            px-5
            py-4
            text-orange-300
            text-sm
          ">

            Your restaurant will be reviewed before going live.

          </div>

          <button
            onClick={handleRegister}
            disabled={regLoading}
            className="
              w-full
              h-14
              rounded-2xl
              bg-orange-500
              hover:bg-orange-400
              font-black
              text-lg
              disabled:opacity-50
            "
          >

            {

              regLoading

              ?

              "Submitting..."

              :

              "Submit for Approval"

            }

          </button>

        </div>

      </div>
    );
  }

  // ─────────────────────────────────────
  // MAIN DASHBOARD
  // ─────────────────────────────────────

  const dashboardStats = [

    {
      title: "Total Orders",
      value: stats?.total_orders || 0,
      icon: ShoppingBag
    },

    {
      title: "Revenue",
      value: `₹${stats?.total_revenue || 0}`,
      icon: IndianRupee
    },

    {
      title: "Preparing",
      value: stats?.preparing_orders || 0,
      icon: Clock3
    },

    {
      title: "Active Deliveries",
      value: stats?.active_deliveries || 0,
      icon: Bike
    },

    {
      title: "Menu Items",
      value: stats?.total_menu_items || 0,
      icon: UtensilsCrossed
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

                Welcome, {user?.name}

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

        </div>

      </div>

    </div>
  );
}

export default RestaurantDashboard;