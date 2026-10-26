/* ASCII aquarium: a tank seen through the glass, drawn as shaded character tiles. */
(function (global) {
  "use strict";

  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = (e0, e1, x) => {
    const t = clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };
  const fract = (x) => x - Math.floor(x);
  function hash2(x, y) {
    let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  const mixc = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

  /* ── hit record ───────────────────────────────────────────────────── */

  // A sample writes the lit colour, its coverage, how bright it is (picks the glyph),
  // optionally a fixed glyph, and for glyph-drawn creatures the glyph's own colour.
  const hit = { r: 0, g: 0, b: 0, a: 1, l: 1, ch: "", glow: 0, ink: null };
  function put(col, l, a, ch, glow) {
    hit.r = col[0] * l;
    hit.g = col[1] * l;
    hit.b = col[2] * l;
    hit.l = l;
    hit.a = a === undefined ? 1 : a;
    hit.ch = ch || "";
    hit.glow = glow || 0;
    hit.ink = null;
    return true;
  }

  // Light comes down through the surface, a little from the left. The local x axis is
  // flipped for creatures facing left, so `FACE` turns a local normal back into screen space.
  let FACE = 1;
  function lit(nx, ny) {
    const sx = nx * FACE;
    const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
    return 0.36 + 0.64 * clamp(sx * -0.3 + ny * -0.72 + nz * 0.62, 0, 1);
  }
  // A line glyph that follows a local direction, turned to screen space.
  function lineGlyph(dx, dy) {
    dx *= FACE;
    const d = Math.hypot(dx, dy) || 1;
    if (Math.abs(dy) < 0.38 * d) return "-";
    if (Math.abs(dx) < 0.38 * d) return "|";
    return dx * dy > 0 ? "\\" : "/";
  }
  function inPoly(p, x, y) {
    let inside = false;
    for (let i = 0, j = p.length - 2; i < p.length; j = i, i += 2) {
      const xi = p[i], yi = p[i + 1], xj = p[j], yj = p[j + 1];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  // Squash a fin polygon towards its root along x, as the tail beats side to side.
  function beat(p, rootX, k) {
    const out = p.slice();
    for (let i = 0; i < out.length; i += 2) out[i] = rootX + (out[i] - rootX) * k;
    return out;
  }

  /* ── local frame ──────────────────────────────────────────────────── */

  // Shapes are drawn in body lengths: x forward (snout near +0.5), y down.
  const F = { x: 0, y: 0 };

  /* ── fish bodies ──────────────────────────────────────────────────── */

  // Side profile: a round snout swelling to the shoulder, tapering to the tail stalk.
  function prof(u, a, b) {
    if (u <= 0 || u >= 1) return 0;
    const m = a / (a + b);
    return (Math.pow(u, a) * Math.pow(1 - u, b)) / (Math.pow(m, a) * Math.pow(1 - m, b));
  }
  // Test the body of a fish. Leaves u (0 at the snout) and v (-1 back, 1 belly) in B.
  const B = { u: 0, v: 0, h: 0 };
  function body(x, y, H, a, b, end, ped, yc) {
    const u = 0.5 - x;
    if (u < 0 || u > end) return false;
    const h = Math.max(H * prof(u / 0.98, a, b), ped);
    const v = (y - (yc || 0)) / h;
    if (Math.abs(v) > 1) return false;
    B.u = u;
    B.v = v;
    B.h = h;
    return true;
  }
  // Shade a body cell: rounded across, a little brighter towards the snout.
  function bodyLit() {
    const nx = B.u < 0.1 ? (1 - B.u / 0.1) * 0.7 : 0;
    return lit(nx, B.v * 0.85);
  }
  function fin(col, l, a, dx, dy) {
    return put(col, l, a === undefined ? 0.92 : a, lineGlyph(dx || 0, dy || 0));
  }

  /* Whale shark: a broad flat head, white spots between pale stripes, ridges along the flank. */
  const WHALE = { back: [38, 60, 84], belly: [200, 206, 210], spot: [222, 230, 234], fin: [44, 66, 90] };
  const whaleShark = {
    box: [0.56, 0.3],
    shape(c) {
      const { x, y } = F;
      const k = 0.72 + 0.28 * Math.cos(c.phase);
      if (inPoly([0.25, 0.05, 0.11, 0.22, 0.06, 0.21, 0.16, 0.06], x, y)) return fin(WHALE.fin, 0.78, 0.95, x - 0.25, y - 0.05);
      if (body(x, y, 0.12, 0.32, 1.2, 0.8, 0.018, 0.006)) {
        const { u, v } = B;
        const l = bodyLit();
        if (Math.abs(u - 0.035) < 0.012 && Math.abs(v + 0.15) < 0.12) return put([16, 20, 24], 1, 1, "o");
        if (u < 0.035 && v > 0.15 && v < 0.4) return put([20, 26, 30], 0.7, 1, "-");
        if (u > 0.16 && u < 0.25 && Math.abs(v) < 0.55 && fract((u - 0.16) * 62) < 0.28) return put([24, 36, 50], l, 1, "|");
        const col = mixc(WHALE.back, WHALE.belly, smooth(0.05, 0.5, v));
        if (v < 0.35) {
          if (Math.abs(v + 0.42) < 0.07 || Math.abs(v - 0.02) < 0.06) return put(mixc(col, WHALE.spot, 0.3), l, 1, "-");
          const gu = u * 40, gv = (v + 1) * 4.2;
          const fu = fract(gu + (Math.floor(gv) % 2) * 0.5) - 0.5, fv = fract(gv) - 0.5;
          if (u > 0.2 && Math.abs(fract(gu * 0.5) - 0.5) > 0.47) return put(mixc(col, WHALE.spot, 0.4), l, 1, "|");
          if (fu * fu + fv * fv < 0.07) return put(WHALE.spot, 0.6 + 0.4 * l, 1, "o");
        }
        return put(col, l, 1);
      }
      if (inPoly([0.09, -0.08, -0.07, -0.25, -0.1, -0.24, -0.07, -0.05], x, y)) return fin(WHALE.fin, 0.82, 0.95, x - 0.05, y + 0.08);
      if (inPoly([-0.2, -0.03, -0.26, -0.09, -0.28, -0.02], x, y)) return fin(WHALE.fin, 0.8);
      if (inPoly([-0.1, 0.05, -0.17, 0.12, -0.19, 0.05], x, y)) return fin(WHALE.fin, 0.7);
      if (inPoly(beat([-0.28, -0.016, -0.5, -0.27, -0.44, -0.04, -0.47, 0.15, -0.28, 0.016], -0.29, k), x, y))
        return fin(WHALE.fin, 0.8, 0.95, x + 0.29, y);
      return false;
    },
  };

  /* Hammerhead: the hammer seen a little from below, eyes at both tips; a tall sickle dorsal. */
  const HAMMER = { back: [104, 112, 110], belly: [206, 206, 196], fin: [110, 118, 114], eye: [18, 20, 22] };
  const hammerhead = {
    box: [0.56, 0.3],
    shape(c) {
      const { x, y } = F;
      const k = 0.72 + 0.28 * Math.cos(c.phase);
      // Cephalofoil: a flat blade across the head, foreshortened into a tall thin oval.
      const hx = (x - 0.455) / 0.045, hy = y / 0.13;
      if (hx * hx + hy * hy <= 1) {
        if (Math.abs(hy) > 0.82) return put(HAMMER.eye, 1, 1, "o");
        return put(mixc(HAMMER.back, HAMMER.belly, smooth(-0.2, 0.6, hy)), lit(hx * 0.6, hy * 0.5), 1);
      }
      if (inPoly([0.22, 0.05, 0.05, 0.19, 0.01, 0.18, 0.13, 0.05], x, y)) return fin(HAMMER.fin, 0.76, 0.95, x - 0.22, y - 0.05);
      if (body(x, y, 0.075, 0.5, 1.25, 0.8, 0.012, 0.004)) {
        const { u, v } = B;
        const l = bodyLit();
        if (u > 0.15 && u < 0.24 && Math.abs(v) < 0.5 && fract((u - 0.15) * 55) < 0.3) return put([60, 66, 64], l, 1, "|");
        return put(mixc(HAMMER.back, HAMMER.belly, smooth(0.1, 0.55, v)), l, 1);
      }
      if (inPoly([0.13, -0.06, -0.01, -0.29, -0.06, -0.27, -0.04, -0.05], x, y)) return fin(HAMMER.fin, 0.86, 0.95, x - 0.1, y + 0.06);
      if (inPoly([-0.22, -0.02, -0.26, -0.07, -0.28, -0.015], x, y)) return fin(HAMMER.fin, 0.8);
      if (inPoly([-0.08, 0.04, -0.14, 0.1, -0.16, 0.04], x, y)) return fin(HAMMER.fin, 0.7);
      if (inPoly(beat([-0.29, -0.012, -0.53, -0.2, -0.48, -0.16, -0.42, -0.03, -0.44, 0.09, -0.29, 0.012], -0.3, k), x, y))
        return fin(HAMMER.fin, 0.82, 0.95, x + 0.3, y);
      return false;
    },
  };

  /* Sea turtle: a domed shell of plates over a pale plastron, front flippers sweeping slowly. */
  const TURTLE = { shell: [112, 80, 42], plate: [172, 124, 60], seam: [50, 32, 18], skin: [130, 136, 98], scale: [196, 192, 150], belly: [214, 196, 140] };
  const PLATES = [[-0.2, -0.75], [0.25, -0.75], [0.65, -0.55], [-0.6, -0.55], [-0.45, -0.18], [0, -0.25], [0.45, -0.2], [-0.85, -0.15], [0.85, -0.1]];
  function flipper(x, y, rootX, rootY, ang, len, w0, w1) {
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const dx = x - rootX, dy = y - rootY;
    const u = dx * ca + dy * sa;
    const v = -dx * sa + dy * ca;
    if (u < 0 || u > len) return -2;
    const t = u / len;
    const w = mix(w0, w1, t) * Math.sin(Math.PI * Math.min(1, 0.15 + t));
    if (Math.abs(v) > w) return -2;
    return v / w;
  }
  const turtle = {
    box: [0.62, 0.45],
    shape(c) {
      const { x, y } = F;
      const sweep = Math.sin(c.phase * 0.7);
      // Near-side front flipper, in front of everything.
      const v = flipper(x, y, 0.16, 0.05, 2.75 - 0.45 * sweep, 0.42, 0.075, 0.03);
      if (v > -2) {
        const spot = hash2(Math.floor(x * 70 + 99), Math.floor(y * 70 + 99)) < 0.3;
        return put(spot ? TURTLE.scale : TURTLE.skin, lit(0, v * 0.5) * 0.95, 1, spot ? "." : "");
      }
      // Head and neck.
      const qh = ((x - 0.42) / 0.11) ** 2 + ((y - 0.03) / 0.075) ** 2;
      if (qh < 1 || (x > 0.26 && x < 0.36 && Math.abs(y - 0.04) < 0.05)) {
        if (Math.abs(x - 0.45) < 0.016 && Math.abs(y - 0.005) < 0.016) return put([20, 20, 16], 1, 1, "o");
        const cell = hash2(Math.floor(x * 90), Math.floor(y * 90 + 50)) < 0.35;
        return put(cell ? TURTLE.scale : TURTLE.skin, lit((x - 0.41) * 4, (y - 0.03) * 6), 1, cell ? ":" : "");
      }
      // Shell: a dome of plates over a flat plastron.
      const fx = x / 0.33, fy = y / 0.21;
      if (fy <= 0.12 && fx * fx + fy * fy <= 1) {
        const l = lit(fx * 0.7, fy * 0.8);
        if (fy > -0.04) return put(TURTLE.seam, l, 1, "_");
        let d1 = 9, d2 = 9;
        for (const p of PLATES) {
          const d = (fx - p[0]) ** 2 + (fy - p[1]) ** 2;
          if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
        }
        if (Math.sqrt(d2) - Math.sqrt(d1) < 0.08) return put(TURTLE.seam, l, 1, "");
        return put(mixc(TURTLE.plate, TURTLE.shell, smooth(0, 0.14, d1)), l, 1);
      }
      if (y > 0 && y < 0.07 && Math.abs(x) < 0.29) return put(TURTLE.belly, lit(0, 0.4), 1, "=");
      // Back flipper and the far-side flipper, darker behind the shell.
      if (flipper(x, y, -0.26, 0.04, 2.6 - 0.2 * sweep, 0.16, 0.05, 0.02) > -2) return put(TURTLE.skin, 0.8, 1, "");
      if (flipper(x, y, 0.1, 0.0, 3.3 + 0.45 * sweep, 0.36, 0.06, 0.025) > -2) return put(TURTLE.skin, 0.55, 1, "");
      if (x < -0.31 && x > -0.4 && Math.abs(y - 0.03) < 0.02) return put(TURTLE.skin, 0.75, 1, "");
      return false;
    },
  };

  /* Blue-spotted stingray: a flat disc seen a little from above, its edge rippling, a ribbon tail. */
  const STING = { disc: [150, 122, 70], under: [206, 196, 170], spot: [64, 152, 236], tail: [70, 120, 190] };
  const stingray = {
    box: [0.62, 0.2],
    shape(c) {
      const { x, y } = F;
      const cx = (x - 0.18) / 0.32;
      if (Math.abs(cx) <= 1) {
        const wave = 0.022 * Math.sin(c.phase * 1.4 - cx * 5) * Math.abs(cx);
        const top = -0.13 * Math.sqrt(1 - cx * cx) + wave;
        const bot = 0.04 * Math.sqrt(1 - cx * cx) + wave;
        if (y >= top && y <= bot) {
          if (y > wave) return put(STING.under, 0.8, 1, "-");
          const t = (y - wave) / (top - wave || -1);
          const l = lit(cx * 0.5, -t * 0.7);
          if (Math.abs(cx - 0.38) < 0.06 && t > 0.5 && t < 0.9) return put([30, 26, 18], 1, 1, "o");
          const gx = x * 46, gy = y * 46;
          const fx = fract(gx) - 0.5, fy = fract(gy + (Math.floor(gx) % 2) * 0.5) - 0.5;
          if (t < 0.92 && hash2(Math.floor(gx), Math.floor(gy + (Math.floor(gx) % 2) * 0.5)) < 0.45 && fx * fx + fy * fy < 0.08)
            return put(STING.spot, 0.6 + 0.4 * l, 1, "o", 0.15);
          return put(STING.disc, l, 1);
        }
      }
      // Tail: a tapering ribbon with blue edges.
      if (x < -0.12 && x > -0.62) {
        const t = (-0.12 - x) / 0.5;
        const ty = 0.01 + 0.02 * Math.sin(c.phase - t * 3) * t;
        const w = 0.016 * (1 - t) + 0.003;
        if (Math.abs(y - ty) < w) return put(Math.abs(y - ty) > w * 0.5 && t < 0.6 ? STING.tail : STING.disc, 0.85, 1, "-");
      }
      return false;
    },
  };

  /* Manta ray: seen a little from below, white belly, dark wing edges, wings beating slowly. */
  const MANTA = { back: [32, 38, 52], belly: [222, 226, 230], edge: [60, 68, 84] };
  const manta = {
    box: [0.7, 0.42],
    shape(c) {
      const { x, y } = F;
      const flap = 0.13 * Math.sin(c.phase * 0.8);
      // Cephalic horns.
      if (x > 0.22 && x < 0.3 && Math.abs(Math.abs(y) - 0.035) < 0.014) return put(MANTA.back, 0.8, 1, "-");
      // Wings: the far one above, the near one below, both rising and falling together.
      for (const s of [-1, 1]) {
        // An arrowhead: leading edge swept back to the tip, trailing edge curving in to the tail root.
        const tipY = s * 0.27 + flap;
        const wing = [0.25, 0, 0.18, s * 0.05, 0.02, s * 0.15 + flap * 0.6, -0.16, tipY, -0.21, tipY * 0.95, -0.16, s * 0.12 + flap * 0.4, -0.22, s * 0.04, -0.26, 0];
        if (inPoly(wing, x, y)) {
          const t = Math.abs(y - flap * 0.3) / 0.27;
          const l = lit(0, s * 0.3 - flap);
          const edge = t > 0.72 || x > 0.21 - Math.abs(y) * 0.7;
          if (Math.abs(y) < 0.05 && x > 0.0 && x < 0.12 && fract(x * 60) < 0.3) return put([40, 44, 54], l, 1, "|");
          return put(edge ? MANTA.edge : mixc(MANTA.belly, MANTA.edge, smooth(0.45, 0.75, t)), l, 1, edge ? lineGlyph(-0.3, s) : "");
        }
      }
      // Whip tail.
      if (x < -0.2 && x > -0.68 && Math.abs(y - 0.015 * Math.sin(c.phase - x * 6)) < 0.008 + (0.012 * (x + 0.68)) / 0.48)
        return put(MANTA.back, 0.8, 1, "-");
      return false;
    },
  };

  /* Sardine: a small silver fish with a blue back and a forked tail, for schools. */
  const SARDINE = { back: [56, 100, 150], flank: [214, 226, 238], fin: [150, 170, 190] };
  const sardine = {
    box: [0.56, 0.16],
    shape(c) {
      const { x, y } = F;
      const k = 0.7 + 0.3 * Math.cos(c.phase * 2);
      if (body(x, y, 0.12, 0.5, 1.1, 0.8, 0.024, 0)) {
        const { u, v } = B;
        if (Math.abs(u - 0.08) < 0.03 && Math.abs(v + 0.1) < 0.3) return put([16, 20, 28], 1, 1, "o");
        const col = v < -0.25 ? SARDINE.back : SARDINE.flank;
        return put(col, bodyLit(), 1, "", v > -0.2 && v < 0.5 ? 0.06 : 0);
      }
      if (inPoly(beat([-0.29, -0.02, -0.5, -0.13, -0.42, 0, -0.5, 0.13, -0.29, 0.02], -0.3, k), x, y)) return fin(SARDINE.fin, 0.85, 0.9, x + 0.3, y);
      return false;
    },
  };

  /* Jellyfish: a domed bell of dense glyphs, thin tentacles and frilly arms hanging below,
     drawn in glyphs only over a faint wash, so they read as see-through. */
  const JELLY_RAMP = "'.:;otS%X8@";
  function ink(col, density, a, glyphs) {
    const g = glyphs || JELLY_RAMP;
    put(col, 0.55, a, g[clamp(Math.floor(density * g.length), 0, g.length - 1)], 0.2);
    hit.ink = col;
    return true;
  }
  function pulse(ph) {
    // Quick contraction, slow relax.
    const p = fract(ph / TAU);
    return p < 0.25 ? Math.sin((p / 0.25) * Math.PI * 0.5) : Math.cos(((p - 0.25) / 0.75) * Math.PI * 0.5);
  }
  // In the jelly's frame the bell points up (-y); its tilt is already taken out.
  function jelly(c, pal, arms, tents, armLen, tentLen) {
    const hx = -F.y, hy = F.x;
    const p = pulse(c.phase);
    const bw = 0.5 * (1 + 0.08 * p), bh = 0.36 * (1 - 0.1 * p);
    const v = hy / bw;
    const rim = 0.05 * (1 - v * v);
    if (Math.abs(v) <= 1 && hx >= -rim) {
      const u = (hx + rim) / (bh + rim);
      const r = u * u + v * v;
      if (r <= 1) {
        // Dense at the crown and the edges, thinner inside.
        const edge = smooth(0.62, 1, r);
        const crown = smooth(0.55, 1, u);
        let d = 0.35 + 0.45 * edge + 0.25 * crown + 0.15 * (hash2(Math.floor(hx * 90 + 300), Math.floor(hy * 90 + 300)) - 0.5);
        let col = pal.bell;
        for (let i = 0; i < 4; i++) {
          const gx = 0.42 * bh, gy = (i - 1.5) * 0.17 * bw;
          if (((hx - gx) / 0.06) ** 2 + ((hy - gy) / 0.065) ** 2 < 1) { col = pal.mark; d += 0.2; }
        }
        if (u < 0.12 && Math.abs(fract(v * 9) - 0.5) < 0.18) d *= 0.4;
        return ink(col, clamp(d, 0, 1), 0.14 + 0.1 * edge);
      }
    }
    const back = -hx;
    if (back < 0) return false;
    for (let i = 0; i < arms; i++) {
      const off = (i - (arms - 1) / 2) * 0.09;
      const y = off * (1 + back * 0.3) + 0.05 * Math.sin(back * 5 - c.phase * 0.6 + i * 1.3) * smooth(0, 0.4, back);
      const w = (0.04 + 0.015 * Math.sin(back * 26 + i)) * (1 - back / (armLen * 1.15));
      if (back < armLen && Math.abs(hy - y) < w) return ink(pal.arm, 0.45 + 0.4 * (1 - back / armLen), 0.12);
    }
    for (let i = 0; i < tents; i++) {
      const off = (i / (tents - 1) - 0.5) * 0.92 * bw * 2;
      const y = off * (1 + back * 0.12) + 0.05 * Math.sin(back * 4.5 - c.phase * 0.5 + i * 1.9) * smooth(0, 0.5, back);
      const len = tentLen * (0.65 + 0.35 * hash2(i, 7));
      if (back < len && Math.abs(hy - y) < 0.011) return ink(pal.tent, 0.15 + 0.35 * (1 - back / len), 0.05, "'.:;|");
    }
    return false;
  }
  const MOON_INK = { bell: [196, 168, 232], mark: [240, 170, 220], arm: [214, 190, 240], tent: [180, 160, 220] };
  const NETTLE_INK = { bell: [238, 160, 84], mark: [250, 200, 130], arm: [244, 226, 196], tent: [210, 84, 70] };
  const moonJelly = { jelly: true, box: [0.55, 1.2], shape: (c) => jelly(c, MOON_INK, 4, 12, 0.55, 1.1) };
  const seaNettle = { jelly: true, box: [0.55, 1.9], shape: (c) => jelly(c, NETTLE_INK, 4, 10, 1.3, 1.8) };

  /* Floating on the surface, seen from the side: a lotus cupped above its pad, and cherry blossoms. */
  const LOTUS = { pad: [62, 118, 56], under: [40, 80, 44], petal: [240, 166, 190], base: [252, 232, 236], heart: [236, 196, 70] };
  const lotus = {
    surface: true,
    box: [0.55, 0.4],
    shape() {
      const { x, y } = F;
      // Petals: pointed, fanning out from the base, tips leaning outward.
      for (let i = -3; i <= 3; i++) {
        const lean = i * 0.055, h = 0.3 - Math.abs(i) * 0.045;
        const t = -y / h;
        if (t < 0 || t > 1) continue;
        const cx = lean * t * 1.4;
        const w = 0.06 * Math.sin(Math.PI * Math.min(1, 0.25 + t * 0.85));
        if (Math.abs(x - cx) < w) {
          const col = mixc(LOTUS.base, LOTUS.petal, smooth(0.15, 0.9, t));
          const shade = Math.abs(i) % 2 ? 0.85 : 1;
          return put(col, lit(((x - cx) / w) * 0.6, -0.4) * shade, 1, Math.abs(x - cx) > w * 0.7 ? "|" : "");
        }
      }
      // Pad: a thin flat disc on the water, its underside darker.
      if (Math.abs(x) < 0.5 && y > -0.012 && y < 0.03 * Math.sqrt(1 - (x / 0.5) ** 2)) {
        const under = y > 0.012;
        return put(under ? LOTUS.under : LOTUS.pad, under ? 0.7 : 1, 1, under ? "" : "=");
      }
      return false;
    },
  };
  const SAKURA = { petal: [248, 200, 214], deep: [232, 150, 176], heart: [246, 220, 120] };
  const sakura = {
    surface: true,
    box: [0.55, 0.25],
    shape(c) {
      const { x, y } = F;
      // A five-petal flower seen at a low angle: a flat ellipse with notched petals.
      const fy = y / 0.3;
      const r = Math.hypot(x, fy);
      if (r < 0.08) return put(SAKURA.heart, 1, 1, "*");
      const ang = Math.atan2(fy, x) - c.spin;
      const sec = fract((ang / TAU) * 5) - 0.5;
      const R = (0.5 - 0.06 * Math.exp(-((sec * 14) ** 2))) * (1 - 1.1 * sec * sec);
      if (r > R) return false;
      return put(mixc(SAKURA.deep, SAKURA.petal, smooth(0.08, 0.3, r)), lit(x * 0.5, -0.5), 1, Math.abs(sec) > 0.42 ? "|" : "");
    },
  };

  /* Scenery on the sand: kelp that sways, coral and rocks. Props are rooted at (0, 0) and grow up. */
  const KELP = { stem: [74, 108, 46], blade: [112, 146, 58] };
  const kelp = {
    prop: true,
    box: [0.35, 1.05],
    shape(c, t) {
      const { x, y } = F;
      const up = -y;
      if (up < 0 || up > 1) return false;
      const sway = (Math.sin(t * 0.35 + c.seed + up * 2.2) * 0.07 + Math.sin(t * 0.6 + c.seed * 2 + up * 4) * 0.02) * up * up * 1.6;
      const sx = x - sway;
      if (Math.abs(sx) < 0.012) return put(KELP.stem, 0.8, 1, "|");
      // Blades on alternating sides.
      const n = Math.floor(up * 9 + c.seed);
      const side = n % 2 ? 1 : -1;
      const local = fract(up * 9 + c.seed);
      const len = 0.11 * (1 - up * 0.4);
      const bx = sx * side;
      if (bx > 0 && bx < len) {
        const along = bx / len;
        const centre = 0.35 - along * 0.25;
        const w = 0.22 * Math.sin(Math.PI * along) + 0.04;
        if (Math.abs(local - centre) < w) return put(mixc(KELP.blade, KELP.stem, along * 0.5), lit(0, (local - centre) * 2), 0.95, along > 0.3 ? lineGlyph(side, -0.4) : "");
      }
      return false;
    },
  };
  const coral = {
    prop: true,
    box: [0.6, 0.65],
    shape(c) {
      // Branching coral from tapered tubes, in body lengths.
      const { x, y } = F;
      for (const br of c.branches) {
        const [ax, ay, bx, by, r] = br;
        const ex = bx - ax, ey = by - ay;
        const t = clamp(((x - ax) * ex + (y - ay) * ey) / (ex * ex + ey * ey), 0, 1);
        const d = Math.hypot(x - ax - ex * t, y - ay - ey * t);
        const w = r * (1 - t * 0.5);
        if (d < w) return put(c.col, lit(0, -0.4) * (0.75 + 0.25 * (1 - d / w)), 1, t > 0.85 ? "o" : "");
      }
      return false;
    },
  };
  const rock = {
    prop: true,
    box: [0.55, 0.4],
    shape(c) {
      const { x, y } = F;
      const r = Math.hypot(x / 0.5, (y + 0.12) / 0.32) + 0.08 * Math.sin(Math.atan2(y, x) * 5 + c.seed);
      if (r > 1 || y > 0.02) return false;
      return put(c.col, lit(x * 0.8, (y + 0.12) * 2), 1, hash2(Math.floor(x * 40 + 99), Math.floor(y * 40 + 99)) < 0.2 ? ":" : "");
    },
  };

  const SPECIES = { whaleShark, hammerhead, turtle, stingray, manta, sardine, moonJelly, seaNettle, lotus, sakura, kelp, coral, rock };

  /* ── renderer ─────────────────────────────────────────────────────── */

  // Sparse glyphs on lit skin, dense ones in shadow.
  const RAMP = ":;t%SX8#@";
  const FONT = '"IBM Plex Mono", "DejaVu Sans Mono", ui-monospace, Menlo, monospace';

  class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.tileCanvas = document.createElement("canvas");
      this.tileCtx = this.tileCanvas.getContext("2d");
      this.styles = new Map();
      this.night = 0;
    }
    resize(w, h, dpr, cell) {
      this.w = w;
      this.h = h;
      this.dpr = dpr;
      this.cw = cell;
      this.ch = Math.round(cell * 1.6);
      this.cols = Math.ceil(w / this.cw);
      this.rows = Math.ceil(h / this.ch);
      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
      this.tileCanvas.width = this.cols;
      this.tileCanvas.height = this.rows;
      this.img = this.tileCtx.createImageData(this.cols, this.rows);
      const n = this.cols * this.rows;
      this.tr = new Float32Array(n);
      this.tg = new Float32Array(n);
      this.tb = new Float32Array(n);
      this.gl = new Array(n).fill("");
      this.gr = new Float32Array(n);
      this.gg = new Float32Array(n);
      this.gb = new Float32Array(n);
    }

    // Water from the bright surface down to the deep, light shafts from above, the sand floor.
    background(t, tank) {
      const { cols, rows, cw, ch, tr, tg, tb, gl, gr, gg, gb } = this;
      const n = this.night;
      const surf = tank.surfaceY;
      for (let q = 0; q < cols; q++) {
        const x = q * cw;
        const floor = tank.floorAt(x);
        for (let r = 0; r < rows; r++) {
          const i = r * cols + q;
          const y = r * ch;
          gl[i] = "";
          if (y < surf - 2) {
            // Above the water: the dim room beyond the tank.
            tr[i] = mix(14, 4, n); tg[i] = mix(40, 10, n); tb[i] = mix(50, 18, n);
            continue;
          }
          const depth = clamp((y - surf) / (this.h - surf), 0, 1);
          if (y > floor) {
            // Sand: warm, rippled, darker further down.
            const k = clamp((y - floor) / 60, 0, 1);
            const rip = Math.sin(x * 0.09 + Math.sin(y * 0.07) * 2 + y * 0.02);
            const sand = mixc([186, 160, 112], [120, 102, 72], k * 0.6);
            const dim = mix(1, 0.3, n);
            tr[i] = sand[0] * dim; tg[i] = sand[1] * dim; tb[i] = sand[2] * dim;
            if (rip > 0.75 || hash2(q, r) < 0.05) {
              gl[i] = rip > 0.75 ? "~" : hash2(r, q) < 0.5 ? "." : ",";
              gr[i] = tr[i] * 0.7; gg[i] = tg[i] * 0.7; gb[i] = tb[i] * 0.7;
            }
            continue;
          }
          // Light shafts: soft slanted bands drifting slowly, fading with depth.
          const sx = x + (y - surf) * 0.32;
          const shaft = Math.pow(Math.max(0, 0.5 + 0.5 * Math.sin(sx * 0.011 + Math.sin(t * 0.07) * 1.5) * Math.sin(sx * 0.0047 - t * 0.05 + 1)), 3);
          const ray = shaft * (1 - depth) * (1 - n * 0.85);
          tr[i] = mix(mix(46, 8, depth), mix(6, 2, depth), n) + 30 * ray;
          tg[i] = mix(mix(132, 52, depth), mix(20, 8, depth), n) + 44 * ray;
          tb[i] = mix(mix(150, 82, depth), mix(36, 18, depth), n) + 40 * ray;
          // Surface line: a band of small waves.
          if (y - surf < ch * 1.2) {
            const w = Math.sin(x * 0.05 + t * 0.6) + Math.sin(x * 0.021 - t * 0.4);
            gl[i] = w > 0.4 ? "~" : "-";
            gr[i] = mix(190, 60, n); gg[i] = mix(232, 110, n); gb[i] = mix(240, 130, n);
            continue;
          }
          // Marine snow drifting down; at night some of it glows.
          const drift = Math.floor(r - t * 0.6 * (0.5 + hash2(q, 3)));
          if (hash2(q, drift) < 0.006) {
            const glowing = n > 0.5 && hash2(drift, q) < 0.3;
            gl[i] = ".";
            gr[i] = glowing ? 90 : tr[i] * 1.6; gg[i] = glowing ? 220 : tg[i] * 1.5; gb[i] = glowing ? 230 : tb[i] * 1.4;
          } else if (ray > 0.35) {
            gl[i] = ray > 0.6 ? "/" : "'";
            gr[i] = tr[i] * 1.25; gg[i] = tg[i] * 1.2; gb[i] = tb[i] * 1.15;
          }
        }
      }
    }

    draw(c, t) {
      const { cols, rows, cw, ch } = this;
      const sp = c.sp;
      const L = c.L;
      const fog = c.depth * 0.5;
      const night = this.night;
      // Facing and turning: face runs from 1 (facing right) through 0 (head on) to -1.
      const ax = Math.max(0.14, Math.abs(c.face));
      FACE = c.face < 0 ? -1 : 1;
      const cos = Math.cos(-c.pitch), sin = Math.sin(-c.pitch);
      const reach = Math.hypot(sp.box[0], sp.box[1]) * L;
      // Props are rooted at their base, so nothing of them hangs below it.
      const c0 = Math.max(0, Math.floor((c.x - reach) / cw)), c1 = Math.min(cols - 1, Math.floor((c.x + reach) / cw));
      const r0 = Math.max(0, Math.floor((c.y - reach) / ch));
      const r1 = Math.min(rows - 1, Math.floor((c.y + (sp.prop ? 0.05 * L : reach)) / ch));
      const water = mixc([46, 132, 150], [6, 20, 36], night);
      for (let r = r0; r <= r1; r++) {
        for (let q = c0; q <= c1; q++) {
          const dx = ((q + 0.5) * cw - c.x) / L, dy = ((r + 0.5) * ch - c.y) / L;
          const rx = dx * cos - dy * sin, ry = dx * sin + dy * cos;
          F.x = (rx / ax) * FACE;
          F.y = ry;
          if (!sp.shape(c, t)) continue;
          const i = r * cols + q;
          if (hit.ink) {
            // Glyph-drawn: the character carries the colour; it fades with depth and holds up at night.
            const k = mix(1, 0.8, night) * (1 - c.depth * 0.3);
            this.tr[i] = mix(this.tr[i], hit.ink[0], hit.a * 0.4);
            this.tg[i] = mix(this.tg[i], hit.ink[1], hit.a * 0.4);
            this.tb[i] = mix(this.tb[i], hit.ink[2], hit.a * 0.4);
            this.gl[i] = hit.ch;
            this.gr[i] = mix(hit.ink[0] * k, water[0], fog * 0.6);
            this.gg[i] = mix(hit.ink[1] * k, water[1], fog * 0.6);
            this.gb[i] = mix(hit.ink[2] * k, water[2], fog * 0.6);
            continue;
          }
          // Everything else dims with the water at night; turning edge-on darkens a little.
          const dim = mix(1, mix(0.55, 1, hit.glow > 0 ? 0.6 : 0), night) * (0.8 + 0.2 * ax);
          const R = mix(hit.r * dim, water[0], fog), G = mix(hit.g * dim, water[1], fog), Bc = mix(hit.b * dim, water[2], fog);
          const a = hit.a * (1 - c.depth * 0.15);
          this.tr[i] = mix(this.tr[i], R, a);
          this.tg[i] = mix(this.tg[i], G, a);
          this.tb[i] = mix(this.tb[i], Bc, a);
          if (a > 0.3 || hit.ch) {
            this.gl[i] = hit.ch === " " ? "" : hit.ch || RAMP[clamp(Math.floor((1 - hit.l) * 1.45 * RAMP.length), 0, RAMP.length - 1)];
            const k = hit.ch ? 0.55 : 0.7;
            this.gr[i] = this.tr[i] * k; this.gg[i] = this.tg[i] * k; this.gb[i] = this.tb[i] * k;
          }
        }
      }
    }

    bubbles(list) {
      const { cols, rows, cw, ch } = this;
      const k = mix(1, 0.6, this.night);
      for (const b of list) {
        const q = Math.floor(b.x / cw), r = Math.floor(b.y / ch);
        if (q < 0 || r < 0 || q >= cols || r >= rows) continue;
        const i = r * cols + q;
        this.gl[i] = b.size > 0.66 ? "O" : b.size > 0.33 ? "o" : "°";
        this.gr[i] = 220 * k; this.gg[i] = 244 * k; this.gb[i] = 250 * k;
      }
    }

    present() {
      const { ctx, cols, rows, cw, ch, dpr, img } = this;
      const d = img.data;
      for (let i = 0, n = cols * rows; i < n; i++) {
        d[i * 4] = this.tr[i];
        d[i * 4 + 1] = this.tg[i];
        d[i * 4 + 2] = this.tb[i];
        d[i * 4 + 3] = 255;
      }
      this.tileCtx.putImageData(img, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.tileCanvas, 0, 0, cols * cw * dpr, rows * ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `600 ${Math.max(5, Math.round(ch * 0.85))}px ${FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let last = "";
      for (let r = 0; r < rows; r++) {
        for (let q = 0; q < cols; q++) {
          const i = r * cols + q;
          const g = this.gl[i];
          if (!g) continue;
          const key = ((this.gr[i] >> 3) << 10) | ((this.gg[i] >> 3) << 5) | (this.gb[i] >> 3);
          let st = this.styles.get(key);
          if (!st) {
            st = `rgb(${(key >> 10) << 3},${((key >> 5) & 31) << 3},${(key & 31) << 3})`;
            this.styles.set(key, st);
          }
          if (st !== last) { ctx.fillStyle = st; last = st; }
          ctx.fillText(g, q * cw + cw / 2, r * ch + ch / 2 + 0.5);
        }
      }
    }

    frame(tank) {
      this.background(tank.t, tank);
      const order = tank.creatures.slice().sort((a, b) => b.depth - a.depth);
      for (const c of order) this.draw(c, tank.t);
      this.bubbles(tank.bubbleList);
      this.present();
    }
  }

  /* ── the tank ─────────────────────────────────────────────────────── */

  // Cruising speed in pixels per second at full size, how fast it climbs or dives, and how shy it is.
  const MOVES = {
    whaleShark: { speed: 20, climb: 4, shy: 0 },
    hammerhead: { speed: 36, climb: 8, shy: 0.2 },
    turtle: { speed: 22, climb: 8, shy: 0.4 },
    stingray: { speed: 26, climb: 4, shy: 0.6 },
    manta: { speed: 26, climb: 6, shy: 0.2 },
    sardine: { speed: 48, climb: 20, shy: 1.6 },
    moonJelly: { speed: 7, climb: 7, shy: 0 },
    seaNettle: { speed: 6, climb: 6, shy: 0 },
    lotus: { speed: 3, climb: 0, shy: 0 },
    sakura: { speed: 5, climb: 0, shy: 0 },
  };
  const NAMES = {
    whaleShark: "Whale shark", hammerhead: "Hammerhead", turtle: "Sea turtle", stingray: "Blue-spotted stingray",
    manta: "Manta ray", sardine: "Sardines", moonJelly: "Moon jellyfish", seaNettle: "Sea nettle",
    lotus: "Lotus", sakura: "Cherry blossom",
  };
  const CORALS = [[236, 120, 140], [244, 150, 90], [200, 120, 210], [236, 196, 110]];

  class Tank {
    constructor(canvas) {
      this.canvas = canvas;
      this.renderer = new Renderer(canvas);
      this.creatures = [];
      this.bubbleList = [];
      this.pointer = { x: -9999, y: -9999, on: false };
      this.t = 0;
      this.night = 0;
      this.resize();
    }

    rand(a, b) { return a + Math.random() * (b - a); }

    floorAt(x) {
      return this.floorY + Math.sin(x * 0.004 + 1.3) * this.h * 0.022 + Math.sin(x * 0.011) * this.h * 0.008;
    }

    resize() {
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const first = !this.w;
      const kx = first ? 1 : w / this.w, ky = first ? 1 : h / this.h;
      this.w = w; this.h = h;
      this.unit = clamp(Math.sqrt(w * h) / 1100, 0.5, 1.15);
      // Leave room above the water for the title and buttons.
      this.surfaceY = Math.max(w < 600 ? 92 : 72, h * 0.08);
      this.floorY = h * 0.86;
      this.renderer.resize(w, h, dpr, w < 600 ? 4 : clamp(Math.round(w / 280), 4, 6));
      if (first) { this.populate(); return; }
      for (const c of this.creatures) {
        c.x *= kx;
        if (c.sp.prop) c.y = this.floorAt(c.x) + 6;
        else if (c.sp.surface) c.y = this.surfaceY;
        else c.y *= ky;
      }
    }

    spawn(kind, L, depth, extra) {
      const c = Object.assign({
        kind,
        sp: SPECIES[kind],
        x: this.rand(0.1, 0.9) * this.w,
        y: this.rand(this.surfaceY + 60, this.floorY - 60),
        dir: Math.random() < 0.5 ? -1 : 1,
        flip: 0, pitch: 0, vx: 0, vy: 0,
        L: L * this.unit * (1 - 0.35 * depth),
        depth,
        phase: Math.random() * TAU,
        seed: Math.random() * 100,
        spin: Math.random() * TAU,
      }, extra);
      c.face = c.dir;
      c.move = MOVES[kind] || { speed: 0, climb: 0, shy: 0 };
      c.speed = c.move.speed * (0.6 + 0.4 * this.unit) * this.rand(0.85, 1.15);
      c.targetY = c.y;
      this.creatures.push(c);
      return c;
    }

    populate() {
      const small = this.w < 700;
      const W = this.w;
      // Scenery along the floor.
      const kelps = small ? 3 : 5;
      for (let i = 0; i < kelps; i++) {
        const x = ((i + 0.5) / kelps + this.rand(-0.04, 0.04)) * W;
        const tall = this.rand(0.35, 0.6) * (this.floorY - this.surfaceY);
        this.spawn("kelp", 0, i % 2 ? 0.55 : 0.2, { x, y: this.floorAt(x) + 6, L: tall, dir: 1 });
      }
      for (let i = 0; i < (small ? 3 : 6); i++) {
        const x = this.rand(0.05, 0.95) * W;
        const branches = [];
        const n = 3 + Math.floor(Math.random() * 3);
        for (let b = 0; b < n; b++) {
          const ang = -Math.PI / 2 + (n > 1 ? b / (n - 1) - 0.5 : 0) * 1.4;
          const len = this.rand(0.35, 0.6);
          const mx = Math.cos(ang) * len * 0.5, my = Math.sin(ang) * len * 0.5;
          branches.push([0, 0, mx, my, 0.06]);
          branches.push([mx, my, mx + Math.cos(ang - 0.4) * len * 0.5, my + Math.sin(ang - 0.4) * len * 0.5, 0.045]);
          branches.push([mx, my, mx + Math.cos(ang + 0.4) * len * 0.45, my + Math.sin(ang + 0.4) * len * 0.45, 0.04]);
        }
        this.spawn("coral", this.rand(110, 170), i % 2 ? 0.45 : 0.15, { x, y: this.floorAt(x) + 4, dir: 1, branches, col: CORALS[i % CORALS.length] });
      }
      for (let i = 0; i < (small ? 2 : 4); i++) {
        const x = this.rand(0.05, 0.95) * W;
        const g = this.rand(70, 110);
        this.spawn("rock", this.rand(90, 160), i % 2 ? 0.5 : 0.25, { x, y: this.floorAt(x) + 6, dir: 1, col: [g, g * 0.98, g * 0.92] });
      }
      // Swimmers.
      const mid = (this.surfaceY + this.floorY) / 2, span = this.floorY - this.surfaceY;
      this.spawn("whaleShark", 560, 0.6, { y: mid });
      this.spawn("hammerhead", 330, 0.35);
      if (!small) this.spawn("hammerhead", 290, 0.55);
      this.spawn("turtle", 240, 0.22);
      this.spawn("stingray", 270, 0.4, { y: this.floorY - 40, low: true });
      this.spawn("manta", 280, 0.45, { y: this.surfaceY + span * 0.3 });
      this.spawn("moonJelly", 130, 0.12, { dir: 1 });
      this.spawn("moonJelly", 95, 0.3, { dir: 1 });
      if (!small) this.spawn("moonJelly", 80, 0.42, { dir: 1 });
      this.spawn("seaNettle", 100, 0.26, { dir: 1, y: this.surfaceY + 80 });
      for (let s = 0; s < (small ? 1 : 2); s++) {
        const cx = this.rand(0.2, 0.8) * W, cy = this.rand(this.surfaceY + 120, this.floorY - 120);
        const dir = Math.random() < 0.5 ? -1 : 1;
        for (let i = 0; i < (small ? 14 : 22); i++) {
          // Sardines keep a readable size even on phones.
          this.spawn("sardine", Math.max(78, 64 / this.unit), 0.1 + 0.12 * s, { x: cx + this.rand(-80, 80), y: cy + this.rand(-40, 40), school: s, dir, vx: dir * 48 });
        }
      }
      // On the surface.
      this.spawn("lotus", 200, 0, { y: this.surfaceY });
      if (!small) this.spawn("lotus", 150, 0.05, { y: this.surfaceY });
      for (let i = 0; i < (small ? 3 : 5); i++) this.spawn("sakura", this.rand(30, 46), 0, { y: this.surfaceY + 1 });
    }

    // Start a turn: the body narrows to head-on, then widens facing the other way.
    turn(c) {
      if (!c.flip) c.flip = 1e-6;
    }

    step(dt) {
      this.t += dt;
      const { w, pointer } = this;
      const top = this.surfaceY, bottom = this.floorY;
      const schools = [];
      for (const c of this.creatures) {
        if (c.school === undefined) continue;
        const S = (schools[c.school] ||= { x: 0, y: 0, vx: 0, vy: 0, n: 0 });
        S.x += c.x; S.y += c.y; S.vx += c.vx; S.vy += c.vy; S.n++;
      }
      for (const S of schools) if (S) { S.x /= S.n; S.y /= S.n; S.vx /= S.n; S.vy /= S.n; }

      for (const c of this.creatures) {
        const sp = c.sp, m = c.move;
        c.phase += dt * (sp.jelly ? 1.1 : 2 + (c.speed / Math.max(40, c.L)) * 4);
        if (sp.prop) continue;
        if (sp.surface) {
          // Drift along the surface, bobbing, nudged aside by the pointer.
          c.x += c.dir * c.speed * dt;
          c.y = top + Math.sin(this.t * 0.8 + c.seed) * 1.5;
          c.spin += dt * 0.05;
          if (c.x < -c.L) c.x = w + c.L; else if (c.x > w + c.L) c.x = -c.L;
          if (pointer.on && Math.abs(pointer.x - c.x) < c.L * 0.6 && Math.abs(pointer.y - c.y) < 40) c.x += Math.sign(c.x - pointer.x) * 40 * dt;
          continue;
        }
        if (sp.jelly) {
          // Pulse upward, sink between pulses, drift with a slow current, tilting as they go.
          const p = pulse(c.phase);
          c.vy = mix(c.vy, -c.speed * 2.2 * p + c.speed * 0.9, dt * 2);
          if (c.y < top + c.L * 0.6) c.vy = Math.max(c.vy, c.speed);
          if (c.y > bottom - c.L * 1.4) c.vy = Math.min(c.vy, -c.speed);
          c.x += Math.sin(this.t * 0.05 + c.seed) * c.speed * 0.8 * dt;
          if (c.x < -c.L) c.x = w + c.L; else if (c.x > w + c.L) c.x = -c.L;
          c.y += c.vy * dt;
          c.pitch = Math.sin(this.t * 0.2 + c.seed) * 0.18;
          continue;
        }
        if (c.school !== undefined) {
          // Boids: cohesion, alignment, separation, a slow wander, and bolting from the pointer.
          const S = schools[c.school];
          let ax = (S.x - c.x) * 0.35 + (S.vx - c.vx) * 0.8 + Math.sin(this.t * 0.2 + c.school * 3) * 20;
          let ay = (S.y - c.y) * 0.35 + (S.vy - c.vy) * 0.8 + Math.sin(this.t * 0.13 + c.school) * 10;
          for (const o of this.creatures) {
            if (o === c || o.school !== c.school) continue;
            const dx = c.x - o.x, dy = c.y - o.y;
            if (dx * dx + dy * dy < c.L * c.L * 0.8) { ax += dx * 4; ay += dy * 6; }
          }
          if (pointer.on) {
            const dx = c.x - pointer.x, dy = c.y - pointer.y, d = Math.hypot(dx, dy) || 1;
            if (d < 160) { ax += (dx / d) * 900 * (1 - d / 160); ay += (dy / d) * 900 * (1 - d / 160); }
          }
          if (c.x < 40) ax += 120;
          if (c.x > w - 40) ax -= 120;
          if (c.y < top + 40) ay += 120;
          if (c.y > bottom - 40) ay -= 120;
          c.vx += ax * dt; c.vy += ay * dt;
          const v = Math.hypot(c.vx, c.vy) || 1, max = c.speed * 2.2, min = c.speed * 0.6;
          if (v > max) { c.vx *= max / v; c.vy *= max / v; }
          if (v < min) { c.vx *= min / v; c.vy *= min / v; }
          c.vy *= 1 - dt * 0.8;
          c.x += c.vx * dt;
          c.y = clamp(c.y + c.vy * dt, top + c.L * 0.2, bottom - c.L * 0.2);
          if (Math.sign(c.vx) !== c.dir && Math.abs(c.vx) > 6) this.turn(c);
          c.pitch = clamp(Math.atan2(c.vy, Math.abs(c.vx)), -0.6, 0.6) * c.dir;
        } else {
          // Cruise along, wander up and down, turn at the walls; shy ones turn from the pointer.
          if (Math.random() < dt * 0.08) c.targetY = c.low ? bottom - c.L * this.rand(0.08, 0.3) : this.rand(top + c.L * 0.3, bottom - c.L * 0.3);
          c.vy = mix(c.vy, clamp((c.targetY - c.y) * 0.3, -m.climb, m.climb), dt);
          const margin = c.L * 0.3;
          if ((c.dir > 0 && c.x > w + margin) || (c.dir < 0 && c.x < -margin)) this.turn(c);
          if (pointer.on && m.shy > 0) {
            const ahead = (pointer.x - c.x) * c.dir;
            if (ahead > 0 && ahead < c.L * 0.9 + 60 && Math.abs(pointer.y - c.y) < c.L * 0.4 + 40) this.turn(c);
          }
          c.x += c.dir * c.speed * (c.flip ? 0.35 : 1) * dt;
          c.y += c.vy * dt;
          c.y = clamp(c.y, top + c.L * 0.15, bottom - c.L * 0.06);
          c.pitch = mix(c.pitch, clamp(Math.atan2(c.vy, c.speed) * 0.8, -0.25, 0.25) * c.dir, dt * 2);
        }
        if (c.flip) {
          // The body turns through head-on: a second and a half for big ones, a blink for small fish.
          c.flip += dt / (c.school !== undefined ? 0.35 : 1.4);
          if (c.flip >= 0.5 && !c.flipped) { c.dir = -c.dir; c.flipped = true; }
          if (c.flip >= 1) { c.flip = 0; c.flipped = false; }
        }
        // Mid-turn the body shows edge-on: |face| shrinks to 0 at the halfway point.
        c.face = c.flip ? -c.dir * Math.cos(Math.PI * c.flip) * (c.flipped ? 1 : -1) : c.dir;
      }
      // Bubbles rise, wobble and pop at the surface; the kelp beds breathe a few now and then.
      for (const b of this.bubbleList) {
        b.y -= b.speed * dt;
        b.x += Math.sin(this.t * 3 + b.seed) * 8 * dt;
      }
      this.bubbleList = this.bubbleList.filter((b) => b.y > top + 4);
      if (Math.random() < dt * 0.6) {
        const beds = this.creatures.filter((c) => c.kind === "kelp" || c.kind === "coral");
        const src = beds[Math.floor(Math.random() * beds.length)];
        if (src) this.bubble(src.x, src.y - 8, 3);
      }
    }

    bubble(x, y, n) {
      for (let i = 0; i < n && this.bubbleList.length < 120; i++) {
        this.bubbleList.push({ x: x + this.rand(-10, 10), y: y + this.rand(-6, 6), speed: this.rand(30, 60), size: Math.random(), seed: Math.random() * 10 });
      }
    }

    // What sits under a point, nearest the glass first.
    pick(x, y) {
      let best = null, bd = Infinity;
      for (const c of this.creatures) {
        if (c.sp.prop) continue;
        const cy = c.sp.jelly ? c.y + c.L * 0.3 : c.y;
        const d = Math.hypot((x - c.x) / (c.L * 0.5), (y - cy) / (c.L * (c.sp.jelly ? 0.6 : 0.25)));
        const score = d + c.depth * 0.3;
        if (d < 1 && score < bd) { bd = score; best = c; }
      }
      return best;
    }

    tap(x, y) {
      this.bubble(x, y, 6);
      for (const o of this.creatures) {
        if (o.move.shy > 0 && o.school === undefined) {
          const d = Math.hypot(o.x - x, o.y - y);
          if (d < o.L * 0.6 + 60 && (x - o.x) * o.dir > 0) this.turn(o);
        }
      }
      return this.pick(x, y);
    }

    render() {
      this.renderer.night = this.night;
      this.renderer.frame(this);
    }
  }

  // Night from the visitor's clock: full day 07:00 to 17:00, dusk to 20:00, night until 05:00, dawn to 07:00.
  function nightFromClock(d) {
    const h = d.getHours() + d.getMinutes() / 60;
    if (h >= 7 && h < 17) return 0;
    if (h >= 17 && h < 20) return smooth(17, 20, h);
    if (h >= 5 && h < 7) return 1 - smooth(5, 7, h);
    return 1;
  }

  function boot() {
    const canvas = document.getElementById("aquarium");
    if (!canvas) return;
    const tank = new Tank(canvas);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const caption = document.getElementById("aq-caption");
    const modeBtn = document.getElementById("aq-mode");
    const MODES = ["auto", "day", "night"];
    const LABEL = { auto: "Auto", day: "Day", night: "Night" };
    let mode = "auto";
    try { mode = localStorage.getItem("aq-mode") || "auto"; } catch (e) {}
    if (!MODES.includes(mode)) mode = "auto";
    const targetNight = () => (mode === "day" ? 0 : mode === "night" ? 1 : nightFromClock(new Date()));
    tank.night = targetNight();
    function syncMode() {
      if (!modeBtn) return;
      modeBtn.textContent = LABEL[mode];
      modeBtn.setAttribute("aria-label", "Lighting: " + LABEL[mode] + ". Tap to change.");
    }
    syncMode();
    if (modeBtn) modeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
      try { localStorage.setItem("aq-mode", mode); } catch (err) {}
      syncMode();
    });

    let captionTimer = 0;
    function showCaption(c, x, y) {
      if (!caption || !c) return;
      caption.textContent = NAMES[c.kind];
      caption.style.left = x + "px";
      caption.style.top = y + "px";
      caption.classList.add("on");
      clearTimeout(captionTimer);
      captionTimer = setTimeout(() => caption.classList.remove("on"), 1800);
    }

    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    window.addEventListener("pointermove", (e) => {
      const [x, y] = pos(e);
      tank.pointer.x = x; tank.pointer.y = y; tank.pointer.on = e.pointerType === "mouse" || e.buttons > 0;
    }, { passive: true });
    window.addEventListener("pointerdown", (e) => {
      if (e.target.closest && e.target.closest("a, button")) return;
      const [x, y] = pos(e);
      tank.pointer.x = x; tank.pointer.y = y; tank.pointer.on = true;
      showCaption(tank.tap(x, y), x, y);
    });
    window.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") tank.pointer.on = false; });
    document.documentElement.addEventListener("pointerleave", () => { tank.pointer.on = false; });
    new ResizeObserver(() => tank.resize()).observe(canvas);

    // Draw at about 30 frames a second: the motion is slow, and it keeps phones cool.
    let last = performance.now(), acc = 0, raf = 0;
    function loop(now) {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      acc += dt;
      if (acc < 1 / 31) return;
      const step = acc * (reduced.matches ? 0.35 : 1);
      acc = 0;
      tank.night += clamp(targetNight() - tank.night, -step * 0.8, step * 0.8);
      tank.step(step);
      tank.render();
    }
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else { last = performance.now(); raf = requestAnimationFrame(loop); }
    });
    // Let the mono font arrive before the first glyphs are drawn.
    const start = () => { tank.step(0.01); tank.render(); raf = requestAnimationFrame(loop); };
    if (document.fonts && document.fonts.load) document.fonts.load('600 14px "IBM Plex Mono"').then(start, start);
    else start();
    global.__tank = tank;
  }

  global.Aquarium = { SPECIES, Renderer, Tank, TAU };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
