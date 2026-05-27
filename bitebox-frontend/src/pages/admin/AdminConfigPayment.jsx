import { useEffect, useState } from "react";
import {
  Save,
  CreditCard,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import API from "../../api/axios";

import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminCard from "../../components/admin/AdminCard";
import AdminSkeleton from "../../components/admin/AdminSkeleton";

const PROVIDERS = [
  "razorpay",
  "stripe",
  "paytm",
];

const BLANK = {
  provider: "razorpay",
  key_id: "",
  key_secret: "",
  webhook_secret: "",
  is_active: true,
};

function AdminConfigPayment() {

  const [configs, setConfigs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("razorpay");

  const [form, setForm] =
    useState(BLANK);

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

    fetchConfigs();

  }, []);

  const fetchConfigs = async () => {

    try {

      setLoading(true);

      setError("");

      const res =
        await API.get(
          "/admin/config/payment"
        );

      setConfigs(res.data);

      const razorpayConfig =
        res.data.find(
          (c) =>
            c.provider ===
            "razorpay"
        );

      if (razorpayConfig) {

        setForm({

          ...razorpayConfig,

          key_secret: "",

          webhook_secret: "",
        });
      }

    } catch (e) {

      console.log(e);

      setError(
        "Failed to load payment configurations"
      );

    } finally {

      setLoading(false);
    }
  };

  const switchTab = (
    provider
  ) => {

    setActiveTab(provider);

    const existing =
      configs.find(
        (c) =>
          c.provider === provider
      );

    setForm(

      existing

        ? {

            ...existing,

            key_secret: "",

            webhook_secret: "",
          }

        : {

            ...BLANK,

            provider,
          }
    );
  };

  const save = async () => {

    try {

      setSaving(true);

      setSuccess(false);

      setError("");

      await API.put(
        "/admin/config/payment",
        form
      );

      setSuccess(true);

      setTimeout(() => {

        setSuccess(false);

      }, 3000);

      await fetchConfigs();

    } catch (e) {

      console.log(e);

      setError(
        "Failed to save payment configuration"
      );

    } finally {

      setSaving(false);
    }
  };

  return (

    <AdminLayout>

      <AdminPageHeader

        eyebrow="Platform Config"

        title="Payment Gateway Config"

        description="
          Configure payment providers,
          secret keys, webhook signing
          and gateway activation.
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
            height="h-[450px]"
          />

        ) : (

          <div className="
            grid
            grid-cols-1
            xl:grid-cols-3
            gap-6
          ">

            {/* MAIN */}

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
                    PAYMENT SETTINGS
                  </p>

                  <h2 className="
                    text-3xl
                    font-black
                  ">
                    Gateway Credentials
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

                  <CreditCard
                    className="
                      text-orange-400
                    "
                  />

                </div>

              </div>

              {/* TABS */}

              <div className="
                flex
                flex-wrap
                gap-3
                mb-8
              ">

                {
                  PROVIDERS.map((p) => (

                    <button

                      key={p}

                      onClick={() =>
                        switchTab(p)
                      }

                      className={`
                        px-6
                        py-3
                        rounded-2xl
                        font-bold
                        capitalize
                        transition-all

                        ${
                          activeTab === p

                            ? `
                              bg-orange-500
                              text-white
                            `

                            : `
                              bg-white/[0.05]
                              text-gray-300
                              hover:bg-white/[0.08]
                            `
                        }
                      `}
                    >

                      {p}

                      {
                        configs.find(
                          (c) =>
                            c.provider === p
                        ) && (

                          <span className="
                            ml-2
                            text-xs
                          ">
                            ✓
                          </span>
                        )
                      }

                    </button>
                  ))
                }

              </div>

              {/* FORM */}

              <div className="
                space-y-5
              ">

                <div>

                  <label className="
                    block
                    text-sm
                    text-gray-400
                    mb-2
                  ">
                    Key ID
                  </label>

                  <input

                    value={form.key_id}

                    onChange={(e) =>
                      setForm({

                        ...form,

                        key_id:
                          e.target.value,
                      })
                    }

                    placeholder="
                      Enter key ID
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
                      focus:border-orange-500
                    "
                  />

                </div>

                <div>

                  <label className="
                    block
                    text-sm
                    text-gray-400
                    mb-2
                  ">
                    Secret Key
                  </label>

                  <input

                    type="password"

                    value={form.key_secret}

                    onChange={(e) =>
                      setForm({

                        ...form,

                        key_secret:
                          e.target.value,
                      })
                    }

                    placeholder="
                      Enter secret key
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
                      focus:border-orange-500
                    "
                  />

                </div>

                <div>

                  <label className="
                    block
                    text-sm
                    text-gray-400
                    mb-2
                  ">
                    Webhook Secret
                  </label>

                  <input

                    type="password"

                    value={
                      form.webhook_secret
                    }

                    onChange={(e) =>
                      setForm({

                        ...form,

                        webhook_secret:
                          e.target.value,
                      })
                    }

                    placeholder="
                      Optional webhook secret
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
                      focus:border-orange-500
                    "
                  />

                </div>

                <div className="
                  pt-4
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

                      checked={
                        form.is_active
                      }

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

                    Enable Payment Gateway

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

                        : `Save ${activeTab} Config`
                    }

                  </button>

                </div>

              </div>

            </AdminCard>

            {/* SIDE */}

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
                    SECURITY
                  </p>

                  <h2 className="
                    text-3xl
                    font-black
                  ">
                    Payment Tips
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

                  <ShieldCheck
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

                  <div className="
                    flex
                    items-center
                    gap-3
                    mb-3
                  ">

                    <Wallet
                      size={18}
                      className="
                        text-orange-400
                      "
                    />

                    <h3 className="
                      font-bold
                    ">
                      Live Payments
                    </h3>

                  </div>

                  <p className="
                    text-sm
                    text-gray-400
                    leading-relaxed
                  ">
                    Activate only one
                    primary gateway in
                    production for stable
                    transactions.
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
                    Webhook Validation
                  </h3>

                  <p className="
                    text-sm
                    text-gray-400
                    leading-relaxed
                  ">
                    Configure webhook
                    secrets to securely
                    validate incoming
                    payment events.
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
                    Secret Keys
                  </h3>

                  <p className="
                    text-sm
                    text-gray-400
                    leading-relaxed
                  ">
                    Never expose payment
                    gateway secret keys
                    on the frontend.
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

export default AdminConfigPayment;