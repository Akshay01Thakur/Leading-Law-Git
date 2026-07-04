"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleShell } from "../../components/RoleShell";
import { getLawyer, icons } from "../../data";
import { questionLibrary } from "../../legalKnowledge";

export default function LawyerProfilePage() {
  const params = useParams<{ slug: string }>();
  const lawyer = getLawyer(params.slug);

  if (!lawyer) {
    return (
      <RoleShell role="consumer" kicker="Profile" title="Lawyer profile not found">
        <section className="panel">
          <p>This sample profile does not exist.</p>
          <Link className="primary-action" href="/consumer">Back to consumer funnel</Link>
        </section>
      </RoleShell>
    );
  }

  const answers = questionLibrary.filter((question) => question.lawyerSlug === lawyer.slug).slice(0, 30);

  return (
    <RoleShell role="consumer" kicker="Public lawyer profile" title={lawyer.name}>
      <div className="view-grid">
        <section className="panel">
          <div className="lawyer-top profile-top">
            <div className="avatar large">{lawyer.initials}</div>
            <div>
              <h2>{lawyer.name}</h2>
              <p>{lawyer.city} · {lawyer.court}</p>
              {lawyer.slug === "vivek-yadav" && <p className="certified-ribbon profile-ribbon"><icons.BadgeCheck size={16} /> Lawyer of the Week</p>}
              <p>{lawyer.bio}</p>
            </div>
          </div>
          <div className="tag-row">
            {lawyer.areas.map((area) => <span key={area}>{area}</span>)}
          </div>
          <div className="metric-row big">
            <span><icons.Activity size={16} /> {lawyer.response}% response</span>
            <span><icons.BriefcaseBusiness size={16} /> {lawyer.experienceLabel ?? `${lawyer.years} years`}</span>
            <span><icons.Star size={16} /> {lawyer.profileUpvotes} answer upvotes</span>
          </div>
          <p className="verified"><icons.BadgeCheck size={16} /> {lawyer.verified}</p>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Public answer reputation</p>
              <h2>Profile-linked answers</h2>
            </div>
          </div>
          <div className="queue-list">
            {answers.map((answer) => (
              <div className="queue-row" key={answer.slug}>
                <div>
                  <Link href={`/questions/${answer.slug}?role=consumer`}><strong>{answer.question}</strong></Link>
                  <span>{answer.upvotes} upvotes · {answer.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </RoleShell>
  );
}
