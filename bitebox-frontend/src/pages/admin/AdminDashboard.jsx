import {
  Store,
  Users,
  ShoppingBag,
  IndianRupee,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [stats, setStats] =
    useState(null);

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      const usersRes =
        await API.get(
          "/admin/users"
        );

      const restaurantsRes =
        await API.get(
          "/admin/restaurants/pending"
        );

      setStats({

        totalUsers:
          usersRes.data.length,

        pendingRestaurants:
          restaurantsRes.data.length,

      });

    } catch (error) {

      console.log(error);
    }
  };

  const cards = [
    {
      title: "Users",
      value:
        stats?.totalUsers || 0,
      icon: Users,
    },
    {
      title:
        "Pending Restaurants",
      value:
        stats?.pendingRestaurants || 0,
      icon: Store,
    },
    {
      title: "Orders",
      value: "0",
      icon: ShoppingBag,
    },
    {
      title: "Revenue",
      value: "₹0",
      icon: IndianRupee,
    },
  ];

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
      flex
    ">

      <AdminSidebar />

      <div className="
        flex-1
        p-10
      ">

        <div className="
          max-w-[1600px]
          mx-auto
        ">

          {/* HEADER */}

          <div className="
            mb-14
          ">

            <p className="
              text-orange-400
              uppercase
              tracking-[3px]
              text-xs
              font-bold
              mb-4
            ">
              Admin Panel
            </p>

            <h1 className="
              text-6xl
              font-black
              tracking-tight
            ">
              Welcome,
              {" "}
              {user?.name}
            </h1>

          </div>

          {/* CARDS */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-8
          ">

            {
              cards.map((card) => {

                const Icon =
                  card.icon;

                return (

                  <div
                    key={card.title}
                    className="
                      rounded-[30px]
                      border
                      border-white/10
                      bg-white/[0.03]
                      p-8
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
                        className="
                          text-orange-400
                        "
                      />

                    </div>

                    <p className="
                      text-gray-400
                      mb-3
                    ">
                      {card.title}
                    </p>

                    <h2 className="
                      text-5xl
                      font-black
                    ">
                      {card.value}
                    </h2>

                  </div>
                );
              })
            }

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;