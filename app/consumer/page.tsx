import { ConsumerFunnel } from "../components/ConsumerFunnel";
import { RoleShell } from "../components/RoleShell";

export default function ConsumerPage() {
  return (
    <RoleShell role="consumer" kicker="Consumer journey" title="Legal intake that behaves like a guided funnel">
      <ConsumerFunnel />
    </RoleShell>
  );
}
