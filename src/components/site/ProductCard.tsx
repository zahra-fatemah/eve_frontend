import { motion } from "framer-motion";
import { Heart, Eye, Minus, Plus, ShoppingBag, Star, ImageIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/lib/mock-data";
import { formatPrice } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-store";

/** Helper: get product identifier — falls back to name to avoid collisions when _id is empty */
const pid = (p: Product) => (p._id && p._id.trim()) || (p.id && p.id.trim()) || p.name || "";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const { add } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative rounded-3xl bg-card shadow-soft hover:shadow-luxe transition-shadow overflow-hidden border border-border/60"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-hero">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <button
          onClick={() => { setWishlisted(!wishlisted); toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist"); }}
          className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full glass hover:bg-white transition"
          aria-label="Wishlist"
        >
          <Heart className={`h-4 w-4 transition ${wishlisted ? "fill-primary text-primary" : "text-foreground/70"}`} />
        </button>

        <button
          className="absolute bottom-3 left-3 right-3 rounded-full glass px-4 py-2.5 text-xs font-medium opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all inline-flex items-center justify-center gap-2"
          onClick={() => toast(`Quick view: ${product.name}`, { description: product.description })}
        >
          <Eye className="h-3.5 w-3.5" /> Quick View
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground uppercase tracking-widest">{product.category}</span>
          {product.rating && (
            <span className="flex items-center gap-1 text-gold">
              <Star className="h-3 w-3 fill-current" /> {product.rating}
            </span>
          )}
        </div>
        <h3 className="mt-2 font-display text-lg text-foreground">{product.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-display text-primary">{formatPrice(product.price)}</span>
          <div className="flex items-center rounded-full border border-border">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1.5 hover:text-primary transition" aria-label="Decrease quantity"><Minus className="h-3 w-3" /></button>
            <span className="w-6 text-center text-sm">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="p-1.5 hover:text-primary transition" aria-label="Increase quantity"><Plus className="h-3 w-3" /></button>
          </div>
        </div>

        <button
          onClick={() => { add(product, qty); toast.success(`${product.name} added to bag`); }}
          className="mt-4 w-full rounded-full bg-gradient-gold text-primary font-medium py-2.5 text-sm inline-flex items-center justify-center gap-2 hover:shadow-gold transition-all hover:brightness-105 active:scale-[0.98]"
          aria-label={`Add ${product.name} to bag`}
        >
          <ShoppingBag className="h-4 w-4" /> Add to Bag
        </button>
      </div>
    </motion.div>
  );
}
