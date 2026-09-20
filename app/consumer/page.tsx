import type { Metadata } from "next";
import { ConsumerFunnel } from "../components/ConsumerFunnel";
import { RoleShell } from "../components/RoleShell";
import { absoluteUrl } from "../seo";

const description =
  "Describe your legal issue in plain words and see a matching answer from the Leading Law knowledge library, with links to official sources.";

export const metadata: Metadata = {
  title: "Get legal help",
  description,
  alternates: { canonical: "/consumer" },
  openGraph: { type: "website", title: "Get legal help", description, url: absoluteUrl("/consumer") },
};

export default async function ConsumerPage({
  searchParams,
}: {
  searchParams: Promise<{ issue?: string; category?: string }>;
}) {
  const params = await searchParams;

  return (
    <RoleShell kicker="Get Legal Help" title="Where Legal Needs Meet Legal Excellence.">
      <ConsumerFunnel initialIssue={params.issue ?? ""} initialCategory={params.category ?? ""} />
    </RoleShell>
  );
}
