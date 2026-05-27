import { useEffect,useMemo,useState } from "react";
import { Plus,Pencil,Check,X,Coins,Search,RefreshCw,BadgeIndianRupee,Globe,AlertCircle } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminSkeleton from "../../components/admin/AdminSkeleton";
import AdminEmptyState from "../../components/admin/AdminEmptyState";

const BLANK={
  name:"",
  code:"",
  symbol:"",
  is_default:false,
  is_active:true
};

function AdminMasterCurrencies() {
  const [currencies,setCurrencies]=useState([]);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [showForm,setShowForm]=useState(false);
  const [editing,setEditing]=useState(null);
  const [search,setSearch]=useState("");
  const [error,setError]=useState("");
  const [form,setForm]=useState(BLANK);

  useEffect(()=>{
    fetchCurrencies();
  },[]);

  const fetchCurrencies=async()=>{
    setLoading(true);
    setError("");

    try{
      const res=await API.get("/admin/master/currencies");
      setCurrencies(res.data);
    }catch(e){
      console.log(e);
      setError("Failed to load currencies");
    }finally{
      setLoading(false);
    }
  };

  const save=async()=>{
    if(!form.name || !form.code || !form.symbol){
      return alert("Please fill all required fields");
    }

    setSaving(true);

    try{
      if(editing){
        await API.put(`/admin/master/currencies/${editing.id}`,form);
      }else{
        await API.post("/admin/master/currencies",form);
      }

      setForm(BLANK);
      setEditing(null);
      setShowForm(false);

      fetchCurrencies();
    }catch(e){
      console.log(e);
    }finally{
      setSaving(false);
    }
  };

  const filteredCurrencies=useMemo(()=>{
    return currencies.filter((c)=>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.code?.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol?.toLowerCase().includes(search.toLowerCase())
    );
  },[currencies,search]);

  const activeCurrencies=currencies.filter(
    (c)=>c.is_active
  ).length;

  const defaultCurrency=currencies.find(
    (c)=>c.is_default
  );

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
                Currency Master
              </h1>

              <p className="text-gray-500 mt-3 text-sm md:text-base">
                Manage supported currencies for your platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">

              <button
                onClick={fetchCurrencies}
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
                Add Currency
              </button>

            </div>

          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">

              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5">
                <Coins className="text-orange-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Total Currencies
              </p>

              <h2 className="text-4xl font-black">
                {currencies.length}
              </h2>

            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">

              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5">
                <BadgeIndianRupee className="text-green-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Active Currencies
              </p>

              <h2 className="text-4xl font-black text-green-400">
                {activeCurrencies}
              </h2>

            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">

              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <Globe className="text-blue-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Default Currency
              </p>

              <h2 className="text-3xl font-black text-blue-400 truncate">
                {defaultCurrency?.code || "None"}
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
                placeholder="Search currencies..."
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
                      onClick={fetchCurrencies}
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
                        ? "Edit Currency"
                        : "Create New Currency"
                      }
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Configure supported platform currencies.
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

                  <div className="md:col-span-3">

                    <p className="text-sm text-gray-400 mb-3">
                      Currency Name
                    </p>

                    <input
                      value={form.name}
                      onChange={(e)=>setForm({...form,name:e.target.value})}
                      placeholder="Indian Rupee"
                      className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 px-5 outline-none focus:border-orange-500 transition-all"
                    />

                  </div>

                  <div>

                    <p className="text-sm text-gray-400 mb-3">
                      Currency Code
                    </p>

                    <input
                      value={form.code}
                      onChange={(e)=>setForm({...form,code:e.target.value.toUpperCase()})}
                      placeholder="INR"
                      className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 px-5 outline-none focus:border-orange-500 transition-all uppercase"
                    />

                  </div>

                  <div>

                    <p className="text-sm text-gray-400 mb-3">
                      Currency Symbol
                    </p>

                    <input
                      value={form.symbol}
                      onChange={(e)=>setForm({...form,symbol:e.target.value})}
                      placeholder="₹"
                      className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 px-5 outline-none focus:border-orange-500 transition-all"
                    />

                  </div>

                  <div className="flex items-end">

                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 cursor-pointer w-full h-14">

                      <input
                        type="checkbox"
                        checked={form.is_default}
                        onChange={(e)=>setForm({...form,is_default:e.target.checked})}
                        className="w-4 h-4 accent-orange-500"
                      />

                      <span className="text-sm font-medium text-gray-300">
                        Set As Default
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
                      ? "Update Currency"
                      : "Save Currency"
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
            ) : filteredCurrencies.length===0 ? (
              <AdminEmptyState
                icon={Coins}
                title="No Currencies Found"
                description="Create your first supported currency to get started."
              />
            ) : (
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[950px]">

                    <thead>

                      <tr className="border-b border-white/10 bg-white/[0.02]">

                        <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                          Currency
                        </th>

                        <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                          Code
                        </th>

                        <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                          Symbol
                        </th>

                        <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                          Default
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
                        filteredCurrencies.map((c)=>(
                          <tr
                            key={c.id}
                            className="border-b border-white/5 hover:bg-white/[0.03] transition-all"
                          >

                            <td className="px-8 py-6">

                              <div>

                                <p className="font-black text-lg">
                                  {c.name}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  Currency ID #{c.id}
                                </p>

                              </div>

                            </td>

                            <td className="px-8 py-6">

                              <span className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 text-sm font-bold uppercase">
                                {c.code}
                              </span>

                            </td>

                            <td className="px-8 py-6">

                              <span className="text-2xl font-black text-orange-400">
                                {c.symbol}
                              </span>

                            </td>

                            <td className="px-8 py-6">

                              {
                                c.is_default
                                ? (
                                  <span className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500/10 text-orange-300 border border-orange-500/20">
                                    Default
                                  </span>
                                )
                                : (
                                  <span className="text-gray-600 text-sm">
                                    —
                                  </span>
                                )
                              }

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

                              <button
                                onClick={()=>{
                                  setEditing(c);

                                  setForm({
                                    name:c.name,
                                    code:c.code,
                                    symbol:c.symbol,
                                    is_default:c.is_default,
                                    is_active:c.is_active
                                  });

                                  setShowForm(true);
                                }}
                                className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-orange-500/20 hover:border-orange-500/20 hover:text-orange-400 transition-all flex items-center justify-center"
                              >
                                <Pencil size={16} />
                              </button>

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

export default AdminMasterCurrencies;