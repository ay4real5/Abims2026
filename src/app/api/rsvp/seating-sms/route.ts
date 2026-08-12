import { NextRequest, NextResponse } from "next/server";
import { ADMIN_KEY, ensureTable, getSql } from "@/lib/rsvp-db";
import { site } from "@/config/site";

/**
 * Bulk seating/countdown SMS — the fallback channel in the /rsvps admin
 * page's Seating Email tab for guests with a phone number but no email.
 * POST (?key=ADMIN_KEY): body { ids: [uuid, ...] }. Only sends to rows that
 * are attending, have a phone on file, and already have a table assigned.
 * Requires TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_PHONE_NUMBER env
 * vars (set on Vercel, never in this repo) — sends the plain Twilio REST
 * API via fetch with Basic Auth, same as the EmailJS route calls EmailJS's
 * REST API directly, so no new SDK dependency is needed.
 */

type Row = {
  id: string;
  name: string;
  phone: string;
  guests: string;
  table_number: number | null;
};

function daysUntilWedding(): number {
  const ms = new Date(site.weddingDateISO).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

/** Best-effort UK number normalisation: "07..." -> "+447...". Leaves anything already in +E.164 form alone. */
function toE164(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("0")) return "+44" + digits.slice(1);
  if (digits.startsWith("44")) return "+" + digits;
  return digits.length >= 8 ? "+" + digits : null;
}

/**
 * The party in words, e.g. " (you and your 2 guests)". The stored `guests`
 * value is a raw form field ("Just me", "+2", "3") that must never reach a
 * guest verbatim; a lone guest gets no suffix at all.
 */
function partyPhrase(guests: string): string {
  if (!guests || guests === "Just me") return "";
  const plus = /^\+(\d+)$/.exec(guests);
  const extra = plus ? parseInt(plus[1], 10) : parseInt(guests, 10) - 1;
  if (Number.isNaN(extra) || extra < 1) return "";
  return extra === 1 ? " (you and your guest)" : ` (you and your ${extra} guests)`;
}

/**
 * Laid out over several lines so the details scan on a phone rather than
 * arriving as one block of prose. The line breaks are effectively free: each
 * one replaces a space, and newline is a normal GSM-7 character.
 *
 * Kept strictly within the GSM-7 alphabet — no em dashes, curly quotes or
 * emoji. One non-GSM character re-encodes the whole message as UCS-2, which
 * cuts the segment size from 153 to 67 chars and silently adds ~50% to the
 * bill. At the current wording the longest realistic party still fits in two
 * segments; re-check that before adding to it.
 */
function smsBody(row: Row): string {
  return [
    `Hi ${row.name}, only ${daysUntilWedding()} days to go!`,
    ``,
    `We are so glad you will be with us. You are seated at Table ${row.table_number}${partyPhrase(row.guests)} for the reception.`,
    ``,
    `Ceremony ${site.ceremony.time}`,
    `${site.ceremony.venue}, ${site.ceremony.address[0]}`,
    ``,
    `Reception ${site.reception.time}`,
    `${site.reception.venue}`,
    ``,
    `- ${site.coupleNames}`,
  ].join("\n");
}

async function sendOne(row: Row, sql: NonNullable<ReturnType<typeof getSql>>): Promise<{ id: string; ok: boolean; error?: string }> {
  if (!row.phone) return { id: row.id, ok: false, error: "No phone on file." };
  if (row.table_number == null) return { id: row.id, ok: false, error: "No table assigned." };

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!accountSid || !authToken || !from) {
    return { id: row.id, ok: false, error: "Twilio env vars are not set." };
  }

  const to = toE164(row.phone);
  if (!to) return { id: row.id, ok: false, error: "Phone number doesn't look valid." };

  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      },
      body: new URLSearchParams({ From: from, To: to, Body: smsBody(row) }),
    });
    if (!res.ok) {
      const detail = await res.json().catch(() => null);
      return { id: row.id, ok: false, error: detail?.message ? String(detail.message) : `Twilio responded ${res.status}.` };
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
      SELECT id, name, phone, guests, table_number
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
