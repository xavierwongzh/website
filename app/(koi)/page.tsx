import Script from "next/script";
import { KOI_MARKUP } from "./markup";
import { personJsonLd, readableHtml } from "@/lib/koiContent";

// The scene is a self-contained canvas program (public/koi-valley/koi.js) ported
// verbatim from the approved preview; React only renders the static shell it drives.
// Below it sits a visually hidden text version of every card, built from the same data,
// for search engines and screen readers.
export default function Home() {
  return (
    <>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: KOI_MARKUP }} />
      <main className="readable" aria-label="Xavier Wong, text version" dangerouslySetInnerHTML={{ __html: readableHtml() }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Script src="/koi-valley/koi.js" strategy="afterInteractive" />
    </>
  );
}
