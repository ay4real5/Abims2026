# 📸 Your photos go here

Drop your images into this folder (`public/photos/`), then open
`src/config/site.ts` and point the `photos` section at them.

Any slot you leave empty (`""`) shows a tasteful placeholder, so the site
always looks finished — add photos whenever you're ready.

## Suggested files

| Where it shows            | Put it at              | Best shape        |
| ------------------------- | ---------------------- | ----------------- |
| Opening full-screen image | `photos/hero.jpg`      | Portrait (tall)   |
| Our Story (3 images)      | `photos/story-1.jpg` … | Any               |
| Behind the RSVP           | `photos/rsvp.jpg`      | Landscape (wide)  |
| Gallery grid              | `photos/g1.jpg` …      | Any               |

## Then, in `src/config/site.ts`

```ts
photos: {
  hero: "/photos/hero.jpg",
  story: ["/photos/story-1.jpg", "/photos/story-2.jpg", "/photos/story-3.jpg"],
  rsvp: "/photos/rsvp.jpg",
  gallery: ["/photos/g1.jpg", "/photos/g2.jpg", "/photos/g3.jpg"],
},
```

## Tips
- JPG or PNG both work. Aim for images under ~1–2 MB each so the site loads fast.
- Filenames are up to you — just make the paths in `site.ts` match.
- The hero looks most striking with a clear photo of the two of you.
