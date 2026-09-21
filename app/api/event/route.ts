import { NextRequest, NextResponse } from "next/server";
import { logEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, event, props, utm, lang, rating, visitType, highlights, length, source } =
      body;

    if (!sessionId || !event) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Fire-and-forget
    logEvent({
      session_id: sessionId,
      event,
      lang,
      rating: typeof rating === "number" ? rating : undefined,
      visit_type: visitType,
      highlights,
      length,
      source,
      utm,
      props,
    }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
