import { useEffect,useMemo,useState } from "react";
import { Search,Users,ShieldCheck,ShieldX,RefreshCw,UserCheck,UserX } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminSkeleton from "../../components/admin/AdminSkeleton";
import AdminEmptyState from "../../components/admin/AdminEmptyState";

function AdminUsers() {
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [actionLoading,setActionLoading]=useState({});
  const [search,setSearch]=useState("");
  const [statusFilter,setStatusFilter]=useState("all");
  const [error,setError]=useState("");

  useEffect(()=>{fetchUsers();},[]);

  const fetchUsers=async()=>{
    setLoading(true);
    setError("");

    try{
      const response=await API.get("/admin/users");
      setUsers(response.data);
    }catch(error){
      console.log(error);
      setError("Failed to load users");
    }finally{
      setLoading(false);
    }
  };

  const suspendUser=async(userId)=>{
    setActionLoading(prev=>({...prev,[userId]:true}));

    try{
      await API.put(`/admin/users/${userId}/suspend`);
      fetchUsers();
    }catch(error){
      console.log(error);
    }finally{
      setActionLoading(prev=>({...prev,[userId]:false}));
    }
  };

  const activateUser=async(userId)=>{
    setActionLoading(prev=>({...prev,[userId]:true}));

    try{
      await API.put(`/admin/users/${userId}/activate`);
      fetchUsers();
    }catch(error){
      console.log(error);
    }finally{
      setActionLoading(prev=>({...prev,[userId]:false}));
    }
  };

  const filteredUsers=useMemo(()=>{
    return users.filter(user=>{
      const matchesSearch=
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus=
        statusFilter==="all"
        ? true
        : user.status===statusFilter;

      return matchesSearch && matchesStatus;
    });
  },[users,search,statusFilter]);

  const totalUsers=users.length;
  const activeUsers=users.filter(user=>user.status==="active").length;
  const suspendedUsers=users.filter(user=>user.status!=="active").length;

  return(
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />

      <div className="flex-1 p-4 md:p-6 xl:p-10 overflow-x-hidden">
        <div className="max-w-[1700px] mx-auto">

          {/* HEADER */}

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
            <div>
              <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">
                Admin Panel
              </p>

              <h1 className="text-4xl md:text-5xl font-black leading-none">
                Users Management
              </h1>

              <p className="text-gray-500 mt-3 text-sm md:text-base">
                Manage platform users, monitor account status and control access.
              </p>
            </div>

            <button
              onClick={fetchUsers}
              className="h-14 px-6 rounded-2xl bg-orange-500 hover:bg-orange-400 transition-all font-bold flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
            >
              <RefreshCw size={18} />
              Refresh Users
            </button>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <Users className="text-blue-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Total Users
              </p>

              <h2 className="text-4xl font-black">
                {totalUsers}
              </h2>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5">
                <UserCheck className="text-green-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Active Users
              </p>

              <h2 className="text-4xl font-black text-green-400">
                {activeUsers}
              </h2>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                <UserX className="text-red-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Suspended Users
              </p>

              <h2 className="text-4xl font-black text-red-400">
                {suspendedUsers}
              </h2>
            </div>
          </div>

          {/* FILTERS */}

          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5 md:p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />

                <input
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full h-14 rounded-2xl bg-white/[0.04] border border-white/10 pl-12 pr-5 outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={()=>setStatusFilter("all")}
                  className={`h-12 px-5 rounded-2xl font-bold transition-all ${
                    statusFilter==="all"
                    ? "bg-orange-500 text-white"
                    : "bg-white/[0.04] border border-white/10 hover:bg-white/[0.08]"
                  }`}
                >
                  All
                </button>

                <button
                  onClick={()=>setStatusFilter("active")}
                  className={`h-12 px-5 rounded-2xl font-bold transition-all ${
                    statusFilter==="active"
                    ? "bg-green-500 text-white"
                    : "bg-white/[0.04] border border-white/10 hover:bg-white/[0.08]"
                  }`}
                >
                  Active
                </button>

                <button
                  onClick={()=>setStatusFilter("suspended")}
                  className={`h-12 px-5 rounded-2xl font-bold transition-all ${
                    statusFilter==="suspended"
                    ? "bg-red-500 text-white"
                    : "bg-white/[0.04] border border-white/10 hover:bg-white/[0.08]"
                  }`}
                >
                  Suspended
                </button>
              </div>
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
                  onClick={fetchUsers}
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
              </div>
            ) : filteredUsers.length===0 ? (
              <AdminEmptyState
                icon={Users}
                title="No Users Found"
                description="No users matched your current search or filters."
              />
            ) : (
              <>
                {/* DESKTOP TABLE */}

                <div className="hidden xl:block overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                          <th className="px-8 py-6 text-left text-gray-400 font-semibold whitespace-nowrap">
                            User
                          </th>

                          <th className="px-8 py-6 text-left text-gray-400 font-semibold whitespace-nowrap">
                            Email
                          </th>

                          <th className="px-8 py-6 text-left text-gray-400 font-semibold whitespace-nowrap">
                            Role
                          </th>

                          <th className="px-8 py-6 text-left text-gray-400 font-semibold whitespace-nowrap">
                            Status
                          </th>

                          <th className="px-8 py-6 text-left text-gray-400 font-semibold whitespace-nowrap">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {
                          filteredUsers.map((user)=>(
                            <tr
                              key={user.id}
                              className="border-b border-white/5 hover:bg-white/[0.025] transition-all"
                            >
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-black text-orange-300">
                                    {user.name?.charAt(0)?.toUpperCase()}
                                  </div>

                                  <div>
                                    <p className="font-bold text-lg">
                                      {user.name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                      User ID #{user.id}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-8 py-6 text-gray-300">
                                {user.email}
                              </td>

                              <td className="px-8 py-6">
                                <span className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20 capitalize">
                                  {user.role?.value || user.role}
                                </span>
                              </td>

                              <td className="px-8 py-6">
                                <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                                  user.status==="active"
                                  ? "bg-green-500/10 text-green-300 border-green-500/20"
                                  : "bg-red-500/10 text-red-300 border-red-500/20"
                                }`}>
                                  {user.status}
                                </span>
                              </td>

                              <td className="px-8 py-6">
                                {
                                  user.status==="active" ? (
                                    <button
                                      onClick={()=>suspendUser(user.id)}
                                      disabled={actionLoading[user.id]}
                                      className="h-11 px-5 rounded-2xl bg-red-500 hover:bg-red-400 transition-all font-bold flex items-center gap-2 disabled:opacity-50"
                                    >
                                      <ShieldX size={16} />
                                      {actionLoading[user.id] ? "Suspending..." : "Suspend"}
                                    </button>
                                  ) : (
                                    <button
                                      onClick={()=>activateUser(user.id)}
                                      disabled={actionLoading[user.id]}
                                      className="h-11 px-5 rounded-2xl bg-green-500 hover:bg-green-400 transition-all font-bold flex items-center gap-2 disabled:opacity-50"
                                    >
                                      <ShieldCheck size={16} />
                                      {actionLoading[user.id] ? "Activating..." : "Activate"}
                                    </button>
                                  )
                                }
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
                    filteredUsers.map((user)=>(
                      <div
                        key={user.id}
                        className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
                      >
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-black text-orange-300 text-lg">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </div>

                            <div>
                              <h2 className="text-xl font-black">
                                {user.name}
                              </h2>

                              <p className="text-sm text-gray-500 mt-1">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          <span className={`px-3 py-2 rounded-xl text-xs font-bold border whitespace-nowrap ${
                            user.status==="active"
                            ? "bg-green-500/10 text-green-300 border-green-500/20"
                            : "bg-red-500/10 text-red-300 border-red-500/20"
                          }`}>
                            {user.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20 capitalize">
                            {user.role?.value || user.role}
                          </span>

                          {
                            user.status==="active" ? (
                              <button
                                onClick={()=>suspendUser(user.id)}
                                disabled={actionLoading[user.id]}
                                className="h-11 px-5 rounded-2xl bg-red-500 hover:bg-red-400 transition-all font-bold disabled:opacity-50"
                              >
                                {actionLoading[user.id] ? "..." : "Suspend"}
                              </button>
                            ) : (
                              <button
                                onClick={()=>activateUser(user.id)}
                                disabled={actionLoading[user.id]}
                                className="h-11 px-5 rounded-2xl bg-green-500 hover:bg-green-400 transition-all font-bold disabled:opacity-50"
                              >
                                {actionLoading[user.id] ? "..." : "Activate"}
                              </button>
                            )
                          }
                        </div>
                      </div>
                    ))
                  }
                </div>
              </>
            )
          }

        </div>
      </div>
    </div>
  );
}

export default AdminUsers;