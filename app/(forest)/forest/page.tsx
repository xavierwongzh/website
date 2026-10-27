import Script from "next/script";

// The wood is a self-contained canvas program (public/forest/forest.js);
// React only renders the frame around it.
export default function Forest() {
  return (
    <>
      <canvas id="forest" aria-label="A dark forest where spirits of light, a stag, a fox, an owl and rabbits, wander between tall trees" role="img" />
      <header className="fo-head">
        <h1>The Forest</h1>
        <p>Spirits of light</p>
        <p className="tagline">Move through the trees, tap the ground, or tap a spirit.</p>
      </header>
      <nav className="fo-panel" aria-label="Forest controls">
        {/* On phones the row folds the panel into a pill, like Koi Valley's clock; on desktop it is just the heading. */}
        <button className="row" id="fo-toggle" type="button" aria-expanded="false" aria-controls="fo-more">
          <span className="time" id="fo-time">--:--</span>
          <span className="season-now" id="fo-season" />
          <span className="phase" id="fo-phase">Night</span>
          <span className="chev" aria-hidden="true" />
        </button>
        <div className="more" id="fo-more">
          <label className="label" htmlFor="fo-hour">Scrub the day</label>
          <input id="fo-hour" type="range" min="0" max="23.99" step="0.05" defaultValue="12" />
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
        </div>
      </nav>
      <div id="fo-caption" aria-live="polite" />
      <Script src="/forest/forest.js" strategy="afterInteractive" />
    </>
  );
}
