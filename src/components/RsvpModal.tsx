"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/config/site";

export type RsvpChoice = "yes" | "no";

const serif = { fontFamily: "var(--font-serif)" };
const sans = { fontFamily: "var(--font-sans)" };

type Props = {
  open: boolean;
  onClose: () => void;
  onChoose: (choice: RsvpChoice) => void;
};

type Step = "ask" | "form" | "done";

const GUEST_OPTIONS = ["Just me", "+1", "3", "4", "5+"];

/**
 * RSVP flow:
 *   ask  → Will you join us?  Yes / No
 *   form → (Yes) name, email, phone, party size  → Send
 *   done → graceful confirmation, with an optional WhatsApp send
 * Nothing auto-redirects; WhatsApp is an explicit tap.
 */
export default function RsvpModal({ open, onClose, onChoose }: Props) {
  const [step, setStep] = useState<Step>("ask");
  const [choice, setChoice] = useState<RsvpChoice>("yes");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(GUEST_OPTIONS[0]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setStep("ask");
      setError("");
    }
  }, [open]);

  const pickNo = () => {
    setChoice("no");
    onChoose("no");
    setStep("done");
  };
  const pickYes = () => {
    setChoice("yes");
    setStep("form");
  };
  const submit = async () => {
    if (!name.trim()) {
      setError("Please tell us your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email so we can confirm your RSVP.");
      return;
    }
    setError("");
    setSubmitting(true);
    if (site.rsvpEndpoint) {
      try {
        const res = await fetch(site.rsvpEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: site.rsvpAccessKey,
            subject: `New RSVP — ${name.trim()}, party of ${guests}`,
            from_name: "Abims 2026 RSVP",
            botcheck: "",
            replyto: email.trim(),
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            attending: "Yes",
            guests,
            autoresponse: `Dear ${name.trim()},\n\nThank you — your RSVP is confirmed! 🥂\n\nWe can't wait to celebrate with you on ${site.dateLine}.\n\nWith love,\n${site.coupleNames}\n${site.hashtag}`,
          }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.success) {
          setSubmitting(false);
          setError("Something went wrong sending your RSVP — please try again in a moment.");
          return;
        }
      } catch {
        setSubmitting(false);
        setError("We couldn't send your RSVP — please check your connection and try again.");
        return;
      }
    }
    onChoose("yes");
    setSubmitting(false);
    setStep("done");
  };
  const field = {
    ...sans,
    background: "#fffdf7",
    color: "#463726",
    border: "1px solid rgba(169,138,82,0.35)",
  } as const;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-5 py-4 sm:px-6 sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <button
            aria-label="Close"
            className="absolute inset-0 cursor-default"
            style={{ background: "rgba(52,42,24,0.45)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="RSVP"
            className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl px-7 pb-8 pt-9 text-center shadow-2xl"
            style={{ background: "linear-gradient(178deg, #f8f2e4 0%, #f1e7d0 100%)" }}
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── ask ── */}
            {step === "ask" && (
              <>
                <p className="text-2xl italic" style={{ ...serif, color: "#4a3d2c" }}>Will you join us?</p>
                <div className="mt-8 flex items-stretch justify-center gap-4">
                  <button onClick={pickYes} className="flex-1 rounded-xl px-4 py-5 transition-transform active:scale-95" style={{ background: "linear-gradient(180deg, #a98a52 0%, #8f7340 100%)", boxShadow: "0 2px 10px rgba(120,90,40,0.35), inset 0 1px 0 rgba(255,240,200,0.4)" }}>
                    <span className="mb-2 block text-xl" aria-hidden style={{ color: "#f8f0dc" }}>♥</span>
                    <span className="block text-[11px] uppercase" style={{ ...sans, letterSpacing: "0.25em", color: "#f8f0dc" }}>Yes</span>
                  </button>
                  <button onClick={pickNo} className="flex-1 rounded-xl px-4 py-5 transition-transform active:scale-95" style={{ border: "1px solid rgba(143,115,64,0.4)" }}>
                    <span className="mb-2 block text-xl" aria-hidden style={{ color: "#8a7a63" }}>✕</span>
                    <span className="block text-[11px] uppercase" style={{ ...sans, letterSpacing: "0.25em", color: "#8a7a63" }}>No</span>
                  </button>
                </div>
                <button onClick={onClose} className="mt-7 text-[10px] font-light uppercase underline-offset-4 hover:underline" style={{ ...sans, letterSpacing: "0.3em", color: "#8a7a63" }}>Cancel</button>
              </>
            )}

            {/* ── form ── */}
            {step === "form" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="text-left">
                <p className="text-center text-2xl italic" style={{ ...serif, color: "#4a3d2c" }}>Joyfully accepting</p>
                <p className="mt-1 text-center text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.3em", color: "#a98a52" }}>A few details</p>

                <input value={name} onChange={(e) => { setName(e.target.value); setError(""); }} autoComplete="name" placeholder="Full name" className="mt-5 w-full rounded-lg px-4 py-3 text-[16px] outline-none focus:ring-2 focus:ring-[#c8a25c]/35" style={field} />
                <input value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} type="email" inputMode="email" autoComplete="email" placeholder="Email (for your confirmation)" className="mt-3 w-full rounded-lg px-4 py-3 text-[16px] outline-none focus:ring-2 focus:ring-[#c8a25c]/35" style={field} />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" placeholder="Phone number (optional)" className="mt-3 w-full rounded-lg px-4 py-3 text-[16px] outline-none focus:ring-2 focus:ring-[#c8a25c]/35" style={field} />

                <p className="mt-5 text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.2em", color: "#8a7a63" }}>How many of you? (including you)</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {GUEST_OPTIONS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGuests(g)}
                      className="rounded-full px-4 py-2 text-[12px] transition-all"
                      style={guests === g
                        ? { ...sans, color: "#f6efe1", background: "linear-gradient(180deg,#b7995c,#8f7340)" }
                        : { ...sans, color: "#8f7340", border: "1px solid rgba(169,138,82,0.4)" }}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                {error && <p className="mt-4 text-[12px] italic" style={{ ...serif, color: "#b4562f" }}>{error}</p>}

                <button onClick={submit} disabled={submitting} className="mt-6 w-full rounded-full py-3.5 text-[12px] uppercase transition-transform active:scale-95 disabled:opacity-70" style={{ ...sans, letterSpacing: "0.3em", color: "#f6efe1", background: "linear-gradient(180deg,#b7995c,#8f7340)", boxShadow: "0 6px 18px rgba(120,90,40,0.25)" }}>
                  {submitting ? "Sending…" : "Send RSVP"}
                </button>
                <button onClick={() => setStep("ask")} className="mt-4 w-full text-[10px] font-light uppercase underline-offset-4 hover:underline" style={{ ...sans, letterSpacing: "0.3em", color: "#8a7a63" }}>Back</button>
              </motion.div>
            )}

            {/* ── done ── */}
            {step === "done" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <p className="text-3xl" aria-hidden style={{ color: "#a98a52" }}>{choice === "yes" ? "♥" : "🤍"}</p>
                <p className="mt-4 text-2xl italic" style={{ ...serif, color: "#4a3d2c" }}>{choice === "yes" ? "Thank you!" : "We'll miss you"}</p>
                <p className="mt-3 text-sm font-light italic leading-relaxed" style={{ ...serif, color: "#6b5d4f" }}>
                  {choice === "yes"
                    ? `Your RSVP is noted${name ? `, ${name.split(" ")[0]}` : ""} — a confirmation email is on its way to you.`
                    : "Thank you for letting us know. You'll be there in spirit."}
                </p>

                {site.rsvpEndpoint && choice === "yes" && (
                  <p className="mt-6 text-[12px] uppercase" style={{ ...sans, letterSpacing: "0.2em", color: "#8f7340" }}>✓ Your RSVP has been recorded</p>
                )}
                <button onClick={onClose} className="mt-6 block w-full text-[10px] font-light uppercase underline-offset-4 hover:underline" style={{ ...sans, letterSpacing: "0.3em", color: "#8a7a63" }}>Done</button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
