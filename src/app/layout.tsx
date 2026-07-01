import type { Metadata, Viewport } from "next";
import { Montserrat, Great_Vibes, Crimson_Text } from "next/font/google";
import "./globals.css";
import { weddingData } from "@/lib/wedding-data";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const crimsonText = Crimson_Text({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const { couple, date } = weddingData;
const title = `${couple.shortNames} | Wedding Invitation`;
const description = `Join us in celebrating our special day on ${date.display}. RSVP now!`;

export const metadata: Metadata = {
  metadataBase: new URL(weddingData.url),
  title,
  description,
  openGraph: {
    type: "website",
    url: weddingData.url,
    title: `${couple.shortNames} are getting married!`,
    description,
    images: [{
      url: weddingData.ogImage,
      width: 1200,
      height: 630,
      alt: `${couple.shortNames} Wedding Invitation`,
    }],
    siteName: `${couple.shortNames} Wedding`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${couple.shortNames} are getting married!`,
    description,
    images: [weddingData.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF6EC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${greatVibes.variable} ${crimsonText.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
