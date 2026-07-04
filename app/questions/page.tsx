"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { QuestionBoard } from "../components/QuestionBoard";
import { RoleShell } from "../components/RoleShell";
import { Role } from "../data";

export default function QuestionsPage() {
  return (
    <Suspense fallback={<QuestionsFallback />}>
      <QuestionsContent />
    </Suspense>
  );
}

function QuestionsContent() {
  const searchParams = useSearchParams();
  const rawRole = searchParams.get("role");
  const role: Role = rawRole === "lawyer" || rawRole === "admin" ? rawRole : "consumer";

  return (
    <RoleShell role={role} kicker="Shared knowledge engine" title="Q&A changes by role and intent">
      <QuestionBoard role={role} />
    </RoleShell>
  );
}

function QuestionsFallback() {
  return (
    <RoleShell role="consumer" kicker="Shared knowledge engine" title="Q&A changes by role and intent">
      <section className="panel">Loading Q&A...</section>
    </RoleShell>
  );
}
