import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, type Product } from "@/lib/mock-data";
import { ProductCard } from "@/components/site/ProductCard";
import { getProducts } from "@/services/api";

export const Route = createFileRoute("/_shop/products")({
  validateSearch: (search: Record<string, unknown>): { category?: string } => {
    return {
      category: search.category as string | undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Shop All Products | Eve Beauty Care" },
      {
        name: "description",
        content:
          "Browse the full Eve Beauty Care luxury collection: skincare, lipsticks, fragrances, serums and more. Find your perfect beauty essentials.",
      },
      { property: "og:title", content: "Shop All Products | Eve Beauty Care" },
      { property: "og:description", content: "Browse our full luxury beauty collection at Eve Beauty Care." },
      { property: "og:url", content: "https://evebeautycare.live/products" },
      { property: "og:image", content: "https://evebeautycare.live/og-image.png" },
      { name: "twitter:title", content: "Shop All Products | Eve Beauty Care" },
      { name: "twitter:description", content: "Browse our full luxury beauty collection at Eve Beauty Care." },
      { name: "twitter:image", content: "https://evebeautycare.live/og-image.png" },
    ],
    links: [
      { rel: "canonical", href: "https://evebeautycare.live/products" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const search = Route.useSearch();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const initialCat = useMemo(() => {
    if (!search.category) return "All";
    const found = CATEGORIES.find((c) => c.toLowerCase() === search.category?.toLowerCase());
    return found || "All";
  }, [search.category]);

  const [cat, setCat] = useState<string>(initialCat);
  const [sort, setSort] = useState<string>("featured");

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setAllProducts(res.data.data);
      } catch {
        // Will show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const list = useMemo(() => {
    let l = [...allProducts];
    if (cat !== "All") l = l.filter((p) => p.category === cat);
    if (q.trim()) l = l.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase()));
    if (sort === "price-asc") l.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") l.sort((a, b) => b.price - a.price);
    return l;
  }, [q, cat, sort, allProducts]);

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
        <span className="text-xs tracking-[0.4em] uppercase text-gold">The Collection</span>
        <h1 className="mt-3 font-display text-5xl text-foreground">Shop All Products</h1>
        <p className="mt-4 text-muted-foreground">Discover our full range of luxury beauty essentials.</p>
      </motion.div>

      {/* Controls */}
      <div className="mt-10 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            value={sort} onChange={(e) => setSort(e.target.value)}
            className="appearance-none rounded-full border border-border bg-card pl-11 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-5 py-2 text-xs tracking-widest uppercase transition-all ${
              cat === c ? "bg-gradient-gold text-primary shadow-gold" : "border border-border hover:border-primary hover:text-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="mt-24 flex justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      ) : list.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      ) : (
        <div className="mt-24 text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-hero grid place-items-center">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="mt-6 font-display text-2xl">No products found</p>
          <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or search.</p>
        </div>
      )}
    </div>
  );
}
