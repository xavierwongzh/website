import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SITE_URL } from "@/lib/siteMetadata";
import "./aquarium.css";

const title = "The Pond | Xavier Wong";
const description =
  "A pond drawn entirely in ASCII characters. A whale shark, hammerheads, a manta, a stingray, a sea turtle, dolphins and sardine schools swim past lotus pads, and the jellyfish glow at night. It follows the seasons and freezes over in winter.";
// a midday shot of the tank, shown when the /pond link is shared
const image = { url: "/pond-og.png", width: 1200, height: 630, alt: "The Pond: a whale shark, a hammerhead, a manta and a sea turtle drawn in ASCII characters" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/pond",
    siteName: "Xavier Wong Portfolio",
    title,
    description,
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image.url],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b2a33",
};

// A fun side page with its own root layout, kept apart from Koi Valley and the classic site.
export default function AquariumLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
