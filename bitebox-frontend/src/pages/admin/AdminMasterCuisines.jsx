import { useEffect,useMemo,useState } from "react";
import { Plus,Pencil,Trash2,Check,X,UtensilsCrossed,Search,RefreshCw,Flame,AlertCircle } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminSkeleton from "../../components/admin/AdminSkeleton";
import AdminEmptyState from "../../components/admin/AdminEmptyState";

const BLANK={
  name:"",
  is_active:true
};

function AdminMasterCuisines() {
  const [cuisines,setCuisines]=useState([]);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [showForm,setShowForm]=useState(false);
  const [editing,setEditing]=useState(null);
  const [search,setSearch]=useState("");
  const [error,setError]=useState("");
  const [form,setForm]=useState(BLANK);

  useEffect(()=>{
    fetchCuisines();
  },[]);

  const fetchCuisines=async()=>{
    setLoading(true);
    setError("");

    try{
      const res=await API.get("/admin/master/cuisines");
      setCuisines(res.data);
    }catch(e){
      console.log(e);
      setError("Failed to load cuisine master");
    }finally{
      setLoading(false);
    }
  };

  const save=async()=>{
    if(!form.name){
      return alert("Cuisine name is required");
    }

    setSaving(true);

    try{
      if(editing){
        await API.put(`/admin/master/cuisines/${editing.id}`,form);
      }else{
        await API.post("/admin/master/cuisines",form);
      }

      setForm(BLANK);
      setEditing(null);
      setShowForm(false);

      fetchCuisines();
    }catch(e){
      console.log(e);
    }finally{
      setSaving(false);
    }
  };

  const remove=async(id)=>{
    if(!confirm("Delete this cuisine?")) return;

    try{
      await API.delete(`/admin/master/cuisines/${id}`);
      fetchCuisines();
    }catch(e){
      console.log(e);
    }
  };

  const startEdit=(c)=>{
    setEditing(c);

    setForm({
      name:c.name,
      is_active:c.is_active
    });

    setShowForm(true);
  };

  const filteredCuisines=useMemo(()=>{
    return cuisines.filter((c)=>
      c.name?.toLowerCase().includes(search.toLowerCase())
    );
  },[cuisines,search]);

  const activeCuisines=cuisines.filter(
    (c)=>c.is_active
  ).length;

  return(
    <div className="min-h-screen bg-[#070b14] text-white flex">
      <AdminSidebar />

      <div className="flex-1 p-4 md:p-6 xl:p-10 overflow-x-hidden">
        <div className="max-w-[1500px] mx-auto">

          {/* HEADER */}

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

            <div>
              <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">
                Master Data
              </p>

              <h1 className="text-4xl md:text-5xl font-black leading-none">
                Cuisine Master
              </h1>

              <p className="text-gray-500 mt-3 text-sm md:text-base">
                Manage cuisines visible across the platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">

              <button
                onClick={fetchCuisines}
                className="h-14 px-6 rounded-2xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] transition-all font-bold flex items-center justify-center gap-3"
              >
                <RefreshCw size={18} />
                Refresh
              </button>

              <button
                onClick={()=>{
                  setShowForm(true);
                  setEditing(null);
                  setForm(BLANK);
                }}
                className="h-14 px-7 rounded-2xl bg-orange-500 hover:bg-orange-400 transition-all font-bold flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
              >
                <Plus size={18} />
                Add Cuisine
              </button>

            </div>

          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">

              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5">
                <UtensilsCrossed className="text-orange-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Total Cuisines
              </p>

              <h2 className="text-4xl font-black">
                {cuisines.length}
              </h2>

            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">

              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5">
                <Flame className="text-green-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Active Cuisines
              </p>

              <h2 className="text-4xl font-black text-green-400">
                {activeCuisines}
              </h2>

            </div>

          </div>

          {/* SEARCH */}

          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5 md:p-6 mb-8">

            <div className="relative w-full lg:max-w-md">

              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />

              <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search cuisines..."
                className="w-full h-14 rounded-2xl bg-white/[0.04] border border-white/10 pl-12 pr-5 outline-none focus:border-orange-500 transition-all"
              />

            </div>

          </div>

          {/* ERROR */}

          {
            error && (
              <div className="mb-8 rounded-[28px] border border-red-500/20 bg-red-500/10 p-6">

                <div className="flex items-start gap-4">

                  <AlertCircle className="text-red-400 shrink-0 mt-1" size={22} />

                  <div>

                    <h2 className="text-red-400 font-black text-xl mb-2">
                      Failed To Load
                    </h2>

                    <p className="text-red-200/80 text-sm mb-5">
                      {error}
                    </p>

                    <button
                      onClick={fetchCuisines}
                      className="h-11 px-5 rounded-xl bg-red-500 hover:bg-red-400 transition-all font-bold"
                    >
                      Retry
                    </button>

                  </div>

                </div>

              </div>
            )
          }

          {/* FORM */}

          {
            showForm && (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7 mb-8">

                <div className="flex items-center justify-between mb-7">

                  <div>

                    <h2 className="text-3xl font-black">
                      {
                        editing
                        ? "Edit Cuisine"
                        : "Create New Cuisine"
                      }
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Add cuisines for restaurants and menus.
                    </p>

                  </div>

                  <button
                    onClick={()=>{
                      setShowForm(false);
                      setEditing(null);
                    }}
                    className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-red-500/20 hover:border-red-500/20 transition-all flex items-center justify-center"
                  >
                    <X size={18} />
                  </button>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 mb-7">

                  <div>

                    <p className="text-sm text-gray-400 mb-3">
                      Cuisine Name
                    </p>

                    <input
                      value={form.name}
                      onChange={(e)=>setForm({...form,name:e.target.value})}
                      placeholder="Italian"
                      className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 px-5 outline-none focus:border-orange-500 transition-all"
                    />

                  </div>

                  <div className="flex items-end">

                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 cursor-pointer h-14">

                      <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e)=>setForm({...form,is_active:e.target.checked})}
                        className="w-4 h-4 accent-orange-500"
                      />

                      <span className="text-sm font-medium text-gray-300">
                        Active
                      </span>

                    </label>

                  </div>

                </div>

                <div className="flex flex-col sm:flex-row gap-4">

                  <button
                    onClick={save}
                    disabled={saving}
                    className="h-14 px-8 rounded-2xl bg-orange-500 hover:bg-orange-400 transition-all font-bold flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <Check size={18} />

                    {
                      saving
                      ? "Saving..."
                      : editing
                      ? "Update Cuisine"
                      : "Save Cuisine"
                    }
                  </button>

                  <button
                    onClick={()=>{
                      setShowForm(false);
                      setEditing(null);
                    }}
                    className="h-14 px-8 rounded-2xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] transition-all font-bold flex items-center justify-center gap-3"
                  >
                    <X size={18} />
                    Cancel
                  </button>

                </div>

              </div>
            )
          }

          {/* LOADING */}

          {
            loading ? (
              <div className="space-y-4">
                <AdminSkeleton className="h-20 rounded-[24px]" />
                <AdminSkeleton className="h-20 rounded-[24px]" />
                <AdminSkeleton className="h-20 rounded-[24px]" />
              </div>
            ) : filteredCuisines.length===0 ? (
              <AdminEmptyState
                icon={UtensilsCrossed}
                title="No Cuisines Found"
                description="Create your first cuisine category to get started."
              />
            ) : (
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[900px]">

                    <thead>

                      <tr className="border-b border-white/10 bg-white/[0.02]">

                        <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                          ID
                        </th>

                        <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                          Cuisine
                        </th>

                        <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                          Status
                        </th>

                        <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {
                        filteredCuisines.map((c)=>(
                          <tr
                            key={c.id}
                            className="border-b border-white/5 hover:bg-white/[0.03] transition-all"
                          >

                            <td className="px-8 py-6 text-gray-500 font-medium">
                              #{c.id}
                            </td>

                            <td className="px-8 py-6">

                              <div>

                                <p className="font-black text-lg">
                                  {c.name}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  Cuisine Category
                                </p>

                              </div>

                            </td>

                            <td className="px-8 py-6">

                              <span className={`px-4 py-2 rounded-xl text-xs font-bold ${
                                c.is_active
                                ? "bg-green-500/10 text-green-300 border border-green-500/20"
                                : "bg-red-500/10 text-red-300 border border-red-500/20"
                              }`}>
                                {
                                  c.is_active
                                  ? "Active"
                                  : "Inactive"
                                }
                              </span>

                            </td>

                            <td className="px-8 py-6">

                              <div className="flex items-center gap-3">

                                <button
                                  onClick={()=>startEdit(c)}
                                  className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-orange-500/20 hover:border-orange-500/20 hover:text-orange-400 transition-all flex items-center justify-center"
                                >
                                  <Pencil size={16} />
                                </button>

                                <button
                                  onClick={()=>remove(c.id)}
                                  className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-red-500/20 hover:border-red-500/20 hover:text-red-400 transition-all flex items-center justify-center"
                                >
                                  <Trash2 size={16} />
                                </button>

                              </div>

                            </td>

                          </tr>
                        ))
                      }

                    </tbody>

                  </table>

                </div>

              </div>
            )
          }

        </div>
      </div>
    </div>
  );
}

export default AdminMasterCuisines;