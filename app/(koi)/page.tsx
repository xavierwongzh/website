import Script from "next/script";
import { KOI_MARKUP } from "./markup";

// The scene is a self-contained canvas program (public/koi-valley/koi.js) ported
// verbatim from the approved preview; React only renders the static shell it drives.
export default function Home() {
  return (
    <>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: KOI_MARKUP }} />
      <Script src="/koi-valley/koi.js" strategy="afterInteractive" />
    </>
  );
}
