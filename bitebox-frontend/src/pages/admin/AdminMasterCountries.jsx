import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, ChevronRight } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminMasterCountries() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("countries"); // "countries" | "states"
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", code: "", is_active: true });
  const [stateForm, setStateForm] = useState({ name: "", country_id: "", is_active: true });

  useEffect(() => { fetchCountries(); }, []);

  const fetchCountries = async () => {
    try {
      const res = await API.get("/admin/master/countries");
      setCountries(res.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const fetchStates = async (countryId) => {
    try {
      const res = await API.get(`/admin/master/states?country_id=${countryId}`);
      setStates(res.data);
    } catch (e) { console.log(e); }
  };

  const selectCountry = (c) => {
    setSelectedCountry(c);
    setTab("states");
    fetchStates(c.id);
    setStateForm({ name: "", country_id: c.id, is_active: true });
  };

  const saveCountry = async () => {
    try {
      if (editing) await API.put(`/admin/master/countries/${editing.id}`, form);
      else await API.post("/admin/master/countries", form);
      setForm({ name: "", code: "", is_active: true });
      setEditing(null); setShowForm(false);
      fetchCountries();
    } catch (e) { console.log(e); }
  };

  const saveState = async () => {
    try {
      if (editing) await API.put(`/admin/master/states/${editing.id}`, stateForm);
      else await API.post("/admin/master/states", stateForm);
      setStateForm({ name: "", country_id: selectedCountry.id, is_active: true });
      setEditing(null); setShowForm(false);
      fetchStates(selectedCountry.id);
    } catch (e) { console.log(e); }
  };

  const removeCountry = async (id) => {
    if (!confirm("Delete country?")) return;
    await API.delete(`/admin/master/countries/${id}`);
    fetchCountries();
  };

  const removeState = async (id) => {
    if (!confirm("Delete state?")) return;
    await API.delete(`/admin/master/states/${id}`);
    fetchStates(selectedCountry.id);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">Master Data</p>
              <h1 className="text-5xl font-black">
                {tab === "states" && selectedCountry ? (
                  <span className="flex items-center gap-3">
                    <button onClick={() => setTab("countries")} className="text-gray-500 hover:text-white transition-all">Countries</button>
                    <ChevronRight size={32} className="text-gray-600" />
                    {selectedCountry.name}
                  </span>
                ) : "Country / State Master"}
              </h1>
            </div>
            <button
              onClick={() => { setShowForm(true); setEditing(null); }}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all"
            >
              <Plus size={18} /> Add {tab === "states" ? "State" : "Country"}
            </button>
          </div>

          {/* FORM */}
          {showForm && tab === "countries" && (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 mb-8">
              <div className="flex gap-4 items-center">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Country name" className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="Code (e.g. IN)" className="w-32 h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
                <button onClick={saveCountry} className="h-12 px-6 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all"><Check size={16} /></button>
                <button onClick={() => setShowForm(false)} className="h-12 px-6 bg-white/5 rounded-2xl font-bold"><X size={16} /></button>
              </div>
            </div>
          )}

          {showForm && tab === "states" && (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 mb-8">
              <div className="flex gap-4 items-center">
                <input value={stateForm.name} onChange={e => setStateForm({ ...stateForm, name: e.target.value })} placeholder="State name" className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
                <button onClick={saveState} className="h-12 px-6 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all"><Check size={16} /></button>
                <button onClick={() => setShowForm(false)} className="h-12 px-6 bg-white/5 rounded-2xl font-bold"><X size={16} /></button>
              </div>
            </div>
          )}

          {/* COUNTRIES TABLE */}
          {tab === "countries" && !loading && (
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] overflow-hidden">
              <table className="w-full">
                <thead><tr className="border-b border-white/10">
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Name</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Code</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Status</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Actions</th>
                </tr></thead>
                <tbody>
                  {countries.map((c) => (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer" onClick={() => selectCountry(c)}>
                      <td className="px-8 py-5 font-bold">{c.name}</td>
                      <td className="px-8 py-5 text-gray-400">{c.code}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${c.is_active ? "bg-green-500/10 text-green-300 border border-green-500/20" : "bg-red-500/10 text-red-300 border border-red-500/20"}`}>{c.is_active ? "Active" : "Inactive"}</span>
                      </td>
                      <td className="px-8 py-5" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-3">
                          <button onClick={() => { setEditing(c); setForm({ name: c.name, code: c.code, is_active: c.is_active }); setShowForm(true); }} className="p-2 rounded-xl bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 transition-all"><Pencil size={16} /></button>
                          <button onClick={() => removeCountry(c.id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* STATES TABLE */}
          {tab === "states" && (
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] overflow-hidden">
              <table className="w-full">
                <thead><tr className="border-b border-white/10">
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">State Name</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Status</th>
                  <th className="px-8 py-5 text-left text-gray-400 font-semibold">Actions</th>
                </tr></thead>
                <tbody>
                  {states.map((s) => (
                    <tr key={s.id} className="border-b border-white/5">
                      <td className="px-8 py-5 font-bold">{s.name}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${s.is_active ? "bg-green-500/10 text-green-300 border border-green-500/20" : "bg-red-500/10 text-red-300 border border-red-500/20"}`}>{s.is_active ? "Active" : "Inactive"}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-3">
                          <button onClick={() => { setEditing(s); setStateForm({ name: s.name, country_id: selectedCountry.id, is_active: s.is_active }); setShowForm(true); }} className="p-2 rounded-xl bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 transition-all"><Pencil size={16} /></button>
                          <button onClick={() => removeState(s.id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
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

export default AdminMasterCountries;