import { ConsumerFunnel } from "../components/ConsumerFunnel";
import { RoleShell } from "../components/RoleShell";

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
