import RestaurantSidebar from "../components/restaurant/RestaurantSidebar";

function RestaurantLayout({
  children,
}) {

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
      flex
    ">

      {/* SIDEBAR */}

      <RestaurantSidebar />

      {/* MAIN CONTENT */}

      <div className="
        flex-1
        overflow-y-auto
      ">

        {children}

      </div>

    </div>
  );
}

export default RestaurantLayout;