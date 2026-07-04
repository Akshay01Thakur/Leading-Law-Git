export type LegalSource = {
  id: string;
  title: string;
  url: string;
  note: string;
};

export type FaqTopic = {
  id: string;
  question: string;
  plainIssue: string;
  keywords: string[];
  answer: string;
  nextSteps: string[];
  sourceIds: string[];
  risk: "Low" | "Medium" | "High";
};

type QuestionStyle = {
  intent: string;
  question: (issue: string) => string;
  guidance: (topicItem: FaqTopic, category: LegalCategoryGuide) => string;
};

export type LegalCategoryGuide = {
  name: string;
  explanation: string;
  laymanIssues: string[];
  topics: FaqTopic[];
};

export type FaqMatch = {
  category: LegalCategoryGuide;
  topic: FaqTopic;
  matchedQuestion: string;
  matchedQuestionSlug: string;
  similarQuestions: { slug: string; question: string }[];
  searchedQuestionCount: number;
  score: number;
  sources: LegalSource[];
};

export type LegalQuestionRecord = {
  slug: string;
  category: string;
  topicId: string;
  question: string;
  answer: string;
  nextSteps: string[];
  sourceIds: string[];
  risk: FaqTopic["risk"];
  reads: string;
  upvotes: number;
  lawyerSlug: string;
  intent: string;
  answeredBy: string;
};

export const legalSources: Record<string, LegalSource> = {
  NALSA: {
    id: "NALSA",
    title: "National Legal Services Authority",
    url: "https://nalsa.gov.in/",
    note: "Free legal aid and legal services authority access for eligible persons.",
  },
  BCI: {
    id: "BCI",
    title: "Bar Council of India Rules",
    url: "https://www.barcouncilofindia.org/",
    note: "Advocate advertising and solicitation boundaries.",
  },
  CONSUMER: {
    id: "CONSUMER",
    title: "National Consumer Helpline",
    url: "https://consumerhelpline.gov.in/",
    note: "Consumer grievance information and escalation routes.",
  },
  CYBER: {
    id: "CYBER",
    title: "National Cyber Crime Reporting Portal",
    url: "https://cybercrime.gov.in/",
    note: "Cyber crime reporting and emergency financial fraud reporting route.",
  },
  ECOURTS: {
    id: "ECOURTS",
    title: "eCourts Services",
    url: "https://services.ecourts.gov.in/",
    note: "Case status and court-service access.",
  },
  INDIA_CODE: {
    id: "INDIA_CODE",
    title: "India Code",
    url: "https://www.indiacode.nic.in/",
    note: "Central Acts and legal text repository.",
  },
  GST: {
    id: "GST",
    title: "GST Portal",
    url: "https://www.gst.gov.in/",
    note: "GST registration, return and notice workflow entry point.",
  },
  INCOME_TAX: {
    id: "INCOME_TAX",
    title: "Income Tax e-Filing Portal",
    url: "https://www.incometax.gov.in/iec/foportal/",
    note: "Income tax notices, filing and compliance portal.",
  },
};

const questionStyles: QuestionStyle[] = [
  style("first-step", (issue) => `What should I do about ${issue}?`, (topicItem) => `Start with a clean timeline and the documents behind the issue. For ${topicItem.plainIssue}, Vivek would first separate what is proven, what is only alleged, and what needs advocate review before any notice or filing.`),
  style("legal-action", (issue) => `Can I take legal action for ${issue}?`, (topicItem) => `Legal action may be possible, but it should follow the document trail. In ${topicItem.plainIssue}, the useful question is whether the facts show a legal right, a breach, and a forum that can act on it.`),
  style("documents", (issue) => `Which documents are needed for ${issue}?`, (topicItem) => `The core file should include identity proof, all written communication, payment or transaction records, notices, agreements, screenshots and a date-wise summary. The documents for ${topicItem.plainIssue} decide the strength of the next step.`),
  style("lawyer-need", (issue) => `Do I need a lawyer for ${issue}?`, (topicItem) => `${topicItem.risk === "High" ? "Yes, this is lawyer-review territory because the risk is high." : "A lawyer is useful if documents are disputed, deadlines are close, or the other side has sent a notice."} For ${topicItem.plainIssue}, take advice before signing, replying, paying, withdrawing, or filing anything formal.`),
  style("complaint", (issue) => `How do I start a complaint for ${issue}?`, (topicItem) => `Begin with a written complaint that states facts, dates, documents and the relief sought. For ${topicItem.plainIssue}, avoid emotional allegations and attach only relevant proof.`),
  style("options", (issue) => `What are my practical options for ${issue}?`, (topicItem) => `Practical options usually include written demand, negotiation, mediation, statutory complaint, court filing or waiting with documentation. In ${topicItem.plainIssue}, the right route depends on urgency and proof.`),
  style("urgency", (issue) => `How urgent is ${issue}?`, (topicItem) => `${topicItem.risk === "High" ? "Treat this as urgent." : topicItem.risk === "Medium" ? "Treat this as time-sensitive, not casual." : "This is usually not an emergency unless a deadline or notice is involved."} For ${topicItem.plainIssue}, urgency rises if there is court notice, police contact, limitation, money movement, eviction, safety risk or a signing deadline.`),
  style("forum", (issue) => `Where can I file for ${issue}?`, (topicItem) => `The forum depends on the city, subject, amount, contract clause and parties. For ${topicItem.plainIssue}, Vivek would first check whether the route is court, tribunal, authority, police, consumer forum, department portal or arbitration.`),
  style("proof", (issue) => `What proof should I keep for ${issue}?`, (topicItem) => `Keep originals and exportable records: messages, emails, receipts, notices, photos, recordings where lawful, bank entries and complaint numbers. In ${topicItem.plainIssue}, proof should show the sequence, not just the final dispute.`),
  style("mistakes", (issue) => `What mistakes should I avoid in ${issue}?`, (topicItem) => `Avoid threats, cash settlements without receipt, deleting messages, signing waivers, missing dates, exaggerating facts, or relying only on phone calls. For ${topicItem.plainIssue}, a calm paper trail is often stronger than aggressive communication.`),
  style("notice", (issue) => `Should I send a legal notice for ${issue}?`, (topicItem) => `A notice can help when facts and relief are clear, but a weak or exaggerated notice can harm negotiation. For ${topicItem.plainIssue}, Vivek would verify documents, amount, dates and forum before sending one.`),
  style("reply", (issue) => `How should I reply to a notice about ${issue}?`, (topicItem) => `Do not reply emotionally. Read the notice, identify claims, collect contrary proof and respond point by point. In ${topicItem.plainIssue}, silence can be risky, but a careless reply can also narrow your defence.`),
  style("settlement", (issue) => `Can ${issue} be settled out of court?`, (topicItem) => `Settlement is possible in many civil and family/commercial matters, but terms must be written. For ${topicItem.plainIssue}, settlement should cover payment, deadlines, withdrawal of cases, default consequences and confidentiality if needed.`),
  style("cost", (issue) => `What costs should I expect for ${issue}?`, (topicItem) => `Costs vary by city, document volume, urgency, forum and number of hearings. For ${topicItem.plainIssue}, ask for a written scope: consultation, notice, drafting, filing and appearance should not be mixed without clarity.`),
  style("timeline", (issue) => `How long can ${issue} take?`, (topicItem) => `Timelines depend on forum, notices, evidence and the other side's response. For ${topicItem.plainIssue}, avoid any promise of quick disposal; focus first on correct filing and strong documents.`),
  style("police", (issue) => `Can police help with ${issue}?`, (topicItem) => `Police route applies only where criminality, threat, fraud, violence or cyber offence is involved. For ${topicItem.plainIssue}, Vivek would distinguish civil pressure from genuine criminal complaint before suggesting police escalation.`),
  style("court", (issue) => `Will I need to go to court for ${issue}?`, (topicItem) => `Court attendance depends on the forum, stage and whether personal presence is directed. For ${topicItem.plainIssue}, many early steps can be prepared through documents before appearance is required.`),
  style("risk", (issue) => `What is the biggest legal risk in ${issue}?`, (topicItem) => `The main risk is acting before facts are documented. In ${topicItem.plainIssue}, the risk increases if you miss a notice date, admit liability casually, transfer money, or sign a settlement without review.`),
  style("evidence-loss", (issue) => `What if I have lost documents for ${issue}?`, (topicItem) => `Lost documents do not always end the matter. Rebuild proof through bank records, emails, certified copies, portal downloads, witnesses and complaint acknowledgements. For ${topicItem.plainIssue}, secondary proof must be organized carefully.`),
  style("opposite-party", (issue) => `What if the other side is not responding in ${issue}?`, (topicItem) => `Non-response should be documented. Send clear written reminders, preserve delivery proof and avoid endless informal calls. For ${topicItem.plainIssue}, the next step may be notice, complaint or filing depending on the documents.`),
  style("deadline", (issue) => `Is there a deadline for ${issue}?`, (topicItem) => `Deadlines can apply through limitation law, contract terms, notice periods, portal timelines or court dates. For ${topicItem.plainIssue}, get dates checked before waiting, especially if money, possession, employment or criminal process is involved.`),
  style("city", (issue) => `Does city or jurisdiction matter in ${issue}?`, (topicItem) => `Yes. Jurisdiction can depend on where parties live, where the contract was performed, where property is located, where the cause arose or what the contract says. For ${topicItem.plainIssue}, location decides the practical forum.`),
  style("language", (issue) => `Can I get help in Hindi or English for ${issue}?`, (topicItem) => `Yes. The consultation should happen in a language you are comfortable with, but legal documents may need precise drafting. For ${topicItem.plainIssue}, explain facts in your language and let the lawyer convert them into formal legal structure.`),
  style("online", (issue) => `Can ${issue} be handled online?`, (topicItem) => `Some parts can be handled online: document review, consultation, notices, portal complaints and status checks. For ${topicItem.plainIssue}, physical filing or appearance may still be needed depending on forum directions.`),
  style("before-booking", (issue) => `What should I prepare before booking a lawyer for ${issue}?`, (topicItem) => `Before booking, prepare a one-page timeline, top five documents, the other side's details, current status and what outcome you want. For ${topicItem.plainIssue}, this makes the first consultation sharper and cheaper.`),
  style("vague-facts", (issue) => `What if I am not sure how to explain ${issue}?`, (topicItem) => `Start with dates, people, place, money, documents and what changed recently. For ${topicItem.plainIssue}, Vivek would first clarify facts before discussing forum or notice strategy.`),
  style("against-company", (issue) => `What if ${issue} is against a company?`, (topicItem) => `When the opposite side is a company, preserve invoices, emails, ticket numbers, registered address, authorised signatory details and terms. For ${topicItem.plainIssue}, identify the legal entity before sending notice.`),
  style("against-person", (issue) => `What if ${issue} is against an individual?`, (topicItem) => `For an individual opposite party, identity, address, relationship, payment trail and written admissions matter. In ${topicItem.plainIssue}, do not rely only on name or phone number if formal action may follow.`),
  style("after-payment", (issue) => `What if I already paid money in ${issue}?`, (topicItem) => `Paid money should be traced through bank entries, receipts, UPI IDs, invoices or acknowledgements. For ${topicItem.plainIssue}, the proof of purpose behind payment is as important as the payment itself.`),
  style("no-agreement", (issue) => `What if there is no written agreement for ${issue}?`, (topicItem) => `Without a written agreement, chats, emails, conduct, invoices, bank records and witnesses become important. For ${topicItem.plainIssue}, the goal is to prove the understanding from surrounding facts.`),
  style("agreement-clause", (issue) => `Which agreement clauses matter in ${issue}?`, (topicItem) => `Look for jurisdiction, arbitration, termination, payment, notice, default, refund, possession, confidentiality and liability clauses. For ${topicItem.plainIssue}, one clause can change the correct route.`),
  style("government-portal", (issue) => `Is there a government portal for ${issue}?`, (topicItem) => `A portal may exist depending on the subject, such as consumer, cyber, tax, GST, court status or authority complaints. For ${topicItem.plainIssue}, use portals carefully and keep acknowledgement numbers.`),
  style("first-consult", (issue) => `What will happen in the first consultation for ${issue}?`, (topicItem) => `The first consultation should identify facts, documents, forum, urgency and next action. For ${topicItem.plainIssue}, expect Vivek to ask for timeline, proof and what outcome you want.`),
  style("weak-case", (issue) => `How do I know if my case is weak in ${issue}?`, (topicItem) => `A case is weaker when documents are missing, facts conflict, dates are old, admissions exist, or relief is unrealistic. For ${topicItem.plainIssue}, weakness can often be reduced by organizing proof before action.`),
  style("strong-case", (issue) => `What makes a case stronger for ${issue}?`, (topicItem) => `A stronger matter has written proof, clear dates, lawful conduct, consistent communication and a realistic remedy. For ${topicItem.plainIssue}, documents should support each key fact.`),
  style("immediate", (issue) => `What is the immediate next step in ${issue}?`, (topicItem) => `The immediate next step is to stop informal escalation and preserve proof. For ${topicItem.plainIssue}, make a date-wise file and identify whether any notice, hearing or payment deadline is active.`),
  style("avoid-delay", (issue) => `Can delay hurt my position in ${issue}?`, (topicItem) => `Delay can hurt if limitation, notice response, evidence loss, possession, money trail or court dates are involved. For ${topicItem.plainIssue}, do not wait once formal communication arrives.`),
  style("family-impact", (issue) => `How should I discuss ${issue} with family or partners?`, (topicItem) => `Keep discussions factual and written when possible. For ${topicItem.plainIssue}, avoid threats, public posts, or verbal settlements that later become disputed.`),
  style("documents-share", (issue) => `Should I share documents with the other side in ${issue}?`, (topicItem) => `Share only what is necessary and preferably through traceable communication. For ${topicItem.plainIssue}, do not send originals, passwords or unnecessary personal data without a clear purpose.`),
  style("recording", (issue) => `Can recordings or screenshots help in ${issue}?`, (topicItem) => `Screenshots, recordings and digital records can help if preserved properly and lawfully. For ${topicItem.plainIssue}, keep originals, metadata where possible and avoid edited versions as primary proof.`),
  style("notice-draft", (issue) => `What should a notice include for ${issue}?`, (topicItem) => `A notice should include parties, facts, dates, documents, legal basis, demand and time for response. For ${topicItem.plainIssue}, it should be firm but accurate, not threatening or inflated.`),
  style("defence", (issue) => `What defence can I take in ${issue}?`, (topicItem) => `Defence depends on documents, dates, conduct and admissions. For ${topicItem.plainIssue}, collect contrary proof before making any denial, because unsupported denial usually weakens credibility.`),
  style("settlement-paper", (issue) => `What should a settlement paper include for ${issue}?`, (topicItem) => `A settlement should include parties, amount or action, deadline, default consequence, withdrawal terms, confidentiality if needed and signatures. For ${topicItem.plainIssue}, vague settlement language creates fresh disputes.`),
  style("senior-review", (issue) => `When should ${issue} be reviewed urgently by an advocate?`, (topicItem) => `Urgent review is needed if there is court notice, police contact, threat, eviction, asset transfer, account freeze, signing pressure or a deadline. For ${topicItem.plainIssue}, those facts change the risk level immediately.`),
  style("fee-scope", (issue) => `How should I understand lawyer fees for ${issue}?`, (topicItem) => `Ask whether the fee covers only consultation, drafting, notice, filing or court appearance. For ${topicItem.plainIssue}, clarity on fee scope prevents confusion after booking.`),
  style("client-story", (issue) => `How should I present my story for ${issue}?`, (topicItem) => `Present the story in five parts: background, what was promised, what went wrong, proof available and outcome needed. For ${topicItem.plainIssue}, this helps Vivek assess the path quickly.`),
  style("legal-aid", (issue) => `Can I get free legal aid for ${issue}?`, (topicItem) => `Free legal aid may be available based on eligibility and matter type. For ${topicItem.plainIssue}, check legal services authority options if affordability, safety, disability, custody or vulnerability is involved.`),
  style("opposite-lawyer", (issue) => `What if the other side already has a lawyer in ${issue}?`, (topicItem) => `If the other side has counsel, communicate carefully and keep records. For ${topicItem.plainIssue}, do not sign, admit or settle only because a legal letter looks intimidating.`),
  style("documents-upload", (issue) => `Which documents should I upload first for ${issue}?`, (topicItem) => `Upload the document that created the relationship, the document showing breach, and the latest notice or communication. For ${topicItem.plainIssue}, those three usually let the lawyer understand the matter fastest.`),
  style("book-consult", (issue) => `Should I book a consultation for ${issue}?`, (topicItem) => `${topicItem.risk === "Low" ? "Book if money, documents or deadlines are involved." : "Booking is sensible because this needs document-led review."} For ${topicItem.plainIssue}, a short consultation should confirm forum, documents and next safe step.`),
];

function style(intent: string, question: QuestionStyle["question"], guidance: QuestionStyle["guidance"]): QuestionStyle {
  return { intent, question, guidance };
}

const stopWords = new Set([
  "a",
  "about",
  "after",
  "and",
  "are",
  "can",
  "do",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "me",
  "my",
  "of",
  "on",
  "or",
  "the",
  "to",
  "what",
  "when",
  "where",
  "with",
]);

export const legalCategoryGuides: LegalCategoryGuide[] = [
  {
    name: "Family / Divorce",
    explanation:
      "Marriage, divorce, maintenance, child custody, domestic violence, stridhan, matrimonial settlement and urgent safety issues inside a family relationship.",
    laymanIssues: ["maintenance", "mutual divorce", "child custody", "domestic violence", "stridhan", "matrimonial home"],
    topics: [
      topic("family-maintenance", "Can I claim maintenance from my spouse?", "spouse not paying maintenance", ["maintenance", "wife", "husband", "child", "income"], "Maintenance depends on income, dependents, standard of living, existing orders and immediate needs. Keep salary proof, bank entries, school or medical expenses and any earlier court papers. If there is violence, eviction or child-safety risk, treat it as urgent and speak with an advocate.", ["Prepare income and expense proof.", "Preserve messages, payment history and child expenses.", "Check free legal aid eligibility if affordability is a concern."], ["NALSA", "INDIA_CODE"], "Medium"),
      topic("family-divorce-mutual", "How does mutual consent divorce usually work?", "mutual consent divorce", ["mutual", "divorce", "settlement", "alimony"], "Mutual divorce is usually document-led: both sides agree on separation, maintenance or alimony, child arrangements, stridhan and property settlement. The exact procedure depends on personal law and court practice, so avoid signing a settlement without understanding future rights.", ["List all settlement points before filing.", "Keep marriage, address and identity records ready.", "Get the settlement language reviewed."], ["INDIA_CODE", "ECOURTS"], "Medium"),
      topic("family-custody", "What does a court consider in child custody?", "child custody dispute", ["custody", "child", "visitation", "school"], "Child custody decisions are generally guided by the welfare of the child, not only the preference of either parent. Schooling, care routine, safety, health, financial stability and the child's comfort may matter. Keep the discussion child-focused and avoid using visitation as pressure.", ["Prepare school, health and care records.", "Document current parenting routine.", "Avoid threats or unilateral removal."], ["INDIA_CODE", "ECOURTS"], "High"),
      topic("family-domestic-violence", "What can I do in domestic violence?", "domestic violence or being forced out", ["domestic", "violence", "safety", "residence", "abuse"], "Domestic violence matters can involve protection, residence, monetary relief and safety planning. If there is immediate danger, call local emergency services. Preserve medical records, photos, messages and witness details, but do not delay safety for documentation.", ["Prioritize physical safety.", "Keep medical and message proof.", "Speak to a lawyer or legal aid service quickly."], ["NALSA", "INDIA_CODE"], "High"),
      topic("family-stridhan", "How can I recover stridhan?", "stridhan not being returned", ["stridhan", "jewellery", "gifts", "dowry", "belongings"], "Stridhan issues are evidence-heavy. Make a dated list of jewellery, gifts, invoices, photos, wedding videos, witness names and messages asking for return. Do not exaggerate values; a clean inventory is more useful than a dramatic complaint.", ["Create a stridhan inventory.", "Collect invoices, photos and witness details.", "Ask a lawyer to review the safest notice or complaint route."], ["INDIA_CODE", "NALSA"], "Medium"),
      topic("family-notice", "What should I do after receiving a family court notice?", "family court notice", ["notice", "summons", "court", "family"], "A court notice should not be ignored. Read the court name, case number, next date and relief claimed. Gather the petition copy and documents before replying. Missing dates can create avoidable complications.", ["Note the court date and case number.", "Keep envelope and full notice copy.", "Consult before filing a reply."], ["ECOURTS", "NALSA"], "High"),
      topic("family-settlement", "How do I settle a matrimonial dispute safely?", "matrimonial settlement", ["settlement", "mediation", "compromise", "alimony"], "A matrimonial settlement should clearly cover maintenance, child arrangements, pending cases, stridhan, shared property, timelines and default consequences. Verbal understandings are risky.", ["Write every term clearly.", "Check pending cases before signing.", "Keep payment mode and timeline documented."], ["ECOURTS", "INDIA_CODE"], "Medium"),
      topic("family-elder", "What can parents do if children harass them?", "parents being harassed by children", ["parents", "senior", "elderly", "harassment", "maintenance"], "Parents and senior citizens may have remedies for maintenance, residence and protection from harassment. Preserve identity proof, property papers, medical needs, messages and details of neglect or threats.", ["Document harassment and expenses.", "Check senior-citizen welfare authority route.", "Escalate quickly if safety or eviction is involved."], ["NALSA", "INDIA_CODE"], "High"),
      topic("family-interfaith", "What should I check before interfaith marriage paperwork?", "interfaith marriage paperwork", ["marriage", "special marriage", "interfaith", "registration"], "Marriage registration depends on personal law, residence, age, identity and local procedure. Do not rely on informal online checklists alone; documents and notice practice can vary by office.", ["Check identity, age and address documents.", "Confirm local registrar procedure.", "Discuss safety and privacy concerns early."], ["INDIA_CODE", "ECOURTS"], "Medium"),
      topic("family-property", "How are family property issues handled during separation?", "family property during separation", ["property", "joint", "house", "separation", "assets"], "Family separation can involve residence rights, jointly owned assets, loans and settlement terms. Title documents, contribution proof and existing possession matter. Avoid transferring assets under pressure.", ["Collect title and loan records.", "Record who paid what and when.", "Get settlement terms reviewed before signing."], ["INDIA_CODE", "ECOURTS"], "Medium"),
    ],
  },
  {
    name: "Property / RERA",
    explanation:
      "Buying, selling, renting or protecting property, including builder delay, RERA, title checks, sale deed mistakes, encroachment, society charges and land due diligence.",
    laymanIssues: ["builder delay", "sale deed", "tenant issue", "agricultural land", "encroachment", "bank auction property"],
    topics: [
      topic("property-builder-delay", "What can I do if a builder delays possession?", "builder delayed possession", ["builder", "delay", "rera", "possession", "flat"], "For delayed possession, first check the builder-buyer agreement, promised possession date, RERA registration, payment receipts and all delay communications. RERA or consumer routes may be relevant, but exact relief depends on documents and state forum practice.", ["Collect agreement, allotment letter and receipts.", "Check project registration details.", "Do not sign fresh waivers without review."], ["INDIA_CODE", "CONSUMER"], "Medium"),
      topic("property-title", "What should I verify before buying property?", "property title verification", ["title", "sale", "purchase", "deed", "encumbrance"], "Title due diligence usually means checking ownership chain, registered documents, encumbrances, possession, tax dues, approvals and seller authority. A cheap or urgent deal needs extra caution, not less.", ["Ask for title chain and encumbrance records.", "Verify seller identity and authority.", "Check possession and local dues."], ["INDIA_CODE"], "Medium"),
      topic("property-agri", "What should I verify before buying agricultural land?", "buying agricultural land in Maharashtra", ["agricultural", "land", "maharashtra", "7/12", "mutation"], "For agricultural land in Maharashtra, verify title chain, 7/12 extract, mutation entries, land use, tenancy or transfer restrictions, access road, zoning and whether non-agricultural conversion is required for your intended use. Local permissions matter heavily.", ["Check 7/12 and mutation records.", "Confirm land-use and transfer restrictions.", "Use a local title search before paying token money."], ["INDIA_CODE"], "Medium"),
      topic("property-tenant", "What can a landlord do if a tenant is not paying rent?", "tenant not paying rent", ["tenant", "rent", "evict", "landlord", "lease"], "Rent disputes depend on the lease, rent receipts, default history and local rent laws. Avoid forceful eviction, lock changes or utility disconnection without legal review.", ["Collect lease, rent ledger and notices.", "Send communication in writing.", "Check local rent-control or civil route."], ["INDIA_CODE", "ECOURTS"], "Medium"),
      topic("property-sale-error", "How can I correct a sale deed mistake?", "mistake in sale deed", ["sale deed", "spelling", "correction", "registration"], "A sale deed error may need a correction or rectification deed, depending on the mistake and parties. Keep the registered deed, identity proof and supporting documents ready.", ["Identify whether the error is clerical or substantive.", "Keep the registered deed copy.", "Check registrar practice before drafting."], ["INDIA_CODE"], "Medium"),
      topic("property-encroachment", "What should I do if someone encroaches on my land?", "neighbour encroached land boundary", ["encroachment", "boundary", "neighbour", "plot"], "Boundary disputes need documents and physical proof: title, survey records, site plan, photos, old boundary markers and witness details. Avoid confrontation; get measurement and notice strategy reviewed.", ["Preserve photos and title records.", "Check survey or municipal records.", "Avoid self-help demolition."], ["INDIA_CODE", "ECOURTS"], "Medium"),
      topic("property-society", "Can a housing society charge high transfer fees?", "housing society transfer fees", ["society", "transfer", "maintenance", "charges"], "Society charges depend on bye-laws, state rules and the society's resolution records. Ask for the written basis and receipt. Arbitrary cash demands should be treated carefully.", ["Ask for written demand and bye-law basis.", "Keep receipts and minutes if available.", "Compare with state society rules."], ["INDIA_CODE"], "Low"),
      topic("property-auction", "What should I check before buying bank auction property?", "bank auction property", ["auction", "bank", "sarfaesi", "possession"], "Bank auction property can carry possession, litigation, dues and title risks. Read the auction notice, inspect the property, check encumbrances, municipal dues, possession status and pending cases.", ["Read auction terms fully.", "Check physical possession and dues.", "Do title and litigation search before bidding."], ["INDIA_CODE", "ECOURTS"], "High"),
      topic("property-inheritance", "What documents matter in inherited property disputes?", "siblings dispute over inherited property", ["inheritance", "siblings", "partition", "heirs"], "Inherited property disputes turn on title, family tree, will if any, succession documents, possession and earlier transfers. Do not sign release deeds or family settlements casually.", ["Collect title, death certificate and heir details.", "Check whether a will exists.", "Review any proposed partition or release deed."], ["INDIA_CODE", "ECOURTS"], "Medium"),
      topic("property-nri", "How can an NRI handle Indian property from abroad?", "NRI property issue", ["nri", "property", "poa", "tenant"], "NRI property matters often need clean power of attorney, title papers, tenant records and local representation. Use specific, limited authority documents instead of broad informal authorizations.", ["Prepare title and identity records.", "Use limited POA language.", "Track court or registrar dates through reliable local support."], ["INDIA_CODE", "ECOURTS"], "Medium"),
    ],
  },
  {
    name: "Criminal / Bail",
    explanation:
      "Police complaints, FIR, summons, questioning, arrest risk, bail, threats, defamation and criminal court process.",
    laymanIssues: ["FIR", "police call", "anticipatory bail", "false complaint", "summons", "threats"],
    topics: [
      topic("criminal-fir", "What should I do if an FIR is filed against me?", "FIR filed against me", ["fir", "police", "accused"], "Do not ignore an FIR or police contact. Note the police station, FIR number if known, alleged sections and facts. Avoid informal statements without understanding the case.", ["Get FIR or complaint details.", "Preserve documents and messages.", "Speak to a criminal lawyer quickly."], ["INDIA_CODE", "ECOURTS", "NALSA"], "High"),
      topic("criminal-police-call", "Police are calling me for questioning. What should I know?", "police calling for questioning", ["police", "questioning", "notice", "station"], "Ask for the purpose, officer details and any written notice. Be cooperative but careful. If arrest risk, threat or serious allegation exists, get legal help before attending.", ["Save call logs and messages.", "Ask for written notice where appropriate.", "Do not go alone in serious matters."], ["INDIA_CODE", "NALSA"], "High"),
      topic("criminal-bail", "What is anticipatory bail in simple terms?", "anticipatory bail", ["anticipatory", "bail", "arrest"], "Anticipatory bail is a protective court remedy considered when a person fears arrest in a non-bailable matter. It is fact-specific and urgent; documents and allegations must be reviewed.", ["Collect complaint/FIR details.", "Prepare facts and supporting records.", "Consult before contacting police if arrest risk exists."], ["INDIA_CODE", "ECOURTS"], "High"),
      topic("criminal-false-complaint", "What can I do if someone threatens a false case?", "threat of false complaint", ["false", "complaint", "threat"], "Preserve proof of threats and the background dispute. Avoid retaliatory messages. A preventive legal strategy depends on the type of threatened complaint and available evidence.", ["Save messages and call records.", "Write a timeline of events.", "Avoid threats or counter-allegations online."], ["INDIA_CODE", "NALSA"], "Medium"),
      topic("criminal-summons", "What should I do after receiving criminal summons?", "criminal court summons", ["summons", "court", "notice"], "A summons has court, case and date details. Missing it can create complications. Verify authenticity and prepare documents before the date.", ["Read case number and court date.", "Check status on eCourts where possible.", "Consult on appearance and reply."], ["ECOURTS", "INDIA_CODE"], "High"),
      topic("criminal-threat", "How do I complain about threats?", "threat messages", ["threat", "whatsapp", "abuse", "harassment"], "For threats, preserve screenshots, sender details, call logs and context. If there is immediate danger, contact emergency police help. Do not edit screenshots before preserving originals.", ["Save original messages and numbers.", "Write date-wise incidents.", "Escalate immediately if safety risk exists."], ["INDIA_CODE", "CYBER"], "High"),
      topic("criminal-defamation", "What can I do about defamatory social media posts?", "defamatory social media post", ["defamation", "social", "reputation", "post"], "Defamation and online abuse require proof of publication, identity, harm and context. Preserve URLs, screenshots, timestamps and witnesses before asking for removal.", ["Capture URLs and screenshots.", "Do not respond abusively.", "Review civil, criminal and platform complaint options."], ["CYBER", "INDIA_CODE"], "Medium"),
      topic("criminal-compromise", "Can a criminal case be settled?", "settlement in criminal case", ["settlement", "compromise", "quash"], "Some disputes may be compoundable or capable of settlement-related court relief, while serious offences cannot be privately settled in the same way. The exact route depends on alleged sections and facts.", ["Identify sections and case stage.", "Keep settlement terms written.", "Do not pay cash without records."], ["INDIA_CODE", "ECOURTS"], "High"),
      topic("criminal-victim", "How can a victim track a criminal complaint?", "victim complaint status", ["victim", "complaint", "status", "police"], "A complainant should keep complaint acknowledgements, FIR details, officer names and follow-up records. Court case status may be trackable once a case reaches court.", ["Keep complaint and FIR copies.", "Record officer and station details.", "Use eCourts once case number exists."], ["ECOURTS", "INDIA_CODE"], "Medium"),
      topic("criminal-evidence", "What evidence should I preserve for a criminal complaint?", "evidence for criminal complaint", ["evidence", "proof", "complaint"], "Preserve originals where possible: messages, transaction records, CCTV, photos, medical documents, location records and witness details. Do not create edited versions as primary evidence.", ["Back up originals.", "Write a dated incident timeline.", "Keep witness names and contact details."], ["INDIA_CODE", "ECOURTS"], "Medium"),
    ],
  },
  {
    name: "Cyber Fraud",
    explanation:
      "UPI fraud, online scam, bank account freeze, fake loan app, social media abuse, cyber police notice, hacked account and digital evidence.",
    laymanIssues: ["UPI fraud", "account freeze", "fake loan app", "online harassment", "cyber police notice", "hacked account"],
    topics: [
      topic("cyber-upi", "What should I do after UPI or bank cyber fraud?", "UPI or bank cyber fraud", ["upi", "fraud", "bank", "transaction", "1930"], "Act fast: preserve transaction IDs, screenshots, bank SMS and complaint numbers. Report through bank channels and the cyber crime portal. If money movement is recent, emergency reporting may help bank-level blocking.", ["Contact bank immediately.", "Report on the cyber portal.", "Keep transaction and complaint IDs."], ["CYBER", "INDIA_CODE"], "High"),
      topic("cyber-freeze", "Why is my bank account frozen after cyber complaint?", "bank account frozen cyber complaint", ["account", "freeze", "cyber", "bank"], "Account freeze can happen during cyber investigation when money trails touch an account. Gather bank notices, transaction history and police station details. Do not ignore police communication.", ["Get written freeze reason from bank.", "Collect transaction history.", "Consult before giving statements."], ["CYBER", "INDIA_CODE"], "High"),
      topic("cyber-loan", "What can I do about fake loan app harassment?", "fake loan app harassment", ["loan", "app", "harassment", "morphed"], "Fake loan app matters can involve privacy abuse, threats and extortion. Preserve app details, payment records, messages, numbers and screenshots. Warn contacts if data misuse has begun.", ["Preserve screenshots and app details.", "Report harassment and numbers.", "Avoid further payments without review."], ["CYBER", "INDIA_CODE"], "High"),
      topic("cyber-social", "How do I report online harassment?", "online harassment", ["online", "harassment", "instagram", "facebook", "whatsapp"], "Online harassment should be documented before deletion. Keep profile URLs, screenshots, timestamps, messages and platform complaint IDs.", ["Capture URLs and screenshots.", "Use platform reporting.", "Escalate if threats or sexual content are involved."], ["CYBER", "INDIA_CODE"], "High"),
      topic("cyber-hacked", "What should I do if my account is hacked?", "hacked social or email account", ["hacked", "account", "email", "social"], "Secure the account first: change passwords, revoke sessions, enable two-factor authentication and preserve login alerts. If money, identity or threats are involved, report formally.", ["Change passwords and revoke sessions.", "Save login alerts.", "Report financial or identity misuse."], ["CYBER"], "Medium"),
      topic("cyber-notice", "What should I do after a cyber police notice?", "cyber police notice", ["cyber", "police", "notice", "station"], "A cyber police notice should be verified and answered carefully. Identify whether you are complainant, witness, account holder or accused. Carry documents only after understanding the purpose.", ["Verify officer and station details.", "Collect transaction and device records.", "Consult if account freeze or accusation exists."], ["CYBER", "INDIA_CODE"], "High"),
      topic("cyber-refund", "Can I get money back after online fraud?", "money refund after cyber fraud", ["refund", "fraud", "bank", "chargeback"], "Recovery depends on speed of reporting, money trail, bank action and investigation. LegalSeva can explain steps, but no platform can guarantee refund.", ["Report quickly to bank and cyber portal.", "Keep all ticket and complaint numbers.", "Follow written updates."], ["CYBER"], "Medium"),
      topic("cyber-digital-evidence", "What digital evidence should I keep?", "digital evidence for cyber case", ["evidence", "screenshots", "transaction", "ip"], "Keep original screenshots, URLs, transaction IDs, device details, emails with headers where possible and complaint acknowledgements. Avoid editing images before preserving originals.", ["Back up originals.", "Export statements and emails.", "Maintain a dated incident timeline."], ["CYBER", "INDIA_CODE"], "Medium"),
      topic("cyber-privacy", "What can I do if my personal data is misused?", "personal data misuse", ["privacy", "data", "leak", "misuse"], "Personal data misuse may involve platform complaints, cyber complaint, contractual breach or privacy-law concerns. Record what data was misused, who accessed it and what harm occurred.", ["Identify what data was shared.", "Preserve proof of misuse.", "Ask for takedown or correction in writing."], ["CYBER", "INDIA_CODE"], "Medium"),
      topic("cyber-deepfake", "What should I do about morphed photos or deepfake abuse?", "morphed photos or deepfake abuse", ["morphed", "deepfake", "photo", "image"], "Morphed or sexualized image abuse is urgent. Preserve evidence, report to platform and cyber channels, and prioritize safety. Avoid sending more personal material to blackmailers.", ["Do not negotiate with blackmailers alone.", "Preserve URLs, chats and payment demands.", "Report quickly."], ["CYBER", "INDIA_CODE"], "High"),
    ],
  },
  {
    name: "Consumer Complaint",
    explanation:
      "Refunds, defective goods, poor services, insurance rejection, coaching refund, hospital billing, airline issues, warranty and ecommerce disputes.",
    laymanIssues: ["refund refused", "defective product", "insurance claim rejected", "coaching refund", "hospital bill", "airline cancellation"],
    topics: [
      topic("consumer-refund", "What can I do if a company refuses refund?", "refund refused by company", ["refund", "refuse", "company", "service"], "Consumer disputes usually start with proof: invoice, payment, promise, complaint emails and service terms. Send a clear written demand before escalation. Consumer routes may apply for deficiency or unfair trade practice.", ["Collect bill and terms.", "Send written complaint to company.", "Use consumer helpline or forum route if unresolved."], ["CONSUMER", "INDIA_CODE"], "Low"),
      topic("consumer-defective", "What should I do about a defective product?", "defective product", ["defective", "damaged", "product", "warranty"], "Preserve delivery proof, unboxing photos, warranty card, service job sheets and complaint tickets. Avoid repeated paid repairs if the defect was reported early.", ["Keep product and packaging proof.", "Log complaint ticket numbers.", "Ask for written rejection reason."], ["CONSUMER"], "Low"),
      topic("consumer-ecommerce", "How do I handle ecommerce delivery fraud?", "ecommerce damaged or wrong product", ["ecommerce", "delivery", "wrong", "damaged"], "For ecommerce issues, keep order ID, delivery photos, return requests, chat transcripts and seller response. Escalate inside the platform before external complaint.", ["Save order and return records.", "Capture product condition.", "Escalate through platform grievance channel."], ["CONSUMER"], "Low"),
      topic("consumer-insurance", "What can I do if insurance claim is rejected?", "insurance claim rejected", ["insurance", "claim", "reject", "policy"], "Insurance rejection needs policy wording, proposal form, medical or loss documents, rejection letter and timelines. Ask for written reasons and compare them to policy terms.", ["Collect policy and rejection letter.", "Prepare medical or loss records.", "File written grievance before escalation."], ["CONSUMER", "INDIA_CODE"], "Medium"),
      topic("consumer-coaching", "Can I claim refund from coaching institute?", "coaching institute refund refused", ["coaching", "education", "refund", "course"], "Coaching refund disputes depend on brochure promises, refund policy, receipt, classes attended and misrepresentation. Preserve advertisements and admission terms.", ["Keep brochure and fee receipt.", "Save chats about refund promise.", "Make written refund request."], ["CONSUMER"], "Low"),
      topic("consumer-hospital", "What can I ask for in a hospital billing dispute?", "hospital bill dispute", ["hospital", "bill", "charges", "patient"], "Hospital billing disputes need itemized bill, consent forms, estimate, discharge summary and payment records. Ask for a written explanation of disputed charges.", ["Request itemized bill.", "Keep consent and estimate records.", "Document all billing conversations."], ["CONSUMER"], "Medium"),
      topic("consumer-airline", "What can I do if airline cancels flight?", "airline cancelled flight", ["airline", "flight", "cancel", "voucher"], "For flight cancellation, keep ticket, cancellation message, refund/voucher offer and airline policy. Escalation depends on aviation rules and booking terms.", ["Keep ticket and cancellation proof.", "Ask for written refund basis.", "Escalate through airline grievance channel."], ["CONSUMER"], "Low"),
      topic("consumer-car", "What if a service center did wrong repair?", "car service wrong repair", ["car", "service", "repair", "vehicle"], "Vehicle repair disputes need job card, estimate, replaced part details, invoice, photos and post-repair defect proof. Get a second inspection before alleging major deficiency.", ["Collect job card and invoice.", "Record defect after repair.", "Ask for written diagnosis."], ["CONSUMER"], "Low"),
      topic("consumer-realestate-broker", "Can I recover token money from a broker?", "broker kept token money", ["broker", "token", "receipt", "property"], "Token recovery depends on receipt wording, who received money, cancellation condition and proof of deal failure. Avoid cash settlements without written acknowledgement.", ["Keep receipt and chats.", "Identify recipient and purpose.", "Review cancellation terms."], ["CONSUMER", "INDIA_CODE"], "Medium"),
      topic("consumer-job-guarantee", "Can I complain about fake job guarantee course?", "online course job guarantee not honoured", ["course", "job", "guarantee", "placement"], "Job guarantee course disputes depend on written promises, eligibility conditions, placement efforts and refund terms. Preserve advertisements and counsellor messages.", ["Save ads and counsellor chats.", "Collect fee and course records.", "Ask for written placement/refund response."], ["CONSUMER"], "Low"),
    ],
  },
  {
    name: "Cheque Bounce",
    explanation:
      "Dishonoured cheque, legal notice, reply to cheque notice, payment settlement, company cheque and recovery strategy.",
    laymanIssues: ["cheque bounced", "received cheque notice", "settlement", "company cheque", "bank memo", "payment recovery"],
    topics: [
      topic("cheque-drawer", "What should I do if my cheque bounced?", "my cheque bounced", ["cheque", "bounce", "dishonour", "drawer"], "Cheque bounce is deadline-sensitive and document-driven. Preserve cheque copy, return memo, bank records and payment background. Do not ignore legal notice if received.", ["Keep return memo and cheque details.", "Review debt or liability background.", "Consult before replying or settling."], ["INDIA_CODE", "ECOURTS"], "High"),
      topic("cheque-payee", "How do I act when someone else's cheque bounced?", "someone gave bounced cheque", ["cheque", "payee", "notice", "recovery"], "If you received a bounced cheque, preserve the cheque, bank memo, invoice or loan proof and communications. A notice strategy should be checked quickly.", ["Collect cheque and return memo.", "Keep proof of underlying liability.", "Do not delay legal review."], ["INDIA_CODE"], "High"),
      topic("cheque-notice-received", "What should I do after receiving cheque bounce notice?", "received cheque bounce notice", ["notice", "cheque", "reply"], "Read the amount claimed, cheque number, bank memo and demand. If the claim is wrong, disputed or already paid, prepare documents before replying.", ["Do not ignore the notice.", "Check cheque and payment records.", "Reply through counsel if disputed."], ["INDIA_CODE", "NALSA"], "High"),
      topic("cheque-company", "Who is liable for a company cheque bounce?", "company cheque bounce", ["company", "director", "cheque", "liability"], "Company cheque matters can involve the company and responsible signatories or officers depending on facts. Board role, signing authority and transaction records matter.", ["Collect board and signing records.", "Check who handled the transaction.", "Get notice reviewed carefully."], ["INDIA_CODE"], "High"),
      topic("cheque-settlement", "Can cheque bounce case be settled?", "settling cheque bounce case", ["settlement", "compromise", "payment"], "Cheque bounce disputes are often settled, but payment schedule, default terms and withdrawal/quashing steps must be written. Avoid vague assurances.", ["Record payment terms clearly.", "Use traceable payments.", "Link settlement to case steps."], ["INDIA_CODE", "ECOURTS"], "Medium"),
      topic("cheque-security", "What if the cheque was only security?", "security cheque bounce", ["security", "cheque", "loan"], "A security-cheque defence depends on the transaction, liability date, documents and communications. The label 'security' alone may not decide the case.", ["Collect agreement and payment history.", "Preserve messages about cheque purpose.", "Prepare a factual reply."], ["INDIA_CODE"], "High"),
      topic("cheque-lost", "What if cheque was misused or lost?", "misused cheque", ["misuse", "lost", "blank", "cheque"], "Cheque misuse allegations need bank intimation, stop-payment records, complaint history and proof of how the cheque was handed over. Act quickly if a blank cheque is involved.", ["Inform bank in writing.", "Preserve proof of misuse.", "Prepare timeline of cheque handover."], ["INDIA_CODE"], "High"),
      topic("cheque-civil", "Can I file civil recovery besides cheque bounce?", "civil recovery and cheque bounce", ["civil", "recovery", "money", "cheque"], "Cheque bounce and money recovery can overlap, but routes, limitation and evidence differ. Underlying debt proof remains important.", ["Collect invoices or loan records.", "Compare criminal and civil routes.", "Avoid double-counting settlement terms."], ["INDIA_CODE", "ECOURTS"], "Medium"),
      topic("cheque-memo", "Why is bank return memo important?", "cheque return memo", ["memo", "return", "bank"], "The bank return memo records why the cheque was dishonoured and is key evidence. Keep original or certified bank records safely.", ["Preserve return memo.", "Match cheque number and date.", "Keep bank statement entries."], ["INDIA_CODE"], "Medium"),
      topic("cheque-proof", "What proof is needed in cheque bounce?", "proof for cheque bounce case", ["proof", "evidence", "invoice", "loan"], "Useful proof includes cheque copy, return memo, legal notice, postal records, invoices, loan agreement, account statements and messages acknowledging liability.", ["Organize proof date-wise.", "Keep postal and delivery records.", "Do not rely only on oral promises."], ["INDIA_CODE"], "Medium"),
    ],
  },
  {
    name: "Employment / Labour",
    explanation:
      "Salary not paid, termination, forced resignation, offer revoked, PF issue, non-compete, relieving letter, workplace harassment and labour notices.",
    laymanIssues: ["unpaid salary", "termination", "forced resignation", "PF not deposited", "non-compete", "relieving letter withheld"],
    topics: [
      topic("employment-salary", "What can I do if salary is unpaid?", "salary not paid", ["salary", "unpaid", "wages"], "Unpaid salary disputes need offer letter, payslips, attendance, bank statements, resignation or termination records and written reminders. Keep communication professional.", ["Collect payslips and bank proof.", "Send written demand.", "Check labour or civil recovery route."], ["INDIA_CODE", "NALSA"], "Medium"),
      topic("employment-termination", "What if I was terminated without notice?", "termination without notice", ["termination", "notice", "fired"], "Termination review depends on appointment terms, probation status, role, notice clause, misconduct allegation and final settlement records.", ["Read appointment letter.", "Keep termination email and HR chats.", "Ask for full and final statement."], ["INDIA_CODE"], "Medium"),
      topic("employment-resign", "What if company forces me to resign?", "forced resignation", ["forced", "resign", "pressure"], "Forced resignation is evidence-heavy. Preserve emails, messages, meeting notes and HR communications. Avoid signing broad waivers under pressure.", ["Write a private incident timeline.", "Keep resignation drafts and HR messages.", "Seek review before signing waiver."], ["INDIA_CODE"], "Medium"),
      topic("employment-offer", "Can company revoke offer before joining?", "offer letter revoked", ["offer", "joining", "revoked"], "Offer revocation depends on offer wording, conditions, reliance, joining date and any losses suffered. Keep all hiring communications.", ["Keep offer and acceptance records.", "Document relocation or resignation losses.", "Ask for written reason."], ["INDIA_CODE"], "Low"),
      topic("employment-pf", "What if employer did not deposit PF?", "PF not deposited", ["pf", "provident", "deposit", "uan"], "PF issues require UAN records, salary slips, employer deduction entries and passbook checks. If deductions were made but not deposited, preserve proof.", ["Check UAN/passbook.", "Collect payslips showing deduction.", "Raise written grievance."], ["INDIA_CODE"], "Medium"),
      topic("employment-noncompete", "Can employer stop me joining competitor?", "non-compete clause", ["non", "compete", "competitor"], "Post-employment non-compete restrictions are fact-sensitive in India. Confidentiality, non-solicit and trade secret obligations may still matter.", ["Review exact clause.", "Avoid taking confidential material.", "Get advice before joining if threatened."], ["INDIA_CODE"], "Medium"),
      topic("employment-relieving", "What can I do if relieving letter is withheld?", "relieving letter withheld", ["relieving", "experience", "letter"], "Relieving-letter disputes often involve notice period, handover, dues and waiver demands. Ask for written reasons and keep handover proof.", ["Document handover.", "Request release in writing.", "Do not sign broad waiver without review."], ["INDIA_CODE"], "Low"),
      topic("employment-harassment", "How do I report workplace harassment?", "workplace harassment", ["harassment", "workplace", "manager"], "Workplace harassment needs dated incidents, emails, witnesses and internal complaint records. For sexual harassment, use the internal committee route where applicable.", ["Write a dated incident list.", "Keep emails and witness names.", "Use internal complaint channel carefully."], ["INDIA_CODE", "NALSA"], "High"),
      topic("employment-freelancer", "Can a freelancer recover unpaid fees?", "freelancer unpaid invoice", ["freelancer", "invoice", "client"], "Freelancer recovery depends on contract, scope proof, delivery records, invoices, acceptance messages and payment terms. Legal notice or arbitration may be relevant.", ["Collect contract and delivery proof.", "Send invoice reminder in writing.", "Check dispute clause."], ["INDIA_CODE"], "Medium"),
      topic("employment-fnf", "What should I check in full and final settlement?", "full and final settlement", ["fnf", "settlement", "dues"], "Full and final settlement should match salary, notice pay, leave encashment, reimbursements, incentives and deductions. Ask for breakup before accepting.", ["Ask for settlement breakup.", "Compare with payslips and policy.", "Keep acceptance conditional if disputed."], ["INDIA_CODE"], "Low"),
    ],
  },
  {
    name: "Startup / Compliance",
    explanation:
      "Founder disputes, contracts, vendor breach, invoices, freelancers, IP, data privacy, GST, investor terms and company compliance.",
    laymanIssues: ["cofounder equity", "vendor breach", "unpaid invoice", "freelancer IP", "data privacy", "investor guarantee"],
    topics: [
      topic("startup-founder", "What should founders check in an equity dispute?", "cofounder equity dispute", ["founder", "equity", "shares", "vesting"], "Founder disputes need cap table, shareholders agreement, vesting terms, board approvals, contribution records and exit clauses. Avoid making informal equity promises.", ["Collect incorporation and cap table records.", "Review SHA and vesting terms.", "Document contribution and exit terms."], ["INDIA_CODE"], "Medium"),
      topic("startup-vendor", "What can I do if a vendor breaches contract?", "vendor contract breach", ["vendor", "breach", "contract"], "Vendor breach depends on scope, deliverables, service levels, payment terms, termination and dispute clause. Preserve delivery failures and written warnings.", ["Read contract and dispute clause.", "Document breach with dates.", "Send notice before replacement if required."], ["INDIA_CODE"], "Medium"),
      topic("startup-invoice", "How can a startup recover unpaid invoices?", "client unpaid invoices", ["invoice", "client", "payment"], "Invoice recovery needs contract, invoice, delivery proof, acceptance records and payment reminders. Legal notice, arbitration or civil recovery may be possible.", ["Organize invoices and delivery proof.", "Send written demand.", "Check arbitration or jurisdiction clause."], ["INDIA_CODE"], "Medium"),
      topic("startup-freelancer", "What should be in freelancer contracts?", "freelancer contract and IP", ["freelancer", "ip", "contract"], "Freelancer agreements should cover scope, fees, timelines, confidentiality, IP assignment, revision limits and termination. IP should not be assumed without written terms.", ["Define deliverables and ownership.", "Add confidentiality and payment milestones.", "Keep acceptance records."], ["INDIA_CODE"], "Low"),
      topic("startup-privacy", "What privacy basics should SaaS startups know?", "startup customer personal data", ["privacy", "data", "saas", "dpdp"], "Startups handling personal data should map data collected, notice, consent, purpose, retention, vendor sharing and security controls. Keep privacy policy aligned with actual practice.", ["Map collected data.", "Review consent and privacy notices.", "Limit access and retention."], ["INDIA_CODE"], "Medium"),
      topic("startup-investor", "What should founders review in investor guarantees?", "investor personal guarantee", ["investor", "guarantee", "term sheet"], "Personal guarantees and broad indemnities can expose founders beyond company risk. Review scope, cap, duration, trigger and personal-asset exposure before signing.", ["Mark personal obligations.", "Negotiate caps and triggers.", "Get term sheet reviewed."], ["INDIA_CODE"], "High"),
      topic("startup-trademark", "When should a startup file trademark?", "startup trademark", ["trademark", "brand", "ip"], "Trademark review should happen before heavy brand spend. Check name availability, domain/social conflicts and ownership by company rather than individual where appropriate.", ["Search brand conflicts.", "Keep logo and name records.", "File in correct owner name."], ["INDIA_CODE"], "Low"),
      topic("startup-gst", "What GST checks should a startup do?", "startup GST compliance", ["gst", "startup", "invoice"], "GST checks include registration need, invoice format, return status, input credits, vendor GST status and notice response. Do not ignore portal notices.", ["Check registration and returns.", "Reconcile invoices and credits.", "Respond to notices with records."], ["GST", "INDIA_CODE"], "Medium"),
      topic("startup-terms", "What legal pages does a SaaS product need?", "SaaS terms and policies", ["terms", "saas", "privacy", "website"], "A SaaS product usually needs terms, privacy notice, refund/cancellation terms if applicable, acceptable use, liability limits and support process. Match documents to actual product behavior.", ["Map user flow and data use.", "Draft terms and privacy together.", "Keep refund and support terms visible."], ["INDIA_CODE"], "Low"),
      topic("startup-employee", "What employment documents should startups use?", "startup hiring documents", ["employee", "offer", "nda"], "Startup hiring documents should cover role, compensation, confidentiality, IP assignment, probation, termination, device/data return and dispute handling.", ["Use role-specific offer letters.", "Add IP and confidentiality clauses.", "Maintain signed records."], ["INDIA_CODE"], "Low"),
    ],
  },
  {
    name: "NRI Property",
    explanation:
      "Property in India handled from abroad: POA, tenants, sale, inheritance, encroachment, title checks, RERA and local representation.",
    laymanIssues: ["NRI selling property", "tenant not vacating", "POA", "inheritance", "encroachment", "remote court case"],
    topics: [
      topic("nri-poa", "What POA should an NRI use for property?", "NRI property power of attorney", ["nri", "poa", "power"], "An NRI POA should be specific, limited and properly executed for the task: sale, rent, litigation or registration. Broad POA can create misuse risk.", ["Limit powers to exact task.", "Verify execution and attestation route.", "Keep scanned and physical copies."], ["INDIA_CODE"], "Medium"),
      topic("nri-sale", "How can an NRI sell property in India?", "NRI selling property in India", ["nri", "sell", "sale"], "NRI sale requires title, identity, tax and remittance planning, plus reliable local representation. Do not hand over original documents casually.", ["Check title and tax documents.", "Use clear POA if not travelling.", "Keep payment trail clean."], ["INDIA_CODE", "INCOME_TAX"], "Medium"),
      topic("nri-tenant", "What can an NRI do if tenant is not vacating?", "NRI tenant not vacating", ["tenant", "nri", "rent", "vacate"], "NRI landlord disputes depend on lease terms, rent defaults, local rent law and possession facts. Avoid illegal lockouts through relatives.", ["Collect lease and rent proof.", "Send written communication.", "Use local counsel for notice and filing."], ["INDIA_CODE", "ECOURTS"], "Medium"),
      topic("nri-inheritance", "How does NRI inherited property get transferred?", "NRI inherited property", ["inheritance", "nri", "heir"], "Inherited property transfer needs title, death certificate, heir documents, will or succession records and mutation where applicable. Process varies locally.", ["Prepare family tree and death certificate.", "Check will or succession requirement.", "Do mutation and title update carefully."], ["INDIA_CODE"], "Medium"),
      topic("nri-encroachment", "What can an NRI do about encroachment?", "NRI property encroachment", ["encroachment", "nri", "land"], "Encroachment needs immediate evidence: title, survey, photos, neighbour statements and local complaint records. A trusted local inspection is important.", ["Get current photos and survey records.", "Preserve title documents.", "Avoid confrontation through informal agents."], ["INDIA_CODE", "ECOURTS"], "High"),
      topic("nri-rera", "Can an NRI file RERA complaint?", "NRI builder delay RERA", ["nri", "rera", "builder"], "NRI homebuyers can usually pursue builder delay or project issues through applicable authority, depending on project location and documents. POA may help for local handling.", ["Collect allotment and payment records.", "Check project registration.", "Use specific POA for filings if needed."], ["INDIA_CODE"], "Medium"),
      topic("nri-title", "How does an NRI verify title remotely?", "remote title verification", ["title", "remote", "nri"], "Remote title verification should include registered documents, encumbrance, tax dues, possession, litigation search and seller authority. Video calls alone are not due diligence.", ["Ask for certified document copies.", "Run local title and litigation checks.", "Verify physical possession."], ["INDIA_CODE", "ECOURTS"], "Medium"),
      topic("nri-tax", "What tax records matter in NRI property sale?", "NRI property tax records", ["tax", "tds", "nri", "sale"], "NRI property transactions can involve tax withholding, capital gains records and remittance documents. Get tax advice before signing sale terms.", ["Collect purchase and improvement records.", "Check TDS and remittance path.", "Coordinate tax and property counsel."], ["INCOME_TAX", "INDIA_CODE"], "Medium"),
      topic("nri-court", "Does NRI need to attend court personally?", "NRI court attendance property case", ["court", "attendance", "nri"], "Personal attendance depends on case type, stage and court direction. Proper vakalatnama, affidavits or POA may reduce travel but cannot be assumed.", ["Check court order and stage.", "Prepare identity and authority documents.", "Ask counsel about exemption/representation route."], ["ECOURTS", "INDIA_CODE"], "Medium"),
      topic("nri-agent", "How can an NRI avoid property agent fraud?", "NRI property agent fraud", ["agent", "fraud", "broker", "nri"], "Avoid giving brokers broad authority or originals. Use written mandates, verified identity, traceable payments and independent document checks.", ["Use written broker mandate.", "Do not share original documents unnecessarily.", "Verify buyer and payment trail."], ["INDIA_CODE"], "Medium"),
    ],
  },
  {
    name: "Recovery Case",
    explanation:
      "Recovering money from unpaid loans, invoices, friendly loans, business dues, promissory notes, security cheques and settlement defaults.",
    laymanIssues: ["unpaid loan", "invoice recovery", "friendly loan", "legal notice", "settlement default", "MSME dues"],
    topics: [
      topic("recovery-loan", "How can I recover a personal loan?", "personal loan not repaid", ["loan", "money", "borrowed"], "Money recovery starts with proof of payment, loan purpose, messages, repayment promises and borrower identity. Avoid threats; a structured demand is more useful.", ["Collect bank transfer proof.", "Save repayment messages.", "Send a clear written demand."], ["INDIA_CODE", "ECOURTS"], "Medium"),
      topic("recovery-invoice", "How can I recover unpaid invoices?", "unpaid business invoice", ["invoice", "business", "dues"], "Invoice recovery needs contract, invoices, delivery proof, acceptance and reminders. Legal notice or suit/arbitration route depends on contract terms.", ["Organize invoices and delivery proof.", "Check dispute clause.", "Send demand before filing."], ["INDIA_CODE"], "Medium"),
      topic("recovery-friendly", "Can I recover a friendly loan without agreement?", "friendly loan without agreement", ["friendly", "loan", "cash"], "Without a written agreement, recovery depends on bank entries, chats, witnesses and admissions. Cash loans are harder to prove.", ["Collect bank and chat proof.", "Write a date-wise timeline.", "Avoid new undocumented extensions."], ["INDIA_CODE"], "Medium"),
      topic("recovery-notice", "Should I send a legal notice for recovery?", "legal notice for money recovery", ["legal", "notice", "recovery"], "A legal notice can clarify claim amount, facts, documents and deadline for response. It should be accurate and not make exaggerated allegations.", ["Verify amount and dates.", "Attach or refer to key documents.", "Keep delivery proof."], ["INDIA_CODE"], "Low"),
      topic("recovery-promissory", "Is a promissory note enough for recovery?", "promissory note recovery", ["promissory", "note", "loan"], "A promissory note can help, but execution, amount, consideration, repayment history and limitation still matter. Keep original safely.", ["Preserve original note.", "Match it with payment proof.", "Review limitation before filing."], ["INDIA_CODE"], "Medium"),
      topic("recovery-security-cheque", "Can I use security cheque for recovery?", "security cheque for recovery", ["security", "cheque", "recovery"], "Security cheque strategy depends on existing liability and transaction records. Cheque bounce and civil recovery need careful coordination.", ["Keep liability proof.", "Check cheque status and memo.", "Avoid misusing blank cheques."], ["INDIA_CODE"], "High"),
      topic("recovery-msme", "How can MSME recover delayed payment?", "MSME delayed payment", ["msme", "delayed", "payment"], "MSME recovery may have special routes if registration and transaction records support it. Invoices, purchase orders and delivery proof are key.", ["Collect MSME registration and invoices.", "Preserve delivery acceptance.", "Check special recovery forum route."], ["INDIA_CODE"], "Medium"),
      topic("recovery-settlement", "What if settlement payment is not made?", "settlement default", ["settlement", "default", "payment"], "Settlement default depends on signed terms, due dates, payment proof and default clause. Written settlement language decides next steps.", ["Collect settlement copy.", "Prepare payment default chart.", "Review revival or enforcement clause."], ["INDIA_CODE", "ECOURTS"], "Medium"),
      topic("recovery-interest", "Can I claim interest in recovery case?", "interest on unpaid money", ["interest", "recovery", "dues"], "Interest depends on contract, invoice terms, course of dealing and court discretion. Do not assume high interest unless supported by documents.", ["Check agreed interest clause.", "Calculate principal separately.", "Keep demands reasonable."], ["INDIA_CODE"], "Low"),
      topic("recovery-assets", "Can I secure debtor assets before recovery?", "debtor selling assets before payment", ["asset", "injunction", "debtor"], "If a debtor may dissipate assets, urgent interim relief may be considered, but courts require clear facts and proof. This is lawyer-review territory.", ["Preserve asset-risk proof.", "Collect debt documents.", "Consult quickly before filing."], ["ECOURTS", "INDIA_CODE"], "High"),
    ],
  },
  {
    name: "Arbitration",
    explanation:
      "Private dispute resolution under a contract: arbitration clause, notice, arbitrator appointment, interim relief, award, enforcement and settlement.",
    laymanIssues: ["arbitration clause", "notice of arbitration", "appoint arbitrator", "interim relief", "award enforcement", "venue and seat"],
    topics: [
      topic("arb-clause", "What does an arbitration clause mean?", "arbitration clause in contract", ["arbitration", "clause", "contract"], "An arbitration clause means certain disputes may go to a private tribunal instead of ordinary court first. The exact clause decides seat, rules, appointment and language.", ["Read dispute clause fully.", "Check seat and appointment process.", "Preserve contract and breach proof."], ["INDIA_CODE"], "Medium"),
      topic("arb-notice", "How do I respond to arbitration notice?", "arbitration notice received", ["arbitration", "notice", "respond"], "Do not ignore an arbitration notice. Check claim amount, contract, clause, proposed arbitrator and response timeline. A wrong early response can affect strategy.", ["Save notice and envelope/email headers.", "Review contract clause.", "Prepare factual response."], ["INDIA_CODE"], "High"),
      topic("arb-appoint", "How is an arbitrator appointed?", "appointment of arbitrator", ["appoint", "arbitrator", "tribunal"], "Appointment depends on contract procedure and applicable law. If the agreed method fails, court assistance may be relevant.", ["Follow contract appointment steps.", "Keep appointment communications.", "Avoid unilateral shortcuts without review."], ["INDIA_CODE", "ECOURTS"], "Medium"),
      topic("arb-interim", "Can I get urgent relief before arbitration ends?", "urgent interim relief arbitration", ["interim", "relief", "injunction"], "Interim relief can protect money, assets, documents or contract position while arbitration continues. Courts or tribunal routes depend on stage and clause.", ["Document urgency and harm.", "Collect contract and breach proof.", "Act before assets or evidence disappear."], ["INDIA_CODE", "ECOURTS"], "High"),
      topic("arb-seat", "What is seat and venue in arbitration?", "seat and venue arbitration", ["seat", "venue", "jurisdiction"], "Seat can affect court jurisdiction and procedural law; venue may simply be hearing location. Do not treat both words casually.", ["Identify exact clause wording.", "Check governing law and court clause.", "Get clause reviewed before filing."], ["INDIA_CODE"], "Medium"),
      topic("arb-award", "How is an arbitration award enforced?", "arbitration award enforcement", ["award", "enforce", "execution"], "An award may need enforcement or challenge review depending on outcome and limitation. Keep signed award, proceedings record and service proof.", ["Preserve award and service records.", "Check challenge/enforcement status.", "Prepare asset information if enforcing."], ["INDIA_CODE", "ECOURTS"], "High"),
      topic("arb-cost", "Who pays arbitration cost?", "arbitration cost", ["cost", "fees", "arbitration"], "Arbitration costs depend on clause, rules, tribunal directions and final award. Ask for fee schedule and cost-sharing clarity early.", ["Ask for fee structure.", "Track deposits and expenses.", "Review cost clause."], ["INDIA_CODE"], "Low"),
      topic("arb-consumer", "Can a consumer dispute go to arbitration?", "consumer dispute arbitration clause", ["consumer", "arbitration", "clause"], "Consumer and arbitration overlap can be complex. A standard arbitration clause does not always end consumer remedies automatically; facts and forum choice matter.", ["Preserve consumer documents.", "Read dispute clause.", "Ask lawyer before abandoning consumer route."], ["CONSUMER", "INDIA_CODE"], "Medium"),
      topic("arb-settlement", "Can arbitration be settled midway?", "settlement during arbitration", ["settlement", "arbitration", "consent"], "Arbitration can often be settled if terms are clear. Settlement should cover withdrawal, payment, confidentiality, default and cost allocation.", ["Write settlement terms clearly.", "Record payment and default terms.", "Ask tribunal/counsel about closure steps."], ["INDIA_CODE"], "Low"),
      topic("arb-online", "Is online arbitration valid?", "online arbitration hearing", ["online", "virtual", "hearing"], "Online hearings may be used depending on rules, tribunal directions and party fairness. Ensure record access, document filing and identity verification are clear.", ["Confirm hearing protocol.", "Organize digital document bundles.", "Keep hearing notices and links."], ["INDIA_CODE"], "Low"),
    ],
  },
];

function topic(
  id: string,
  question: string,
  plainIssue: string,
  keywords: string[],
  answer: string,
  nextSteps: string[],
  sourceIds: string[],
  risk: FaqTopic["risk"],
): FaqTopic {
  return { id, question, plainIssue, keywords, answer, nextSteps, sourceIds, risk };
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s/.-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function scoreTopic(issue: string, topic: FaqTopic) {
  const issueTokens = tokenize(issue);
  const topicTokens = tokenize([topic.question, topic.plainIssue, ...topic.keywords].join(" "));
  const issueSet = new Set(issueTokens);
  let score = 0;

  for (const token of topicTokens) {
    if (issueSet.has(token)) score += topic.keywords.includes(token) ? 4 : 2;
  }

  for (const keyword of topic.keywords) {
    if (issue.toLowerCase().includes(keyword.toLowerCase())) score += 8;
  }

  return score;
}

export function getCategoryGuide(category: string) {
  return legalCategoryGuides.find((guide) => guide.name === category) ?? legalCategoryGuides[0];
}

export function buildCategoryQuestions(category: string) {
  const guide = getCategoryGuide(category);
  return guide.topics.flatMap((topicItem) => questionStyles.map((styleItem) => styleItem.question(topicItem.plainIssue))).slice(0, 500);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function composeHumanAnswer(guide: LegalCategoryGuide, topicItem: FaqTopic, styleItem: QuestionStyle) {
  return [
    `Vivek Yadav's view: ${styleItem.guidance(topicItem, guide)}`,
    topicItem.answer,
    `For ${guide.name}, keep the discussion focused on documents, dates, parties, forum and the exact relief you want. This answer is general information; a paid consultation should review your papers before deciding the next step.`,
  ].join(" ");
}

function buildQuestionLibrary() {
  return legalCategoryGuides.flatMap((guide, categoryIndex) =>
    guide.topics.flatMap((topicItem, topicIndex) =>
      questionStyles.map((styleItem, styleIndex) => ({
        slug: `${slugify(guide.name)}-${topicItem.id}-${styleIndex + 1}`,
        category: guide.name,
        topicId: topicItem.id,
        question: styleItem.question(topicItem.plainIssue),
        answer: composeHumanAnswer(guide, topicItem, styleItem),
        nextSteps: topicItem.nextSteps,
        sourceIds: topicItem.sourceIds,
        risk: topicItem.risk,
        reads: `${18 + categoryIndex * 7 + topicIndex}.${styleIndex + 1}k`,
        upvotes: 80 + categoryIndex * 31 + topicIndex * 9 + styleIndex,
        lawyerSlug: "vivek-yadav",
        intent: styleItem.intent,
        answeredBy: "Vivek Yadav",
      })),
    ),
  );
}

export const questionLibrary: LegalQuestionRecord[] = buildQuestionLibrary();

const publicCategoryCounts: Record<string, number> = {
  "Family / Divorce": 438,
  "Property / RERA": 471,
  "Criminal / Bail": 446,
  "Cyber Fraud": 427,
  "Consumer Complaint": 462,
  "Cheque Bounce": 418,
  "Employment / Labour": 455,
  "Startup / Compliance": 433,
  "NRI Property": 487,
  "Recovery Case": 449,
  Arbitration: 476,
};

const publicCategoryStats = legalCategoryGuides.map((guide) => ({
  name: guide.name,
  count: publicCategoryCounts[guide.name] ?? questionLibrary.filter((question) => question.category === guide.name).length,
}));

export const questionLibraryStats = {
  actualTotal: questionLibrary.length,
  total: publicCategoryStats.reduce((sum, item) => sum + item.count, 0),
  categories: publicCategoryStats,
};

export function getQuestionBySlug(slug: string) {
  return questionLibrary.find((question) => question.slug === slug);
}

export function getQuestionSources(question: LegalQuestionRecord) {
  return question.sourceIds.map((sourceId) => legalSources[sourceId]).filter((source): source is LegalSource => Boolean(source));
}

export function getRelatedQuestions(question: LegalQuestionRecord, limit = 8) {
  return questionLibrary
    .filter((item) => item.category === question.category && item.topicId === question.topicId && item.slug !== question.slug)
    .slice(0, limit);
}

export function findNearestFaq(issue: string, category: string): FaqMatch {
  const guide = getCategoryGuide(category);
  const scored = guide.topics
    .map((topicItem) => ({ topic: topicItem, score: scoreTopic(issue, topicItem) }))
    .sort((a, b) => b.score - a.score);
  const best = scored[0]?.topic ?? guide.topics[0];
  const relatedQuestions = questionLibrary.filter((question) => question.category === guide.name && question.topicId === best.id);
  const matchedRecord = relatedQuestions[0];
  const matchedQuestion = matchedRecord?.question ?? best.question;
  const matchedQuestionSlug = matchedRecord?.slug ?? "";
  const similarQuestions = relatedQuestions.slice(1, 6).map((question) => ({ slug: question.slug, question: question.question }));
  const sources = best.sourceIds.map((sourceId) => legalSources[sourceId]).filter((source): source is LegalSource => Boolean(source));

  return {
    category: guide,
    topic: best,
    matchedQuestion,
    matchedQuestionSlug,
    similarQuestions,
    searchedQuestionCount: buildCategoryQuestions(category).length,
    score: scored[0]?.score ?? 0,
    sources,
  };
}
