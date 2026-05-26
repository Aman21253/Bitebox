import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, Eye, EyeOff, GripVertical } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

const BLANK = { section: "", title: "", subtitle: "", order: 0, is_visible: true };
const SECTION_TYPES = ["banner", "featured_cuisines", "top_restaurants", "promo", "categories", "offers"];

function AdminConfigHomeLayout() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try { const res = await API.get("/admin/config/home-layout"); setSections(res.data); }
    catch (e) { console.log(e); } finally { setLoading(false); }
  };

  const save = async () => {
    try {
      if (editing) await API.put(`/admin/config/home-layout/${editing.id}`, form);
      else await API.post("/admin/config/home-layout", form);
      setForm(BLANK); setEditing(null); setShowForm(false); fetch();
    } catch (e) { console.log(e); }
  };

  const remove = async (id) => {
    if (!confirm("Delete section?")) return;
    await API.delete(`/admin/config/home-layout/${id}`); fetch();
  };

  const toggleVisibility = async (s) => {
    await API.put(`/admin/config/home-layout/${s.id}`, { ...s, is_visible: !s.is_visible });
    fetch();
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">Platform Config</p>
              <h1 className="text-5xl font-black">Home Layout</h1>
            </div>
            <button onClick={() => { setShowForm(true); setEditing(null); setForm(BLANK); }} className="flex items-center gap-2 px-6 py-3 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all">
              <Plus size={18} /> Add Section
            </button>
          </div>

          {showForm && (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 mb-8">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all col-span-2">
                  <option value="">Select section type</option>
                  {SECTION_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title (optional)" className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
                <input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="Subtitle (optional)" className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
                <input value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} placeholder="Display order" type="number" className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
                <label className="flex items-center gap-2 text-sm text-gray-300 px-2"><input type="checkbox" checked={form.is_visible} onChange={e => setForm({ ...form, is_visible: e.target.checked })} /> Visible</label>
              </div>
              <div className="flex gap-3">
                <button onClick={save} className="h-12 px-8 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2"><Check size={16} /> Save</button>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="h-12 px-6 bg-white/5 rounded-2xl font-bold flex items-center gap-2"><X size={16} /> Cancel</button>
              </div>
            </div>
          )}

          {loading ? <div className="text-3xl font-black">Loading...</div> : (
            <div className="space-y-4">
              {sections.map(s => (
                <div key={s.id} className={`rounded-[24px] border bg-white/[0.03] p-6 flex items-center gap-5 transition-all ${s.is_visible ? "border-white/10" : "border-white/5 opacity-50"}`}>
                  <GripVertical className="text-gray-600 shrink-0" size={20} />
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                    <span className="text-orange-400 font-black text-sm">{s.order}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-black capitalize">{s.section}</p>
                    {s.title && <p className="text-sm text-gray-400 mt-0.5">{s.title}</p>}
                    {s.subtitle && <p className="text-xs text-gray-600 mt-0.5">{s.subtitle}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleVisibility(s)} className={`p-2 rounded-xl transition-all ${s.is_visible ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-white/5 text-gray-600 hover:bg-white/10"}`}>
                      {s.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => { setEditing(s); setForm({ section: s.section, title: s.title || "", subtitle: s.subtitle || "", order: s.order, is_visible: s.is_visible }); setShowForm(true); }} className="p-2 rounded-xl bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 transition-all"><Pencil size={16} /></button>
                    <button onClick={() => remove(s.id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminConfigHomeLayout;