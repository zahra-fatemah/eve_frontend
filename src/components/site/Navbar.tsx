import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, Shield } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import logo from "@/assets/logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/cart", label: "Cart" },
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "glass shadow-soft" : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="Eve Beauty Care" width={40} height={40} className="h-10 w-10 transition-transform group-hover:scale-110" />
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg sm:text-xl text-primary">Eve Beauty Care</span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground hidden sm:block">Luxury · Skincare</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link key={n.to} to={n.to} className="relative text-sm tracking-wide font-medium text-foreground/80 hover:text-primary transition-colors">
                {n.label}
                {active && (
                  <motion.span layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-gold rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-accent/50 transition" aria-label="Shopping bag">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-gradient-gold text-primary text-[10px] font-bold flex items-center justify-center px-1"
              >{count}</motion.span>
            )}
          </Link>
          <Link to="/admin/login" className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/20 px-4 py-2 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all" aria-label="Admin login">
            <Shield className="h-3.5 w-3.5" /> Admin
          </Link>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
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
            className="md:hidden overflow-hidden glass border-t border-white/40"
          >
            <div className="flex flex-col gap-1 p-4">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-accent">{n.label}</Link>
              ))}
              <Link to="/admin/login" className="rounded-lg px-4 py-3 text-sm font-medium text-primary">Admin Login</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
