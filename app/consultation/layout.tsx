import type { Metadata } from "next";

/** Booking funnel: query-param driven, no search value. */
export const metadata: Metadata = {
  title: "Book a consultation",
  robots: { index: false, follow: true },
};

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
