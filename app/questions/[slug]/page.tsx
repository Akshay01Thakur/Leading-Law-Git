import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackButton } from "../../components/BackButton";
import { RoleShell } from "../../components/RoleShell";
import { icons, lawyerOfTheWeekSlug } from "../../data";
import {
  getCanonicalTopic,
  getQuestionBySlug,
  getQuestionSources,
  getRelatedQuestions,
  getRelatedTopics,
  getTopicBySlug,
  getTopicFaq,
  getTopicSources,
  topicLibrary,
  type LegalTopicRecord,
} from "../../legalKnowledge";
import { JsonLd, absoluteUrl, breadcrumbJsonLd, faqPageJsonLd, toMetaDescription } from "../../seo";

type PageProps = { params: Promise<{ slug: string }> };

/**
 * The 110 topic pages are prerendered and indexable. The 5,390 other
 * phrasings still resolve — existing links keep working — but render on
 * demand as `noindex, follow` with a canonical pointing at their topic.
 */
export function generateStaticParams() {
  return topicLibrary.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const topic = getTopicBySlug(slug);
  if (topic) {
    const description = toMetaDescription(topic.answer);
    return {
      title: topic.question,
      description,
      keywords: [...topic.keywords, topic.category],
      alternates: { canonical: `/questions/${topic.slug}` },
      openGraph: {
        type: "article",
        title: topic.question,
        description,
        url: absoluteUrl(`/questions/${topic.slug}`),
      },
      twitter: { card: "summary_large_image", title: topic.question, description },
    };
  }

  const question = getQuestionBySlug(slug);
  if (!question) return { title: "Question not found", robots: { index: false, follow: false } };

  const canonical = getCanonicalTopic(question);
  return {
    title: question.question,
    description: toMetaDescription(question.answer),
    robots: { index: false, follow: true },
    alternates: canonical ? { canonical: `/questions/${canonical.slug}` } : undefined,
  };
}

export default async function QuestionDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const topic = getTopicBySlug(slug);
  if (topic) return <TopicAnswer topic={topic} />;

  const question = getQuestionBySlug(slug);
  if (!question) notFound();

  return <PhrasingAnswer question={question} />;
}

function GuidanceNote() {
  return (
    <p className="muted-line">
      This is general information about how this kind of matter usually works in India. It is not legal advice and
      does not create an advocate-client relationship. A consultation should review your own documents before you
      decide the next step.
    </p>
  );
}

function TopicAnswer({ topic }: { topic: LegalTopicRecord }) {
  const sources = getTopicSources(topic);
  const relatedTopics = getRelatedTopics(topic, 6);
  const faq = getTopicFaq(topic);
  const bookingHref = `/consultation/call?lawyer=${lawyerOfTheWeekSlug}&category=${encodeURIComponent(topic.category)}`;

  return (
    <RoleShell kicker={topic.category} title={topic.question}>
      <JsonLd
        data={faqPageJsonLd([
          { question: topic.question, answer: topic.answer },
          ...faq.map((entry) => ({ question: entry.question, answer: entry.guidance })),
        ])}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Legal knowledge", path: "/questions" },
          { name: topic.question, path: `/questions/${topic.slug}` },
        ])}
      />

      <div className="view-grid">
        <section className="panel">
          <div className="button-row top-back-row">
            <BackButton fallbackHref="/questions" />
          </div>
          <div className="qa-head detail-head">
            <span>{topic.category}</span>
          </div>
          <div className="answer-detail">
            <p>{topic.answer}</p>
            <GuidanceNote />
            <div>
              <h2>Useful next steps</h2>
              <ul className="clean-list">
                {topic.nextSteps.map((step) => <li key={step}>{step}</li>)}
              </ul>
            </div>
            <div>
              <h2>About {topic.category} matters</h2>
              <p>{topic.categoryExplanation}</p>
            </div>
            <div>
              <h2>Official reference links</h2>
              <div className="source-list">
                {sources.map((source) => (
                  <a key={source.id} href={source.url} rel="noreferrer" target="_blank">
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
              {topic.answeredBy}
              <small>Leading Law Verified Advocate</small>
            </span>
          </div>
          <div className="button-row">
            <Link className="primary-action wide" href={bookingHref}>Book consultation</Link>
            <Link className="secondary-action wide" href="/questions">All questions</Link>
          </div>
        </aside>

        {/* The 50 phrasings of this topic, inline. Each contributes the sentence
            that is specific to it, which is what makes this page worth indexing
            instead of 50 thin ones. */}
        <section className="panel wide-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Common questions on this topic</p>
              <h2>{faq.length} related questions, answered</h2>
            </div>
          </div>
          <div className="answer-detail">
            {faq.map((entry) => (
              <div key={entry.slug}>
                <h3>{entry.question}</h3>
                <p>{entry.guidance}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel wide-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Related {topic.category} answers</p>
              <h2>Read next</h2>
            </div>
          </div>
          <div className="similar-question-list">
            {relatedTopics.map((item) => (
              <Link href={`/questions/${item.slug}`} key={item.slug}>{item.question}</Link>
            ))}
          </div>
        </section>
      </div>
    </RoleShell>
  );
}

function PhrasingAnswer({ question }: { question: ReturnType<typeof getQuestionBySlug> & {} }) {
  const canonical = getCanonicalTopic(question);
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
          {canonical && (
            <p className="muted-line">
              Full answer: <Link href={`/questions/${canonical.slug}`}>{canonical.question}</Link>
            </p>
          )}
          <div className="qa-head detail-head">
            <span>{question.category}</span>
          </div>
          <div className="answer-detail">
            <p>{question.answer}</p>
            <GuidanceNote />
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
                  <a key={source.id} href={source.url} rel="noreferrer" target="_blank">
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
              <Link href={`/questions/${item.slug}`} key={item.slug}>{item.question}</Link>
            ))}
          </div>
        </section>
      </div>
    </RoleShell>
  );
}
