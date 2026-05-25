import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  Star,
  Clock3,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

import FloatingCartBar from "../../components/cart/FloatingCartBar";

import API from "../../api/axios";

import {
  useCart,
} from "../../context/CartContext";

import CartSidebar from "../../components/customer/CartSidebar";

function RestaurantDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const {
    addToCart,
    cart,
    setCartOpen,
  } = useCart();

  const [restaurant, setRestaurant] =
    useState(null);

  const [menu, setMenu] = useState([]);

  useEffect(() => {

    fetchRestaurant();

    fetchMenu();

  }, []);

  const fetchRestaurant = async () => {

    try {

      const response = await API.get(
        `/restaurants/${id}`
      );

      setRestaurant(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  const fetchMenu = async () => {

    try {

      const response = await API.get(
        `/restaurants/${id}/menu`
      );

      setMenu(response.data.categories);

    } catch (error) {

      console.log(error);

    }
  };

  if (!restaurant) {

    return (

      <div className="
        min-h-screen
        bg-[#070b14]
        text-white
        flex
        items-center
        justify-center
        text-3xl
        font-bold
      ">
        Loading...
      </div>
    );
  }

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
      pb-32
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
          h-[78px]
          px-5
          lg:px-10
          flex
          items-center
          justify-between
          max-w-[1600px]
          mx-auto
        ">

          {/* LEFT */}

          <div className="
            flex
            items-center
            gap-4
          ">

            <button
              onClick={() => navigate(-1)}
              className="
                w-12
                h-12
                rounded-2xl
                bg-white/5
                border
                border-white/10
                flex
                items-center
                justify-center
                hover:bg-white/10
                transition
              "
            >

              <ArrowLeft size={20} />

            </button>

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

          </div>

          {/* CART */}

          <div
            onClick={() =>
              setCartOpen(true)
            }
            className="
              relative
              cursor-pointer
            "
          >

            <ShoppingCart
              size={29}
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
              {cart?.items?.length || 0}
            </div>

          </div>

        </div>

      </div>

      {/* HERO */}

      <div className="
        px-5
        lg:px-10
        pt-8
      ">

        <div className="
          relative
          overflow-hidden
          rounded-[40px]
          h-[520px]
          border
          border-white/10
          max-w-[1600px]
          mx-auto
        ">

          {/* IMAGE */}

          <img
            src={
              restaurant.image_url ||
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
            }
            alt={restaurant.name}
            className="
              w-full
              h-full
              object-cover
            "
          />

          {/* OVERLAY */}

          <div className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black
            via-black/50
            to-black/20
          " />

          {/* CONTENT */}

          <div className="
            absolute
            bottom-0
            left-0
            w-full
            p-8
            lg:p-12
          ">

            <div className="
              max-w-[900px]
            ">

              <p className="
                text-orange-400
                uppercase
                tracking-[3px]
                text-sm
                font-bold
                mb-5
              ">
                {restaurant.cuisine}
              </p>

              <h1 className="
                text-5xl
                lg:text-7xl
                leading-[0.95]
                font-black
                tracking-tight
              ">
                {restaurant.name}
              </h1>

              <p className="
                mt-6
                text-lg
                text-gray-300
                leading-relaxed
                max-w-[700px]
              ">
                {restaurant.description}
              </p>

              {/* STATS */}

              <div className="
                flex
                flex-wrap
                items-center
                gap-5
                mt-8
              ">

                <div className="
                  flex
                  items-center
                  gap-2
                  bg-white/10
                  backdrop-blur-xl
                  border
                  border-white/10
                  px-5
                  py-3
                  rounded-2xl
                ">

                  <Star
                    size={16}
                    fill="currentColor"
                    className="text-orange-400"
                  />

                  <span className="
                    font-semibold
                  ">
                    {restaurant.rating}
                  </span>

                </div>

                <div className="
                  flex
                  items-center
                  gap-2
                  bg-white/10
                  backdrop-blur-xl
                  border
                  border-white/10
                  px-5
                  py-3
                  rounded-2xl
                ">

                  <Clock3
                    size={16}
                    className="text-orange-400"
                  />

                  <span className="
                    font-semibold
                  ">
                    {restaurant.delivery_time}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* MENU */}

      <div className="
        px-5
        lg:px-10
        mt-14
      ">

        <div className="
          max-w-[1600px]
          mx-auto
        ">

          {
            menu.map((category) => (

              <div
                key={category.category_id}
                className="mb-16"
              >

                {/* CATEGORY */}

                <h2 className="
                  text-4xl
                  font-black
                  tracking-tight
                  mb-8
                ">
                  {category.category_name}
                </h2>

                {/* ITEMS */}

                <div className="
                  grid
                  grid-cols-1
                  xl:grid-cols-2
                  gap-8
                ">

                  {
                    category.items.map((item) => (

                      <div
                        key={item.id}
                        className="
                          group
                          bg-white/[0.03]
                          backdrop-blur-2xl
                          border
                          border-white/10
                          rounded-[32px]
                          overflow-hidden
                          hover:border-orange-500/30
                          hover:-translate-y-1
                          hover:shadow-[0_20px_70px_rgba(249,115,22,0.12)]
                          transition-all
                          duration-500
                          flex
                          flex-col
                          md:flex-row
                        "
                      >

                        {/* IMAGE */}

                        <div className="
                          overflow-hidden
                          md:w-[280px]
                          shrink-0
                        ">

                          <img
                            src={
                              item.image_url ||
                              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
                            }
                            alt={item.name}
                            className="
                              w-full
                              h-[240px]
                              md:h-full
                              object-cover
                              transition-transform
                              duration-700
                              group-hover:scale-110
                            "
                          />

                        </div>

                        {/* CONTENT */}

                        <div className="
                          flex-1
                          p-7
                        ">

                          {/* TOP */}

                          <div className="
                            flex
                            items-start
                            justify-between
                            gap-6
                          ">

                            <div>

                              <div className="
                                flex
                                items-center
                                gap-3
                                mb-3
                              ">

                                <div className={`
                                  w-4
                                  h-4
                                  rounded-full
                                  ${
                                    item.is_veg
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                  }
                                `} />

                                <h3 className="
                                  text-3xl
                                  font-bold
                                  leading-tight
                                ">
                                  {item.name}
                                </h3>

                              </div>

                              <p className="
                                text-gray-400
                                leading-relaxed
                              ">
                                {item.description}
                              </p>

                            </div>

                            <div className="
                              text-3xl
                              font-black
                              text-orange-400
                              shrink-0
                            ">
                              ₹{item.base_price}
                            </div>

                          </div>

                          {/* VARIANTS */}

                          {
                            item.variants.length > 0 && (

                              <div className="mt-6">

                                <p className="
                                  text-sm
                                  font-semibold
                                  text-gray-300
                                  mb-3
                                ">
                                  Variants
                                </p>

                                <div className="
                                  flex
                                  flex-wrap
                                  gap-3
                                ">

                                  {
                                    item.variants.map((variant) => (

                                      <div
                                        key={variant.id}
                                        className="
                                          px-4
                                          py-2
                                          rounded-xl
                                          bg-white/5
                                          border
                                          border-white/10
                                          text-sm
                                          font-medium
                                          text-gray-300
                                        "
                                      >
                                        {variant.name}
                                        {" "}
                                        (+₹{variant.price})
                                      </div>
                                    ))
                                  }

                                </div>

                              </div>
                            )
                          }

                          {/* ADDONS */}

                          {
                            item.addons.length > 0 && (

                              <div className="mt-6">

                                <p className="
                                  text-sm
                                  font-semibold
                                  text-gray-300
                                  mb-3
                                ">
                                  Addons
                                </p>

                                <div className="
                                  flex
                                  flex-wrap
                                  gap-3
                                ">

                                  {
                                    item.addons.map((addon) => (

                                      <div
                                        key={addon.id}
                                        className="
                                          px-4
                                          py-2
                                          rounded-xl
                                          bg-orange-500/10
                                          border
                                          border-orange-500/20
                                          text-sm
                                          font-medium
                                          text-orange-300
                                        "
                                      >
                                        {addon.name}
                                        {" "}
                                        (+₹{addon.price})
                                      </div>
                                    ))
                                  }

                                </div>

                              </div>
                            )
                          }

                          {/* FOOTER */}

                          <div className="
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-5
                            mt-8
                          ">

                            <p className="
                              text-gray-400
                              font-medium
                            ">
                              ⏱ {item.preparation_time} mins
                            </p>

                            <button
                              onClick={() =>
                                addToCart(item.id)
                              }
                              className="
                                bg-orange-500
                                hover:bg-orange-400
                                hover:scale-105
                                transition-all
                                duration-300
                                px-6
                                py-3
                                rounded-2xl
                                font-bold
                                shadow-lg
                                shadow-orange-500/20
                              "
                            >
                              Add to Cart
                            </button>

                          </div>

                        </div>

                      </div>
                    ))
                  }

                </div>

              </div>
            ))
          }

        </div>

      </div>

      <FloatingCartBar />
      <CartSidebar />

    </div>
  );
}

export default RestaurantDetails;