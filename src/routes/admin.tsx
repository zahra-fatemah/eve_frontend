import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LayoutDashboard, PlusSquare, Boxes, LogOut, Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/add-items", label: "Add Items", icon: PlusSquare },
  { to: "/admin/manage-items", label: "Manage Items", icon: Boxes },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  // Auth guard — redirect to login if no JWT token is found
  useEffect(() => {
    if (pathname === "/admin/login" || pathname === "/admin") return;

    const token = localStorage.getItem("eve-admin-token");
    if (!token) {
      navigate({ to: "/admin/login" });
    }

    const email = localStorage.getItem("eve-admin-email") || "admin@evebeautycare.com";
    setAdminEmail(email);
  }, [pathname, navigate]);

  // Logout handler — clear stored credentials and redirect
  const handleLogout = () => {
    localStorage.removeItem("eve-admin-token");
    localStorage.removeItem("eve-admin-email");
    navigate({ to: "/admin/login" });
  };

  // Login page — bypass admin shell entirely
  if (pathname === "/admin/login" || pathname === "/admin") {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex bg-[oklch(0.14_0.02_350)] text-primary-foreground">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: "spring", damping: 22, stiffness: 200 }}
            className="fixed lg:sticky top-0 h-screen w-64 z-40 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col"
          >
            <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
              <img src={logo} alt="" className="h-10 w-10" />
              <div>
                <p className="font-display text-lg text-gold">Eve Admin</p>
                <p className="text-[10px] tracking-widest uppercase opacity-60">Control Panel</p>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {NAV.map((n) => {
                const active = pathname === n.to;
                return (
                  <Link key={n.to} to={n.to} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${active ? "bg-gradient-gold text-primary shadow-gold" : "hover:bg-sidebar-accent"}`}>
                    <n.icon className="h-4 w-4" />
                    <span>{n.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-sidebar-border">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-sidebar-accent transition">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 glass-dark border-b border-white/10 px-6 py-3 flex items-center justify-between">
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-white/10 transition">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gold">Admin</p>
              <p className="text-[10px] opacity-60">{adminEmail}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-gold grid place-items-center text-primary font-display">A</div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-10 bg-[oklch(0.16_0.03_350)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
