import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminConfigApp() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState({});

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try { const res = await API.get("/admin/config/app"); setConfigs(res.data); }
    catch (e) { console.log(e); } finally { setLoading(false); }
  };

  const upsert = async (key, value, description) => {
    setSaving(s => ({ ...s, [key]: true }));
    try { await API.put("/admin/config/app", { key, value, description }); await fetch(); }
    catch (e) { console.log(e); } finally { setSaving(s => ({ ...s, [key]: false })); }
  };

  const addNew = async () => {
    if (!newKey || !newValue) return;
    await upsert(newKey, newValue, newDesc);
    setNewKey(""); setNewValue(""); setNewDesc("");
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-[900px] mx-auto">
          <div className="mb-10">
            <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">Platform Config</p>
            <h1 className="text-5xl font-black">App Configuration</h1>
          </div>

          {/* ADD NEW */}
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 mb-8">
            <h2 className="font-black text-lg mb-5">Add New Config</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="Key (e.g. app_name)" className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
              <input value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="Value" className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
              <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)" className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all col-span-2" />
            </div>
            <button onClick={addNew} className="h-12 px-8 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2"><Save size={16} /> Save Config</button>
          </div>

          {/* EXISTING */}
          {loading ? <div className="text-3xl font-black">Loading...</div> : (
            <div className="space-y-4">
              {configs.map(c => (
                <EditableConfigRow key={c.key} config={c} onSave={upsert} saving={saving[c.key]} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditableConfigRow({ config, onSave, saving }) {
  const [value, setValue] = useState(config.value);
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 flex items-center gap-4">
      <div className="flex-1">
        <p className="font-bold text-sm text-orange-400 mb-1">{config.key}</p>
        {config.description && <p className="text-xs text-gray-500">{config.description}</p>}
      </div>
      <input value={value} onChange={e => setValue(e.target.value)} className="w-64 h-10 rounded-xl bg-white/5 border border-white/10 px-4 text-sm outline-none focus:border-orange-500 transition-all" />
      <button onClick={() => onSave(config.key, value, config.description)} disabled={saving} className="h-10 px-5 bg-orange-500 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all disabled:opacity-50">
        {saving ? "..." : <Save size={14} />}
      </button>
    </div>
  );
}

export default AdminConfigApp;