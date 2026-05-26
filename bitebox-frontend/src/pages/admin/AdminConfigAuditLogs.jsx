import { useEffect, useState } from "react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminConfigAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => { fetch(); }, [page]);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/admin/config/audit-logs?page=${page}&limit=20`);
      setLogs(res.data.logs); setTotal(res.data.total);
    } catch (e) { console.log(e); } finally { setLoading(false); }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />
      <div className="flex-1 p-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-10">
            <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">Platform Config</p>
            <h1 className="text-5xl font-black">Audit Logs</h1>
            <p className="text-gray-500 mt-2">{total} total entries</p>
          </div>

          {loading ? <div className="text-3xl font-black">Loading...</div> : (
            <>
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] overflow-hidden mb-6">
                <table className="w-full">
                  <thead><tr className="border-b border-white/10">
                    <th className="px-6 py-5 text-left text-gray-400 font-semibold">Time</th>
                    <th className="px-6 py-5 text-left text-gray-400 font-semibold">User</th>
                    <th className="px-6 py-5 text-left text-gray-400 font-semibold">Action</th>
                    <th className="px-6 py-5 text-left text-gray-400 font-semibold">Entity</th>
                    <th className="px-6 py-5 text-left text-gray-400 font-semibold">Details</th>
                  </tr></thead>
                  <tbody>
                    {logs.map(l => (
                      <tr key={l.id} className="border-b border-white/5">
                        <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold">#{l.user_id}</td>
                        <td className="px-6 py-4"><span className="px-3 py-1 rounded-xl text-xs font-bold bg-orange-500/10 text-orange-300 border border-orange-500/20">{l.action}</span></td>
                        <td className="px-6 py-4 text-gray-300">{l.entity} #{l.entity_id}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{l.details || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">Page {page} of {totalPages}</p>
                <div className="flex gap-3">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-5 py-2 rounded-xl bg-white/5 font-bold disabled:opacity-30 hover:bg-white/10 transition-all">← Prev</button>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-5 py-2 rounded-xl bg-white/5 font-bold disabled:opacity-30 hover:bg-white/10 transition-all">Next →</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminConfigAuditLogs;