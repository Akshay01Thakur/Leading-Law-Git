import { ConsumerFunnel } from "../components/ConsumerFunnel";
import { RoleShell } from "../components/RoleShell";

export default function ConsumerPage() {
  return (
    <RoleShell role="consumer" kicker="Find Legal Help" title="Where Legal Needs Meet Legal Excellence.">
      <ConsumerFunnel />
    </RoleShell>
  );
}
