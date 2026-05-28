import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  IndianRupee,
  Percent,
} from "lucide-react";

import API from "../../api/axios";

import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminCard from "../../components/admin/AdminCard";
import AdminSkeleton from "../../components/admin/AdminSkeleton";
import AdminEmptyState from "../../components/admin/AdminEmptyState";

const BLANK = {
  fee_type: "flat",
  value: "",
  min_order_amount: "",
  is_active: true,
};

function AdminConfigPlatformFees() {

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/admin/config/platform-fees");
      setFees(res.data);
    } catch (e) {
      console.log(e);
      setError("Failed to load platform fees");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      const payload = {
        ...form,
        value: parseFloat(form.value),
        min_order_amount: form.min_order_amount
          ? parseFloat(form.min_order_amount)
          : null,
      };

      if (editing) {
        await API.put(`/admin/config/platform-fees/${editing.id}`, payload);
      } else {
        await API.post("/admin/config/platform-fees", payload);
      }

      setForm(BLANK);
      setEditing(null);
      setShowForm(false);
      fetchFees();
    } catch (e) {
      console.log(e);
      setError("Failed to save platform fee");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete platform fee?")) return;
    try {
      await API.delete(`/admin/config/platform-fees/${id}`);
      fetchFees();
    } catch (e) {
      console.log(e);
      setError("Failed to delete platform fee");
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        eyebrow="Platform Config"
        title="Platform Fees"
        description="Manage flat and percentage based platform commissions for customer orders."
      />

      {error && (
        <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-5">
          <p className="text-red-400 font-semibold mb-1">Something went wrong</p>
          <p className="text-gray-300 text-sm">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-end mb-6">
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setForm(BLANK);
          }}
          className="h-14 px-6 rounded-2xl bg-orange-500 hover:bg-orange-400 transition-all font-bold flex items-center gap-2"
        >
          <Plus size={18} />
          Add Fee
        </button>
      </div>

      {showForm && (
        <AdminCard className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-orange-400 text-sm font-semibold mb-2">PLATFORM FEES</p>
              <h2 className="text-3xl font-black">
                {editing ? "Edit Fee" : "Create New Fee"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Fee Type</label>
              <select
                value={form.fee_type}
                onChange={(e) => setForm({ ...form, fee_type: e.target.value })}
                className="w-full h-12 rounded-2xl bg-white/[0.04] border border-white/10 px-5 outline-none focus:border-orange-500"
              >
                <option value="flat">Flat (₹)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Value</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="Enter fee value"
                className="w-full h-12 rounded-2xl bg-white/[0.04] border border-white/10 px-5 outline-none focus:border-orange-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Minimum Order Amount</label>
              <input
                type="number"
                value={form.min_order_amount}
                onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                placeholder="Optional minimum amount"
                className="w-full h-12 rounded-2xl bg-white/[0.04] border border-white/10 px-5 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={save}
              className="h-12 px-8 rounded-2xl bg-orange-500 hover:bg-orange-400 transition-all font-bold flex items-center gap-2"
            >
              <Check size={16} />
              Save
            </button>

            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="h-12 px-6 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] transition-all font-bold flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </AdminCard>
      )}

      {loading ? (
        <AdminSkeleton height="h-[420px]" />
      ) : fees.length === 0 ? (
        <AdminEmptyState
          icon={<IndianRupee size={40} className="text-orange-400" />}
          title="No Platform Fees Found"
          description="Create your first platform fee to start charging commissions on orders."
        />
      ) : (
        <AdminCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-5 text-left text-gray-400 font-semibold">Type</th>
                  <th className="px-6 py-5 text-left text-gray-400 font-semibold">Value</th>
                  <th className="px-6 py-5 text-left text-gray-400 font-semibold">Min Order</th>
                  <th className="px-6 py-5 text-left text-gray-400 font-semibold">Status</th>
                  <th className="px-6 py-5 text-left text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f) => (
                  <tr key={f.id} className="border-b border-white/5">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                          {f.fee_type === "flat" ? (
                            <IndianRupee size={18} className="text-orange-400" />
                          ) : (
                            <Percent size={18} className="text-orange-400" />
                          )}
                        </div>
                        <span className="capitalize font-bold">{f.fee_type}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-orange-400 font-bold">
                      {f.fee_type === "flat" ? `₹${f.value}` : `${f.value}%`}
                    </td>

                    <td className="px-6 py-5 text-gray-300">
                      {f.min_order_amount ? `₹${f.min_order_amount}` : "—"}
                    </td>

                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                        f.is_active
                          ? "bg-green-500/10 text-green-300 border-green-500/20"
                          : "bg-red-500/10 text-red-300 border-red-500/20"
                      }`}>
                        {f.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditing(f);
                            setForm({
                              fee_type: f.fee_type,
                              value: f.value,
                              min_order_amount: f.min_order_amount || "",
                              is_active: f.is_active,
                            });
                            setShowForm(true);
                          }}
                          className="p-2 rounded-xl bg-white/[0.05] hover:bg-orange-500/20 hover:text-orange-400 transition-all"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => remove(f.id)}
                          className="p-2 rounded-xl bg-white/[0.05] hover:bg-red-500/20 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}
    </AdminLayout>
  );
}

export default AdminConfigPlatformFees;