import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ShoppingBag, TrendingUp, CheckCircle2, XCircle, IndianRupee, Eye, X, Trash2 } from "lucide-react";
import { formatPrice, type Order } from "@/lib/mock-data";
import { getDashboardStats, getOrders, updatePaymentStatus, updateOrderStatus, deleteOrder } from "@/services/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Eve Admin" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState<Order | null>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    todaysOrders: 0,
    paidOrders: 0,
    notPaidOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          getDashboardStats(),
          getOrders(),
        ]);
        setStats(statsRes.data.data);
        setOrders(ordersRes.data.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, tone: "gold" },
    { label: "Today's Orders", value: stats.todaysOrders, icon: TrendingUp, tone: "gold" },
    { label: "Paid Orders", value: stats.paidOrders, icon: CheckCircle2, tone: "green" },
    { label: "Not Paid", value: stats.notPaidOrders, icon: XCircle, tone: "red" },
    { label: "Revenue", value: formatPrice(stats.revenue), icon: IndianRupee, tone: "gold" },
  ];

  // Update payment status via API
  const handlePaymentChange = async (order: Order, newStatus: string) => {
    try {
      await updatePaymentStatus(order._id, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, paymentStatus: newStatus as Order["paymentStatus"] } : o
        )
      );
      // Refresh stats
      const statsRes = await getDashboardStats();
      setStats(statsRes.data.data);
      toast.success(`Payment updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update payment");
    }
  };

  // Update order status via API
  const handleStatusChange = async (order: Order, newStatus: string) => {
    try {
      await updateOrderStatus(order._id, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, orderStatus: newStatus as Order["orderStatus"] } : o
        )
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Delete order via API
  const handleDelete = async (order: Order) => {
    if (!confirm(`Delete order ${order.orderId}?`)) return;
    try {
      await deleteOrder(order._id);
      setOrders((prev) => prev.filter((o) => o._id !== order._id));
      const statsRes = await getDashboardStats();
      setStats(statsRes.data.data);
      toast.success("Order deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete order");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl text-gold">Dashboard</h1>
        <p className="mt-1 text-sm text-white/60">Welcome back — here's what's happening today.</p>
      </motion.div>

      <div className="mt-8 grid gap-4 grid-cols-2 lg:grid-cols-5">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="glass-dark rounded-2xl p-5 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-white/60">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.tone === "green" ? "text-emerald-400" : s.tone === "red" ? "text-rose-400" : "text-gold"}`} />
            </div>
            <p className="mt-3 font-display text-3xl text-white">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-10 glass-dark rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-display text-2xl text-gold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-widest text-white/50 bg-white/5">
              <tr>
                <th className="text-left px-6 py-3">Order ID</th>
                <th className="text-left px-6 py-3">Customer</th>
                <th className="text-left px-6 py-3">Phone</th>
                <th className="text-left px-6 py-3">Total</th>
                <th className="text-left px-6 py-3">Payment</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-left px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {orders.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-white/40">No orders yet</td></tr>
              )}
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 font-mono text-gold">{o.orderId}</td>
                  <td className="px-6 py-4">{o.customer.name}</td>
                  <td className="px-6 py-4 text-white/70">{o.customer.phone}</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(o.grandTotal)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={o.paymentStatus}
                      onChange={(e) => handlePaymentChange(o, e.target.value)}
                      className={`rounded-full px-3 py-1 text-xs bg-white/5 border ${o.paymentStatus === "Paid" ? "border-emerald-400/50 text-emerald-300" : "border-rose-400/50 text-rose-300"}`}
                    >
                      <option>Paid</option>
                      <option>Not Paid</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o, e.target.value)}
                      className="rounded-full px-3 py-1 text-xs bg-white/5 border border-white/20 text-white"
                    >
                      {["Pending", "Preparing", "Packed", "Delivered", "Cancelled"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-white/70">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setView(o)} className="inline-flex items-center gap-1 rounded-full bg-gradient-gold text-primary px-3 py-1.5 text-xs font-medium">
                        <Eye className="h-3 w-3" /> View
                      </button>
                      <button onClick={() => handleDelete(o)} className="p-1.5 rounded-full bg-white/5 hover:bg-rose-500 transition">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
      {view && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setView(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-sidebar text-white p-8 shadow-luxe border border-white/10"
          >
            <button onClick={() => setView(null)} className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10"><X className="h-4 w-4" /></button>
            <h3 className="font-display text-2xl text-gold">{view.orderId}</h3>
            <p className="text-xs uppercase tracking-widest text-white/50 mt-1">Order Details</p>
            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["Customer", view.customer.name],
                ["Phone", view.customer.phone],
                ["Email", view.customer.email || "—"],
                ["Address", `${view.customer.address}, ${view.customer.city}, ${view.customer.state} - ${view.customer.pincode}`],
                ["Landmark", view.customer.landmark || "—"],
                ["Items", view.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")],
                ["Delivery", formatPrice(view.deliveryCharge)],
                ["Total", formatPrice(view.grandTotal)],
                ["Payment", view.paymentStatus],
                ["Status", view.orderStatus],
                ["Notes", view.customer.notes || "—"],
                ["Date", new Date(view.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-3">
                  <dt className="text-white/50 uppercase tracking-widest text-xs">{k}</dt>
                  <dd className="col-span-2">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      )}
    </div>
  );
}
