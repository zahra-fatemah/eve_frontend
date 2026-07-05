import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/mock-data";

export const Route = createFileRoute("/_shop/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag | Eve Beauty Care" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CartPage,
});

const DELIVERY = 99;

/** Helper: get product identifier (supports both _id and id) */
const pid = (p: { _id?: string; id?: string }) => p._id || p.id || "";

function CartPage() {
  const { items, remove, setQty, subtotal } = useCart();
  const delivery = items.length ? DELIVERY : 0;
  const total = subtotal + delivery;

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl text-foreground text-center">
        Your Beauty Bag
      </motion.h1>

      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-16 max-w-md mx-auto text-center">
          <div className="mx-auto h-28 w-28 rounded-full bg-gradient-hero grid place-items-center">
            <ShoppingBag className="h-12 w-12 text-primary/50" />
          </div>
          <p className="mt-6 font-display text-2xl">Your bag is empty</p>
          <p className="mt-2 text-sm text-muted-foreground">Discover luxurious essentials waiting for you.</p>
          <Link to="/products" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold text-primary px-8 py-3 font-medium shadow-gold hover:shadow-luxe">
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="space-y-4">
            <AnimatePresence>
              {items.map((it, i) => (
                <motion.div
                  key={pid(it.product)}
                  layout
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-3xl bg-card border border-border shadow-soft"
                >
                  <img src={it.product.image} alt={it.product.name} loading="lazy" className="h-32 w-32 sm:h-28 sm:w-28 rounded-2xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">{it.product.category}</p>
                        <h3 className="font-display text-lg text-foreground truncate">{it.product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{it.product.description}</p>
                      </div>
                      <button onClick={() => remove(pid(it.product))} aria-label="Remove" className="p-2 rounded-full hover:bg-destructive/10 hover:text-destructive transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button onClick={() => setQty(pid(it.product), it.qty - 1)} className="p-2 hover:text-primary"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm font-medium">{it.qty}</span>
                        <button onClick={() => setQty(pid(it.product), it.qty + 1)} className="p-2 hover:text-primary"><Plus className="h-3 w-3" /></button>
                      </div>
                      <span className="font-display text-lg text-primary">{formatPrice(it.product.price * it.qty)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            className="h-fit rounded-3xl bg-gradient-hero border border-border p-8 shadow-luxe sticky top-24"
          >
            <h2 className="font-display text-2xl text-foreground">Order Summary</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{formatPrice(delivery)}</dd></div>
              <div className="border-t border-border pt-3 flex justify-between text-lg">
                <dt className="font-display">Grand Total</dt>
                <dd className="font-display text-primary">{formatPrice(total)}</dd>
              </div>
            </dl>
            <Link to="/checkout" className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold text-primary font-medium py-3.5 shadow-gold hover:shadow-luxe transition-all">
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/products" className="mt-3 w-full inline-flex items-center justify-center text-sm text-primary hover:underline">
              Continue Shopping
            </Link>
          </motion.aside>
        </div>
      )}
    </div>
  );
}
