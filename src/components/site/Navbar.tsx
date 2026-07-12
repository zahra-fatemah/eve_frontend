import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, Sparkles, Leaf, Truck, Search, User } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import logo from "@/assets/logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/products?category=skincare", label: "Skincare" },
  { to: "/products?category=makeup", label: "Makeup" },
  { to: "/products?category=collections", label: "Collections" },
  { to: "#about", label: "About Us" },
  { to: "#reviews", label: "Reviews" },
  { to: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-soft" : "bg-transparent"
      }`}
    >
      {/* Top Announcement Bar */}
      <div className="bg-[#6b0f3c] text-[#f8f5f0] py-2 px-4 text-xs sm:text-sm font-medium tracking-wide">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-gold" /> Premium Ingredients</span>
          <span className="hidden md:flex items-center gap-1.5"><Leaf className="h-3.5 w-3.5 text-green-400" /> Naturally Effective</span>
          <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Pan India Delivery</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="Eve Beauty Care" width={45} height={45} className="h-11 w-11 transition-transform group-hover:scale-105" />
          <div className="flex flex-col leading-none">
            {/* Hiding text since mockup shows only logo, but keeping it for screen readers/mobile fallback if needed. The mockup has the text built into the logo. We'll show text only if the logo image is missing or just hide it on md screens. */}
            <span className="font-display text-xl text-primary hidden sm:block md:hidden lg:block">Eve Beauty Care</span>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-8" aria-label="Main navigation">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link key={n.to} to={n.to} className="relative text-[13px] uppercase tracking-wider font-medium text-foreground/80 hover:text-primary transition-colors">
                {n.label}
                {active && (
                  <motion.span layoutId="nav-underline" className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5 text-foreground/80">
          <button className="hover:text-primary transition hidden sm:block" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          
          <Link to="/admin/login" className="hover:text-primary transition" aria-label="User Account">
            <User className="h-5 w-5" />
          </Link>
          
          <Link to="/cart" className="relative hover:text-primary transition" aria-label="Shopping bag">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 min-w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1"
              >{count}</motion.span>
            )}
          </Link>
          
          <button className="xl:hidden p-1 hover:text-primary transition" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden overflow-hidden bg-background/95 backdrop-blur-md border-t border-border"
          >
            <div className="flex flex-col gap-1 p-4">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-accent">{n.label}</Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
