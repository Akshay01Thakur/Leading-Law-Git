/**
 * Single source of truth for canonical URLs, site identity and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in the hosting platform to the production origin
 * — canonical tags, sitemap and structured data all derive from it.
 */

export const siteName = "Leading Law";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://leadinglaw.in").replace(/\/+$/, "");

export const siteDescription =
  "Plain-language answers to common legal questions in India — family, property, criminal, cyber fraud, consumer, cheque bounce, employment and more — with links to official sources.";

export function absoluteUrl(path: string) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Trim to a clean meta-description length without cutting a word in half. */
export function toMetaDescription(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": absoluteUrl("/#organization"),
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    areaServed: { "@type": "Country", name: "India" },
    availableLanguage: ["en", "hi"],
    knowsAbout: [
      "Family and divorce law",
      "Property and RERA",
      "Criminal law and bail",
      "Cyber fraud",
      "Consumer complaints",
      "Cheque bounce",
      "Employment and labour law",
    ],
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function faqPageJsonLd(entries: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

/** Renders a JSON-LD block. Next dedupes nothing here, so pass one object per call. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
