import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/config/site";

export const alt = `${site.coupleNames} — Wedding Invitation`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [photo, scriptFont] = await Promise.all([
    readFile(join(process.cwd(), "public", site.photos.hero)),
    readFile(join(process.cwd(), "src", "fonts", "GreatVibes-Regular.ttf")),
  ]);

  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const [first, second] = site.coupleNames.split(" & ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f3ead6",
        }}
      >
        {/* Photo panel */}
        <div
          style={{
            display: "flex",
            width: "44%",
            height: "100%",
            position: "relative",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 140,
              height: "100%",
              background:
                "linear-gradient(90deg, rgba(243,234,214,0), #f3ead6)",
            }}
          />
        </div>

        {/* Invitation panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: "48px 56px",
            background:
              "linear-gradient(145deg, #fff8e8 0%, #f5e7c6 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              border: "2px solid rgba(200,162,92,0.55)",
              borderRadius: 24,
              padding: "40px 32px",
            }}
          >
            <div
              style={{
                fontSize: 22,
                letterSpacing: 12,
                textTransform: "uppercase",
                color: "#8f7340",
                fontFamily: "serif",
              }}
            >
              You&apos;re Invited
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 26,
              }}
            >
              <div
                style={{
                  fontSize: 84,
                  lineHeight: 1.1,
                  color: "#5b4326",
                  fontFamily: "GreatVibes",
                }}
              >
                {first}
              </div>
              <div
                style={{
                  fontSize: 40,
                  color: "#b4564b",
                  fontFamily: "GreatVibes",
                  marginTop: 2,
                }}
              >
                &amp;
              </div>
              <div
                style={{
                  fontSize: 84,
                  lineHeight: 1.1,
                  color: "#5b4326",
                  fontFamily: "GreatVibes",
                  marginTop: 2,
                }}
              >
                {second}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 30,
                width: 260,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(169,138,82,0.55)",
                }}
              />
              <div
                style={{
                  fontSize: 26,
                  color: "#b4564b",
                  margin: "0 14px",
                }}
              >
                ♥
              </div>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(169,138,82,0.55)",
                }}
              />
            </div>

            <div
              style={{
                fontSize: 28,
                letterSpacing: 4,
                color: "#6b5638",
                fontFamily: "serif",
                marginTop: 26,
              }}
            >
              {site.dateLine}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "GreatVibes",
          data: scriptFont,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
