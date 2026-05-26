import {
  LayoutDashboard, Store, Users, ClipboardList,
  BarChart3, ShieldBan, LogOut, ChevronDown,
  UtensilsCrossed, Globe, Percent, DollarSign,
  Languages, Settings, Mail, MessageSquare,
  CreditCard, AlertTriangle, Bell, Layout,
  FileText, Wrench,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [masterOpen, setMasterOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  const mainMenu = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { title: "Restaurants", icon: Store, path: "/admin/restaurants" },
    { title: "Users", icon: Users, path: "/admin/users" },
    { title: "Orders", icon: ClipboardList, path: "/admin/orders" },
    { title: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  ];

  const masterMenu = [
    { title: "Cuisine", icon: UtensilsCrossed, path: "/admin/master/cuisines" },
    { title: "Country / State", icon: Globe, path: "/admin/master/countries" },
    { title: "Tax", icon: Percent, path: "/admin/master/taxes" },
    { title: "Currency", icon: DollarSign, path: "/admin/master/currencies" },
    { title: "Language", icon: Languages, path: "/admin/master/languages" },
  ];

  const configMenu = [
    { title: "Platform Fee", icon: DollarSign, path: "/admin/config/platform-fees" },
    { title: "Commission", icon: Percent, path: "/admin/config/commissions" },
    { title: "Audit Logs", icon: FileText, path: "/admin/config/audit-logs" },
    { title: "App Config", icon: Settings, path: "/admin/config/app" },
    { title: "SMTP", icon: Mail, path: "/admin/config/smtp" },
    { title: "SMS", icon: MessageSquare, path: "/admin/config/sms" },
    { title: "Payment", icon: CreditCard, path: "/admin/config/payment" },
    { title: "Maintenance", icon: Wrench, path: "/admin/config/maintenance" },
    { title: "Notif Templates", icon: Bell, path: "/admin/config/notification-templates" },
    { title: "Home Layout", icon: Layout, path: "/admin/config/home-layout" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const NavLink = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
          ${isActive
            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
            : "hover:bg-white/5 text-gray-300"}`}
      >
        <Icon size={18} />
        <span className="font-semibold text-[14px]">{item.title}</span>
      </Link>
    );
  };

  const isMasterActive = masterMenu.some(i => location.pathname === i.path);
  const isConfigActive = configMenu.some(i => location.pathname === i.path);

  return (
    <div className="w-[270px] min-h-screen bg-black/30 backdrop-blur-2xl border-r border-white/10 p-5 flex flex-col justify-between overflow-y-auto">
      <div>
        {/* LOGO */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            BiteBox
          </h1>
          <p className="text-gray-500 text-sm mt-1">Admin Portal</p>
        </div>

        {/* MAIN NAV */}
        <div className="space-y-1 mb-4">
          {mainMenu.map(item => <NavLink key={item.title} item={item} />)}
        </div>

        {/* MASTER DATA */}
        <div className="mb-4">
          <button
            onClick={() => setMasterOpen(!masterOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300
              ${isMasterActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"}`}
          >
            <div className="flex items-center gap-3">
              <Globe size={18} />
              <span className="font-bold text-[14px]">Master Data</span>
            </div>
            <ChevronDown size={16} className={`transition-transform duration-300 ${masterOpen ? "rotate-180" : ""}`} />
          </button>
          {masterOpen && (
            <div className="mt-1 ml-3 space-y-1 border-l border-white/10 pl-3">
              {masterMenu.map(item => <NavLink key={item.title} item={item} />)}
            </div>
          )}
        </div>

        {/* PLATFORM CONFIG */}
        <div className="mb-4">
          <button
            onClick={() => setConfigOpen(!configOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300
              ${isConfigActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"}`}
          >
            <div className="flex items-center gap-3">
              <Settings size={18} />
              <span className="font-bold text-[14px]">Platform Config</span>
            </div>
            <ChevronDown size={16} className={`transition-transform duration-300 ${configOpen ? "rotate-180" : ""}`} />
          </button>
          {configOpen && (
            <div className="mt-1 ml-3 space-y-1 border-l border-white/10 pl-3">
              {configMenu.map(item => <NavLink key={item.title} item={item} />)}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="space-y-3">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex items-center gap-3 mb-2">
            <ShieldBan className="text-red-400" size={18} />
            <p className="font-bold text-sm">Admin Access</p>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">Platform moderation & approval controls.</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 font-bold flex items-center justify-center gap-3 hover:bg-red-500/20 transition-all duration-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;