<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# ⛔ The Neon database is SHARED with another project (TrlNow)

The Vercel Neon resource `neon-camel-clock` backing this site's `rsvps` and
`blessings` tables (in the `public` schema) is also connected to the **trlnow**
Vercel project. On 19 Jul 2026 a TrlNow deploy ran `prisma db push
--accept-data-loss` against `public` and **dropped both wedding tables (23
RSVPs, 8 blessings)**; the data was recovered via Neon point-in-time restore.
TrlNow is schema-isolated since then (it only touches its own `trlnow` schema,
enforced in its repo's `CLAUDE.md`, `src/lib/prisma.ts` and
`scripts/prebuild.js`). TrlNow's orphaned old tables (`User`, `Shipment`, …)
still sit in `public` — leave them alone.

If guest data ever disappears again: check the **trlnow** project's deployment
build logs on Vercel for `prisma db push` drop warnings, then restore in the
Neon console (project via Vercel → Storage → neon-camel-clock → Open in Neon →
branch `main` → Backup & Restore → pick a time just before the wipe). The
free-plan restore window is only hours long — act immediately. RSVPs (not
blessings) can also be rebuilt from the couple's Web3Forms emails via the
admin backdate POST (`/api/rsvp?key=…` with `receivedAt`).
<!-- END:nextjs-agent-rules -->
