import Script from "next/script";

// The tank is a self-contained canvas program (public/aquarium/aquarium.js);
// React only renders the frame around it.
export default function Aquarium() {
  return (
    <>
      <canvas id="aquarium" aria-label="An ASCII aquarium with sharks, rays, a turtle, jellyfish and floating flowers" role="img" />
      <header className="aq-head">
        <h1>Aquarium</h1>
        <p>Tap the water. Tap the pufferfish.</p>
      </header>
      <nav className="aq-nav">
        {/* Koi Valley has its own root layout, so this is a full page load on purpose. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">&larr; Koi Valley</a>
        <button id="aq-mode" type="button">Auto</button>
      </nav>
      <div id="aq-caption" aria-live="polite" />
      <Script src="/aquarium/aquarium.js" strategy="afterInteractive" />
    </>
  );
}
