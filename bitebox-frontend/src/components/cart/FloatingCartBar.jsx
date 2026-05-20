import {
  ShoppingBag,
} from "lucide-react";

import {
  useCart,
} from "../../context/CartContext";

function FloatingCartBar() {

  const {
    cart,
    setCartOpen,
  } = useCart();

  if (
    !cart ||
    !cart.items ||
    cart.items.length === 0
  ) {
    return null;
  }

  const totalItems = cart.items.reduce(
    (acc, item) =>
      acc + item.quantity,
    0
  );

  return (

    <div className="
      fixed
      bottom-6
      left-1/2
      -translate-x-1/2
      z-50
      w-[92%]
      max-w-[700px]
    ">

      <button
        onClick={() =>
          setCartOpen(true)
        }
        className="
          w-full
          bg-black
          text-white
          h-[72px]
          rounded-2xl
          px-7
          flex
          items-center
          justify-between
          shadow-2xl
          hover:scale-[1.01]
          transition-all
        "
      >

        {/* LEFT */}

        <div className="
          flex
          items-center
          gap-4
        ">

          <div className="
            w-12
            h-12
            rounded-xl
            bg-orange-500
            flex
            items-center
            justify-center
          ">

            <ShoppingBag size={22} />

          </div>

          <div className="text-left">

            <p className="
              font-bold
              text-lg
            ">
              {totalItems} Items Added
            </p>

            <p className="
              text-sm
              text-gray-300
            ">
              Ready for checkout
            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="text-right">

          <p className="
            text-2xl
            font-extrabold
          ">
            ₹{cart.total_amount}
          </p>

          <p className="
            text-sm
            text-orange-400
          ">
            View Cart →
          </p>

        </div>

      </button>

    </div>
  );
}

export default FloatingCartBar;