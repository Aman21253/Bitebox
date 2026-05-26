import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

const BLANK = { fee_type: "flat", value: "", min_order_amount: "", is_active: true };

function AdminConfigPlatformFees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try { const res = await API.get("/admin/config/platform-fees"); setFees(res.data); }
    catch (e) { console.log(e); } finally { setLoading(false); }
  };

  const save = async () => {
    try {
      const payload = { ...form, value: parseFloat(form.value), min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : null };
      if (editing) await API.put(`/admin/config/platform-fees/${editing.id}`, payload);
      else await API.post("/admin/config/platform-fees", payload);
      setForm(BLANK); setEditing(null); setShowForm(false); fetch();
    } catch (e) { console.log(e); }
  };

  const remove = async (id) => {
    if (!confirm("Delete fee?")) return;
    await API.delete(`/admin/config/platform-fees/${id}`); fetch();
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">Platform Config</p>
              <h1 className="text-5xl font-black">Platform Fee</h1>
            </div>
            <button onClick={() => { setShowForm(true); setEditing(null); setForm(BLANK); }} className="flex items-center gap-2 px-6 py-3 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all">
              <Plus size={18} /> Add Fee
            </button>
          </div>

          {showForm && (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 mb-8">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <select value={form.fee_type} onChange={e => setForm({ ...form, fee_type: e.target.value })} className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all">
                  <option value="flat">Flat (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
                <input value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="Value" type="number" className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
                <input value={form.min_order_amount} onChange={e => setForm({ ...form, min_order_amount: e.target.value })} placeholder="Min order amount (optional)" type="number" className="h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all col-span-2" />
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
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Type</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Value</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Min Order</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Status</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Actions</th>
                </tr></thead>
                <tbody>
                  {fees.map(f => (
                    <tr key={f.id} className="border-b border-white/5">
                      <td className="px-8 py-5 capitalize font-bold">{f.fee_type}</td>
                      <td className="px-8 py-5 text-orange-400 font-bold">{f.fee_type === "flat" ? `₹${f.value}` : `${f.value}%`}</td>
                      <td className="px-8 py-5 text-gray-300">{f.min_order_amount ? `₹${f.min_order_amount}` : "—"}</td>
                      <td className="px-8 py-5"><span className={`px-3 py-1 rounded-xl text-xs font-bold ${f.is_active ? "bg-green-500/10 text-green-300 border border-green-500/20" : "bg-red-500/10 text-red-300 border border-red-500/20"}`}>{f.is_active ? "Active" : "Inactive"}</span></td>
                      <td className="px-8 py-5">
                        <div className="flex gap-3">
                          <button onClick={() => { setEditing(f); setForm({ fee_type: f.fee_type, value: f.value, min_order_amount: f.min_order_amount || "", is_active: f.is_active }); setShowForm(true); }} className="p-2 rounded-xl bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 transition-all"><Pencil size={16} /></button>
                          <button onClick={() => remove(f.id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
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

export default AdminConfigPlatformFees;