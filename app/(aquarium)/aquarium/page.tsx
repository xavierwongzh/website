import Script from "next/script";

// The tank is a self-contained canvas program (public/aquarium/aquarium.js);
// React only renders the frame around it.
export default function Aquarium() {
  return (
    <>
      <canvas id="aquarium" aria-label="An ASCII aquarium with sharks, rays, dolphins, a turtle, jellyfish and lotus pads" role="img" />
      <header className="aq-head">
        <h1>Aquarium</h1>
        <p>Sea creatures in ASCII</p>
        <p className="tagline">Tap the water, or tap a creature to see its name.</p>
      </header>
      <nav className="aq-panel" aria-label="Aquarium controls">
        <div className="row">
          <span className="time" id="aq-time">--:--</span>
          <span className="phase" id="aq-phase">Day</span>
        </div>
        <span className="label">Light</span>
        <div className="btns" role="group" aria-label="Light">
          <button className="chip" type="button" data-mode="auto" aria-pressed="true">Auto</button>
          <button className="chip" type="button" data-mode="day" aria-pressed="false">Day</button>
          <button className="chip" type="button" data-mode="night" aria-pressed="false">Night</button>
        </div>
        {/* Koi Valley has its own root layout, so this is a full page load on purpose. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="chip back" href="/">&larr; Back to Koi Valley</a>
      </nav>
      <div id="aq-caption" aria-live="polite" />
      <Script src="/aquarium/aquarium.js" strategy="afterInteractive" />
    </>
  );
}
