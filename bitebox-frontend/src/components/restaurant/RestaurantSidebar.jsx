import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function RestaurantSidebar() {

  const location = useLocation();

  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/restaurant/dashboard",
    },
    {
      title: "Orders",
      icon: ClipboardList,
      path: "/restaurant/orders",
    },
    {
      title: "Menu",
      icon: UtensilsCrossed,
      path: "/restaurant/menu",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      path: "/restaurant/analytics",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/restaurant/settings",
    },
  ];

  // LOGOUT

  const handleLogout = () => {

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };

  return (

    <div className="
      w-[290px]
      min-h-screen
      bg-black/30
      backdrop-blur-2xl
      border-r
      border-white/10
      p-6
      flex
      flex-col
      justify-between
    ">

      {/* TOP */}

      <div>

        {/* LOGO */}

        <div>

          <h1 className="
            text-4xl
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

          <p className="
            text-gray-500
            mt-2
          ">
            Restaurant Portal
          </p>

        </div>

        {/* MENU */}

        <div className="
          mt-12
          space-y-3
        ">

          {
            menuItems.map((item) => {

              const Icon = item.icon;

              const isActive =
                location.pathname ===
                item.path;

              return (

                <Link
                  key={item.title}
                  to={item.path}
                  className={`
                    w-full
                    flex
                    items-center
                    gap-4
                    px-5
                    py-4
                    rounded-2xl
                    transition-all
                    duration-300
                    ${
                      isActive
                      ? `
                        bg-orange-500
                        text-white
                        shadow-lg
                        shadow-orange-500/20
                      `
                      : `
                        hover:bg-white/5
                        text-gray-300
                      `
                    }
                  `}
                >

                  <Icon size={22} />

                  <span className="
                    font-semibold
                    text-[15px]
                  ">
                    {item.title}
                  </span>

                </Link>
              );
            })
          }

        </div>

      </div>

      {/* LOGOUT BUTTON */}

      <button
        onClick={handleLogout}
        className="
          w-full
          h-14
          rounded-2xl
          bg-red-500/10
          border
          border-red-500/20
          text-red-300
          font-bold
          flex
          items-center
          justify-center
          gap-3
          hover:bg-red-500/20
          transition-all
          duration-300
        "
      >

        <LogOut size={20} />

        Logout

      </button>

    </div>
  );
}

export default RestaurantSidebar;