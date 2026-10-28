import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SITE_URL } from "@/lib/siteMetadata";
import "./forest.css";

const title = "The Forest | Xavier Wong";
const description =
  "A misty wood behind Koi Valley where a stag, a doe, a fox, an owl and rabbits wander as spirits made of light. Tap a spirit and it scatters into motes, tap the ground and flowers grow. It follows the time of day and the seasons.";
// a night shot of the wood, where the spirits show best, used when the /forest link is shared
const image = { url: "/forest-og.png", width: 1200, height: 630, alt: "The Forest: a stag, a fox, an owl and rabbits made of light in a dark wood at night" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/forest",
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
  themeColor: "#07131f",
};

// A fun side page with its own root layout, kept apart from Koi Valley and the classic site.
export default function ForestLayout({
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
