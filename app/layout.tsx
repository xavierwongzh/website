import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased overflow-x-hidden`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

