import { useEffect, useState } from "react";
import { Save, Mail, ShieldCheck } from "lucide-react";
import API from "../../api/axios";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminCard from "../../components/admin/AdminCard";
import AdminSkeleton from "../../components/admin/AdminSkeleton";

const BLANK = {
  host: "",
  port: 587,
  username: "",
  password: "",
  from_email: "",
  from_name: "",
  use_tls: true,
};

function AdminConfigSMTP() {
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSMTP();
  }, []);

  const fetchSMTP = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/admin/config/smtp");

      setForm({
        ...res.data,
        password: "",
      });

    } catch (e) {
      console.log(e);
      setError("Failed to load SMTP configuration");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      setSaving(true);
      setSuccess(false);
      setError("");

      await API.put("/admin/config/smtp", form);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (e) {
      console.log(e);
      setError("Failed to save SMTP configuration");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({
    label,
    field,
    type = "text",
    placeholder,
  }) => (
    <div>
      <label className="block text-sm text-gray-400 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={form[field]}
        onChange={(e) =>
          setForm({
            ...form,
            [field]: e.target.value,
          })
        }
        placeholder={placeholder}
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
          focus:bg-white/[0.06]
        "
      />
    </div>
  );

  return (
    <AdminLayout>

      <AdminPageHeader
        eyebrow="Platform Config"
        title="SMTP Configuration"
        description="Configure your email delivery settings, sender credentials and SMTP security."
      />

      {error && (
        <div className="
          mb-6
          rounded-3xl
          border
          border-red-500/20
          bg-red-500/10
          p-5
        ">
          <p className="text-red-400 font-semibold mb-1">
            Something went wrong
          </p>

          <p className="text-gray-300 text-sm">
            {error}
          </p>
        </div>
      )}

      {loading ? (
        <AdminSkeleton height="h-[420px]" />
      ) : (
        <div className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        ">

          {/* MAIN FORM */}

          <AdminCard className="xl:col-span-2">

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
                  EMAIL SETTINGS
                </p>

                <h2 className="
                  text-3xl
                  font-black
                ">
                  SMTP Credentials
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
                <Mail className="text-orange-400" />
              </div>

            </div>

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
              mb-6
            ">

              <Field
                label="SMTP Host"
                field="host"
                placeholder="smtp.gmail.com"
              />

              <Field
                label="Port"
                field="port"
                type="number"
                placeholder="587"
              />

              <Field
                label="Username"
                field="username"
                placeholder="you@gmail.com"
              />

              <Field
                label="Password"
                field="password"
                type="password"
                placeholder="App password"
              />

              <Field
                label="From Email"
                field="from_email"
                placeholder="noreply@bitebox.com"
              />

              <Field
                label="From Name"
                field="from_name"
                placeholder="BiteBox"
              />

            </div>

            <div className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-5
              pt-4
              border-t
              border-white/10
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
                  checked={form.use_tls}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      use_tls: e.target.checked,
                    })
                  }
                  className="
                    w-4
                    h-4
                    accent-orange-500
                  "
                />

                Enable TLS Security

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
                    : "Save SMTP Config"
                }

              </button>

            </div>

          </AdminCard>

          {/* SIDE INFO */}

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
                  Best Practices
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
                <ShieldCheck className="text-green-400" />
              </div>

            </div>

            <div className="space-y-5">

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
                  Use App Passwords
                </h3>

                <p className="
                  text-sm
                  text-gray-400
                  leading-relaxed
                ">
                  For Gmail and Outlook, always use app passwords instead of your real account password.
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
                  Enable TLS
                </h3>

                <p className="
                  text-sm
                  text-gray-400
                  leading-relaxed
                ">
                  TLS encrypts outgoing email traffic and improves security.
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
                  Recommended Ports
                </h3>

                <p className="
                  text-sm
                  text-gray-400
                  leading-relaxed
                ">
                  Common SMTP ports are 587 for TLS and 465 for SSL.
                </p>
              </div>

            </div>

          </AdminCard>

        </div>
      )}

    </AdminLayout>
  );
}

export default AdminConfigSMTP;