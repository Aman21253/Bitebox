import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

const BLANK = { host: "", port: 587, username: "", password: "", from_email: "", from_name: "", use_tls: true };

function AdminConfigSMTP() {
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    API.get("/admin/config/smtp").then(res => { setForm({ ...res.data, password: "" }); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true); setSuccess(false);
    try { await API.put("/admin/config/smtp", form); setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    catch (e) { console.log(e); } finally { setSaving(false); }
  };

  const Field = ({ label, field, type = "text", placeholder }) => (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} placeholder={placeholder} className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-5 outline-none focus:border-orange-500 transition-all" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-[700px] mx-auto">
          <div className="mb-10">
            <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">Platform Config</p>
            <h1 className="text-5xl font-black">SMTP Config</h1>
          </div>
          {loading ? <div className="text-3xl font-black">Loading...</div> : (
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <Field label="SMTP Host" field="host" placeholder="smtp.gmail.com" />
                <Field label="Port" field="port" type="number" placeholder="587" />
                <Field label="Username" field="username" placeholder="you@gmail.com" />
                <Field label="Password" field="password" type="password" placeholder="App password" />
                <Field label="From Email" field="from_email" placeholder="noreply@bitebox.com" />
                <Field label="From Name" field="from_name" placeholder="BiteBox" />
              </div>
              <label className="flex items-center gap-3 text-sm text-gray-300">
                <input type="checkbox" checked={form.use_tls} onChange={e => setForm({ ...form, use_tls: e.target.checked })} /> Use TLS
              </label>
              <button onClick={save} disabled={saving} className="h-14 px-10 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center gap-3 disabled:opacity-50">
                <Save size={18} /> {saving ? "Saving..." : success ? "✓ Saved!" : "Save SMTP Config"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminConfigSMTP;