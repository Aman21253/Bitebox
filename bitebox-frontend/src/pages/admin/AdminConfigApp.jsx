import { useEffect, useState } from "react";
import { Save, Settings2 } from "lucide-react";
import API from "../../api/axios";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminCard from "../../components/admin/AdminCard";
import AdminEmptyState from "../../components/admin/AdminEmptyState";
import AdminSkeleton from "../../components/admin/AdminSkeleton";

function AdminConfigApp() {

  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {

    try {

      setLoading(true);
      setError("");

      const res = await API.get("/admin/config/app");

      setConfigs(res.data);

    } catch (e) {

      console.log(e);

      setError("Failed to load configurations");

    } finally {

      setLoading(false);
    }
  };

  const upsert = async (key, value, description) => {

    setSaving(s => ({
      ...s,
      [key]: true
    }));

    try {

      await API.put("/admin/config/app", {
        key,
        value,
        description
      });

      await fetchConfigs();

    } catch (e) {

      console.log(e);

    } finally {

      setSaving(s => ({
        ...s,
        [key]: false
      }));
    }
  };

  const addNew = async () => {

    if (!newKey || !newValue) return;

    await upsert(
      newKey,
      newValue,
      newDesc
    );

    setNewKey("");
    setNewValue("");
    setNewDesc("");
  };

  return (

    <AdminLayout>

      <AdminPageHeader
        eyebrow="Platform Config"
        title="App Configuration"
        description="
          Manage global application
          settings, feature toggles
          and platform behaviour.
        "
      />

      {/* ERROR STATE */}

      {
        error && (

          <div className="
            mb-8
            rounded-[28px]
            border
            border-red-500/20
            bg-red-500/10
            p-6
          ">

            <h2 className="
              text-2xl
              font-black
              text-red-400
              mb-3
            ">
              Failed To Load
            </h2>

            <p className="
              text-gray-300
              mb-5
            ">
              {error}
            </p>

            <button
              onClick={fetchConfigs}
              className="
                h-11
                px-6
                rounded-2xl
                bg-red-500
                hover:bg-red-400
                transition-all
                font-bold
              "
            >
              Retry
            </button>

          </div>
        )
      }

      {/* ADD NEW CONFIG */}

      <AdminCard className="mb-8">

        <div className="
          flex
          items-center
          gap-4
          mb-7
        ">

          <div className="
            w-14
            h-14
            rounded-2xl
            bg-orange-500/10
            flex
            items-center
            justify-center
          ">

            <Settings2
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
              SYSTEM SETTINGS
            </p>

            <h2 className="
              text-3xl
              font-black
            ">
              Add New Config
            </h2>

          </div>

        </div>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-4
          mb-4
        ">

          <input
            value={newKey}
            onChange={e =>
              setNewKey(e.target.value)
            }
            placeholder="Key (e.g. app_name)"
            className="
              h-14
              rounded-2xl
              bg-white/[0.04]
              border
              border-white/10
              px-5
              outline-none
              focus:border-orange-500
              transition-all
            "
          />

          <input
            value={newValue}
            onChange={e =>
              setNewValue(e.target.value)
            }
            placeholder="Value"
            className="
              h-14
              rounded-2xl
              bg-white/[0.04]
              border
              border-white/10
              px-5
              outline-none
              focus:border-orange-500
              transition-all
            "
          />

          <input
            value={newDesc}
            onChange={e =>
              setNewDesc(e.target.value)
            }
            placeholder="Description (optional)"
            className="
              h-14
              rounded-2xl
              bg-white/[0.04]
              border
              border-white/10
              px-5
              outline-none
              focus:border-orange-500
              transition-all
              md:col-span-2
            "
          />

        </div>

        <button
          onClick={addNew}
          className="
            h-14
            px-8
            rounded-2xl
            bg-orange-500
            hover:bg-orange-400
            transition-all
            font-black
            flex
            items-center
            gap-3
          "
        >

          <Save size={18} />

          Save Config

        </button>

      </AdminCard>

      {/* CONFIG LIST */}

      {
        loading ? (

          <div className="
            space-y-5
          ">

            <AdminSkeleton height="h-[110px]" />
            <AdminSkeleton height="h-[110px]" />
            <AdminSkeleton height="h-[110px]" />

          </div>

        ) : configs.length === 0 ? (

          <AdminEmptyState
            icon={
              <Settings2
                size={42}
                className="
                  text-orange-400
                "
              />
            }
            title="No Configurations Found"
            description="
              Start by adding your
              first application config.
            "
          />

        ) : (

          <div className="
            space-y-5
          ">

            {
              configs.map(config => (

                <EditableConfigRow
                  key={config.key}
                  config={config}
                  onSave={upsert}
                  saving={saving[config.key]}
                />
              ))
            }

          </div>
        )
      }

    </AdminLayout>
  );
}

function EditableConfigRow({
  config,
  onSave,
  saving
}) {

  const [value, setValue] =
    useState(config.value);

  return (

    <div className="
      rounded-[28px]
      border
      border-white/10
      bg-white/[0.03]
      p-6
      flex
      flex-col
      lg:flex-row
      lg:items-center
      gap-5
      hover:border-orange-500/20
      transition-all
    ">

      <div className="
        flex-1
      ">

        <p className="
          text-orange-400
          text-sm
          font-black
          mb-2
        ">
          {config.key}
        </p>

        {
          config.description && (

            <p className="
              text-sm
              text-gray-400
            ">
              {config.description}
            </p>
          )
        }

      </div>

      <input
        value={value}
        onChange={e =>
          setValue(e.target.value)
        }
        className="
          w-full
          lg:w-[320px]
          h-12
          rounded-2xl
          bg-white/[0.04]
          border
          border-white/10
          px-5
          text-sm
          outline-none
          focus:border-orange-500
          transition-all
        "
      />

      <button
        onClick={() =>
          onSave(
            config.key,
            value,
            config.description
          )
        }
        disabled={saving}
        className="
          h-12
          px-6
          rounded-2xl
          bg-orange-500
          hover:bg-orange-400
          transition-all
          font-bold
          disabled:opacity-50
          flex
          items-center
          justify-center
        "
      >

        {
          saving
            ? "Saving..."
            : <Save size={16} />
        }

      </button>

    </div>
  );
}

export default AdminConfigApp;