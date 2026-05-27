function AdminStatCard({

  icon,

  title,

  value,

  valueColor = "text-white"

}) {

  return (

    <div className="
      bg-white/[0.03]
      border
      border-white/10
      rounded-[30px]
      p-7
      hover:bg-white/[0.05]
      transition-all
      duration-300
    ">

      <div className="
        flex
        items-center
        gap-4
      ">

        <div className="
          w-14
          h-14
          rounded-2xl
          bg-white/5
          flex
          items-center
          justify-center
        ">

          {icon}

        </div>

        <div>

          <p className="
            text-gray-400
            mb-1
          ">

            {title}

          </p>

          <h2 className={`
            text-4xl
            font-black
            ${valueColor}
          `}>

            {value}

          </h2>

        </div>

      </div>

    </div>
  );
}

export default AdminStatCard;