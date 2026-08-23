const fs = require("fs");

const endpoint = process.argv[2] || "http://127.0.0.1:3008/api/ai/triage";

const questions = [
  { category: "Property", language: "English", issue: "My builder has delayed possession of my flat in Gurgaon by 18 months. What are my practical options under RERA?" },
  { category: "Family", language: "Hindi", issue: "मेरे पति maintenance नहीं दे रहे हैं और मैं बच्चे के साथ रहती हूँ। मुझे क्या सामान्य जानकारी जाननी चाहिए?" },
  { category: "Employment", language: "English", issue: "My employer terminated me without notice and has not paid my final salary. What should I check first?" },
  { category: "Criminal", language: "Hinglish", issue: "Mere khilaf false police complaint ki dhamki di ja rahi hai. Mujhe kya safe steps lene chahiye?" },
  { category: "Consumer", language: "English", issue: "An ecommerce company delivered a damaged phone and is refusing refund. What legal route can a consumer consider?" },
  { category: "Startup", language: "English", issue: "Two cofounders disagree on equity and one founder is leaving. What documents should we review before taking action?" },
  { category: "Tax", language: "English", issue: "I received an income tax notice asking for clarification on high value transactions. What should I do generally?" },
  { category: "Property", language: "Hindi", issue: "किरायेदार 4 महीने से rent नहीं दे रहा और घर खाली नहीं कर रहा। मालिक के लिए सामान्य कानूनी विकल्प क्या हैं?" },
  { category: "Family", language: "English", issue: "Can a working wife claim maintenance in India? What factors usually matter?" },
  { category: "Employment", language: "Hinglish", issue: "Company ne offer letter diya tha par joining se pehle revoke kar diya. Kya basic legal checks karu?" },
  { category: "Consumer", language: "English", issue: "A coaching institute promised refund in brochure but is refusing after I cancelled. What can I do?" },
  { category: "Property", language: "English", issue: "What should I verify before buying agricultural land in Maharashtra?" },
  { category: "Family", language: "Hindi", issue: "मुझे mutual consent divorce की basic प्रक्रिया समझनी है, क्या points ध्यान में रखूँ?" },
  { category: "Criminal", language: "English", issue: "Someone posted defamatory statements about my business on social media. What are the legal categories involved?" },
  { category: "Startup", language: "English", issue: "A client has not paid invoices for 6 months. Should I send a legal notice first?" },
  { category: "Employment", language: "English", issue: "My company is forcing me to resign instead of terminating me. What records should I keep?" },
  { category: "Property", language: "Hinglish", issue: "Builder ne OC nahi diya par possession de raha hai. Buyer ko kya check karna chahiye?" },
  { category: "Consumer", language: "Hindi", issue: "मेरी health insurance claim reject हो गई है। मैं कौन से documents और steps देखूँ?" },
  { category: "Family", language: "English", issue: "My elderly parents are being harassed by my brother for property. What general remedies exist for senior citizens?" },
  { category: "Criminal", language: "English", issue: "Police are calling me for questioning but no written notice has been given. What should I keep in mind?" },
  { category: "Tax", language: "English", issue: "GST registration was cancelled because returns were not filed. What general compliance path should I understand?" },
  { category: "Startup", language: "Hinglish", issue: "Mera vendor contract breach kar raha hai, agreement me arbitration clause hai. Iska matlab kya hota hai?" },
  { category: "Property", language: "English", issue: "A housing society is charging transfer fees much higher than expected. What should I verify?" },
  { category: "Consumer", language: "English", issue: "An airline cancelled my flight and only offered a voucher. What rights should I check?" },
  { category: "Family", language: "Hindi", issue: "बच्चे की custody को लेकर dispute है। Court generally किन बातों को देखता है?" },
  { category: "Employment", language: "English", issue: "I signed a non-compete clause. Can my employer stop me from joining a competitor in India?" },
  { category: "Criminal", language: "Hinglish", issue: "Cyber fraud me paise chale gaye, bank aur police ko kya information deni chahiye?" },
  { category: "Property", language: "English", issue: "My landlord entered the rented house without permission. What are my rights as a tenant generally?" },
  { category: "Startup", language: "English", issue: "We want to hire freelancers. What legal documents and IP clauses should be considered?" },
  { category: "Consumer", language: "Hindi", issue: "कार सर्विस सेंटर ने गलत repair किया और extra charge लिया। Consumer forum में क्या basic चीजें लगती हैं?" },
  { category: "Family", language: "English", issue: "My wife filed a domestic violence complaint. What should I understand about notice and response?" },
  { category: "Employment", language: "Hindi", issue: "मेरी salary 3 महीने से pending है। क्या सामान्य legal steps हो सकते हैं?" },
  { category: "Property", language: "English", issue: "There is a dispute between siblings over inherited property. What documents are important?" },
  { category: "Criminal", language: "English", issue: "What is anticipatory bail in general terms and when should a person speak to a lawyer?" },
  { category: "Tax", language: "Hinglish", issue: "Income tax refund hold ho gaya hai aur portal pe notice dikh raha hai. Kya basic check karu?" },
  { category: "Startup", language: "English", issue: "An investor is asking for broad founder personal guarantees. What legal points should founders review?" },
  { category: "Consumer", language: "English", issue: "A hospital bill includes charges not explained before admission. What can a patient family ask for?" },
  { category: "Property", language: "Hindi", issue: "मेरे plot पर पड़ोसी ने boundary आगे बढ़ा ली है। मुझे कौन से evidence रखने चाहिए?" },
  { category: "Family", language: "Hinglish", issue: "Shaadi ke baad stridhan wapas nahi mil raha. Isko kaise document karu?" },
  { category: "Employment", language: "English", issue: "My relieving letter is being withheld unless I sign a broad waiver. What should I review?" },
  { category: "Criminal", language: "Hindi", issue: "किसी ने WhatsApp पर धमकी दी है। Legal complaint से पहले क्या proof रखना चाहिए?" },
  { category: "Consumer", language: "English", issue: "A real estate broker took token money but the deal failed. What should I check in the receipt?" },
  { category: "Startup", language: "English", issue: "Our SaaS startup handles customer personal data. What India privacy law basics should we know?" },
  { category: "Property", language: "English", issue: "My sale deed has a spelling error in my name. What general correction options exist?" },
  { category: "Family", language: "Hindi", issue: "मेरी बहन को matrimonial home से निकाल दिया गया है। तुरंत कौन सी safety और legal information जरूरी है?" },
  { category: "Employment", language: "Hinglish", issue: "PF deposit employer ne nahi kiya lag raha hai. Employee ko kya verify karna chahiye?" },
  { category: "Criminal", language: "English", issue: "I received a cheque bounce notice. What should I understand before responding?" },
  { category: "Tax", language: "English", issue: "A freelancer has foreign income and TDS mismatch. What documents should be reconciled?" },
  { category: "Consumer", language: "Hinglish", issue: "Online course ne job guarantee bola tha par placement nahi diya. Kya consumer complaint possible hai?" },
  { category: "Property", language: "English", issue: "A bank auction property looks cheap. What legal due diligence should a buyer do?" },
];

function fallbackUsed(data) {
  const mode = String(data?.mode || "");
  return mode.includes("fallback") || Boolean(data?.providerError) || data?.agent?.model?.mode === "guarded-fallback";
}

function collectCitations(data) {
  const answerCitations = Array.isArray(data?.citations) ? data.citations : [];
  const agentCitations = Array.isArray(data?.agent?.sources) ? data.agent.sources : [];
  return [...answerCitations, ...agentCitations].filter(Boolean);
}

function wordCount(text) {
  return String(text || "").trim().split(/\s+/).filter(Boolean).length;
}

function looksHuman(text) {
  const value = String(text || "");
  if (/guarded deterministic|verified-source safety fallback|fallback/i.test(value)) return false;
  if (wordCount(value) < 45) return false;
  return /[.!?।]/.test(value);
}

async function run() {
  const results = [];
  let failed = false;

  for (let i = 0; i < questions.length; i += 1) {
    const question = questions[i];
    const started = Date.now();
    let record = { index: i + 1, ...question };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          issue: question.issue,
          category: question.category,
          city: i % 3 === 0 ? "Delhi" : i % 3 === 1 ? "Mumbai" : "Bengaluru",
          language: question.language,
          urgency: i % 9 === 0 ? "urgent" : "normal",
        }),
      });

      const data = await response.json().catch(() => ({}));
      const citations = collectCitations(data);
      const answer = data?.answer?.answer || data?.answer || data?.message || "";
      const checks = {
        httpOk: response.status === 200,
        noFallback: !fallbackUsed(data),
        hasCitations: citations.length > 0,
        humanAnswer: looksHuman(answer),
        model: data?.model || data?.agent?.model?.executedModel || data?.answer?.model || data?.agent?.model?.requestedModel || null,
        providerError: data?.providerError || null,
        mode: data?.mode || data?.agent?.model?.mode || null,
        durationMs: Date.now() - started,
        wordCount: wordCount(answer),
        citationIds: citations.map((citation) => (typeof citation === "string" ? citation : citation.id || citation.title)).filter(Boolean),
        answerPreview: String(answer).slice(0, 360),
      };
      const ok = checks.httpOk && checks.noFallback && checks.hasCitations && checks.humanAnswer;
      record = { ...record, status: response.status, checks, pass: ok };
      console.log(`${ok ? "PASS" : "FAIL"} ${i + 1}/50 ${question.category} ${question.language} ${checks.durationMs}ms model=${checks.model || "unknown"} citations=${checks.citationIds.join(",") || "none"} mode=${checks.mode || "n/a"}`);

      if (!ok) {
        console.log(JSON.stringify(record, null, 2));
        failed = true;
        results.push(record);
        break;
      }
    } catch (error) {
      record = { ...record, pass: false, error: error && error.stack ? error.stack : String(error) };
      console.log(`FAIL ${i + 1}/50 exception ${record.error}`);
      failed = true;
      results.push(record);
      break;
    }

    results.push(record);
  }

  const summary = {
    endpoint,
    createdAt: new Date().toISOString(),
    totalPlanned: questions.length,
    totalRun: results.length,
    passed: results.filter((result) => result.pass).length,
    failed: results.filter((result) => !result.pass).length,
    fallbackCount: results.filter((result) => result.checks && !result.checks.noFallback).length,
    citationFailures: results.filter((result) => result.checks && !result.checks.hasCitations).length,
    humanAnswerFailures: results.filter((result) => result.checks && !result.checks.humanAnswer).length,
    averageDurationMs: Math.round(results.reduce((sum, result) => sum + (result.checks?.durationMs || 0), 0) / Math.max(results.length, 1)),
    publishable: !failed && results.length === questions.length,
  };

  fs.mkdirSync("validation", { recursive: true });
  fs.writeFileSync("validation/legal-agent-50q-report.json", JSON.stringify({ summary, results }, null, 2));
  console.log(`SUMMARY ${JSON.stringify(summary)}`);
  process.exit(summary.publishable ? 0 : 1);
}

run().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
