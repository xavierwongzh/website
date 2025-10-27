import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
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
  title: "Xavier - Portfolio | Dark Mythical Forest",
  description: "Exploring worlds of data, design, and dreams. A personal portfolio journey through a mystical forest.",
  keywords: ["portfolio", "data analyst", "creative technologist", "Xavier"],
  authors: [{ name: "Xavier" }],
  creator: "Xavier",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Xavier - Portfolio",
    description: "Exploring worlds of data, design, and dreams",
    siteName: "Xavier Portfolio",
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
      </body>
    </html>
  );
}

