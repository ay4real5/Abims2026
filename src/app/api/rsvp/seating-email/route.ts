import { NextRequest, NextResponse } from "next/server";
import { ADMIN_KEY, ensureTable, getSql } from "@/lib/rsvp-db";
import { site } from "@/config/site";

/**
 * Bulk seating/countdown email — the /rsvps admin page's Seating Email tab.
 * POST (?key=ADMIN_KEY): body { ids: [uuid, ...] }. Only sends to rows that
 * are attending, have an email on file, and already have a table assigned;
 * everything else comes back as a per-row skip reason. Requires
 * site.emailjs.seatingTemplateId to be set (a second EmailJS template the
 * user creates by hand — see CLAUDE.md/plan notes) and the EmailJS account's
 * "Allow API for non-browser applications" toggle to be enabled, since this
 * call is server-side, not from a guest's browser.
 */

type Row = {
  id: string;
  name: string;
  email: string;
  guests: string;
  table_number: number | null;
};

function daysUntilWedding(): number {
  const ms = new Date(site.weddingDateISO).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

function formattedWeddingDate(): string {
  return new Date(site.weddingDateISO).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function sendOne(row: Row, sql: NonNullable<ReturnType<typeof getSql>>): Promise<{ id: string; ok: boolean; error?: string }> {
  if (!row.email) return { id: row.id, ok: false, error: "No email on file." };
  if (row.table_number == null) return { id: row.id, ok: false, error: "No table assigned." };
  if (!site.emailjs.seatingTemplateId) return { id: row.id, ok: false, error: "seatingTemplateId is not configured." };

  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: site.emailjs.serviceId,
        template_id: site.emailjs.seatingTemplateId,
        user_id: site.emailjs.publicKey,
        template_params: {
          name: row.name,
          email: row.email,
          guests: row.guests,
          tableNumber: row.table_number,
          daysUntil: daysUntilWedding(),
          weddingDate: formattedWeddingDate(),
          ceremonyVenue: site.ceremony.venue,
          ceremonyTime: site.ceremony.time,
          receptionVenue: site.reception.venue,
          receptionTime: site.reception.time,
        },
      }),
    });
    if (!res.ok) {
      return { id: row.id, ok: false, error: `EmailJS responded ${res.status}.` };
    }
  } catch {
    return { id: row.id, ok: false, error: "Send failed." };
  }

  try {
    await sql`UPDATE rsvps SET email_sent_at = now() WHERE id = ${row.id};`;
  } catch {
    return { id: row.id, ok: false, error: "Sent, but failed to record email_sent_at." };
  }
  return { id: row.id, ok: true };
}

/** Runs `items` through `fn` with at most `limit` in flight at once. */
async function withConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

export async function POST(request: NextRequest) {
  if (request.nextUrl.searchParams.get("key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sql = getSql();
  if (!sql) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const body = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const ids = Array.isArray(body.ids) ? body.ids.filter((v): v is string => typeof v === "string") : null;
  if (!ids || ids.length === 0) {
    return NextResponse.json({ error: "ids array is required." }, { status: 400 });
  }

  let rows: Row[];
  try {
    await ensureTable(sql);
    rows = (await sql`
      SELECT id, name, email, guests, table_number
      FROM rsvps
      WHERE id = ANY(${ids}) AND attending = 'Yes';
    `) as Row[];
  } catch {
    return NextResponse.json({ error: "Unable to load RSVPs." }, { status: 500 });
  }

  const found = new Set(rows.map((r) => r.id));
  const missing = ids.filter((id) => !found.has(id)).map((id) => ({ id, ok: false as const, error: "Not found or not attending." }));

  const sent = await withConcurrency(rows, 5, (row) => sendOne(row, sql));

  return NextResponse.json({ ok: true, results: [...sent, ...missing] });
}
