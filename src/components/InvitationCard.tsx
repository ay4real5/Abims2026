import { site } from "@/config/site";

const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/**
 * The invitation itself — luxury printed stationery, not a webpage.
 * (Milestone 3 refines the composition; this sets the stationery language.)
 */
export default function InvitationCard() {
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden px-6 py-10 text-center"
      style={{
        background: "linear-gradient(175deg, #f4ecda 0%, #eee3ca 100%)",
        boxShadow:
          "0 1px 2px rgba(60,44,20,0.35), 0 12px 40px rgba(0,0,0,0.35), inset 0 0 60px rgba(120,95,55,0.08)",
        borderRadius: 6,
      }}
    >
      {/* cotton grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "160px" }}
      />
      {/* hairline gold frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-[4px]"
        style={{ border: "1px solid rgba(143,115,64,0.45)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 rounded-[3px]"
        style={{ border: "1px solid rgba(143,115,64,0.2)" }}
      />

      <p
        className="mt-6 text-[10px] font-light uppercase"
        style={{ letterSpacing: "0.35em", color: "#6b5d4f", fontFamily: "var(--font-sans)" }}
      >
        Together with their families
      </p>

      <div>
        <h1
          className="text-5xl font-medium italic leading-tight"
          style={{ fontFamily: "var(--font-serif)", color: "#4a3d2c" }}
        >
          {site.coupleNames}
        </h1>
        <div className="mx-auto mt-5 h-px w-16" style={{ background: "rgba(143,115,64,0.6)" }} />
        <p
          className="mt-5 text-sm font-light italic"
          style={{ fontFamily: "var(--font-serif)", color: "#6b5d4f" }}
        >
          request the honour of your presence
        </p>
      </div>

      <p
        className="mb-4 text-[11px] font-light uppercase"
        style={{ letterSpacing: "0.3em", color: "#8f7340", fontFamily: "var(--font-sans)" }}
      >
        {site.year}
      </p>
    </div>
  );
}
