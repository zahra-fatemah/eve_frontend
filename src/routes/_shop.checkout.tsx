import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/mock-data";
import { toast } from "sonner";
import { placeOrder } from "@/services/api";

export const Route = createFileRoute("/_shop/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Eve Beauty Care" }] }),
  component: CheckoutPage,
});

type Form = {
  fullName: string; phone: string; email?: string;
  address: string; city: string; state: string; pincode: string;
  landmark?: string; notes?: string;
};

const DELIVERY = 99;

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>();

  const total = subtotal + (items.length ? DELIVERY : 0);

  const onSubmit = async (data: Form) => {
    try {
      const orderData = {
        customer: {
          name: data.fullName,
          phone: data.phone,
          email: data.email || "",
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          landmark: data.landmark || "",
          notes: data.notes || "",
        },
        items: items.map((it) => ({
          productId: it.product._id || it.product.id || "",
          name: it.product.name,
          price: it.product.price,
          quantity: it.qty,
        })),
        deliveryCharge: DELIVERY,
      };

      const res = await placeOrder(orderData);
      const { orderId, grandTotal } = res.data.data;

      if (typeof window !== "undefined") {
        sessionStorage.setItem("eve-last-order", JSON.stringify({
          id: orderId,
          name: data.fullName,
          total: grandTotal,
        }));
      }

      clear();
      toast.success("Order placed successfully!");
      navigate({ to: "/order-success" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
    }
  };

  const field = "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition";

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl text-center">Checkout</motion.h1>
      <p className="mt-2 text-center text-muted-foreground text-sm">Almost yours — please share your delivery details.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-12 grid gap-10 lg:grid-cols-[1fr_420px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-card border border-border p-8 shadow-soft">
          <h2 className="font-display text-2xl text-primary">Delivery Details</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Full Name*</label>
              <input {...register("fullName", { required: true })} className={`mt-1.5 ${field}`} />
              {errors.fullName && <p className="text-xs text-destructive mt-1">Required</p>}
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Phone*</label>
              <input {...register("phone", { required: true })} className={`mt-1.5 ${field}`} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Email (optional)</label>
              <input type="email" {...register("email")} className={`mt-1.5 ${field}`} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Address*</label>
              <input {...register("address", { required: true })} className={`mt-1.5 ${field}`} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">City*</label>
              <input {...register("city", { required: true })} className={`mt-1.5 ${field}`} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">State*</label>
              <input {...register("state", { required: true })} className={`mt-1.5 ${field}`} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Pincode*</label>
              <input {...register("pincode", { required: true })} className={`mt-1.5 ${field}`} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Landmark</label>
              <input {...register("landmark")} className={`mt-1.5 ${field}`} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Additional Notes</label>
              <textarea rows={3} {...register("notes")} className={`mt-1.5 ${field} resize-none`} />
            </div>
          </div>
        </motion.div>

        <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="h-fit rounded-3xl bg-gradient-hero border border-border p-8 shadow-luxe sticky top-24">
          <h2 className="font-display text-2xl text-primary">Order Summary</h2>
          <div className="mt-6 space-y-3 max-h-64 overflow-y-auto pr-2">
            {items.length === 0 && <p className="text-sm text-muted-foreground">Your bag is empty.</p>}
            {items.map((it) => (
              <div key={it.product._id || it.product.id} className="flex gap-3 items-center">
                <img src={it.product.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{it.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {it.qty}</p>
                </div>
                <span className="text-sm">{formatPrice(it.product.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <dl className="mt-6 pt-6 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{formatPrice(items.length ? DELIVERY : 0)}</dd></div>
            <div className="flex justify-between text-lg pt-2 border-t border-border"><dt className="font-display">Grand Total</dt><dd className="font-display text-primary">{formatPrice(total)}</dd></div>
          </dl>
          <button
            type="submit" disabled={items.length === 0 || isSubmitting}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold text-primary font-medium py-4 shadow-gold hover:shadow-luxe transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock className="h-4 w-4" />
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Secure checkout · No account needed</p>
        </motion.aside>
      </form>
    </div>
  );
}
