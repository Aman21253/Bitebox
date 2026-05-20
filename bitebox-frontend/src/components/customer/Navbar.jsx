import {
  Search,
  ShoppingCart,
} from "lucide-react";

function Navbar({ user, logout }) {

  return (

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

          <button
            onClick={logout}
            className="
              bg-orange-500
              hover:bg-orange-600
              text-white
              px-7
              py-3
              rounded-xl
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
  );
}

export default Navbar;