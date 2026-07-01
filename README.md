# Oyebimpe &amp; Ayorinde · An Experience, Not an Invitation

A luxury, cinematic wedding website built as a chapter-by-chapter journey rather than a scrolling page. Guests open a link, tap to enter, and move through the story.

**Wedding:** Saturday, 15th August 2026
**Ceremony:** RCCG Breakthrough Church, Bolton, BL1 2DD
**Reception:** M12 — Autheron, Manchester

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4**
- **Framer Motion** — animations & reveals
- **Supabase** — RSVPs, guestbook, gallery (optional)
- **canvas-confetti** — celebration effects
- **Lucide** — icons
- Google Maps embeds · Spotify embed · Open Graph (WhatsApp preview)

## Chapters

1. **Splash** — cinematic entry, "Tap to Enter", personalized welcome
2. **Our Story** — memory timeline, voice-note placeholders, photos
3. **You're Invited** — elegant reveal + live countdown
4. **The Venue** — dual maps, Uber, directions, parking, hotels, weather
5. **The Celebration** — timeline of the day
6. **RSVP** — accept/decline, meal, dietary, plus-one, confetti on accept
7. **Quiz** — "How well do you know us?"
8. **Guestbook** — leave messages
9. **Live Gallery** — guests upload photos
10. **FAQ + Playlist** — accordion + Spotify embed

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Personalized invites

Append a guest name to the URL:

```
http://localhost:3000/?to=ahmed
```

The splash and RSVP greet them by name ("Welcome, Ahmed").

## Configuration

All wedding content lives in [`src/lib/config.ts`](src/lib/config.ts) — names, date,
venues, timeline, schedule, quiz, FAQs, Spotify playlist ID and Open Graph URL.

### Supabase (optional)

Without Supabase the RSVP & guestbook run in **demo mode** (saved to `localStorage`).
To persist data:

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
3. Copy `env.example.txt` to `.env.local` and add your URL + anon key.

### Background music

Drop an MP3 at `public/music/theme.mp3` — it plays softly on entry and toggles
via the floating button.

### WhatsApp preview

Add a `public/og-image.jpg` (1200×630) and set `wedding.url` in the config for a
beautiful link preview.

## Deploy

Deploys cleanly to **Vercel**. Set the same env vars in the Vercel dashboard.
