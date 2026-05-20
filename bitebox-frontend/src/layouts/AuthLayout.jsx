function AuthLayout({ children }) {

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
      flex
      overflow-hidden
    ">

      {/* LEFT */}

      <div className="
        hidden
        lg:flex
        w-1/2
        relative
        overflow-hidden
        border-r
        border-white/10
        bg-gradient-to-br
        from-[#0f172a]
        via-[#111827]
        to-black
      ">

        {/* ORANGE GLOW */}

        <div className="
          absolute
          top-[-120px]
          left-[-100px]
          w-[420px]
          h-[420px]
          rounded-full
          bg-orange-500/20
          blur-[130px]
        " />

        {/* BLUE GLOW */}

        <div className="
          absolute
          bottom-[-140px]
          right-[-100px]
          w-[350px]
          h-[350px]
          rounded-full
          bg-blue-500/10
          blur-[120px]
        " />

        {/* CONTENT */}

        <div className="
          relative
          z-10
          flex
          flex-col
          justify-between
          p-16
          w-full
        ">

          {/* TOP */}

          <div>

            <h1 className="
              text-5xl
              font-black
              tracking-tight
              bg-gradient-to-r
              from-orange-400
              via-orange-500
              to-red-500
              bg-clip-text
              text-transparent
            ">
              BiteBox
            </h1>

          </div>

          {/* CENTER */}

          <div className="
            max-w-[580px]
          ">

            <p className="
              text-orange-400
              uppercase
              tracking-[4px]
              text-sm
              font-bold
              mb-6
            ">
              Premium Food Delivery
            </p>

            <h2 className="
              text-7xl
              leading-[0.95]
              font-black
              tracking-[-3px]
            ">
              Discover
              food you'll
              love.
            </h2>

            <p className="
              mt-8
              text-xl
              text-gray-400
              leading-relaxed
              max-w-[520px]
            ">
              Experience lightning-fast delivery,
              top-rated restaurants, and a premium
              ordering experience.
            </p>

          </div>

          {/* BOTTOM CARD */}

          <div className="
            w-full
            max-w-[420px]
            bg-white/[0.05]
            backdrop-blur-2xl
            border
            border-white/10
            rounded-[32px]
            p-6
          ">

            <p className="
              text-2xl
              font-black
            ">
              4.9 ★ Rating
            </p>

            <p className="
              text-gray-400
              mt-2
              leading-relaxed
            ">
              Trusted by thousands of food lovers
              across the country.
            </p>

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div className="
        flex-1
        flex
        items-center
        justify-center
        px-5
        py-10
      ">

        {children}

      </div>

    </div>
  );
}

export default AuthLayout;