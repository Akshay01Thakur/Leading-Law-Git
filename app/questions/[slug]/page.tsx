"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BackButton } from "../../components/BackButton";
import { RoleShell } from "../../components/RoleShell";
import { icons, lawyerOfTheWeekSlug } from "../../data";
import { getQuestionBySlug, getQuestionSources, getRelatedQuestions } from "../../legalKnowledge";

export default function QuestionDetailPage() {
  const params = useParams<{ slug: string }>();
  const question = getQuestionBySlug(params.slug);

  if (!question) {
    return (
      <RoleShell kicker="Q&A" title="Question not found">
        <section className="panel">
          <p>This answer is not available in the current Leading Law question library.</p>
          <Link className="primary-action" href="/questions">Back to Q&A library</Link>
        </section>
      </RoleShell>
    );
  }

  const sources = getQuestionSources(question);
  const related = getRelatedQuestions(question, 8);
  const bookingHref = `/consultation/call?lawyer=${lawyerOfTheWeekSlug}&category=${encodeURIComponent(question.category)}`;

  return (
    <RoleShell kicker={question.category} title={question.question}>
      <div className="view-grid">
        <section className="panel">
          <div className="button-row top-back-row">
            <BackButton fallbackHref="/questions" />
          </div>
          <div className="qa-head detail-head">
            <span>{question.category}</span>
            <small>{question.reads} reads · {question.upvotes} upvotes</small>
          </div>
          <div className="answer-detail">
            <p>{question.answer}</p>
            <div>
              <h2>Useful next steps</h2>
              <ul className="clean-list">
                {question.nextSteps.map((step) => <li key={step}>{step}</li>)}
              </ul>
            </div>
            <div>
              <h2>Reference links</h2>
              <div className="source-list">
                {sources.map((source) => (
                  <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                    <strong>{source.title}</strong>
                    <span>{source.note}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="panel">
          <p className="eyebrow">Answered by</p>
          <div className="answer-lawyer profile-answer-card">
            <span className="avatar"><icons.ShieldCheck size={20} /></span>
            <span>
              {question.answeredBy}
              <small>Leading Law Verified Advocate</small>
            </span>
          </div>
          <div className="button-row">
            <Link className="primary-action wide" href={bookingHref}>Book consultation</Link>
            <Link className="secondary-action wide" href="/questions">All questions</Link>
          </div>
        </aside>

        <section className="panel wide-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Similar questions</p>
              <h2>Open related answers</h2>
            </div>
          </div>
          <div className="similar-question-list">
            {related.map((item) => (
              <Link key={item.slug} href={`/questions/${item.slug}`}>
                {item.question}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </RoleShell>
  );
}
