import {
  Search,
  ShoppingCart,
  MapPin,
  Star,
} from "lucide-react";

function Home() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

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

  const restaurants = [
    {
      name: "Burger Blast",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
      cuisine: "Burgers • Fast Food",
      rating: "4.7",
      time: "20-25 min",
    },
    {
      name: "Pizza Heaven",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
      cuisine: "Pizza • Italian",
      rating: "4.5",
      time: "30-35 min",
    },
    {
      name: "Royal Biryani",
      image:
        "https://images.unsplash.com/photo-1701579231349-d7459c40919d?q=80&w=1200&auto=format&fit=crop",
      cuisine: "Biryani • Indian",
      rating: "4.8",
      time: "25-30 min",
    },
    {
      name: "Chinese Wok",
      image:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1200&auto=format&fit=crop",
      cuisine: "Chinese • Noodles",
      rating: "4.4",
      time: "20 min",
    },
  ];

  return (

    <div className="min-h-screen bg-[#f8f8f8]">

      {/* NAVBAR */}

      <div className="
        bg-white
        border-b
        border-gray-200
        sticky
        top-0
        z-50
      ">

        <div className="
          w-full
          h-[82px]
          px-6
          flex
          items-center
          justify-between
        ">

          {/* LOGO */}

          <h1 className="
            text-4xl
            font-extrabold
            text-orange-500
            tracking-tight
          ">
            BiteBox
          </h1>

          {/* SEARCH */}

          <div className="
            hidden
            md:flex
            items-center
            bg-gray-100
            rounded-2xl
            px-4
            h-12
            w-[420px]
          ">

            <Search
              size={18}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Search restaurants or food..."
              className="
                bg-transparent
                outline-none
                w-full
                ml-3
                text-[15px]
              "
            />

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-5">

            {/* CART */}

            <div className="relative cursor-pointer">

              <ShoppingCart
                size={26}
                className="text-gray-700"
              />

              <div className="
                absolute
                -top-2
                -right-2
                w-5
                h-5
                bg-orange-500
                text-white
                text-xs
                rounded-full
                flex
                items-center
                justify-center
              ">
                0
              </div>

            </div>

            {/* LOGOUT */}

            <button
              onClick={logout}
              className="
                bg-orange-500
                hover:bg-orange-600
                text-white
                px-7
                py-5
                text-sm
                font-semibold
                transition
              "
            >
              Logout
            </button>

          </div>

        </div>

      </div>

      {/* MAIN */}

      <div className="w-full px-8 py-8">

        {/* HERO */}

        <div className="
          bg-orange-500
          rounded-[20px]
          px-10
          py-10
          lg:px-14
          flex
          flex-col
          lg:flex-row
          justify-between
          items-center
          mb-14
        ">

          {/* LEFT CONTENT */}

          <div className="max-w-[520px]">

            <p className="
              text-orange-100
              text-sm
              font-medium
              mb-3
            ">
              Welcome back, {user?.name}
            </p>

            <h2 className="
              text-4xl
              lg:text-5xl
              font-extrabold
              text-white
              leading-tight
              tracking-tight
            ">
              Craving something
              delicious?
            </h2>

            <p className="
              text-orange-50
              text-base
              mt-4
              leading-relaxed
              max-w-[450px]
            ">
              Order from the best restaurants near you
              with super fast delivery.
            </p>

            <button className="
              mt-6
              bg-black
              hover:bg-gray-900
              text-white
              px-6
              py-3
              rounded-xl
              text-sm
              font-semibold
              transition
            ">
              Explore Now
            </button>

          </div>

          {/* RIGHT CARD */}

          <div className="
            mt-8
            lg:mt-0
            bg-white/15
            backdrop-blur-md
            border
            border-white/20
            rounded-2xl
            px-5
            py-4
            text-white
            min-w-[260px]
          ">

            <div className="flex items-center gap-3 mb-3">

              <MapPin size={18} />

              <div>

                <p className="font-semibold text-base">
                  Delivering to your location
                </p>

                <p className="text-sm text-orange-100">
                  Fast & secure delivery
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2">

              <Star
                size={16}
                fill="white"
              />

              <p className="text-sm">
                Rated #1 Food Delivery Experience
              </p>

            </div>

          </div>

        </div>

        {/* CATEGORIES */}

        <div className="mb-12">

          <div className="
            flex
            items-center
            justify-between
            mb-5
          ">

            <h2 className="
              text-3xl
              font-bold
              text-gray-900
            ">
              Categories
            </h2>

          </div>

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
                    bg-white
                    rounded-2xl
                    border
                    border-gray-200
                    h-[95px]
                    flex
                    flex-col
                    items-center
                    justify-center
                    cursor-pointer
                    hover:shadow-lg
                    transition-all
                    duration-300
                  "
                >

                  <span className="text-3xl mb-2">
                    {category.split(" ")[0]}
                  </span>

                  <p className="
                    font-semibold
                    text-gray-700
                    text-sm
                  ">
                    {category.split(" ")[1]}
                  </p>

                </div>
              ))
            }

          </div>

        </div>

        {/* RESTAURANTS */}

        <div>

          <div className="
            flex
            justify-between
            items-center
            mb-6
          ">

            <h2 className="
              text-3xl
              font-bold
              text-gray-900
            ">
              Top Restaurants
            </h2>

            <button className="
              text-orange-500
              font-semibold
              hover:underline
            ">
              View All
            </button>

          </div>

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-7
          ">

            {
              restaurants.map((restaurant, index) => (

                <div
                  key={index}
                  className="
                    bg-white
                    rounded-2xl
                    overflow-hidden
                    border
                    border-gray-200
                    hover:shadow-2xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    cursor-pointer
                  "
                >

                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="
                      w-full
                      h-[230px]
                      object-cover
                    "
                  />

                  <div className="p-5">

                    <div className="
                      flex
                      items-start
                      justify-between
                    ">

                      <div>

                        <h3 className="
                          text-2xl
                          font-bold
                          text-gray-900
                        ">
                          {restaurant.name}
                        </h3>

                        <p className="
                          text-gray-500
                          mt-1
                        ">
                          {restaurant.cuisine}
                        </p>

                      </div>

                      <div className="
                        bg-green-500
                        text-white
                        px-2
                        py-1
                        rounded-lg
                        text-sm
                        font-semibold
                        flex
                        items-center
                        gap-1
                      ">

                        <Star
                          size={14}
                          fill="white"
                        />

                        {restaurant.rating}

                      </div>

                    </div>

                    <p className="
                      mt-4
                      text-gray-700
                      font-medium
                    ">
                      ⏱ {restaurant.time}
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