// FILE: src/components/customer/RestaurantCard.jsx

import {
  Star,
  Clock3,
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
        h-full
      "
    >

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
            h-[250px]
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
          from-black/80
          via-black/10
          to-transparent
        " />

        {/* RATING */}

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

        {/* DELIVERY TAG */}

        <div className="
          absolute
          bottom-4
          left-4
          bg-black/40
          backdrop-blur-xl
          border
          border-white/10
          px-3
          py-2
          rounded-2xl
          flex
          items-center
          gap-2
        ">

          <Clock3
            size={14}
            className="
              text-orange-400
            "
          />

          <p className="
            text-sm
            font-semibold
            text-white
          ">
            {restaurant.delivery_time}
          </p>

        </div>

      </div>

      {/* CONTENT */}

      <div className="
        p-6
        flex
        flex-col
        gap-5
      ">

        {/* NAME */}

        <div>

          <h2 className="
            text-2xl
            font-black
            leading-tight
            text-white
            break-words
          ">
            {restaurant.name}
          </h2>

          <p className="
            text-gray-400
            mt-2
            text-base
            break-words
          ">
            {restaurant.cuisine}
          </p>

        </div>

        {/* FOOTER */}

        <div className="
          flex
          items-center
          justify-between
          gap-4
        ">

          <div className="
            flex
            items-center
            gap-2
            text-gray-300
            text-sm
          ">

            🚚 Fast Delivery

          </div>

          <div className="
            text-orange-400
            font-black
            text-lg
            shrink-0
          ">

            ₹{restaurant.delivery_fee}

          </div>

        </div>

      </div>

    </div>
  );
}

export default RestaurantCard;