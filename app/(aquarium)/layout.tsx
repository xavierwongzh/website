import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SITE_URL } from "@/lib/siteMetadata";
import "./aquarium.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "The Pond | Xavier Wong",
  description: "The Pond, in ASCII: hammerheads, a whale shark, dolphins, a sea turtle, rays, jellyfish and lotus pads, drawn in characters.",
  openGraph: { images: [{ url: "/og.png", width: 1200, height: 630 }] },
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
