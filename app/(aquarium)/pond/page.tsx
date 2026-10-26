import Script from "next/script";

// The tank is a self-contained canvas program (public/aquarium/aquarium.js);
// React only renders the frame around it.
export default function Pond() {
  return (
    <>
      <canvas id="aquarium" aria-label="An ASCII pond with sharks, rays, dolphins, a turtle, jellyfish and lotus pads" role="img" />
      <header className="aq-head">
        <h1>The Pond</h1>
        <p>Sea creatures in ASCII</p>
        <p className="tagline">Tap the water, or tap a creature to see its name.</p>
      </header>
      <nav className="aq-panel" aria-label="Pond controls">
        <div className="row">
          <span className="time" id="aq-time">--:--</span>
          <span className="phase" id="aq-phase">Day</span>
        </div>
        <label className="label" htmlFor="aq-hour">Scrub the day</label>
        <input id="aq-hour" type="range" min="0" max="23.99" step="0.05" defaultValue="12" />
        <span className="label">Season</span>
        <div className="btns" role="group" aria-label="Season">
          <button className="chip" type="button" data-season="spring" aria-pressed="false">Spring</button>
          <button className="chip" type="button" data-season="summer" aria-pressed="false">Summer</button>
          <button className="chip" type="button" data-season="autumn" aria-pressed="false">Autumn</button>
          <button className="chip" type="button" data-season="winter" aria-pressed="false">Winter</button>
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
