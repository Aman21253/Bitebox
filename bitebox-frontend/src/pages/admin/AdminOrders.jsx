import { useEffect,useMemo,useState } from "react";
import { Search,ShoppingBag,IndianRupee,RefreshCw,Clock3,Truck,CheckCircle2,AlertCircle } from "lucide-react";
import API from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminSkeleton from "../../components/admin/AdminSkeleton";
import AdminEmptyState from "../../components/admin/AdminEmptyState";

function AdminOrders() {
  const [orders,setOrders]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [search,setSearch]=useState("");

  useEffect(()=>{fetchOrders();},[]);

  const fetchOrders=async()=>{
    setLoading(true);
    setError("");

    try{
      const response=await API.get("/admin/orders");
      setOrders(response.data);
    }catch(error){
      console.log(error);
      setError("Failed to load orders");
    }finally{
      setLoading(false);
    }
  };

  const filteredOrders=useMemo(()=>{
    return orders.filter((order)=>
      order.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.id?.toString().includes(search) ||
      order.payment_status?.toLowerCase().includes(search.toLowerCase()) ||
      order.delivery_status?.toLowerCase().includes(search.toLowerCase())
    );
  },[orders,search]);

  const completedOrders=orders.filter(
    (o)=>o.delivery_status==="delivered"
  ).length;

  const activeOrders=orders.filter(
    (o)=>
      o.delivery_status==="driver_assigned" ||
      o.delivery_status==="picked_up" ||
      o.delivery_status==="on_the_way"
  ).length;

  const totalRevenue=orders.reduce(
    (sum,o)=>sum+(o.total_amount || 0),
    0
  );

  const getPaymentBadge=(status)=>{
    if(status==="paid"){
      return "bg-green-500/10 text-green-300 border border-green-500/20";
    }

    if(status==="pending"){
      return "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20";
    }

    return "bg-red-500/10 text-red-300 border border-red-500/20";
  };

  const getDeliveryBadge=(status)=>{
    if(status==="delivered"){
      return "bg-green-500/10 text-green-300 border border-green-500/20";
    }

    if(
      status==="driver_assigned" ||
      status==="picked_up" ||
      status==="on_the_way"
    ){
      return "bg-blue-500/10 text-blue-300 border border-blue-500/20";
    }

    if(status==="waiting_for_driver"){
      return "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20";
    }

    return "bg-red-500/10 text-red-300 border border-red-500/20";
  };

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
                Platform Orders
              </h1>

              <p className="text-gray-500 mt-3 text-sm md:text-base">
                Monitor all customer orders across the platform.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="h-14 px-6 rounded-2xl bg-orange-500 hover:bg-orange-400 transition-all font-bold flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
            >
              <RefreshCw size={18} />
              Refresh Orders
            </button>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5">
                <ShoppingBag className="text-orange-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Total Orders
              </p>

              <h2 className="text-4xl font-black">
                {orders.length}
              </h2>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5">
                <IndianRupee className="text-green-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Total Revenue
              </p>

              <h2 className="text-4xl font-black text-green-400">
                ₹{totalRevenue}
              </h2>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <Truck className="text-blue-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Active Deliveries
              </p>

              <h2 className="text-4xl font-black text-blue-400">
                {activeOrders}
              </h2>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                <CheckCircle2 className="text-emerald-400" size={26} />
              </div>

              <p className="text-gray-500 mb-2">
                Completed Orders
              </p>

              <h2 className="text-4xl font-black text-emerald-400">
                {completedOrders}
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
                placeholder="Search by order ID, customer or status..."
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
                      Failed To Load Orders
                    </h2>

                    <p className="text-red-200/80 text-sm mb-5">
                      {error}
                    </p>

                    <button
                      onClick={fetchOrders}
                      className="h-11 px-5 rounded-xl bg-red-500 hover:bg-red-400 transition-all font-bold"
                    >
                      Retry
                    </button>
                  </div>
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
                <AdminSkeleton className="h-20 rounded-[24px]" />
                <AdminSkeleton className="h-20 rounded-[24px]" />
              </div>
            ) : filteredOrders.length===0 ? (
              <AdminEmptyState
                icon={ShoppingBag}
                title="No Orders Found"
                description="There are currently no platform orders available."
              />
            ) : (
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">
                <div className="overflow-x-auto">

                  <table className="w-full min-w-[950px]">

                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02]">

                        <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                          Order
                        </th>

                        <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                          Customer
                        </th>

                        <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                          Amount
                        </th>

                        <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                          Payment
                        </th>

                        <th className="px-8 py-6 text-left text-gray-400 font-semibold">
                          Delivery
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {
                        filteredOrders.map((order)=>(
                          <tr
                            key={order.id}
                            className="border-b border-white/5 hover:bg-white/[0.03] transition-all"
                          >

                            <td className="px-8 py-6">
                              <div>
                                <p className="font-black text-lg">
                                  #{order.id}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  Order ID
                                </p>
                              </div>
                            </td>

                            <td className="px-8 py-6">
                              <div>
                                <p className="font-semibold">
                                  {order.customer?.name || "Unknown"}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  Customer
                                </p>
                              </div>
                            </td>

                            <td className="px-8 py-6">
                              <div>
                                <p className="text-orange-400 font-black text-lg">
                                  ₹{order.total_amount}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  Total Amount
                                </p>
                              </div>
                            </td>

                            <td className="px-8 py-6">
                              <span className={`px-4 py-2 rounded-xl text-xs font-bold capitalize ${getPaymentBadge(order.payment_status)}`}>
                                {order.payment_status}
                              </span>
                            </td>

                            <td className="px-8 py-6">
                              <span className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap ${getDeliveryBadge(order.delivery_status)}`}>
                                {order.delivery_status?.replaceAll("_"," ")}
                              </span>
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

export default AdminOrders;