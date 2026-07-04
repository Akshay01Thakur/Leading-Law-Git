import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leading Law | Knowledge-first legal help for India",
  description:
    "A serious, trust-first legal marketplace connecting Indian consumers with certified advocates after reviewed legal Q&A.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
