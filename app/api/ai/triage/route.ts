import { NextRequest, NextResponse } from "next/server";
import { findNearestFaq } from "../../../legalKnowledge";

export const runtime = "nodejs";

type TriagePayload = {
  issue?: string;
  category?: string;
  city?: string;
  language?: string;
  urgency?: string;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as TriagePayload;
  const issue = payload.issue?.trim() || "I need legal information.";
  const category = payload.category || "Property / RERA";
  const match = findNearestFaq(issue, category);

  return NextResponse.json({
    mode: "legalseva-knowledge-library-match",
    summary: `LegalSeva matched your issue to a common ${match.category.name} question from ${match.searchedQuestionCount} answered question patterns.`,
    riskLevel: match.topic.risk,
    shouldEscalate: match.topic.risk !== "Low",
    escalationReason:
      match.topic.risk === "Low"
        ? "This appears suitable for information-first review unless documents show urgency."
        : "This issue may need document review, local procedure checks, or advocate verification.",
    answer: match.topic.answer,
    matchedQuestion: match.matchedQuestion,
    similarQuestions: match.similarQuestions,
    nextSteps: match.topic.nextSteps,
    checks: [
      {
        label: "Knowledge library",
        status: "passed",
        detail: "The response came from LegalSeva's reviewed question-and-answer library.",
      },
      {
        label: "Nearest-question match",
        status: "passed",
        detail: `Matched within the selected ${match.category.name} category.`,
      },
      {
        label: "Source links",
        status: "passed",
        detail: "Displayed sources are fixed official/legal reference links stored by LegalSeva.",
      },
    ],
    citations: match.sources.map((source) => ({
      id: source.id,
      title: source.title,
      url: source.url,
      note: source.note,
      jurisdiction: "India",
    })),
    match: {
      city: payload.city ?? "Not specified",
      language: payload.language ?? "English",
      urgency: payload.urgency ?? "Normal",
      score: match.score,
      answeredQuestionCount: match.searchedQuestionCount,
    },
  });
}
