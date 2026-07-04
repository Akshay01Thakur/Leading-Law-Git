import { LawyerWorkbench } from "../components/LawyerWorkbench";
import { RoleShell } from "../components/RoleShell";

export default function LawyerPage() {
  return (
    <RoleShell role="lawyer" kicker="Lawyer workspace" title="Consultations, Q&A reputation and safety review">
      <LawyerWorkbench />
    </RoleShell>
  );
}
