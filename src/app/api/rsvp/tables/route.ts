import { NextRequest, NextResponse } from "next/server";
import { ADMIN_KEY, ensureTable, getSql } from "@/lib/rsvp-db";
import { site } from "@/config/site";

/**
 * Bulk table-seating assignment for the /rsvps admin page's Seating tab.
 * PUT (?key=ADMIN_KEY): body { assignments: [{ id, tableNumber }, ...] }.
 * Writes ONLY table_number per row (never name/email/etc), unlike the
 * full-row PATCH on the sibling ../route.ts.
 */

type Assignment = { id: string; tableNumber: number | null };

function isValidAssignment(v: unknown): v is Assignment {
  if (!v || typeof v !== "object") return false;
  const a = v as Record<string, unknown>;
  if (typeof a.id !== "string" || !a.id) return false;
  if (a.tableNumber === null) return true;
  return (
    typeof a.tableNumber === "number" &&
    Number.isInteger(a.tableNumber) &&
    a.tableNumber >= 1 &&
    a.tableNumber <= site.seating.tableCount
  );
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

export async function PUT(request: NextRequest) {
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
  const assignments = Array.isArray(body.assignments) ? body.assignments : null;
  if (!assignments) {
    return NextResponse.json({ error: "assignments array is required." }, { status: 400 });
  }

  try {
    await ensureTable(sql);
  } catch {
    return NextResponse.json({ error: "Unable to prepare table." }, { status: 500 });
  }

  const results = await withConcurrency(assignments, 8, async (raw): Promise<{ id: string; ok: boolean; error?: string }> => {
    if (!isValidAssignment(raw)) {
      const id = raw && typeof raw === "object" && typeof (raw as Record<string, unknown>).id === "string"
        ? ((raw as Record<string, unknown>).id as string)
        : "unknown";
      return { id, ok: false, error: "Invalid id or table number." };
    }
    try {
      await sql`UPDATE rsvps SET table_number = ${raw.tableNumber} WHERE id = ${raw.id};`;
      return { id: raw.id, ok: true };
    } catch {
      return { id: raw.id, ok: false, error: "Update failed." };
    }
  });

  return NextResponse.json({ ok: true, results });
}
