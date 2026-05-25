import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Clock3,
  TicketPercent,
  CheckCircle2,
} from "lucide-react";

import {
  useState,
} from "react";

import API from "../../api/axios";

import {
  useCart,
} from "../../context/CartContext";

function Checkout() {

  const navigate = useNavigate();

  const {
    cart,
  } = useCart();

  const [address, setAddress] =
    useState(
      "Sector 21, Delhi"
    );

  const [loading, setLoading] =
    useState(false);

  // ─────────────────────────────────────────
  // COUPON STATES
  // ─────────────────────────────────────────

  const [couponCode, setCouponCode] =
    useState("");

  const [couponLoading, setCouponLoading] =
    useState(false);

  const [couponApplied, setCouponApplied] =
    useState(false);

  const [discountAmount, setDiscountAmount] =
    useState(0);

  const [finalAmount, setFinalAmount] =
    useState(0);

  const [couponMessage, setCouponMessage] =
    useState("");

  // ─────────────────────────────────────────
  // BILLING
  // ─────────────────────────────────────────

  const subtotal =
    cart?.total_amount || 0;

  const deliveryFee = 40;

  const taxes = Math.round(
    subtotal * 0.05
  );

  const originalTotal =
    subtotal +
    deliveryFee +
    taxes;

  const total =
    couponApplied
      ? finalAmount
      : originalTotal;

  // ─────────────────────────────────────────
  // APPLY COUPON
  // ─────────────────────────────────────────

  const handleApplyCoupon = async () => {

    if (!couponCode) {

      return alert(
        "Enter coupon code"
      );
    }

    try {

      setCouponLoading(true);

      const response =
        await API.post(
          "/coupons/apply",
          {
            code: couponCode,
            order_amount:
              originalTotal,
          }
        );

      setCouponApplied(true);

      setDiscountAmount(
        response.data.discount_amount
      );

      setFinalAmount(
        response.data.final_amount
      );

      setCouponMessage(
        response.data.message
      );

    } catch (error) {

      console.log(error);

      setCouponApplied(false);

      setDiscountAmount(0);

      setFinalAmount(0);

      setCouponMessage(
        error.response?.data?.detail ||
        "Coupon failed"
      );
    } finally {

      setCouponLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // PAYMENT
  // ─────────────────────────────────────────

  const handlePayment = async () => {

    try {

      setLoading(true);

      // CREATE PAYMENT ORDER

      const response =
        await API.post(
          "/payments/create-order",
          {
            amount: total
          }
        );

      const data = response.data;

      // RAZORPAY OPTIONS

      const options = {

        key: data.key,

        amount: data.amount,

        currency: "INR",

        name: "BiteBox",

        description:
          "Food Order Payment",

        order_id:
          data.razorpay_order_id,

        theme: {
          color: "#f97316",
        },

        handler: async (
          response
        ) => {
        
          try {
          
            console.log(
              "RAZORPAY RESPONSE:",
              response
            );
          
            // VALIDATE RESPONSE
          
            if (
              !response.razorpay_order_id ||
              !response.razorpay_payment_id ||
              !response.razorpay_signature
            ) {
            
              alert(
                "Invalid payment response"
              );
            
              return;
            }
          
            // VERIFY PAYMENT
          
            const verifyResponse =
              await API.post(
                "/payments/verify",
                {
                
                  razorpay_order_id:
                    response.razorpay_order_id,
                
                  razorpay_payment_id:
                    response.razorpay_payment_id,
                
                  razorpay_signature:
                    response.razorpay_signature
                
                }
              );
            
            console.log(
              verifyResponse.data
            );
          
            // CREATE ORDER
          
            const orderResponse =
              await API.post(
                "/orders/create",
                {
                
                  delivery_address:
                    address,
                
                  coupon_code:
                    couponApplied
                      ? couponCode
                      : null,
                
                  discount_amount:
                    discountAmount,
                
                  original_amount:
                    originalTotal
                
                }
              );
            
            navigate(
              `/order-success/${orderResponse.data.order_id}`
            );
          
          } catch (error) {
          
            console.log(
              "VERIFY ERROR:",
              error.response?.data
            );
          
            alert(
            
              error.response?.data?.detail ||
            
              "Payment verification failed"
            );
          }
        },

        modal: {

          ondismiss: () => {

            setLoading(false);

            alert(
              "Payment cancelled"
            );
          }
        }

      };

      // OPEN PAYMENT WINDOW

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.open();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.detail ||
        "Payment failed"
      );

    } finally {

      setLoading(false);
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
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
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
                    Razorpay
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

              {/* COUPON */}

              <div className="
                mb-8
                bg-white/5
                border
                border-white/10
                rounded-3xl
                p-5
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                  mb-5
                ">

                  <TicketPercent
                    className="
                      text-orange-400
                    "
                  />

                  <h3 className="
                    text-xl
                    font-bold
                  ">
                    Apply Coupon
                  </h3>

                </div>

                <div className="
                  flex
                  gap-3
                ">

                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(
                        e.target.value
                      )
                    }
                    className="
                      flex-1
                      h-14
                      rounded-2xl
                      bg-black/20
                      border
                      border-white/10
                      px-5
                      outline-none
                    "
                  />

                  <button
                    onClick={
                      handleApplyCoupon
                    }
                    disabled={
                      couponLoading
                    }
                    className="
                      px-6
                      rounded-2xl
                      bg-orange-500
                      hover:bg-orange-400
                      font-bold
                      transition-all
                      duration-300
                    "
                  >

                    {
                      couponLoading
                        ? "..."
                        : "Apply"
                    }

                  </button>

                </div>

                {
                  couponMessage && (

                    <div className={`
                      mt-4
                      rounded-2xl
                      p-4
                      text-sm
                      font-semibold
                      flex
                      items-center
                      gap-2

                      ${
                        couponApplied
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }
                    `}>

                      <CheckCircle2
                        size={16}
                      />

                      {couponMessage}

                    </div>
                  )
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

                {
                  couponApplied && (

                    <div className="
                      flex
                      justify-between
                      text-green-400
                      font-bold
                    ">

                      <p>Coupon Discount</p>

                      <p>
                        -₹{discountAmount}
                      </p>

                    </div>
                  )
                }

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

              {/* PAYMENT BUTTON */}

              <button
                onClick={handlePayment}
                disabled={loading}
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
                  disabled:opacity-50
                "
              >

                {
                  loading
                    ? "Processing..."
                    : `Pay ₹${total}`
                }

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;