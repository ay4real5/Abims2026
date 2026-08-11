import { neon } from "@neondatabase/serverless";

/**
 * Shared Neon access for every /api/rsvp* route — one bootstrap, one admin
 * key, so the seating/email endpoints can't drift from the guest-list table.
 */

export const ADMIN_KEY = process.env.RSVP_ADMIN_KEY || "Abims2026";

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

export async function ensureTable(sql: NonNullable<ReturnType<typeof getSql>>) {
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
  await sql`
    ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS table_number integer;
  `;
  await sql`
    ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS email_sent_at timestamptz;
  `;
}
