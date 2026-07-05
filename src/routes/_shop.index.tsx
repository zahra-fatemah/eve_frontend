import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles, Leaf, ShieldCheck, Award, Star, Quote } from "lucide-react";
import hero from "@/assets/hero.jpg";
import logo from "@/assets/logo.png";
import { testimonials, type Product } from "@/lib/mock-data";
import { ProductCard } from "@/components/site/ProductCard";
import { useEffect, useState } from "react";
import { getProducts } from "@/services/api";

export const Route = createFileRoute("/_shop/")({
  head: () => ({
    meta: [
      { title: "Eve Beauty Care — Reveal Your Natural Beauty" },
      { name: "description", content: "Premium beauty products designed for everyday confidence. Shop luxury skincare, lipsticks and fragrances." },
    ],
  }),
  component: Home,
});

const perks = [
  { icon: Award, title: "Premium Quality", desc: "Formulated in small batches with the finest ingredients from around the world." },
  { icon: Leaf, title: "Natural Ingredients", desc: "Botanicals, cold-pressed oils and clean actives — never harsh synthetics." },
  { icon: Sparkles, title: "Affordable Luxury", desc: "Editorial-grade beauty at prices that honor everyday indulgence." },
  { icon: ShieldCheck, title: "Trusted Brand", desc: "Loved by 50,000+ women. Dermatologist-approved. Cruelty-free." },
];

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
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-hero">
        <div className="absolute inset-0">
          <img src={hero} alt="Luxury beauty products" width={1600} height={1200} className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center py-24">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }}>
            <motion.img
              src={logo} alt="" width={80} height={80}
              initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7 }}
              className="h-20 w-20 mb-6"
            />
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs tracking-[0.3em] uppercase text-primary">
              <Sparkles className="h-3 w-3 text-gold" /> New Collection 2026
            </span>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-foreground">
              Reveal Your <br />
              <span className="italic text-primary">Natural Beauty</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
              Premium beauty products designed for everyday confidence. Crafted with care in small batches — because you deserve nothing less than extraordinary.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/products" className="group inline-flex items-center gap-2 rounded-full bg-gradient-gold text-primary font-medium px-8 py-4 shadow-gold hover:shadow-luxe transition-all hover:brightness-105">
                Shop Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/products" className="inline-flex items-center gap-2 rounded-full border-2 border-primary text-primary font-medium px-8 py-4 hover:bg-primary hover:text-primary-foreground transition-all">
                Explore Products
              </Link>
            </div>
          </motion.div>

          <div className="hidden lg:block" />
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-xs text-muted-foreground tracking-widest uppercase"
        >
          <span>Scroll</span>
          <ChevronDown className="h-5 w-5 mt-1" />
        </motion.div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.4em] uppercase text-gold">Bestsellers</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl text-foreground">Featured Products</h2>
          <p className="mt-4 text-muted-foreground">Our most-loved essentials — hand-picked, meticulously crafted, universally adored.</p>
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

      {/* WHY US */}
      <section className="bg-gradient-hero py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto">
            <span className="text-xs tracking-[0.4em] uppercase text-gold">The Eve Difference</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-foreground">Why Choose Eve Beauty Care</h2>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass rounded-3xl p-8 text-center shadow-soft hover:shadow-luxe transition-all"
              >
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-gold shadow-gold">
                  <p.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-5 font-display text-xl text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.4em] uppercase text-gold">Kind Words</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl text-foreground">Loved By Thousands</h2>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-card border border-border p-8 shadow-soft hover:shadow-luxe transition-all"
            >
              <Quote className="h-8 w-8 text-gold" />
              <p className="mt-4 text-foreground/80 leading-relaxed italic">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-4">
                <img src={t.avatar} alt={t.name} loading="lazy" width={48} height={48} className="h-12 w-12 rounded-full object-cover ring-2 ring-gold" />
                <div>
                  <p className="font-display text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5 text-gold">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
