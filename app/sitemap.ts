import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteMetadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/koi-valley/Xavier-Wong-Resume.pdf`, changeFrequency: "yearly", priority: 0.6 },
  ];
}
