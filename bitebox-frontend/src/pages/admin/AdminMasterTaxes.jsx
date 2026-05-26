import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

const BLANK = { name: "", rate: "", applicable_on: "order", is_active: true };

function AdminMasterTaxes() {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try { const res = await API.get("/admin/master/taxes"); setTaxes(res.data); }
    catch (e) { console.log(e); } finally { setLoading(false); }
  };

  const save = async () => {
    try {
      const payload = { ...form, rate: parseFloat(form.rate) };
      if (editing) await API.put(`/admin/master/taxes/${editing.id}`, payload);
      else await API.post("/admin/master/taxes", payload);
      setForm(BLANK); setEditing(null); setShowForm(false); fetch();
    } catch (e) { console.log(e); }
  };

  const remove = async (id) => {
    if (!confirm("Delete tax?")) return;
    await API.delete(`/admin/master/taxes/${id}`); fetch();
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">Master Data</p>
              <h1 className="text-5xl font-black">Tax Master</h1>
            </div>
            <button onClick={() => { setShowForm(true); setEditing(null); setForm(BLANK); }} className="flex items-center gap-2 px-6 py-3 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all">
              <Plus size={18} /> Add Tax
            </button>
          </div>

          {showForm && (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 mb-8">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Tax name (e.g. GST 18%)" className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
                <input value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} placeholder="Rate (e.g. 18)" type="number" className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
                <select value={form.applicable_on} onChange={e => setForm({ ...form, applicable_on: e.target.value })} className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all col-span-2">
                  <option value="order">On Order</option>
                  <option value="delivery">On Delivery</option>
                  <option value="both">Both</option>
                </select>
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
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Name</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Rate</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Applies On</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Status</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Actions</th>
                </tr></thead>
                <tbody>
                  {taxes.map(t => (
                    <tr key={t.id} className="border-b border-white/5">
                      <td className="px-8 py-5 font-bold">{t.name}</td>
                      <td className="px-8 py-5 text-orange-400 font-bold">{t.rate}%</td>
                      <td className="px-8 py-5 capitalize text-gray-300">{t.applicable_on}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${t.is_active ? "bg-green-500/10 text-green-300 border border-green-500/20" : "bg-red-500/10 text-red-300 border border-red-500/20"}`}>{t.is_active ? "Active" : "Inactive"}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-3">
                          <button onClick={() => { setEditing(t); setForm({ name: t.name, rate: t.rate, applicable_on: t.applicable_on, is_active: t.is_active }); setShowForm(true); }} className="p-2 rounded-xl bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 transition-all"><Pencil size={16} /></button>
                          <button onClick={() => remove(t.id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
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

export default AdminMasterTaxes;