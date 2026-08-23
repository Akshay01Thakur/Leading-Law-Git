"use client";

import { Suspense } from "react";
import { QuestionBoard } from "../components/QuestionBoard";
import { RoleShell } from "../components/RoleShell";

export default function QuestionsPage() {
  return (
    <Suspense fallback={<QuestionsFallback />}>
      <RoleShell kicker="Legal knowledge library" title="Answers people look for">
        <QuestionBoard />
      </RoleShell>
    </Suspense>
  );
}

function QuestionsFallback() {
  return (
    <RoleShell kicker="Legal knowledge library" title="Answers people look for">
      <section className="panel">Loading Q&A...</section>
    </RoleShell>
  );
}
