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

  /** On the envelope flap, e.g. "Saturday · 5 September · 2026" */
  dateLine: "Saturday · 5 September · 2026",
  /** Spelled out on the card */
  dateWords: "Saturday, the fifth of September",

  ceremony: {
    title: "Ceremony",
    venue: "St. Andrew's Cathedral",
    address: ["1 Cathedral Close", "Lagos"],
    time: "2:00 pm",
  },
  reception: {
    title: "Reception",
    venue: "The Grand Ballroom",
    address: ["15 Marina Road", "Lagos"],
    time: "6:00 pm",
  },
  /** Google Maps share link — "" hides the location link */
  mapsUrl: "",

  dressCode: "Black tie · a touch of gold",

  /**
   * Photos for the gallery (dress code inspiration / the couple).
   * Drop files into /public/gallery and list them here, e.g. "/gallery/1.jpg".
   * Empty list hides the section.
   */
  gallery: [] as string[],

  /**
   * WhatsApp RSVP. With a number ("2348012345678", no +) the buttons open
   * a chat; left "" they open WhatsApp's share sheet with the message.
   */
  whatsappNumber: "",
  rsvpAcceptMessage: "Joyfully accepting — we will be there! 🥂",
  rsvpDeclineMessage: "So sorry to miss it — celebrating you from afar. 🤍",

  hashtag: "#Abims2026",
};
