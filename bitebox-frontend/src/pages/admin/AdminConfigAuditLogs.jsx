import { useEffect, useState } from "react";
import { ShieldCheck, RefreshCw, ChevronLeft, ChevronRight, Activity } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminSkeleton from "../../components/admin/AdminSkeleton";
import AdminEmptyState from "../../components/admin/AdminEmptyState";

function AdminConfigAuditLogs() {
  const [logs,setLogs]=useState([]);
  const [total,setTotal]=useState(0);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [page,setPage]=useState(1);

  useEffect(()=>{fetchLogs();},[page]);

  const fetchLogs=async()=>{
    setLoading(true);
    setError("");

    try{
      const res=await API.get(`/admin/config/audit-logs?page=${page}&limit=20`);
      setLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
    }catch(e){
      console.log(e);
      setError("Failed to load audit logs");
    }finally{
      setLoading(false);
    }
  };

  const totalPages=Math.ceil(total/20);

  return(
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />

      <div className="flex-1 p-4 md:p-6 xl:p-10 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto">

          {/* HEADER */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">
            <div>
              <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">
                Security Monitoring
              </p>

              <h1 className="text-4xl md:text-5xl font-black leading-none">
                Audit Logs
              </h1>

              <p className="text-gray-500 mt-3 text-sm md:text-base">
                Monitor admin actions, configuration updates and platform activities.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-5 py-4 rounded-2xl border border-white/10 bg-white/[0.03] min-w-[180px]">
                <p className="text-xs text-gray-500 uppercase tracking-[2px] mb-2">
                  Total Entries
                </p>

                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-orange-400" />

                  <h2 className="text-3xl font-black">
                    {total}
                  </h2>
                </div>
              </div>

              <button
                onClick={fetchLogs}
                className="h-14 px-6 rounded-2xl bg-orange-500 hover:bg-orange-400 transition-all font-bold flex items-center gap-3 shadow-lg shadow-orange-500/20"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
            </div>
          </div>

          {/* ERROR */}

          {
            error && (
              <div className="mb-8 rounded-[28px] border border-red-500/20 bg-red-500/10 p-6">
                <h2 className="text-red-400 font-black text-xl mb-2">
                  Failed To Load
                </h2>

                <p className="text-red-200/80 text-sm mb-5">
                  {error}
                </p>

                <button
                  onClick={fetchLogs}
                  className="h-11 px-5 rounded-xl bg-red-500 hover:bg-red-400 transition-all font-bold"
                >
                  Retry
                </button>
              </div>
            )
          }

          {/* LOADING */}

          {
            loading ? (
              <div className="space-y-4">
                <AdminSkeleton className="h-24 rounded-[28px]" />
                <AdminSkeleton className="h-24 rounded-[28px]" />
                <AdminSkeleton className="h-24 rounded-[28px]" />
                <AdminSkeleton className="h-24 rounded-[28px]" />
                <AdminSkeleton className="h-24 rounded-[28px]" />
              </div>
            ) : logs.length === 0 ? (
              <AdminEmptyState
                icon={ShieldCheck}
                title="No Audit Logs Found"
                description="Audit activity will appear here once admins start performing actions."
              />
            ) : (
              <>
                {/* DESKTOP TABLE */}

                <div className="hidden xl:block rounded-[32px] border border-white/10 bg-white/[0.03] overflow-hidden backdrop-blur-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                          <th className="px-6 py-5 text-left text-gray-400 font-semibold whitespace-nowrap">
                            Time
                          </th>

                          <th className="px-6 py-5 text-left text-gray-400 font-semibold whitespace-nowrap">
                            User
                          </th>

                          <th className="px-6 py-5 text-left text-gray-400 font-semibold whitespace-nowrap">
                            Action
                          </th>

                          <th className="px-6 py-5 text-left text-gray-400 font-semibold whitespace-nowrap">
                            Entity
                          </th>

                          <th className="px-6 py-5 text-left text-gray-400 font-semibold whitespace-nowrap">
                            Details
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {
                          logs.map((l)=>(
                            <tr
                              key={l.id}
                              className="border-b border-white/5 hover:bg-white/[0.025] transition-all"
                            >
                              <td className="px-6 py-5 text-sm text-gray-400 whitespace-nowrap">
                                {new Date(l.created_at).toLocaleString()}
                              </td>

                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-300 font-black">
                                    #
                                  </div>

                                  <div>
                                    <p className="font-bold">
                                      User {l.user_id}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                      Admin Activity
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-5">
                                <span className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500/10 text-orange-300 border border-orange-500/20">
                                  {l.action}
                                </span>
                              </td>

                              <td className="px-6 py-5 text-gray-300 whitespace-nowrap">
                                {l.entity} #{l.entity_id}
                              </td>

                              <td className="px-6 py-5 text-sm text-gray-400 max-w-[350px]">
                                <div className="line-clamp-2">
                                  {l.details || "No additional details"}
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* MOBILE CARDS */}

                <div className="xl:hidden space-y-5">
                  {
                    logs.map((l)=>(
                      <div
                        key={l.id}
                        className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
                      >
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div>
                            <p className="text-xs text-gray-500 mb-2">
                              {new Date(l.created_at).toLocaleString()}
                            </p>

                            <h2 className="text-xl font-black">
                              {l.entity} #{l.entity_id}
                            </h2>
                          </div>

                          <span className="px-3 py-2 rounded-xl text-xs font-bold bg-orange-500/10 text-orange-300 border border-orange-500/20 whitespace-nowrap">
                            {l.action}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-[2px] mb-1">
                              User
                            </p>

                            <p className="font-bold">
                              #{l.user_id}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-[2px] mb-1">
                              Details
                            </p>

                            <p className="text-sm text-gray-300 leading-relaxed">
                              {l.details || "No additional details"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>

                {/* PAGINATION */}

                <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div className="text-sm text-gray-500">
                    Showing page {page} of {totalPages || 1}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      disabled={page===1}
                      onClick={()=>setPage(p=>p-1)}
                      className="h-12 px-5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all disabled:opacity-30 disabled:cursor-not-allowed font-bold flex items-center gap-2"
                    >
                      <ChevronLeft size={16} />
                      Prev
                    </button>

                    <div className="h-12 px-5 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black min-w-[70px]">
                      {page}
                    </div>

                    <button
                      disabled={page===totalPages || totalPages===0}
                      onClick={()=>setPage(p=>p+1)}
                      className="h-12 px-5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all disabled:opacity-30 disabled:cursor-not-allowed font-bold flex items-center gap-2"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )
          }

        </div>
      </div>
    </div>
  );
}

export default AdminConfigAuditLogs;