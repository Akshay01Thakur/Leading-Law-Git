import type { Metadata } from "next";
import "./globals.css";
import { LegalDisclaimerGate } from "./components/LegalDisclaimerGate";
import { JsonLd, organizationJsonLd, siteDescription, siteName, siteUrl } from "./seo";

const defaultTitle = "Leading Law | Knowledge-first legal help for India";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: `%s | ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName,
    locale: "en_IN",
    url: "/",
    title: defaultTitle,
    description: siteDescription,
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: siteDescription },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  category: "legal",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>
        <JsonLd data={organizationJsonLd()} />
        {children}
        {/* Rendered after content so the document leads with page markup, not the gate. */}
        <LegalDisclaimerGate />
      </body>
    </html>
  );
}
