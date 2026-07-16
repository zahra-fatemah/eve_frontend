import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, ShieldCheck, Star, Truck, Heart, Rabbit, Quote, Sparkles } from "lucide-react";
import hero from "@/assets/hero.jpg";
import skincareImg from "@/assets/skincare.jpg";
import sunprotectionImg from "@/assets/sunprotection.jpg";
import { testimonials, type Product } from "@/lib/mock-data";
import { ProductCard } from "@/components/site/ProductCard";
import { useEffect, useState } from "react";
import { getProducts } from "@/services/api";

export const Route = createFileRoute("/_shop/")({
  head: () => ({
    meta: [
      { title: "Eve Beauty Care | Premium Beauty & Skincare Products" },
      {
        name: "description",
        content:
          "Discover premium beauty products, skincare essentials, cosmetics and luxury beauty collections at Eve Beauty Care. Shop now for radiant skin.",
      },
      { property: "og:title", content: "Eve Beauty Care | Premium Beauty & Skincare Products" },
      {
        property: "og:description",
        content: "Discover premium beauty products, skincare essentials, cosmetics and luxury beauty collections at Eve Beauty Care.",
      },
      { property: "og:url", content: "https://evebeautycare.live/" },
      { property: "og:image", content: "https://evebeautycare.live/og-image.png" },
      { name: "twitter:title", content: "Eve Beauty Care | Premium Beauty & Skincare Products" },
      { name: "twitter:description", content: "Premium beauty products designed for everyday confidence." },
      { name: "twitter:image", content: "https://evebeautycare.live/og-image.png" },
    ],
    links: [
      { rel: "canonical", href: "https://evebeautycare.live/" },
    ],
  }),
  component: Home,
});

function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data.data);
      } catch {
        // Silently fail on homepage — products section will be empty
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="overflow-hidden bg-[#fcf9f2]">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center pt-24 pb-32">
        <div className="absolute inset-0">
          <img src={hero} alt="Eve Beauty Care" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcf9f2] via-[#fcf9f2]/80 to-transparent sm:to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 w-full grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Natural Beauty, Made With Care <Heart className="h-3 w-3 text-primary fill-primary" />
            </span>
            <h1 className="mt-2 font-display text-5xl sm:text-6xl lg:text-[5rem] leading-[1.05] text-foreground">
              Glow Naturally. <br /> Love Every Shade.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-foreground/75 max-w-lg leading-relaxed">
              Skincare & makeup crafted with premium ingredients to nourish, protect and enhance your natural beauty.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <Link to="/products" className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-medium px-8 py-4 shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
                Shop Collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/products" className="inline-flex items-center gap-2 rounded-full border border-primary/30 text-primary font-medium px-8 py-4 hover:border-primary hover:bg-primary/5 transition-all">
                Explore Products
              </Link>
            </div>
          </motion.div>
          <div className="hidden lg:block" />
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="relative mx-auto max-w-7xl px-6 lg:px-10 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="-mt-16 lg:-mt-20 bg-white rounded-3xl shadow-xl border border-primary/5 p-6 lg:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="flex items-center gap-4 sm:px-4">
              <Leaf className="h-8 w-8 text-primary shrink-0" strokeWidth={1.5} />
              <div><p className="text-sm font-bold text-foreground">Natural Ingredients</p><p className="text-xs text-muted-foreground mt-0.5">Care from nature</p></div>
            </div>
            <div className="flex items-center gap-4 sm:px-4 pt-4 sm:pt-0">
              <Rabbit className="h-8 w-8 text-primary shrink-0" strokeWidth={1.5} />
              <div><p className="text-sm font-bold text-foreground">Cruelty Free</p><p className="text-xs text-muted-foreground mt-0.5">Kind to animals</p></div>
            </div>
            <div className="flex items-center gap-4 sm:px-4 pt-4 sm:pt-0">
              <Sparkles className="h-8 w-8 text-primary shrink-0" strokeWidth={1.5} />
              <div><p className="text-sm font-bold text-foreground">Skin Loving Formula</p><p className="text-xs text-muted-foreground mt-0.5">Nourish. Protect. Glow.</p></div>
            </div>
            <div className="flex items-center gap-4 sm:px-4 pt-4 sm:pt-0">
              <Truck className="h-8 w-8 text-primary shrink-0" strokeWidth={1.5} />
              <div><p className="text-sm font-bold text-foreground">Fast & Secure Delivery</p><p className="text-xs text-muted-foreground mt-0.5">Across India</p></div>
            </div>
            <div className="flex items-center gap-4 sm:px-4 pt-4 sm:pt-0">
              <Star className="h-8 w-8 text-primary shrink-0" strokeWidth={1.5} />
              <div><p className="text-sm font-bold text-foreground">4.9/5 Customer Rating</p><p className="text-xs text-muted-foreground mt-0.5">Loved by thousands</p></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="py-16 lg:py-24 px-6 lg:px-10 mx-auto max-w-7xl">
        <div className="text-center mb-12">
           <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-primary mb-3">
              <Heart className="h-3 w-3 fill-primary" /> DISCOVER OUR RANGE <Heart className="h-3 w-3 fill-primary" />
            </span>
            <h2 className="font-display text-4xl lg:text-5xl text-foreground">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            { title: "Skincare", desc: "Nourish & Care", image: skincareImg },
            { title: "Sun Protection", desc: "Shield & Protect", image: sunprotectionImg },
            { title: "Serums", desc: "Target & Treat" },
            { title: "Lipcare", desc: "Shades of You" }
          ].map((cat, i) => (
             <Link key={i} to="/products" search={{ category: cat.title.toLowerCase() }} className="group relative bg-[#f4ebd9] rounded-3xl p-6 h-[240px] flex flex-col justify-end overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all border border-primary/5">
               {cat.image && <img src={cat.image} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
               <div className={`absolute inset-0 bg-gradient-to-t ${cat.image ? 'from-black/70 via-black/30 to-transparent' : 'from-primary/5 to-transparent'}`} />
               
               <div className="relative z-20 flex justify-between items-end">
                 <div>
                   <h3 className={`font-display text-lg sm:text-xl font-bold ${cat.image ? 'text-white' : 'text-foreground'}`}>{cat.title}</h3>
                   <p className={`text-xs mt-1 ${cat.image ? 'text-white/80' : 'text-muted-foreground'}`}>{cat.desc}</p>
                 </div>
                 <div className="h-8 w-8 shrink-0 rounded-full bg-white flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                   <ArrowRight className="h-4 w-4" />
                 </div>
               </div>
             </Link>
          ))}
        </div>
      </section>

      {/* FEATURED BESTSELLERS */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24 border-t border-border/50">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold">Bestsellers</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl text-foreground">Featured Products</h2>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>

        {products.length > 0 && (
          <div className="mt-12 text-center">
            <Link to="/products" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
              View all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold">Kind Words</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-foreground">Loved By Thousands</h2>
          </motion.div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl bg-[#fcf9f2] border border-primary/5 p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <Quote className="h-8 w-8 text-primary/40" />
                <p className="mt-4 text-foreground/80 leading-relaxed italic">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <div className="flex text-gold mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
