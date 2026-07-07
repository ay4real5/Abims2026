# 🎵 Background music

Drop your song file here and the site will play it right after the envelope
opens (looping), with a mute button for guests.

## Steps
1. Get an **MP3** (or M4A/OGG) of **Lloyiso — Dream About You**.
2. Save it in this folder as **`dream-about-you.mp3`**
   (or any name — just match the path below).
3. In `src/config/site.ts`, make sure it points to your file:
   ```ts
   music: {
     src: "/music/dream-about-you.mp3",
     title: "Lloyiso · Dream About You",
   },
   ```

## Notes
- Keep the file reasonably small (a 3–4 min song is usually 3–6 MB).
- To turn music off entirely, set `src: ""`.
- Music only starts after a guest taps to open the envelope — browsers block
  auto-playing sound before any interaction, so this is by design.
