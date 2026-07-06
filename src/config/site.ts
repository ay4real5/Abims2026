/**
 * ✏️ EDIT ME — single place for the couple's details.
 * Everything on the invitation reads from here.
 * Entries left as placeholders render sensibly until filled in.
 */
export const site = {
  /** Initials pressed into the wax seal */
  initials: ["A", "B"] as const,
  /** Names as they appear on the card, e.g. "Abimbola & Bolanle" */
  coupleNames: "A & B",
  year: "2026",

  /** e.g. "Saturday, the fifth of September" */
  dateWords: "Saturday, the fifth of September",
  /** short form under the schedule, e.g. "05 · 09 · 2026" */
  dateShort: "05 · 09 · 2026",

  venue: "Venue to be announced",
  city: "",
  /** Google Maps share link — leave "" to hide the location button */
  mapsUrl: "",

  schedule: [
    { time: "2:00 pm", what: "Ceremony" },
    { time: "5:00 pm", what: "Cocktails" },
    { time: "7:00 pm", what: "Reception" },
  ],

  dressCode: "Black tie · a touch of gold",

  /**
   * WhatsApp RSVP. With a number ("2348012345678", no +) the button opens
   * a chat; left "" it opens WhatsApp's share sheet with the message.
   */
  whatsappNumber: "",
  rsvpMessage: "Joyfully accepting — we will be there! 🥂",

  hashtag: "#Abims2026",
};
