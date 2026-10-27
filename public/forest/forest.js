/* The Forest: a dark wood of tall trees and mist where spirits of light wander and the air is full of slow motes. */
(function () {
  "use strict";

  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const mix = (a, b, t) => a + (b - a) * t;
  const mixc = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
  const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a === undefined ? 1 : a})`;
  function rng(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // Smooth 1D value noise for hills, sway and drift.
  function noise1(x, seed) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    const h = (n) => { const v = Math.sin((n + seed * 131.7) * 127.1) * 43758.5453; return v - Math.floor(v); };
    return mix(h(i), h(i + 1), u) * 2 - 1;
  }

  const params = new URLSearchParams(location.search);

  const canvas = document.getElementById("forest");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, DPR = 1, U = 1;

  /* ── light through the day ────────────────────────────────────────── */

  // [hour, sky high, sky low, tree, fog, shaft light, spirit strength]
  const KEYS = [
    [0, [8, 18, 34], [20, 46, 62], [5, 12, 18], [38, 74, 90], [150, 190, 230], 1],
    [5.2, [10, 18, 36], [28, 44, 64], [6, 12, 18], [46, 64, 86], [170, 180, 230], 1],
    [6.4, [52, 52, 84], [214, 142, 132], [26, 26, 36], [150, 118, 128], [255, 196, 170], 0.8],
    [8.5, [120, 160, 150], [206, 214, 186], [44, 62, 52], [176, 196, 178], [255, 240, 200], 0.6],
    [13, [140, 178, 162], [214, 226, 202], [46, 66, 56], [186, 206, 190], [255, 248, 220], 0.55],
    [17.4, [150, 150, 120], [230, 196, 140], [52, 52, 40], [200, 180, 140], [255, 214, 150], 0.65],
    [18.8, [70, 50, 80], [222, 128, 106], [28, 22, 30], [140, 96, 104], [255, 170, 130], 0.85],
    [20.3, [10, 18, 36], [26, 44, 66], [6, 12, 18], [42, 66, 86], [160, 186, 230], 1],
    [24, [8, 18, 34], [20, 46, 62], [5, 12, 18], [38, 74, 90], [150, 190, 230], 1],
  ];
  function lightAt(h) {
    let i = 0;
    while (i < KEYS.length - 2 && KEYS[i + 1][0] <= h) i++;
    const a = KEYS[i], b = KEYS[i + 1], t = smooth(0, 1, (h - a[0]) / (b[0] - a[0]));
    return { skyHi: mixc(a[1], b[1], t), skyLo: mixc(a[2], b[2], t), tree: mixc(a[3], b[3], t), fog: mixc(a[4], b[4], t), shaft: mixc(a[5], b[5], t), spirit: mix(a[6], b[6], t), night: mix(a[6], b[6], t) > 0.9 };
  }
  const nowHour = () => { const d = new Date(); return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600; };
  const hourParam = parseFloat(params.get("hour"));
  let live = !(hourParam >= 0 && hourParam < 24);
  let hour = live ? nowHour() : hourParam;
  let L = lightAt(hour);

  /* ── the wood: five layers of trees from the far mist to the trunks in front ─ */

  const NL = 5;
  const PAD = 60;
  const GROUND = [0.6, 0.64, 0.69, 0.77, 0.9];
  const HILL = [0.012, 0.016, 0.02, 0.022, 0.03];
  const layers = [];
  const groundY = (i, x) => H * (GROUND[i] + HILL[i] * noise1(x / (W * 0.28) + i * 3.1, i + 7));
  // How far a layer sits into the mist, 1 far .. 0 near.
  const depthOf = (i) => (NL - 1 - i) / (NL - 1);

  function makeLayer(i) {
    const w = W + PAD * 2;
    const base = document.createElement("canvas"), rim = document.createElement("canvas");
    base.width = rim.width = Math.ceil(w * DPR);
    base.height = rim.height = Math.ceil(H * DPR);
    const b = base.getContext("2d"), r = rim.getContext("2d");
    b.setTransform(DPR, 0, 0, DPR, PAD * DPR, 0);
    r.setTransform(DPR, 0, 0, DPR, PAD * DPR, 0);
    b.fillStyle = r.fillStyle = "#fff";
    const R = rng(1000 + i * 77 + Math.round(W / 50));
    const d = depthOf(i);
    // Ground
    b.beginPath();
    b.moveTo(-PAD, H + 2);
    for (let x = -PAD; x <= W + PAD; x += 8) b.lineTo(x, groundY(i, x));
    b.lineTo(W + PAD, H + 2);
    b.closePath();
    b.fill();
    // The ground on its own, for the snow in winter.
    const snow = document.createElement("canvas");
    snow.width = base.width;
    snow.height = base.height;
    const sn = snow.getContext("2d");
    sn.setTransform(DPR, 0, 0, DPR, PAD * DPR, 0);
    sn.fillStyle = "#fff";
    sn.fill(new Path2D(`M${-PAD} ${H + 2}` + Array.from({ length: Math.ceil((W + PAD * 2) / 8) + 1 }, (_, k) => { const x = -PAD + k * 8; return `L${x} ${groundY(i, x)}`; }).join("") + `L${W + PAD} ${H + 2}Z`));
    // Trees
    const count = [16, 11, 7, 5, 2][i];
    const tw = U * [0.012, 0.02, 0.034, 0.056, 0.11][i];
    const trees = [];
    for (let k = 0; k < count; k++) {
      let x;
      if (i === NL - 1) x = [W * 0.03, W * 0.95][k];
      else x = (k + 0.15 + R() * 0.7) / count * (W + PAD) - PAD / 2;
      trees.push({ x, w: tw * (0.7 + R() * 0.6), lean: (R() - 0.5) * 0.06, seed: R() * 100 });
    }
    for (const t of trees) {
      const gy = groundY(i, t.x) + 4;
      const top = -20;
      const steps = 24;
      const left = [], right = [];
      for (let s = 0; s <= steps; s++) {
        const v = s / steps; // 0 at the roots, 1 at the top
        const y = mix(gy, top, v);
        const wob = noise1(v * 3 + t.seed, 3) * t.w * 0.35;
        const cx = t.x + t.lean * (gy - y) + wob;
        const flare = 1 + 1.4 * Math.pow(1 - v, 6);
        const hw = t.w * 0.5 * mix(1, 0.6, v) * flare;
        left.push([cx - hw, y]);
        right.push([cx + hw, y]);
      }
      b.beginPath();
      b.moveTo(left[0][0], left[0][1]);
      for (const p of left) b.lineTo(p[0], p[1]);
      for (let s = right.length - 1; s >= 0; s--) b.lineTo(right[s][0], right[s][1]);
      b.closePath();
      b.fill();
      // Moonlit edge on the left side of the trunk, for roundness.
      r.beginPath();
      r.moveTo(left[0][0], left[0][1]);
      for (const p of left) r.lineTo(p[0], p[1]);
      for (let s = left.length - 1; s >= 0; s--) r.lineTo(mix(left[s][0], right[s][0], 0.22), left[s][1]);
      r.closePath();
      r.fill();
      // A few branches reaching out of the upper trunk.
      const nb = i === NL - 1 ? 0 : 2 + Math.floor(R() * 3);
      for (let k = 0; k < nb; k++) {
        const v = 0.45 + R() * 0.45, s = Math.round(v * steps);
        const side = R() < 0.5 ? -1 : 1;
        const p0 = side < 0 ? left[s] : right[s];
        const len = t.w * (2 + R() * 2.2), ang = -0.6 - R() * 0.6;
        const p1 = [p0[0] + side * Math.cos(ang) * len, p0[1] + Math.sin(ang) * len];
        const bw = t.w * 0.12;
        b.beginPath();
        b.moveTo(p0[0], p0[1] - bw * 1.6);
        b.quadraticCurveTo(mix(p0[0], p1[0], 0.5), mix(p0[1], p1[1], 0.5) + bw, p1[0], p1[1]);
        b.quadraticCurveTo(mix(p0[0], p1[0], 0.5), mix(p0[1], p1[1], 0.5) + bw * 2.5, p0[0], p0[1] + bw * 1.6);
        b.fill();
      }
      // Canopy: soft clumps of leaves high up, thicker on the near trees.
      const nc = 6 + Math.floor(R() * 5);
      for (let k = 0; k < nc; k++) {
        const rr = U * (0.025 + R() * 0.04) * (1 + (1 - d) * 1.2);
        const cy = H * mix(0.1, -0.02, 1 - d) - rr * 0.3 + R() * rr * 0.8;
        const cx = t.x + t.lean * (gy - cy) + (R() - 0.5) * U * 0.16 * (1 + (1 - d));
        b.beginPath();
        b.arc(cx, cy, rr, 0, TAU);
        b.fill();
      }
    }
    // Ferns and grass along the near grounds.
    if (i >= 2) {
      const n = [0, 0, 26, 40, 34][i];
      for (let k = 0; k < n; k++) {
        const x = R() * (W + PAD) - PAD / 2, gy = groundY(i, x) + 2;
        const size = U * [0, 0, 0.03, 0.05, 0.09][i] * (0.6 + R() * 0.7);
        const fronds = 4 + Math.floor(R() * 4);
        for (let f = 0; f < fronds; f++) {
          const a = -Math.PI / 2 + (f / (fronds - 1) - 0.5) * 2.2 + (R() - 0.5) * 0.2;
          const ex = x + Math.cos(a) * size, ey = gy + Math.sin(a) * size * 0.9;
          b.beginPath();
          b.moveTo(x - size * 0.03, gy);
          b.quadraticCurveTo(x + Math.cos(a) * size * 0.4, gy + Math.sin(a) * size * 0.9 - size * 0.2, ex, ey);
          b.quadraticCurveTo(x + Math.cos(a) * size * 0.5, gy + Math.sin(a) * size * 0.6, x + size * 0.03, gy);
          b.fill();
        }
      }
    }
    const tint = document.createElement("canvas");
    tint.width = base.width;
    tint.height = base.height;
    return { base, rim, snow, tint, trees, key: "" };
  }

  // Colour a layer's masks for the current light. Cheap enough to redo while the day is scrubbed.
  function tintLayer(i) {
    const ly = layers[i], d = depthOf(i);
    const col = mixc(L.tree, L.fog, d * 0.78);
    const rimCol = mixc(col, L.shaft, 0.1 + 0.12 * (1 - d) * (L.night ? 0.6 : 1));
    const key = col.map(Math.round).join() + rimCol.map(Math.round).join() + season;
    if (ly.key === key) return;
    ly.key = key;
    const W2 = ly.tint.width, H2 = ly.tint.height;
    const c = ly.tint.getContext("2d");
    c.globalCompositeOperation = "source-over";
    c.clearRect(0, 0, W2, H2);
    c.drawImage(ly.base, 0, 0);
    c.globalCompositeOperation = "source-in";
    c.fillStyle = rgba(col);
    c.fillRect(0, 0, W2, H2);
    // Mist settles near the ground of each layer, so the feet of the trees fade.
    c.globalCompositeOperation = "source-atop";
    const g = c.createLinearGradient(0, H2 * (GROUND[i] - 0.2), 0, H2 * (GROUND[i] + 0.02));
    g.addColorStop(0, rgba(L.fog, 0));
    g.addColorStop(1, rgba(L.fog, 0.16 + 0.12 * d));
    c.fillStyle = g;
    c.fillRect(0, 0, W2, H2);
    // The lit edge of each trunk goes on top.
    const tmp = tintLayer.tmp || (tintLayer.tmp = document.createElement("canvas"));
    if (tmp.width !== W2 || tmp.height !== H2) { tmp.width = W2; tmp.height = H2; }
    const r = tmp.getContext("2d");
    r.globalCompositeOperation = "source-over";
    r.clearRect(0, 0, W2, H2);
    r.drawImage(ly.rim, 0, 0);
    r.globalCompositeOperation = "source-in";
    r.fillStyle = rgba(rimCol);
    r.fillRect(0, 0, W2, H2);
    c.globalCompositeOperation = "source-over";
    c.drawImage(tmp, 0, 0);
    if (season === "winter") {
      r.globalCompositeOperation = "source-over";
      r.clearRect(0, 0, W2, H2);
      r.drawImage(ly.snow, 0, 0);
      r.globalCompositeOperation = "source-in";
      r.fillStyle = rgba(mixc(col, L.night ? [150, 170, 200] : [236, 242, 250], 0.55 - d * 0.25));
      r.fillRect(0, 0, W2, H2);
      c.drawImage(tmp, 0, 0);
    }
  }

  /* ── glow sprites ─────────────────────────────────────────────────── */

  const sprites = new Map();
  function glow(col) {
    const key = col.map((v) => Math.round(v / 8)).join();
    let s = sprites.get(key);
    if (s) return s;
    s = document.createElement("canvas");
    s.width = s.height = 64;
    const c = s.getContext("2d"), g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, rgba(col, 1));
    g.addColorStop(0.25, rgba(col, 0.45));
    g.addColorStop(0.6, rgba(col, 0.1));
    g.addColorStop(1, rgba(col, 0));
    c.fillStyle = g;
    c.fillRect(0, 0, 64, 64);
    sprites.set(key, s);
    return s;
  }
  function dot(x, y, r, col, a) {
    ctx.globalAlpha = a;
    ctx.drawImage(glow(col), x - r, y - r, r * 2, r * 2);
  }

  /* ── spirits: bodies built from capsules so the light can follow the limbs ─ */

  // A part runs from a to b with radius ra..rb, in body units (ground at y = 0, facing +x).
  const part = (ax, ay, bx, by, ra, rb, k) => ({ ax, ay, bx, by, ra, rb, k: k === undefined ? 1 : k });
  // A fine line of light drawn over the body: markings, feather edges, the line of a back.
  const line = (ax, ay, bx, by, k) => ({ ax, ay, bx, by, ra: 0.012, rb: 0.012, k: k === undefined ? 1 : k, d: 1 });
  const rot = (x, y, cx, cy, a) => { const c = Math.cos(a), s = Math.sin(a); return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]; };
  function leg(out, hx, hy, ph, len, far, thick) {
    const sw = Math.sin(ph) * 0.32, lift = Math.max(0, Math.cos(ph)) * 0.08;
    const kx = hx + Math.sin(sw) * len * 0.5, ky = hy + Math.cos(sw) * len * 0.5 - lift;
    const fx = kx + Math.sin(sw * 0.4) * len * 0.5, fy = Math.min(0, ky + len * 0.5 - lift * 0.5);
    const k = far ? 0.55 : 1;
    out.push(part(hx, hy, kx, ky, thick, thick * 0.7, k), part(kx, ky, fx, fy, thick * 0.7, thick * 0.45, k));
  }
  const BODY = {
    stag(ph, look, graze) {
      const p = [];
      const bob = Math.sin(ph * 2) * 0.012;
      leg(p, 0.24, -0.66 + bob, ph + Math.PI, 0.66, true, 0.05);
      leg(p, -0.32, -0.68 + bob, ph, 0.68, true, 0.055);
      p.push(part(-0.36, -0.8 + bob, 0.3, -0.84 + bob, 0.19, 0.21));
      leg(p, 0.26, -0.66 + bob, ph, 0.66, false, 0.05);
      leg(p, -0.3, -0.68 + bob, ph + Math.PI, 0.68, false, 0.055);
      p.push(part(-0.52, -0.92 + bob, -0.6, -0.84 + bob, 0.05, 0.03));
      // A pale rump patch.
      p.push(part(-0.5, -0.86 + bob, -0.44, -0.74 + bob, 0.06, 0.05, 0.8));
      // Neck and head turn down together to graze.
      const g = graze * 1.15, nx = 0.3, ny = -0.86 + bob;
      const R = (x, y) => rot(x, y + bob, nx, ny, g);
      let [a, b] = R(0.32, -0.9), [c, d] = R(0.46, -1.24);
      p.push(part(a, b, c, d, 0.12, 0.075));
      const [h1, h2] = R(0.46, -1.27), [s1, s2] = R(0.66 - look * 0.06, -1.2);
      p.push(part(h1, h2, s1, s2, 0.085, 0.045));
      // A ruff of longer hair on the throat, the line of the neck and jaw, and a dark-tipped nose.
      const [r1, r2] = R(0.36, -0.98), [r3, r4] = R(0.48, -1.16);
      p.push(part(r1, r2, r3, r4, 0.07, 0.04, 0.8));
      const [j1, j2] = R(0.47, -1.2), [j3, j4] = R(0.66 - look * 0.06, -1.17);
      p.push(line(j1, j2, j3, j4));
      const [e1, e2] = R(0.45, -1.32), [e3, e4] = R(0.33, -1.44);
      p.push(part(e1, e2, e3, e4, 0.035, 0.012));
      const [f1, f2] = R(0.47, -1.33), [f3, f4] = R(0.42, -1.47);
      p.push(part(f1, f2, f3, f4, 0.03, 0.01, 0.6));
      // Antlers: two beams sweeping up and back, each with a brow tine and tines reaching forward.
      for (const [dx, dy, k] of [[0, 0, 1], [-0.07, 0.02, 0.6]]) {
        const pts = [[0.47, -1.34], [0.41, -1.5], [0.32, -1.65], [0.26, -1.8]].map(([x, y]) => [x + dx, y + dy]);
        for (let q = 0; q < pts.length - 1; q++) {
          const [x0, y0] = R(...pts[q]), [x1, y1] = R(...pts[q + 1]);
          p.push(part(x0, y0, x1, y1, 0.024 - q * 0.004, 0.02 - q * 0.004, k));
        }
        for (const [q, tx, ty] of [[0, 0.6, -1.42], [1, 0.53, -1.6], [2, 0.45, -1.77], [3, 0.34, -1.92], [3, 0.15, -1.9]]) {
          const [x0, y0] = R(...pts[q]), [x1, y1] = R(tx + dx, ty + dy);
          p.push(part(x0, y0, x1, y1, 0.014, 0.007, k));
        }
      }
      const [ex, ey] = R(0.54, -1.27);
      return { parts: p, eyes: [[ex, ey]] };
    },
    doe(ph, look, graze) {
      const s = BODY.stag(ph, look, graze);
      return { parts: s.parts.filter((q) => q.d || q.ra > 0.02 || q.rb > 0.015).map((q) => ({ ...q, ax: q.ax * 0.92, ay: q.ay * 0.92, bx: q.bx * 0.92, by: q.by * 0.92 })), eyes: s.eyes.map(([x, y]) => [x * 0.92, y * 0.92]) };
    },
    fox(ph, look) {
      const p = [];
      const bob = Math.sin(ph * 2) * 0.01;
      leg(p, 0.2, -0.38 + bob, ph + Math.PI, 0.4, true, 0.035);
      leg(p, -0.24, -0.4 + bob, ph, 0.4, true, 0.04);
      p.push(part(-0.3, -0.45 + bob, 0.22, -0.46 + bob, 0.12, 0.13));
      leg(p, 0.22, -0.38 + bob, ph, 0.4, false, 0.035);
      leg(p, -0.22, -0.4 + bob, ph + Math.PI, 0.4, false, 0.04);
      const sw = Math.sin(ph) * 0.04;
      p.push(part(-0.34, -0.48 + bob, -0.62, -0.52 + sw, 0.07, 0.12), part(-0.62, -0.52 + sw, -0.86, -0.42 + sw, 0.12, 0.03));
      p.push(part(0.28, -0.5 + bob, 0.4, -0.62 + bob, 0.08, 0.09));
      p.push(part(0.4, -0.62 + bob, 0.6 - look * 0.04, -0.57 + bob, 0.08, 0.022));
      p.push(part(0.36, -0.68 + bob, 0.33, -0.84 + bob, 0.04, 0.006), part(0.44, -0.68 + bob, 0.46, -0.83 + bob, 0.04, 0.006, 0.7));
      return { parts: p, eyes: [[0.48, -0.65 + bob]] };
    },
    // A hop in four beats: crouch, push off with the long hind feet, reach forward in the air, land on the front paws.
    rabbit(ph) {
      const u = (((ph / TAU) % 1) + 1) % 1;
      let y = 0, tilt = 0, back = 0, front = 0, squash = 0;
      if (u < 0.15) squash = Math.sin((u / 0.15) * Math.PI) * 0.6;
      else if (u < 0.6) {
        const a = (u - 0.15) / 0.45;
        y = 4 * a * (1 - a) * 0.2;
        back = 1 - smooth(0.2, 0.8, a);
        front = smooth(0.35, 0.9, a);
        tilt = mix(-0.32, 0.26, smooth(0, 1, a));
      } else if (u < 0.78) {
        const a = (u - 0.6) / 0.18;
        front = 1 - smooth(0.2, 1, a);
        tilt = mix(0.26, 0, smooth(0, 1, a));
        squash = Math.sin(a * Math.PI) * 0.4;
      }
      const cx = -0.04, cy = -0.22;
      const T = (x, z) => { const [rx, ry] = rot(x, z + squash * 0.03 * (z < -0.1 ? 1 : 0), cx, cy, tilt); return [rx, ry - y]; };
      const pp = (ax, ay, bx, by, ra, rb, k) => { const [x0, y0] = T(ax, ay), [x1, y1] = T(bx, by); return part(x0, y0, x1, y1, ra, rb, k); };
      const ln = (ax, ay, bx, by, k) => { const [x0, y0] = T(ax, ay), [x1, y1] = T(bx, by); return line(x0, y0, x1, y1, k); };
      const p = [];
      const ear = back * 0.1 + y * 0.3;
      // far legs first, dimmer
      p.push(pp(0.1, -0.18, mix(0.12, 0.26, front), mix(-0.02, -0.1, front), 0.028, 0.022, 0.55));
      p.push(pp(-0.16, -0.18, mix(-0.07, -0.3, back), mix(-0.06, -0.08, back), 0.085, 0.05, 0.55));
      p.push(pp(-0.16, -0.2, 0.08, -0.27, 0.16, 0.12));
      p.push(pp(0.17, -0.37, 0.27, -0.35, 0.1, 0.06));
      p.push(pp(0.27, -0.35, 0.29, -0.34, 0.02, 0.02, 0.9));
      p.push(pp(0.14, -0.45, 0.06 - ear, -0.78 + ear * 0.3, 0.04, 0.024, 0.7), pp(0.19, -0.45, 0.15 - ear, -0.8 + ear * 0.3, 0.045, 0.026));
      p.push(ln(0.175, -0.5, 0.155 - ear, -0.74 + ear * 0.3, 0.8));
      // near legs: the long hind foot pushes back on take-off, the front paws reach for the ground on landing
      const hx = mix(-0.06, -0.3, back), hy = mix(-0.05, -0.1, back);
      p.push(pp(-0.13, -0.2, hx, hy, 0.09, 0.05));
      p.push(pp(hx, hy, hx + mix(0.15, -0.12, back), mix(-0.01, -0.05, back), 0.035, 0.025));
      p.push(pp(0.12, -0.18, mix(0.14, 0.3, front), mix(-0.02, -0.1, front), 0.03, 0.024));
      p.push(pp(-0.32, -0.26, -0.34, -0.28, 0.06, 0.05));
      return { parts: p, eyes: [T(0.21, -0.4)] };
    },
    owl(ph, look) {
      const p = [], lx = look * 0.035;
      // folded wings with their feather edges, an egg-shaped body with a speckled chest, then the round head
      p.push(part(-0.16, -0.48, -0.15, -0.1, 0.075, 0.045, 0.75), part(0.16, -0.48, 0.15, -0.1, 0.075, 0.045, 0.75));
      p.push(part(0, -0.2, 0, -0.24, 0.19, 0.19));
      p.push(part(0, -0.34, 0, -0.46, 0.16, 0.14));
      for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) p.push(line(sx * 0.21, -0.42 + k * 0.11, sx * 0.15, -0.36 + k * 0.11, 0.45));
      for (let k = 0; k < 3; k++) for (const ox of [-0.06, 0.06]) { const yy = -0.38 + k * 0.08 + (ox > 0 ? 0.04 : 0); p.push(line(ox - 0.025, yy - 0.015, ox, yy, 0.45), line(ox, yy, ox + 0.025, yy - 0.015, 0.45)); }
      p.push(part(0.02, -0.08, 0.02, 0.06, 0.035, 0.02, 0.7));
      p.push(part(lx, -0.62, lx, -0.64, 0.16, 0.16));
      // the V of the facial disc, a small beak and the ear tufts
      p.push(line(-0.13 + lx, -0.73, lx, -0.61, 0.4), line(lx, -0.61, 0.13 + lx, -0.73, 0.4));
      p.push(part(lx, -0.6, lx, -0.55, 0.018, 0.006));
      for (const sx of [-1, 1]) p.push(part(sx * 0.09 + lx, -0.74, sx * 0.14 + lx, -0.85, 0.035, 0.006));
      p.push(part(-0.05, -0.02, 0.05, -0.02, 0.025, 0.025, 0.75));
      return { parts: p, eyes: [[-0.065 + lx, -0.64], [0.065 + lx, -0.64]] };
    },
  };

  // Each spirit glows in a family of colours, mixed through its body.
  const SPIRIT_COLS = {
    stag: [[170, 236, 255], [120, 190, 255], [196, 160, 255], [120, 255, 214], [255, 255, 255], [255, 210, 240]],
    doe: [[255, 200, 230], [214, 196, 255], [255, 226, 200], [255, 255, 255]],
    fox: [[255, 196, 120], [255, 160, 100], [255, 226, 160], [255, 140, 150]],
    rabbit: [[180, 255, 214], [255, 210, 236], [220, 220, 255], [255, 255, 255]],
    owl: [[190, 176, 255], [160, 206, 255], [255, 200, 250], [230, 226, 255]],
  };
  const NAMES = { stag: "Stag spirit", doe: "Doe spirit", fox: "Fox spirit", rabbit: "Rabbit spirit", owl: "Owl spirit" };

  const spirits = [];
  function placeSpirits() {
    spirits.length = 0;
    const phone = W < 700;
    const add = (kind, layer, x, size, speed, dir) => spirits.push({ kind, layer, x, size, speed, dir, ph: Math.random() * TAU, state: "walk", timer: 4 + Math.random() * 8, look: 0, graze: 0, stir: 0, particles: null, perch: null });
    add("stag", 3, W * (phone ? 0.42 : 0.38), 1, 0.06, 1);
    add("doe", 2, W * 0.7, 0.62, 0.05, -1);
    add("fox", 3, W * 0.78, 0.7, 0.09, -1);
    add("rabbit", 3, W * 0.2, 0.42, 0.05, 1);
    if (!phone) add("rabbit", 2, W * 0.12, 0.3, 0.04, 1);
    // The owl sits on a short branch off a trunk on the left of the clearing.
    const ly = layers[3], tree = ly.trees.reduce((a, b) => (Math.abs(b.x - W * 0.3) < Math.abs(a.x - W * 0.3) ? b : a));
    const perch = H * 0.4;
    spirits.push({ kind: "owl", layer: 3, x: tree.x + tree.lean * (groundY(3, tree.x) - perch) + tree.w * 1.6, size: 0.5, speed: 0, dir: -1, ph: 0, state: "perch", timer: 5, look: 0, graze: 0, stir: 0, particles: null, perch, tree });
  }
  const unitOf = (s) => Math.min(H * 0.2, W * (H > W * 1.3 ? 0.34 : 0.24)) * s.size * (s.layer === 2 ? 0.75 : 1);
  function spiritY(s) { return s.perch !== null ? s.perch : groundY(s.layer, s.x) + unitOf(s) * 0.02; }

  function stepSpirit(s, dt) {
    s.timer -= dt;
    if (s.kind === "owl") {
      if (s.timer < 0) { s.timer = 3 + Math.random() * 6; s.lookTo = Math.round(Math.random() * 2 - 1); }
      s.look += ((s.lookTo || 0) - s.look) * Math.min(1, dt * 2);
      return;
    }
    const u = unitOf(s);
    if (s.state === "walk") {
      const air = s.kind === "rabbit" ? ((((s.ph / TAU) % 1) + 1) % 1 > 0.15 && (((s.ph / TAU) % 1) + 1) % 1 < 0.7 ? 2.4 : 0) : 1;
      s.x += s.dir * s.speed * u * dt * 2.2 * air;
      s.ph += dt * (s.kind === "rabbit" ? 4.2 : 2.4);
      if (W < 700) {
        // On a narrow phone screen the spirits wander off the edge and come back a while later.
        if ((s.x < -u * 1.2 && s.dir < 0) || (s.x > W + u * 1.2 && s.dir > 0)) { s.state = "away"; s.timer = 5 + Math.random() * 9; }
      } else {
        if (s.x < W * 0.06 && s.dir < 0) s.dir = 1;
        if (s.x > W * 0.94 && s.dir > 0) s.dir = -1;
      }
      // Spirits on the same ground give each other room instead of walking through one another.
      for (const o of spirits) {
        if (o === s || o.layer !== s.layer || o.perch !== null || o.state === "away") continue;
        const gap = (o.x - s.x) * s.dir;
        if (gap > 0 && gap < (u + unitOf(o)) * 0.75) { s.dir *= -1; break; }
      }
      if (s.timer < 0) { s.state = "rest"; s.timer = 3 + Math.random() * 5; s.grazes = s.kind !== "rabbit" && Math.random() < 0.6; }
    } else if (s.state === "away") {
      // Back in from either side, walking toward the middle.
      if (s.timer < 0) { s.dir = Math.random() < 0.5 ? 1 : -1; s.x = s.dir > 0 ? -u * 1.1 : W + u * 1.1; s.state = "walk"; s.timer = 8 + Math.random() * 10; }
      return;
    } else {
      // A rabbit finishes the hop it is in and sits until it moves on.
      if (s.kind === "rabbit" && ((((s.ph / TAU) % 1) + 1) % 1) < 0.85) s.ph += dt * 4.2;
      if (s.timer < 0) { s.state = "walk"; s.timer = 6 + Math.random() * 10; if (Math.random() < 0.35) s.dir *= -1; }
    }
    const wantGraze = s.state === "rest" && s.grazes ? 1 : 0;
    s.graze += (wantGraze - s.graze) * Math.min(1, dt * 1.2);
    s.stir = Math.max(0, s.stir - dt * 0.5);
  }

  // Screen-space capsules for a spirit this frame.
  function shapeOf(s) {
    const f = BODY[s.kind](s.ph, s.look, s.graze);
    const u = unitOf(s), X = s.x, Y = spiritY(s), dir = s.dir;
    const P = (x, y) => [X + dir * x * u, Y + y * u];
    return {
      u,
      parts: f.parts.map((q) => { const [ax, ay] = P(q.ax, q.ay), [bx, by] = P(q.bx, q.by); return { ax, ay, bx, by, ra: q.ra * u, rb: q.rb * u, k: q.k }; }),
      eyes: f.eyes.map(([x, y]) => P(x, y)),
    };
  }
  function capsulePath(c, q, grow) {
    const dx = q.bx - q.ax, dy = q.by - q.ay, len = Math.hypot(dx, dy) || 1e-6;
    const nx = -dy / len, ny = dx / len, ra = q.ra + grow, rb = q.rb + grow;
    const a = Math.atan2(dy, dx);
    c.moveTo(q.ax + nx * ra, q.ay + ny * ra);
    c.arc(q.ax, q.ay, ra, a + Math.PI / 2, a + Math.PI * 1.5);
    c.lineTo(q.bx - nx * rb, q.by - ny * rb);
    c.arc(q.bx, q.by, rb, a - Math.PI / 2, a + Math.PI / 2);
    c.closePath();
  }

  // Each spirit is a cloud of motes pinned to its limbs, which scatter at a touch and drift home.
  function drawSpiritParticles(s, sh, t, dt) {
    const cols = SPIRIT_COLS[s.kind], str = L.spirit;
    if (!s.particles) {
      s.particles = [];
      const f = BODY[s.kind](0, 0, 0), dens = W < 700 ? 900 : 1500;
      for (let pi = 0; pi < f.parts.length; pi++) {
        const q = f.parts[pi], len = Math.hypot(q.bx - q.ax, q.by - q.ay), area = len * (q.ra + q.rb) + q.ra * q.ra * 3;
        // Lines get a row of points along them; bodies a cloud filling them.
        const n = q.d ? Math.max(3, Math.round(len * dens * 0.045)) : Math.max(3, Math.round(area * dens));
        for (let k = 0; k < n; k++) {
          const col = mixc(cols[(Math.random() * cols.length) | 0], [255, 255, 255], q.d ? 0.35 : 0.05);
          const a = Math.random() * TAU, rho = q.d ? Math.random() * 0.3 : (Math.random() + Math.random()) * 0.55;
          s.particles.push({ pi, v: q.d ? (k + Math.random()) / n : Math.random(), s: Math.cos(a) * rho, e: Math.sin(a) * rho, ox: 0, oy: 0, vx: 0, vy: 0, tw: Math.random() * TAU, sz: q.d ? 0.5 + Math.random() * 0.3 : 0.6 + Math.random(), col, d: q.d });
        }
      }
    }
    ctx.save();
    ctx.globalCompositeOperation = L.night ? "lighter" : "screen";
    const r0 = Math.max(1.6, sh.u * 0.02);
    for (const p of s.particles) {
      const q = sh.parts[p.pi];
      if (!q) continue;
      const dx = q.bx - q.ax, dy = q.by - q.ay, len = Math.hypot(dx, dy) || 1;
      // A point inside the capsule: along the bone, then out to the side and along it by up to the radius,
      // so round ends (a head, a rump) fill as discs rather than flat bars.
      const rr = p.d ? Math.max(q.ra, sh.u * 0.008) : mix(q.ra, q.rb, p.v), ux = dx / len, uy = dy / len;
      const x0 = q.ax + dx * p.v + (-uy * p.s + ux * p.e) * rr, y0 = q.ay + dy * p.v + (ux * p.s + uy * p.e) * rr;
      p.vx += -p.ox * 2 * dt - p.vx * 1.6 * dt;
      p.vy += -p.oy * 2 * dt - p.vy * 1.6 * dt - 4 * dt;
      p.ox += p.vx * dt;
      p.oy += p.vy * dt;
      const tw = 0.55 + 0.45 * Math.sin(t * 0.002 + p.tw);
      dot(x0 + p.ox, y0 + p.oy, r0 * p.sz, p.col, (p.d ? 0.5 : 0.55) * tw * q.k * str);
    }
    for (const [x, y] of sh.eyes) dot(x, y, sh.u * (s.kind === "owl" ? 0.04 : 0.035), s.kind === "owl" ? [255, 214, 130] : [255, 255, 255], 0.8 * str);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function scatter(s, x, y) {
    if (!s.particles) return;
    for (const p of s.particles) {
      const a = Math.random() * TAU, v = 30 + Math.random() * 80;
      p.vx += Math.cos(a) * v;
      p.vy += Math.sin(a) * v - 20;
    }
  }

  /* ── motes, flowers, mushrooms, mist ──────────────────────────────── */

  const motes = [];
  // The specks of light come in several colours after dark.
  const MOTE_COLS = [[210, 255, 200], [170, 226, 255], [255, 200, 236], [255, 230, 160], [206, 186, 255]];
  const MOTE_SUMMER = [[236, 255, 150], [210, 255, 180], [255, 236, 150], [170, 255, 220]];
  const MOTE_WINTER = [[210, 228, 255], [190, 210, 255], [230, 214, 255], [200, 240, 255]];
  function placeMotes() {
    motes.length = 0;
    const n = (W < 700 ? 46 : 80) * (season === "summer" ? 1.5 : 1);
    for (let k = 0; k < n; k++) motes.push({ x: Math.random() * W, y: H * (0.2 + Math.random() * 0.7), z: 0.4 + Math.random() * 0.6, ph: Math.random() * TAU, vx: 0, vy: 0, seed: Math.random() * 50, c: (Math.random() * 20) | 0 });
  }
  const flowers = [];
  const mushrooms = [];
  function placeMushrooms() {
    mushrooms.length = 0;
    const R = rng(91);
    for (let k = 0; k < (W < 700 ? 9 : 16); k++) {
      const layer = R() < 0.5 ? 3 : 2, x = R() * W;
      const col = [[120, 255, 210], [170, 190, 255], [255, 170, 230], [255, 214, 130]][(R() * 4) | 0];
      const n = 1 + ((R() * 3) | 0);
      for (let c = 0; c < n; c++) mushrooms.push({ layer, x: x + (c - (n - 1) / 2) * U * 0.012 * (0.8 + R() * 0.4), s: U * (layer === 3 ? 0.013 : 0.009) * (c === 0 ? 1 : 0.55 + R() * 0.3), ph: R() * TAU, col });
    }
  }
  const mists = [];
  function placeMist() {
    mists.length = 0;
    const R = rng(5);
    for (let k = 0; k < 14; k++) mists.push({ layer: k % 4, x: R() * W, w: W * (0.3 + R() * 0.4), h: H * (0.05 + R() * 0.05), v: (R() - 0.5) * 6 });
  }

  function bloom(x, y) {
    // Find the nearest ground line under the tap and grow a few flowers of light there.
    let layer = 3;
    for (let i = 1; i < NL - 1; i++) if (y < groundY(i, x) + H * 0.04) { layer = i; break; }
    const n = 7;
    for (let k = 0; k < n; k++) {
      const fx = x + (k - (n - 1) / 2) * U * 0.03 * (0.6 + Math.random() * 0.8);
      flowers.push({ x: fx, layer, born: performance.now() + k * 90, h: U * (0.04 + Math.random() * 0.04) * (layer === 3 ? 1 : 0.7), col: [[255, 214, 230], [200, 240, 255], [255, 236, 170]][k % 3], petals: 5 + (k % 2) });
    }
    for (const m of motes) {
      const dx = m.x - x, dy = m.y - y, d = Math.hypot(dx, dy);
      if (d < U * 0.3) { m.vx += (dx / (d || 1)) * 40; m.vy += (dy / (d || 1)) * 40; }
    }
  }

  function drawFlowers(layer, t) {
    for (const f of flowers) {
      if (f.layer !== layer) continue;
      const age = (t - f.born) / 1000;
      if (age < 0) continue;
      const grow = smooth(0, 1.6, age), fade = 1 - smooth(6, 9, age);
      const gy = groundY(layer, f.x) + 2, top = gy - f.h * grow;
      ctx.strokeStyle = rgba(mixc(f.col, [140, 255, 200], 0.5), 0.5 * fade);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(f.x, gy);
      ctx.quadraticCurveTo(f.x + f.h * 0.15, mix(gy, top, 0.5), f.x, top);
      ctx.stroke();
      const open = smooth(1, 2.4, age), pr = f.h * 0.22 * open;
      for (let k = 0; k < f.petals; k++) {
        const a = (k / f.petals) * TAU + age * 0.1;
        dot(f.x + Math.cos(a) * pr, top + Math.sin(a) * pr * 0.7, Math.max(2, f.h * 0.15), f.col, 0.8 * fade);
      }
      dot(f.x, top, Math.max(2, f.h * 0.22 * open), [255, 250, 230], 0.8 * fade);
    }
  }

  /* ── season extras ────────────────────────────────────────────────── */

  const SEASONS = ["spring", "summer", "autumn", "winter"];
  // Seasons follow the visitor's date the same way Koi Valley does (southern-hemisphere time zones are flipped).
  function seasonFromDate(d) {
    let m = d.getMonth();
    try { if (/^(Australia|Pacific\/Auckland|America\/(Argentina|Santiago|Sao_Paulo|Montevideo)|Africa\/Johannesburg)/.test(Intl.DateTimeFormat().resolvedOptions().timeZone)) m = (m + 6) % 12; } catch (e) {}
    return ["winter", "winter", "spring", "spring", "spring", "summer", "summer", "summer", "autumn", "autumn", "autumn", "winter"][m];
  }
  let season = SEASONS.includes(params.get("season")) ? params.get("season") : seasonFromDate(new Date());
  const fall = [];
  function placeFall() {
    fall.length = 0;
    const n = season === "summer" ? 0 : W < 700 ? 18 : 30;
    for (let k = 0; k < n; k++) fall.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * TAU, v: 8 + Math.random() * 14, s: 0.6 + Math.random() * 0.8 });
  }

  /* ── frame ────────────────────────────────────────────────────────── */

  const pointer = { x: -1e4, y: -1e4, active: false, px: 0 };
  let last = performance.now();

  function frame(t) {
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    stepClock(t, dt);
    L = lightAt(hour);
    // Winter mist is colder and paler; summer air a touch greener.
    if (season === "winter") { L.fog = mixc(L.fog, L.night ? [70, 90, 120] : [214, 224, 236], 0.4); L.skyLo = mixc(L.skyLo, L.fog, 0.3); }
    else if (season === "summer") L.fog = mixc(L.fog, [120, 170, 120], L.night ? 0.08 : 0.15);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    // Sky between the trunks.
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, rgba(L.skyHi));
    g.addColorStop(0.62, rgba(L.skyLo));
    g.addColorStop(1, rgba(L.fog));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // Moon or sun behind the far trees.
    const sx = W * 0.66, sy = H * 0.2;
    dot(sx, sy, U * 0.22, L.shaft, L.night ? 0.12 : 0.25);
    if (L.night) dot(sx, sy, U * 0.03, [235, 240, 255], 0.7);

    pointer.px += ((pointer.active ? (pointer.x / W - 0.5) : 0) - pointer.px) * Math.min(1, dt * 1.5);
    for (const s of spirits) stepSpirit(s, dt);

    for (let i = 0; i < NL; i++) {
      tintLayer(i);
      const off = -PAD - pointer.px * PAD * 0.8 * (1 - depthOf(i));
      ctx.globalAlpha = 1;
      ctx.drawImage(layers[i].tint, off, 0, W + PAD * 2, H);
      // Mist drifting just in front of this layer.
      if (i < NL - 1) {
        for (const m of mists) {
          if (m.layer !== i) continue;
          m.x += m.v * dt;
          if (m.x - m.w > W) m.x = -m.w;
          if (m.x + m.w < 0) m.x = W + m.w;
          const my = groundY(i, m.x) - m.h * 0.3;
          ctx.save();
          ctx.translate(m.x, my);
          ctx.scale(m.w / m.h, 1);
          const mg = ctx.createRadialGradient(0, 0, 0, 0, 0, m.h);
          mg.addColorStop(0, rgba(L.fog, L.night ? 0.16 : 0.22));
          mg.addColorStop(1, rgba(L.fog, 0));
          ctx.fillStyle = mg;
          ctx.fillRect(-m.h, -m.h, m.h * 2, m.h * 2);
          ctx.restore();
        }
      }
      if (i === 1) drawShafts(t);
      // Glowing mushrooms on this ground.
      for (const m of mushrooms) {
        if (m.layer !== i) continue;
        const gy = groundY(i, m.x) + 2, pulse = 0.7 + 0.3 * Math.sin(t * 0.0009 + m.ph);
        ctx.globalAlpha = 1;
        ctx.fillStyle = rgba(mixc(L.tree, m.col, 0.25));
        ctx.fillRect(m.x - m.s * 0.12, gy - m.s, m.s * 0.24, m.s);
        ctx.fillStyle = rgba(mixc(L.tree, m.col, L.night ? 0.95 : 0.35));
        ctx.beginPath();
        ctx.ellipse(m.x, gy - m.s, m.s * 0.55, m.s * 0.32, 0, Math.PI, TAU);
        ctx.fill();
        // After dark the caps light up: a bright cap, a soft halo and a glow on the ground below.
        if (L.night || L.spirit > 0.7) {
          const k = L.night ? 1 : 0.5;
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          dot(m.x, gy, m.s * 2.4, m.col, 0.2 * pulse * k);
          dot(m.x, gy - m.s, m.s * 2.2, m.col, 0.4 * pulse * k);
          dot(m.x, gy - m.s * 1.05, m.s * 0.7, mixc(m.col, [255, 255, 255], 0.5), 0.9 * pulse * k);
          ctx.restore();
        }
      }
      drawFlowers(i, t);
      for (const s of spirits) {
        if (s.layer !== i || s.state === "away") continue;
        const sh = shapeOf(s);
        if (s.tree) drawPerch(s, sh);
        drawSpiritParticles(s, sh, t, dt);
      }
    }
    drawMotes(t, dt);
    drawFall(dt);
    // Vignette pulls the eye to the middle of the clearing.
    const v = ctx.createRadialGradient(W / 2, H * 0.55, U * 0.3, W / 2, H * 0.55, Math.max(W, H) * 0.8);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, `rgba(0,0,0,${L.night ? 0.5 : 0.18})`);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
    for (let k = flowers.length - 1; k >= 0; k--) if (t - flowers[k].born > 9500) flowers.splice(k, 1);
    requestAnimationFrame(frame);
  }

  function drawPerch(s, sh) {
    const col = mixc(L.tree, L.fog, depthOf(s.layer) * 0.78), y = s.perch, x0 = s.tree.x + s.tree.lean * (groundY(s.layer, s.tree.x) - y);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = rgba(col);
    ctx.beginPath();
    ctx.moveTo(x0, y - sh.u * 0.06);
    ctx.quadraticCurveTo(s.x, y - sh.u * 0.02, s.x + sh.u * 0.45, y - sh.u * 0.05);
    ctx.lineTo(s.x + sh.u * 0.45, y - sh.u * 0.02);
    ctx.quadraticCurveTo(s.x, y + sh.u * 0.05, x0, y + sh.u * 0.08);
    ctx.fill();
  }

  function drawShafts(t) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let k = 0; k < 4; k++) {
      const x0 = W * (0.42 + k * 0.12), w = W * (0.03 + 0.02 * (k % 2));
      const a = (L.night ? 0.035 : 0.06) * (0.7 + 0.3 * Math.sin(t * 0.0003 + k * 2));
      const sg = ctx.createLinearGradient(0, 0, 0, H * 0.85);
      sg.addColorStop(0, rgba(L.shaft, a));
      sg.addColorStop(1, rgba(L.shaft, 0));
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0 + w, 0);
      ctx.lineTo(x0 - W * 0.12 + w * 2.4, H * 0.85);
      ctx.lineTo(x0 - W * 0.12, H * 0.85);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawMotes(t, dt) {
    ctx.save();
    ctx.globalCompositeOperation = L.night ? "lighter" : "screen";
    const night = L.night ? (season === "summer" ? MOTE_SUMMER : season === "winter" ? MOTE_WINTER : MOTE_COLS) : null;
    for (const m of motes) {
      const n = m.seed;
      m.vx += noise1(t * 0.0002 + n, 1) * 6 * dt;
      m.vy += noise1(t * 0.0002 + n + 9, 2) * 6 * dt;
      // Motes lean toward a finger or the cursor and circle it, without crowding it.
      if (pointer.active) {
        const dx = pointer.x - m.x, dy = pointer.y - m.y, d = Math.hypot(dx, dy) || 1;
        if (d < U * 0.35) {
          const pull = d > U * 0.06 ? 10 : -10;
          m.vx += (dx / d) * pull * dt + (-dy / d) * 8 * dt;
          m.vy += (dy / d) * pull * dt + (dx / d) * 8 * dt;
        }
      }
      m.vx *= 1 - dt * 0.8;
      m.vy *= 1 - dt * 0.8;
      m.x += m.vx * dt * m.z;
      m.y += (m.vy * dt - 2 * dt) * m.z;
      if (m.x < -20) m.x = W + 20; if (m.x > W + 20) m.x = -20;
      if (m.y < H * 0.1) m.y = H * 0.95; if (m.y > H * 0.98) m.y = H * 0.12;
      const tw = 0.5 + 0.5 * Math.sin(t * 0.0015 + m.ph);
      dot(m.x, m.y, (2 + 3 * m.z) * (W < 700 ? 0.9 : 1), night ? night[m.c % night.length] : [255, 250, 225], (L.night ? 0.55 : 0.3) * tw);
    }
    ctx.restore();
  }

  function drawFall(dt) {
    if (!fall.length) return;
    ctx.save();
    for (const f of fall) {
      f.y += f.v * dt * f.s;
      f.x += Math.sin(f.y * 0.01 + f.r) * 10 * dt;
      f.r += dt * 0.8;
      if (f.y > H + 10) { f.y = -10; f.x = Math.random() * W; }
      if (season === "winter") {
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = L.night ? "#dfe8ff" : "#ffffff";
        ctx.beginPath();
        ctx.arc(f.x, f.y, 1.2 + f.s, 0, TAU);
        ctx.fill();
      } else if (season === "autumn") {
        // Maple leaves that carry a little light of their own after dark.
        const c = L.night ? [255, 170, 90] : [214, 96, 40];
        ctx.globalAlpha = L.night ? 0.55 : 0.85;
        ctx.fillStyle = rgba(c);
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.r);
        ctx.scale(Math.cos(f.r * 1.7), 1);
        const s = 4 * f.s;
        ctx.beginPath();
        for (let k = 0; k < 10; k++) { const a = (k / 10) * TAU, r = k % 2 ? s * 0.45 : s; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
        ctx.fill();
        ctx.restore();
      } else {
        // Spring: floating seed fluff.
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = "#fffbe8";
        ctx.beginPath();
        ctx.arc(f.x, f.y, 1.4 * f.s, 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  /* ── the panel: same clock, scrubber and seasons as Koi Valley and The Pond ─ */

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const timeEl = document.getElementById("fo-time"), phaseEl = document.getElementById("fo-phase"), slider = document.getElementById("fo-hour");
  function phaseOf(h) {
    if (h < 5) return "Deep night"; if (h < 6.3) return "Before dawn"; if (h < 8) return "Sunrise";
    if (h < 11.5) return "Morning"; if (h < 14.5) return "Midday"; if (h < 17.3) return "Afternoon";
    if (h < 18.9) return "Golden hour"; if (h < 20.2) return "Dusk"; return "Night";
  }
  // The day follows the clock until someone scrubs; 50 seconds after the last scrub it time-lapses
  // forward to the real time and follows the clock again.
  let lastScrub = performance.now(), tween = null, clockTick = 0;
  function setHour(h, fromSlider) {
    hour = ((h % 24) + 24) % 24;
    const hh = Math.floor(hour), mm = Math.floor((hour - hh) * 60);
    if (timeEl) timeEl.textContent = String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
    if (phaseEl) phaseEl.textContent = phaseOf(hour);
    if (slider && !fromSlider) slider.value = hour.toFixed(2);
    document.documentElement.dataset.night = lightAt(hour).spirit > 0.6 ? "1" : "0";
  }
  function scrubTo(h) { live = false; tween = null; lastScrub = performance.now(); setHour(h); }
  function stepClock(now, dt) {
    if (tween) {
      const p = clamp((now - tween.t0) / tween.dur, 0, 1), e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
      setHour(tween.from + tween.d * e);
      if (p >= 1) { tween = null; live = true; }
    } else if (live && (clockTick += dt) > 20) { clockTick = 0; setHour(nowHour()); }
    else if (!live && now - lastScrub > 50000) {
      const ahead = (((nowHour() - hour) % 24) + 24) % 24;
      tween = { from: hour, d: ahead, t0: now, dur: reduced.matches ? 1 : clamp(ahead * 450, 2500, 9000) };
    }
  }
  setHour(hour);
  if (slider) {
    slider.addEventListener("input", () => scrubTo(+slider.value));
    // Endless scrub: dragging past either end wraps around and keeps going.
    let drag = null;
    slider.addEventListener("pointerdown", (e) => {
      e.preventDefault(); slider.focus(); slider.setPointerCapture(e.pointerId);
      const r = slider.getBoundingClientRect();
      drag = { id: e.pointerId, x: e.clientX, w: r.width, h: clamp((e.clientX - r.left) / r.width, 0, 1) * 24 };
      scrubTo(drag.h);
    });
    slider.addEventListener("pointermove", (e) => { if (drag && e.pointerId === drag.id) scrubTo(drag.h + ((e.clientX - drag.x) / drag.w) * 24); });
    const end = (e) => { if (drag && e.pointerId === drag.id) drag = null; };
    slider.addEventListener("pointerup", end); slider.addEventListener("pointercancel", end);
    slider.addEventListener("keydown", (e) => {
      const step = e.shiftKey ? 1 : 0.25;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); scrubTo(hour + step); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); scrubTo(hour - step); }
    });
  }
  const seasonChips = [...document.querySelectorAll("[data-season]")];
  function syncSeason() {
    for (const b of seasonChips) b.setAttribute("aria-pressed", b.dataset.season === season ? "true" : "false");
    document.documentElement.dataset.season = season;
    if (seasonNow) seasonNow.textContent = season[0].toUpperCase() + season.slice(1);
  }
  // On phones the panel folds into a pill showing the time and season, like Koi Valley's clock.
  const panel = document.querySelector(".fo-panel"), toggle = document.getElementById("fo-toggle"), seasonNow = document.getElementById("fo-season");
  if (panel && toggle) toggle.addEventListener("click", () => {
    if (innerWidth > 600) return;
    const open = !panel.classList.contains("open");
    panel.classList.toggle("open", open); toggle.setAttribute("aria-expanded", String(open));
  });
  for (const b of seasonChips) b.addEventListener("click", () => { season = b.dataset.season; syncSeason(); placeFall(); placeMotes(); });
  syncSeason();

  /* ── setup ────────────────────────────────────────────────────────── */

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    U = Math.min(W, H * 1.2);
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    layers.length = 0;
    for (let i = 0; i < NL; i++) layers.push(makeLayer(i));
    placeSpirits();
    placeMotes();
    placeMushrooms();
    placeMist();
    placeFall();
  }
  resize();
  let rt = 0;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });

  canvas.addEventListener("pointermove", (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; });
  canvas.addEventListener("pointerleave", () => { pointer.active = false; });
  // A lifted finger leaves the motes to drift on their own again.
  canvas.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") pointer.active = false; });
  canvas.addEventListener("pointerdown", (e) => {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
    let hitSpirit = null;
    for (const s of spirits) {
      if (s.state === "away") continue;
      const sh = shapeOf(s);
      for (const q of sh.parts) if (Math.hypot((q.ax + q.bx) / 2 - e.clientX, (q.ay + q.by) / 2 - e.clientY) < q.ra + sh.u * 0.08) hitSpirit = s;
    }
    if (hitSpirit) {
      scatter(hitSpirit, e.clientX, e.clientY);
      hitSpirit.state = "rest";
      hitSpirit.timer = 2.5;
      hitSpirit.grazes = false;
      const cap = document.getElementById("fo-caption");
      if (cap) { cap.textContent = NAMES[hitSpirit.kind]; cap.style.left = e.clientX + "px"; cap.style.top = e.clientY + "px"; cap.classList.add("on"); clearTimeout(cap.t); cap.t = setTimeout(() => cap.classList.remove("on"), 2200); }
    } else bloom(e.clientX, e.clientY);
  });

  requestAnimationFrame(frame);
})();
