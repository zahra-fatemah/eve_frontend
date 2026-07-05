import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { adminLogin } from "@/services/api";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Eve Beauty Care" }] }),
  component: LoginPage,
});

type Form = { email: string; password: string };

function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Form>();
  const navigate = useNavigate();

  const onSubmit = async (data: Form) => {
    try {
      const res = await adminLogin(data.email, data.password);
      // Store JWT and email in localStorage
      localStorage.setItem("eve-admin-token", res.data.token);
      localStorage.setItem("eve-admin-email", res.data.email);
      toast.success("Welcome back, Admin");
      navigate({ to: "/admin/dashboard" });
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-16 overflow-hidden bg-gradient-burgundy">
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.78 0.13 85 / 0.4), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.78 0.08 40 / 0.35), transparent 40%)",
      }} />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-3xl glass-dark p-10 shadow-luxe"
      >
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="Eve" className="h-16 w-16" />
          <h1 className="mt-4 font-display text-3xl text-gold">Admin Portal</h1>
          <p className="mt-1 text-sm text-white/70">Sign in to manage your boutique</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input {...register("email", { required: true })} type="email" placeholder="Email" defaultValue="admin@evebeauticare.com"
              className="w-full rounded-2xl bg-white/5 border border-white/15 pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input {...register("password", { required: true })} type="password" placeholder="Password" defaultValue="password"
              className="w-full rounded-2xl bg-white/5 border border-white/15 pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" />
          </div>

          <div className="flex items-center justify-between text-xs text-white/60">
            <label className="flex items-center gap-2"><input type="checkbox" className="accent-gold" /> Remember me</label>
            <span className="opacity-50 cursor-not-allowed">Forgot password?</span>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold text-primary font-medium py-3.5 shadow-gold hover:shadow-luxe transition-all disabled:opacity-60">
            {isSubmitting ? "Signing in..." : (<>Sign In <ArrowRight className="h-4 w-4" /></>)}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
