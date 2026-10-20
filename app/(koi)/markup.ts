// Static markup for the Koi Valley scene. public/koi-valley/koi.js finds these elements by id and drives them.
export const KOI_MARKUP = `

<div id="stage"><canvas id="world" aria-label="Isometric autumn valley with mountains, a river, maple trees and a koi pond"></canvas></div>
<div id="tags" aria-label="Places in the valley"></div>

<div class="chrome ident">
  <h1>Xavier Wong</h1>
  <p>Aviation systems · Optimization · Analytics</p>
  <p class="tagline">A vibe coder with a curious mind,<br>building digital experiences.</p>
</div>

<div class="chrome clock" role="group" aria-label="Time of day">
  <button class="row" id="clockToggle" type="button" aria-expanded="false" aria-controls="clockMore"><span class="time" id="clockTime">--:--</span><span class="season-now" id="clockSeason"></span><span class="phase" id="clockPhase">Morning</span><span class="chev" aria-hidden="true"></span></button>
  <div class="more" id="clockMore">
  <label for="hour">Scrub the day</label>
  <input id="hour" type="range" min="0" max="24" step="0.05" value="12">
  <label>Season</label>
  <div class="btns" role="group" aria-label="Season">
    <button class="chip" data-season="spring" aria-pressed="false">Spring</button>
    <button class="chip" data-season="summer" aria-pressed="false">Summer</button>
    <button class="chip" data-season="autumn" aria-pressed="false">Autumn</button>
    <button class="chip" data-season="winter" aria-pressed="false">Winter</button>
  </div>
  <label>View</label>
  <div class="btns" role="group" aria-label="View">
    <button class="chip" data-view="iso" aria-pressed="true">Isometric</button>
    <button class="chip" data-view="persp" aria-pressed="false">Perspective</button>
    <button class="chip" data-view="top" aria-pressed="false">Top-down</button>
  </div>
  </div>
</div>

<div class="chrome hint" id="hint"><b>Drag</b> to peek around the island · <b>tap a koi</b> for a project · <b>tap the water</b> to feed them</div>
<div id="tip" hidden></div>
<div class="chrome toast" id="toast" role="status" hidden></div>

<aside class="drawer" id="drawer" aria-hidden="true">
  <header>
    <div><div class="eyebrow" id="dEyebrow"></div><h2 id="dTitle"></h2></div>
    <button class="close" id="dClose" aria-label="Close">×</button>
  </header>
  <div class="body" id="dBody"></div>
</aside>

`;
