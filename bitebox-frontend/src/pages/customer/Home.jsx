// FILE: src/pages/customer/Home.jsx

import {
  Search,
  ShoppingCart,
  MapPin,
  Star,
  Sparkles,
  Clock3,
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

  const [restaurants, setRestaurants] =
    useState([]);

  const [search, setSearch] =
    useState("");

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

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  const categories = [
    {
      emoji: "🍕",
      name: "Pizza",
    },
    {
      emoji: "🍔",
      name: "Burgers",
    },
    {
      emoji: "🍗",
      name: "Chicken",
    },
    {
      emoji: "🥗",
      name: "Healthy",
    },
    {
      emoji: "🍜",
      name: "Chinese",
    },
    {
      emoji: "🍰",
      name: "Desserts",
    },
  ];

  const filteredRestaurants =
    restaurants.filter((restaurant) =>
      restaurant.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (

    <div className="
      min-h-screen
      bg-[#050816]
      text-white
      overflow-x-hidden
    ">

      {/* BACKGROUND */}

      <div className="
        fixed
        inset-0
        -z-10
      ">

        <div className="
          absolute
          top-[-150px]
          right-[-120px]
          w-[500px]
          h-[500px]
          rounded-full
          bg-orange-500/10
          blur-[160px]
        " />

        <div className="
          absolute
          bottom-[-180px]
          left-[-100px]
          w-[420px]
          h-[420px]
          rounded-full
          bg-blue-500/10
          blur-[160px]
        " />

      </div>

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
          h-[78px]
          px-5
          lg:px-10
          flex
          items-center
          justify-between
          gap-5
          max-w-[1600px]
          mx-auto
        ">

          {/* LOGO */}

          <div className="
            flex
            items-center
            gap-3
            shrink-0
          ">

            <div className="
              w-11
              h-11
              rounded-2xl
              bg-gradient-to-br
              from-orange-400
              to-red-500
              flex
              items-center
              justify-center
              text-xl
              shadow-[0_10px_30px_rgba(249,115,22,0.4)]
            ">
              🍔
            </div>

            <div>

              <h1 className="
                text-3xl
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

              <p className="
                text-[10px]
                text-gray-500
                tracking-[3px]
                uppercase
              ">
                Premium Delivery
              </p>

            </div>

          </div>

          {/* SEARCH */}

          <div className="
            hidden
            md:flex
            items-center
            w-full
            max-w-[460px]
            h-12
            px-5
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            backdrop-blur-xl
          ">

            <Search
              size={17}
              className="text-gray-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
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
            gap-3
            shrink-0
          ">

            <div className="
              relative
              cursor-pointer
              w-11
              h-11
              rounded-2xl
              border
              border-white/10
              bg-white/5
              flex
              items-center
              justify-center
              hover:bg-white/10
              transition-all
              duration-300
            ">

              <ShoppingCart
                size={22}
                className="
                  text-white
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
              onClick={() =>
                navigate("/my-orders")
              }
              className="
                hidden
                md:block
                border
                border-white/10
                bg-white/5
                hover:bg-white/10
                transition-all
                duration-300
                px-5
                py-2.5
                rounded-2xl
                text-sm
                font-bold
              "
            >
              My Orders
            </button>

            <button
              onClick={logout}
              className="
                bg-orange-500
                hover:bg-orange-400
                hover:scale-105
                transition-all
                duration-300
                px-5
                py-2.5
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
        px-6
        lg:px-12
        py-8
      ">

        {/* HERO */}

        <div className="
          w-full
          min-h-[calc(100vh-78px)]
          mb-12
        ">

        <div className="
          relative
          overflow-hidden
          rounded-[42px]
          border
          border-white/10
          bg-[#0b1220]
          min-h-[calc(100vh-120px)]
          px-8
          py-10
          md:px-14
          lg:px-20
          lg:py-16
          flex
          items-center
        ">

            {/* GLOW */}

            <div className="
              absolute
              top-[-120px]
              right-[-80px]
              w-[400px]
              h-[400px]
              rounded-full
              bg-orange-500/20
              blur-[120px]
            " />

            <div className="
              absolute
              bottom-[-120px]
              left-[20%]
              w-[350px]
              h-[350px]
              rounded-full
              bg-blue-500/10
              blur-[140px]
            " />

            {/* CONTENT */}

            <div className="
              relative
              z-10
              grid
              lg:grid-cols-[1.3fr_0.7fr]
              gap-16
              items-center
              h-full
            ">

              {/* LEFT */}

              <div>

                <div className="
                  inline-flex
                  items-center
                  gap-2
                  bg-orange-500/10
                  border
                  border-orange-500/20
                  px-5
                  py-3
                  rounded-full
                  text-orange-300
                  text-sm
                  font-semibold
                  mb-7
                ">

                  <Sparkles size={16} />

                  Welcome back, {user?.name}

                </div>

                <h1 className="
                  text-[58px]
                  sm:text-[78px]
                  lg:text-[110px]
                  leading-[0.95]
                  font-black
                  tracking-[-3px]
                  max-w-[900px]
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
                  mt-7
                  text-gray-400
                  text-[22px]
                  leading-relaxed
                  max-w-[580px]
                ">
                  Discover top-rated restaurants,
                  lightning-fast delivery, and a
                  luxury ordering experience crafted
                  for modern food lovers.
                </p>

                <div className="
                  flex
                  flex-wrap
                  gap-4
                  mt-7
                ">

                  <button className="
                    bg-orange-500
                    hover:bg-orange-400
                    hover:scale-105
                    transition-all
                    duration-300
                    px-7
                    py-3.5
                    rounded-2xl
                    font-bold
                    text-base
                    shadow-[0_15px_40px_rgba(249,115,22,0.35)]
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
                    px-7
                    py-3.5
                    rounded-2xl
                    font-semibold
                    text-gray-300
                  ">
                    View Offers
                  </button>

                </div>

              </div>

              {/* RIGHT */}

              <div className="
                flex
                justify-center
                lg:justify-end
              ">

                <div className="
                  w-full
                  max-w-[420px]
                  bg-white/[0.05]
                  backdrop-blur-2xl
                  border
                  border-white/10
                  rounded-[34px]
                  p-6
                  shadow-[0_20px_70px_rgba(0,0,0,0.35)]
                ">

                  <div className="
                    flex
                    items-center
                    justify-between
                    mb-6
                  ">

                    <div className="
                      w-14
                      h-14
                      rounded-3xl
                      bg-orange-500/15
                      flex
                      items-center
                      justify-center
                    ">

                      <MapPin
                        size={24}
                        className="
                          text-orange-400
                        "
                      />

                    </div>

                    <div className="
                      px-3
                      py-1.5
                      rounded-full
                      bg-green-500/10
                      border
                      border-green-500/20
                      text-green-400
                      text-xs
                      font-semibold
                    ">
                      Live
                    </div>

                  </div>

                  <h2 className="
                    text-4xl
                    font-black
                    leading-tight
                  ">
                    Delivering to your area
                  </h2>

                  <p className="
                    mt-3
                    text-gray-400
                    leading-relaxed
                    text-sm
                  ">
                    Fast, secure and premium
                    delivery service at your
                    fingertips.
                  </p>

                  <div className="
                    grid
                    grid-cols-2
                    gap-4
                    mt-8
                  ">

                    <div className="
                      bg-white/[0.04]
                      border
                      border-white/10
                      rounded-3xl
                      p-4
                    ">

                      <p className="
                        text-3xl
                        font-black
                      ">
                        4.9
                      </p>

                      <p className="
                        mt-1
                        text-gray-400
                        text-xs
                      ">
                        User Rating
                      </p>

                    </div>

                    <div className="
                      bg-white/[0.04]
                      border
                      border-white/10
                      rounded-3xl
                      p-4
                    ">

                      <p className="
                        text-3xl
                        font-black
                      ">
                        30m
                      </p>

                      <p className="
                        mt-1
                        text-gray-400
                        text-xs
                      ">
                        Avg Delivery
                      </p>

                    </div>

                  </div>

                  <div className="
                    mt-6
                    flex
                    items-center
                    gap-2
                    text-orange-300
                    text-xs
                    font-semibold
                    border-t
                    border-white/10
                    pt-5
                  ">

                    <Star
                      size={14}
                      fill="currentColor"
                    />

                    Rated #1 Food Delivery Experience

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="h-6" />

        {/* CATEGORIES */}

        <div className="
          max-w-[1600px]
          mx-auto
          mb-14
        ">

          <div className="
            flex
            items-center
            justify-between
            mb-7
          ">

            <h2 className="
              text-[36px]
              font-black
              tracking-tight
            ">
              Categories
            </h2>

            <button className="
              hidden
              md:flex
              items-center
              gap-2
              text-orange-400
              font-semibold
            ">
              View All
            </button>

          </div>

          <div className="
            grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-6
            gap-5
          ">

            {
              categories.map(
                (category, index) => (

                <div
                  key={index}
                  className="
                    group
                    relative
                    overflow-hidden
                    bg-white/[0.04]
                    border
                    border-white/10
                    rounded-[28px]
                    h-[115px]
                    flex
                    flex-col
                    items-center
                    justify-center
                    cursor-pointer
                    hover:border-orange-500/40
                    hover:-translate-y-2
                    hover:shadow-[0_20px_60px_rgba(249,115,22,0.18)]
                    transition-all
                    duration-500
                  "
                >

                  <span className="
                    text-3xl
                  ">
                    {category.emoji}
                  </span>

                  <p className="
                    mt-3
                    font-semibold
                    text-base
                    text-gray-300
                  ">
                    {category.name}
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

          <div className="
            flex
            items-center
            justify-between
            mb-8
          ">

            <div>

              <h2 className="
                text-[36px]
                font-black
                tracking-tight
              ">
                Top Restaurants
              </h2>

              <p className="
                text-gray-400
                mt-2
              ">
                Handpicked restaurants for you
              </p>

            </div>

            <div className="
              hidden
              lg:flex
              items-center
              gap-3
              text-gray-400
            ">

              <Clock3 size={18} />

              Fast delivery guaranteed

            </div>

          </div>

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-7
          ">

            {
              filteredRestaurants.map(
                (restaurant) => (

                <div
                  key={restaurant.id}
                  onClick={() =>
                    navigate(
                      `/restaurants/${restaurant.id}`
                    )
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
                    hover:-translate-y-3
                    hover:shadow-[0_20px_90px_rgba(249,115,22,0.18)]
                    cursor-pointer
                  "
                >

                  <div className="
                    relative
                    overflow-hidden
                  ">

                    <img
                      src={
                        restaurant.image_url ||
                        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
                      }
                      alt={restaurant.name}
                      className="
                        w-full
                        h-[220px]
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-110
                      "
                    />

                    <div className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/70
                      via-transparent
                      to-transparent
                    " />

                    <div className="
                      absolute
                      top-4
                      right-4
                      bg-orange-500/20
                      backdrop-blur-xl
                      border
                      border-orange-400/20
                      text-orange-300
                      px-3
                      py-1.5
                      rounded-2xl
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

                  <div className="p-5">

                    <h3 className="
                      text-xl
                      font-bold
                      text-white
                      leading-tight
                    ">
                      {restaurant.name}
                    </h3>

                    <p className="
                      text-gray-400
                      mt-2
                    ">
                      {restaurant.cuisine}
                    </p>

                    <div className="
                      flex
                      items-center
                      justify-between
                      mt-5
                    ">

                      <p className="
                        text-gray-300
                        font-medium
                      ">
                        ⏱ {restaurant.delivery_time}
                      </p>

                      <p className="
                        text-orange-400
                        font-bold
                      ">
                        ₹{restaurant.delivery_fee}
                      </p>

                    </div>

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