// FILE: src/components/admin/AdminEmptyState.jsx

function AdminEmptyState({

  icon: Icon,

  title,

  description,

  button

}) {

  return (

    <div className="
      bg-white/[0.03]
      border
      border-dashed
      border-white/10
      rounded-[35px]
      p-12
      text-center
    ">

      <div className="
        flex
        justify-center
        mb-6
      ">

        <div className="
          w-20
          h-20
          rounded-full
          bg-white/5
          flex
          items-center
          justify-center
        ">

          {
            Icon && (
              <Icon
                size={40}
                className="
                  text-orange-400
                "
              />
            )
          }

        </div>

      </div>

      <h2 className="
        text-3xl
        font-black
        mb-4
        text-white
      ">

        {title}

      </h2>

      <p className="
        text-gray-400
        max-w-xl
        mx-auto
        mb-8
        leading-relaxed
      ">

        {description}

      </p>

      {button}

    </div>
  );
}

export default AdminEmptyState;