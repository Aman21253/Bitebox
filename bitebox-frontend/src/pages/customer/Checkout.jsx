import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Clock3,
} from "lucide-react";

import API from "../../api/axios";

import {
  useCart,
} from "../../context/CartContext";

function Checkout() {

  const navigate = useNavigate();

  const {
    cart,
  } = useCart();

  const subtotal =
    cart?.total_amount || 0;

  const deliveryFee = 40;

  const taxes = Math.round(
    subtotal * 0.05
  );

  const total =
    subtotal +
    deliveryFee +
    taxes;

  const placeOrder = async () => {

    try {

      const response = await API.post(
        "/orders/create",
        {
          delivery_address:
            "Sector 21, Delhi",
        }
      );

      navigate(
        `/order-success/${response.data.order_id}`
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.detail ||
        "Failed to place order"
      );
    }
  };

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
      px-5
      lg:px-10
      py-8
    ">

      {/* TOP */}

      <div className="
        max-w-[1500px]
        mx-auto
      ">

        <div className="
          flex
          items-center
          gap-4
          mb-10
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
            "
          >

            <ArrowLeft size={20} />

          </button>

          <h1 className="
            text-5xl
            font-black
            bg-gradient-to-r
            from-orange-400
            to-red-500
            bg-clip-text
            text-transparent
          ">
            Checkout
          </h1>

        </div>

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-[1fr_420px]
          gap-8
        ">

          {/* LEFT */}

          <div>

            {/* ADDRESS */}

            <div className="
              bg-white/[0.03]
              border
              border-white/10
              rounded-[30px]
              p-7
              mb-8
            ">

              <div className="
                flex
                items-center
                gap-3
                mb-6
              ">

                <MapPin
                  className="text-orange-400"
                />

                <h2 className="
                  text-2xl
                  font-bold
                ">
                  Delivery Address
                </h2>

              </div>

              <textarea
                placeholder="Enter delivery address..."
                defaultValue="Sector 21, Delhi"
                className="
                  w-full
                  h-[140px]
                  rounded-2xl
                  bg-white/5
                  border
                  border-white/10
                  p-5
                  outline-none
                  resize-none
                "
              />

            </div>

            {/* DELIVERY */}

            <div className="
              bg-white/[0.03]
              border
              border-white/10
              rounded-[30px]
              p-7
            ">

              <div className="
                flex
                items-center
                gap-3
                mb-6
              ">

                <Clock3
                  className="text-orange-400"
                />

                <h2 className="
                  text-2xl
                  font-bold
                ">
                  Delivery Details
                </h2>

              </div>

              <div className="
                flex
                flex-col
                gap-4
              ">

                <div className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  p-5
                ">

                  <p className="
                    text-gray-400
                    text-sm
                    mb-2
                  ">
                    Estimated Delivery
                  </p>

                  <h3 className="
                    text-xl
                    font-bold
                  ">
                    25 - 30 mins
                  </h3>

                </div>

                <div className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  p-5
                ">

                  <p className="
                    text-gray-400
                    text-sm
                    mb-2
                  ">
                    Payment Method
                  </p>

                  <h3 className="
                    text-xl
                    font-bold
                  ">
                    Cash On Delivery
                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div className="
              sticky
              top-24
              bg-white/[0.03]
              border
              border-white/10
              rounded-[30px]
              p-7
            ">

              <h2 className="
                text-3xl
                font-black
                mb-8
              ">
                Order Summary
              </h2>

              {/* ITEMS */}

              <div className="
                space-y-5
                mb-8
              ">

                {
                  cart?.items?.map((item) => (

                    <div
                      key={item.cart_item_id}
                      className="
                        flex
                        justify-between
                        gap-5
                      "
                    >

                      <div>

                        <h3 className="
                          font-bold
                          text-lg
                        ">
                          {item.item_name}
                        </h3>

                        <p className="
                          text-gray-400
                          text-sm
                          mt-1
                        ">
                          Qty: {item.quantity}
                        </p>

                      </div>

                      <p className="
                        font-bold
                        text-orange-400
                      ">
                        ₹{item.total_price}
                      </p>

                    </div>
                  ))
                }

              </div>

              {/* BILLING */}

              <div className="
                border-t
                border-white/10
                pt-6
                space-y-4
              ">

                <div className="
                  flex
                  justify-between
                  text-gray-300
                ">

                  <p>Subtotal</p>

                  <p>₹{subtotal}</p>

                </div>

                <div className="
                  flex
                  justify-between
                  text-gray-300
                ">

                  <p>Delivery Fee</p>

                  <p>₹{deliveryFee}</p>

                </div>

                <div className="
                  flex
                  justify-between
                  text-gray-300
                ">

                  <p>Taxes & Charges</p>

                  <p>₹{taxes}</p>

                </div>

                <div className="
                  border-t
                  border-white/10
                  pt-5
                  flex
                  justify-between
                  text-2xl
                  font-black
                ">

                  <p>Total</p>

                  <p className="
                    text-orange-400
                  ">
                    ₹{total}
                  </p>

                </div>

              </div>

              {/* BUTTON */}

              <button
                onClick={placeOrder}
                className="
                  w-full
                  h-16
                  mt-8
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
                Place Order
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;