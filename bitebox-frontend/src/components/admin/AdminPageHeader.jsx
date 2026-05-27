function AdminPageHeader({

  eyebrow,

  title,

  description,

  action

}) {

  return (

    <div className="
      flex
      flex-col
      lg:flex-row
      lg:items-center
      lg:justify-between
      gap-6
      mb-10
    ">

      <div>

        {
          eyebrow && (

            <p className="
              text-orange-400
              uppercase
              tracking-[3px]
              text-xs
              font-bold
              mb-3
            ">

              {eyebrow}

            </p>
          )
        }

        <h1 className="
          text-4xl
          md:text-5xl
          font-black
          tracking-tight
        ">

          {title}

        </h1>

        {
          description && (

            <p className="
              text-gray-400
              mt-4
              text-lg
              max-w-2xl
            ">

              {description}

            </p>
          )
        }

      </div>

      {action}

    </div>
  );
}

export default AdminPageHeader;