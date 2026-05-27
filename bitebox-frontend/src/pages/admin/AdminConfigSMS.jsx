import { useEffect, useState } from "react";
import {
  Save,
  Smartphone,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

import API from "../../api/axios";

import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminCard from "../../components/admin/AdminCard";
import AdminSkeleton from "../../components/admin/AdminSkeleton";

const BLANK = {
  provider: "msg91",
  api_key: "",
  sender_id: "",
  is_active: true,
};

function AdminConfigSMS() {

  const [form, setForm] =
    useState(BLANK);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

    fetchSMSConfig();

  }, []);

  const fetchSMSConfig =
    async () => {

      try {

        setLoading(true);

        setError("");

        const res =
          await API.get(
            "/admin/config/sms"
          );

        setForm({

          ...res.data,

          api_key: "",
        });

      } catch (e) {

        console.log(e);

        setError(
          "Failed to load SMS configuration"
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
        "/admin/config/sms",
        form
      );

      setSuccess(true);

      setTimeout(() => {

        setSuccess(false);

      }, 3000);

    } catch (e) {

      console.log(e);

      setError(
        "Failed to save SMS configuration"
      );

    } finally {

      setSaving(false);
    }
  };

  return (

    <AdminLayout>

      <AdminPageHeader

        eyebrow="Platform Config"

        title="SMS Configuration"

        description="
          Manage SMS providers,
          OTP delivery settings and
          messaging credentials.
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
              text-gray-300
              text-sm
            ">
              {error}
            </p>

          </div>
        )
      }

      {
        loading ? (

          <AdminSkeleton
            height="h-[420px]"
          />

        ) : (

          <div className="
            grid
            grid-cols-1
            xl:grid-cols-3
            gap-6
          ">

            {/* MAIN FORM */}

            <AdminCard
              className="
                xl:col-span-2
              "
            >

              <div className="
                flex
                items-center
                justify-between
                mb-8
              ">

                <div>

                  <p className="
                    text-orange-400
                    text-sm
                    font-semibold
                    mb-2
                  ">
                    SMS SETTINGS
                  </p>

                  <h2 className="
                    text-3xl
                    font-black
                  ">
                    SMS Credentials
                  </h2>

                </div>

                <div className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-orange-500/10
                  flex
                  items-center
                  justify-center
                ">

                  <Smartphone
                    className="
                      text-orange-400
                    "
                  />

                </div>

              </div>

              <div className="
                space-y-5
              ">

                {/* PROVIDER */}

                <div>

                  <label className="
                    block
                    text-sm
                    text-gray-400
                    mb-2
                  ">
                    SMS Provider
                  </label>

                  <select

                    value={form.provider}

                    onChange={(e) =>
                      setForm({

                        ...form,

                        provider:
                          e.target.value,
                      })
                    }

                    className="
                      w-full
                      h-12
                      rounded-2xl
                      bg-white/[0.04]
                      border
                      border-white/10
                      px-5
                      outline-none
                      transition-all
                      focus:border-orange-500
                    "
                  >

                    <option value="msg91">
                      MSG91
                    </option>

                    <option value="twilio">
                      Twilio
                    </option>

                    <option value="fast2sms">
                      Fast2SMS
                    </option>

                  </select>

                </div>

                {/* API KEY */}

                <div>

                  <label className="
                    block
                    text-sm
                    text-gray-400
                    mb-2
                  ">
                    API Key
                  </label>

                  <input

                    type="password"

                    value={form.api_key}

                    onChange={(e) =>
                      setForm({

                        ...form,

                        api_key:
                          e.target.value,
                      })
                    }

                    placeholder="
                      Enter API key
                    "

                    className="
                      w-full
                      h-12
                      rounded-2xl
                      bg-white/[0.04]
                      border
                      border-white/10
                      px-5
                      outline-none
                      transition-all
                      focus:border-orange-500
                    "
                  />

                </div>

                {/* SENDER ID */}

                <div>

                  <label className="
                    block
                    text-sm
                    text-gray-400
                    mb-2
                  ">
                    Sender ID
                  </label>

                  <input

                    value={form.sender_id}

                    onChange={(e) =>
                      setForm({

                        ...form,

                        sender_id:
                          e.target.value,
                      })
                    }

                    placeholder="BTEBOX"

                    className="
                      w-full
                      h-12
                      rounded-2xl
                      bg-white/[0.04]
                      border
                      border-white/10
                      px-5
                      outline-none
                      transition-all
                      focus:border-orange-500
                    "
                  />

                </div>

                {/* ACTIVE */}

                <div className="
                  pt-3
                  border-t
                  border-white/10
                  flex
                  flex-col
                  md:flex-row
                  md:items-center
                  md:justify-between
                  gap-5
                ">

                  <label className="
                    flex
                    items-center
                    gap-3
                    text-sm
                    text-gray-300
                  ">

                    <input

                      type="checkbox"

                      checked={form.is_active}

                      onChange={(e) =>
                        setForm({

                          ...form,

                          is_active:
                            e.target.checked,
                        })
                      }

                      className="
                        w-4
                        h-4
                        accent-orange-500
                      "
                    />

                    Enable SMS Service

                  </label>

                  <button

                    onClick={save}

                    disabled={saving}

                    className="
                      h-14
                      px-8
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
                        ? "✓ Saved Successfully"
                        : "Save SMS Config"
                    }

                  </button>

                </div>

              </div>

            </AdminCard>

            {/* SIDE PANEL */}

            <AdminCard>

              <div className="
                flex
                items-center
                justify-between
                mb-8
              ">

                <div>

                  <p className="
                    text-green-400
                    text-sm
                    font-semibold
                    mb-2
                  ">
                    DELIVERY INFO
                  </p>

                  <h2 className="
                    text-3xl
                    font-black
                  ">
                    SMS Tips
                  </h2>

                </div>

                <div className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-green-500/10
                  flex
                  items-center
                  justify-center
                ">

                  <MessageSquare
                    className="
                      text-green-400
                    "
                  />

                </div>

              </div>

              <div className="
                space-y-5
              ">

                <div className="
                  rounded-2xl
                  bg-white/[0.03]
                  border
                  border-white/10
                  p-5
                ">

                  <h3 className="
                    font-bold
                    mb-2
                  ">
                    OTP Delivery
                  </h3>

                  <p className="
                    text-sm
                    text-gray-400
                    leading-relaxed
                  ">
                    SMS service powers
                    OTP verification,
                    delivery confirmation
                    and order updates.
                  </p>

                </div>

                <div className="
                  rounded-2xl
                  bg-white/[0.03]
                  border
                  border-white/10
                  p-5
                ">

                  <h3 className="
                    font-bold
                    mb-2
                  ">
                    Approved Sender ID
                  </h3>

                  <p className="
                    text-sm
                    text-gray-400
                    leading-relaxed
                  ">
                    Use an approved sender
                    ID from your SMS
                    provider for better
                    delivery rates.
                  </p>

                </div>

                <div className="
                  rounded-2xl
                  bg-white/[0.03]
                  border
                  border-white/10
                  p-5
                ">

                  <div className="
                    flex
                    items-center
                    gap-3
                    mb-3
                  ">

                    <ShieldCheck
                      size={18}
                      className="
                        text-green-400
                      "
                    />

                    <h3 className="
                      font-bold
                    ">
                      Secure Storage
                    </h3>

                  </div>

                  <p className="
                    text-sm
                    text-gray-400
                    leading-relaxed
                  ">
                    API keys are stored
                    securely. Never share
                    provider credentials
                    publicly.
                  </p>
                </div>
              </div>
            </AdminCard>
          </div>
        )
      }
    </AdminLayout>
  );
}

export default AdminConfigSMS;