import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="mt-24 bg-gradient-burgundy text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src={logo} alt="Eve Beauty Care" width={40} height={40} className="h-10 w-10" />
              <span className="font-display text-xl">Eve Beauty Care</span>
            </div>
            <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
              Timeless beauty, crafted with care. Premium skincare and cosmetics designed to reveal your natural radiance.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { Icon: Instagram, label: "Follow us on Instagram", href: "https://www.instagram.com/eve_beautycare?igsh=Nng1ZXBkNmNhY3hl" },
                { Icon: Facebook, label: "Follow us on Facebook", href: "https://www.facebook.com/share/1AoJLrGd1Z/" },
              ].map(({ Icon, label, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-white/20 hover:bg-gradient-gold hover:text-primary hover:border-transparent transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.3em] uppercase text-gold">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/" className="hover:text-gold transition">About Us</Link></li>
              <li><Link to="/products" className="hover:text-gold transition">Shop All</Link></li>
              <li><a href="#" className="hover:text-gold transition">Journal</a></li>
              <li><a href="#" className="hover:text-gold transition">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.3em] uppercase text-gold">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
              <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 mt-0.5 text-gold" /> evebcare@gmail.com</li>
              <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0 mt-0.5 text-gold" /> +91 9836579402</li>
              <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 mt-0.5 text-gold" /> P-67, Nani Gopal Roy Chowdhury Avenue, Kolkata 700014</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.3em] uppercase text-gold">Newsletter</h4>
            <p className="mt-4 text-sm text-primary-foreground/70">Join our beauty circle for early access & exclusive offers.</p>
            <form className="mt-4 flex gap-2">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input id="newsletter-email" type="email" name="email" autoComplete="email" placeholder="your@email.com" className="flex-1 min-w-0 rounded-full bg-white/10 border border-white/20 px-4 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-gold" />
              <button type="submit" aria-label="Subscribe to newsletter" className="rounded-full bg-gradient-gold text-primary px-5 py-2.5 text-sm font-medium hover:shadow-gold transition-shadow">Join</button>
            </form>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
          <p>© 2026 Eve Beauty Care. Crafted with love.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold">Privacy</a>
            <a href="#" className="hover:text-gold">Terms</a>
            <a href="#" className="hover:text-gold">Shipping</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
