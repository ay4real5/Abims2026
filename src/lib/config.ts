// Central wedding configuration — edit these values to personalize the site.

export const wedding = {
  bride: "Oyebimpe",
  groom: "Ayorinde",
  hashtag: "#AbimsForever2026",
  // ISO date for the wedding day (local UK time)
  date: "2026-08-15T11:00:00",
  dateLabel: "Saturday, 15th August 2026",

  ceremony: {
    name: "RCCG, Breakthrough Church",
    address: "Bolton, BL1 2DD, United Kingdom",
    time: "11:00 AM",
    mapsQuery: "RCCG Breakthrough Church, Bolton, BL1 2DD",
  },

  reception: {
    name: "M12 — Autheron",
    address: "Manchester, M12 (venue address TBC)",
    time: "4:00 PM",
    mapsQuery: "M12 Autheron Manchester",
  },

  // Placeholder content — swap with real photos/voice notes later
  dressCode: "Formal / Black Tie — Touches of Gold & Ivory welcome",
  spotifyPlaylistId: "37i9dQZF1DX9wa6XirBPv8", // placeholder wedding playlist
  // Open Graph / WhatsApp preview
  url: "https://abims2026.vercel.app",
  ogImage: "/og-image.jpg",
} as const;

export type Wedding = typeof wedding;

// Full-bleed background photography for the immersive layout.
// Swap these URLs with your own photos (place files in /public and use "/photo.jpg").
const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2000&q=80`;

export const images = {
  hero: u("1519741497674-611481863552"),
  story: u("1511285560929-80b456fea0bc"),
  invited: u("1465495976277-4387d4b0b4c6"),
  venue: u("1438232992991-995b7058bbb3"),
  celebration: u("1464366400600-7168b8af9bc3"),
  rsvp: u("1519225421980-715cb0215aed"),
  quiz: u("1522673607200-164d1b6ce486"),
  guestbook: u("1525258946800-98cfd641d0de"),
  gallery: u("1469371670807-013ccf25f16a"),
  faq: u("1457089328109-e5d9bd499191"),
  footer: u("1513278974582-3e1b4a4fa21e"),
  // Story chapter photo strip
  storyGrid: [
    u("1519741497674-611481863552"),
    u("1511285560929-80b456fea0bc"),
    u("1469371670807-013ccf25f16a"),
    u("1522673607200-164d1b6ce486"),
  ],
} as const;

// Our story timeline — placeholder milestones
export const timeline = [
  { year: "2019", title: "We Met", text: "Two paths crossed and nothing was ever the same again." },
  { year: "2021", title: "First Trip", text: "Our first adventure together — and the start of forever." },
  { year: "2023", title: "Moved In", text: "We built a home, one shared memory at a time." },
  { year: "2025", title: "The Proposal", text: "On one knee, with a question only love could answer." },
  { year: "2026", title: "The Wedding", text: "And so the next chapter begins — with you beside us." },
];

// Wedding-day schedule — placeholders
export const schedule = [
  { time: "11:00 AM", title: "Ceremony", text: "The vows. The rings. The beginning.", icon: "church" },
  { time: "1:00 PM", title: "Cocktails", text: "Toasts, canapés and golden-hour photos.", icon: "glass" },
  { time: "4:00 PM", title: "Reception", text: "Dinner, speeches and the first dance.", icon: "utensils" },
  { time: "8:00 PM", title: "After Party", text: "Dance the night away with us.", icon: "music" },
];

// Quiz — "How well do you know us?" placeholders
export const quiz = [
  {
    q: "Where did we have our first date?",
    options: ["A rooftop café", "The cinema", "A beach walk", "A book shop"],
    answer: 0,
  },
  {
    q: "Who said 'I love you' first?",
    options: ["Oyebimpe", "Ayorinde", "We said it together", "Neither remembers"],
    answer: 1,
  },
  {
    q: "What's our favourite thing to do together?",
    options: ["Travel", "Cook", "Movie nights", "All of the above"],
    answer: 3,
  },
];

export const faqs = [
  { q: "What time should I arrive?", a: "Please arrive 30 minutes before the ceremony at 11:00 AM." },
  { q: "What is the dress code?", a: "Formal / Black Tie with touches of gold and ivory." },
  { q: "Can I bring a plus one?", a: "Plus ones are listed on your personal invitation — check your RSVP." },
  { q: "Is parking available?", a: "Yes, free parking is available at both the church and reception venue." },
  { q: "Are children welcome?", a: "We love your little ones — please indicate them in your RSVP." },
];
