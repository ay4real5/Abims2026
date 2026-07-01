export const weddingData = {
  couple: {
    bride: "Oyebimpe",
    groom: "Ayorinde",
    shortNames: "Oyebimpe & Ayorinde",
    monogram: "O & A",
  },
  date: {
    ceremony: "2026-08-15T11:00:00",
    display: "August 15, 2026",
  },
  venues: {
    ceremony: {
      name: "RCCG, Breakthrough Church",
      address: "Bolton, BL1 2DD, United Kingdom",
      time: "11:00 AM",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=RCCG+Breakthrough+Church+Bolton+BL1+2DD",
      mapsEmbedQuery: "RCCG Breakthrough Church, Bolton, BL1 2DD",
    },
    reception: {
      name: "M12 — Autheron",
      address: "Manchester, M12, United Kingdom",
      time: "4:00 PM",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=M12+Autheron+Manchester",
      mapsEmbedQuery: "M12 Autheron Manchester",
    },
  },
  contact: {
    email: "hello@abims2026.wedding",
    phone: "+44 1234 567890",
  },
  url: "https://abims2026.vercel.app",
  ogImage: "/og-image.jpg",
} as const;

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const galleryImages = [
  { id: 1, src: u("1519741497674-611481863552"), alt: "Couple at sunset" },
  { id: 2, src: u("1606216794074-735e91aa2c92"), alt: "Beach moment" },
  { id: 3, src: u("1583939003579-730e3918a45a"), alt: "Proposal" },
  { id: 4, src: u("1537633552985-df8429e8048b"), alt: "Laughing together" },
  { id: 5, src: u("1522673607200-164d1b6ce486"), alt: "Holding hands" },
  { id: 6, src: u("1511285560929-80b456fea0bc"), alt: "Engagement" },
  { id: 7, src: u("1465495976277-4387d4b0b4c6"), alt: "Together" },
  { id: 8, src: u("1457089328109-e5d9bd499191"), alt: "Romantic moment" },
  { id: 9, src: u("1519225421980-715cb0215aed"), alt: "Celebration" },
];

export const timeline = [
  {
    day: "Saturday, August 15",
    isWeddingDay: true,
    events: [
      { time: "11:00 AM", title: "Ceremony", location: "RCCG, Breakthrough Church", attire: "Formal", icon: "church" },
      { time: "1:00 PM", title: "Cocktail Hour", location: "Garden Terrace", attire: "Formal", icon: "glass" },
      { time: "4:00 PM", title: "Reception", location: "M12 — Autheron", description: "Dinner, toasts, dancing", attire: "Formal", icon: "dance" },
      { time: "8:00 PM", title: "After Party", location: "M12 — Autheron", attire: "Formal", icon: "music" },
    ],
  },
];

export const accommodations = [
  {
    name: "The Grand Hotel Manchester",
    rating: 5,
    category: "Luxury",
    distance: "0.5 miles from venue",
    description: "Elegant rooms with spa, pool, and fine dining restaurant.",
    bookingLink: "https://www.booking.com",
    image: u("1566073761258-6f860fd3f30c"),
  },
  {
    name: "Boutique Inn Bolton",
    rating: 4,
    category: "Boutique",
    distance: "1.2 miles from venue",
    description: "Charming retreat with complimentary breakfast.",
    bookingLink: "https://www.booking.com",
    image: u("1551882547-ff40c63fe5fa"),
  },
  {
    name: "Comfort Suites",
    rating: 3,
    category: "Budget-Friendly",
    distance: "2.5 miles from venue",
    description: "Clean, comfortable rooms with great value.",
    bookingLink: "https://www.booking.com",
    image: u("1564501049512-0c1b5fa9e0c4"),
  },
];

export const registryLinks = [
  { name: "Amazon", icon: "shopping-bag", url: "https://amazon.com", description: "Home essentials" },
  { name: "Zola", icon: "gift", url: "https://zola.com", description: "Curated collection" },
  { name: "Honeymoon Fund", icon: "plane", url: "https://honeyfund.com", description: "Travel memories" },
];

export const faqs = [
  { q: "What time should I arrive?", a: "Please arrive 30 minutes before the ceremony at 11:00 AM." },
  { q: "What is the dress code?", a: "Formal attire. Touches of gold and ivory are welcome." },
  { q: "Can I bring a plus one?", a: "Plus ones are listed on your personal invitation — check your RSVP." },
  { q: "Is parking available?", a: "Yes, free parking is available at both the church and reception venue." },
  { q: "Are children welcome?", a: "We love your little ones — please indicate them in your RSVP." },
];
