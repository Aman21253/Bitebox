import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminMasterCuisines() {
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", is_active: true });

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try {
      const res = await API.get("/admin/master/cuisines");
      setCuisines(res.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const save = async () => {
    try {
      if (editing) {
        await API.put(`/admin/master/cuisines/${editing.id}`, form);
      } else {
        await API.post("/admin/master/cuisines", form);
      }
      setForm({ name: "", is_active: true });
      setEditing(null);
      setShowForm(false);
      fetch();
    } catch (e) { console.log(e); }
  };

  const remove = async (id) => {
    if (!confirm("Delete this cuisine?")) return;
    await API.delete(`/admin/master/cuisines/${id}`);
    fetch();
  };

  const startEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, is_active: c.is_active });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">Master Data</p>
              <h1 className="text-5xl font-black">Cuisine Master</h1>
            </div>
            <button
              onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", is_active: true }); }}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all"
            >
              <Plus size={18} /> Add Cuisine
            </button>
          </div>

          {/* FORM */}
          {showForm && (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 mb-8">
              <h2 className="text-xl font-black mb-5">{editing ? "Edit Cuisine" : "New Cuisine"}</h2>
              <div className="flex gap-4 items-center">
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Cuisine name (e.g. Italian)"
                  className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all"
                />
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                  Active
                </label>
                <button onClick={save} className="h-12 px-6 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2">
                  <Check size={16} /> Save
                </button>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="h-12 px-6 bg-white/5 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* TABLE */}
          {loading ? (
            <div className="text-3xl font-black">Loading...</div>
          ) : (
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-8 py-5 text-left text-gray-400 font-semibold">#</th>
                    <th className="px-8 py-5 text-left text-gray-400 font-semibold">Name</th>
                    <th className="px-8 py-5 text-left text-gray-400 font-semibold">Status</th>
                    <th className="px-8 py-5 text-left text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cuisines.map((c) => (
                    <tr key={c.id} className="border-b border-white/5">
                      <td className="px-8 py-5 text-gray-500">{c.id}</td>
                      <td className="px-8 py-5 font-bold">{c.name}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${c.is_active ? "bg-green-500/10 text-green-300 border border-green-500/20" : "bg-red-500/10 text-red-300 border border-red-500/20"}`}>
                          {c.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-3">
                          <button onClick={() => startEdit(c)} className="p-2 rounded-xl bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 transition-all">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => remove(c.id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
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

export default AdminMasterCuisines;