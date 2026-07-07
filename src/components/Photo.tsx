import Image from "next/image";
import { site } from "@/config/site";

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/**
 * A photo slot. When `src` is set it renders an optimised next/image;
 * when empty it renders an elegant champagne placeholder (monogram + grain)
 * so the layout looks art-directed even before real photos are added.
 */
export default function Photo({
  src,
  alt = "",
  sizes,
  priority,
  className = "",
  monogram = true,
  quality = 90,
  position = "center",
}: {
  src?: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  monogram?: boolean;
  quality?: number;
  position?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          quality={quality}
          sizes={sizes ?? "100vw"}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={`relative overflow-hidden ${className}`}
      style={{ background: "linear-gradient(150deg, #efe4cb 0%, #e4d4b2 45%, #d8c39c 100%)" }}
    >
      {/* soft light bloom */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(70% 55% at 50% 38%, rgba(255,250,238,0.65), transparent 70%)" }}
      />
      {/* grain */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: "140px" }} />
      {/* monogram */}
      {monogram && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            style={{
              fontFamily: "var(--font-script), cursive",
              fontSize: "min(34vw, 200px)",
              lineHeight: 1,
              color: "rgba(143,115,64,0.22)",
            }}
          >
            {site.initials[0]}
            <span style={{ fontSize: "0.5em", color: "rgba(143,115,64,0.18)" }}>&amp;</span>
            {site.initials[1]}
          </span>
        </div>
      )}
      {/* thin gold frame */}
      <div className="absolute inset-3 rounded-[2px]" style={{ border: "1px solid rgba(143,115,64,0.3)" }} />
    </div>
  );
}
