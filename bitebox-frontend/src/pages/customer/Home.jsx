import {
  Search,
  ShoppingCart,
  MapPin,
  Star,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import API from "../../api/axios";

function Home() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {

    fetchRestaurants();

  }, []);

  const fetchRestaurants = async () => {

    try {

      const response = await API.get(
        "/restaurants"
      );

      setRestaurants(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  const logout = () => {

    localStorage.removeItem("access_token");

    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  const categories = [
    "🍕 Pizza",
    "🍔 Burgers",
    "🍗 Chicken",
    "🥗 Healthy",
    "🍜 Chinese",
    "🍰 Desserts",
  ];

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
    ">

      {/* NAVBAR */}

      <div className="
        sticky
        top-0
        z-50
        border-b
        border-white/10
        bg-black/30
        backdrop-blur-2xl
      ">

        <div className="
          h-[82px]
          px-5
          lg:px-10
          flex
          items-center
          justify-between
          max-w-[1600px]
          mx-auto
        ">

          {/* LOGO */}

          <h1 className="
            text-4xl
            font-black
            tracking-tight
            bg-gradient-to-r
            from-orange-400
            via-orange-500
            to-red-500
            bg-clip-text
            text-transparent
          ">
            BiteBox
          </h1>

          {/* SEARCH */}

          <div className="
            hidden
            md:flex
            items-center
            w-[430px]
            h-14
            px-5
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            backdrop-blur-xl
          ">

            <Search
              size={18}
              className="text-gray-500"
            />

            <input
              type="text"
              placeholder="Search restaurants or food..."
              className="
                ml-3
                w-full
                bg-transparent
                outline-none
                text-sm
                text-white
                placeholder:text-gray-500
              "
            />

          </div>

          {/* RIGHT */}

          <div className="
            flex
            items-center
            gap-5
          ">

            {/* CART */}

            <div className="
              relative
              cursor-pointer
            ">

              <ShoppingCart
                size={28}
                className="
                  text-white
                  hover:text-orange-400
                  transition
                "
              />

              <div className="
                absolute
                -top-2
                -right-2
                w-5
                h-5
                rounded-full
                bg-orange-500
                flex
                items-center
                justify-center
                text-[10px]
                font-bold
              ">
                0
              </div>

            </div>


            <button
              onClick={() => navigate("/my-orders")}
              className="
                border
                border-white/10
                bg-white/5
                hover:bg-white/10
                transition-all
                duration-300
                px-6
                py-3
                rounded-2xl
                text-sm
                font-bold
                text-white
              "
            >
              My Orders
            </button>

            {/* LOGOUT */}

            <button
              onClick={logout}
              className="
                bg-orange-500
                hover:bg-orange-400
                hover:scale-105
                transition-all
                duration-300
                px-6
                py-3
                rounded-2xl
                text-sm
                font-bold
                shadow-lg
                shadow-orange-500/20
              "
            >
              Logout
            </button>

          </div>

        </div>

      </div>

      {/* MAIN */}

      <div className="
        px-5
        lg:px-10
        py-8
      ">

        {/* HERO */}

        <div className="mb-16">

          <div className="
            relative
            overflow-hidden
            rounded-[40px]
            border
            border-white/10
            bg-[#0f172a]
            min-h-[540px]
            max-w-[1600px]
            mx-auto
            px-8
            py-12
            md:px-12
            lg:px-16
            lg:py-16
          ">

            {/* ORANGE GLOW */}

            <div className="
              absolute
              top-[-120px]
              right-[-100px]
              w-[420px]
              h-[420px]
              rounded-full
              bg-orange-500/20
              blur-[130px]
            " />

            {/* BLUE GLOW */}

            <div className="
              absolute
              bottom-[-140px]
              left-[20%]
              w-[300px]
              h-[300px]
              rounded-full
              bg-blue-500/10
              blur-[120px]
            " />

            {/* CENTER GLOW */}

            <div className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08),transparent_45%)]
            " />

            {/* CONTENT */}

            <div className="
              relative
              z-10
              h-full
              flex
              flex-col
              justify-between
              lg:flex-row
              lg:items-center
              gap-14
            ">

              {/* LEFT */}

              <div className="
                flex-1
                max-w-[720px]
              ">

                <p className="
                  text-orange-400
                  text-sm
                  font-bold
                  tracking-[3px]
                  uppercase
                  mb-6
                ">
                  Welcome back, {user?.name}
                </p>

                <h1 className="
                  text-[52px]
                  sm:text-[64px]
                  lg:text-[72px]
                  leading-[0.95]
                  font-black
                  tracking-[-3px]
                ">

                  Premium

                  <span className="
                    block
                    text-orange-500
                  ">
                    food delivery
                  </span>

                  experience

                </h1>

                <p className="
                  mt-8
                  text-gray-400
                  text-lg
                  leading-relaxed
                  max-w-[560px]
                ">
                  Discover top-rated restaurants,
                  lightning-fast delivery, and a premium
                  ordering experience designed for food lovers.
                </p>

                {/* BUTTONS */}

                <div className="
                  flex
                  flex-wrap
                  items-center
                  gap-5
                  mt-10
                ">

                  <button className="
                    bg-orange-500
                    hover:bg-orange-400
                    hover:scale-105
                    transition-all
                    duration-300
                    px-8
                    py-4
                    rounded-2xl
                    font-bold
                    text-base
                    shadow-lg
                    shadow-orange-500/20
                  ">
                    Explore Restaurants
                  </button>

                  <button className="
                    border
                    border-white/10
                    bg-white/5
                    hover:bg-white/10
                    transition-all
                    duration-300
                    px-8
                    py-4
                    rounded-2xl
                    font-semibold
                    text-gray-300
                    backdrop-blur-xl
                  ">
                    View Offers
                  </button>

                </div>

              </div>

              {/* RIGHT */}

              <div className="
                w-full
                lg:w-auto
                flex
                justify-start
                lg:justify-center
              ">

                <div className="
                  w-full
                  max-w-[360px]
                  bg-white/[0.05]
                  backdrop-blur-2xl
                  border
                  border-white/10
                  rounded-[32px]
                  p-7
                  shadow-[0_10px_50px_rgba(0,0,0,0.35)]
                ">

                  {/* TOP */}

                  <div className="
                    flex
                    items-center
                    gap-4
                    mb-6
                  ">

                    <div className="
                      w-14
                      h-14
                      rounded-2xl
                      bg-orange-500/15
                      flex
                      items-center
                      justify-center
                      shrink-0
                    ">

                      <MapPin
                        size={24}
                        className="text-orange-400"
                      />

                    </div>

                    <div>

                      <p className="
                        text-xl
                        font-bold
                      ">
                        Delivering to your area
                      </p>

                      <p className="
                        text-gray-400
                        text-sm
                        mt-1
                      ">
                        Fast & secure delivery
                      </p>

                    </div>

                  </div>

                  {/* STATS */}

                  <div className="
                    flex
                    items-center
                    justify-between
                    mb-5
                  ">

                    <div>

                      <p className="
                        text-3xl
                        font-black
                      ">
                        4.9
                      </p>

                      <p className="
                        text-gray-400
                        text-sm
                      ">
                        User Rating
                      </p>

                    </div>

                    <div className="
                      w-[1px]
                      h-12
                      bg-white/10
                    " />

                    <div>

                      <p className="
                        text-3xl
                        font-black
                      ">
                        30m
                      </p>

                      <p className="
                        text-gray-400
                        text-sm
                      ">
                        Avg Delivery
                      </p>

                    </div>

                  </div>

                  {/* BOTTOM */}

                  <div className="
                    flex
                    items-center
                    gap-2
                    text-orange-300
                    text-sm
                    font-medium
                    pt-5
                    border-t
                    border-white/10
                  ">

                    <Star
                      size={16}
                      fill="currentColor"
                    />

                    Rated #1 Food Delivery Experience

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* CATEGORIES */}

        <div className="
          max-w-[1600px]
          mx-auto
          mb-14
        ">

          <h2 className="
            text-4xl
            font-black
            tracking-tight
            mb-7
          ">
            Categories
          </h2>

          <div className="
            grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-6
            gap-5
          ">

            {
              categories.map((category, index) => (

                <div
                  key={index}
                  className="
                    bg-white/[0.04]
                    border
                    border-white/10
                    backdrop-blur-xl
                    rounded-3xl
                    h-[120px]
                    flex
                    flex-col
                    items-center
                    justify-center
                    cursor-pointer
                    hover:border-orange-500/40
                    hover:-translate-y-1
                    hover:shadow-[0_10px_40px_rgba(249,115,22,0.18)]
                    transition-all
                    duration-300
                  "
                >

                  <span className="text-4xl mb-3">
                    {category.split(" ")[0]}
                  </span>

                  <p className="
                    font-semibold
                    text-gray-300
                  ">
                    {category.split(" ")[1]}
                  </p>

                </div>
              ))
            }

          </div>

        </div>

        {/* RESTAURANTS */}

        <div className="
          max-w-[1600px]
          mx-auto
        ">

          <h2 className="
            text-4xl
            font-black
            tracking-tight
            mb-8
          ">
            Top Restaurants
          </h2>

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-8
          ">

            {
              restaurants.map((restaurant) => (

                <div
                  key={restaurant.id}
                  onClick={() =>
                    navigate(`/restaurants/${restaurant.id}`)
                  }
                  className="
                    group
                    bg-white/[0.03]
                    backdrop-blur-xl
                    rounded-[30px]
                    overflow-hidden
                    border
                    border-white/10
                    hover:border-orange-500/40
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:shadow-[0_20px_80px_rgba(249,115,22,0.18)]
                    cursor-pointer
                  "
                >

                  {/* IMAGE */}

                  <div className="overflow-hidden">

                    <img
                      src={
                        restaurant.image_url ||
                        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
                      }
                      alt={restaurant.name}
                      className="
                        w-full
                        h-[270px]
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-110
                      "
                    />

                  </div>

                  {/* CONTENT */}

                  <div className="p-6">

                    <div className="
                      flex
                      items-start
                      justify-between
                    ">

                      <div>

                        <h3 className="
                          text-2xl
                          font-bold
                          text-white
                        ">
                          {restaurant.name}
                        </h3>

                        <p className="
                          text-gray-400
                          mt-2
                        ">
                          {restaurant.cuisine}
                        </p>

                      </div>

                      <div className="
                        bg-orange-500/20
                        border
                        border-orange-400/20
                        text-orange-300
                        px-3
                        py-1
                        rounded-xl
                        text-sm
                        font-semibold
                        flex
                        items-center
                        gap-1
                      ">

                        <Star
                          size={14}
                          fill="currentColor"
                        />

                        {restaurant.rating}

                      </div>

                    </div>

                    <p className="
                      mt-5
                      text-gray-300
                      font-medium
                    ">
                      ⏱ {restaurant.delivery_time}
                    </p>

                  </div>

                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;