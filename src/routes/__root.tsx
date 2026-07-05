import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "../lib/cart-store";
import { Toaster } from "../components/ui/sonner";
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
  StoreJsonLd,
} from "../components/seo/JsonLd";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-display text-primary">404</h1>
        <h2 className="mt-4 text-xl font-display text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for has drifted away.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-gold px-6 py-3 text-sm font-medium text-primary shadow-gold transition-transform hover:scale-105"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-display text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-gradient-gold px-6 py-3 text-sm font-medium text-primary shadow-gold"
            aria-label="Retry loading this page"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-border px-6 py-3 text-sm font-medium">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(  {
  head: () => ({
    meta: [
      // ── Core ──
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Eve Beauty Care | Premium Beauty & Skincare Products" },
      {
        name: "description",
        content:
          "Discover premium beauty products, skincare essentials, cosmetics and luxury beauty collections at Eve Beauty Care.",
      },
      {
        name: "keywords",
        content:
          "beauty, skincare, cosmetics, makeup, beauty products, luxury skincare, premium cosmetics, face care, hair care, body care, Eve Beauty Care, beauty store",
      },
      { name: "author", content: "Eve Beauty Care" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#D63384" },

      // ── Open Graph ──
      { property: "og:title", content: "Eve Beauty Care | Premium Beauty Products" },
      {
        property: "og:description",
        content: "Premium skincare, cosmetics and beauty products.",
      },
      { property: "og:url", content: "https://evebeautycare.live" },
      { property: "og:image", content: "https://evebeautycare.live/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Eve Beauty Care — Premium Beauty & Skincare" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Eve Beauty Care" },
      { property: "og:locale", content: "en_IN" },

      // ── Twitter Card ──
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Eve Beauty Care | Premium Beauty Products" },
      {
        name: "twitter:description",
        content: "Premium skincare, cosmetics and beauty products.",
      },
      { name: "twitter:image", content: "https://evebeautycare.live/og-image.png" },
      { name: "twitter:image:alt", content: "Eve Beauty Care — Premium Beauty & Skincare" },

      // ── Google Search Console (replace with your code) ──
      { name: "google-site-verification", content: "YOUR_GOOGLE_VERIFICATION_CODE" },
    ],
    links: [
      // ── Stylesheet ──
      { rel: "stylesheet", href: appCss },

      // ── Canonical ──
      { rel: "canonical", href: "https://evebeautycare.live/" },

      // ── Favicons ──
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", href: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/site.webmanifest" },

      // ── Font Preconnect (performance) ──
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap",
      },

      // ── API Preconnect (performance) ──
      { rel: "dns-prefetch", href: "https://eve-backend-xt14.onrender.com" },
      {
        rel: "preconnect",
        href: "https://eve-backend-xt14.onrender.com",
        crossOrigin: "anonymous",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* ── Google Analytics GA4 Placeholder ──
        Uncomment and replace G-XXXXXXXXXX with your Measurement ID:
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}} />
        */}
      </head>
      <body>
        {children}
        {/* ── Structured Data (JSON-LD) ── */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <StoreJsonLd />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Outlet />
        <Toaster position="top-center" richColors />
      </CartProvider>
    </QueryClientProvider>
  );
}
