/**
 * ✏️ EDIT ME — single place for the couple's details.
 * Everything on the invitation reads from here.
 */
export const site = {
  /** Initials pressed into the wax seal */
  initials: ["O", "A"] as const,
  /** Names as they appear on the envelope and card */
  coupleNames: "Oyebimpe & Ayorinde",
  year: "2026",

  /** On the envelope flap, e.g. "Saturday · 15 August · 2026" */
  dateLine: "Saturday · 15 August · 2026",
  /** Spelled out on the card */
  dateWords: "Saturday, the fifteenth of August",
  /** Quiet location line shown under the names on the hero (not the date). */
  place: "Bolton · England",
  /** ISO datetime of the ceremony — drives the live countdown */
  weddingDateISO: "2026-08-15T10:00:00+01:00",

  /**
   * "Our Story" — a scroll-driven, chapter-by-chapter sequence. Each chapter has
   * a Roman numeral, a short title, the narrative lines, and the photo that
   * cross-fades in behind it. Reorder / reword freely; empty array hides it.
   */
  story: [
    {
      numeral: "I",
      chapter: "The Interview",
      lines: "It began as an interview. I was the one asking the questions — and somewhere between her answers, I stopped taking notes.",
      photo: "/photos/a6.jpg",
    },
    {
      numeral: "II",
      chapter: "Friends, First",
      lines: "The interview ended. The conversations didn't. Days became weeks, and the best part of every one of them was her.",
      photo: "/photos/a2.jpg",
    },
    {
      numeral: "III",
      chapter: "The Question That Mattered",
      lines: "I'd asked her a hundred questions. Beneath a heart of roses, I finally asked the only one that ever mattered.",
      photo: "/photos/a1.jpg",
    },
    {
      numeral: "IV",
      chapter: "Forever",
      lines: "She said yes. On the fifteenth of August, before everyone we love, we make it forever.",
      photo: "/photos/a5.jpg",
    },
  ],

  ceremony: {
    title: "Church Ceremony",
    icon: "⛪",
    /** Line-art icon: "church" | "toast" (falls back to the emoji above). */
    kind: "church",
    venue: "RCCG Breakthrough Church",
    address: ["44 St George's Rd, Bolton BL1 2DD"],
    time: "10:00 am",
    /** Precise start — powers the "Add to calendar" download. "" hides that button. */
    startISO: "2026-08-15T10:00:00+01:00",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=RCCG%20Breakthrough%20Church%2C%2044%20St%20George's%20Rd%2C%20Bolton%20BL1%202DD",
  },
  reception: {
    title: "Reception",
    icon: "🥂",
    kind: "toast",
    venue: "Blancstorystudios",
    address: ["M12 6JR"],
    time: "12:00 noon",
    startISO: "2026-08-15T12:00:00+01:00",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Blancstorystudios%2C%20M12%206JR",
  },

  /** The short journey between the two venues — shown as a gold route. "" hides it. */
  travel: {
    from: "Bolton",
    to: "Manchester",
    duration: "≈ 30 min",
    note: "A short journey from the ceremony to the celebration.",
  },

  dressCode: "Champagne gold & ivory",
  /** One line of guidance shown under the two colour swatches. */
  dressNote: "Ladies & gentlemen — dress elegantly, with a touch of champagne gold or ivory.",
  /** Tailored guidance shown beside the ♀ / ♂ symbols. Leave "" to hide a column. */
  dressHer: "Flowing gowns in ivory or champagne gold — graceful, and effortlessly timeless.",
  dressHim: "Sharp suits in cream, tan, navy or black, finished with a touch of champagne gold.",

  /**
   * The order of the day. `time` is optional — leave it "" and only the moment
   * shows (perfect before the timings are locked). Empty array hides the section.
   */
  timeline: [
    { time: "", what: "Guests arrive" },
    { time: "", what: "Ceremony" },
    { time: "", what: "Photographs" },
    { time: "", what: "Cocktails" },
    { time: "", what: "Reception & dinner" },
    { time: "", what: "Dancing" },
  ],

  /** Gift note; account details optional. Empty giftNote hides the section. */
  giftNote:
    "Your presence is the greatest gift. Should you wish to honour us further, a contribution would be warmly received.",
  /** ✏️ Real bank details for gifts. Any field left "" is hidden automatically. */
  gift: {
    accountName: "Oyewole Oyebimpe",
    bank: "" /* e.g. "Monzo Bank" */,
    accountNumber: "0000000000",
    sortCode: "00-00-00",
  },

  /** Questions & answers. Empty array hides the FAQ. */
  faq: [
    { q: "When should I RSVP by?", a: "Kindly reply before the first of August." },
    { q: "Can I bring a plus one?", a: "Please RSVP for every guest named on your invitation." },
    { q: "May I take photos?", a: "Yes — and please share them with our hashtag." },
  ],

  /**
   * 📸 PHOTOS — drop your images into /public/photos and point these at them.
   * Every slot left as "" shows an elegant placeholder, so the site looks
   * designed even before the real photos are added. See public/photos/README.md.
   */
  photos: {
    /** Full-screen opening image behind the names. Portrait works best on phones. */
    hero: "/photos/a5.jpg",
    /** Our Story — one image per story paragraph, shown alongside the text. */
    story: ["/photos/a4.jpg", "/photos/a2.jpg", "/photos/a1.jpg"] as string[],
    /** Full-width image behind the RSVP invitation. */
    rsvp: "/photos/a3.jpg",
    /** Gallery grid. */
    gallery: ["/photos/a1.jpg", "/photos/a2.jpg", "/photos/a3.jpg", "/photos/a4.jpg", "/photos/a5.jpg", "/photos/a6.jpg"] as string[],
    /** Optional poetic caption per gallery image (shown in the carousel). */
    galleryCaptions: ["The Question", "Forever Begins", "With This Ring", "Sealed With a Kiss", "Just Engaged", "My Yes"] as string[],
  },

  /**
   * ✅ Automatic RSVP collection (recommended). Paste a form endpoint here and
   * every RSVP lands in one place you can sort/export — no WhatsApp needed.
   * Easiest: create a free form at https://formspree.io (or web3forms.com),
   * then paste its endpoint URL, e.g. "https://formspree.io/f/xxxxxxx".
   * Left "" → the form falls back to sending details via WhatsApp.
   */
  rsvpEndpoint: "",

  /**
   * WhatsApp fallback. With a number ("2348012345678", no +) the buttons open
   * a chat; left "" they open WhatsApp's share sheet with the message.
   */
  whatsappNumber: "",
  rsvpAcceptMessage: "Joyfully accepting — we will be there! 🥂",
  rsvpDeclineMessage: "So sorry to miss it — celebrating you from afar. 🤍",
  blessingMessage: "A blessing for Oyebimpe & Ayorinde: ",

  hashtag: "#Abims2026",

  /** Shown small in the footer. "" hides it. */
  photographyCredit: "Tobi Dosunmu",

  /**
   * 🎵 Background music — starts when the envelope opens (a tap, so the
   * browser allows sound), loops, with a mute button for guests.
   * Drop an audio file into public/music and point `src` at it.
   * Leave src "" for no music. See public/music/README.md.
   */
  music: {
    src: "/music/dream-about-you.mp3",
    title: "Lloyiso · Dream About You",
  },
};
