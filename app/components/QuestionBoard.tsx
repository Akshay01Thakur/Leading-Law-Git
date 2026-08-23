"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getQuestionSources, legalCategoryGuides, questionLibrary, questionLibraryStats } from "../legalKnowledge";
import { icons, lawyerOfTheWeekSlug } from "../data";

export function QuestionBoard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const selectedCategory = legalCategoryGuides.some((guide) => guide.name === categoryParam) ? categoryParam ?? "All" : "All";
  const [category, setCategory] = useState(selectedCategory);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(120);
  const [upvotes, setUpvotes] = useState<Record<string, number>>(
    Object.fromEntries(questionLibrary.map((question) => [question.slug, question.upvotes])),
  );
  const activePublicCount = category === "All"
    ? questionLibraryStats.total
    : questionLibraryStats.categories.find((item) => item.name === category)?.count ?? questionLibraryStats.total;

  const filteredQuestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return questionLibrary.filter((question) => {
      const categoryMatch = category === "All" || question.category === category;
      const queryMatch =
        !normalizedQuery ||
        question.question.toLowerCase().includes(normalizedQuery) ||
        question.answer.toLowerCase().includes(normalizedQuery);
      return categoryMatch && queryMatch;
    });
  }, [category, query]);

  useEffect(() => {
    setCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    setVisibleCount(120);
  }, [category, query]);

  const visibleQuestions = filteredQuestions.slice(0, visibleCount);

  function openCategory(nextCategory: string) {
    setCategory(nextCategory);
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    if (nextCategory === "All") {
      params.delete("category");
    } else {
      params.set("category", nextCategory);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="content-stack">
      <section className="panel split-panel">
        <div>
          <p className="eyebrow">Legal knowledge library</p>
          <h2>Legal answers people look for</h2>
          <p>{questionLibraryStats.total} stored answered questions across {questionLibraryStats.categories.length} legal categories</p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Question library</p>
            <h2>{activePublicCount} answered questions</h2>
            <p className="muted-line">Showing {Math.min(visibleCount, filteredQuestions.length)} open answers from this {category === "All" ? "library" : "category"}</p>
          </div>
          <div className="qa-filter-row">
            <label>
              Category
              <select value={category} onChange={(event) => openCategory(event.target.value)}>
                <option>All</option>
                {legalCategoryGuides.map((guide) => <option key={guide.name}>{guide.name}</option>)}
              </select>
            </label>
            <label>
              Search
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search answers" />
            </label>
          </div>
        </div>

        <div className="qa-stats-grid">
          <button
            aria-pressed={category === "All"}
            className={`category-stat-card ${category === "All" ? "active" : ""}`}
            data-category="All"
            onClick={() => openCategory("All")}
            type="button"
          >
            <strong>{questionLibraryStats.total}</strong>
            <span>All legal Q&A</span>
          </button>
          {questionLibraryStats.categories.map((item) => (
            <button
              aria-pressed={category === item.name}
              className={`category-stat-card ${category === item.name ? "active" : ""}`}
              data-category={item.name}
              key={item.name}
              onClick={() => openCategory(item.name)}
              type="button"
            >
              <strong>{item.count}</strong>
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        <div className="qa-grid large-library-grid">
          {visibleQuestions.map((question) => {
            const sources = getQuestionSources(question);
            return (
              <article className="qa-card" key={question.slug}>
                <div className="qa-head">
                  <span>{question.category}</span>
                  <small>{question.reads} reads</small>
                </div>
                <h3>
                  <Link href={`/questions/${question.slug}`}>{question.question}</Link>
                </h3>
                <p>{question.answer}</p>
                <div className="answer-lawyer">
                  <span className="avatar small"><icons.ShieldCheck size={16} /></span>
                  <span>
                    Answered by {question.answeredBy}
                    <small>Leading Law Verified Advocate</small>
                  </span>
                </div>
                <div className="citation-list">
                  {sources.map((source) => <span key={source.id}>{source.title}</span>)}
                </div>
                <div className="qa-actions">
                  <button
                    className="secondary-action"
                    onClick={() => setUpvotes((current) => ({ ...current, [question.slug]: current[question.slug] + 1 }))}
                  >
                    <icons.Star size={16} /> Upvote answer · {upvotes[question.slug]}
                  </button>
                  <Link className="secondary-action" href={`/questions/${question.slug}`}>Open answer</Link>
                  <Link
                    className="primary-action"
                    href={`/consultation/call?lawyer=${lawyerOfTheWeekSlug}&category=${encodeURIComponent(question.category)}`}
                  >
                    Book consultation
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        {visibleCount < filteredQuestions.length && (
          <div className="button-row center-buttons">
            <button className="primary-action" onClick={() => setVisibleCount((current) => current + 120)}>
              Load more questions
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
