import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

/**
 * RSVP guest list — stored in the same Neon database as the blessings wall.
 * POST (?key=ADMIN_KEY, required): adds a reply. RSVPs are closed to the
 *       public (see site.rsvpClosed) — this now only accepts the admin key,
 *       used by the "Add guest" form on /rsvps for replies taken by phone or
 *       in person. Reopen by requiring the key only when site.rsvpClosed is
 *       true, if public RSVPs are ever turned back on.
 * GET  (?key=ADMIN_KEY): the full list, or CSV with &format=csv.
 * PATCH (?key=ADMIN_KEY&id=…): edit a row — used by the /rsvps admin page for
 *        guests who replied outside the site (phone, in person).
 * DELETE (?key=ADMIN_KEY&id=…): remove a row (duplicates, tests, spam).
 * The key comes from RSVP_ADMIN_KEY (Vercel env var), defaulting to "Abims2026".
 */

type RsvpRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  attending: string;
  created_at: string;
};

const ADMIN_KEY = process.env.RSVP_ADMIN_KEY || "Abims2026";

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

async function ensureTable(sql: NonNullable<ReturnType<typeof getSql>>) {
  await sql`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS rsvps (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      email text NOT NULL DEFAULT '',
      phone text NOT NULL DEFAULT '',
      guests text NOT NULL DEFAULT '',
      attending text NOT NULL DEFAULT 'Yes',
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS rsvps_created_at_idx ON rsvps (created_at DESC);
  `;
}

function normalize(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, 200);
}

function serialize(row: RsvpRow) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    guests: row.guests,
    attending: row.attending,
    receivedAt: row.created_at,
  };
}

export async function POST(request: NextRequest) {
  /* RSVPs are closed — only the admin (adding a reply manually from /rsvps)
     may still insert rows. Public submissions get a clear, friendly refusal. */
  if (request.nextUrl.searchParams.get("key") !== ADMIN_KEY) {
    return NextResponse.json(
      { error: "RSVPs are now closed. Please contact the couple directly." },
      { status: 410 }
    );
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
  const name = normalize(body.name);
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  /* Admin-only backdating: with the admin key, an ISO `receivedAt` in the
     body sets created_at — used to backfill replies that predate this API.
     Public submissions can't influence their timestamp. */
  let backdate: string | null = null;
  if (request.nextUrl.searchParams.get("key") === ADMIN_KEY && typeof body.receivedAt === "string") {
    const t = new Date(body.receivedAt);
    if (!Number.isNaN(t.getTime())) backdate = t.toISOString();
  }

  try {
    await ensureTable(sql);
    if (backdate) {
      await sql`
        INSERT INTO rsvps (name, email, phone, guests, attending, created_at)
        VALUES (${name}, ${normalize(body.email)}, ${normalize(body.phone)},
                ${normalize(body.guests)}, ${normalize(body.attending) || "Yes"}, ${backdate});
      `;
    } else {
      await sql`
        INSERT INTO rsvps (name, email, phone, guests, attending)
        VALUES (${name}, ${normalize(body.email)}, ${normalize(body.phone)},
                ${normalize(body.guests)}, ${normalize(body.attending) || "Yes"});
      `;
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save RSVP." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sql = getSql();
  if (!sql) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  let rows: RsvpRow[];
  try {
    await ensureTable(sql);
    rows = (await sql`
      SELECT id, name, email, phone, guests, attending, created_at
      FROM rsvps
      ORDER BY created_at DESC;
    `) as RsvpRow[];
  } catch {
    return NextResponse.json({ error: "Unable to load RSVPs." }, { status: 500 });
  }

  if (request.nextUrl.searchParams.get("format") === "csv") {
    // created_at arrives from the Neon driver as a Date, so coerce every cell
    const esc = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
    const table = [
      ["Name", "Email", "Phone", "Guests", "Attending", "Received"],
      ...rows.map((r) => [
        r.name, r.email, r.phone, r.guests, r.attending,
        new Date(r.created_at).toISOString(),
      ]),
    ];
    const csv = table.map((row) => row.map(esc).join(",")).join("\r\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="rsvps.csv"',
      },
    });
  }

  return NextResponse.json({ ok: true, rsvps: rows.map(serialize) });
}

export async function PATCH(request: NextRequest) {
  if (request.nextUrl.searchParams.get("key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
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
  const name = normalize(body.name);
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  try {
    await ensureTable(sql);
    await sql`
      UPDATE rsvps
      SET name = ${name}, email = ${normalize(body.email)}, phone = ${normalize(body.phone)},
          guests = ${normalize(body.guests)}, attending = ${normalize(body.attending) || "Yes"}
      WHERE id = ${id};
    `;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to update RSVP." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (request.nextUrl.searchParams.get("key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }
  const sql = getSql();
  if (!sql) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }
  try {
    await ensureTable(sql);
    await sql`DELETE FROM rsvps WHERE id = ${id};`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete RSVP." }, { status: 500 });
  }
}
