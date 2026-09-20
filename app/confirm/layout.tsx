import type { Metadata } from "next";

/** Passcode-gated advocate view. Never index, never follow. */
export const metadata: Metadata = {
  title: "Confirm appointment",
  robots: { index: false, follow: false },
};

export default function ConfirmLayout({ children }: { children: React.ReactNode }) {
  return children;
}
