import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminRestaurants() {

  const [restaurants, setRestaurants] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchRestaurants();

  }, []);

  const fetchRestaurants = async () => {

    try {

      const response =
        await API.get(
          "/admin/restaurants/pending"
        );

      setRestaurants(
        response.data
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  const approveRestaurant =
    async (id) => {

      try {

        await API.post(
          `/admin/restaurants/${id}/approve`
        );

        fetchRestaurants();

      } catch (error) {

        console.log(error);
      }
    };

  const rejectRestaurant =
    async (id) => {

      try {

        await API.post(
          `/admin/restaurants/${id}/reject`
        );

        fetchRestaurants();

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

      <AdminSidebar />

      <div className="
        flex-1
        p-10
      ">

        <div className="
          max-w-[1600px]
          mx-auto
        ">

          <div className="
            mb-10
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
              text-5xl
              font-black
            ">
              Restaurant Approvals
            </h1>

          </div>

          {
            loading ? (

              <div className="
                text-3xl
                font-black
              ">
                Loading...
              </div>

            ) : (

              <div className="
                grid
                grid-cols-1
                xl:grid-cols-2
                gap-8
              ">

                {
                  restaurants.map((restaurant) => (

                    <div
                      key={restaurant.id}
                      className="
                        rounded-[32px]
                        border
                        border-white/10
                        bg-white/[0.03]
                        p-7
                      "
                    >

                      <h2 className="
                        text-4xl
                        font-black
                        mb-4
                      ">
                        {restaurant.name}
                      </h2>

                      <div className="
                        space-y-3
                        text-gray-300
                      ">

                        <p>
                          🍔 {
                            restaurant.cuisine
                          }
                        </p>

                        <p>
                          📍 {
                            restaurant.address
                          }
                        </p>

                        <p>
                          📞 {
                            restaurant.phone
                          }
                        </p>

                      </div>

                      <div className="
                        flex
                        gap-4
                        mt-8
                      ">

                        <button
                          onClick={() =>
                            approveRestaurant(
                              restaurant.id
                            )
                          }
                          className="
                            flex-1
                            h-14
                            rounded-2xl
                            bg-green-500
                            font-bold
                          "
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            rejectRestaurant(
                              restaurant.id
                            )
                          }
                          className="
                            flex-1
                            h-14
                            rounded-2xl
                            bg-red-500
                            font-bold
                          "
                        >
                          Reject
                        </button>

                      </div>

                    </div>
                  ))
                }

              </div>
            )
          }

        </div>

      </div>

    </div>
  );
}

export default AdminRestaurants;