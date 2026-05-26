import { useEffect, useState } from "react";
import { Save, AlertTriangle } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminConfigMaintenance() {
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState("Platform is under maintenance. Please try again later.");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    API.get("/admin/config/maintenance")
      .then(res => { setIsActive(res.data.is_active); if (res.data.message?.value) setMessage(res.data.message.value); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true); setSuccess(false);
    try { await API.put("/admin/config/maintenance", { is_active: isActive, message }); setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    catch (e) { console.log(e); } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-[700px] mx-auto">
          <div className="mb-10">
            <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">Platform Config</p>
            <h1 className="text-5xl font-black">Maintenance Mode</h1>
          </div>

          {/* WARNING */}
          {isActive && (
            <div className="rounded-[24px] border border-red-500/30 bg-red-500/10 p-5 mb-8 flex items-center gap-4">
              <AlertTriangle className="text-red-400 shrink-0" size={24} />
              <div>
                <p className="font-bold text-red-300">Maintenance mode is currently ON</p>
                <p className="text-sm text-red-400 mt-1">The platform is inaccessible to users right now.</p>
              </div>
            </div>
          )}

          {loading ? <div className="text-3xl font-black">Loading...</div> : (
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 space-y-7">
              {/* TOGGLE */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-lg">Enable Maintenance Mode</p>
                  <p className="text-gray-500 text-sm mt-1">Blocks all user access to the platform</p>
                </div>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 ${isActive ? "bg-red-500" : "bg-white/10"}`}
                >
                  <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${isActive ? "left-9" : "left-1"}`} />
                </button>
              </div>

              {/* MESSAGE */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">User-facing message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-orange-500 transition-all resize-none"
                />
              </div>

              <button onClick={save} disabled={saving} className="h-14 px-10 bg-orange-500 rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center gap-3 disabled:opacity-50">
                <Save size={18} /> {saving ? "Saving..." : success ? "✓ Saved!" : "Save Settings"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminConfigMaintenance;