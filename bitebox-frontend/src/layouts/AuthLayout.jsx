function AuthLayout({ children }) {

  return (

    <div className="min-h-screen flex bg-[#f5f5f5]">

      {/* LEFT */}

      <div className="hidden lg:flex w-1/2 bg-orange-500 text-white flex-col justify-center px-20">

        <h1 className="text-7xl font-extrabold mb-6">
          BiteBox
        </h1>

        <h2 className="text-6xl font-bold leading-tight mb-6">
          Delicious food
          <br />
          delivered fast
        </h2>

        <p className="text-2xl text-orange-100 leading-relaxed max-w-lg">
          India's next generation food delivery platform.
        </p>

      </div>

      {/* RIGHT */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">

        {children}

      </div>

    </div>
  );
}

export default AuthLayout;