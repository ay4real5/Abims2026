"use client";

import { useEffect, useState } from "react";

/**
 * Private guest list — visit /rsvps and enter the admin key
 * (RSVP_ADMIN_KEY, default "Abims2026") to see everyone who has RSVP'd.
 * Not linked from the invitation; guests never see this page.
 */

type RsvpRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  attending: string;
  receivedAt: string;
};

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

export default function RsvpsPage() {
  const [key, setKey] = useState("");
  const [entered, setEntered] = useState(false);
  const [rsvps, setRsvps] = useState<RsvpRecord[] | null>(null);
  const [error, setError] = useState("");

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

  const remove = async (r: RsvpRecord) => {
    if (!window.confirm(`Remove the RSVP from ${r.name}?`)) return;
    await fetch(`/api/rsvp?key=${encodeURIComponent(key)}&id=${encodeURIComponent(r.id)}`, {
      method: "DELETE",
    });
    void load(key);
  };

  const totalGuests = (rsvps ?? []).reduce((sum, r) => sum + headcount(r.guests), 0);

  return (
    <main
      className="min-h-screen px-6 py-14"
      style={{ background: "linear-gradient(178deg, #f8f2e4 0%, #efe4c9 100%)" }}
    >
      <div className="mx-auto max-w-3xl">
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
                      <th className="px-4 py-3">Received</th>
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
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#8a7a63" }}>
                          {new Date(r.receivedAt).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
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
      </div>
    </main>
  );
}
