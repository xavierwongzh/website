/* ASCII aquarium: sea creatures seen from above, drawn as shaded character tiles. */
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

  // Light from the upper left, above the water.
  const LX = -0.42, LY = -0.5, LZ = 0.76;

  /* ── hit record ───────────────────────────────────────────────────── */

  // A sample writes the lit colour, its coverage, how bright it is (picks the glyph)
  // and optionally a fixed glyph (fin rays, spots, outlines).
  const hit = { r: 0, g: 0, b: 0, a: 1, l: 1, ch: "", glow: 0 };
  function put(col, l, a, ch, glow) {
    hit.r = col[0] * l;
    hit.g = col[1] * l;
    hit.b = col[2] * l;
    hit.l = l;
    hit.a = a === undefined ? 1 : a;
    hit.ch = ch || "";
    hit.glow = glow || 0;
    return true;
  }
  // Shade a rounded surface whose normal in screen space is (nx, ny).
  function lit(nx, ny) {
    const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
    return 0.34 + 0.66 * clamp(nx * LX + ny * LY + nz * LZ, 0, 1);
  }
  // A line glyph that follows a direction on screen.
  function lineGlyph(dx, dy) {
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

  /* ── frames ───────────────────────────────────────────────────────── */

  // Every creature hands its shape function three views of the sample point:
  //   s, a   along the bending spine (0 snout .. 1 tail tip) and across it, signed, in body lengths
  //   hx, hy in the rigid frame of the head: forward and to the right, in body lengths
  //   sx, sy screen-space directions of the local "right" axis, for turning normals and fin rays
  const F = { s: 0, a: 0, hx: 0, hy: 0, tx: 1, ty: 0, px: 0, py: 1, htx: 1, hty: 0 };

  // Normal on screen for a point that sits `across` (-1..1) over a body whose right-hand side
  // points along (px, py) in screen space.
  function bodyLight(across, px, py, k) {
    k = k === undefined ? 0.85 : k;
    return lit(px * across * k, py * across * k);
  }
  // Screen direction of a vector given in head frame (forward f, right r).
  function headDir(f, r) {
    return [F.htx * f - F.hty * r, F.hty * f + F.htx * r];
  }

  /* ── species ──────────────────────────────────────────────────────── */

  // Each species: { len (spine extent in body lengths), reach (how far its shape strays from the spine),
  //   shape(c, t) -> boolean, writing `hit` }.

  /* Hammerhead: a wide cephalofoil with eyes at its tips, tall dorsal, long upper tail lobe. */
  const HAMMER = { back: [104, 112, 112], edge: [150, 156, 150], belly: [196, 198, 190], eye: [18, 20, 22] };
  function hammerW(s) {
    if (s < 0.06) return 0.04 + 0.3 * s;
    if (s < 0.3) return 0.058 + 0.034 * smooth(0.06, 0.3, s);
    return 0.014 + 0.078 * (1 - smooth(0.3, 0.8, s));
  }
  const hammerhead = {
    len: 1,
    reach: 0.26,
    shape(c) {
      const { s, a, hx, hy, px, py } = F;
      // Cephalofoil: a flat bar across the head, gently swept back, scalloped at the front.
      const q = hy / 0.165;
      if (Math.abs(q) <= 1 && hx < 0.03) {
        const front = 0.022 - 0.03 * q * q + 0.004 * Math.cos(q * 9);
        const rear = -0.048 - 0.02 * q * q;
        if (hx <= front && hx >= rear) {
          if (Math.abs(q) > 0.86 && Math.abs(hx - (front + rear) / 2) < 0.012) return put(HAMMER.eye, 1, 1, "o");
          const t = (hx - (front + rear) / 2) / ((front - rear) / 2);
          const [nx, ny] = headDir(t * 0.6, q * 0.25);
          const col = mixc(HAMMER.back, HAMMER.edge, smooth(0.5, 1, Math.abs(q)));
          return put(col, lit(nx, ny), 1);
        }
      }
      // Pectoral fins, swept back.
      const sa = Math.abs(a);
      const pec = [0.22, 0.07, 0.32, 0.08, 0.46, 0.25, 0.41, 0.26];
      if (inPoly(pec, s, sa)) return put(HAMMER.back, 0.78, 1, lineGlyph(...dirOnScreen(s - 0.27, sa - 0.06, a)));
      const pel = [0.58, 0.035, 0.62, 0.035, 0.68, 0.085, 0.65, 0.09];
      if (inPoly(pel, s, sa)) return put(HAMMER.back, 0.72, 1, "");
      if (s < 0 || s > 1) return false;
      // Tail: from above the tall caudal reads as a thin blade; the upper lobe runs on to the tip.
      if (s > 0.8) {
        const w = 0.012 * (1 - smooth(0.8, 1, s)) + 0.006;
        const sway = 0.02 * smooth(0.82, 1, s);
        if (Math.abs(a - sway * Math.sin(c.phase)) < w) return put(HAMMER.back, 0.8, 1, lineGlyph(F.tx, F.ty));
        return false;
      }
      const w = hammerW(s);
      if (sa > w) return false;
      const across = a / w;
      // Dorsal fin seen from above: a dark blade down the spine.
      if (s > 0.27 && s < 0.4 && Math.abs(across) < 0.16) return put(HAMMER.back, 0.55, 1, lineGlyph(F.tx, F.ty));
      const col = mixc(HAMMER.back, HAMMER.edge, smooth(0.55, 1, Math.abs(across)));
      return put(col, bodyLight(across, px, py), 1);
    },
  };
  // Turn a direction given in (along spine, across |a|) into screen space at the sample.
  function dirOnScreen(ds, da, a) {
    const side = a < 0 ? -1 : 1;
    return [F.tx * ds + F.px * da * side, F.ty * ds + F.py * da * side];
  }

  /* Whale shark: broad flat head, white spots between pale cross stripes, three ridges. */
  const WHALE = { back: [36, 56, 78], edge: [70, 92, 112], spot: [214, 224, 228], ridge: [92, 116, 134] };
  function whaleW(s) {
    if (s < 0.06) return 0.11 * Math.pow(s / 0.06, 0.45);
    if (s < 0.24) return 0.11 + 0.012 * smooth(0.06, 0.24, s);
    return 0.016 + 0.106 * (1 - smooth(0.24, 0.8, s));
  }
  const whaleShark = {
    len: 1,
    reach: 0.3,
    shape(c) {
      const { s, a, px, py } = F;
      const sa = Math.abs(a);
      const pec = [0.22, 0.08, 0.32, 0.09, 0.46, 0.29, 0.4, 0.3];
      if (inPoly(pec, s, sa)) {
        const spot = hash2(Math.floor(s * 60), Math.floor(sa * 60)) < 0.12;
        return put(spot ? WHALE.spot : WHALE.back, 0.8, 1, spot ? "." : lineGlyph(...dirOnScreen(s - 0.27, sa - 0.08, a)));
      }
      if (s < 0 || s > 1) return false;
      if (s > 0.8) {
        const w = 0.016 * (1 - smooth(0.8, 1, s)) + 0.008;
        if (Math.abs(a) < w) return put(WHALE.back, 0.82, 1, lineGlyph(F.tx, F.ty));
        return false;
      }
      const w = whaleW(s);
      if (sa > w) return false;
      const across = a / w;
      const l = bodyLight(across, px, py, 0.7);
      // Ridges along the back.
      if (s > 0.12 && s < 0.7 && (Math.abs(across) < 0.07 || Math.abs(Math.abs(across) - 0.42) < 0.06))
        return put(WHALE.ridge, l, 1, lineGlyph(F.tx, F.ty));
      // Mouth: a wide pale line across the front of the head.
      if (s < 0.018 && Math.abs(across) < 0.85) return put(WHALE.edge, l * 0.6, 1, "-");
      // Pale cross stripes with spots in the panels between them, finer on the head.
      const k = s < 0.18 ? 64 : 34;
      const gu = s * k, gv = a * k * 1.15;
      const fu = fract(gu) - 0.5, fv = fract(gv + (Math.floor(gu) % 2) * 0.5) - 0.5;
      if (s > 0.18 && Math.abs(fu) > 0.44) return put(mixc(WHALE.back, WHALE.spot, 0.45), l, 1, "|");
      if (fu * fu + fv * fv < 0.05) return put(WHALE.spot, l, 1, "o");
      const col = mixc(WHALE.back, WHALE.edge, smooth(0.6, 1, Math.abs(across)));
      return put(col, l, 1);
    },
  };

  /* Sea turtle: domed shell of plates, slow sweeping front flippers. Rigid, in the head frame. */
  const TURTLE = { shell: [116, 82, 44], plate: [170, 122, 58], seam: [52, 34, 20], skin: [132, 136, 100], scale: [196, 192, 150] };
  // Plate centres on the shell, as fractions of its half axes (forward, right).
  const PLATES = [
    [0.62, 0], [0.3, 0], [-0.02, 0], [-0.34, 0], [-0.64, 0],
    [0.42, 0.52], [0.1, 0.6], [-0.22, 0.6], [-0.52, 0.48],
    [0.42, -0.52], [0.1, -0.6], [-0.22, -0.6], [-0.52, -0.48],
  ];
  function flipper(hx, hy, rootX, rootY, ang, len, w0, w1) {
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const dx = hx - rootX, dy = hy - rootY;
    const u = dx * ca + dy * sa; // along the flipper
    const v = -dx * sa + dy * ca;
    if (u < 0 || u > len) return -1;
    const t = u / len;
    const w = mix(w0, w1, t) * Math.sin(Math.PI * Math.min(1, 0.15 + t)) ;
    if (Math.abs(v) > w) return -1;
    return v / w;
  }
  const turtle = {
    len: 0.2,
    reach: 0.75,
    rigid: true,
    shape(c) {
      const { hx, hy } = F;
      // Front flippers: long paddles that sweep back and forward together.
      const sweep = Math.sin(c.phase);
      for (const side of [-1, 1]) {
        const ang = side * (1.95 - 0.55 * sweep);
        const v = flipper(hx, hy, 0.12, side * 0.16, ang, 0.44, 0.075, 0.03);
        if (v > -1) {
          const [nx, ny] = headDir(0, v * 0.6 * side);
          const spot = hash2(Math.floor(hx * 70 + 99), Math.floor(hy * 70 + 99)) < 0.3;
          return put(spot ? TURTLE.scale : TURTLE.skin, lit(nx, ny) * 0.92, 1, spot ? "." : "");
        }
        const vr = flipper(hx, hy, -0.27, side * 0.11, side * (2.5 - 0.25 * sweep), 0.15, 0.05, 0.02);
        if (vr > -1) return put(TURTLE.skin, 0.8, 1, "");
      }
      // Head and neck.
      const qh = ((hx - 0.36) / 0.1) ** 2 + (hy / 0.072) ** 2;
      if (qh < 1) {
        if (Math.abs(hy) > 0.035 && Math.abs(hy) < 0.06 && Math.abs(hx - 0.39) < 0.016) return put([20, 20, 16], 1, 1, "o");
        const [nx, ny] = headDir((hx - 0.36) / 0.1 * 0.7, hy / 0.072 * 0.7);
        const cell = hash2(Math.floor(hx * 90), Math.floor(hy * 90 + 50)) < 0.35;
        return put(cell ? TURTLE.scale : TURTLE.skin, lit(nx, ny), 1, cell ? ":" : "");
      }
      // Tail.
      if (Math.abs(hy) < 0.025 * (1 - (-0.36 - hx) / 0.1) && hx < -0.34 && hx > -0.46) return put(TURTLE.skin, 0.8, 1, "");
      // Shell.
      const fx = (hx + 0.02) / 0.34, fy = hy / 0.25;
      const r = fx * fx + fy * fy;
      if (r > 1) return false;
      const [nx, ny] = headDir(fx * 0.8, fy * 0.8);
      const l = lit(nx, ny);
      if (r > 0.8) {
        // Marginal plates around the rim.
        const ang = Math.atan2(fy, fx);
        if (Math.abs(fract(ang / TAU * 26) - 0.5) > 0.42 || r < 0.84) return put(TURTLE.seam, l, 1, "");
        return put(TURTLE.shell, l, 1, "");
      }
      let d1 = 9, d2 = 9;
      for (const p of PLATES) {
        const d = (fx - p[0]) ** 2 + (fy - p[1]) ** 2;
        if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
      }
      if (Math.sqrt(d2) - Math.sqrt(d1) < 0.07) return put(TURTLE.seam, l, 1, "");
      const col = mixc(TURTLE.plate, TURTLE.shell, smooth(0, 0.12, d1));
      return put(col, l, 1);
    },
  };

  /* Blue-spotted stingray: a round disc with rippling edges, bright blue spots, ribbon tail. */
  const STING = { disc: [150, 122, 70], rim: [116, 96, 58], spot: [60, 150, 236], tail: [70, 120, 190] };
  const stingray = {
    len: 1,
    reach: 0.3,
    shape(c) {
      const { s, a, hx, hy } = F;
      // Disc, in the head frame: front at hx 0, centred at hx -0.2.
      const cx = hx + 0.2;
      const ang = Math.atan2(hy, cx);
      const ripple = 0.012 * Math.sin(c.phase * 1.4 - Math.abs(ang) * 5);
      const R = 0.2 * (1 + 0.12 * Math.cos(2 * ang)) * (1 - 0.06 * Math.max(0, Math.cos(ang))) + ripple;
      const r = Math.hypot(cx, hy);
      if (r < R) {
        const t = r / R;
        const [nx, ny] = headDir(cx / R * 0.6, hy / R * 0.6);
        const l = lit(nx, ny);
        // Eyes and spiracles.
        if (Math.abs(Math.abs(hy) - 0.035) < 0.013 && Math.abs(hx + 0.06) < 0.012) return put([30, 26, 18], 1, 1, "o");
        const gx = (cx + 1) * 34, gy = (hy + 1) * 34;
        const fx = fract(gx) - 0.5, fy = fract(gy + (Math.floor(gx) % 2) * 0.5) - 0.5;
        const spot = hash2(Math.floor(gx), Math.floor(gy + (Math.floor(gx) % 2) * 0.5)) < 0.42;
        if (t < 0.9 && spot && fx * fx + fy * fy < 0.07) return put(STING.spot, 0.6 + 0.4 * l, 1, "o", 0.15);
        const col = mixc(STING.disc, STING.rim, smooth(0.75, 1, t));
        return put(col, l, 1, t > 0.93 ? lineGlyph(-hy, cx) : "");
      }
      // Tail along the spine; a blue band on each side and a sting partway down.
      if (s > 0.38 && s < 1) {
        const w = 0.022 * (1 - smooth(0.4, 1, s)) + 0.004;
        if (Math.abs(a) < w) {
          const band = Math.abs(a) > w * 0.5 && s < 0.75;
          return put(band ? STING.tail : STING.disc, 0.85, 1, lineGlyph(F.tx, F.ty));
        }
      }
      return false;
    },
  };

  /* Manta ray: broad swept wings that beat slowly, white shoulder chevrons, cephalic horns. */
  const MANTA = { back: [34, 40, 54], edge: [56, 64, 80], white: [222, 226, 230] };
  const manta = {
    len: 1.45,
    reach: 0.75,
    rigid: false,
    shape(c) {
      const { s, a, hx, hy } = F;
      const beat = Math.cos(c.phase);
      const span = 0.62 * (0.86 + 0.14 * beat);
      const ahy = Math.abs(hy);
      // Cephalic horns at the front.
      if (hx > -0.02 && hx < 0.08 && Math.abs(ahy - 0.075) < 0.018 - hx * 0.1) return put(MANTA.back, 0.8, 1, "|");
      // Wings: leading edge from the head out to a swept tip, trailing edge back to the tail root.
      const tipX = -0.3 + 0.04 * beat;
      const wing = [0.02, 0.0, 0.02, 0.1, tipX + 0.16, span * 0.72, tipX, span, tipX - 0.06, span * 0.9, -0.42, 0.2, -0.56, 0.06, -0.56, 0.0];
      if (inPoly(wing, hx, ahy)) {
        const t = ahy / span;
        const [nx, ny] = headDir(0, (hy < 0 ? -1 : 1) * (t * 0.7 - 0.15 * beat));
        const l = lit(nx, ny);
        if (hx < -0.04 && hx > -0.2 && ahy > 0.1 && ahy < 0.34 && hx > -0.04 - (ahy - 0.1) * 0.55 && hx < -0.04 - (ahy - 0.1) * 0.1)
          return put(MANTA.white, l, 1, "");
        return put(mixc(MANTA.back, MANTA.edge, smooth(0.6, 1, t)), l, 1, t > 0.75 ? lineGlyph(...headDir(-0.3, hy < 0 ? -1 : 1)) : "");
      }
      // Short whip tail.
      if (s > 0.85 && s < 1.45 && Math.abs(a) < 0.008 + 0.01 * (1.45 - s)) return put(MANTA.back, 0.8, 1, lineGlyph(F.tx, F.ty));
      return false;
    },
  };

  /* Moon jellyfish: a clear pulsing bell with four pink rings at its heart and a fringe of fine tentacles. */
  const MOON = { bell: [176, 200, 230], ring: [232, 150, 210], fringe: [200, 220, 245] };
  function pulse(ph) {
    // Quick contraction, slow relax.
    const p = fract(ph / TAU);
    return p < 0.25 ? Math.sin((p / 0.25) * Math.PI * 0.5) : Math.cos(((p - 0.25) / 0.75) * Math.PI * 0.5);
  }
  const moonJelly = {
    radial: true,
    reach: 0.6,
    shape(c) {
      const { hx, hy } = F;
      const k = 1 - 0.07 * pulse(c.phase);
      const r = Math.hypot(hx, hy) / k;
      const ang = Math.atan2(hy, hx) + c.spin;
      if (r > 0.56) return false;
      if (r > 0.48) {
        // Fringe: short tentacles all round the rim.
        if (Math.abs(fract(ang / TAU * 64) - 0.5) < 0.18) return put(MOON.fringe, 0.9, 0.45, lineGlyph(hx, hy), 0.2);
        return false;
      }
      // Four rings in a clover around the centre.
      for (let i = 0; i < 4; i++) {
        const ga = (i / 4) * TAU + Math.PI / 4 - c.spin;
        const gx = Math.cos(ga) * 0.15 * k, gy = Math.sin(ga) * 0.15 * k;
        const d = Math.hypot(hx - gx, hy - gy);
        if (Math.abs(d - 0.085 * k) < 0.026) return put(MOON.ring, 0.95, 0.7, Math.abs(d - 0.085 * k) < 0.012 ? "o" : " ", 0.3);
      }
      const canal = Math.abs(fract(ang / TAU * 16) - 0.5) > 0.46 && r > 0.25;
      const t = r / 0.48;
      const [nx, ny] = [hx / 0.5 * 0.5, hy / 0.5 * 0.5];
      return put(MOON.bell, lit(nx, ny), 0.22 + 0.3 * t * t, canal ? lineGlyph(hx, hy) : t > 0.94 ? "o" : " ", 0.25);
    },
  };

  /* Sea nettle: amber bell with dark radial stripes, cream oral arms and red tentacles trailing behind. */
  const NETTLE = { bell: [222, 138, 60], stripe: [150, 70, 34], arm: [238, 222, 192], tent: [176, 62, 50] };
  const seaNettle = {
    radial: true,
    reach: 1.6,
    shape(c) {
      const { hx, hy } = F;
      const k = 1 - 0.06 * pulse(c.phase);
      const r = Math.hypot(hx, hy) / k;
      const ang = Math.atan2(hy, hx);
      if (r < 0.45) {
        const t = r / 0.45;
        const scallop = 0.45 * (1 - 0.04 * Math.abs(Math.sin(ang * 8)));
        if (r > scallop) return false;
        const [nx, ny] = [hx / 0.45 * 0.55, hy / 0.45 * 0.55];
        const stripe = Math.abs(fract(ang / TAU * 16 + 0.25) - 0.5) < 0.12 && t > 0.3;
        return put(stripe ? NETTLE.stripe : NETTLE.bell, lit(nx, ny), 0.62, stripe ? lineGlyph(hx, hy) : "", 0.1);
      }
      // Arms and tentacles trail behind the bell (towards -hx), waving gently.
      const back = -hx;
      if (back < 0) return false;
      for (let i = 0; i < 4; i++) {
        const off = (i - 1.5) * 0.08;
        const y = off + 0.06 * Math.sin(back * 4 - c.phase * 0.5 + i) * smooth(0, 0.6, back);
        const w = 0.035 * (1 - back / 1.6) + 0.008 * Math.sin(back * 30 + i);
        if (back < 1.5 && Math.abs(hy - y) < w) return put(NETTLE.arm, 0.9, 0.75, "~");
      }
      for (let i = 0; i < 8; i++) {
        const off = (i - 3.5) * 0.11;
        const y = off * (1 + back * 0.15) + 0.05 * Math.sin(back * 5 - c.phase * 0.6 + i * 1.7);
        if (back < 1.55 && Math.abs(hy - y) < 0.009) return put(NETTLE.tent, 0.9, 0.6, lineGlyph(1, 0.2 * Math.cos(back * 5 + i)));
      }
      return false;
    },
  };

  /* Sardine: a small silver fish with a forked tail, for schools. */
  const SARDINE = { back: [70, 118, 160], flank: [214, 228, 240], line: [120, 160, 200] };
  const sardine = {
    len: 1,
    reach: 0.14,
    shape(c) {
      const { s, a, px, py } = F;
      if (s < 0 || s > 1) return false;
      const sa = Math.abs(a);
      if (s > 0.78) {
        const t = (s - 0.78) / 0.22;
        const w = 0.02 + 0.1 * t;
        if (sa < w && sa > 0.06 * t * t * 0.0 + (s > 0.92 ? 0.04 * (1 - (1 - t) * 4) : -1)) return put(SARDINE.back, 0.8, 1, lineGlyph(F.tx, F.ty));
        return false;
      }
      const w = s < 0.25 ? 0.09 * Math.pow(s / 0.25, 0.5) : 0.02 + 0.07 * (1 - smooth(0.25, 0.78, s));
      if (sa > w) return false;
      const across = a / w;
      const col = Math.abs(across) < 0.35 ? SARDINE.back : SARDINE.flank;
      return put(col, bodyLight(across, px, py), 1, "", Math.abs(across) > 0.5 ? 0.06 : 0);
    },
  };

  /* Pufferfish: round, spotted, puffs up into a spiky ball when startled. */
  const PUFF = { back: [196, 168, 108], spot: [96, 70, 40], belly: [232, 226, 206], eye: [20, 20, 20] };
  const puffer = {
    len: 1,
    reach: 0.45,
    shape(c) {
      const { s, a, hx, hy } = F;
      const p = c.puff || 0;
      const R = 0.24 * (1 + 0.55 * p);
      const cx = hx + 0.3 * (1 + 0.2 * p);
      const r = Math.hypot(cx, hy);
      const ang = Math.atan2(hy, cx);
      if (p > 0.05 && r > R && r < R + 0.08 * p) {
        if (Math.abs(fract(ang / TAU * 28) - 0.5) < 0.12) return put(PUFF.back, 0.8, 1, lineGlyph(cx, hy));
      }
      if (r < R) {
        const [nx, ny] = headDir(cx / R * 0.8, hy / R * 0.8);
        const l = lit(nx, ny);
        if (Math.abs(Math.abs(hy) - R * 0.62) < 0.035 && Math.abs(cx - R * 0.45) < 0.035) return put(PUFF.eye, 1, 1, "@");
        const spot = hash2(Math.floor(cx * 30 + 60), Math.floor(hy * 30 + 60)) < 0.22 && r < R * 0.85;
        return put(spot ? PUFF.spot : PUFF.back, l, 1, spot ? "o" : "");
      }
      // Little fins: pectorals that whirr and a fan tail.
      for (const side of [-1, 1]) {
        const fx = cx - R * 0.1, fy = hy - side * R;
        if (Math.abs(fx) < 0.05 && side * fy > 0 && side * fy < 0.07 + 0.02 * Math.sin(c.phase * 3)) return put(PUFF.belly, 0.85, 0.85, "|");
      }
      const tx = -(cx + R);
      if (tx > 0 && tx < 0.2 && Math.abs(hy) < 0.03 + tx * 0.45) return put(PUFF.back, 0.8, 0.9, lineGlyph(-1, hy * 3));
      return false;
    },
  };

  /* Lotus on a lily pad, floating on the surface. */
  const LOTUS = { pad: [66, 120, 58], vein: [96, 150, 80], petal: [240, 168, 192], base: [252, 232, 236], heart: [236, 196, 70] };
  const lotus = {
    radial: true,
    surface: true,
    reach: 0.55,
    shape(c) {
      const { hx, hy } = F;
      const r = Math.hypot(hx, hy);
      const ang = Math.atan2(hy, hx) - c.spin;
      // Flower, sitting a little off the pad's centre.
      const fx = hx - 0.06, fy = hy + 0.04;
      const fr = Math.hypot(fx, fy), fa = Math.atan2(fy, fx) - c.spin * 0.5;
      if (fr < 0.06) return put(LOTUS.heart, lit(fx * 4, fy * 4), 1, fr < 0.035 ? "o" : "*");
      for (const [n, len, rot] of [[6, 0.17, 0.5], [8, 0.27, 0]]) {
        const sec = fract((fa / TAU) * n + rot) - 0.5; // -0.5..0.5 across a petal
        const width = 0.5 * Math.sin(Math.PI * clamp(fr / len, 0, 1)) * (1 - fr / len * 0.3);
        if (fr < len && Math.abs(sec) < width * 0.95) {
          const t = fr / len;
          const col = mixc(LOTUS.base, LOTUS.petal, smooth(0.2, 0.9, t));
          const [nx, ny] = [fx / len * 0.5, fy / len * 0.5];
          return put(col, lit(nx, ny) * (Math.abs(sec) > width * 0.8 ? 0.82 : 1), 1, Math.abs(sec) > width * 0.75 ? lineGlyph(fx, fy) : "");
        }
      }
      // Pad with a wedge slit and radial veins.
      if (r > 0.5) return false;
      const wedge = Math.abs(((ang + Math.PI) % TAU) - Math.PI);
      if (wedge < 0.16 * (r / 0.5)) return false;
      const vein = Math.abs(fract(ang / TAU * 18) - 0.5) < 0.07 && r > 0.08;
      return put(vein ? LOTUS.vein : LOTUS.pad, lit(hx * 0.3, hy * 0.3) * (r > 0.46 ? 0.8 : 1), 1, vein ? lineGlyph(hx, hy) : "");
    },
  };

  /* Cherry blossom: five notched petals floating on the surface. */
  const SAKURA = { petal: [248, 200, 214], deep: [232, 150, 176], heart: [246, 220, 120] };
  const sakura = {
    radial: true,
    surface: true,
    reach: 0.55,
    shape(c) {
      const { hx, hy } = F;
      const r = Math.hypot(hx, hy);
      const ang = Math.atan2(hy, hx) - c.spin;
      if (r < 0.1) return put(SAKURA.heart, 1, 1, r < 0.05 ? "*" : ".");
      const sec = fract(ang / TAU * 5) - 0.5;
      const notch = 0.5 - 0.06 * Math.exp(-((sec * 14) ** 2));
      const R = notch * (1 - 1.1 * sec * sec);
      if (r > R) return false;
      const col = mixc(SAKURA.deep, SAKURA.petal, smooth(0.08, 0.3, r));
      return put(col, lit(hx * 0.4, hy * 0.4), 1, Math.abs(sec) > 0.42 ? lineGlyph(hx, hy) : "");
    },
  };

  /* Bait fish: so small they are drawn as a classic three-glyph fish, ><> or <><, with a silver glint. */
  const baitfish = { sprite: true, len: 0.5, reach: 0, shape: () => false };

  const SPECIES = { baitfish, hammerhead, whaleShark, turtle, stingray, manta, moonJelly, seaNettle, sardine, puffer, lotus, sakura };

  /* ── creature state ───────────────────────────────────────────────── */

  const NODES = 14;
  function makeCreature(kind, opts) {
    const sp = SPECIES[kind];
    const c = Object.assign(
      { kind, sp, x: 0, y: 0, heading: 0, L: 100, depth: 0.3, phase: Math.random() * TAU, spin: 0, puff: 0, bend: 0.5 },
      opts
    );
    c.nodes = new Float32Array(NODES * 2);
    layStraight(c);
    return c;
  }
  // Lay the spine out behind the head along the heading, with a gentle swimming curve.
  function layStraight(c) {
    const span = (c.sp.len || 1) * c.L;
    const hx = Math.cos(c.heading), hy = Math.sin(c.heading);
    for (let i = 0; i < NODES; i++) {
      const t = i / (NODES - 1);
      const wave = Math.sin(c.phase - t * 4) * 0.06 * c.bend * t * c.L;
      c.nodes[i * 2] = c.x - hx * span * t - hy * wave;
      c.nodes[i * 2 + 1] = c.y - hy * span * t + hx * wave;
    }
  }

  /* ── renderer ─────────────────────────────────────────────────────── */

  // Sparse glyphs on lit skin, dense ones in shadow.
  const RAMP = ":;t%SX8#@";
  const SUB = [0.25, 0.3, 0.75, 0.3, 0.25, 0.72, 0.75, 0.72];
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
      this.cw = cell || clamp(Math.round(w / 150), 7, 10);
      this.ch = Math.round(this.cw * 1.55);
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
      this.shadow = new Float32Array(n);
    }

    water(t) {
      const { cols, rows, cw, ch, tr, tg, tb, gl, gr, gg, gb } = this;
      for (let r = 0; r < rows; r++) {
        for (let q = 0; q < cols; q++) {
          const i = r * cols + q;
          const x = q * cw, y = r * ch;
          // Slow caustic web: two drifting wave fields crossing.
          const w1 = Math.sin(x * 0.021 + t * 0.21 + Math.sin(y * 0.017 - t * 0.13) * 2.1);
          const w2 = Math.sin(y * 0.026 - t * 0.17 + Math.sin(x * 0.014 + t * 0.11) * 2.3);
          const w3 = Math.sin(x * 0.047 - y * 0.031 + t * 0.19 + w1);
          const caustic = Math.pow(1 - Math.abs(w1 * w2), 9) * (0.55 + 0.45 * w3 * w3);
          const deep = 0.5 + 0.5 * Math.sin(x * 0.004 + y * 0.003 + 1.3);
          const n = this.night;
          tr[i] = mix(24 + 10 * deep + 22 * caustic, 3 + 3 * deep + 4 * caustic, n);
          tg[i] = mix(100 + 22 * deep + 34 * caustic, 10 + 6 * deep + 8 * caustic, n);
          tb[i] = mix(120 + 20 * deep + 30 * caustic, 20 + 8 * deep + 12 * caustic, n);
          const s = this.shadow[i];
          if (s > 0) {
            tr[i] *= 1 - s;
            tg[i] *= 1 - s;
            tb[i] *= 1 - s;
          }
          if (caustic > 0.62) {
            gl[i] = caustic > 0.85 ? "~" : "-";
            gr[i] = mix(96, 20, this.night); gg[i] = mix(170, 46, this.night); gb[i] = mix(180, 64, this.night);
          } else if (hash2(q, r) < 0.012) {
            // Drifting specks; at night a few of them glow.
            const glowing = this.night > 0.5 && hash2(r, q) < 0.25;
            gl[i] = ".";
            gr[i] = glowing ? 90 : mix(70, 26, this.night); gg[i] = glowing ? 220 : mix(140, 50, this.night); gb[i] = glowing ? 230 : mix(156, 66, this.night);
          } else gl[i] = "";
        }
      }
    }

    // A tiny fish as three glyphs along its heading.
    drawSprite(c, castShadow) {
      const { cols, rows, cw, ch } = this;
      const hx = Math.cos(c.heading), hy = Math.sin(c.heading);
      // Always drawn side on, as ><> or <><, which reads as a fish at any heading.
      const glyphs = hx > 0 ? [">", "<", ">"] : ["<", ">", "<"];
      // Head first, then body and tail stepping back a cell at a time.
      const stepX = hx > 0 ? -1 : 1, stepY = 0;
      const off = castShadow || 0;
      const q0 = Math.floor((c.x + off * 0.9) / cw), r0 = Math.floor((c.y + off) / ch);
      const glint = 0.5 + 0.5 * Math.sin(c.phase * 2);
      const night = this.night;
      for (let k = 0; k < 3; k++) {
        // Facing right the string reads tail-body-head, so walk it from the head end.
        const q = q0 + stepX * k, r = r0 + stepY * k;
        if (q < 0 || r < 0 || q >= cols || r >= rows) continue;
        const i = r * cols + q;
        if (castShadow) { this.shadow[i] = Math.max(this.shadow[i], 0.18 * (1 - night)); continue; }
        const fog = c.depth * 0.6;
        const base = mix(150 + 70 * glint, 120, fog) * mix(1, 0.5, night);
        this.tr[i] = mix(this.tr[i], base * 0.62, 0.55);
        this.tg[i] = mix(this.tg[i], base * 0.8, 0.55);
        this.tb[i] = mix(this.tb[i], base * 0.9, 0.55);
        this.gl[i] = glyphs[hx > 0 ? 2 - k : k];
        this.gr[i] = Math.min(255, base * 1.05); this.gg[i] = Math.min(255, base * 1.12); this.gb[i] = Math.min(255, base * 1.18);
      }
    }

    // Sample a creature over the cells its bounding box covers.
    draw(c, castShadow) {
      if (c.sp.sprite) return this.drawSprite(c, castShadow);
      const { cols, rows, cw, ch } = this;
      const sp = c.sp;
      const L = c.L;
      const scale = 1;
      const fog = c.depth * 0.42;
      const nodes = c.nodes;
      // Bounding box from spine plus reach.
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (let i = 0; i < NODES; i++) {
        x0 = Math.min(x0, nodes[i * 2]); x1 = Math.max(x1, nodes[i * 2]);
        y0 = Math.min(y0, nodes[i * 2 + 1]); y1 = Math.max(y1, nodes[i * 2 + 1]);
      }
      const pad = (sp.reach + 0.05) * L * scale;
      let offX = 0, offY = 0;
      if (castShadow) {
        offX = castShadow * 0.9;
        offY = castShadow;
      }
      const c0 = Math.max(0, Math.floor((x0 - pad + offX) / cw)), c1 = Math.min(cols - 1, Math.floor((x1 + pad + offX) / cw));
      const r0 = Math.max(0, Math.floor((y0 - pad + offY) / ch)), r1 = Math.min(rows - 1, Math.floor((y1 + pad + offY) / ch));
      // Head frame from the first spine segment.
      let htx = nodes[0] - nodes[2], hty = nodes[1] - nodes[3];
      const hl = Math.hypot(htx, hty) || 1;
      htx /= hl; hty /= hl;
      if (sp.radial) { htx = Math.cos(c.heading); hty = Math.sin(c.heading); }
      F.htx = htx; F.hty = hty;
      const night = this.night;
      const water = mixc([30, 112, 128], [8, 22, 38], night);
      for (let r = r0; r <= r1; r++) {
        for (let q = c0; q <= c1; q++) {
          // Four samples per cell: coverage softens the outline, the first hit gives the glyph.
          let n = 0, R = 0, G = 0, B = 0, A = 0, L0 = 0, ch0 = "", glow = 0, first = true;
          for (let k = 0; k < 8; k += 2) {
            const X = (q + SUB[k]) * cw - offX, Y = (r + SUB[k + 1]) * ch - offY;
            const dx = (X - nodes[0]) / L, dy = (Y - nodes[1]) / L;
            F.hx = dx * htx + dy * hty;
            F.hy = -dx * hty + dy * htx;
            if (!sp.radial) this.spineCoords(c, X, Y);
            if (!sp.shape(c)) continue;
            n++;
            R += hit.r; G += hit.g; B += hit.b; A += hit.a;
            if (first || (hit.ch && !ch0)) { L0 = hit.l; ch0 = hit.ch; glow = hit.glow; first = false; }
          }
          if (!n) continue;
          const i = r * cols + q;
          const cover = n / 4;
          if (castShadow) {
            this.shadow[i] = Math.max(this.shadow[i], (0.32 - 0.12 * night) * (A / n) * cover);
            continue;
          }
          R /= n; G /= n; B /= n;
          // Glowing creatures stay bright at night; everything else dims with the water.
          const dim = mix(1, mix(0.62, 1, glow > 0 ? 0.85 : 0), night);
          R *= dim; G *= dim; B *= dim;
          R = mix(R, water[0], fog); G = mix(G, water[1], fog); B = mix(B, water[2], fog);
          const a = (A / n) * cover * (1 - c.depth * 0.15);
          this.tr[i] = mix(this.tr[i], R, a);
          this.tg[i] = mix(this.tg[i], G, a);
          this.tb[i] = mix(this.tb[i], B, a);
          if (cover < 0.5 && !ch0) {
            // Soft edge: a light glyph instead of a block.
            this.gl[i] = cover < 0.3 ? "." : ":";
            this.gr[i] = Math.min(255, R * 1.1); this.gg[i] = Math.min(255, G * 1.1); this.gb[i] = Math.min(255, B * 1.1);
          } else if (a > 0.3 || ch0) {
            const glyph = ch0 === " " ? "" : ch0 || RAMP[clamp(Math.floor((1 - L0) * 1.45 * RAMP.length), 0, RAMP.length - 1)];
            this.gl[i] = glyph;
            // Etched glyphs: darker than the tile; translucent creatures glow lighter instead.
            const k = glow > 0 ? 1.3 + glow : ch0 ? 0.55 : 0.7;
            const add = glow > 0 ? 24 + 40 * night : 0;
            this.gr[i] = Math.min(255, this.tr[i] * k + add);
            this.gg[i] = Math.min(255, this.tg[i] * k + add);
            this.gb[i] = Math.min(255, this.tb[i] * k + add * 1.1);
          }
        }
      }
    }

    // Nearest point on the spine: arc position s, signed distance a, local tangent and right-hand normal.
    spineCoords(c, X, Y) {
      const n = c.nodes;
      const L = c.L;
      const span = (c.sp.len || 1);
      let best = Infinity, bs = 0, ba = 0, btx = 1, bty = 0;
      for (let i = 0; i < NODES - 1; i++) {
        const ax = n[i * 2], ay = n[i * 2 + 1], bx = n[i * 2 + 2], by = n[i * 2 + 3];
        const ex = bx - ax, ey = by - ay;
        const el = ex * ex + ey * ey || 1;
        let t = ((X - ax) * ex + (Y - ay) * ey) / el;
        const tc = clamp(t, i === 0 ? -1 : 0, i === NODES - 2 ? 2 : 1);
        const qx = ax + ex * tc, qy = ay + ey * tc;
        const d = (X - qx) ** 2 + (Y - qy) ** 2;
        if (d < best) {
          best = d;
          const len = Math.sqrt(el);
          const tx = -ex / len, ty = -ey / len; // pointing towards the head
          btx = tx; bty = ty;
          bs = ((i + tc) / (NODES - 1)) * span;
          // Right of the heading: (-ty, tx)
          ba = ((X - qx) * -ty + (Y - qy) * tx) / L;
          if (tc !== t) {
            // Beyond the ends: keep the distance along the line so the snout and tail tip stay round.
            ba = ((X - qx) * -ty + (Y - qy) * tx) / L;
          }
        }
      }
      F.s = bs;
      F.a = ba;
      F.tx = btx; F.ty = bty;
      F.px = -bty; F.py = btx;
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
      ctx.font = `600 ${Math.round(ch * 0.8)}px ${FONT}`;
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

    // Rings spreading on the surface: a thin line of glyphs that fades as it widens.
    drawRipples(ripples) {
      const { cols, rows, cw, ch } = this;
      for (const rp of ripples) {
        const life = rp.age / rp.life;
        if (life >= 1) continue;
        const R = rp.r0 + rp.speed * rp.age;
        const fade = (1 - life) * (1 - life) * rp.strength;
        const c0 = Math.max(0, Math.floor((rp.x - R - cw) / cw)), c1 = Math.min(cols - 1, Math.floor((rp.x + R + cw) / cw));
        const r0 = Math.max(0, Math.floor((rp.y - R - ch) / ch)), r1 = Math.min(rows - 1, Math.floor((rp.y + R + ch) / ch));
        for (let r = r0; r <= r1; r++) {
          for (let q = c0; q <= c1; q++) {
            const dx = (q + 0.5) * cw - rp.x, dy = ((r + 0.5) * ch - rp.y) * 1.0;
            const d = Math.hypot(dx, dy);
            if (Math.abs(d - R) > cw * 0.75) continue;
            const i = r * cols + q;
            const k = 0.35 * fade;
            this.tr[i] = mix(this.tr[i], 210, k);
            this.tg[i] = mix(this.tg[i], 240, k);
            this.tb[i] = mix(this.tb[i], 245, k);
            this.gl[i] = lineGlyph(-dy, dx);
            const g = mix(this.gg[i], 255, fade);
            this.gr[i] = mix(this.gr[i], 220, fade); this.gg[i] = g; this.gb[i] = mix(this.gb[i], 255, fade);
          }
        }
      }
    }

    frame(creatures, t, ripples) {
      this.shadow.fill(0);
      // Shadows on the sea floor for anything near the surface: the shallower, the further it falls.
      for (const c of creatures) {
        if (c.depth < 0.5) this.draw(c, 6 + (0.5 - c.depth) * 40);
      }
      this.water(t);
      const order = [...creatures].sort((a, b) => b.depth - a.depth);
      // Ripples sit on the surface: under the floating flowers, over everything that swims.
      let rippled = false;
      for (const c of order) {
        if (!rippled && c.depth <= 0.02 && ripples) { this.drawRipples(ripples); rippled = true; }
        this.draw(c, 0);
      }
      if (!rippled && ripples) this.drawRipples(ripples);
      this.present();
    }
  }

  /* ── the tank ─────────────────────────────────────────────────────── */

  // How each species moves: cruising speed (body lengths per second is too fast for big ones,
  // so these are pixels per second at full size), turn rate, and how shy it is of the pointer.
  const MOVES = {
    whaleShark: { speed: 20, turn: 0.12, shy: 0 },
    hammerhead: { speed: 38, turn: 0.3, shy: 0.2 },
    turtle: { speed: 22, turn: 0.2, shy: 0.4 },
    stingray: { speed: 26, turn: 0.25, shy: 0.6 },
    manta: { speed: 28, turn: 0.18, shy: 0.2 },
    puffer: { speed: 16, turn: 0.5, shy: 0.5 },
    sardine: { speed: 44, turn: 1.2, shy: 1 },
    moonJelly: { speed: 6, turn: 0.1, shy: 0 },
    seaNettle: { speed: 7, turn: 0.1, shy: 0 },
    lotus: { speed: 3, turn: 0.05, shy: 0 },
    sakura: { speed: 5, turn: 0.1, shy: 0 },
    baitfish: { speed: 46, turn: 2.2, shy: 1.6 },
  };
  const NAMES = {
    whaleShark: "Whale shark", hammerhead: "Hammerhead", turtle: "Sea turtle", stingray: "Blue-spotted stingray",
    manta: "Manta ray", puffer: "Pufferfish", sardine: "Sardine", moonJelly: "Moon jellyfish", seaNettle: "Sea nettle",
    lotus: "Lotus", sakura: "Cherry blossom", baitfish: "Bait fish",
  };

  function angleTo(a, b) {
    let d = b - a;
    while (d > Math.PI) d -= TAU;
    while (d < -Math.PI) d += TAU;
    return d;
  }

  class Tank {
    constructor(canvas) {
      this.canvas = canvas;
      this.renderer = new Renderer(canvas);
      this.creatures = [];
      this.ripples = [];
      this.pointer = { x: -9999, y: -9999, on: false };
      this.t = 0;
      this.mode = "auto";
      this.night = 0;
      this.resize();
    }

    resize() {
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = w; this.h = h;
      this.unit = clamp(Math.sqrt(w * h) / 1100, 0.5, 1.15);
      this.renderer.resize(w, h, dpr, w < 600 ? 6 : clamp(Math.round(w / 160), 7, 10));
      if (!this.creatures.length) this.populate();
    }

    rand(a, b) { return a + Math.random() * (b - a); }

    spawn(kind, L, depth, extra) {
      const shrink = 1 - 0.3 * depth;
      const c = makeCreature(kind, Object.assign({
        x: this.rand(0.1, 0.9) * this.w,
        y: this.rand(0.12, 0.88) * this.h,
        heading: this.rand(0, TAU),
        L: L * this.unit * shrink,
        baseL: L,
        depth,
        bend: 0.6,
        wanderSeed: Math.random() * 100,
      }, extra));
      c.move = MOVES[kind];
      c.speed = c.move.speed * (0.6 + 0.4 * this.unit) * this.rand(0.85, 1.15);
      c.target = c.heading;
      c.flee = 0;
      this.creatures.push(c);
      this.resetSpine(c);
      return c;
    }

    populate() {
      const small = this.w < 700;
      this.spawn("whaleShark", 560, 0.62, { bend: 0.5 });
      this.spawn("hammerhead", 320, 0.38, { bend: 0.8 });
      if (!small) this.spawn("hammerhead", 280, 0.55, { bend: 0.8 });
      this.spawn("turtle", 250, 0.22);
      this.spawn("stingray", 250, 0.72);
      this.spawn("manta", 260, 0.46);
      this.spawn("puffer", 120, 0.18);
      this.spawn("moonJelly", 150, 0.12, { spin: Math.random() * TAU });
      this.spawn("moonJelly", 110, 0.3, { spin: Math.random() * TAU });
      if (!small) this.spawn("moonJelly", 90, 0.44, { spin: Math.random() * TAU });
      this.spawn("seaNettle", 110, 0.26);
      // Schools of bait fish.
      for (let s = 0; s < (small ? 1 : 2); s++) {
        const cx = this.rand(0.2, 0.8) * this.w, cy = this.rand(0.25, 0.75) * this.h, hd = this.rand(0, TAU);
        const n = small ? 16 : 22;
        for (let i = 0; i < n; i++) {
          this.spawn("baitfish", 20, 0.08 + 0.06 * s, { x: cx + this.rand(-60, 60), y: cy + this.rand(-40, 40), heading: hd, school: s });
        }
      }
      // On the surface.
      this.spawn("lotus", 160, 0, { spin: Math.random() * TAU });
      if (!small) this.spawn("lotus", 110, 0, { spin: Math.random() * TAU });
      for (let i = 0; i < (small ? 3 : 5); i++) this.spawn("sakura", this.rand(34, 56), 0, { spin: Math.random() * TAU });
    }

    resetSpine(c) {
      layStraight(c);
      c.rest = new Float32Array(c.nodes);
    }

    // Follow-the-leader spine: each node trails the one ahead at a fixed spacing.
    trail(c) {
      const n = c.rest;
      const seg = ((c.sp.len || 1) * c.L) / (NODES - 1);
      n[0] = c.x; n[1] = c.y;
      for (let i = 1; i < NODES; i++) {
        let dx = n[i * 2] - n[i * 2 - 2], dy = n[i * 2 + 1] - n[i * 2 - 1];
        const d = Math.hypot(dx, dy) || 1;
        n[i * 2] = n[i * 2 - 2] + (dx / d) * seg;
        n[i * 2 + 1] = n[i * 2 - 1] + (dy / d) * seg;
      }
      // Render spine: the trail plus a swimming wave that grows towards the tail.
      for (let i = 0; i < NODES; i++) {
        const t = i / (NODES - 1);
        const j = Math.max(1, i);
        let tx = n[j * 2 - 2] - n[j * 2], ty = n[j * 2 - 1] - n[j * 2 + 1];
        const d = Math.hypot(tx, ty) || 1;
        tx /= d; ty /= d;
        const wave = Math.sin(c.phase - t * 4) * 0.05 * c.bend * t * c.L;
        c.nodes[i * 2] = n[i * 2] - ty * wave;
        c.nodes[i * 2 + 1] = n[i * 2 + 1] + tx * wave;
      }
    }

    step(dt) {
      this.t += dt;
      const { w, h, pointer } = this;
      // Schools: centre and average heading of each.
      const schools = [];
      for (const c of this.creatures) {
        if (c.school === undefined) continue;
        const S = (schools[c.school] ||= { x: 0, y: 0, hx: 0, hy: 0, n: 0 });
        S.x += c.x; S.y += c.y; S.hx += Math.cos(c.heading); S.hy += Math.sin(c.heading); S.n++;
      }
      for (const S of schools) if (S) { S.x /= S.n; S.y /= S.n; }

      for (const c of this.creatures) {
        const m = c.move;
        const surface = c.depth === 0;
        // Wander: a slowly drifting preferred heading.
        c.target += (Math.sin(this.t * 0.11 + c.wanderSeed) * 0.5 + Math.sin(this.t * 0.043 + c.wanderSeed * 2)) * dt * m.turn;
        let want = c.target;
        // Stay in the tank: big ones may slip partly off screen, then come back.
        const margin = surface ? 30 : Math.min(c.L * 0.25, 120);
        const inX = c.x < -margin ? 1 : c.x > w + margin ? -1 : 0;
        const inY = c.y < -margin ? 1 : c.y > h + margin ? -1 : 0;
        if (inX || inY) want = Math.atan2(inY || (h / 2 - c.y) / h, inX || (w / 2 - c.x) / w);
        // Schooling: steer towards the school's centre and heading.
        if (c.school !== undefined) {
          const S = schools[c.school];
          const toC = Math.atan2(S.y - c.y, S.x - c.x);
          const dist = Math.hypot(S.x - c.x, S.y - c.y);
          const align = Math.atan2(S.hy, S.hx);
          want = c.target = align + angleTo(align, toC) * clamp(dist / 160, 0, 0.8);
          if (inX || inY) want = Math.atan2(inY || (h / 2 - c.y) / h, inX || (w / 2 - c.x) / w);
          // Personal space.
          for (const o of this.creatures) {
            if (o === c || o.school !== c.school) continue;
            const dx = c.x - o.x, dy = c.y - o.y;
            if (Math.abs(dx) < 22 && Math.abs(dy) < 16) { c.x += dx * dt * 1.5; c.y += dy * dt * 1.5; }
          }
        }
        // Shy creatures turn away from the pointer; bait fish bolt.
        let boost = 1;
        if (pointer.on && m.shy > 0) {
          const dx = c.x - pointer.x, dy = c.y - pointer.y;
          const d = Math.hypot(dx, dy);
          const R = 90 + 60 * m.shy;
          if (d < R) {
            const away = Math.atan2(dy, dx);
            want = c.heading + angleTo(c.heading, away) * 0.9;
            c.flee = Math.max(c.flee, (1 - d / R) * m.shy);
          }
        }
        c.flee = Math.max(0, c.flee - dt * 0.8);
        boost += c.flee * 2.2;
        const turn = m.turn * (1 + c.flee * 3);
        c.heading += clamp(angleTo(c.heading, want), -turn * dt, turn * dt);
        const v = c.speed * boost;
        c.x += Math.cos(c.heading) * v * dt;
        c.y += Math.sin(c.heading) * v * dt;
        // Tail beat speeds up with speed; jellies pulse at their own calm pace.
        c.phase += dt * (c.sp.radial ? 1.1 : 1.6 + (v / Math.max(30, c.L)) * 3);
        if (c.sp.radial) c.spin += dt * (surface ? 0.04 : 0.02);
        // Floating flowers get nudged along by the pointer.
        if (surface && pointer.on) {
          const dx = c.x - pointer.x, dy = c.y - pointer.y, d = Math.hypot(dx, dy);
          if (d < c.L * 0.6 + 30) { c.x += (dx / (d || 1)) * 30 * dt; c.y += (dy / (d || 1)) * 30 * dt; if (Math.random() < dt * 2) this.ripple(c.x, c.y, 0.5); }
        }
        if (c.kind === "puffer" && c.puff > 0) {
          c.puffTime -= dt;
          if (c.puffTime < 0) c.puff = Math.max(0, c.puff - dt * 0.4);
        }
        if (c.kind === "puffer" && c.puffTarget) {
          c.puff = Math.min(1, c.puff + dt * 3);
          if (c.puff >= 1) c.puffTarget = false;
        }
        if (c.sp.radial) { c.nodes[0] = c.x; c.nodes[1] = c.y; } else this.trail(c);
      }
      for (const rp of this.ripples) rp.age += dt;
      this.ripples = this.ripples.filter((rp) => rp.age < rp.life);
    }

    ripple(x, y, strength) {
      if (this.ripples.length > 24) return;
      this.ripples.push({ x, y, r0: 4, speed: 34, age: 0, life: 3.2, strength: strength || 1 });
    }

    // What sits under a point, nearest the surface first.
    pick(x, y) {
      let best = null, bd = Infinity;
      for (const c of this.creatures) {
        if (c.kind === "baitfish") continue;
        const n = c.nodes;
        const span = c.sp.radial ? 0 : NODES - 1;
        for (let i = 0; i <= span; i += 2) {
          const d = Math.hypot(n[i * 2] - x, n[i * 2 + 1] - y) / (c.L * 0.5);
          const score = d + c.depth * 0.3;
          if (d < 0.6 && score < bd) { bd = score; best = c; }
        }
      }
      return best;
    }

    tap(x, y) {
      this.ripple(x, y, 1);
      const c = this.pick(x, y);
      if (c && c.kind === "puffer") { c.puffTarget = true; c.puffTime = 4; }
      // Everything nearby flinches a little.
      for (const o of this.creatures) {
        const d = Math.hypot(o.x - x, o.y - y);
        if (d < 160 && o.move.shy > 0) o.flee = Math.max(o.flee, o.move.shy * (1 - d / 160));
      }
      return c;
    }

    render() {
      this.renderer.night = this.night;
      this.renderer.frame(this.creatures, this.t, this.ripples);
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
      document.documentElement.dataset.night = targetNight() > 0.5 ? "1" : "0";
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

  global.Aquarium = { SPECIES, makeCreature, layStraight, Renderer, Tank, NODES, TAU };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
