"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { FaqMatch, buildCategoryQuestions, findNearestFaq, getCategoryGuide } from "../legalKnowledge";
import { categories, cities, getLawyer, icons, languages, Lawyer, lawyerOfTheWeekSlug, lawyers } from "../data";

type BookingMode = "call" | "video";

function pickCertifiedLawyer(category: string, city: string, language: string): Lawyer {
  void category;
  void city;
  void language;
  return getLawyer(lawyerOfTheWeekSlug) ?? lawyers[0];
}

export function ConsumerFunnel() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(categories[1]);
  const [city, setCity] = useState(cities[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [urgency, setUrgency] = useState("Normal");
  const [issue, setIssue] = useState("My builder has delayed possession and is asking for extra maintenance before handover.");
  const [faqMatch, setFaqMatch] = useState<FaqMatch | null>(null);
  const [showCategoryHelp, setShowCategoryHelp] = useState(true);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [bookingMode, setBookingMode] = useState<BookingMode>("call");

  const categoryGuide = getCategoryGuide(category);
  const searchedQuestions = useMemo(() => buildCategoryQuestions(category), [category]);
  const certifiedLawyer = selectedLawyer ?? pickCertifiedLawyer(category, city, language);

  function runSearch(event: FormEvent) {
    event.preventDefault();
    const match = findNearestFaq(issue, category);
    const lawyer = pickCertifiedLawyer(category, city, language);
    setFaqMatch(match);
    setSelectedLawyer(lawyer);
    setStep(2);
  }

  return (
    <div className="flow-layout">
      <section className="flow-rail panel">
        {[
          ["1", "Describe your issue", "Matched against 400+ answered questions per category"],
          ["2", "Nearest answer", "Library answer with source links"],
          ["3", "Certified lawyer", "One LegalSeva-certified lawyer thumbnail"],
          ["4", "Book slot", "3-hour window, Rs 50 platform fee, support link"],
        ].map(([number, title, detail], index) => (
          <button key={number} className={step === index + 1 ? "flow-step active" : "flow-step"} onClick={() => setStep(index + 1)}>
            <span>{number}</span>
            <strong>{title}</strong>
            <small>{detail}</small>
          </button>
        ))}
      </section>

      <section className="flow-main">
        {step === 1 && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Consumer-only knowledge funnel</p>
                <h2>Find the nearest answered legal question before booking</h2>
              </div>
              <span className="status-badge"><icons.BookOpenCheck size={16} /> Knowledge library</span>
            </div>

            <form className="triage-form" onSubmit={runSearch}>
              <div className="form-grid">
                <label>
                  Legal category
                  <select
                    value={category}
                    onChange={(event) => {
                      setCategory(event.target.value);
                      setFaqMatch(null);
                    }}
                  >
                    {categories.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label>
                  City
                  <select value={city} onChange={(event) => setCity(event.target.value)}>
                    {cities.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label>
                  Preferred language
                  <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                    {languages.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label>
                  Urgency
                  <select value={urgency} onChange={(event) => setUrgency(event.target.value)}>
                    <option>Normal</option>
                    <option>Urgent</option>
                    <option>Court notice</option>
                    <option>Police / arrest risk</option>
                    <option>Deadline within 48 hours</option>
                  </select>
                </label>
              </div>

              <button type="button" className="secondary-action inline-help-toggle" onClick={() => setShowCategoryHelp((value) => !value)}>
                <icons.BookOpenCheck size={17} />
                {showCategoryHelp ? "Hide category explanation" : "What comes in this category?"}
              </button>

              {showCategoryHelp && (
                <div className="category-help">
                  <strong>{category}</strong>
                  <p>{categoryGuide.explanation}</p>
                  <div className="tag-row">
                    {categoryGuide.laymanIssues.map((item) => <span key={item}>{item}</span>)}
                  </div>
                </div>
              )}

              <label>
                Describe the issue
                <textarea value={issue} onChange={(event) => setIssue(event.target.value)} />
              </label>

              <div className="search-count-strip">
                <icons.Globe2 size={18} />
                <span>Checking {searchedQuestions.length} answered questions in {category}.</span>
              </div>

              <button className="primary-action wide">
                Find nearest answer
              </button>
            </form>
          </section>
        )}

        {step === 2 && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Knowledge result</p>
                <h2>Nearest common question and answer</h2>
              </div>
              <span className={`risk ${faqMatch?.topic.risk.toLowerCase() ?? "ready"}`}>{faqMatch?.topic.risk ?? "Ready"}</span>
            </div>

            {faqMatch ? (
              <div className="result-stack">
                <div className="search-result-card">
                  <span>Matched from {faqMatch.searchedQuestionCount} answered questions</span>
                  <h3>{faqMatch.matchedQuestion}</h3>
                  <p>{faqMatch.topic.answer}</p>
                  {faqMatch.matchedQuestionSlug && (
                    <Link className="secondary-action" href={`/questions/${faqMatch.matchedQuestionSlug}?role=consumer`}>
                      Open full answer
                    </Link>
                  )}
                </div>

                <div>
                  <h3>Nearest similar questions</h3>
                  <div className="similar-question-list">
                    {faqMatch.similarQuestions.map((question) => (
                      <Link key={question.slug} href={`/questions/${question.slug}?role=consumer`}>
                        {question.question}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3>Suggested next steps</h3>
                  <ul className="clean-list">
                    {faqMatch.topic.nextSteps.map((item) => <li key={item}>{item}</li>)}
                    {urgency !== "Normal" && <li>Because you marked this as {urgency.toLowerCase()}, prefer a live consultation window over waiting.</li>}
                  </ul>
                </div>

                <div>
                  <h3>Source links</h3>
                  <div className="source-list">
                    {faqMatch.sources.map((source) => (
                      <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                        <strong>{source.title}</strong>
                        <span>{source.note}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="checks">
                  <div className="check-row">
                    <icons.CheckCircle2 size={18} />
                    <div>
                      <strong>Lawyer marketing guard</strong>
                      <span>Escalation shows one LegalSeva-certified lawyer card after the user requests booking.</span>
                    </div>
                  </div>
                </div>

                <div className="button-row">
                  <button className="primary-action" onClick={() => setStep(3)}>Continue to certified lawyer</button>
                  <Link className="secondary-action" href="/questions?role=consumer">Read Q&A</Link>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <icons.BookOpenCheck size={42} />
                <p>Describe your issue in step one to see the nearest answered question.</p>
              </div>
            )}
          </section>
        )}

        {step === 3 && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">LegalSeva certified</p>
                <h2>Lawyer of the Week</h2>
              </div>
              <span className="status-badge"><icons.BadgeCheck size={16} /> Always shown first</span>
            </div>

            <div className="certified-lawyer-wrap">
              <article className="lawyer-card certified-lawyer-card">
                <div className="certified-ribbon"><icons.BadgeCheck size={16} /> Lawyer of the Week</div>
                <div className="lawyer-top centered-lawyer-top">
                  <div className="avatar large">{certifiedLawyer.initials}</div>
                  <div>
                    <h3>{certifiedLawyer.name}</h3>
                    <p>{certifiedLawyer.city} · {certifiedLawyer.court}</p>
                  </div>
                </div>
                <div className="metric-row center-metrics">
                  <span><icons.Activity size={15} /> {certifiedLawyer.response}% response</span>
                  <span><icons.BriefcaseBusiness size={15} /> {certifiedLawyer.experienceLabel ?? `${certifiedLawyer.years} yrs`}</span>
                  <span><icons.Star size={15} /> {certifiedLawyer.feedback}</span>
                </div>
                <div className="tag-row centered-tags">
                  {certifiedLawyer.areas.slice(0, 4).map((area) => <span key={area}>{area}</span>)}
                </div>
                <p className="verified centered-verified"><icons.ShieldCheck size={16} /> {certifiedLawyer.verified}</p>
                <p>{certifiedLawyer.bio}</p>
                <div className="button-row center-buttons">
                  <Link className="secondary-action" href={`/lawyer/${certifiedLawyer.slug}`}>View profile</Link>
                  <button className="primary-action" onClick={() => setStep(4)}>Book consultation</button>
                </div>
              </article>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Book a 3-hour slot</p>
                <h2>Choose how both sides will connect</h2>
              </div>
              <span className="status-badge">Platform fee Rs 50</span>
            </div>

            <div className="mode-switch two-mode-switch">
              <button className={bookingMode === "call" ? "active" : ""} onClick={() => setBookingMode("call")}>
                <icons.Phone size={18} /> Direct call
              </button>
              <button className={bookingMode === "video" ? "active" : ""} onClick={() => setBookingMode("video")}>
                <icons.Video size={18} /> Google Meet
              </button>
            </div>

            <div className="booking-summary">
              <div className="booking-channel-grid">
                <div>
                  <icons.Phone size={24} />
                  <strong>Direct call</strong>
                  <span>LegalSeva will call the consumer and lawyer inside the selected 3-hour window.</span>
                </div>
                <div>
                  <icons.Video size={24} />
                  <strong>Google Meet</strong>
                  <span>Both sides see the same mock Meet room after booking confirmation.</span>
                </div>
              </div>
              <div className="price-row">
                <span><icons.CircleDollarSign size={17} /> Consultation: Rs {certifiedLawyer.fixed}</span>
                <span><icons.CircleDollarSign size={17} /> Platform fee: Rs 50</span>
              </div>
              <div className="aid-box">
                <icons.UserCheck size={28} />
                <p>Bookings include a one-time reschedule option after payment. Support is visible from the booking details screen.</p>
              </div>
              <Link
                className="primary-action wide"
                href={`/consultation/${bookingMode}?lawyer=${certifiedLawyer.slug}&category=${encodeURIComponent(category)}`}
              >
                Continue to {bookingMode === "video" ? "Google Meet" : "direct call"} booking
              </Link>
              <div className="button-row">
                <Link className="secondary-action" href="/bookings">My bookings</Link>
                <Link className="secondary-action" href="/support">Support</Link>
              </div>
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
