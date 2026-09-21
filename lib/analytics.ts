// Analytics logging to Supabase
// Silently degrades if env vars are not set

let supabaseClient: ReturnType<typeof import("@supabase/supabase-js").createClient> | null = null;

async function getClient() {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) return null;

  const { createClient } = await import("@supabase/supabase-js");
  supabaseClient = createClient(url, key);
  return supabaseClient;
}

export interface AnalyticsEvent {
  session_id: string;
  event: string;
  lang?: string;
  rating?: number;
  visit_type?: string;
  highlights?: string[];
  length?: string;
  source?: string;
  utm?: string;
  props?: Record<string, unknown>;
}

export async function logEvent(data: AnalyticsEvent): Promise<void> {
  const client = await getClient();
  if (!client) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (client.from("events") as any).insert({
      session_id: data.session_id,
      event: data.event,
      lang: data.lang ?? null,
      rating: typeof data.rating === "number" ? data.rating : null,
      visit_type: data.visit_type ?? null,
      highlights: data.highlights ?? null,
      length: data.length ?? null,
      source: data.source ?? null,
      utm: data.utm ?? null,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Fire-and-forget: never crash the main flow
  }
}
