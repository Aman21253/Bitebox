import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

const PROVIDERS = ["razorpay", "stripe", "paytm"];
const BLANK = { provider: "razorpay", key_id: "", key_secret: "", webhook_secret: "", is_active: true };

function AdminConfigPayment() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("razorpay");
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try { const res = await API.get("/admin/config/payment"); setConfigs(res.data); }
    catch (e) { console.log(e); } finally { setLoading(false); }
  };

  const switchTab = (provider) => {
    setActiveTab(provider);
    const existing = configs.find(c => c.provider === provider);
    setForm(existing ? { ...existing, key_secret: "", webhook_secret: "" } : { ...BLANK, provider });
  };

  const save = async () => {
    setSaving(true); setSuccess(false);
    try { await API.put("/admin/config/payment", form); setSuccess(true); setTimeout(() => setSuccess(false), 3000); await fetch(); }
    catch (e) { console.log(e); } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-[700px] mx-auto">
          <div className="mb-10">
            <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">Platform Config</p>
            <h1 className="text-5xl font-black">Payment Config</h1>
          </div>

          {/* TABS */}
          <div className="flex gap-3 mb-8">
            {PROVIDERS.map(p => (
              <button key={p} onClick={() => switchTab(p)} className={`px-6 py-3 rounded-2xl font-bold capitalize transition-all ${activeTab === p ? "bg-orange-500 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}>
                {p}
                {configs.find(c => c.provider === p) && <span className="ml-2 text-xs">✓</span>}
              </button>
            ))}
          </div>

          {loading ? <div className="text-3xl font-black">Loading...</div> : (
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Key ID</label>
                <input value={form.key_id} onChange={e => setForm({ ...form, key_id: e.target.value })} placeholder="rzp_live_xxxx" className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Key Secret</label>
                <input type="password" value={form.key_secret} onChange={e => setForm({ ...form, key_secret: e.target.value })} placeholder="Enter secret key" className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Webhook Secret (optional)</label>
                <input type="password" value={form.webhook_secret} onChange={e => setForm({ ...form, webhook_secret: e.target.value })} placeholder="Webhook signing secret" className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
              </div>
              <label className="flex items-center gap-3 text-sm text-gray-300"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
              <button onClick={save} disabled={saving} className="h-14 px-10 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center gap-3 disabled:opacity-50">
                <Save size={18} /> {saving ? "Saving..." : success ? "✓ Saved!" : `Save ${activeTab} Config`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminConfigPayment;