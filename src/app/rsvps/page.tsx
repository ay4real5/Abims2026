"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";

/**
 * Private guest list — visit /rsvps and enter the admin key
 * (RSVP_ADMIN_KEY, default "Abims2026") to see everyone who has RSVP'd.
 * Not linked from the invitation; guests never see this page.
 *
 * Three tabs: Guest List (add/edit/delete replies, as before), Seating
 * (assign each party to one of the 10 tables), and Seating Email (bulk-send
 * guests their table number once seating is finalised).
 */

type RsvpRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  attending: string;
  receivedAt: string;
  tableNumber: number | null;
  emailSentAt: string | null;
};

type SendResult = { ok: boolean; error?: string };

const serif = { fontFamily: "var(--font-serif)" };
const sans = { fontFamily: "var(--font-sans)" };

/** "Just me" → 1, "+1" → 2, "+2" → 3; legacy "3"/"4"/"5+" → n */
function headcount(guests: string): number {
  if (!guests || guests === "Just me") return 1;
  if (guests.startsWith("+")) {
    const extra = parseInt(guests.slice(1), 10);
    return Number.isNaN(extra) ? 1 : 1 + extra;
  }
  const n = parseInt(guests, 10);
  return Number.isNaN(n) ? 1 : n;
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Why a party can't yet receive the seating email, or null if it's eligible. */
function seatingEmailBlocker(r: RsvpRecord): string | null {
  if (!r.email) return "No email on file";
  if (r.tableNumber == null) return "No table assigned yet";
  return null;
}

const emptyForm = { name: "", email: "", phone: "", guests: "Just me", attending: "Yes" };

const pillBase: React.CSSProperties = {
  ...sans,
  letterSpacing: "0.25em",
  fontSize: "10px",
  textTransform: "uppercase",
  padding: "10px 18px",
  borderRadius: "999px",
  border: "1px solid rgba(169,138,82,0.4)",
};
const pillActive: React.CSSProperties = {
  ...pillBase,
  color: "#f6efe1",
  background: "linear-gradient(180deg,#b7995c,#8f7340)",
  border: "1px solid transparent",
};
const pillInactive: React.CSSProperties = {
  ...pillBase,
  color: "#8f7340",
  background: "#fffdf7",
};

export default function RsvpsPage() {
  const [key, setKey] = useState("");
  const [entered, setEntered] = useState(false);
  const [rsvps, setRsvps] = useState<RsvpRecord[] | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"list" | "seating" | "email">("list");

  // Guest List tab state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Seating tab state — local draft of table assignments, synced from rsvps
  // on every load(); nothing is written to the DB until "Save seating".
  const [draftTables, setDraftTables] = useState<Record<string, number | null>>({});
  const [seatingNotice, setSeatingNotice] = useState("");
  const [savingSeating, setSavingSeating] = useState(false);
  const [expandedTable, setExpandedTable] = useState<number | null>(null);

  // Seating Email tab state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState("");
  const [sendResults, setSendResults] = useState<Record<string, SendResult>>({});

  const load = async (k: string) => {
    setError("");
    const res = await fetch(`/api/rsvp?key=${encodeURIComponent(k)}`);
    if (res.status === 401) {
      setError("Wrong key — try again.");
      setEntered(false);
      localStorage.removeItem("rsvpAdminKey");
      return;
    }
    if (!res.ok) {
      setError("Couldn't load the list — please try again shortly.");
      return;
    }
    const data = await res.json();
    setRsvps(data.rsvps as RsvpRecord[]);
    setEntered(true);
    localStorage.setItem("rsvpAdminKey", k);
  };

  useEffect(() => {
    const saved = localStorage.getItem("rsvpAdminKey");
    if (saved) {
      setKey(saved);
      void load(saved);
    }
  }, []);

  // Reset the seating draft to match whatever was last loaded from the DB —
  // runs after every load() (initial, refresh, or post-save reload).
  useEffect(() => {
    if (!rsvps) return;
    const map: Record<string, number | null> = {};
    for (const r of rsvps) map[r.id] = r.tableNumber;
    setDraftTables(map);
    setSeatingNotice("");
  }, [rsvps]);

  const startAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (r: RsvpRecord) => {
    setForm({ name: r.name, email: r.email, phone: r.phone, guests: r.guests || "Just me", attending: r.attending || "Yes" });
    setEditingId(r.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || saving) return;
    setSaving(true);
    setError("");
    const url = editingId
      ? `/api/rsvp?key=${encodeURIComponent(key)}&id=${encodeURIComponent(editingId)}`
      : `/api/rsvp?key=${encodeURIComponent(key)}`;
    const res = await fetch(url, {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Couldn't save — please try again.");
      return;
    }
    cancelForm();
    void load(key);
  };

  const remove = async (r: RsvpRecord) => {
    if (!window.confirm(`Remove the RSVP from ${r.name}?`)) return;
    await fetch(`/api/rsvp?key=${encodeURIComponent(key)}&id=${encodeURIComponent(r.id)}`, {
      method: "DELETE",
    });
    void load(key);
  };

  const totalGuests = (rsvps ?? []).reduce((sum, r) => sum + headcount(r.guests), 0);
  const yesRows = (rsvps ?? []).filter((r) => r.attending === "Yes");

  /* ── Seating ─────────────────────────────────────────────────── */

  const tableOccupancy = () => {
    const occ = new Array(site.seating.tableCount + 1).fill(0);
    for (const r of yesRows) {
      const t = draftTables[r.id];
      if (t) occ[t] += headcount(r.guests);
    }
    return occ;
  };

  const setTableFor = (id: string, tableNumber: number | null) => {
    setDraftTables((prev) => ({ ...prev, [id]: tableNumber }));
  };

  const autoAssign = () => {
    const seats = site.seating.seatsPerTable;
    const tableCount = site.seating.tableCount;
    const occ = tableOccupancy();
    const next = { ...draftTables };
    const unassigned = yesRows
      .filter((r) => !next[r.id])
      .sort((a, b) => headcount(b.guests) - headcount(a.guests));
    const unseated: string[] = [];
    for (const r of unassigned) {
      const h = headcount(r.guests);
      let placed = false;
      for (let t = 1; t <= tableCount; t++) {
        if (occ[t] + h <= seats) {
          next[r.id] = t;
          occ[t] += h;
          placed = true;
          break;
        }
      }
      if (!placed) unseated.push(r.name);
    }
    setDraftTables(next);
    setSeatingNotice(unseated.length ? `Couldn't seat: ${unseated.join(", ")} — free up space and retry.` : "");
  };

  const hasUnsavedSeating = yesRows.some((r) => (draftTables[r.id] ?? null) !== r.tableNumber);

  const saveSeating = async () => {
    setSavingSeating(true);
    setError("");
    const assignments = yesRows.map((r) => ({ id: r.id, tableNumber: draftTables[r.id] ?? null }));
    const res = await fetch(`/api/rsvp/tables?key=${encodeURIComponent(key)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignments }),
    });
    setSavingSeating(false);
    if (!res.ok) {
      setError("Couldn't save seating — please try again.");
      return;
    }
    void load(key);
  };

  /* ── Seating email ───────────────────────────────────────────── */

  const eligible = yesRows.filter((r) => !seatingEmailBlocker(r));

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => (prev.size === eligible.length ? new Set() : new Set(eligible.map((r) => r.id))));
  };

  const sendSeatingEmails = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0 || sending) return;
    setSending(true);
    setSendResults({});
    const chunkSize = 10;
    const all: Record<string, SendResult> = {};
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);
      setSendProgress(`Sending… ${i}/${ids.length}`);
      try {
        const res = await fetch(`/api/rsvp/seating-email?key=${encodeURIComponent(key)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: chunk }),
        });
        const data = await res.json().catch(() => null);
        for (const r of data?.results ?? []) {
          all[r.id] = { ok: r.ok, error: r.error };
        }
      } catch {
        for (const id of chunk) all[id] = { ok: false, error: "Network error." };
      }
      setSendResults({ ...all });
    }
    setSendProgress(`Done — ${ids.length} processed.`);
    setSending(false);
    void load(key);
  };

  const fieldStyle = { ...sans, background: "#f8f2e4", color: "#463726", border: "1px solid rgba(169,138,82,0.35)" };

  return (
    <main
      className="min-h-screen px-6 py-14"
      style={{ background: "linear-gradient(178deg, #f8f2e4 0%, #efe4c9 100%)" }}
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-[11px] uppercase" style={{ ...sans, letterSpacing: "0.35em", color: "#a98a52" }}>
          Oyebimpe &amp; Ayorinde
        </p>
        <h1 className="mt-2 text-center text-3xl italic" style={{ ...serif, color: "#4a3d2c" }}>
          Guest List
        </h1>

        {!entered ? (
          <form
            className="mx-auto mt-10 max-w-xs text-center"
            onSubmit={(e) => {
              e.preventDefault();
              void load(key);
            }}
          >
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Admin key"
              className="w-full rounded-lg px-4 py-3 text-center text-[15px] outline-none"
              style={{ ...sans, background: "#fffdf7", color: "#463726", border: "1px solid rgba(169,138,82,0.35)" }}
            />
            {error && (
              <p className="mt-3 text-[12px] italic" style={{ ...serif, color: "#b4562f" }}>{error}</p>
            )}
            <button
              type="submit"
              className="mt-4 w-full rounded-full py-3 text-[12px] uppercase"
              style={{ ...sans, letterSpacing: "0.3em", color: "#f6efe1", background: "linear-gradient(180deg,#b7995c,#8f7340)" }}
            >
              View RSVPs
            </button>
          </form>
        ) : rsvps === null ? (
          <p className="mt-10 text-center italic" style={{ ...serif, color: "#8a7a63" }}>Loading…</p>
        ) : (
          <>
            <p className="mt-3 text-center text-sm italic" style={{ ...serif, color: "#6b5d4f" }}>
              {rsvps.length} {rsvps.length === 1 ? "reply" : "replies"} · about {totalGuests}{" "}
              {totalGuests === 1 ? "guest" : "guests"} expected
            </p>
            {error && (
              <p className="mt-2 text-center text-[12px] italic" style={{ ...serif, color: "#b4562f" }}>{error}</p>
            )}

            <div className="mt-6 flex justify-center gap-2">
              <button onClick={() => setTab("list")} style={tab === "list" ? pillActive : pillInactive}>
                Guest List
              </button>
              <button onClick={() => setTab("seating")} style={tab === "seating" ? pillActive : pillInactive}>
                Seating
              </button>
              <button onClick={() => setTab("email")} style={tab === "email" ? pillActive : pillInactive}>
                Seating Email
              </button>
            </div>

            {tab === "list" && (
              <>
                {!showForm && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={startAdd}
                      className="rounded-full px-6 py-2.5 text-[11px] uppercase"
                      style={{ ...sans, letterSpacing: "0.3em", color: "#f6efe1", background: "linear-gradient(180deg,#b7995c,#8f7340)" }}
                    >
                      + Add guest
                    </button>
                    <p className="mt-2 text-[11px] italic" style={{ ...serif, color: "#8a7a63" }}>
                      For guests who replied by phone or in person instead of the invitation.
                    </p>
                  </div>
                )}

                {showForm && (
                  <form
                    onSubmit={submitForm}
                    className="mx-auto mt-6 max-w-md rounded-2xl p-5 shadow-lg"
                    style={{ background: "#fffdf7", border: "1px solid rgba(169,138,82,0.25)" }}
                  >
                    <p className="text-center text-[11px] uppercase" style={{ ...sans, letterSpacing: "0.25em", color: "#8f7340" }}>
                      {editingId ? "Edit reply" : "Add a reply manually"}
                    </p>
                    <div className="mt-4 grid gap-3">
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Guest name (required)"
                        required
                        className="w-full rounded-lg px-4 py-2.5 text-[14px] outline-none"
                        style={fieldStyle}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={form.guests}
                          onChange={(e) => setForm({ ...form, guests: e.target.value })}
                          className="w-full rounded-lg px-3 py-2.5 text-[14px] outline-none"
                          style={fieldStyle}
                        >
                          <option value="Just me">Just me</option>
                          <option value="+1">+1</option>
                          <option value="+2">+2</option>
                        </select>
                        <select
                          value={form.attending}
                          onChange={(e) => setForm({ ...form, attending: e.target.value })}
                          className="w-full rounded-lg px-3 py-2.5 text-[14px] outline-none"
                          style={fieldStyle}
                        >
                          <option value="Yes">Attending</option>
                          <option value="No">Not attending</option>
                        </select>
                      </div>
                      <input
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Email (optional)"
                        type="email"
                        className="w-full rounded-lg px-4 py-2.5 text-[14px] outline-none"
                        style={fieldStyle}
                      />
                      <input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Phone (optional)"
                        className="w-full rounded-lg px-4 py-2.5 text-[14px] outline-none"
                        style={fieldStyle}
                      />
                    </div>
                    <div className="mt-4 flex justify-center gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-full px-6 py-2.5 text-[11px] uppercase"
                        style={{ ...sans, letterSpacing: "0.3em", color: "#f6efe1", background: "linear-gradient(180deg,#b7995c,#8f7340)", opacity: saving ? 0.6 : 1 }}
                      >
                        {saving ? "Saving…" : editingId ? "Save changes" : "Add to list"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelForm}
                        className="rounded-full px-6 py-2.5 text-[11px] uppercase"
                        style={{ ...sans, letterSpacing: "0.3em", color: "#8f7340", border: "1px solid rgba(169,138,82,0.4)" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {rsvps.length === 0 ? (
                  <p className="mt-12 text-center italic" style={{ ...serif, color: "#8a7a63" }}>
                    No RSVPs yet — they&apos;ll appear here the moment someone replies.
                  </p>
                ) : (
                  <div className="mt-8 overflow-x-auto rounded-2xl shadow-lg" style={{ background: "#fffdf7" }}>
                    <table className="w-full text-left text-[13px]" style={{ ...sans, color: "#463726" }}>
                      <thead>
                        <tr className="text-[10px] uppercase" style={{ letterSpacing: "0.2em", color: "#8f7340" }}>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Guests</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Phone</th>
                          <th className="px-4 py-3">Table</th>
                          <th className="px-4 py-3">Received</th>
                          <th className="px-2 py-3" aria-label="Edit" />
                          <th className="px-2 py-3" aria-label="Remove" />
                        </tr>
                      </thead>
                      <tbody>
                        {rsvps.map((r) => (
                          <tr key={r.id} style={{ borderTop: "1px solid rgba(169,138,82,0.2)" }}>
                            <td className="px-4 py-3 font-medium">{r.name}</td>
                            <td className="px-4 py-3">{r.guests || "—"}</td>
                            <td className="px-4 py-3">{r.email || "—"}</td>
                            <td className="px-4 py-3">{r.phone || "—"}</td>
                            <td className="px-4 py-3">{r.tableNumber ?? "—"}</td>
                            <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#8a7a63" }}>
                              {formatWhen(r.receivedAt)}
                            </td>
                            <td className="px-2 py-3">
                              <button
                                onClick={() => startEdit(r)}
                                aria-label={`Edit ${r.name}`}
                                title="Edit this reply"
                                className="px-1 text-[13px]"
                                style={{ color: "#8f7340" }}
                              >
                                ✎
                              </button>
                            </td>
                            <td className="px-2 py-3">
                              <button
                                onClick={() => void remove(r)}
                                aria-label={`Remove ${r.name}`}
                                title="Remove this reply"
                                className="px-1 text-[13px]"
                                style={{ color: "#b4562f" }}
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-6 flex justify-center gap-6">
                  <a
                    href={`/api/rsvp?key=${encodeURIComponent(key)}&format=csv`}
                    className="text-[10px] uppercase underline-offset-4 hover:underline"
                    style={{ ...sans, letterSpacing: "0.25em", color: "#8f7340" }}
                  >
                    Download CSV
                  </a>
                  <button
                    onClick={() => void load(key)}
                    className="text-[10px] uppercase underline-offset-4 hover:underline"
                    style={{ ...sans, letterSpacing: "0.25em", color: "#8f7340" }}
                  >
                    Refresh
                  </button>
                </div>
              </>
            )}

            {tab === "seating" && (
              <div className="mt-8">
                {yesRows.length === 0 ? (
                  <p className="mt-4 text-center italic" style={{ ...serif, color: "#8a7a63" }}>
                    No attending guests yet — seating will appear here once RSVPs come in.
                  </p>
                ) : (
                  <>
                    <p className="text-center text-[11px] italic" style={{ ...serif, color: "#8a7a63" }}>
                      Tap a table to see who&apos;s seated there.
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                      {Array.from({ length: site.seating.tableCount }, (_, i) => i + 1).map((t) => {
                        const occ = tableOccupancy()[t];
                        const over = occ > site.seating.seatsPerTable;
                        const active = expandedTable === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setExpandedTable(active ? null : t)}
                            className="rounded-xl p-3 text-center transition"
                            style={{
                              background: over
                                ? "rgba(180,86,47,0.12)"
                                : `rgba(183,153,92,${0.08 + 0.5 * Math.min(1, occ / site.seating.seatsPerTable)})`,
                              border: `1px solid ${over ? "#b4562f" : active ? "#8f7340" : "rgba(169,138,82,0.4)"}`,
                              boxShadow: active ? "0 0 0 2px rgba(143,115,64,0.35)" : "none",
                              cursor: "pointer",
                            }}
                          >
                            <p className="text-[11px] uppercase" style={{ ...sans, letterSpacing: "0.2em", color: over ? "#b4562f" : "#8f7340" }}>
                              Table {t}
                            </p>
                            <p className="mt-1 text-[15px] font-medium" style={{ ...serif, color: "#4a3d2c" }}>
                              {occ}/{site.seating.seatsPerTable}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {expandedTable !== null && (
                      <div className="mx-auto mt-4 max-w-md rounded-2xl p-4 shadow-lg" style={{ background: "#fffdf7", border: "1px solid rgba(169,138,82,0.25)" }}>
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] uppercase" style={{ ...sans, letterSpacing: "0.2em", color: "#8f7340" }}>
                            Table {expandedTable} — {tableOccupancy()[expandedTable]}/{site.seating.seatsPerTable} seated
                          </p>
                          <button
                            onClick={() => setExpandedTable(null)}
                            aria-label="Close"
                            className="text-[13px]"
                            style={{ color: "#8f7340" }}
                          >
                            ✕
                          </button>
                        </div>
                        {yesRows.filter((r) => draftTables[r.id] === expandedTable).length === 0 ? (
                          <p className="mt-3 text-center text-[12px] italic" style={{ ...serif, color: "#8a7a63" }}>
                            No one seated here yet.
                          </p>
                        ) : (
                          <ul className="mt-3 grid gap-2">
                            {yesRows
                              .filter((r) => draftTables[r.id] === expandedTable)
                              .map((r) => (
                                <li key={r.id} className="flex items-center justify-between gap-3 text-[13px]" style={{ ...sans, color: "#463726" }}>
                                  <span>{r.name} <span style={{ color: "#8a7a63" }}>· {r.guests || "Just me"} · {headcount(r.guests)}</span></span>
                                  <button
                                    onClick={() => setTableFor(r.id, null)}
                                    aria-label={`Unseat ${r.name}`}
                                    title="Move back to unassigned"
                                    className="text-[12px]"
                                    style={{ color: "#b4562f" }}
                                  >
                                    ✕
                                  </button>
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {seatingNotice && (
                      <p className="mt-4 text-center text-[12px] italic" style={{ ...serif, color: "#b4562f" }}>
                        {seatingNotice}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                      <button
                        onClick={autoAssign}
                        className="rounded-full px-6 py-2.5 text-[11px] uppercase"
                        style={{ ...sans, letterSpacing: "0.3em", color: "#f6efe1", background: "linear-gradient(180deg,#b7995c,#8f7340)" }}
                      >
                        Auto-assign unseated
                      </button>
                      <button
                        onClick={() => void saveSeating()}
                        disabled={!hasUnsavedSeating || savingSeating}
                        className="rounded-full px-6 py-2.5 text-[11px] uppercase"
                        style={{ ...sans, letterSpacing: "0.3em", color: "#8f7340", border: "1px solid rgba(169,138,82,0.4)", opacity: !hasUnsavedSeating || savingSeating ? 0.5 : 1 }}
                      >
                        {savingSeating ? "Saving…" : "Save seating"}
                      </button>
                      <button
                        onClick={() => void load(key)}
                        className="rounded-full px-6 py-2.5 text-[11px] uppercase"
                        style={{ ...sans, letterSpacing: "0.3em", color: "#8f7340", border: "1px solid rgba(169,138,82,0.4)" }}
                      >
                        Reset to saved
                      </button>
                    </div>
                    {hasUnsavedSeating && (
                      <p className="mt-2 text-center text-[11px] italic" style={{ ...serif, color: "#8a7a63" }}>
                        You have unsaved seating changes.
                      </p>
                    )}

                    <div className="mt-6 overflow-x-auto rounded-2xl shadow-lg" style={{ background: "#fffdf7" }}>
                      <table className="w-full text-left text-[13px]" style={{ ...sans, color: "#463726" }}>
                        <thead>
                          <tr className="text-[10px] uppercase" style={{ letterSpacing: "0.2em", color: "#8f7340" }}>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Party</th>
                            <th className="px-4 py-3">Table</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yesRows.map((r) => (
                            <tr key={r.id} style={{ borderTop: "1px solid rgba(169,138,82,0.2)" }}>
                              <td className="px-4 py-3 font-medium">{r.name}</td>
                              <td className="px-4 py-3">{r.guests || "Just me"} · {headcount(r.guests)}</td>
                              <td className="px-4 py-3">
                                <select
                                  value={draftTables[r.id] ?? ""}
                                  onChange={(e) => setTableFor(r.id, e.target.value === "" ? null : Number(e.target.value))}
                                  className="rounded-lg px-3 py-1.5 text-[13px] outline-none"
                                  style={fieldStyle}
                                >
                                  <option value="">Unassigned</option>
                                  {Array.from({ length: site.seating.tableCount }, (_, i) => i + 1).map((t) => (
                                    <option key={t} value={t}>Table {t}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}

            {tab === "email" && (
              <div className="mt-8">
                {yesRows.length === 0 ? (
                  <p className="mt-4 text-center italic" style={{ ...serif, color: "#8a7a63" }}>
                    No attending guests yet.
                  </p>
                ) : (
                  <>
                    <p className="text-center text-[12px] italic" style={{ ...serif, color: "#6b5d4f" }}>
                      {eligible.length} of {yesRows.length} attending {yesRows.length === 1 ? "party" : "parties"} ready to email
                      (has an address on file and a saved table).
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={toggleSelectAll}
                        disabled={eligible.length === 0}
                        className="rounded-full px-6 py-2.5 text-[11px] uppercase"
                        style={{ ...sans, letterSpacing: "0.3em", color: "#8f7340", border: "1px solid rgba(169,138,82,0.4)", opacity: eligible.length === 0 ? 0.5 : 1 }}
                      >
                        {selected.size === eligible.length && eligible.length > 0 ? "Deselect all" : "Select all eligible"}
                      </button>
                      <button
                        onClick={() => void sendSeatingEmails()}
                        disabled={selected.size === 0 || sending}
                        className="rounded-full px-6 py-2.5 text-[11px] uppercase"
                        style={{ ...sans, letterSpacing: "0.3em", color: "#f6efe1", background: "linear-gradient(180deg,#b7995c,#8f7340)", opacity: selected.size === 0 || sending ? 0.5 : 1 }}
                      >
                        {sending ? "Sending…" : `Send seating email to ${selected.size}`}
                      </button>
                    </div>
                    {sendProgress && (
                      <p className="mt-2 text-center text-[11px] italic" style={{ ...serif, color: "#8a7a63" }}>
                        {sendProgress}
                      </p>
                    )}

                    <div className="mt-6 overflow-x-auto rounded-2xl shadow-lg" style={{ background: "#fffdf7" }}>
                      <table className="w-full text-left text-[13px]" style={{ ...sans, color: "#463726" }}>
                        <thead>
                          <tr className="text-[10px] uppercase" style={{ letterSpacing: "0.2em", color: "#8f7340" }}>
                            <th className="px-2 py-3">
                              <input
                                type="checkbox"
                                checked={selected.size === eligible.length && eligible.length > 0}
                                onChange={toggleSelectAll}
                                disabled={eligible.length === 0}
                              />
                            </th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Table</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yesRows.map((r) => {
                            const blocker = seatingEmailBlocker(r);
                            const result = sendResults[r.id];
                            return (
                              <tr key={r.id} style={{ borderTop: "1px solid rgba(169,138,82,0.2)", opacity: blocker ? 0.5 : 1 }}>
                                <td className="px-2 py-3">
                                  <input
                                    type="checkbox"
                                    checked={selected.has(r.id)}
                                    disabled={!!blocker}
                                    onChange={() => toggleSelected(r.id)}
                                  />
                                </td>
                                <td className="px-4 py-3 font-medium">{r.name}</td>
                                <td className="px-4 py-3">{r.email || "—"}</td>
                                <td className="px-4 py-3">{r.tableNumber ?? "—"}</td>
                                <td className="px-4 py-3 text-[12px]" style={{ color: result && !result.ok ? "#b4562f" : "#8a7a63" }}>
                                  {blocker
                                    ? blocker
                                    : result
                                    ? result.ok
                                      ? "Just sent"
                                      : result.error || "Failed"
                                    : r.emailSentAt
                                    ? `Sent ${formatWhen(r.emailSentAt)}`
                                    : "Not sent"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
