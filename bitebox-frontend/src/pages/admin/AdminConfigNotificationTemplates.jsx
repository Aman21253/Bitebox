import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

const BLANK = { event: "", channel: "email", subject: "", body: "", is_active: true };

function AdminConfigNotificationTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try { const res = await API.get("/admin/config/notification-templates"); setTemplates(res.data); }
    catch (e) { console.log(e); } finally { setLoading(false); }
  };

  const save = async () => {
    try {
      if (editing) await API.put(`/admin/config/notification-templates/${editing.id}`, form);
      else await API.post("/admin/config/notification-templates", form);
      setForm(BLANK); setEditing(null); setShowForm(false); fetch();
    } catch (e) { console.log(e); }
  };

  const remove = async (id) => {
    if (!confirm("Delete template?")) return;
    await API.delete(`/admin/config/notification-templates/${id}`); fetch();
  };

  const CHANNEL_COLORS = { email: "bg-blue-500/10 text-blue-300 border-blue-500/20", sms: "bg-green-500/10 text-green-300 border-green-500/20", push: "bg-purple-500/10 text-purple-300 border-purple-500/20" };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">Platform Config</p>
              <h1 className="text-5xl font-black">Notification Templates</h1>
            </div>
            <button onClick={() => { setShowForm(true); setEditing(null); setForm(BLANK); }} className="flex items-center gap-2 px-6 py-3 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all">
              <Plus size={18} /> Add Template
            </button>
          </div>

          {showForm && (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 mb-8">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input value={form.event} onChange={e => setForm({ ...form, event: e.target.value })} placeholder="Event (e.g. order_placed)" className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
                <select value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value })} className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all">
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push</option>
                </select>
                {form.channel === "email" && (
                  <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Subject line" className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all col-span-2" />
                )}
                <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Message body. Use {{variable}} for dynamic values." rows={4} className="rounded-2xl bg-white/5 border border-white/10 px-5 py-3 outline-none focus:border-orange-500 transition-all resize-none col-span-2" />
              </div>
              <div className="flex gap-3">
                <button onClick={save} className="h-12 px-8 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2"><Check size={16} /> Save</button>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="h-12 px-6 bg-white/5 rounded-2xl font-bold flex items-center gap-2"><X size={16} /> Cancel</button>
              </div>
            </div>
          )}

          {loading ? <div className="text-3xl font-black">Loading...</div> : (
            <div className="space-y-4">
              {templates.map(t => (
                <div key={t.id} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-lg">{t.event}</span>
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${CHANNEL_COLORS[t.channel]}`}>{t.channel}</span>
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold ${t.is_active ? "bg-green-500/10 text-green-300 border border-green-500/20" : "bg-red-500/10 text-red-300 border border-red-500/20"}`}>{t.is_active ? "Active" : "Inactive"}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(t); setForm({ event: t.event, channel: t.channel, subject: t.subject || "", body: t.body, is_active: t.is_active }); setShowForm(true); }} className="p-2 rounded-xl bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 transition-all"><Pencil size={15} /></button>
                      <button onClick={() => remove(t.id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all"><Trash2 size={15} /></button>
                    </div>
                  </div>
                  {t.subject && <p className="text-sm text-gray-400 mb-2">Subject: <span className="text-white">{t.subject}</span></p>}
                  <p className="text-sm text-gray-500 line-clamp-2">{t.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminConfigNotificationTemplates;