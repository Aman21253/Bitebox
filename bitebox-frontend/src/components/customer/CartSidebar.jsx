function CartSidebar({
  cart,
  increaseQty,
  decreaseQty,
}) {

  const total = cart.reduce(
    (sum, item) =>
      sum + item.base_price * item.quantity,
    0
  );

  return (

    <div className="
      w-[380px]
      bg-white
      border-l
      border-gray-200
      h-screen
      sticky
      top-0
      p-6
      overflow-y-auto
    ">

      <h2 className="
        text-3xl
        font-bold
        mb-6
      ">
        Your Cart
      </h2>

      {
        cart.length === 0 ? (

          <p className="text-gray-500">
            Cart is empty
          </p>

        ) : (

          <div className="space-y-5">

            {
              cart.map((item) => (

                <div
                  key={item.id}
                  className="
                    border
                    border-gray-200
                    rounded-2xl
                    p-4
                  "
                >

                  <h3 className="
                    font-bold
                    text-lg
                  ">
                    {item.name}
                  </h3>

                  <p className="
                    text-orange-500
                    font-semibold
                    mt-1
                  ">
                    ₹{item.base_price}
                  </p>

                  <div className="
                    flex
                    items-center
                    gap-3
                    mt-4
                  ">

                    <button
                      onClick={() =>
                        decreaseQty(item.id)
                      }
                      className="
                        w-8
                        h-8
                        rounded-lg
                        bg-gray-100
                      "
                    >
                      -
                    </button>

                    <span className="font-bold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQty(item.id)
                      }
                      className="
                        w-8
                        h-8
                        rounded-lg
                        bg-gray-100
                      "
                    >
                      +
                    </button>

                  </div>

                </div>
              ))
            }

            {/* TOTAL */}

            <div className="
              border-t
              pt-5
              mt-5
            ">

              <div className="
                flex
                justify-between
                text-xl
                font-bold
              ">

                <span>Total</span>

                <span>
                  ₹{total}
                </span>

              </div>

              <button className="
                mt-5
                w-full
                bg-orange-500
                hover:bg-orange-600
                text-white
                py-4
                rounded-2xl
                font-bold
                text-lg
                transition
              ">
                Checkout
              </button>

            </div>

          </div>

        )
      }

    </div>
  );
}

export default CartSidebar;