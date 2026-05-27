import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react";

import API from "../../api/axios";

import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminCard from "../../components/admin/AdminCard";
import AdminSkeleton from "../../components/admin/AdminSkeleton";
import AdminEmptyState from "../../components/admin/AdminEmptyState";

const BLANK = {
  event: "",
  channel: "email",
  subject: "",
  body: "",
  is_active: true,
};

function AdminConfigNotificationTemplates() {

  const [templates, setTemplates] =
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

    fetchTemplates();

  }, []);

  const fetchTemplates = async () => {

    try {

      setLoading(true);

      setError("");

      const res =
        await API.get(
          "/admin/config/notification-templates"
        );

      setTemplates(res.data);

    } catch (e) {

      console.log(e);

      setError(
        "Failed to load notification templates"
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
          `/admin/config/notification-templates/${editing.id}`,
          form
        );

      } else {

        await API.post(
          "/admin/config/notification-templates",
          form
        );
      }

      setForm(BLANK);

      setEditing(null);

      setShowForm(false);

      fetchTemplates();

    } catch (e) {

      console.log(e);

      setError(
        "Failed to save template"
      );

    } finally {

      setSaving(false);
    }
  };

  const remove = async (id) => {

    if (
      !confirm(
        "Delete template?"
      )
    ) return;

    try {

      await API.delete(
        `/admin/config/notification-templates/${id}`
      );

      fetchTemplates();

    } catch (e) {

      console.log(e);
    }
  };

  const startEdit = (template) => {

    setEditing(template);

    setForm({

      event:
        template.event,

      channel:
        template.channel,

      subject:
        template.subject || "",

      body:
        template.body,

      is_active:
        template.is_active,
    });

    setShowForm(true);
  };

  const CHANNEL_COLORS = {

    email:
      "bg-blue-500/10 text-blue-300 border-blue-500/20",

    sms:
      "bg-green-500/10 text-green-300 border-green-500/20",

    push:
      "bg-purple-500/10 text-purple-300 border-purple-500/20",
  };

  const CHANNEL_ICONS = {

    email:
      <Mail size={15} />,

    sms:
      <MessageSquare size={15} />,

    push:
      <Smartphone size={15} />,
  };

  return (

    <AdminLayout>

      <AdminPageHeader

        eyebrow="
          Platform Config
        "

        title="
          Notification Templates
        "

        description="
          Manage SMS, email and push
          notification templates with
          dynamic placeholders and
          delivery channels.
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
                  text-sm
                  font-semibold
                  mb-2
                ">
                  TEMPLATE FORM
                </p>

                <h2 className="
                  text-3xl
                  font-black
                ">
                  {
                    editing

                      ? "Edit Template"

                      : "Create Template"
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

                <Bell
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
                  Event Name
                </label>

                <input

                  value={form.event}

                  onChange={(e) =>
                    setForm({

                      ...form,

                      event:
                        e.target.value,
                    })
                  }

                  placeholder="
                    order_placed
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
                  Channel
                </label>

                <select

                  value={form.channel}

                  onChange={(e) =>
                    setForm({

                      ...form,

                      channel:
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

                  <option value="email">
                    Email
                  </option>

                  <option value="sms">
                    SMS
                  </option>

                  <option value="push">
                    Push
                  </option>

                </select>

              </div>

            </div>

            {
              form.channel ===
              "email" && (

                <div className="
                  mb-5
                ">

                  <label className="
                    block
                    text-sm
                    text-gray-400
                    mb-2
                  ">
                    Subject Line
                  </label>

                  <input

                    value={form.subject}

                    onChange={(e) =>
                      setForm({

                        ...form,

                        subject:
                          e.target.value,
                      })
                    }

                    placeholder="
                      Your order has been placed
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
              )
            }

            <div className="
              mb-6
            ">

              <label className="
                block
                text-sm
                text-gray-400
                mb-2
              ">
                Template Body
              </label>

              <textarea

                rows={5}

                value={form.body}

                onChange={(e) =>
                  setForm({

                    ...form,

                    body:
                      e.target.value,
                  })
                }

                placeholder="
                  Hello {{customer_name}},
                  your order #{{order_id}}
                  has been confirmed.
                "

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
                "
              />

              <p className="
                text-xs
                text-gray-500
                mt-3
              ">
                Use placeholders like
                {" "}
                {"{{customer_name}}"}
                {" "}
                and
                {" "}
                {"{{order_id}}"}
              </p>

            </div>

            <div className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-5
              pt-5
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

                Enable Template

              </label>

              <div className="
                flex
                gap-3
              ">

                <button

                  onClick={() => {

                    setShowForm(false);

                    setEditing(null);

                    setForm(BLANK);
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

                      : "Save Template"
                  }

                </button>

              </div>

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
            Existing Templates
          </h2>

          <p className="
            text-gray-400
          ">
            {
              templates.length
            }
            {" "}
            templates configured
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

          Add Template

        </button>

      </div>

      {
        loading ? (

          <div className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-6
          ">

            <AdminSkeleton
              height="h-[220px]"
            />

            <AdminSkeleton
              height="h-[220px]"
            />

          </div>

        ) : templates.length === 0 ? (

          <AdminEmptyState

            icon={
              <Bell
                size={40}
                className="
                  text-orange-400
                "
              />
            }

            title="
              No Templates Found
            "

            description="
              Create notification
              templates for order,
              payment and delivery
              events.
            "
          />

        ) : (

          <div className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-6
          ">

            {
              templates.map((t) => (

                <AdminCard
                  key={t.id}
                >

                  <div className="
                    flex
                    items-start
                    justify-between
                    gap-5
                    mb-5
                  ">

                    <div>

                      <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                        mb-3
                      ">

                        <h3 className="
                          text-2xl
                          font-black
                        ">
                          {t.event}
                        </h3>

                        <span className={`
                          px-3
                          py-1
                          rounded-xl
                          text-xs
                          font-bold
                          border
                          flex
                          items-center
                          gap-1

                          ${
                            CHANNEL_COLORS[
                              t.channel
                            ]
                          }
                        `}>

                          {
                            CHANNEL_ICONS[
                              t.channel
                            ]
                          }

                          {t.channel}

                        </span>

                        <span className={`
                          px-3
                          py-1
                          rounded-xl
                          text-xs
                          font-bold

                          ${
                            t.is_active

                              ? `
                                bg-green-500/10
                                text-green-300
                                border
                                border-green-500/20
                              `

                              : `
                                bg-red-500/10
                                text-red-300
                                border
                                border-red-500/20
                              `
                          }
                        `}>

                          {
                            t.is_active

                              ? "Active"

                              : "Inactive"
                          }

                        </span>

                      </div>

                      {
                        t.subject && (

                          <p className="
                            text-sm
                            text-gray-400
                            mb-3
                          ">

                            Subject:
                            {" "}

                            <span className="
                              text-white
                            ">
                              {t.subject}
                            </span>

                          </p>
                        )
                      }

                    </div>

                    <div className="
                      flex
                      gap-2
                    ">

                      <button

                        onClick={() =>
                          startEdit(t)
                        }

                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-white/[0.05]
                          hover:bg-orange-500/20
                          hover:text-orange-400
                          transition-all
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <Pencil size={15} />

                      </button>

                      <button

                        onClick={() =>
                          remove(t.id)
                        }

                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-white/[0.05]
                          hover:bg-red-500/20
                          hover:text-red-400
                          transition-all
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <Trash2 size={15} />

                      </button>

                    </div>

                  </div>

                  <div className="
                    rounded-2xl
                    bg-white/[0.03]
                    border
                    border-white/10
                    p-5
                  ">

                    <p className="
                      text-sm
                      text-gray-400
                      leading-relaxed
                      whitespace-pre-line
                    ">
                      {t.body}
                    </p>

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

export default AdminConfigNotificationTemplates;