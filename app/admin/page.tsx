"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminConsole } from "../components/AdminConsole";
import { RoleShell } from "../components/RoleShell";
import { Role } from "../data";

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminFallback />}>
      <AdminContent />
    </Suspense>
  );
}

function AdminContent() {
  const searchParams = useSearchParams();
  const role: Role = searchParams.get("role") === "lawyer" ? "lawyer" : "admin";

  return (
    <RoleShell role={role} kicker={role === "lawyer" ? "Lawyer review console" : "Governance console"} title="Admin and lawyer quality controls">
      <AdminConsole />
    </RoleShell>
  );
}

function AdminFallback() {
  return (
    <RoleShell role="admin" kicker="Governance console" title="Admin and lawyer quality controls">
      <section className="panel">Loading console...</section>
    </RoleShell>
  );
}
