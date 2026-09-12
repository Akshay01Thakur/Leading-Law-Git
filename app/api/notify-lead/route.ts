import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Server-only: the CallMeBot key must never reach the browser bundle.
  const apiKey = process.env.CALLMEBOT_APIKEY ?? "";
  const phone = (process.env.CALLMEBOT_PHONE ?? process.env.NEXT_PUBLIC_ADVOCATE_WHATSAPP ?? "").replace(/\D/g, "");

  // Not configured is a normal state, not an error: the booking flow must keep
  // working whether or not lead alerts are switched on.
  if (!apiKey || !phone) {
    return NextResponse.json({ ok: false, reason: "not_configured" });
  }

  const message = [
    "Leading Law — new booking started (payment not completed yet)",
    `Name: ${clean(body.name, 60) || "Not given"}`,
    `Phone: ${clean(body.phone, 20) || "Not given"}`,
    `Category: ${clean(body.category, 40) || "Not given"}`,
    `City: ${clean(body.city, 40) || "Not given"}`,
    `Urgency: ${clean(body.urgency, 40) || "Not given"}`,
    `Query: ${clean(body.issue, 220) || "Not given"}`,
    "Follow up if the payment does not arrive shortly.",
  ].join("\n");

  const url =
    "https://api.callmebot.com/whatsapp.php" +
    `?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(message)}` +
    `&apikey=${encodeURIComponent(apiKey)}`;

  // Bounded so a slow or unreachable third party can never hold the request open.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    // CallMeBot answers 200 even on failure and puts "ERROR: ..." in the body,
    // so response.ok alone would report success for a bad key. Check the body too,
    // otherwise a silently-undelivered alert looks healthy.
    const text = (await response.text()).slice(0, 300);
    const delivered = response.ok && !/ERROR/i.test(text);
    return NextResponse.json(
      delivered ? { ok: true } : { ok: false, reason: "rejected", detail: text.replace(/<[^>]*>/g, "").trim() },
    );
  } catch {
    // Swallow: a failed lead alert must never surface to the customer.
    return NextResponse.json({ ok: false, reason: "send_failed" });
  } finally {
    clearTimeout(timeout);
  }
}
