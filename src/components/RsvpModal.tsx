"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/config/site";

export type RsvpChoice = "yes" | "no";

function waLink(message: string) {
  const text = encodeURIComponent(message);
  return site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

const serif = { fontFamily: "var(--font-serif)" };
const sans = { fontFamily: "var(--font-sans)" };

type Props = {
  open: boolean;
  onClose: () => void;
  onChoose: (choice: RsvpChoice) => void;
};

/**
 * "Will you join?" — pick Yes/No, then a graceful in-place confirmation.
 * We never auto-redirect; sending word to the couple on WhatsApp is an
 * optional tap, so it works even before a WhatsApp number is set.
 */
export default function RsvpModal({ open, onClose, onChoose }: Props) {
  const [chosen, setChosen] = useState<RsvpChoice | null>(null);

  // reset to the question each time it opens
  useEffect(() => {
    if (open) setChosen(null);
  }, [open]);

  const pick = (choice: RsvpChoice) => {
    onChoose(choice);
    setChosen(choice);
  };

  const sendWhatsApp = () => {
    if (!chosen) return;
    window.open(
      waLink(chosen === "yes" ? site.rsvpAcceptMessage : site.rsvpDeclineMessage),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <button
            aria-label="Close"
            className="absolute inset-0 cursor-default"
            style={{ background: "rgba(52,42,24,0.4)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="RSVP"
            className="relative w-full max-w-xs rounded-2xl px-8 pb-8 pt-10 text-center shadow-2xl"
            style={{ background: "linear-gradient(178deg, #f8f2e4 0%, #f1e7d0 100%)" }}
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {!chosen ? (
              <>
                <p className="text-2xl italic" style={{ ...serif, color: "#4a3d2c" }}>
                  Will you join us?
                </p>
                <div className="mt-8 flex items-stretch justify-center gap-4">
                  <button
                    onClick={() => pick("yes")}
                    className="flex-1 rounded-xl px-4 py-5 transition-transform active:scale-95"
                    style={{ background: "linear-gradient(180deg, #a98a52 0%, #8f7340 100%)", boxShadow: "0 2px 10px rgba(120,90,40,0.35), inset 0 1px 0 rgba(255,240,200,0.4)" }}
                  >
                    <span className="mb-2 block text-xl" aria-hidden style={{ color: "#f8f0dc" }}>♥</span>
                    <span className="block text-[11px] uppercase" style={{ ...sans, letterSpacing: "0.25em", color: "#f8f0dc" }}>Yes</span>
                  </button>
                  <button
                    onClick={() => pick("no")}
                    className="flex-1 rounded-xl px-4 py-5 transition-transform active:scale-95"
                    style={{ border: "1px solid rgba(143,115,64,0.4)" }}
                  >
                    <span className="mb-2 block text-xl" aria-hidden style={{ color: "#8a7a63" }}>✕</span>
                    <span className="block text-[11px] uppercase" style={{ ...sans, letterSpacing: "0.25em", color: "#8a7a63" }}>No</span>
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="mt-7 text-[10px] font-light uppercase underline-offset-4 hover:underline"
                  style={{ ...sans, letterSpacing: "0.3em", color: "#8a7a63" }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <p className="text-3xl" aria-hidden style={{ color: "#a98a52" }}>
                  {chosen === "yes" ? "♥" : "🤍"}
                </p>
                <p className="mt-4 text-2xl italic" style={{ ...serif, color: "#4a3d2c" }}>
                  {chosen === "yes" ? "Wonderful!" : "We'll miss you"}
                </p>
                <p className="mt-3 text-sm font-light italic leading-relaxed" style={{ ...serif, color: "#6b5d4f" }}>
                  {chosen === "yes"
                    ? "Your reply is noted — we can't wait to celebrate with you."
                    : "Thank you for letting us know. You'll be there in spirit."}
                </p>

                <button
                  onClick={sendWhatsApp}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[11px] uppercase transition-transform active:scale-95"
                  style={{ ...sans, letterSpacing: "0.25em", color: "#f6efe1", background: "linear-gradient(180deg, #55a95b, #3f8c46)" }}
                >
                  Tell them on WhatsApp
                </button>
                <button
                  onClick={onClose}
                  className="mt-4 text-[10px] font-light uppercase underline-offset-4 hover:underline"
                  style={{ ...sans, letterSpacing: "0.3em", color: "#8a7a63" }}
                >
                  Done
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
