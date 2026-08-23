import { ConsumerFunnel } from "../components/ConsumerFunnel";
import { RoleShell } from "../components/RoleShell";

export default function ConsumerPage() {
  return (
    <RoleShell kicker="Consumer" title="Where Legal Needs Meet Legal Excellence.">
      <ConsumerFunnel />
    </RoleShell>
  );
}
