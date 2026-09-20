import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LegalDisclaimerGate } from "./components/LegalDisclaimerGate";

export const metadata: Metadata = {
  title: "Leading Law | Knowledge-first legal help for India",
  description:
    "A serious, trust-first legal marketplace connecting Indian consumers with certified advocates after reviewed legal Q&A.",
};

// Paints the mobile browser chrome in the logo's navy so the site does not sit
// inside a grey bar on phones.
export const viewport: Viewport = {
  themeColor: "#02407d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LegalDisclaimerGate />
        {children}
      </body>
    </html>
  );
}
