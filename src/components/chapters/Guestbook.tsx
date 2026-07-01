"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircleHeart } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ImmersiveSection from "@/components/ImmersiveSection";
import { images } from "@/lib/config";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type Entry = { name: string; message: string; created_at: string };

export default function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState({ name: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase
          .from("guestbook")
          .select("name,message,created_at")
          .order("created_at", { ascending: false })
          .limit(50);
        if (data) setEntries(data as Entry[]);
      } else {
        setEntries(JSON.parse(localStorage.getItem("guestbook") || "[]"));
      }
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setLoading(true);
    const entry: Entry = { ...form, created_at: new Date().toISOString() };

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("guestbook").insert(entry);
      } else {
        const prev = JSON.parse(localStorage.getItem("guestbook") || "[]");
        localStorage.setItem("guestbook", JSON.stringify([entry, ...prev]));
      }
    } catch (err) {
      console.error(err);
    }

    setEntries((p) => [entry, ...p]);
    setForm({ name: "", message: "" });
    setLoading(false);
  };

  return (
    <ImmersiveSection id="guestbook" image={images.guestbook}>
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          chapter="Chapter Six"
          title="Guestbook"
          subtitle="Leave a message, a blessing, or a memory. We'll treasure every word."
        />

        <form onSubmit={submit} className="card-glass rounded-3xl p-6 md:p-8 space-y-4 mb-10">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
            className="gb-input"
            required
          />
          <textarea
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="Your message to the couple…"
            rows={3}
            className="gb-input resize-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-ink font-medium hover:bg-gold-bright transition disabled:opacity-40"
          >
            <Send className="h-4 w-4" /> {loading ? "Sending…" : "Sign Guestbook"}
          </button>
        </form>

        <div className="space-y-4">
          <AnimatePresence>
            {entries.length === 0 && (
              <p className="text-center text-ivory/40">
                Be the first to leave a message.
              </p>
            )}
            {entries.map((entry, i) => (
              <motion.div
                key={entry.created_at + i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-glass rounded-2xl p-5"
              >
                <div className="flex items-center gap-3">
                  <MessageCircleHeart className="h-5 w-5 text-gold shrink-0" />
                  <span className="text-gold font-display text-xl">{entry.name}</span>
                </div>
                <p className="text-ivory/75 mt-2 text-sm leading-relaxed">
                  {entry.message}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        :global(.gb-input) {
          width: 100%;
          background: rgba(247, 241, 227, 0.04);
          border: 1px solid rgba(201, 162, 83, 0.3);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: #f7f1e3;
          outline: none;
        }
        :global(.gb-input:focus) {
          border-color: #c9a253;
        }
        :global(.gb-input::placeholder) {
          color: rgba(247, 241, 227, 0.35);
        }
      `}</style>
    </ImmersiveSection>
  );
}
