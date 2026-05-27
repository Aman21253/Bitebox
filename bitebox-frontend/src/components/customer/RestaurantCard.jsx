import {
  Star,
  Clock3,
  Bike,
  ChevronRight,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

function RestaurantCard({ restaurant }) {

  const navigate = useNavigate();

  return (

    <div
      onClick={() =>
        navigate(
          `/restaurants/${restaurant.id}`
        )
      }
      className="
        group
        relative
        overflow-hidden
        rounded-[34px]
        border
        border-white/10
        bg-[#0f1725]/90
        backdrop-blur-2xl
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-orange-500/40
        hover:shadow-[0_25px_80px_rgba(249,115,22,0.18)]
        cursor-pointer
      "
    >

      {/* GLOW */}

      <div className="
        absolute
        inset-0
        opacity-0
        group-hover:opacity-100
        transition-all
        duration-700
        bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_40%)]
        pointer-events-none
      " />

      {/* IMAGE */}

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
            h-[270px]
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

        {/* OVERLAY */}

        <div className="
          absolute
          inset-0
          bg-gradient-to-t
          from-[#070b14]
          via-black/20
          to-transparent
        " />

        {/* TOP BADGES */}

        <div className="
          absolute
          top-4
          left-4
          right-4
          flex
          items-start
          justify-between
        ">

          {/* BESTSELLER */}

          <div className="
            px-4
            py-2
            rounded-2xl
            bg-orange-500
            text-white
            text-xs
            font-black
            tracking-wide
            shadow-lg
            shadow-orange-500/30
          ">
            BESTSELLER
          </div>

          {/* RATING */}

          <div className="
            flex
            items-center
            gap-1.5
            px-3
            py-2
            rounded-2xl
            bg-black/40
            backdrop-blur-xl
            border
            border-white/10
            text-white
            font-bold
            text-sm
          ">

            <Star
              size={15}
              className="
                text-orange-400
                fill-orange-400
              "
            />

            {restaurant.rating || "4.5"}

          </div>

        </div>

        {/* BOTTOM INFO */}

        <div className="
          absolute
          bottom-4
          left-4
          right-4
          flex
          items-center
          justify-between
        ">

          {/* DELIVERY TIME */}

          <div className="
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded-2xl
            bg-black/40
            backdrop-blur-xl
            border
            border-white/10
          ">

            <Clock3
              size={15}
              className="
                text-orange-400
              "
            />

            <p className="
              text-sm
              font-bold
              text-white
            ">
              {restaurant.delivery_time || "30-40 min"}
            </p>

          </div>

          {/* DELIVERY */}

          <div className="
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded-2xl
            bg-green-500/15
            border
            border-green-500/20
            backdrop-blur-xl
          ">

            <Bike
              size={15}
              className="
                text-green-400
              "
            />

            <p className="
              text-sm
              font-bold
              text-green-300
            ">
              Fast Delivery
            </p>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="
        p-6
      ">

        {/* NAME */}

        <div className="
          mb-5
        ">

          <div className="
            flex
            items-start
            justify-between
            gap-4
          ">

            <div>

              <h2 className="
                text-[28px]
                leading-tight
                font-black
                text-white
                break-words
                transition-all
                duration-300
                group-hover:text-orange-300
              ">
                {restaurant.name}
              </h2>

              <p className="
                mt-2
                text-gray-400
                text-[15px]
                leading-6
              ">
                {restaurant.cuisine}
              </p>

            </div>

            <ChevronRight
              size={22}
              className="
                text-gray-600
                transition-all
                duration-300
                group-hover:text-orange-400
                group-hover:translate-x-1
                shrink-0
              "
            />

          </div>

        </div>

        {/* INFO STRIP */}

        <div className="
          flex
          items-center
          justify-between
          gap-4
          pt-5
          border-t
          border-white/10
        ">

          <div>

            <p className="
              text-gray-500
              text-xs
              uppercase
              tracking-[2px]
              mb-1
            ">
              Delivery Fee
            </p>

            <h3 className="
              text-orange-400
              font-black
              text-2xl
            ">
              ₹{restaurant.delivery_fee || 0}
            </h3>

          </div>

          <div className="
            text-right
          ">

            <p className="
              text-gray-500
              text-xs
              uppercase
              tracking-[2px]
              mb-1
            ">
              Status
            </p>

            <div className="
              inline-flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-full
              bg-green-500/10
              border
              border-green-500/20
            ">

              <div className="
                w-2
                h-2
                rounded-full
                bg-green-400
                animate-pulse
              " />

              <span className="
                text-sm
                font-bold
                text-green-300
              ">
                Open
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RestaurantCard;