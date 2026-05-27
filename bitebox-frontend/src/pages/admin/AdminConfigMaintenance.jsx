import { useEffect, useState } from "react";
import {
  Save,
  AlertTriangle,
  ShieldAlert,
  Wrench,
} from "lucide-react";

import API from "../../api/axios";

import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminCard from "../../components/admin/AdminCard";
import AdminSkeleton from "../../components/admin/AdminSkeleton";

function AdminConfigMaintenance() {

  const [isActive, setIsActive] =
    useState(false);

  const [message, setMessage] =
    useState(
      "Platform is under maintenance. Please try again later."
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

    fetchMaintenance();

  }, []);

  const fetchMaintenance =
    async () => {

      try {

        setLoading(true);

        setError("");

        const res =
          await API.get(
            "/admin/config/maintenance"
          );

        setIsActive(
          res.data.is_active
        );

        if (
          res.data.message?.value
        ) {

          setMessage(
            res.data.message.value
          );
        }

      } catch (e) {

        console.log(e);

        setError(
          "Failed to load maintenance settings"
        );

      } finally {

        setLoading(false);
      }
    };

  const save = async () => {

    try {

      setSaving(true);

      setSuccess(false);

      setError("");

      await API.put(
        "/admin/config/maintenance",
        {
          is_active:
            isActive,
          message,
        }
      );

      setSuccess(true);

      setTimeout(() => {

        setSuccess(false);

      }, 3000);

    } catch (e) {

      console.log(e);

      setError(
        "Failed to save maintenance settings"
      );

    } finally {

      setSaving(false);
    }
  };

  return (

    <AdminLayout>

      <AdminPageHeader

        eyebrow="
          Platform Config
        "

        title="
          Maintenance Mode
        "

        description="
          Temporarily disable user
          access and display a custom
          maintenance message across
          the platform.
        "
      />

      {
        error && (

          <div className="
            mb-6
            rounded-3xl
            border
            border-red-500/20
            bg-red-500/10
            p-5
          ">

            <p className="
              text-red-400
              font-semibold
              mb-1
            ">
              Something went wrong
            </p>

            <p className="
              text-sm
              text-gray-300
            ">
              {error}
            </p>

          </div>
        )
      }

      {
        isActive && !loading && (

          <div className="
            mb-8
            rounded-3xl
            border
            border-red-500/20
            bg-red-500/10
            p-6
            flex
            items-start
            gap-4
          ">

            <div className="
              w-12
              h-12
              rounded-2xl
              bg-red-500/20
              flex
              items-center
              justify-center
              shrink-0
            ">

              <AlertTriangle
                className="
                  text-red-400
                "
              />

            </div>

            <div>

              <h2 className="
                text-xl
                font-black
                text-red-300
                mb-2
              ">
                Maintenance Mode Active
              </h2>

              <p className="
                text-sm
                text-red-200/80
                leading-relaxed
              ">
                The platform is currently
                inaccessible to customers,
                restaurants and drivers.
              </p>

            </div>

          </div>
        )
      }

      {
        loading ? (

          <AdminSkeleton
            height="
              h-[420px]
            "
          />

        ) : (

          <AdminCard>

            <div className="
              flex
              flex-col
              xl:flex-row
              xl:items-start
              gap-8
            ">

              {/* LEFT */}

              <div className="
                flex-1
              ">

                <div className="
                  flex
                  items-center
                  gap-4
                  mb-8
                ">

                  <div className="
                    w-16
                    h-16
                    rounded-3xl
                    bg-orange-500/10
                    flex
                    items-center
                    justify-center
                  ">

                    <Wrench
                      className="
                        text-orange-400
                      "
                    />

                  </div>

                  <div>

                    <p className="
                      text-orange-400
                      font-semibold
                      mb-1
                    ">
                      SYSTEM CONTROL
                    </p>

                    <h2 className="
                      text-3xl
                      font-black
                    ">
                      Maintenance Settings
                    </h2>

                  </div>

                </div>

                {/* TOGGLE */}

                <div className="
                  rounded-3xl
                  bg-white/[0.03]
                  border
                  border-white/10
                  p-6
                  mb-6
                ">

                  <div className="
                    flex
                    items-center
                    justify-between
                    gap-5
                  ">

                    <div>

                      <h3 className="
                        text-xl
                        font-black
                        mb-2
                      ">
                        Enable Maintenance
                      </h3>

                      <p className="
                        text-sm
                        text-gray-400
                        leading-relaxed
                      ">
                        Prevents all users
                        from accessing the
                        application until
                        maintenance mode is
                        disabled.
                      </p>

                    </div>

                    <button

                      onClick={() =>
                        setIsActive(
                          !isActive
                        )
                      }

                      className={`
                        relative
                        w-16
                        h-8
                        rounded-full
                        transition-all
                        duration-300

                        ${
                          isActive

                            ? "bg-red-500"

                            : "bg-white/10"
                        }
                      `}
                    >

                      <span className={`
                        absolute
                        top-1
                        w-6
                        h-6
                        rounded-full
                        bg-white
                        transition-all
                        duration-300

                        ${
                          isActive

                            ? "left-9"

                            : "left-1"
                        }
                      `} />

                    </button>

                  </div>

                </div>

                {/* MESSAGE */}

                <div className="
                  rounded-3xl
                  bg-white/[0.03]
                  border
                  border-white/10
                  p-6
                ">

                  <label className="
                    block
                    text-sm
                    text-gray-400
                    mb-3
                  ">
                    User-facing Message
                  </label>

                  <textarea

                    rows={5}

                    value={message}

                    onChange={(e) =>
                      setMessage(
                        e.target.value
                      )
                    }

                    className="
                      w-full
                      rounded-2xl
                      bg-white/[0.04]
                      border
                      border-white/10
                      px-5
                      py-4
                      outline-none
                      focus:border-orange-500
                      resize-none
                      transition-all
                    "
                  />

                  <p className="
                    text-xs
                    text-gray-500
                    mt-3
                  ">
                    This message will be
                    displayed publicly while
                    maintenance mode is
                    enabled.
                  </p>

                </div>

              </div>

              {/* RIGHT */}

              <div className="
                xl:w-[320px]
              ">

                <div className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  p-6
                  sticky
                  top-6
                ">

                  <div className="
                    flex
                    items-center
                    gap-3
                    mb-5
                  ">

                    <div className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-blue-500/10
                      flex
                      items-center
                      justify-center
                    ">

                      <ShieldAlert
                        className="
                          text-blue-400
                        "
                      />

                    </div>

                    <div>

                      <p className="
                        text-sm
                        text-gray-400
                      ">
                        Current Status
                      </p>

                      <h3 className="
                        text-2xl
                        font-black
                      ">

                        {
                          isActive

                            ? "Offline"

                            : "Operational"
                        }

                      </h3>

                    </div>

                  </div>

                  <div className={`
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    border
                    mb-6

                    ${
                      isActive

                        ? `
                          bg-red-500/10
                          text-red-300
                          border-red-500/20
                        `

                        : `
                          bg-green-500/10
                          text-green-300
                          border-green-500/20
                        `
                    }
                  `}>

                    {
                      isActive

                        ? "Platform access is blocked"

                        : "Platform running normally"
                    }

                  </div>

                  <button

                    onClick={save}

                    disabled={saving}

                    className="
                      w-full
                      h-14
                      rounded-2xl
                      bg-orange-500
                      hover:bg-orange-400
                      transition-all
                      font-bold
                      flex
                      items-center
                      justify-center
                      gap-3
                      disabled:opacity-50
                    "
                  >

                    <Save size={18} />

                    {
                      saving

                        ? "Saving..."

                        : success

                          ? "✓ Saved!"

                          : "Save Settings"
                    }

                  </button>

                </div>

              </div>

            </div>

          </AdminCard>
        )
      }

    </AdminLayout>
  );
}

export default AdminConfigMaintenance;