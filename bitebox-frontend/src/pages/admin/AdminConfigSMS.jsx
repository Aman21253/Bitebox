import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

const BLANK = { provider: "msg91", api_key: "", sender_id: "", is_active: true };

function AdminConfigSMS() {
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    API.get("/admin/config/sms").then(res => { setForm({ ...res.data, api_key: "" }); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true); setSuccess(false);
    try { await API.put("/admin/config/sms", form); setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    catch (e) { console.log(e); } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-[700px] mx-auto">
          <div className="mb-10">
            <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">Platform Config</p>
            <h1 className="text-5xl font-black">SMS Config</h1>
          </div>
          {loading ? <div className="text-3xl font-black">Loading...</div> : (
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Provider</label>
                <select value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all">
                  <option value="msg91">MSG91</option>
                  <option value="twilio">Twilio</option>
                  <option value="fast2sms">Fast2SMS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">API Key</label>
                <input type="password" value={form.api_key} onChange={e => setForm({ ...form, api_key: e.target.value })} placeholder="Enter API key" className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Sender ID</label>
                <input value={form.sender_id} onChange={e => setForm({ ...form, sender_id: e.target.value })} placeholder="BTEBOX" className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
              </div>
              <label className="flex items-center gap-3 text-sm text-gray-300"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
              <button onClick={save} disabled={saving} className="h-14 px-10 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center gap-3 disabled:opacity-50">
                <Save size={18} /> {saving ? "Saving..." : success ? "✓ Saved!" : "Save SMS Config"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminConfigSMS;