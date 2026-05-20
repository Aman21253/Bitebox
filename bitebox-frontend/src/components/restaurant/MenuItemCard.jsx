import {
  Vegan,
  Drumstick,
  Clock3,
} from "lucide-react";

function MenuItemCard({
  item,
  toggleAvailability,
}) {

  return (

    <div className="
      bg-white/[0.03]
      border
      border-white/10
      rounded-[36px]
      overflow-hidden
    ">

      <img
        src={
          item.image_url ||
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
        }
        alt={item.name}
        className="
          w-full
          h-[260px]
          object-cover
        "
      />

      <div className="p-7">

        <div className="
          flex
          items-start
          justify-between
          mb-5
        ">

          <div>

            <h2 className="
              text-3xl
              font-black
            ">
              {item.name}
            </h2>

            <p className="
              text-gray-400
              mt-2
            ">
              {item.description}
            </p>

          </div>

          {
            item.is_veg ? (

              <Vegan
                className="
                  text-green-400
                "
              />

            ) : (

              <Drumstick
                className="
                  text-red-400
                "
              />

            )
          }

        </div>

        <div className="
          flex
          items-center
          justify-between
          mb-6
        ">

          <h3 className="
            text-4xl
            font-black
            text-orange-400
          ">
            ₹{item.base_price}
          </h3>

          <div className="
            flex
            items-center
            gap-2
            text-gray-400
          ">

            <Clock3 size={16} />

            {item.preparation_time}m

          </div>

        </div>

        <button
          onClick={() =>
            toggleAvailability(
              item.id
            )
          }
          className={`
            w-full
            h-14
            rounded-2xl
            font-bold
            ${
              item.is_available
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
            }
          `}
        >

          {
            item.is_available
            ? "Available"
            : "Unavailable"
          }

        </button>

      </div>

    </div>
  );
}

export default MenuItemCard;