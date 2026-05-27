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

  const [stats, setStats] =
    useState(null);

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

  const [error, setError] =
    useState("");

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

  // FETCH DASHBOARD

  const fetchDashboardData = async () => {

    try {

      setLoading(true);

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

        console.error(error);

        setError(
          "Failed to load dashboard"
        );
      }

    } finally {

      setLoading(false);
    }
  };

  // REGISTER RESTAURANT

  const handleRegister = async () => {

    setError("");

    if (

      !regForm.name ||
      !regForm.address ||
      !regForm.city ||
      !regForm.state ||
      !regForm.pincode ||
      !regForm.phone ||
      !regForm.cuisine

    ) {

      setError(
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

      setError(

        err.response?.data?.detail ||

        "Registration failed"
      );

    } finally {

      setRegLoading(false);
    }
  };

  // LOADING

  if (loading) {

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
          p-10
        ">

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
          ">

            {
              Array(4)
              .fill(0)
              .map((_, i) => (

                <div
                  key={i}
                  className="
                    h-[180px]
                    rounded-[30px]
                    bg-white/[0.03]
                    border
                    border-white/10
                    animate-pulse
                  "
                />

              ))
            }

          </div>

        </div>

      </div>
    );
  }

  // APPROVAL STATUS

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
            text-3xl
            md:text-4xl
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

              "Your restaurant is currently under admin review."

            }

            {

              approvalStatus ===
              "suspended"

              &&

              "Your restaurant has been suspended temporarily."

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

  // REGISTRATION

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

          <div>

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
              text-3xl
              md:text-4xl
              font-black
            ">
              Register Your Restaurant
            </h1>

          </div>

          {
            error && (

              <div className="
                rounded-2xl
                border
                border-red-500/20
                bg-red-500/10
                p-4
                text-red-300
              ">
                {error}
              </div>
            )
          }

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
                outline-none
              "
              placeholder="Restaurant Name"
              value={regForm.name}
              onChange={(e) =>
                setRegForm({
                  ...regForm,
                  name: e.target.value
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
                outline-none
              "
              placeholder="Cuisine"
              value={regForm.cuisine}
              onChange={(e) =>
                setRegForm({
                  ...regForm,
                  cuisine: e.target.value
                })
              }
            />

          </div>

          <textarea
            className="
              w-full
              h-28
              rounded-2xl
              bg-white/[0.06]
              border
              border-white/10
              px-5
              py-4
              outline-none
              resize-none
            "
            placeholder="Description"
            value={regForm.description}
            onChange={(e) =>
              setRegForm({
                ...regForm,
                description:
                e.target.value
              })
            }
          />

          <input
            className="
              w-full
              h-14
              rounded-2xl
              bg-white/[0.06]
              border
              border-white/10
              px-5
              outline-none
            "
            placeholder="Address"
            value={regForm.address}
            onChange={(e) =>
              setRegForm({
                ...regForm,
                address:
                e.target.value
              })
            }
          />

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
                outline-none
              "
              placeholder="Phone"
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
              ? "Submitting..."
              : "Submit for Approval"
            }

          </button>

        </div>

      </div>
    );
  }

  // DASHBOARD STATS

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
        px-6
        md:px-10
        py-10
        overflow-y-auto
      ">

        <div className="
          max-w-[1600px]
          mx-auto
        ">

          {/* HEADER */}

          <div className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-5
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
                text-3xl
                md:text-5xl
                font-black
              ">

                Welcome, {user?.name}

              </h1>

            </div>

            <div className="
              flex
              items-center
              gap-4
            ">

              <div className="
                px-4
                py-2
                rounded-xl
                bg-green-500/10
                border
                border-green-500/20
                text-green-300
                text-sm
                font-bold
              ">
                Live
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

          {/* STATS */}

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-5
            gap-6
            mb-10
          ">

            {
              dashboardStats.map((item) => {

                const Icon = item.icon;

                return (

                  <div
                    key={item.title}
                    className="
                      rounded-[30px]
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
                      mb-5
                    ">

                      <Icon
                        className="
                          text-orange-400
                        "
                        size={26}
                      />

                    </div>

                    <p className="
                      text-gray-400
                      text-sm
                      mb-2
                    ">
                      {item.title}
                    </p>

                    <h2 className="
                      text-4xl
                      font-black
                    ">
                      {item.value}
                    </h2>

                  </div>
                );
              })
            }

          </div>

          {/* RECENT ORDERS */}

          <div className="
            rounded-[32px]
            border
            border-white/10
            bg-white/[0.03]
            p-8
          ">

            <div className="
              flex
              items-center
              justify-between
              mb-8
            ">

              <div>

                <p className="
                  text-orange-400
                  text-sm
                  font-bold
                  mb-2
                ">
                  LIVE ORDERS
                </p>

                <h2 className="
                  text-3xl
                  font-black
                ">
                  Recent Orders
                </h2>

              </div>

            </div>

            {
              recentOrders.length === 0 ? (

                <div className="
                  text-center
                  py-20
                  text-gray-500
                ">

                  No recent orders

                </div>

              ) : (

                <div className="
                  overflow-x-auto
                ">

                  <table className="
                    w-full
                  ">

                    <thead>

                      <tr className="
                        border-b
                        border-white/10
                      ">

                        <th className="
                          text-left
                          py-4
                          text-gray-400
                        ">
                          Order
                        </th>

                        <th className="
                          text-left
                          py-4
                          text-gray-400
                        ">
                          Customer
                        </th>

                        <th className="
                          text-left
                          py-4
                          text-gray-400
                        ">
                          Amount
                        </th>

                        <th className="
                          text-left
                          py-4
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
                              py-5
                              font-bold
                            ">
                              #{order.id}
                            </td>

                            <td className="
                              py-5
                            ">
                              {
                                order.customer
                                ?.name || "Customer"
                              }
                            </td>

                            <td className="
                              py-5
                              text-orange-400
                              font-bold
                            ">
                              ₹{
                                order.total_amount
                              }
                            </td>

                            <td className="
                              py-5
                            ">

                              <span className="
                                px-3
                                py-1
                                rounded-xl
                                bg-green-500/10
                                border
                                border-green-500/20
                                text-green-300
                                text-xs
                                font-bold
                              ">

                                {
                                  order.status ||
                                  "Placed"
                                }

                              </span>

                            </td>

                          </tr>
                        ))
                      }

                    </tbody>

                  </table>

                </div>
              )
            }

          </div>

        </div>

      </div>

    </div>
  );
}

export default RestaurantDashboard;