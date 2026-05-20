function MenuItemCard({
  item,
  addToCart,
}) {

  return (

    <div className="
      bg-white
      border
      border-gray-200
      rounded-2xl
      p-5
      flex
      justify-between
      gap-5
    ">

      {/* LEFT */}

      <div className="flex-1">

        <div className="flex items-center gap-2">

          <div className={`
            w-4
            h-4
            rounded-full
            ${item.is_veg
              ? "bg-green-500"
              : "bg-red-500"}
          `} />

          <p className="
            text-sm
            font-medium
            text-gray-500
          ">
            {item.is_veg ? "Veg" : "Non Veg"}
          </p>

        </div>

        <h3 className="
          text-2xl
          font-bold
          mt-3
          text-gray-900
        ">
          {item.name}
        </h3>

        <p className="
          text-gray-500
          mt-2
          leading-relaxed
        ">
          {item.description}
        </p>

        <p className="
          text-xl
          font-bold
          text-orange-500
          mt-4
        ">
          ₹{item.base_price}
        </p>

      </div>

      {/* RIGHT */}

      <div className="
        w-[170px]
        flex
        flex-col
        items-center
      ">

        <img
          src={
            item.image_url ||
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
          }
          alt={item.name}
          className="
            w-full
            h-[130px]
            object-cover
            rounded-2xl
          "
        />

        <button
          onClick={() => addToCart(item)}
          className="
            mt-4
            bg-orange-500
            hover:bg-orange-600
            text-white
            w-full
            py-3
            rounded-xl
            font-semibold
            transition
          "
        >
          Add
        </button>

      </div>

    </div>
  );
}

export default MenuItemCard;