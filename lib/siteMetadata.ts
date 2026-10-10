import type { Metadata } from "next";

// Shared by the Koi Valley home page and the classic site at /old.
export const siteMetadata: Metadata = {
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
  },
};
