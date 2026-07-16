/**
 * JSON-LD Structured Data Components
 * Renders Schema.org structured data for SEO.
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Generic JSON-LD renderer */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization + Store schema */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Eve Beauty Care",
    url: "https://evebeautycare.live",
    logo: "https://evebeautycare.live/logo.png",
    description:
      "Premium beauty and skincare products designed for everyday confidence.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9836579402",
      contactType: "customer service",
      email: "evebcare@gmail.com",
      availableLanguage: "English",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "C.I.T Road",
      addressLocality: "Kolkata",
      addressRegion: "West Bengal",
      postalCode: "700014",
      addressCountry: "IN",
    },
    sameAs: [
      // Social profile URLs
      "https://www.instagram.com/eve_beautycare?igsh=Nng1ZXBkNmNhY3hl",
      "https://www.facebook.com/share/1AoJLrGd1Z/",
    ],
  };

  return <JsonLd data={data} />;
}

/** WebSite schema with SearchAction */
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Eve Beauty Care",
    url: "https://evebeautycare.live",
    description:
      "Discover premium beauty products, skincare essentials, cosmetics and luxury beauty collections at Eve Beauty Care.",
    publisher: {
      "@type": "Organization",
      name: "Eve Beauty Care",
      logo: {
        "@type": "ImageObject",
        url: "https://evebeautycare.live/logo.png",
      },
    },
  };

  return <JsonLd data={data} />;
}

/** Store schema */
export function StoreJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Eve Beauty Care",
    url: "https://evebeautycare.live",
    logo: "https://evebeautycare.live/logo.png",
    image: "https://evebeautycare.live/og-image.png",
    description:
      "Premium beauty and skincare products designed for everyday confidence.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "C.I.T Road",
      addressLocality: "Kolkata",
      addressRegion: "West Bengal",
      postalCode: "700014",
      addressCountry: "IN",
    },
    priceRange: "₹₹",
    telephone: "+91-9836579402",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };

  return <JsonLd data={data} />;
}

/** BreadcrumbList schema */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}
