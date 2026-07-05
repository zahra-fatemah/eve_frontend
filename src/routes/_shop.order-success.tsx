import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, ArrowRight, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/mock-data";

export const Route = createFileRoute("/_shop/order-success")({
  head: () => ({ meta: [{ title: "Order Confirmed — Eve Beauty Care" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const [order, setOrder] = useState<{ id: string; name: string; total: number } | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem("eve-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  const delivery = new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="max-w-lg w-full text-center rounded-3xl glass p-10 shadow-luxe"
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-gold shadow-gold"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
            <Check className="h-12 w-12 text-primary" strokeWidth={3} />
          </motion.div>
        </motion.div>
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6 font-display text-4xl text-primary">
          Thank you{order?.name ? `, ${order.name.split(" ")[0]}` : ""}!
        </motion.h1>
        <p className="mt-3 text-muted-foreground">Your order has been placed successfully. A confirmation will be sent shortly.</p>

        <div className="mt-8 rounded-2xl bg-card/60 border border-border p-6 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono font-medium">{order?.id ?? "EVE-000000"}</span>
          </div>
          {order?.total != null && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Paid</span>
              <span className="font-display text-primary">{formatPrice(order.total)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Est. Delivery</span>
            <span className="font-medium">{delivery}</span>
          </div>
        </div>

        <Link to="/products" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold text-primary font-medium px-8 py-3 shadow-gold hover:shadow-luxe">
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  );
}
