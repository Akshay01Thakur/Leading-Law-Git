import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function safeEqual(a: string, b: string) {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export async function POST(request: NextRequest) {
  let passcode = "";
  try {
    const body = await request.json();
    passcode = typeof body?.passcode === "string" ? body.passcode : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Server-only env var: deliberately NOT prefixed NEXT_PUBLIC_, so it is never
  // shipped in the client bundle and cannot be read out of page source.
  const expected = process.env.ADVOCATE_PASSCODE ?? "";
  if (!expected) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  return NextResponse.json({ ok: safeEqual(passcode, expected) });
}
