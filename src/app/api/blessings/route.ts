import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

type BlessingRow = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

const MAX_NAME_LENGTH = 60;
const MAX_MESSAGE_LENGTH = 300;
const LIMIT = 50;

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
    CREATE TABLE IF NOT EXISTS blessings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      message text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS blessings_created_at_idx ON blessings (created_at DESC);
  `;
}

function normalize(value: unknown, fallback = "") {
  return String(value ?? fallback).replace(/\s+/g, " ").trim();
}

function serialize(row: BlessingRow) {
  return {
    id: row.id,
    name: row.name,
    message: row.message,
    createdAt: row.created_at,
  };
}

export async function GET() {
  const sql = getSql();
  if (!sql) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  try {
    await ensureTable(sql);
    const rows = await sql`
      SELECT id, name, message, created_at
      FROM blessings
      ORDER BY created_at DESC
      LIMIT ${LIMIT};
    ` as BlessingRow[];
    return NextResponse.json({ blessings: rows.map(serialize) });
  } catch {
    return NextResponse.json({ error: "Unable to load blessings." }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

  const body = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
  const name = normalize(body.name, "A well-wisher").slice(0, MAX_NAME_LENGTH) || "A well-wisher";
  const message = normalize(body.message).slice(0, MAX_MESSAGE_LENGTH);

  if (!message) {
    return NextResponse.json({ error: "Please write a blessing before posting." }, { status: 400 });
  }

  try {
    await ensureTable(sql);
    const rows = await sql`
      INSERT INTO blessings (name, message)
      VALUES (${name}, ${message})
      RETURNING id, name, message, created_at;
    ` as BlessingRow[];
    return NextResponse.json({ blessing: serialize(rows[0]) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save blessing." }, { status: 500 });
  }
}
