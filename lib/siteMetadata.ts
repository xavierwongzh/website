import type { Metadata } from "next";

export const SITE_URL = "https://xavierwongzh.vercel.app";

// Shared by the Koi Valley home page and the classic site at /old.
export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Xavier Wong | Aviation Systems • Optimization • Analytics",
  description:
    "Engineering Systems undergraduate at SUTD focused on aviation operations, optimization (OR/MILP), simulation, and data analytics.",
  keywords: [
    "Xavier Wong",
    "portfolio",
    "aviation systems",
    "airport operations",
    "operations research",
    "optimization",
    "MILP",
    "simulation",
    "data analytics",
    "Python",
    "SQL",
    "Power BI",
  ],
  authors: [{ name: "Xavier Wong" }],
  creator: "Xavier Wong",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Xavier Wong | Portfolio",
    description:
      "Aviation operations, optimization (OR/MILP), simulation, and data analytics projects.",
    siteName: "Xavier Wong Portfolio",
    // a golden-hour shot of Koi Valley, shown when the link is shared
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Xavier Wong's Koi Valley, a floating autumn island with a koi pond" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xavier Wong | Portfolio",
    description:
      "Aviation operations, optimization (OR/MILP), simulation, and data analytics projects.",
    images: ["/og.png"],
  },
};
