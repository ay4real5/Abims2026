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
  /** ISO datetime of the ceremony — drives the live countdown */
  weddingDateISO: "2026-08-15T10:00:00+01:00",

  /** A few short paragraphs; shown under "Our Story". Empty array hides it. */
  story: [
    "We met as friends, and somewhere along the way forever started to make sense.",
    "One evening, beneath a heart of roses, a question was asked — and joyfully answered.",
    "Now we are counting down to the best day of our lives, and we want you there.",
  ],

  ceremony: {
    title: "Ceremony",
    venue: "RCCG Breakthrough Church",
    address: [] as string[],
    time: "10:00 am",
  },
  reception: {
    title: "Reception",
    venue: "Venue to be announced",
    address: [] as string[],
    time: "12:00 noon",
  },
  /** Google Maps share link — "" hides the location link */
  mapsUrl: "",

  dressCode: "Champagne gold & ivory",
  /** His & hers guidance under the dress code. "" hides a line. */
  dressLadies: "Elegant dresses — champagne, gold or ivory tones",
  dressGentlemen: "Suits — a touch of gold is warmly encouraged",

  /** Hour-by-hour day plan. Empty array hides the timeline. */
  timeline: [
    { time: "1:30 pm", what: "Guests arrive" },
    { time: "2:00 pm", what: "Ceremony" },
    { time: "4:00 pm", what: "Photographs" },
    { time: "5:00 pm", what: "Cocktails" },
    { time: "6:00 pm", what: "Reception & dinner" },
    { time: "9:00 pm", what: "Dancing" },
  ],

  /** Gift note; account details optional. Empty giftNote hides the section. */
  giftNote:
    "Your presence is the greatest gift. Should you wish to honour us further, a contribution would be warmly received.",
  /** ✏️ Replace the account number & sort code with the real ones. */
  giftDetails: "Oyewole Oyebimpe  ·  Acct 0000000000  ·  Sort 00-00-00",

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
  },

  /**
   * WhatsApp RSVP. With a number ("2348012345678", no +) the buttons open
   * a chat; left "" they open WhatsApp's share sheet with the message.
   */
  whatsappNumber: "",
  rsvpAcceptMessage: "Joyfully accepting — we will be there! 🥂",
  rsvpDeclineMessage: "So sorry to miss it — celebrating you from afar. 🤍",
  blessingMessage: "A blessing for Oyebimpe & Ayorinde: ",

  hashtag: "#Abims2026",

  /** Shown small in the footer. "" hides it. */
  photographyCredit: "Blancstorystudios",
};
