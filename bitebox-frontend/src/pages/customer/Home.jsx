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

  const [selectedCategory, setSelectedCategory] =
    useState("All");

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
      emoji: "✨",
      name: "All",
    },
  
    ...[
      ...new Set(
        restaurants.map(
          (restaurant) =>
            restaurant.cuisine
        )
      ),
    ].map((cuisine) => ({
    
      emoji: "🍽",
    
      name: cuisine,
    })),
  ];

  const filteredRestaurants =
    restaurants.filter((restaurant) => {

      const matchesSearch =
        restaurant.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        selectedCategory === "All"
          ? true
          : restaurant.cuisine
              ?.toLowerCase()
              .includes(
                selectedCategory.toLowerCase()
              );

      return (
        matchesSearch &&
        matchesCategory
      );
    });

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
          px-4
          md:px-6
          lg:px-10
          flex
          items-center
          justify-between
          gap-5
          max-w-[1700px]
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
            max-w-[500px]
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
        px-4
        md:px-6
        lg:px-10
        py-8
      ">

        {/* HERO */}

        <div className="
          max-w-[1700px]
          mx-auto
          mb-16
        ">

          <div className="
            relative
            overflow-hidden
            rounded-[40px]
            border
            border-white/10
            bg-[#0b1220]
            px-6
            py-10
            md:px-12
            lg:px-16
            xl:px-20
            xl:py-20
          ">

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

            <div className="
              relative
              z-10
              grid
              grid-cols-1
              xl:grid-cols-[1.2fr_0.8fr]
              gap-14
              xl:gap-20
              items-center
            ">

              <div className="
                max-w-[900px]
              ">

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
                  mb-8
                ">

                  <Sparkles size={16} />

                  Welcome back, {user?.name}

                </div>

                <h1 className="
                  text-[54px]
                  sm:text-[72px]
                  lg:text-[96px]
                  xl:text-[110px]
                  leading-[0.92]
                  font-black
                  tracking-[-3px]
                ">

                  Premium

                  <span className="
                    block
                    text-orange-500
                    mt-2
                  ">
                    food delivery
                  </span>

                  <span className="block mt-2">
                    experience
                  </span>

                </h1>

              </div>

            </div>

          </div>

        </div>

        {/* CATEGORIES */}

        <div className="
          max-w-[1700px]
          mx-auto
          mb-16
        ">

          <div className="
            flex
            items-center
            justify-between
            mb-8
          ">

            <h2 className="
              text-[34px]
              md:text-[40px]
              font-black
              tracking-tight
            ">
              Categories
            </h2>

            <div className="
              text-orange-400
              font-semibold
            ">
              {selectedCategory}
            </div>

          </div>

          <div className="
            grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-7
            gap-5
          ">

            {
              categories.map(
                (category, index) => (

                <div
                  key={index}
                  onClick={() =>
                    setSelectedCategory(
                      category.name
                    )
                  }
                  className={`
                    group
                    relative
                    overflow-hidden
                    rounded-[28px]
                    h-[120px]
                    flex
                    flex-col
                    items-center
                    justify-center
                    cursor-pointer
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:shadow-[0_20px_60px_rgba(249,115,22,0.18)]

                    ${
                      selectedCategory ===
                      category.name

                        ?

                        `
                        bg-orange-500/10
                        border
                        border-orange-500/40
                        shadow-[0_15px_40px_rgba(249,115,22,0.18)]
                        `

                        :

                        `
                        bg-white/[0.04]
                        border
                        border-white/10
                        hover:border-orange-500/40
                        `
                    }
                  `}
                >

                  <span className="
                    text-3xl
                  ">
                    {category.emoji}
                  </span>

                  <p className={`
                    mt-3
                    font-semibold
                    text-base

                    ${
                      selectedCategory ===
                      category.name

                        ?

                        "text-orange-300"

                        :

                        "text-gray-300"
                    }
                  `}>
                    {category.name}
                  </p>

                </div>
              ))
            }

          </div>

        </div>

        {/* RESTAURANTS */}

        <div className="
          max-w-[1700px]
          mx-auto
          pb-16
        ">

          <div className="
            flex
            items-center
            justify-between
            mb-10
          ">

            <div>

              <h2 className="
                text-[34px]
                md:text-[40px]
                font-black
                tracking-tight
              ">
                {
                  selectedCategory === "All"

                    ?

                    "Top Restaurants"

                    :

                    `${selectedCategory} Restaurants`
                }
              </h2>

              <p className="
                text-gray-400
                mt-2
                text-base
              ">
                {filteredRestaurants.length} restaurants found
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

          {
            filteredRestaurants.length === 0 ? (

              <div className="
                rounded-[32px]
                border
                border-white/10
                bg-white/[0.03]
                py-24
                text-center
              ">

                <div className="
                  text-7xl
                  mb-6
                ">
                  🍽
                </div>

                <h3 className="
                  text-3xl
                  font-black
                  mb-3
                ">
                  No Restaurants Found
                </h3>

                <p className="
                  text-gray-400
                  text-lg
                ">
                  Try another category or search term
                </p>

              </div>

            ) : (

              <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                2xl:grid-cols-4
                gap-8
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
                            h-[240px]
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

                          {restaurant.rating || "4.5"}

                        </div>

                      </div>

                      <div className="p-6">

                        <h3 className="
                          text-2xl
                          font-bold
                          text-white
                          leading-tight
                          break-words
                        ">
                          {restaurant.name}
                        </h3>

                        <p className="
                          text-gray-400
                          mt-2
                          break-words
                        ">
                          {restaurant.cuisine}
                        </p>

                        <div className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          mt-6
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
                            shrink-0
                          ">
                            ₹{restaurant.delivery_fee}
                          </p>

                        </div>

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

export default Home;