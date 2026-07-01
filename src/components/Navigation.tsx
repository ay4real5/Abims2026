"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "story", label: "Story" },
  { id: "invited", label: "Invited" },
  { id: "venue", label: "Venue" },
  { id: "celebration", label: "Day" },
  { id: "rsvp", label: "RSVP" },
  { id: "quiz", label: "Quiz" },
  { id: "guestbook", label: "Guestbook" },
  { id: "gallery", label: "Gallery" },
  { id: "faq", label: "FAQ" },
];

export default function Navigation() {
  const [active, setActive] = useState("story");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="group flex items-center gap-2 justify-end"
        >
          <span
            className={`text-xs tracking-widest uppercase transition-all ${
              active === s.id
                ? "text-gold opacity-100"
                : "text-ivory/40 opacity-0 group-hover:opacity-100"
            }`}
          >
            {s.label}
          </span>
          <span
            className={`h-2 w-2 rounded-full transition-all ${
              active === s.id ? "bg-gold scale-125" : "bg-ivory/30 group-hover:bg-gold/60"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
