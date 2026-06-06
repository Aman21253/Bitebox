import { useEffect,useMemo,useState } from "react";
import { Search,Store,CheckCircle2,XCircle,Clock3,RefreshCw,MapPin,Phone,UtensilsCrossed } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminSkeleton from "../../components/admin/AdminSkeleton";
import AdminEmptyState from "../../components/admin/AdminEmptyState";

function AdminRestaurants() {
  const [restaurants,setRestaurants]=useState([]);
  const [loading,setLoading]=useState(true);
  const [actionLoading,setActionLoading]=useState({});
  const [search,setSearch]=useState("");
  const [error,setError]=useState("");

  useEffect(()=>{fetchRestaurants();},[]);

  const fetchRestaurants=async()=>{
    setLoading(true);
    setError("");

    try{
      const response=await API.get("/admin/restaurants/pending");
      setRestaurants(response.data);
    }catch(error){
      console.log(error);
      setError("Failed to load restaurants");
    }finally{
      setLoading(false);
    }
  };

  const approveRestaurant=async(id)=>{
    setActionLoading(prev=>({...prev,[id]:"approve"}));

    try{
      await API.post(`/admin/restaurants/${id}/approve`);
      fetchRestaurants();
    }catch(error){
      console.log(error);
    }finally{
      setActionLoading(prev=>({...prev,[id]:null}));
    }
  };

  const rejectRestaurant=async(id)=>{
    setActionLoading(prev=>({...prev,[id]:"reject"}));

    try{
      await API.post(`/admin/restaurants/${id}/reject`);
      fetchRestaurants();
    }catch(error){
      console.log(error);
    }finally{
      setActionLoading(prev=>({...prev,[id]:null}));
    }
  };

  const filteredRestaurants=useMemo(()=>{
    return restaurants.filter((restaurant)=>
      restaurant.name?.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.cuisine?.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(search.toLowerCase())
    );
  },[restaurants,search]);

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
                Restaurant Approvals
              </h1>

              <p className="text-gray-500 mt-3 text-sm md:text-base">
                Review and approve restaurant onboarding requests.
              </p>
            </div>

            <button
              onClick={fetchRestaurants}
              className="h-14 px-6 rounded-2xl bg-orange-500 hover:bg-orange-400 transition-all font-bold flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5">
                <Store className="text-orange-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Pending Restaurants
              </p>

              <h2 className="text-4xl font-black">
                {restaurants.length}
              </h2>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-5">
                <Clock3 className="text-yellow-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Under Review
              </p>

              <h2 className="text-4xl font-black text-yellow-400">
                {restaurants.length}
              </h2>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <UtensilsCrossed className="text-blue-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Unique Cuisines
              </p>

              <h2 className="text-4xl font-black text-blue-400">
                {[...new Set(restaurants.map(r=>r.cuisine))].length}
              </h2>
            </div>
          </div>

          {/* SEARCH */}

          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5 md:p-6 mb-8">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />

              <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search restaurant, cuisine or address..."
                className="w-full h-14 rounded-2xl bg-white/[0.04] border border-white/10 pl-12 pr-5 outline-none focus:border-orange-500 transition-all"
              />
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
                  onClick={fetchRestaurants}
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
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <AdminSkeleton className="h-[320px] rounded-[32px]" />
                <AdminSkeleton className="h-[320px] rounded-[32px]" />
                <AdminSkeleton className="h-[320px] rounded-[32px]" />
                <AdminSkeleton className="h-[320px] rounded-[32px]" />
              </div>
            ) : filteredRestaurants.length===0 ? (
              <AdminEmptyState
                icon={<Store size={40} className="text-orange-400" />}
                title="No Pending Restaurants"
                description="All restaurant approval requests have been processed."
              />
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-7">
                {
                  filteredRestaurants.map((restaurant)=>(
                    <div
                      key={restaurant.id}
                      className="rounded-[32px] border border-white/10 bg-white/[0.03] p-7 hover:border-orange-500/20 transition-all"
                    >

                      {/* TOP */}

                      <div className="flex items-start justify-between gap-5 mb-7">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                            <Store className="text-orange-400" size={28} />
                          </div>

                          <div>
                            <h2 className="text-3xl font-black leading-tight">
                              {restaurant.name}
                            </h2>

                            <p className="text-gray-500 text-sm mt-1">
                              Restaurant ID #{restaurant.id}
                            </p>
                          </div>
                        </div>

                        <span className="px-4 py-2 rounded-xl text-xs font-bold bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 whitespace-nowrap">
                          Pending
                        </span>
                      </div>

                      {/* INFO */}

                      <div className="space-y-4 mb-8">

                        <div className="flex items-start gap-3">
                          <UtensilsCrossed className="text-orange-400 shrink-0 mt-1" size={18} />

                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-[2px] mb-1">
                              Cuisine
                            </p>

                            <p className="text-gray-200">
                              {restaurant.cuisine || "Not Provided"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="text-orange-400 shrink-0 mt-1" size={18} />

                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-[2px] mb-1">
                              Address
                            </p>

                            <p className="text-gray-200 leading-relaxed">
                              {restaurant.address}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone className="text-orange-400 shrink-0 mt-1" size={18} />

                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-[2px] mb-1">
                              Contact Number
                            </p>

                            <p className="text-gray-200">
                              {restaurant.phone}
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <button
                          onClick={()=>approveRestaurant(restaurant.id)}
                          disabled={actionLoading[restaurant.id]}
                          className="h-14 rounded-2xl bg-green-500 hover:bg-green-400 transition-all font-bold flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          <CheckCircle2 size={18} />

                          {
                            actionLoading[restaurant.id]==="approve"
                            ? "Approving..."
                            : "Approve"
                          }
                        </button>

                        <button
                          onClick={()=>rejectRestaurant(restaurant.id)}
                          disabled={actionLoading[restaurant.id]}
                          className="h-14 rounded-2xl bg-red-500 hover:bg-red-400 transition-all font-bold flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          <XCircle size={18} />

                          {
                            actionLoading[restaurant.id]==="reject"
                            ? "Rejecting..."
                            : "Reject"
                          }
                        </button>

                      </div>

                    </div>
                  ))
                }
              </div>
            )
          }

        </div>
      </div>
    </div>
  );
}

export default AdminRestaurants;