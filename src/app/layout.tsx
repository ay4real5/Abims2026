import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const script = localFont({
  src: "../fonts/GreatVibes-Regular.ttf",
  variable: "--font-script",
  weight: "400",
});

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "Abims · 2026",
  description: "A private invitation.",
};

export const viewport: Viewport = {
  themeColor: "#efe6d4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
