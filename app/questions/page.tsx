import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { QuestionBoard } from "../components/QuestionBoard";
import { RoleShell } from "../components/RoleShell";
import { getTopicsByCategory, legalCategoryGuides } from "../legalKnowledge";
import { JsonLd, absoluteUrl, breadcrumbJsonLd } from "../seo";

const description =
  "Answers to common legal questions in India across family, property, criminal, cyber fraud, consumer, cheque bounce, employment and startup matters, with links to official sources.";

export const metadata: Metadata = {
  title: "Legal knowledge library",
  description,
  alternates: { canonical: "/questions" },
  openGraph: { type: "website", title: "Legal knowledge library", description, url: absoluteUrl("/questions") },
};

export default function QuestionsPage() {
  return (
    <RoleShell kicker="Legal knowledge library" title="Answers people look for">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Legal knowledge", path: "/questions" },
        ])}
      />
      <Suspense fallback={<section className="panel">Loading Q&amp;A...</section>}>
        <QuestionBoard />
      </Suspense>
      <TopicIndex />
    </RoleShell>
  );
}

/**
 * Server-rendered index of every indexable topic page, grouped by category.
 * The board above is client-filtered, so without this there is no static link
 * trail for a crawler to follow into the library.
 */
function TopicIndex() {
  return (
    <section className="panel wide-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Full index</p>
          <h2>Every answer by category</h2>
        </div>
      </div>
      {legalCategoryGuides.map((guide) => (
        <div key={guide.name}>
          <h3>{guide.name}</h3>
          <div className="similar-question-list">
            {getTopicsByCategory(guide.name).map((item) => (
              <Link href={`/questions/${item.slug}`} key={item.slug}>{item.question}</Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
