import { useState } from "react";

import AdminSidebar from "./AdminSidebar";

import { Menu } from "lucide-react";

function AdminLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
      flex
    ">

      {/* DESKTOP SIDEBAR */}

      <div className="
        hidden
        lg:block
      ">

        <AdminSidebar />

      </div>

      {/* MOBILE SIDEBAR */}

      {
        sidebarOpen && (

          <div className="
            fixed
            inset-0
            z-50
            flex
          ">

            <div
              className="
                absolute
                inset-0
                bg-black/70
                backdrop-blur-sm
              "
              onClick={() =>
                setSidebarOpen(false)
              }
            />

            <div className="
              relative
              z-50
            ">
              <AdminSidebar
                mobile
                closeSidebar={() =>
                  setSidebarOpen(false)
                }
              />
            </div>

          </div>
        )
      }

      {/* CONTENT */}

      <div className="
        flex-1
        overflow-x-hidden
      ">

        {/* MOBILE TOPBAR */}

        <div className="
          lg:hidden
          h-16
          border-b
          border-white/10
          flex
          items-center
          px-5
          sticky
          top-0
          z-40
          bg-[#070b14]/90
          backdrop-blur-xl
        ">

          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="
              w-11
              h-11
              rounded-xl
              bg-white/5
              border
              border-white/10
              flex
              items-center
              justify-center
            "
          >

            <Menu size={20} />

          </button>

        </div>

        <div className="
          p-5
          md:p-8
          lg:p-10
        ">

          {children}

        </div>

      </div>

    </div>
  );
}

export default AdminLayout;