import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RestaurantCard({ restaurant }) {

  const navigate = useNavigate();

  return (

    <div
      onClick={() =>
        navigate(`/restaurants/${restaurant.id}`)
      }
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
        src={
          restaurant.image_url ||
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
        }
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

        <div className="
          flex
          items-center
          justify-between
          mt-4
        ">

          <p className="
            text-gray-700
            font-medium
          ">
            ⏱ {restaurant.delivery_time}
          </p>

          <p className="
            text-orange-500
            font-semibold
          ">
            ₹{restaurant.delivery_fee} delivery
          </p>

        </div>

      </div>

    </div>
  );
}

export default RestaurantCard;