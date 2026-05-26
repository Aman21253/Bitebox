import { useEffect, useState } from "react";
import { Plus, Pencil, Check, X } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

const BLANK = { name: "", code: "", is_default: false, is_active: true };

function AdminMasterLanguages() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try { const res = await API.get("/admin/master/languages"); setLanguages(res.data); }
    catch (e) { console.log(e); } finally { setLoading(false); }
  };

  const save = async () => {
    try {
      if (editing) await API.put(`/admin/master/languages/${editing.id}`, form);
      else await API.post("/admin/master/languages", form);
      setForm(BLANK); setEditing(null); setShowForm(false); fetch();
    } catch (e) { console.log(e); }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">Master Data</p>
              <h1 className="text-5xl font-black">Language Master</h1>
            </div>
            <button onClick={() => { setShowForm(true); setEditing(null); setForm(BLANK); }} className="flex items-center gap-2 px-6 py-3 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all">
              <Plus size={18} /> Add Language
            </button>
          </div>

          {showForm && (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 mb-8">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Language (e.g. Hindi)" className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="Code (e.g. hi)" className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-300"><input type="checkbox" checked={form.is_default} onChange={e => setForm({ ...form, is_default: e.target.checked })} /> Default Language</label>
                <label className="flex items-center gap-2 text-sm text-gray-300"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
              </div>
              <div className="flex gap-3">
                <button onClick={save} className="h-12 px-8 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2"><Check size={16} /> Save</button>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="h-12 px-6 bg-white/5 rounded-2xl font-bold flex items-center gap-2"><X size={16} /> Cancel</button>
              </div>
            </div>
          )}

          {loading ? <div className="text-3xl font-black">Loading...</div> : (
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] overflow-hidden">
              <table className="w-full">
                <thead><tr className="border-b border-white/10">
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Language</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Code</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Default</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Status</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Actions</th>
                </tr></thead>
                <tbody>
                  {languages.map(l => (
                    <tr key={l.id} className="border-b border-white/5">
                      <td className="px-8 py-5 font-bold">{l.name}</td>
                      <td className="px-8 py-5 text-gray-400">{l.code}</td>
                      <td className="px-8 py-5">{l.is_default && <span className="px-3 py-1 rounded-xl text-xs font-bold bg-orange-500/10 text-orange-300 border border-orange-500/20">Default</span>}</td>
                      <td className="px-8 py-5"><span className={`px-3 py-1 rounded-xl text-xs font-bold ${l.is_active ? "bg-green-500/10 text-green-300 border border-green-500/20" : "bg-red-500/10 text-red-300 border border-red-500/20"}`}>{l.is_active ? "Active" : "Inactive"}</span></td>
                      <td className="px-8 py-5"><button onClick={() => { setEditing(l); setForm({ name: l.name, code: l.code, is_default: l.is_default, is_active: l.is_active }); setShowForm(true); }} className="p-2 rounded-xl bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 transition-all"><Pencil size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMasterLanguages;