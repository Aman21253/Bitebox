import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Check,
  X,
  Percent,
  Wallet,
} from "lucide-react";

import API from "../../api/axios";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminCard from "../../components/admin/AdminCard";
import AdminSkeleton from "../../components/admin/AdminSkeleton";
import AdminEmptyState from "../../components/admin/AdminEmptyState";

const BLANK = {
  restaurant_id: "",
  rate: "",
  is_active: true,
};

function AdminConfigCommissions() {

  const [commissions, setCommissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const [form, setForm] =
    useState(BLANK);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

    fetchCommissions();

  }, []);

  const fetchCommissions = async () => {

    try {

      setLoading(true);

      setError("");

      const res =
        await API.get(
          "/admin/config/commissions"
        );

      setCommissions(res.data);

    } catch (e) {

      console.log(e);

      setError(
        "Failed to load commissions"
      );

    } finally {

      setLoading(false);
    }
  };

  const save = async () => {

    try {

      setSaving(true);

      const payload = {

        ...form,

        rate: parseFloat(
          form.rate
        ),

        restaurant_id:
          form.restaurant_id

            ? parseInt(
                form.restaurant_id
              )

            : null,
      };

      if (editing) {

        await API.put(
          `/admin/config/commissions/${editing.id}`,
          payload
        );

      } else {

        await API.post(
          "/admin/config/commissions",
          payload
        );
      }

      setForm(BLANK);

      setEditing(null);

      setShowForm(false);

      fetchCommissions();

    } catch (e) {

      console.log(e);

      setError(
        "Failed to save commission"
      );

    } finally {

      setSaving(false);
    }
  };

  const startEdit = (
    commission
  ) => {

    setEditing(commission);

    setForm({

      restaurant_id:
        commission.restaurant_id || "",

      rate:
        commission.rate,

      is_active:
        commission.is_active,
    });

    setShowForm(true);
  };

  return (

    <AdminLayout>

      <AdminPageHeader

        eyebrow="
          Platform Config
        "

        title="
          Commission Settings
        "

        description="
          Configure global and
          restaurant specific
          commission percentages.
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

      <div className="
        rounded-3xl
        border
        border-orange-500/20
        bg-orange-500/5
        p-5
        mb-8
      ">

        <div className="
          flex
          items-start
          gap-4
        ">

          <div className="
            w-12
            h-12
            rounded-2xl
            bg-orange-500/10
            flex
            items-center
            justify-center
            shrink-0
          ">

            <Wallet
              className="
                text-orange-400
              "
              size={22}
            />

          </div>

          <div>

            <h3 className="
              font-black
              text-lg
              text-orange-300
              mb-1
            ">
              Global Commission
            </h3>

            <p className="
              text-sm
              text-orange-200/80
              leading-relaxed
            ">
              Leave the restaurant ID
              empty to apply a default
              commission rate to all
              restaurants across the
              platform.
            </p>

          </div>

        </div>

      </div>

      {
        showForm && (

          <AdminCard
            className="
              mb-8
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
                  font-semibold
                  mb-2
                ">
                  COMMISSION FORM
                </p>

                <h2 className="
                  text-3xl
                  font-black
                ">
                  {
                    editing

                      ? "Edit Commission"

                      : "Create Commission"
                  }
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

                <Percent
                  className="
                    text-orange-400
                  "
                />

              </div>

            </div>

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
              mb-5
            ">

              <div>

                <label className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                ">
                  Restaurant ID
                </label>

                <input

                  type="number"

                  value={
                    form.restaurant_id
                  }

                  onChange={(e) =>
                    setForm({

                      ...form,

                      restaurant_id:
                        e.target.value,
                    })
                  }

                  placeholder="
                    Leave blank for global
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
                  Commission Rate %
                </label>

                <input

                  type="number"

                  value={form.rate}

                  onChange={(e) =>
                    setForm({

                      ...form,

                      rate:
                        e.target.value,
                    })
                  }

                  placeholder="
                    Example: 15
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

            </div>

            <div className="
              flex
              gap-3
              pt-5
              border-t
              border-white/10
            ">

              <button

                onClick={save}

                disabled={saving}

                className="
                  h-12
                  px-8
                  rounded-2xl
                  bg-orange-500
                  hover:bg-orange-400
                  transition-all
                  font-bold
                  flex
                  items-center
                  gap-2
                  disabled:opacity-50
                "
              >

                <Check size={16} />

                {
                  saving

                    ? "Saving..."

                    : "Save Commission"
                }

              </button>

              <button

                onClick={() => {

                  setShowForm(false);

                  setEditing(null);
                }}

                className="
                  h-12
                  px-6
                  rounded-2xl
                  bg-white/[0.05]
                  hover:bg-white/[0.08]
                  transition-all
                  font-bold
                  flex
                  items-center
                  gap-2
                "
              >

                <X size={16} />

                Cancel

              </button>

            </div>

          </AdminCard>
        )
      }

      <div className="
        flex
        items-center
        justify-between
        mb-6
      ">

        <div>

          <h2 className="
            text-3xl
            font-black
            mb-2
          ">
            Commission Rules
          </h2>

          <p className="
            text-gray-400
          ">
            {
              commissions.length
            }
            {" "}
            commission rules configured
          </p>

        </div>

        <button

          onClick={() => {

            setEditing(null);

            setForm(BLANK);

            setShowForm(true);
          }}

          className="
            h-12
            px-6
            rounded-2xl
            bg-orange-500
            hover:bg-orange-400
            transition-all
            font-bold
            flex
            items-center
            gap-2
          "
        >

          <Plus size={16} />

          Add Commission

        </button>

      </div>

      {
        loading ? (

          <div className="
            space-y-5
          ">

            <AdminSkeleton
              height="
                h-[120px]
              "
            />

            <AdminSkeleton
              height="
                h-[120px]
              "
            />

          </div>

        ) : commissions.length === 0 ? (

          <AdminEmptyState

            icon={
              <Percent
                size={40}
                className="
                  text-orange-400
                "
              />
            }

            title="
              No Commission Rules
            "

            description="
              Create commission rules
              for restaurants and
              platform earnings.
            "
          />

        ) : (

          <div className="
            space-y-5
          ">

            {
              commissions.map(
                (commission) => (

                  <AdminCard
                    key={commission.id}
                  >

                    <div className="
                      flex
                      flex-col
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                      gap-5
                    ">

                      <div className="
                        flex
                        items-center
                        gap-5
                        flex-1
                      ">

                        <div className="
                          w-14
                          h-14
                          rounded-2xl
                          bg-orange-500/10
                          flex
                          items-center
                          justify-center
                          shrink-0
                        ">

                          <Percent
                            className="
                              text-orange-400
                            "
                          />

                        </div>

                        <div>

                          <div className="
                            flex
                            items-center
                            gap-3
                            mb-2
                            flex-wrap
                          ">

                            <h3 className="
                              text-2xl
                              font-black
                            ">

                              {
                                commission.restaurant_id

                                  ? `
                                    Restaurant #${commission.restaurant_id}
                                  `

                                  : "Global Default"
                              }

                            </h3>

                            <span className={`
                              px-3
                              py-1
                              rounded-xl
                              text-xs
                              font-bold
                              border

                              ${
                                commission.is_active

                                  ? `
                                    bg-green-500/10
                                    text-green-300
                                    border-green-500/20
                                  `

                                  : `
                                    bg-red-500/10
                                    text-red-300
                                    border-red-500/20
                                  `
                              }
                            `}>

                              {
                                commission.is_active

                                  ? "Active"

                                  : "Inactive"
                              }

                            </span>

                          </div>

                          <p className="
                            text-gray-400
                          ">
                            Commission Rate
                          </p>

                          <h2 className="
                            text-4xl
                            font-black
                            text-orange-400
                          ">
                            {
                              commission.rate
                            }
                            %
                          </h2>

                        </div>

                      </div>

                      <button

                        onClick={() =>
                          startEdit(
                            commission
                          )
                        }

                        className="
                          h-12
                          px-5
                          rounded-2xl
                          bg-white/[0.05]
                          hover:bg-orange-500/20
                          hover:text-orange-400
                          transition-all
                          font-bold
                          flex
                          items-center
                          justify-center
                          gap-2
                        "
                      >

                        <Pencil
                          size={16}
                        />

                        Edit

                      </button>

                    </div>

                  </AdminCard>
                )
              )
            }
          </div>
        )
      }
    </AdminLayout>
  );
}

export default AdminConfigCommissions;