import { useEffect,useMemo,useState } from "react";
import { Plus,Pencil,Trash2,Check,X,ChevronRight,Globe2,MapPinned,Search,RefreshCw,AlertCircle } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminSkeleton from "../../components/admin/AdminSkeleton";
import AdminEmptyState from "../../components/admin/AdminEmptyState";

const COUNTRY_FORM={
  name:"",
  code:"",
  is_active:true
};

const STATE_FORM={
  name:"",
  country_id:"",
  is_active:true
};

function AdminMasterCountries() {
  const [countries,setCountries]=useState([]);
  const [states,setStates]=useState([]);
  const [selectedCountry,setSelectedCountry]=useState(null);

  const [loading,setLoading]=useState(true);
  const [stateLoading,setStateLoading]=useState(false);

  const [tab,setTab]=useState("countries");

  const [showForm,setShowForm]=useState(false);
  const [editing,setEditing]=useState(null);

  const [countrySearch,setCountrySearch]=useState("");
  const [stateSearch,setStateSearch]=useState("");

  const [error,setError]=useState("");

  const [form,setForm]=useState(COUNTRY_FORM);

  const [stateForm,setStateForm]=useState(STATE_FORM);

  useEffect(()=>{
    fetchCountries();
  },[]);

  const fetchCountries=async()=>{
    setLoading(true);
    setError("");

    try{
      const res=await API.get("/admin/master/countries");
      setCountries(res.data);
    }catch(e){
      console.log(e);
      setError("Failed to load countries");
    }finally{
      setLoading(false);
    }
  };

  const fetchStates=async(countryId)=>{
    setStateLoading(true);

    try{
      const res=await API.get(`/admin/master/states?country_id=${countryId}`);
      setStates(res.data);
    }catch(e){
      console.log(e);
    }finally{
      setStateLoading(false);
    }
  };

  const selectCountry=(country)=>{
    setSelectedCountry(country);

    setTab("states");

    fetchStates(country.id);

    setStateForm({
      name:"",
      country_id:country.id,
      is_active:true
    });

    setShowForm(false);
  };

  const saveCountry=async()=>{
    if(!form.name || !form.code){
      return alert("Please fill all fields");
    }

    try{
      if(editing){
        await API.put(`/admin/master/countries/${editing.id}`,form);
      }else{
        await API.post("/admin/master/countries",form);
      }

      setForm(COUNTRY_FORM);

      setEditing(null);

      setShowForm(false);

      fetchCountries();
    }catch(e){
      console.log(e);
    }
  };

  const saveState=async()=>{
    if(!stateForm.name){
      return alert("State name required");
    }

    try{
      if(editing){
        await API.put(`/admin/master/states/${editing.id}`,stateForm);
      }else{
        await API.post("/admin/master/states",stateForm);
      }

      setStateForm({
        name:"",
        country_id:selectedCountry.id,
        is_active:true
      });

      setEditing(null);

      setShowForm(false);

      fetchStates(selectedCountry.id);
    }catch(e){
      console.log(e);
    }
  };

  const removeCountry=async(id)=>{
    if(!confirm("Delete country?")) return;

    try{
      await API.delete(`/admin/master/countries/${id}`);
      fetchCountries();
    }catch(e){
      console.log(e);
    }
  };

  const removeState=async(id)=>{
    if(!confirm("Delete state?")) return;

    try{
      await API.delete(`/admin/master/states/${id}`);
      fetchStates(selectedCountry.id);
    }catch(e){
      console.log(e);
    }
  };

  const filteredCountries=useMemo(()=>{
    return countries.filter((c)=>
      c.name?.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code?.toLowerCase().includes(countrySearch.toLowerCase())
    );
  },[countries,countrySearch]);

  const filteredStates=useMemo(()=>{
    return states.filter((s)=>
      s.name?.toLowerCase().includes(stateSearch.toLowerCase())
    );
  },[states,stateSearch]);

  const activeCountries=countries.filter(
    (c)=>c.is_active
  ).length;

  const activeStates=states.filter(
    (s)=>s.is_active
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

              {
                tab==="states" && selectedCountry ? (
                  <div className="flex items-center gap-3 flex-wrap">

                    <button
                      onClick={()=>{
                        setTab("countries");
                        setSelectedCountry(null);
                        setShowForm(false);
                      }}
                      className="text-gray-500 hover:text-white transition-all text-3xl md:text-4xl font-black"
                    >
                      Countries
                    </button>

                    <ChevronRight
                      size={28}
                      className="text-gray-600"
                    />

                    <h1 className="text-3xl md:text-5xl font-black">
                      {selectedCountry.name}
                    </h1>

                  </div>
                ) : (
                  <h1 className="text-4xl md:text-5xl font-black">
                    Country / State Master
                  </h1>
                )
              }

              <p className="text-gray-500 mt-3">
                Manage countries and states across the platform.
              </p>

            </div>

            <div className="flex flex-col sm:flex-row gap-4">

              <button
                onClick={()=>{
                  if(tab==="countries"){
                    fetchCountries();
                  }else{
                    fetchStates(selectedCountry.id);
                  }
                }}
                className="h-14 px-6 rounded-2xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] transition-all font-bold flex items-center justify-center gap-3"
              >
                <RefreshCw size={18} />
                Refresh
              </button>

              <button
                onClick={()=>{
                  setShowForm(true);
                  setEditing(null);

                  if(tab==="countries"){
                    setForm(COUNTRY_FORM);
                  }else{
                    setStateForm({
                      name:"",
                      country_id:selectedCountry.id,
                      is_active:true
                    });
                  }
                }}
                className="h-14 px-7 rounded-2xl bg-orange-500 hover:bg-orange-400 transition-all font-bold flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
              >
                <Plus size={18} />
                Add {tab==="states" ? "State" : "Country"}
              </button>

            </div>

          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">

              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5">
                <Globe2 className="text-orange-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Total Countries
              </p>

              <h2 className="text-4xl font-black">
                {countries.length}
              </h2>

              <p className="text-sm text-green-400 mt-2">
                {activeCountries} active
              </p>

            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">

              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <MapPinned className="text-blue-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Total States
              </p>

              <h2 className="text-4xl font-black">
                {states.length}
              </h2>

              <p className="text-sm text-green-400 mt-2">
                {activeStates} active
              </p>

            </div>

          </div>

          {/* SEARCH */}

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 mb-8">

            <div className="relative w-full lg:max-w-md">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                value={
                  tab==="countries"
                  ? countrySearch
                  : stateSearch
                }
                onChange={(e)=>{
                  if(tab==="countries"){
                    setCountrySearch(e.target.value);
                  }else{
                    setStateSearch(e.target.value);
                  }
                }}
                placeholder={`Search ${tab}...`}
                className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 pl-12 pr-5 outline-none focus:border-orange-500 transition-all"
              />

            </div>

          </div>

          {/* ERROR */}

          {
            error && (
              <div className="mb-8 rounded-[28px] border border-red-500/20 bg-red-500/10 p-6">

                <div className="flex items-start gap-4">

                  <AlertCircle
                    size={22}
                    className="text-red-400 shrink-0 mt-1"
                  />

                  <div>

                    <h2 className="text-red-400 font-black text-xl mb-2">
                      Failed To Load
                    </h2>

                    <p className="text-red-200/80 text-sm mb-5">
                      {error}
                    </p>

                    <button
                      onClick={fetchCountries}
                      className="h-11 px-5 rounded-xl bg-red-500 hover:bg-red-400 transition-all font-bold"
                    >
                      Retry
                    </button>

                  </div>

                </div>

              </div>
            )
          }

          {/* COUNTRY FORM */}

          {
            showForm && tab==="countries" && (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7 mb-8">

                <div className="flex items-center justify-between mb-7">

                  <div>

                    <h2 className="text-3xl font-black">
                      {
                        editing
                        ? "Edit Country"
                        : "Create Country"
                      }
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Add countries available on the platform.
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">

                  <div>

                    <p className="text-sm text-gray-400 mb-3">
                      Country Name
                    </p>

                    <input
                      value={form.name}
                      onChange={(e)=>setForm({...form,name:e.target.value})}
                      placeholder="India"
                      className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 px-5 outline-none focus:border-orange-500 transition-all"
                    />

                  </div>

                  <div>

                    <p className="text-sm text-gray-400 mb-3">
                      Country Code
                    </p>

                    <input
                      value={form.code}
                      onChange={(e)=>setForm({...form,code:e.target.value})}
                      placeholder="IN"
                      className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 px-5 uppercase outline-none focus:border-orange-500 transition-all"
                    />

                  </div>

                </div>

                <div className="flex items-center gap-4 mb-7">

                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e)=>setForm({...form,is_active:e.target.checked})}
                      className="accent-orange-500"
                    />

                    <span className="text-sm text-gray-300">
                      Active
                    </span>

                  </label>

                </div>

                <div className="flex flex-col sm:flex-row gap-4">

                  <button
                    onClick={saveCountry}
                    className="h-14 px-8 rounded-2xl bg-orange-500 hover:bg-orange-400 transition-all font-bold flex items-center justify-center gap-3"
                  >
                    <Check size={18} />
                    Save Country
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

          {/* STATE FORM */}

          {
            showForm && tab==="states" && (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7 mb-8">

                <div className="flex items-center justify-between mb-7">

                  <div>

                    <h2 className="text-3xl font-black">
                      {
                        editing
                        ? "Edit State"
                        : "Create State"
                      }
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Add states for {selectedCountry?.name}
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

                <div className="mb-7">

                  <p className="text-sm text-gray-400 mb-3">
                    State Name
                  </p>

                  <input
                    value={stateForm.name}
                    onChange={(e)=>setStateForm({...stateForm,name:e.target.value})}
                    placeholder="Haryana"
                    className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 px-5 outline-none focus:border-orange-500 transition-all"
                  />

                </div>

                <div className="flex items-center gap-4 mb-7">

                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={stateForm.is_active}
                      onChange={(e)=>setStateForm({...stateForm,is_active:e.target.checked})}
                      className="accent-orange-500"
                    />

                    <span className="text-sm text-gray-300">
                      Active
                    </span>

                  </label>

                </div>

                <div className="flex flex-col sm:flex-row gap-4">

                  <button
                    onClick={saveState}
                    className="h-14 px-8 rounded-2xl bg-orange-500 hover:bg-orange-400 transition-all font-bold flex items-center justify-center gap-3"
                  >
                    <Check size={18} />
                    Save State
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

          {/* COUNTRIES TABLE */}

          {
            tab==="countries" && (
              <>
                {
                  loading ? (
                    <div className="space-y-4">
                      <AdminSkeleton className="h-20 rounded-[24px]" />
                      <AdminSkeleton className="h-20 rounded-[24px]" />
                      <AdminSkeleton className="h-20 rounded-[24px]" />
                    </div>
                  ) : filteredCountries.length===0 ? (
                    <AdminEmptyState
                      icon={Globe2}
                      title="No Countries Found"
                      description="Add your first country to get started."
                    />
                  ) : (
                    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">

                      <div className="overflow-x-auto">

                        <table className="w-full min-w-[950px]">

                          <thead>

                            <tr className="border-b border-white/10 bg-white/[0.02]">

                              <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                                Country
                              </th>

                              <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                                Code
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
                              filteredCountries.map((country)=>(
                                <tr
                                  key={country.id}
                                  onClick={()=>selectCountry(country)}
                                  className="border-b border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer"
                                >

                                  <td className="px-8 py-6">

                                    <div>

                                      <p className="font-black text-lg">
                                        {country.name}
                                      </p>

                                      <p className="text-xs text-gray-500 mt-1">
                                        Click to view states
                                      </p>

                                    </div>

                                  </td>

                                  <td className="px-8 py-6 text-gray-300 font-semibold">
                                    {country.code}
                                  </td>

                                  <td className="px-8 py-6">

                                    <span className={`px-4 py-2 rounded-xl text-xs font-bold ${
                                      country.is_active
                                      ? "bg-green-500/10 text-green-300 border border-green-500/20"
                                      : "bg-red-500/10 text-red-300 border border-red-500/20"
                                    }`}>
                                      {
                                        country.is_active
                                        ? "Active"
                                        : "Inactive"
                                      }
                                    </span>

                                  </td>

                                  <td
                                    className="px-8 py-6"
                                    onClick={(e)=>e.stopPropagation()}
                                  >

                                    <div className="flex items-center gap-3">

                                      <button
                                        onClick={()=>{
                                          setEditing(country);

                                          setForm({
                                            name:country.name,
                                            code:country.code,
                                            is_active:country.is_active
                                          });

                                          setShowForm(true);
                                        }}
                                        className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-orange-500/20 hover:border-orange-500/20 hover:text-orange-400 transition-all flex items-center justify-center"
                                      >
                                        <Pencil size={16} />
                                      </button>

                                      <button
                                        onClick={()=>removeCountry(country.id)}
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
              </>
            )
          }

          {/* STATES TABLE */}

          {
            tab==="states" && (
              <>
                {
                  stateLoading ? (
                    <div className="space-y-4">
                      <AdminSkeleton className="h-20 rounded-[24px]" />
                      <AdminSkeleton className="h-20 rounded-[24px]" />
                    </div>
                  ) : filteredStates.length===0 ? (
                    <AdminEmptyState
                      icon={MapPinned}
                      title="No States Found"
                      description={`No states added for ${selectedCountry?.name}.`}
                    />
                  ) : (
                    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">

                      <div className="overflow-x-auto">

                        <table className="w-full min-w-[850px]">

                          <thead>

                            <tr className="border-b border-white/10 bg-white/[0.02]">

                              <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                                State
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
                              filteredStates.map((state)=>(
                                <tr
                                  key={state.id}
                                  className="border-b border-white/5 hover:bg-white/[0.03] transition-all"
                                >

                                  <td className="px-8 py-6">

                                    <div>

                                      <p className="font-black text-lg">
                                        {state.name}
                                      </p>

                                      <p className="text-xs text-gray-500 mt-1">
                                        {selectedCountry?.name}
                                      </p>

                                    </div>

                                  </td>

                                  <td className="px-8 py-6">

                                    <span className={`px-4 py-2 rounded-xl text-xs font-bold ${
                                      state.is_active
                                      ? "bg-green-500/10 text-green-300 border border-green-500/20"
                                      : "bg-red-500/10 text-red-300 border border-red-500/20"
                                    }`}>
                                      {
                                        state.is_active
                                        ? "Active"
                                        : "Inactive"
                                      }
                                    </span>

                                  </td>

                                  <td className="px-8 py-6">

                                    <div className="flex items-center gap-3">

                                      <button
                                        onClick={()=>{
                                          setEditing(state);

                                          setStateForm({
                                            name:state.name,
                                            country_id:selectedCountry.id,
                                            is_active:state.is_active
                                          });

                                          setShowForm(true);
                                        }}
                                        className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-orange-500/20 hover:border-orange-500/20 hover:text-orange-400 transition-all flex items-center justify-center"
                                      >
                                        <Pencil size={16} />
                                      </button>

                                      <button
                                        onClick={()=>removeState(state.id)}
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
              </>
            )
          }

        </div>
      </div>
    </div>
  );
}

export default AdminMasterCountries;