"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Check, X, Heart } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ImmersiveSection from "@/components/ImmersiveSection";
import { images } from "@/lib/config";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type Status = "accept" | "decline" | null;

function celebrate() {
  const end = Date.now() + 1200;
  const colors = ["#c9a253", "#e7c477", "#f7f1e3"];
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors });
}

export default function Rsvp({ guestName }: { guestName?: string | null }) {
  const [status, setStatus] = useState<Status>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: guestName ?? "",
    email: "",
    guests: "1",
    meal: "Chicken",
    dietary: "",
    message: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) return;
    setLoading(true);

    const payload = { ...form, attending: status === "accept", created_at: new Date().toISOString() };

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("rsvps").insert(payload);
      } else {
        const prev = JSON.parse(localStorage.getItem("rsvps") || "[]");
        localStorage.setItem("rsvps", JSON.stringify([...prev, payload]));
      }
    } catch (err) {
      console.error("RSVP save failed", err);
    }

    setLoading(false);
    setSubmitted(true);
    if (status === "accept") celebrate();
  };

  return (
    <ImmersiveSection id="rsvp" image={images.rsvp}>
      <div className="max-w-2xl mx-auto">
        <SectionHeading
          chapter="Chapter Five"
          title="Will You Join Us?"
          subtitle="Kindly respond by 1st July 2026 so we can celebrate together."
        />

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-glass rounded-3xl p-10 text-center"
            >
              <Heart className="h-12 w-12 text-gold mx-auto fill-gold/30" />
              <h3 className="font-display text-3xl text-gold-gradient mt-4">
                {status === "accept" ? "We can't wait to see you!" : "We'll miss you dearly"}
              </h3>
              <p className="text-ivory/70 mt-3">
                {status === "accept"
                  ? "Your RSVP is confirmed. Get ready to celebrate!"
                  : "Thank you for letting us know. You'll be in our hearts."}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={submit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-glass rounded-3xl p-8 md:p-10 space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setStatus("accept")}
                  className={`flex items-center justify-center gap-2 py-4 rounded-xl border transition ${
                    status === "accept"
                      ? "bg-gold text-ink border-gold"
                      : "border-gold/40 text-ivory/80 hover:border-gold"
                  }`}
                >
                  <Check className="h-5 w-5" /> Joyfully Accept
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("decline")}
                  className={`flex items-center justify-center gap-2 py-4 rounded-xl border transition ${
                    status === "decline"
                      ? "bg-ivory/90 text-ink border-ivory"
                      : "border-gold/40 text-ivory/80 hover:border-gold"
                  }`}
                >
                  <X className="h-5 w-5" /> Regretfully Decline
                </button>
              </div>

              <Field label="Full Name">
                <input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="input"
                  placeholder="Your name"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="input"
                  placeholder="you@email.com"
                />
              </Field>

              {status === "accept" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-5 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Number of Guests">
                      <select
                        value={form.guests}
                        onChange={(e) => update("guests", e.target.value)}
                        className="input"
                      >
                        {["1", "2", "3", "4"].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Meal Choice">
                      <select
                        value={form.meal}
                        onChange={(e) => update("meal", e.target.value)}
                        className="input"
                      >
                        {["Chicken", "Beef", "Fish", "Vegetarian"].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Dietary Restrictions">
                    <input
                      value={form.dietary}
                      onChange={(e) => update("dietary", e.target.value)}
                      className="input"
                      placeholder="Allergies, preferences…"
                    />
                  </Field>
                </motion.div>
              )}

              <Field label="A Note for the Couple (optional)">
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={3}
                  className="input resize-none"
                  placeholder="Share your well wishes…"
                />
              </Field>

              <button
                type="submit"
                disabled={!status || loading}
                className="w-full py-4 rounded-xl bg-gold text-ink font-medium uppercase tracking-[0.2em] text-sm disabled:opacity-40 hover:bg-gold-bright transition"
              >
                {loading ? "Sending…" : "Send RSVP"}
              </button>
              {!isSupabaseConfigured && (
                <p className="text-center text-ivory/40 text-xs">
                  Demo mode — responses saved locally until Supabase is connected.
                </p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          background: rgba(247, 241, 227, 0.04);
          border: 1px solid rgba(201, 162, 83, 0.3);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: #f7f1e3;
          outline: none;
          transition: border-color 0.2s;
        }
        :global(.input:focus) {
          border-color: #c9a253;
        }
        :global(.input::placeholder) {
          color: rgba(247, 241, 227, 0.35);
        }
        :global(.input option) {
          background: #15110b;
        }
      `}</style>
    </ImmersiveSection>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-left">
      <span className="text-ivory/60 text-xs uppercase tracking-[0.2em]">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
