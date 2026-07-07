import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/config/site";
import "./globals.css";

const script = localFont({
  src: "../fonts/GreatVibes-Regular.ttf",
  variable: "--font-script",
  weight: "400",
  display: "swap",
});

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

const previewTitle = `${site.coupleNames} Wedding Invitation`;
const previewDescription = `Join us as ${site.coupleNames} celebrate their wedding on ${site.dateLine}.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://abims2026.vercel.app"),
  title: previewTitle,
  description: previewDescription,
  applicationName: previewTitle,
  openGraph: {
    title: previewTitle,
    description: previewDescription,
    url: "https://abims2026.vercel.app",
    siteName: "Abims 2026",
    images: [
      {
        url: site.photos.hero,
        width: 1200,
        height: 1600,
        alt: site.coupleNames,
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: previewTitle,
    description: previewDescription,
    images: [site.photos.hero],
  },
};

export const viewport: Viewport = {
  themeColor: "#efe6d4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${script.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
