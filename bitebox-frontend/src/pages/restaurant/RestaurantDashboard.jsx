import {
  ShoppingBag,
  IndianRupee,
  Clock3,
  Bike,
  Bell,
  UtensilsCrossed,
} from "lucide-react";

import { useEffect, useState } from "react";

import API from "../../api/axios";

import RestaurantSidebar from "../../components/restaurant/RestaurantSidebar";

function RestaurantDashboard() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notRegistered, setNotRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const [regForm, setRegForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    cuisine: "",
    delivery_radius: 5,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ─────────────────────────────────────
  // FETCH DASHBOARD
  // ─────────────────────────────────────

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, ordersResponse] = await Promise.all([
        API.get("/restaurant/dashboard/stats"),
        API.get("/restaurant/dashboard/recent-orders"),
      ]);
      setStats(statsResponse.data);
      setRecentOrders(ordersResponse.data);
      setNotRegistered(false);
    } catch (error) {
      // 404 means no restaurant record exists yet
      if (error.response?.status === 404 || error.response?.status === 403) {
        setNotRegistered(true);
      } else {
        console.error("Dashboard fetch failed:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────
  // RESTAURANT SELF-REGISTRATION
  // ─────────────────────────────────────

  const handleRegister = async () => {
    if (
      !regForm.name ||
      !regForm.address ||
      !regForm.city ||
      !regForm.state ||
      !regForm.pincode ||
      !regForm.phone ||
      !regForm.cuisine
    ) {
      alert("Please fill all required fields");
      return;
    }
    setRegLoading(true);
    try {
      await API.post("/restaurants/register", regForm);
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  // ─────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white text-4xl font-black">
        Loading Dashboard...
      </div>
    );
  }

  // ─────────────────────────────────────
  // INLINE RESTAURANT REGISTRATION
  // ─────────────────────────────────────

  if (notRegistered) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-white px-5 py-10">
        <div className="w-full max-w-2xl bg-white/[0.04] border border-white/10 rounded-[35px] p-10 space-y-5">

          <div className="mb-2">
            <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">
              One More Step
            </p>
            <h1 className="text-4xl font-black">Register Your Restaurant</h1>
            <p className="text-gray-400 mt-3">
              Fill in your restaurant details to get started.
            </p>
          </div>

          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Restaurant Name *</label>
              <input
                className="w-full h-14 rounded-2xl bg-white/[0.06] border border-white/10 px-5 text-white placeholder-gray-500 outline-none"
                placeholder="e.g. Spice Garden"
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Cuisine Type *</label>
              <input
                className="w-full h-14 rounded-2xl bg-white/[0.06] border border-white/10 px-5 text-white placeholder-gray-500 outline-none"
                placeholder="e.g. North Indian, Chinese"
                value={regForm.cuisine}
                onChange={(e) => setRegForm({ ...regForm, cuisine: e.target.value })}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Description</label>
            <textarea
              className="w-full h-24 rounded-2xl bg-white/[0.06] border border-white/10 px-5 py-4 text-white placeholder-gray-500 outline-none resize-none"
              placeholder="Short description of your restaurant"
              value={regForm.description}
              onChange={(e) => setRegForm({ ...regForm, description: e.target.value })}
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Full Address *</label>
            <input
              className="w-full h-14 rounded-2xl bg-white/[0.06] border border-white/10 px-5 text-white placeholder-gray-500 outline-none"
              placeholder="Street address"
              value={regForm.address}
              onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
            />
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">City *</label>
              <input
                className="w-full h-14 rounded-2xl bg-white/[0.06] border border-white/10 px-5 text-white placeholder-gray-500 outline-none"
                placeholder="City"
                value={regForm.city}
                onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">State *</label>
              <input
                className="w-full h-14 rounded-2xl bg-white/[0.06] border border-white/10 px-5 text-white placeholder-gray-500 outline-none"
                placeholder="State"
                value={regForm.state}
                onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Pincode *</label>
              <input
                className="w-full h-14 rounded-2xl bg-white/[0.06] border border-white/10 px-5 text-white placeholder-gray-500 outline-none"
                placeholder="302001"
                value={regForm.pincode}
                onChange={(e) => setRegForm({ ...regForm, pincode: e.target.value })}
              />
            </div>
          </div>

          {/* ROW 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Phone Number *</label>
              <input
                className="w-full h-14 rounded-2xl bg-white/[0.06] border border-white/10 px-5 text-white placeholder-gray-500 outline-none"
                placeholder="Restaurant contact number"
                value={regForm.phone}
                onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Delivery Radius (km)</label>
              <input
                type="number"
                className="w-full h-14 rounded-2xl bg-white/[0.06] border border-white/10 px-5 text-white placeholder-gray-500 outline-none"
                placeholder="5"
                value={regForm.delivery_radius}
                onChange={(e) => setRegForm({ ...regForm, delivery_radius: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* NOTICE */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl px-5 py-4 text-orange-300 text-sm">
            Your restaurant will be reviewed by our team before going live. This usually takes 24 hours.
          </div>

          <button
            onClick={handleRegister}
            disabled={regLoading}
            className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-400 font-black text-lg disabled:opacity-50 transition-colors"
          >
            {regLoading ? "Submitting..." : "Submit for Approval"}
          </button>

        </div>
      </div>
    );
  }

  // ─────────────────────────────────────
  // MAIN DASHBOARD
  // ─────────────────────────────────────

  const dashboardStats = [
    { title: "Total Orders", value: stats?.total_orders || 0, icon: ShoppingBag },
    { title: "Revenue", value: `₹${stats?.total_revenue || 0}`, icon: IndianRupee },
    { title: "Preparing", value: stats?.preparing_orders || 0, icon: Clock3 },
    { title: "Active Deliveries", value: stats?.active_deliveries || 0, icon: Bike },
    { title: "Menu Items", value: stats?.total_menu_items || 0, icon: UtensilsCrossed },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex">

      <RestaurantSidebar />

      <div className="flex-1 px-10 py-10 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">

          {/* TOPBAR */}
          <div className="flex items-center justify-between mb-14">
            <div>
              <p className="text-orange-400 uppercase tracking-[3px] text-xs font-bold mb-3">
                Restaurant Dashboard
              </p>
              <h1 className="text-5xl font-black tracking-tight">
                Welcome, {user?.name}
              </h1>
            </div>
            <button className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
              <Bell size={22} />
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8 mb-14">
            {dashboardStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-7"
                >
                  <div className="absolute top-[-40px] right-[-30px] w-[120px] h-[120px] rounded-full bg-orange-500/10 blur-[60px]" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                      <Icon size={26} className="text-orange-400" />
                    </div>
                    <p className="text-gray-400 mb-3 text-sm">{stat.title}</p>
                    <h2 className="text-4xl font-black">{stat.value}</h2>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RECENT ORDERS */}
          <div className="bg-white/[0.03] border border-white/10 rounded-[36px] overflow-hidden p-2">
            <div className="px-8 py-7 border-b border-white/10">
              <h2 className="text-3xl font-black">Recent Orders</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/10">
                    <th className="px-8 py-6 text-gray-400">Order ID</th>
                    <th className="px-8 py-6 text-gray-400">Amount</th>
                    <th className="px-8 py-6 text-gray-400">Payment</th>
                    <th className="px-8 py-6 text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-10 text-center text-gray-500">
                        No orders yet. Your restaurant is pending approval.
                      </td>
                    </tr>
                  )}
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5">
                      <td className="px-8 py-6 font-bold">#{order.id}</td>
                      <td className="px-8 py-6 text-orange-400 font-semibold">
                        ₹{order.total_amount}
                      </td>
                      <td className="px-8 py-6 capitalize">{order.payment_status}</td>
                      <td className="px-8 py-6">
                        <span className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-semibold capitalize">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;