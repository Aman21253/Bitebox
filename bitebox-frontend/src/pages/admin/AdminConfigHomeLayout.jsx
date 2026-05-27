import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
 Check,
  X,
  Eye,
  EyeOff,
  GripVertical,
  LayoutDashboard,
} from "lucide-react";

import API from "../../api/axios";

import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminCard from "../../components/admin/AdminCard";
import AdminSkeleton from "../../components/admin/AdminSkeleton";
import AdminEmptyState from "../../components/admin/AdminEmptyState";

const BLANK = {
  section: "",
  title: "",
  subtitle: "",
  order: 0,
  is_visible: true,
};

const SECTION_TYPES = [
  "banner",
  "featured_cuisines",
  "top_restaurants",
  "promo",
  "categories",
  "offers",
];

function AdminConfigHomeLayout() {

  const [sections, setSections] =
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

    fetchSections();

  }, []);

  const fetchSections = async () => {

    try {

      setLoading(true);

      setError("");

      const res =
        await API.get(
          "/admin/config/home-layout"
        );

      setSections(res.data);

    } catch (e) {

      console.log(e);

      setError(
        "Failed to load home layout sections"
      );

    } finally {

      setLoading(false);
    }
  };

  const save = async () => {

    try {

      setSaving(true);

      if (editing) {

        await API.put(
          `/admin/config/home-layout/${editing.id}`,
          form
        );

      } else {

        await API.post(
          "/admin/config/home-layout",
          form
        );
      }

      setForm(BLANK);

      setEditing(null);

      setShowForm(false);

      fetchSections();

    } catch (e) {

      console.log(e);

      setError(
        "Failed to save section"
      );

    } finally {

      setSaving(false);
    }
  };

  const remove = async (id) => {

    if (
      !confirm(
        "Delete section?"
      )
    ) return;

    try {

      await API.delete(
        `/admin/config/home-layout/${id}`
      );

      fetchSections();

    } catch (e) {

      console.log(e);
    }
  };

  const toggleVisibility =
    async (section) => {

      try {

        await API.put(
          `/admin/config/home-layout/${section.id}`,
          {

            ...section,

            is_visible:
              !section.is_visible,
          }
        );

        fetchSections();

      } catch (e) {

        console.log(e);
      }
    };

  const startEdit = (section) => {

    setEditing(section);

    setForm({

      section:
        section.section,

      title:
        section.title || "",

      subtitle:
        section.subtitle || "",

      order:
        section.order,

      is_visible:
        section.is_visible,
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
          Home Layout
        "

        description="
          Configure homepage sections,
          visibility and display order
          for the customer app.
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
                  SECTION FORM
                </p>

                <h2 className="
                  text-3xl
                  font-black
                ">
                  {
                    editing

                      ? "Edit Section"

                      : "Create Section"
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

                <LayoutDashboard
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

              <div className="
                md:col-span-2
              ">

                <label className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                ">
                  Section Type
                </label>

                <select

                  value={form.section}

                  onChange={(e) =>
                    setForm({

                      ...form,

                      section:
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
                    focus:border-orange-500
                  "
                >

                  <option value="">
                    Select section type
                  </option>

                  {
                    SECTION_TYPES.map(
                      (section) => (

                        <option
                          key={section}
                          value={section}
                        >
                          {section}
                        </option>
                      )
                    )
                  }

                </select>

              </div>

              <div>

                <label className="
                  block
                  text-sm
                  text-gray-400
                  mb-2
                ">
                  Title
                </label>

                <input

                  value={form.title}

                  onChange={(e) =>
                    setForm({

                      ...form,

                      title:
                        e.target.value,
                    })
                  }

                  placeholder="
                    Featured Restaurants
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
                  Subtitle
                </label>

                <input

                  value={form.subtitle}

                  onChange={(e) =>
                    setForm({

                      ...form,

                      subtitle:
                        e.target.value,
                    })
                  }

                  placeholder="
                    Discover top rated places
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
                  Display Order
                </label>

                <input

                  type="number"

                  value={form.order}

                  onChange={(e) =>
                    setForm({

                      ...form,

                      order:
                        parseInt(
                          e.target.value
                        ),
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
                    focus:border-orange-500
                  "
                />

              </div>

              <div className="
                flex
                items-end
              ">

                <label className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-gray-300
                  h-12
                ">

                  <input

                    type="checkbox"

                    checked={
                      form.is_visible
                    }

                    onChange={(e) =>
                      setForm({

                        ...form,

                        is_visible:
                          e.target.checked,
                      })
                    }

                    className="
                      w-4
                      h-4
                      accent-orange-500
                    "
                  />

                  Visible Section

                </label>

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

                    : "Save Section"
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
            Homepage Sections
          </h2>

          <p className="
            text-gray-400
          ">
            {
              sections.length
            }
            {" "}
            sections configured
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

          Add Section

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

        ) : sections.length === 0 ? (

          <AdminEmptyState

            icon={
              <LayoutDashboard
                size={40}
                className="
                  text-orange-400
                "
              />
            }

            title="
              No Sections Added
            "

            description="
              Create homepage sections
              to customize the customer
              app layout and experience.
            "
          />

        ) : (

          <div className="
            space-y-5
          ">

            {
              sections.map((section) => (

                <AdminCard
                  key={section.id}
                  className={`
                    transition-all

                    ${
                      !section.is_visible &&
                      "opacity-50"
                    }
                  `}
                >

                  <div className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    gap-5
                  ">

                    <div className="
                      flex
                      items-center
                      gap-5
                      flex-1
                    ">

                      <div className="
                        w-12
                        h-12
                        rounded-2xl
                        bg-white/[0.04]
                        flex
                        items-center
                        justify-center
                        shrink-0
                      ">

                        <GripVertical
                          className="
                            text-gray-500
                          "
                          size={18}
                        />

                      </div>

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

                        <span className="
                          text-orange-400
                          font-black
                        ">
                          {
                            section.order
                          }
                        </span>

                      </div>

                      <div className="
                        flex-1
                      ">

                        <div className="
                          flex
                          flex-wrap
                          items-center
                          gap-3
                          mb-2
                        ">

                          <h3 className="
                            text-2xl
                            font-black
                            capitalize
                          ">
                            {
                              section.section
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
                              section.is_visible

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
                              section.is_visible

                                ? "Visible"

                                : "Hidden"
                            }

                          </span>

                        </div>

                        {
                          section.title && (

                            <p className="
                              text-gray-300
                              mb-1
                            ">
                              {
                                section.title
                              }
                            </p>
                          )
                        }

                        {
                          section.subtitle && (

                            <p className="
                              text-sm
                              text-gray-500
                            ">
                              {
                                section.subtitle
                              }
                            </p>
                          )
                        }

                      </div>

                    </div>

                    <div className="
                      flex
                      gap-3
                    ">

                      <button

                        onClick={() =>
                          toggleVisibility(
                            section
                          )
                        }

                        className={`
                          w-11
                          h-11
                          rounded-2xl
                          transition-all
                          flex
                          items-center
                          justify-center

                          ${
                            section.is_visible

                              ? `
                                bg-green-500/10
                                text-green-400
                                hover:bg-green-500/20
                              `

                              : `
                                bg-white/[0.05]
                                text-gray-500
                                hover:bg-white/[0.08]
                              `
                          }
                        `}
                      >

                        {
                          section.is_visible

                            ? (
                              <Eye
                                size={16}
                              />
                            )

                            : (
                              <EyeOff
                                size={16}
                              />
                            )
                        }

                      </button>

                      <button

                        onClick={() =>
                          startEdit(
                            section
                          )
                        }

                        className="
                          w-11
                          h-11
                          rounded-2xl
                          bg-white/[0.05]
                          hover:bg-orange-500/20
                          hover:text-orange-400
                          transition-all
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <Pencil
                          size={16}
                        />

                      </button>

                      <button

                        onClick={() =>
                          remove(
                            section.id
                          )
                        }

                        className="
                          w-11
                          h-11
                          rounded-2xl
                          bg-white/[0.05]
                          hover:bg-red-500/20
                          hover:text-red-400
                          transition-all
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <Trash2
                          size={16}
                        />

                      </button>

                    </div>

                  </div>

                </AdminCard>
              ))
            }

          </div>
        )
      }

    </AdminLayout>
  );
}

export default AdminConfigHomeLayout;