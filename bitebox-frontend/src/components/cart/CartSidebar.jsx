import {
  X,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useCart,
} from "../../context/CartContext";

function CartSidebar() {

  const navigate = useNavigate();

  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
  } = useCart();

  return (

    <>

      {/* OVERLAY */}

      {
        cartOpen && (

          <div
            onClick={() =>
              setCartOpen(false)
            }
            className="
              fixed
              inset-0
              bg-black/50
              backdrop-blur-sm
              z-40
            "
          />
        )
      }

      {/* SIDEBAR */}

      <div className={`
        fixed
        top-0
        right-0
        h-full
        w-[430px]
        bg-[#0b1220]
        border-l
        border-white/10
        z-50
        shadow-2xl
        transition-all
        duration-300
        flex
        flex-col
        text-white
        ${
          cartOpen
          ? "translate-x-0"
          : "translate-x-full"
        }
      `}>

        {/* HEADER */}

        <div className="
          h-[85px]
          px-6
          border-b
          border-white/10
          flex
          items-center
          justify-between
        ">

          <div>

            <h2 className="
              text-3xl
              font-black
            ">
              Your Cart
            </h2>

            <p className="
              text-sm
              text-gray-400
              mt-1
            ">
              Review your order
            </p>

          </div>

          <button
            onClick={() =>
              setCartOpen(false)
            }
            className="
              w-10
              h-10
              rounded-xl
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

            <X size={20} />

          </button>

        </div>

        {/* ITEMS */}

        <div className="
          flex-1
          overflow-y-auto
          p-6
        ">

          {
            !cart?.items?.length && (

              <div className="
                h-full
                flex
                flex-col
                items-center
                justify-center
                text-center
              ">

                <div className="
                  text-7xl
                  mb-5
                ">
                  🛒
                </div>

                <h3 className="
                  text-2xl
                  font-bold
                  mb-2
                ">
                  Your cart is empty
                </h3>

                <p className="
                  text-gray-400
                  max-w-[260px]
                ">
                  Add delicious food items
                  to start your order.
                </p>

              </div>
            )
          }

          <div className="space-y-5">

            {
              cart?.items?.map((item) => (

                <div
                  key={item.cart_item_id}
                  className="
                    rounded-[28px]
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-5
                  "
                >

                  {/* TOP */}

                  <div className="
                    flex
                    justify-between
                    items-start
                    gap-4
                  ">

                    <div>

                      <h3 className="
                        text-xl
                        font-bold
                        leading-tight
                      ">
                        {item.item_name}
                      </h3>

                      {
                        item.variant_name && (

                          <p className="
                            text-sm
                            text-orange-400
                            mt-2
                            font-medium
                          ">
                            {item.variant_name}
                          </p>
                        )
                      }

                    </div>

                    <button
                      onClick={() =>
                        removeItem(
                          item.cart_item_id
                        )
                      }
                      className="
                        w-9
                        h-9
                        rounded-xl
                        bg-red-500/10
                        border
                        border-red-500/20
                        flex
                        items-center
                        justify-center
                        hover:bg-red-500/20
                        transition
                      "
                    >

                      <Trash2
                        size={17}
                        className="
                          text-red-400
                        "
                      />

                    </button>

                  </div>

                  {/* ADDONS */}

                  {
                    item.addons?.length > 0 && (

                      <div className="
                        mt-4
                        flex
                        flex-wrap
                        gap-2
                      ">

                        {
                          item.addons.map((addon) => (

                            <div
                              key={addon.addon_id}
                              className="
                                px-3
                                py-1.5
                                rounded-xl
                                bg-orange-500/10
                                border
                                border-orange-500/20
                                text-xs
                                text-orange-300
                                font-medium
                              "
                            >
                              {addon.addon_name}
                            </div>
                          ))
                        }

                      </div>
                    )
                  }

                  {/* FOOTER */}

                  <div className="
                    mt-6
                    flex
                    items-center
                    justify-between
                  ">

                    {/* QUANTITY */}

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.cart_item_id,
                            item.quantity - 1
                          )
                        }
                        className="
                          w-10
                          h-10
                          rounded-xl
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

                        <Minus size={16} />

                      </button>

                      <span className="
                        text-lg
                        font-black
                        w-5
                        text-center
                      ">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.cart_item_id,
                            item.quantity + 1
                          )
                        }
                        className="
                          w-10
                          h-10
                          rounded-xl
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

                        <Plus size={16} />

                      </button>

                    </div>

                    {/* PRICE */}

                    <p className="
                      text-2xl
                      font-black
                      text-orange-400
                    ">
                      ₹{item.total_price}
                    </p>

                  </div>

                </div>
              ))
            }

          </div>

        </div>

        {/* FOOTER */}

        {
          cart?.items?.length > 0 && (

            <div className="
              p-6
              border-t
              border-white/10
              bg-[#0f1729]
            ">

              {/* TOTAL */}

              <div className="
                flex
                items-center
                justify-between
                mb-6
              ">

                <div>

                  <p className="
                    text-sm
                    text-gray-400
                    mb-1
                  ">
                    Total Amount
                  </p>

                  <h3 className="
                    text-4xl
                    font-black
                    text-orange-400
                  ">
                    ₹{cart?.total_amount || 0}
                  </h3>

                </div>

              </div>

              {/* BUTTON */}

              <button
                onClick={() => {

                  setCartOpen(false);

                  navigate("/checkout");

                }}
                className="
                  w-full
                  h-16
                  rounded-2xl
                  bg-orange-500
                  hover:bg-orange-400
                  transition-all
                  duration-300
                  text-xl
                  font-black
                  shadow-lg
                  shadow-orange-500/20
                "
              >
                Proceed To Checkout
              </button>

            </div>
          )
        }

      </div>

    </>
  );
}

export default CartSidebar;