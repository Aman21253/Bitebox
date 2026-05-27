function MenuItemSkeleton() {

  return (

    <div className="
      animate-pulse

      rounded-[36px]

      overflow-hidden

      border
      border-white/10

      bg-white/[0.03]
    ">

      {/* IMAGE */}

      <div className="
        h-[220px]
        md:h-[260px]

        bg-white/10
      " />

      {/* CONTENT */}

      <div className="
        p-5
        md:p-7
      ">

        <div className="
          h-8
          rounded-xl
          bg-white/10
          mb-4
        " />

        <div className="
          h-4
          rounded-lg
          bg-white/10
          mb-2
        " />

        <div className="
          h-4
          w-2/3
          rounded-lg
          bg-white/10
          mb-6
        " />

        <div className="
          flex
          justify-between
          items-center
        ">

          <div className="
            h-8
            w-24
            rounded-xl
            bg-white/10
          " />

          <div className="
            h-12
            w-32
            rounded-2xl
            bg-white/10
          " />

        </div>

      </div>

    </div>
  );
}

export default MenuItemSkeleton;