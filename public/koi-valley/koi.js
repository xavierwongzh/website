(() => {
"use strict";
// ---------- content (resume, transcript, GitHub and the current site) ----------
// projects with a koi palette swim in the pond; every project has its own detail page
const PROJECTS = [
  { id: "trading", title: "AI Paper Trading Bot", sub: "GPT vs Grok, long-term vs options", when: "Jun 2026 – Present", role: "Personal project",
    text: "A fully automated paper trading experiment that runs four Alpaca accounts side by side: a long-term strategy and an options swing strategy, each driven by GPT and by Grok.",
    detail: "The rule is simple: code decides, the model proposes. Every run builds one shared signal layer (technicals for about 60 names, VIX and regime, market internals, 13 sector ETFs and a three-lane options-flow scan), and both models see byte-identical prompts so the only variable is the model. Their proposals then pass through a hard risk gate before anything is placed. A Cloudflare Worker triggers the runs on GitHub Actions twice a trading day, with safeguards for missed runs and Telegram alerts when something goes wrong.",
    features: ["2×2 experiment: GPT and Grok × long-term and options swing, on separate paper accounts", "Long-term: buys near key moving averages with bullish flow, a DCA ladder on dips and profit harvesting", "Options: single-leg calls and puts, 30–90 days out, with a loss floor and time-based exits", "Risk gate: drawdown breakers, daily loss limit and a VIX-based risk-off regime", "Invariants enforced by tests, from identical prompts to no resting stop orders", "Supabase flow history and a read-only Next.js dashboard with Recharts"],
    outcomes: ["Runs hands-free on schedule, with every proposal, veto and order logged"],
    tags: ["Python", "LLMs", "Alpaca", "GitHub Actions", "Cloudflare Workers", "Supabase", "Next.js"],
    koi: ["#f2c230","#f5cd45","#f5cd45","#f7d65a","#f7d65a","#f5cd45","#f2c230","#f2c230"] },
  { id: "commonground", title: "CommonGround", sub: "Find places everyone can reach", when: "May 2026", role: "Personal project",
    text: "A travel-time explorer that helps groups find meetup spots, offices and amenities reachable from everyone's starting point.",
    detail: "Add any address, postcode or landmark, pick a travel mode and a time band, and CommonGround draws each person's reachable area as an isochrone, then finds where they all overlap. Places inside the shared zone can be filtered by category or searched freely, from coworking spaces to kway chap.",
    features: ["Public transport, walking, cycling and driving", "Time bands from 10 to 180 minutes", "Multi-location overlap with Turf.js polygon intersection", "Place discovery and free-text search inside the shared zone"],
    outcomes: ["Live and usable anywhere in the world, starting from Singapore"],
    tags: ["Next.js", "TypeScript", "Google Maps", "TravelTime API", "Turf.js"],
    links: [["Live demo", "https://commonground-inky.vercel.app/"], ["GitHub", "https://github.com/xavierwongzh/CommonGround"]],
    koi: ["#f3efe8","#1f1d22","#f3efe8","#1f1d22","#1f1d22","#f3efe8","#1f1d22","#f3efe8"] },
  { id: "odiocheck", title: "OdioCheck", sub: "Deepfake voice detection", when: "Jan – Apr 2026", role: "Artificial Intelligence (50.021)",
    text: "An AI system that flags deepfake voices, aimed at the rising number of audio deepfake scams.",
    detail: "We trained four detectors on the multilingual MLAAD-tiny dataset: a Wav2Vec 2.0 baseline, an AASIST graph baseline on mel-spectrograms, a CQCC CNN baseline, and a custom model that fuses Wav2Vec 2.0 and CQCC features through bidirectional cross-attention and a graph transformer. A FastAPI web app compares all four side by side on any uploaded clip.",
    features: ["Three baselines plus a custom cross-attention fusion model", "ROC-AUC comparison across all models", "Upload WAV, MP3, OGG or M4A for side-by-side predictions"],
    tags: ["PyTorch", "Wav2Vec 2.0", "AASIST", "FastAPI"],
    links: [["GitHub", "https://github.com/xavierwongzh/OdioCheck"]] },
  { id: "revine", title: "ReVine", sub: "AI meme-to-video generation", when: "Oct 2025", role: "Cursor Hackathon Singapore",
    text: "Upload a photo of your face and ReVine stars you in a classic Vine meme, using reference-to-video generation.",
    detail: "Built during the hackathon, ReVine orchestrates several AI tools for research, prompting and rapid prototyping. Video generation models run on fal, with Supabase handling authentication and media storage, and the front end prototyped with Vercel v0.",
    features: ["Face reference upload and meme template selection", "Reference-to-video workflow with prompt iteration", "Supabase authentication and media storage"],
    outcomes: ["2nd place, Cursor Hackathon Singapore (fal track)"],
    tags: ["Generative AI", "fal", "Supabase", "Vercel v0"],
    links: [["Open ReVine", "https://revine-sigma.vercel.app/"], ["GitHub", "https://github.com/hunchongtan/revine"], ["Video", "https://youtu.be/lHktWx5rvhc"]],
    koi: ["#f4efe6","#d8361e","#d8361e","#f4efe6","#f4efe6","#d8361e","#f4efe6","#f4efe6"] },
  { id: "duby", title: "DUBY (Duty Buddy)", sub: "Optimization-driven nurse rostering", when: "Sep 2025 – Apr 2026", role: "Capstone · St Andrew's Community Hospital",
    text: "Nurse rostering at the ward took nurse managers more than three hours every cycle. DUBY generates compliant, fair 14-day rosters for Registered Nurses, Enrolled Nurses and Healthcare Assistants in minutes.",
    detail: "The core engine is a mixed-integer linear program in Python (Pyomo) that allocates shifts while respecting coverage, rest rules, leave requests and fairness for weekend and night shifts. CP-SAT acts as a fallback solver, so the system always produces a usable roster even when the main model cannot.",
    features: ["Coverage, labour-rule and rest-rule constraints for multi-role wards", "Fairness controls for weekends and night shifts", "Leave requests built into the model", "CP-SAT fallback that guarantees a usable roster"],
    outcomes: ["Piloted at Ward 6, St Andrew's Community Hospital", "Rostering time cut from over 3 hours to under 15 minutes per cycle (91.7% less)", "Commended by both nurse managers"],
    tags: ["Python", "Pyomo", "MILP", "CP-SAT", "Workforce Scheduling"],
    koi: ["#f08a24","#f39a2e","#f39a2e","#f6a83a","#f6a83a","#f39a2e","#f08a24","#f08a24"] },
  { id: "runway", title: "San Diego Airport Simulation", sub: "Runway and surface operations at KSAN", when: "Sep – Dec 2025", role: "Airport Systems Modelling and Simulation",
    text: "A discrete-event study of one of the world's busiest single-runway airports, testing which operational changes actually move throughput.",
    detail: "I processed real flight movement data from Flightradar24, cleaned and structured it in R, and turned it into demand scenarios for discrete-event simulation in CAST. Strategies such as taxiway restrictions, departure queue management, runway exit configurations and reduced wake-turbulence separations were compared side by side.",
    features: ["Demand scenarios built from real Flightradar24 movements", "CAST models of runway and surface operations", "Policy comparison through throughput and delay propagation"],
    outcomes: ["Found that ground layout constraints, not separations, were the main bottleneck", "Challenged the assumption that reduced wake-turbulence separations would meaningfully raise throughput"],
    tags: ["CAST", "R", "Discrete-Event Simulation", "Aviation"],
    koi: ["#1d1b1f","#d33a22","#f2ece2","#1d1b1f","#d33a22","#1d1b1f","#f2ece2","#1d1b1f"],
    links: [["Slides", "https://www.canva.com/design/DAG4QocqLQY/aZCQcYlf71RBD42a7JaHoQ/view"]] },
  { id: "pillsnap", title: "PillSnap", sub: "AI-powered pill identification", when: "Aug – Sep 2025", role: "SGHackItRX 2025",
    text: "Snap one photo of several pills and PillSnap detects, crops and identifies each of them for clinicians and pharmacists.",
    detail: "Manual pill identification during medication reconciliation is slow and error-prone. PillSnap's computer vision pipeline finds every pill in an image, crops it and matches it, so healthcare professionals spend less time looking things up.",
    features: ["Multi-pill capture with automatic detection and cropping", "Computer vision identification pipeline", "Workflow shaped around medication reconciliation"],
    outcomes: ["1st Runner-Up, SGHackItRX 2025"],
    tags: ["Computer Vision", "Healthcare AI"],
    links: [["Open PillSnap", "https://pill-snap.vercel.app/"], ["Devpost", "https://devpost.com/software/pillsnap-instant-ai-pill-identifier-for-hcps"], ["GitHub", "https://github.com/hunchongtan/PillSnap"], ["Video", "https://youtu.be/SS0_JtjGJcg"]],
    koi: ["#d42a1f","#f6f2ea","#f6f2ea","#f6f2ea","#f6f2ea","#f6f2ea","#f6f2ea","#f6f2ea"] },
  { id: "pump", title: "Pump Protocol", sub: "Agent-based petrol station simulation", when: "Jan – Apr 2025", role: "Simulation Modelling and Analysis (40.015)",
    text: "An interactive agent-based simulation of a petrol station that shows how arrivals, pumps, staffing and price affect waits and profit.",
    detail: "Cars arrive, queue, fuel, pay and leave in an animated station. Sliders change arrival and departure probability, fuel price and animation speed, while dropdowns set 2 to 24 pumps and 1 to 3 attendants. Live metrics and charts track rejections, time in system and cumulative profit.",
    features: ["Interactive what-if controls", "Live KPIs: rejection rate, pump duration, time in system, fuel per car", "Rejection-rate and profit charts built with D3"],
    tags: ["JavaScript", "D3", "Agent-Based Modelling"],
    links: [["Live demo", "https://pump-protocol-rho.vercel.app/"], ["Video", "https://youtu.be/eP6PW0RAqck"], ["GitHub", "https://github.com/xavierwongzh/pump-protocol"]] },
  { id: "derma", title: "DermaCare", sub: "AI dermatology assistant for GPs", when: "Jan – Mar 2025", role: "InterSystems challenge",
    text: "Helps general practitioners make faster, more confident preliminary skin assessments, while the GP stays in charge of the diagnosis.",
    detail: "A GP uploads a photo and the patient's history. DermaCare runs an image vector search over about 20,000 DermNet images in InterSystems IRIS and returns likely conditions with explainable evidence. Low-risk, high-confidence cases can be treated on the spot, and high-risk or uncertain ones get a fast specialist referral.",
    features: ["Hybrid analysis of image and patient history", "IRIS vector search over about 20,000 reference images", "Referral path for high-risk or low-confidence cases"],
    tags: ["Healthcare AI", "Vector Search", "InterSystems IRIS", "Next.js"],
    links: [["Open DermaCare", "https://dermacare-gilt.vercel.app/"], ["Video", "https://youtu.be/aN6GkPjVOqg"], ["GitHub", "https://github.com/rappleit/dermacare"]] },
  { id: "queue", title: "Queue Optima", sub: "Queueing policy for airport immigration", when: "May – Aug 2024", role: "Engineering Systems Architecture · Manufacturing and Service Operations",
    text: "A prescriptive analytics tool that compares immigration queue policies at Los Angeles International Airport.",
    detail: "Built on an M/M/k model, Queue Optima compares a unified queue, a double queue and a priority queue, and how counters are split between U.S. citizens and other passengers. The aim was to cut waits for citizens while staying fair to everyone else. Weighing queue psychology, we recommended the double queue.",
    features: ["Three queue policies under one M/M/k framework", "Counter allocation experiments", "R Shiny web app with interactive charts"],
    tags: ["R", "Shiny", "Queueing Theory", "Aviation"],
    links: [["Poster", "https://www.canva.com/design/DAGKddFkkX8/XL780SzpzexyzLDrUPcGFg/view"], ["Slides", "https://www.canva.com/design/DAGL70KG5sw/Xip9rGFI0BsoF5dIO5NMkw/view"], ["GitHub", "https://github.com/xavierwongzh/The_Cabin_Crew"]] },
  { id: "inventory", title: "Inventory Planning Management", sub: "Forecasting and BOM planning dashboards", when: "Jan – Apr 2024", role: "With Tai Sin Electric",
    text: "Demand forecasting and Power BI dashboards to give an electrical manufacturer better inventory visibility.",
    detail: "I analysed transactional and product data to find demand patterns and seasonality, then built dashboards that track inventory health, demand trends and operational KPIs for faster procurement and production decisions.",
    features: ["Inventory health and demand-trend dashboards", "KPIs defined with stakeholders"],
    tags: ["Power BI", "DAX", "Forecasting"],
    links: [["Poster", "https://www.canva.com/design/DAHDovNwAfk/MG_XvoYx8bV8uU8TmfqQXg/view"]] },
  { id: "hive", title: "Hive", sub: "iOS app for interest communities", when: "Sep 2023", role: "SUTD-SP SwiftUI Nano Academy",
    text: "An iOS app that helps people in Singapore find like-minded people, join interest groups and start outings together.",
    detail: "Users join a Hive (a community), take part in Buzzes (events), and can initiate their own of either. Built in SwiftUI as a five-person team.",
    tags: ["SwiftUI", "iOS"],
    links: [["GitHub", "https://github.com/hunchongtan/hive"]] },
  { id: "zenpresso", title: "Zenpresso Excelsa", sub: "A 3D and AI take on the Nespresso Pixie", when: "Sep – Dec 2023", role: "Product design",
    text: "A conceptual redesign of the Nespresso Pixie that blends Rhino 3D modelling with generative AI exploration.",
    detail: "We remodelled the Pixie in Rhinoceros 7 and used Stable Diffusion with ControlNet to explore bold forms, iterating quickly from sketches to detailed 3D renders.",
    tags: ["Rhino 3D", "Stable Diffusion", "ControlNet"],
    links: [["Slides", "https://drive.google.com/file/d/1FN9sMkdg6MKLbiz1Ly81GE2ThJcx5KRs/view"], ["Video", "https://youtu.be/wSFtRAlQ3Yg"]] },
  { id: "catture", title: "Catture il Momento", sub: "A light installation for the walk home", when: "Jan – Apr 2023", role: "Design thinking",
    text: "Projected lights that turn the 200 m walk from Changi City Point to the MRT into a small moment worth remembering.",
    detail: "We surveyed the route, built 1:1 physical prototypes and virtual site transformations, and tested the experience with real commuters.",
    tags: ["Design Thinking", "Prototyping"] },
];
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const entry = (t, c, d, body) => `<div class="entry"><h3>${t}</h3><div class="meta">${c} · ${d}</div>${body || ""}</div>`;
const list = items => items && items.length ? `<ul class="ticks">${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>` : "";
const PLACES = {
  about: { eyebrow: "The cabin", title: "About", html: () => `
    <p>I'm Xavier, an Engineering Systems and Design graduate from the Singapore University of Technology and Design (SUTD), with tracks in aviation and in business analytics and operations research, and a minor in AI.</p>
    <p>I like problems where real operations meet hard constraints: how airports, hospitals and businesses keep running when time, people and capacity are tight. I build optimization models, simulations, dashboards and automated pipelines that help people make those calls with confidence. One of them, a Power BI alternative to an SAP enhancement, saved Razer $2M.</p>
    <p>I'm also a vibe coder at heart. This island, a travel-time explorer and an LLM-assisted trading system are some of the things I've built because I was curious.</p>
    <div class="entry"><h3>Toolkit</h3>
      <p class="muted"><b>Programming and data:</b> Python, SQL, R, DAX, Power Query</p>
      <p class="muted"><b>Analysis and ML:</b> statistical analysis, machine learning, forecasting</p>
      <p class="muted"><b>Optimization:</b> Pyomo, Gurobi, LP and MILP modelling, simulation (CAST)</p>
      <p class="muted"><b>BI and automation:</b> Power BI, Power Automate, UiPath, Google Apps Script</p></div>
    <p><button class="chip" data-open="projects">See my projects</button> <a class="chip" href="/koi-valley/Xavier-Wong-Resume.pdf" target="_blank" rel="noopener">My resume (PDF)</a> <button class="chip" data-open="contact">Get in touch</button></p>` },
  experience: { eyebrow: "The pavilion", title: "Experience", html: () => [
      entry("Data Analyst Intern", "Razer (Asia-Pacific)", "Aug 2024 – Jan 2025", list([
        "Proposed a Power BI alternative to a SAP feature enhancement, saving the company $2M",
        "Built automated data pipelines with Power Automate for SFTP uploads, SharePoint distribution and scheduled email reports, improving data transfer efficiency by 25%",
        "Built and maintained 12+ Power BI dashboards across revenue, marketing and product views, including a staggered refresh workaround for near real-time Black Friday monitoring",
        "Kickstarted ML adoption in the e-commerce team with RFM segmentation of high- and low-value customers",
        "Migrated materialised views to dbt tables and documented workflows for the wider team"])),
      entry("Undergraduate Teaching Assistant", "SUTD · 10.013 Modelling and Analysis", "Sep – Dec 2023", list([
        "Guided students through mathematical modelling and problem solving in university calculus",
        "Supported lesson planning, assessments and one-on-one consultations"])),
      entry("Robotic Process Automation Specialist", "Republic of Singapore Navy", "Jan 2021 – Sep 2022 · May – Jul 2023", list([
        "Built UiPath automation bots that removed repetitive admin such as batch data entry and form filling",
        "Developed a Telegram bot that streamlined communication between units and the personnel hub, removing walk-ins and phone calls for routine queries",
        "Drafted business cases for process transformation and coached servicemen in RPA"])),
      entry("Program Director", "SUTD Makerspace", "Sep 2022 – Mar 2023", list([
        "Ran Cardboard Automata and Acrylic Lamp workshops and an air hockey table build",
        "Organised the Fifth Row showcase booth at SUTD Open House 2023"])),
      entry("Research Intern", "Transforma Robotics", "Oct 2019 – Mar 2020", list([
        "Researched LiDAR and SLAM, and integrated SLAM data into a mobile application"])),
    ].join("") },
  education: { eyebrow: "The shrine on the hill", title: "Education", html: () => [
      entry("Bachelor of Engineering (Engineering Systems and Design)", "Singapore University of Technology and Design", "Sep 2022 – May 2026", `
        <p><b>Honours with Distinction</b></p>
        <p class="muted"><b>Specialisation tracks:</b> Aviation; Business Analytics and Operations Research</p>
        <p class="muted"><b>Minors:</b> Artificial Intelligence; Design, Technology and Society</p>
        <p class="muted"><b>Selected modules:</b> Optimization, Advanced Topics in Optimization, Simulation Modelling and Analysis, Airport Systems Modelling and Simulation, Airport Systems Planning and Design, Statistical and Machine Learning, Stochastic Modelling, Game Theory, Algorithms, Artificial Intelligence</p>
        <p class="muted"><b>Capstone:</b> DUBY, nurse rostering with St Andrew's Community Hospital</p>
        <p class="muted"><b>Beyond class:</b> Makerspace Program Director, SUTD Organisation of Autonomous Robotics, Korean Language Enrichment Club, cross-cultural trip to Universitas Gadjah Mada (2024)</p>`),
      entry("Diploma in Mechatronics Engineering with Merit", "Temasek Polytechnic", "Apr 2017 – Apr 2020", `
        <p class="muted"><b>Diploma Plus:</b> Psychology, a minor-style certificate taken alongside the diploma</p>
        <p class="muted"><b>Awards:</b> Bronze Course Medal; Director's List in every academic year</p>`),
      entry("Polytechnic Foundation Programme", "Temasek Polytechnic", "Apr 2016 – Mar 2017", `<p class="muted">Mechatronics and Aerospace Engineering</p>`),
    ].join("") },
  contact: { eyebrow: "The lantern post", title: "Say hello", html: () => `
    <p>Open to roles in aviation, optimization and analytics. I'm always happy to chat about airports, scheduling problems or something fun you're building.</p>
    <div class="copyrow"><code>xavierwongzh@gmail.com</code><button class="chip" id="copyMail">Copy</button></div>
    <p><a href="mailto:xavierwongzh@gmail.com">Email</a> · <a href="https://www.linkedin.com/in/xavierwongzh" target="_blank" rel="noopener">LinkedIn</a> · <a href="https://github.com/xavierwongzh" target="_blank" rel="noopener">GitHub</a> · <a href="/koi-valley/Xavier-Wong-Resume.pdf" target="_blank" rel="noopener">Resume (PDF)</a></p>` },
  projects: { eyebrow: "The koi pond", title: "Projects", html: () => `
    <p class="muted">The koi in the pond are my featured projects. Tap one in the water, or pick any project below to read more.</p>
    <div class="projgrid">${PROJECTS.map(p => `<button class="proj" data-proj="${p.id}"><strong>${esc(p.title)}</strong><span class="psub">${esc(p.sub)}</span><span class="pwhen">${p.when}${p.koi ? " · in the pond" : ""}</span></button>`).join("")}</div>` },
};

// ---------- drawer ----------
const drawer = document.getElementById("drawer");
const dTitle = document.getElementById("dTitle"), dEyebrow = document.getElementById("dEyebrow"), dBody = document.getElementById("dBody");
let lastFocus = null;
function openDrawer(eyebrow, title, html) {
  dEyebrow.textContent = eyebrow; dTitle.textContent = title; dBody.innerHTML = html;
  dBody.scrollTop = 0; drawer.dataset.view = "";
  lastFocus = document.activeElement;
  document.body.classList.add("drawer-open");
  drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false");
  document.getElementById("dClose").focus({ preventScroll: true });
}
function closeDrawer() {
  camFocus.on = false; document.body.classList.remove("focused");
  document.body.classList.remove("drawer-open");
  drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true");
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
}
function focusOn(key) {
  const m = MARKS.find(q => q.key === key);
  const t = m ? [m.i + 0.5, m.j + 0.5, m.h + 0.8] : key === "projects" ? [LAKE.cx, LAKE.cy, WATER_H] : null;
  if (!t) return;
  [camFocus.tx, camFocus.ty, camFocus.th] = t;
  // coming from the overview, start right on the new place; between places, glide across
  if (camFocus.amt < 0.05) [camFocus.x, camFocus.y, camFocus.h] = t;
  camFocus.on = true; document.body.classList.add("focused");
}
function openPlace(key) { const p = PLACES[key]; focusOn(key); openDrawer(p.eyebrow, p.title, p.html()); }
const BANNERS = new Set(["hive", "commonground", "odiocheck", "duby", "runway", "revine", "pillsnap", "pump", "derma", "queue", "inventory", "zenpresso"]);
function openProject(id) {
  const p = PROJECTS.find(x => x.id === id); if (!p) return;
  const k = koi.find(f => f.p === p); if (k) { k.excite = 2.5; }
  focusOn("projects");
  openDrawer(`${p.when} · ${p.role}`, p.title, `
    <p><button class="chip" data-open="projects">← All projects</button></p>
    ${BANNERS.has(p.id) ? `<img class="banner" src="/koi-valley/banners/${p.id}.jpg" alt="${esc(p.title)} banner" width="900" height="270" loading="lazy">` : ""}
    <p class="lede">${esc(p.sub)}</p>
    <p>${esc(p.text)}</p>
    ${p.detail ? `<p class="muted">${esc(p.detail)}</p>` : ""}
    ${p.features ? `<div class="entry"><h3>What it does</h3>${list(p.features)}</div>` : ""}
    ${p.outcomes ? `<div class="entry"><h3>Outcomes</h3>${list(p.outcomes)}</div>` : ""}
    <div class="pills">${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
    ${p.links ? `<p class="links">${p.links.map(([l, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(l)} ↗</a>`).join("")}</p>` : ""}`);
  drawer.dataset.view = "project";
}
// touch gestures: on phones the drawer is a bottom sheet that a downward swipe closes
// (from the header, or from the body once it is scrolled to the top); on a project page
// a swipe to the right goes back to the projects list
const sheetMQ = matchMedia("(max-width: 640px)");
let sw = null;
function swipeReset(el, animate) {
  el.style.transition = animate ? "" : "none";
  el.style.transform = ""; el.style.opacity = "";
  if (!animate) { void el.offsetWidth; el.style.transition = ""; }
}
drawer.addEventListener("touchstart", e => {
  if (e.touches.length !== 1 || !drawer.classList.contains("open")) { sw = null; return; }
  const t = e.touches[0];
  sw = { x: t.clientX, y: t.clientY, t: performance.now(), axis: null, dx: 0, dy: 0,
    fromTop: !!e.target.closest(".drawer header") || dBody.scrollTop <= 0 };
}, { passive: true });
drawer.addEventListener("touchmove", e => {
  if (!sw) return;
  const t = e.touches[0]; sw.dx = t.clientX - sw.x; sw.dy = t.clientY - sw.y;
  if (!sw.axis) {
    if (Math.hypot(sw.dx, sw.dy) < 4) return;
    if (Math.abs(sw.dy) > Math.abs(sw.dx) * 1.2 && sw.dy > 0 && sw.fromTop && sheetMQ.matches) sw.axis = "y";
    else if (Math.abs(sw.dx) > Math.abs(sw.dy) * 1.2 && sw.dx > 0 && drawer.dataset.view === "project") sw.axis = "x";
    else { sw = null; return; }
  }
  e.preventDefault();
  if (sw.axis === "y") { drawer.style.transition = "none"; drawer.style.transform = `translateY(${Math.max(0, sw.dy)}px)`; }
  else { const d = Math.max(0, sw.dx); dBody.style.transition = "none"; dBody.style.transform = `translateX(${d}px)`; dBody.style.opacity = String(1 - Math.min(0.6, d / 400)); }
}, { passive: false });
function swipeEnd() {
  if (!sw || !sw.axis) { sw = null; return; }
  const dt = Math.max(1, performance.now() - sw.t), g = sw; sw = null;
  if (g.axis === "y") {
    if (g.dy > Math.min(120, drawer.offsetHeight * 0.25) || g.dy / dt > 0.5) { swipeReset(drawer, true); closeDrawer(); }
    else swipeReset(drawer, true);
  } else if (g.dx > 90 || g.dx / dt > 0.5) {
    openPlace("projects");
    // the list slides in from the left, as if the project page was pushed off to the right
    dBody.style.transition = "none"; dBody.style.transform = "translateX(-28px)"; dBody.style.opacity = "0";
    void dBody.offsetWidth;
    dBody.style.transition = "transform .28s cubic-bezier(.2,.8,.2,1), opacity .28s ease"; dBody.style.transform = ""; dBody.style.opacity = "";
  } else {
    dBody.style.transition = "transform .25s ease, opacity .25s ease"; dBody.style.transform = ""; dBody.style.opacity = "";
  }
}
drawer.addEventListener("touchend", swipeEnd);
drawer.addEventListener("touchcancel", swipeEnd);
document.getElementById("dClose").addEventListener("click", closeDrawer);
document.addEventListener("keydown", e => { if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer(); });
dBody.addEventListener("click", e => {
  const pr = e.target.closest("[data-proj]"); if (pr) return openProject(pr.dataset.proj);
  const op = e.target.closest("[data-open]"); if (op) return openPlace(op.dataset.open);
  if (e.target.id === "copyMail") {
    const btn = e.target, mail = "xavierwongzh@gmail.com";
    const done = () => { btn.textContent = "Copied"; setTimeout(() => btn.textContent = "Copy", 1600); };
    try { navigator.clipboard.writeText(mail).then(done, () => selectMail()); } catch (_) { selectMail(); }
  }
});
function selectMail() { const c = dBody.querySelector("code"); const r = document.createRange(); r.selectNodeContents(c); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }

// ---------- time of day ----------
// [hour, skyTop, skyBottom, light, tint r,g,b]
const KEYS = [
  [0,    "#070b1f", "#141c3c", 0.40, [0.6, 0.68, 1.0]],
  [5.0,  "#0c1230", "#2a2a55", 0.42, [0.64, 0.66, 1.0]],
  [6.0,  "#2c3a72", "#c07a8a", 0.55, [0.95, 0.78, 0.82]],
  [7.0,  "#5a86c0", "#f6c08a", 0.82, [1.08, 0.9, 0.78]],
  [9.5,  "#6aaee6", "#d5ecf5", 0.98, [1.0, 0.98, 0.94]],
  [13,   "#4fa3ea", "#e9f6fb", 1.08, [1.0, 1.0, 1.0]],
  [16.5, "#6b9fd2", "#f5dcaa", 1.0,  [1.06, 0.96, 0.84]],
  [18.2, "#475a96", "#f39462", 0.80, [1.12, 0.8, 0.66]],
  [19.2, "#262a5a", "#8a4a6a", 0.52, [0.8, 0.68, 0.9]],
  [20.3, "#0e1434", "#272a58", 0.44, [0.62, 0.68, 1.0]],
  [24,   "#070b1f", "#141c3c", 0.40, [0.6, 0.68, 1.0]],
];
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const KEYC = KEYS.map(k => [k[0], hex(k[1]), hex(k[2]), k[3], k[4]]);
const lerp = (a, b, t) => a + (b - a) * t;
const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function sky(h) {
  let i = 0; while (i < KEYC.length - 2 && h >= KEYC[i + 1][0]) i++;
  const a = KEYC[i], b = KEYC[i + 1], t = clamp((h - a[0]) / (b[0] - a[0]), 0, 1);
  const s = t * t * (3 - 2 * t);
  return { top: lerp3(a[1], b[1], s), bot: lerp3(a[2], b[2], s), light: lerp(a[3], b[3], s), tint: lerp3(a[4], b[4], s) };
}
function phaseName(h) {
  if (h < 5) return "Deep night"; if (h < 6.3) return "Before dawn"; if (h < 8) return "Sunrise";
  if (h < 11.5) return "Morning"; if (h < 14.5) return "Midday"; if (h < 17.3) return "Afternoon";
  if (h < 18.9) return "Golden hour"; if (h < 20.2) return "Dusk"; return "Night";
}
const rgb = c => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

let live = true, hourNow = 12, S = sky(12);
const slider = document.getElementById("hour"), liveBtn = document.getElementById("live");
function localHour() { const d = new Date(); return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600; }
function fmt(h) { h = ((h % 24) + 24) % 24; const H = Math.floor(h), M = Math.floor((h - H) * 60); return `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")}`; }
// alpenglow: the peak blushes pink just after sunrise and just after sunset, while the valley is already in shade
let ALPEN = 0;
const alpenglow = h => Math.max(Math.exp(-(((h - 6.5) / 0.55) ** 2)), Math.exp(-(((h - 18.9) / 0.6) ** 2)));
function setHour(h, fromSlider) {
  hourNow = ((h % 24) + 24) % 24; S = sky(hourNow); ALPEN = alpenglow(hourNow);
  if (!fromSlider) slider.value = hourNow.toFixed(2);
  document.getElementById("clockTime").textContent = fmt(hourNow);
  document.getElementById("clockPhase").textContent = phaseName(hourNow);
  const night = S.light < 0.62;
  document.documentElement.dataset.phase = night ? "night" : "day";
  document.documentElement.style.setProperty("--sky-ink", night ? "#f3ead9" : "#1f2a3a");
  document.documentElement.style.setProperty("--sky-ink-soft", night ? "rgba(243,234,217,.75)" : "rgba(31,42,58,.72)");
  document.body.style.background = rgb(S.top);
  dirty = true;
}
let lastScrub = 0;
function scrubTo(h) { live = false; tween = null; lastScrub = performance.now(); liveBtn?.setAttribute("aria-pressed", "false"); setHour(h); markChips(); }
slider.addEventListener("input", () => scrubTo(+slider.value));
// endless scrub: dragging past either end wraps around and keeps going
let scrub = null;
slider.addEventListener("pointerdown", e => {
  e.preventDefault(); slider.focus(); slider.setPointerCapture(e.pointerId);
  const r = slider.getBoundingClientRect();
  scrub = { id: e.pointerId, x: e.clientX, w: r.width, h: clamp((e.clientX - r.left) / r.width, 0, 1) * 24 };
  scrubTo(scrub.h);
});
slider.addEventListener("pointermove", e => { if (scrub && e.pointerId === scrub.id) scrubTo(scrub.h + (e.clientX - scrub.x) / scrub.w * 24); });
const endScrub = e => { if (scrub && e.pointerId === scrub.id) scrub = null; };
slider.addEventListener("pointerup", endScrub); slider.addEventListener("pointercancel", endScrub);
slider.addEventListener("keydown", e => {
  const step = e.shiftKey ? 1 : 0.25;
  if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); scrubTo(hourNow + step); }
  else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); scrubTo(hourNow - step); }
});
liveBtn?.addEventListener("click", () => { live = true; liveBtn?.setAttribute("aria-pressed", "true"); setHour(localHour()); markChips(); });
document.querySelectorAll(".chip[data-h]").forEach(b => b.addEventListener("click", () => {
  live = false; liveBtn?.setAttribute("aria-pressed", "false"); tweenTo(+b.dataset.h); markChips(b);
}));
function markChips(active) { document.querySelectorAll(".chip[data-h]").forEach(b => b.setAttribute("aria-pressed", b === active ? "true" : "false")); }
let tween = null;
function tweenTo(target) {
  let d = target - hourNow; if (d > 12) d -= 24; if (d < -12) d += 24;
  tween = { from: hourNow, d, t0: performance.now(), dur: reduceMotion ? 1 : 1400 };
}
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- terrain: a smooth heightfield sampled on a jittered polar mesh ----------
const N = 18;
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647, (seed - 1) / 2147483646);
const hash = (i, j) => { const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return x - Math.floor(x); };
const mixC = (a, b, t) => lerp3(a, b, clamp(t, 0, 1));
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const LAKE = { cx: 12.0, cy: 12.2, rx: 2.8, ry: 2.4 };
const lakeD = (x, y) => ((x - LAKE.cx) / LAKE.rx) ** 2 + ((y - LAKE.cy) / LAKE.ry) ** 2;
const WATER_H = 1.25;
const ICX = 8.7, ICY = 8.7;
const rimR = a => 8.7 + 0.7 * Math.sin(3 * a + 1) + 0.35 * Math.sin(5 * a + 2);
const PEAKS = [[8.7, 8.5, 9.0, 2.3], [6.5, 7.2, 2.4, 1.3], [10.3, 6.6, 2.0, 1.2], [7.0, 10.6, 1.2, 1.1]];
const RIVER_PATH = [[7.7, 9.5], [7.9, 10.4], [8.4, 11.2], [9.1, 11.8], [10.0, 12.1], [10.6, 12.2]];
const RSEG = RIVER_PATH.slice(1).map((p, k) => { const a = RIVER_PATH[k]; return [a, p, Math.hypot(p[0] - a[0], p[1] - a[1])]; });
const RLEN = RSEG.reduce((s, q) => s + q[2], 0);
function riverInfo(x, y) {
  let best = 1e9, s = 0, acc = 0;
  for (const [a, b, l] of RSEG) {
    const t = clamp(((x - a[0]) * (b[0] - a[0]) + (y - a[1]) * (b[1] - a[1])) / (l * l), 0, 1);
    const d = Math.hypot(x - a[0] - t * (b[0] - a[0]), y - a[1] - t * (b[1] - a[1]));
    if (d < best) { best = d; s = (acc + t * l) / RLEN; }
    acc += l;
  }
  return [best, s];
}
function baseH(x, y) {
  let h = 2 + 0.22 * Math.sin(x * 0.9) * Math.cos(y * 0.7) + 0.15 * Math.sin(x * 1.7 + y * 1.3 + 1);
  // the mountain eases down toward the pond instead of dropping off a cliff
  const ease = lerp(0.22, 1, smooth(1.05, 2.7, Math.sqrt(lakeD(x, y))));
  for (const [px, py, amp, sg] of PEAKS) h += amp * ease * Math.exp(-((x - px) ** 2 + (y - py) ** 2) / (2 * sg * sg));
  const a = Math.atan2(y - ICY, x - ICX), r = Math.hypot(x - ICX, y - ICY) / rimR(a);
  return h - 0.45 * smooth(0.72, 1, r);
}
const RIVER_TOP = baseH(...RIVER_PATH[0]) - 0.35;
function hRaw(x, y) {
  let h = baseH(x, y);
  const [d, s] = riverInfo(x, y);
  if (d < 1) {
    const target = lerp(RIVER_TOP, WATER_H - 0.05, Math.pow(s, 0.85));
    h = lerp(h, Math.min(h, target), smooth(0.95, 0.3, d)) - 0.07 * smooth(0.32, 0, d);
  }
  const ld = Math.sqrt(lakeD(x, y));
  return lerp(h, 0.45, smooth(1.45, 0.82, ld));
}
// landmarks sit on flattened pads
const MARKS = [
  { key: "about", label: "About", i: 15, j: 11, kind: "cabin" },
  { key: "experience", label: "Experience", i: 12, j: 9, kind: "pavilion" },
  { key: "education", label: "Education", i: 11, j: 6, kind: "torii" },
  { key: "contact", label: "Contact", i: 7, j: 14, kind: "lantern" },
];
for (const m of MARKS) m.h = m.flat = Math.max(WATER_H + 0.3, hRaw(m.i + 0.5, m.j + 0.5));
// airstrip on the left of the island: runway 03/21
// map north is "up the screen" in the default view, i.e. world (-1,-1); east is world (1,-1)
const RWY_HDG = 30;
const RUNWAY = (() => {
  const c = [3.9, 11.0], hd = RWY_HDG * Math.PI / 180, N = [-Math.SQRT1_2, -Math.SQRT1_2], E = [Math.SQRT1_2, -Math.SQRT1_2];
  const tan = [Math.sin(hd) * E[0] + Math.cos(hd) * N[0], Math.sin(hd) * E[1] + Math.cos(hd) * N[1]];
  const out = [c[0] - ICX, c[1] - ICY], rad = (tan[1] * out[0] - tan[0] * out[1]) >= 0 ? [tan[1], -tan[0]] : [-tan[1], tan[0]], L = 1.7;
  return { c, rad, tan, a: [c[0] - tan[0] * L, c[1] - tan[1] * L], b: [c[0] + tan[0] * L, c[1] + tan[1] * L] };
})();
RUNWAY.h = Math.max(WATER_H + 0.3, hRaw(...RUNWAY.c));
function runwayD(x, y) {
  const { a, b } = RUNWAY, dx = b[0] - a[0], dy = b[1] - a[1], t = clamp(((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy), 0, 1);
  return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy);
}
// Xavier coding at a little desk on the back of the island
const CAVE = (() => {
  const a = 230 * Math.PI / 180, x = 8.7 + Math.cos(a) * 5.3, y = 8.5 + Math.sin(a) * 5.3;
  return { x, y, out: [Math.cos(a), Math.sin(a)], tan: [-Math.sin(a), Math.cos(a)] };
})();
CAVE.h = hRaw(CAVE.x, CAVE.y);
// zen garden on the right of the island
const ZEN = { x0: 14.3, x1: 16.2, y0: 5.4, y1: 6.9 };
ZEN.cx = (ZEN.x0 + ZEN.x1) / 2; ZEN.cy = (ZEN.y0 + ZEN.y1) / 2; ZEN.h = hRaw(ZEN.cx, ZEN.cy);
const zenD = (x, y) => Math.hypot(Math.max(ZEN.x0 - x, 0, x - ZEN.x1), Math.max(ZEN.y0 - y, 0, y - ZEN.y1));
// paths: wooden steps up to the torii, stepping stones from the cabin to the pavilion
const bez = (a, c, b, t) => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
const STAIR_A = [12.05, 6.8], STAIR_C = [13.0, 7.05], STAIR_B = [14.1, 7.95];
const STONE_A = [15.0, 11.0], STONE_C = [15.0, 9.4], STONE_B = [13.05, 9.75];
const sampleBez = (a, c, b, n) => Array.from({ length: n + 1 }, (_, k) => bez(a, c, b, k / n));
const STAIR_LINE = sampleBez(STAIR_A, STAIR_C, STAIR_B, 40), STONE_LINE = sampleBez(STONE_A, STONE_C, STONE_B, 40);
const lineD = (L, x, y) => { let d = 1e9; for (const q of L) d = Math.min(d, Math.hypot(q[0] - x, q[1] - y)); return d; };
function hf(x, y) {
  let h = hRaw(x, y);
  { const d = Math.hypot(x - CAVE.x, y - CAVE.y); if (d < 2.0) h = lerp(h, CAVE.h, smooth(2.0, 1.45, d)); }
  { const d = zenD(x, y); if (d < 1.1) { h = lerp(h, ZEN.h, smooth(1.1, 0.5, d)); } }
  const rw = runwayD(x, y); if (rw < 1.5) h = lerp(h, RUNWAY.h, smooth(1.5, 0.8, rw));
  for (const m of MARKS) { const d = Math.hypot(x - m.i - 0.5, y - m.j - 0.5); if (d < 1.05) h = lerp(h, m.flat, smooth(1.05, 0.6, d)); }
  return h;
}
function insideIsland(x, y, s = 1) { const a = Math.atan2(y - ICY, x - ICX); return Math.hypot(x - ICX, y - ICY) < rimR(a) * s; }
const groundAt = (x, y) => insideIsland(x, y) ? hf(x, y) : null;

// mesh
// The mesh fans out from the pond centre, so the converging triangles sit under the water.
const NR = 22, NS = 80, MCX = LAKE.cx, MCY = LAKE.cy;
function rimDist(a) { let lo = 0, hi = 20; for (let q = 0; q < 24; q++) { const m = (lo + hi) / 2; insideIsland(MCX + Math.cos(a) * m, MCY + Math.sin(a) * m) ? lo = m : hi = m; } return lo; }
const verts = [], tris = [], under = [];
const vid = (k, s) => k === 0 ? 0 : 1 + (k - 1) * NS + ((s % NS) + NS) % NS;
verts.push({ x: MCX, y: MCY, h: hf(MCX, MCY) });
for (let k = 1; k <= NR; k++) for (let s = 0; s < NS; s++) {
  const a = (s + (k % 2) * 0.5) / NS * Math.PI * 2, R = rimDist(a), r = k / NR;
  const jit = k < NR ? 0.18 : 0;
  const x = MCX + Math.cos(a) * R * r + (hash(k, s) - 0.5) * jit, y = MCY + Math.sin(a) * R * r + (hash(s + 9, k + 3) - 0.5) * jit;
  verts.push({ x, y, h: hf(x, y) });
}
function addTri(list, a, b, c) { list.push({ v: [a, b, c] }); }
for (let s = 0; s < NS; s++) addTri(tris, 0, vid(1, s), vid(1, s + 1));
for (let k = 2; k <= NR; k++) for (let s = 0; s < NS; s++) {
  // rings alternate a half-step offset, so each band zig-zags into triangles
  const A0 = vid(k, s), A1 = vid(k, s + 1), B0 = vid(k - 1, s), B1 = vid(k - 1, s + 1);
  if (k % 2) { addTri(tris, B0, A0, B1); addTri(tris, B1, A0, A1); }
  else { addTri(tris, A0, A1, B0); addTri(tris, B0, A1, B1); }
}
// underside: rim → dirt band → rock rings → tip
const rimIds = Array.from({ length: NS }, (_, s) => vid(NR, s));
const UR = [[0.995, -0.65, 0], [0.93, null, 0.6], [0.8, null, 2.4], [0.63, null, 4.8], [0.45, null, 7.6], [0.28, null, 10.4], [0.14, null, 12.8]];
let ringPrev = rimIds;
for (const [sc, dh, depth] of UR) {
  const ids = rimIds.map((id, s) => {
    const j = dh !== null ? 1 : 1 + (hash(s * 1.7, depth * 3) - 0.5) * 0.14, v = verts[id], x = ICX + (v.x - ICX) * sc * j, y = ICY + (v.y - ICY) * sc * j;
    const h = dh !== null ? v.h + dh : -0.5 - depth - hash(s, depth * 7) * (1.1 + depth * 0.1);
    verts.push({ x, y, h, under: true }); return verts.length - 1;
  });
  for (let s = 0; s < NS; s++) { const s1 = (s + 1) % NS; addTri(under, ids[s], ids[s1], ringPrev[s1]); addTri(under, ids[s], ringPrev[s1], ringPrev[s]); }
  ringPrev = ids;
}
verts.push({ x: ICX + 0.3, y: ICY - 0.2, h: -15.5, under: true }); const tipId = verts.length - 1;
for (let s = 0; s < NS; s++) addTri(under, tipId, ringPrev[(s + 1) % NS], ringPrev[s]);

// static per-triangle data: normal, centroid, base colour, role
// seasons follow the viewer's date (southern-hemisphere time zones are flipped); ?season= overrides
function seasonFromDate(d = new Date()) {
  let m = d.getMonth();
  try { if (/^(Australia|Pacific\/Auckland|America\/(Argentina|Santiago|Sao_Paulo|Montevideo)|Africa\/Johannesburg)/.test(Intl.DateTimeFormat().resolvedOptions().timeZone)) m = (m + 6) % 12; } catch (_) {}
  return ["winter", "winter", "spring", "spring", "spring", "summer", "summer", "summer", "autumn", "autumn", "autumn", "winter"][m];
}
let SEASON = (() => { try { const q = new URLSearchParams(location.search).get("season"); if (["spring", "summer", "autumn", "winter"].includes(q)) return q; } catch (_) {} return seasonFromDate(); })();
const GROUND = {
  spring: { meadow: [[150, 184, 92], [128, 170, 84], [196, 200, 112], [140, 168, 98]], high: [[128, 150, 90], [140, 132, 116]], shore: [178, 166, 112], snow: 0.4 },
  summer: { meadow: [[110, 158, 72], [94, 144, 66], [138, 170, 82], [118, 150, 76]], high: [[106, 136, 78], [134, 128, 112]], shore: [182, 166, 110], snow: 0.9 },
  autumn: { meadow: [[198, 164, 76], [176, 150, 70], [186, 120, 62], [160, 146, 84]], high: [[150, 128, 80], [140, 128, 112]], shore: [168, 152, 98], snow: 0 },
  winter: { meadow: [[236, 240, 244], [224, 230, 238], [214, 222, 230], [230, 234, 240]], high: [[230, 234, 240], [212, 218, 228]], shore: [206, 214, 220], snow: -3.5 },
};
function triPrep(t, isUnder) {
  const [a, b, c] = t.v.map(i => verts[i]);
  const e1 = [b.x - a.x, b.y - a.y, (b.h - a.h) * 0.588], e2 = [c.x - a.x, c.y - a.y, (c.h - a.h) * 0.588];
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]], nl = Math.hypot(...n) || 1;
  t.n = n.map(q => q / nl);
  t.cx = (a.x + b.x + c.x) / 3; t.cy = (a.y + b.y + c.y) / 3; t.ch = (a.h + b.h + c.h) / 3;
  const lo = Math.min(a.h, b.h, c.h), hi = Math.max(a.h, b.h, c.h);
  const jitter = 1 + (hash(t.cx * 3.1, t.cy * 2.7) - 0.5) * 0.08;
  if (isUnder) {
    t.role = "under";
    { const f = clamp((-t.ch - 0.6) / 13, 0, 1); t.col = (t.ch > -0.9 ? [126, 88, 56] : mixC(mixC([118, 84, 58], [98, 74, 62], Math.min(1, f * 2)), [74, 62, 66], Math.max(0, f * 2 - 1))).map(v => v * jitter); }
    return;
  }
  const ld = lakeD(t.cx, t.cy), [rd] = riverInfo(t.cx, t.cy);
  if (ld < 2.2 && hi <= WATER_H + 0.01) { t.role = "bed"; t.col = mixC([96, 112, 92], [60, 84, 92], smooth(1.0, 0.2, Math.sqrt(ld))); return; }
  t.role = ld < 2.2 && lo < WATER_H ? "shore" : "land";
  const nz = t.n[2];
  if (rd < 0.4 && ld > 0.8) { t.col = (SEASON === "winter" ? mixC([196, 204, 214], [222, 228, 236], hash(t.cx * 5, t.cy * 5)) : mixC([112, 100, 86], [148, 138, 120], hash(t.cx * 5, t.cy * 5))).map(v => v * jitter); return; }
  let col;
  const G = GROUND[SEASON], MEADOW = G.meadow;
  const meadow = Math.sin(t.cx * 0.55 + 1.3) * Math.cos(t.cy * 0.62 - 0.4) + 0.35 * Math.sin(t.cx * 1.7 + t.cy * 1.2);
  // snowline sits lower on the front face (toward the pond) so the peak reads white from the default view
  const front = clamp(((t.cx - 8.7) + (t.cy - 8.5)) / 3, 0, 1);
  if (t.ch > 6.4 + G.snow - front * 1.3 + hash(t.cx, t.cy) * 0.7 && nz > (SEASON === "winter" ? (t.ch > 3.5 ? 0.22 : 0.5) : 0.3 - front * 0.12) && rd > 0.45) col = mixC([240, 242, 246], [226, 232, 240], hash(t.cx * 3, t.cy * 2));
  else if (nz < 0.66 || t.ch > 6.2) col = mixC([150, 132, 112], [128, 122, 120], smooth(4, 7, t.ch));
  else if (ld < 1.45) col = G.shore;
  else if (t.ch > 4.2) col = mixC(G.high[0], G.high[1], smooth(4.2, 6.2, t.ch));
  else col = meadow > 0.55 ? MEADOW[2] : meadow > -0.2 ? mixC(MEADOW[0], MEADOW[1], (meadow + 0.2) / 0.75) : MEADOW[3];
  t.col = col.map(v => v * jitter);
  // how much of the dawn and dusk alpenglow this face catches: the upper peak, snow most of all
  t.peak = smooth(6.0, 9.5, t.ch) * (col[0] > 220 ? 1 : 0.5);
}
for (const t of tris) triPrep(t, false);
for (const t of under) triPrep(t, true);
// shoreline: where the ground climbs out of the water, sampled on rays from the pond centre
const SHORE = Array.from({ length: 120 }, (_, k) => {
  const a = k / 120 * Math.PI * 2, dx = Math.cos(a) * LAKE.rx, dy = Math.sin(a) * LAKE.ry;
  let lo = 0.2, hi = 1.8;
  for (let q = 0; q < 22; q++) { const m = (lo + hi) / 2; hf(LAKE.cx + dx * m, LAKE.cy + dy * m) < WATER_H ? lo = m : hi = m; }
  return [LAKE.cx + dx * lo, LAKE.cy + dy * lo];
});

// trees: clustered forests of mixed species on gentle ground
const TREE_COL = {
  maple: [[214, 84, 32], [232, 140, 44], [186, 54, 30], [240, 182, 58], [204, 112, 40], [168, 44, 36]],
  ginkgo: [[236, 190, 64], [246, 208, 96], [224, 170, 50]],
  birch: [[214, 192, 82], [232, 208, 106], [196, 176, 70], [222, 150, 60]],
  bush: [[166, 58, 40], [196, 92, 46], [142, 98, 54], [184, 72, 52]],
  pine: [[50, 88, 64], [42, 76, 58], [64, 100, 72]],
  larch: [[206, 150, 52], [194, 130, 46]],
};
const pickC = list => list[(rnd() * list.length) | 0].map(v => v * (0.94 + rnd() * 0.12));
function pickKind(h) {
  if (h >= 4.6) return "larch";
  let r = rnd();
  for (const [k, w] of [["maple", 0.46], ["ginkgo", 0.18], ["birch", 0.16], ["bush", 0.2]]) if ((r -= w) < 0) return k;
  return "maple";
}
function makeBlobs(t) {
  const B = [];
  if (t.kind === "maple") { const n = 3 + ((rnd() * 4) | 0), base = (rnd() * 6) | 0; for (let q = 0; q < n; q++) B.push([(rnd() - 0.5) * 0.4, 0.42 + rnd() * 0.36, 0.14 + rnd() * 0.11, TREE_COL.maple[(base + (rnd() < 0.3 ? 1 : 0)) % 6].map(v => v * (0.94 + rnd() * 0.12))]); }
  else if (t.kind === "ginkgo") { B.push([0, 0.5, 0.17, pickC(TREE_COL.ginkgo), 1.5], [0.02, 0.8, 0.13, pickC(TREE_COL.ginkgo), 1.6], [0, 1.02, 0.08, pickC(TREE_COL.ginkgo), 1.5]); }
  else if (t.kind === "birch") { for (let q = 0; q < 5; q++) B.push([(rnd() - 0.5) * 0.32, 0.62 + rnd() * 0.36, 0.08 + rnd() * 0.05, pickC(TREE_COL.birch)]); }
  else if (t.kind === "bush") { const n = 2 + ((rnd() * 2) | 0); for (let q = 0; q < n; q++) B.push([(rnd() - 0.5) * 0.34, 0.1 + rnd() * 0.1, 0.13 + rnd() * 0.06, pickC(TREE_COL.bush), 0.85]); }
  else if (t.kind === "bare") { for (let q = 0; q < 4; q++) B.push([(rnd() - 0.5) * 0.36, 0.5 + rnd() * 0.2, 0.03, pickC(TREE_COL.maple)]); }
  return B;
}
const trees = [];
for (let n = 0; n < 3000 && trees.length < 84; n++) {
  const x = rnd() * N, y = rnd() * N;
  if (!insideIsland(x, y, 0.93)) continue;
  const h = hf(x, y);
  if (lakeD(x, y) < 1.7 || riverInfo(x, y)[0] < 0.75 || runwayD(x, y) < 1.25 || h > 7.6) continue;
  if (MARKS.some(m => Math.hypot(m.i + 0.5 - x, m.j + 0.5 - y) < 1.35) || Math.hypot(x - CAVE.x, y - CAVE.y) < 2.3 || zenD(x, y) < 0.7 || lineD(STONE_LINE, x, y) < 0.55) continue;
  const gx = hf(x + 0.1, y) - h, gy = hf(x, y + 0.1) - h;
  if (Math.hypot(gx, gy) * 10 > 1.9) continue;
  const forest = Math.sin(x * 0.7 + 1.3) * Math.cos(y * 0.6 - 0.4) + 0.4 * Math.sin(x * 1.9 + y * 1.1);
  if (forest < 0 && rnd() < 0.9) continue;
  if (trees.some(t => Math.hypot(t.i - x, t.j - y) < 0.62)) continue;
  const kind = pickKind(h);
  const t = { i: x, j: y, h, kind, s: (kind === "bush" ? 0.8 : 0.72) + rnd() * 0.55, lean: (rnd() - 0.5) * 0.1, layers: 3 + (rnd() < 0.4 ? 1 : 0) };
  t.pcol = pickC(kind === "larch" ? TREE_COL.larch : TREE_COL.pine);
  t.blobs = makeBlobs(t);
  t.pcol0 = t.pcol; for (const b of t.blobs) b[5] = b[3];
  t.crown = (t.blobs.length ? t.blobs.reduce((a, b) => a + b[1], 0) / t.blobs.length : 0.5) * t.s * 2.78;
  trees.push(t);
}

// per-season foliage; autumn keeps the colours each tree was born with
const SEASON_TREES = {
  spring: { maple: [[248, 196, 210], [242, 174, 196], [252, 220, 230], [236, 160, 184], [158, 200, 104]], ginkgo: [[176, 210, 100], [196, 222, 120]], birch: [[160, 206, 108], [186, 220, 126]], bush: [[226, 104, 146], [240, 150, 180], [134, 182, 92]], larch: [150, 192, 98], pine: null },
  summer: { maple: [[72, 142, 72], [92, 162, 78], [60, 124, 66], [104, 170, 84]], ginkgo: [[112, 172, 72], [128, 182, 80]], birch: [[124, 184, 84], [104, 168, 76]], bush: [[72, 132, 66], [88, 148, 72], [120, 150, 220]], larch: [74, 132, 74], pine: null },
  winter: { maple: [[238, 242, 246], [226, 232, 240], [244, 246, 250]], ginkgo: [[236, 240, 246], [226, 232, 240]], birch: [[236, 240, 246], [222, 228, 236]], bush: [[236, 240, 246], [222, 230, 238]], larch: [74, 100, 88], pine: [62, 92, 78] },
};
function applyTreeSeason() {
  const P2 = SEASON_TREES[SEASON];
  for (const t of trees) {
    t.pcol = P2 && P2[t.kind] && !Array.isArray(P2[t.kind][0]) ? P2[t.kind].map(v => v * (0.94 + hash(t.i, t.j) * 0.12)) : t.pcol0;
    t.blobs.forEach((b, q) => {
      const list = P2 && P2[t.kind];
      if (!list || !Array.isArray(list[0])) { b[3] = b[5]; return; }
      const base = (hash(t.i * 3.1, t.j * 1.7) * list.length) | 0, sd = hash(t.i * 7.3 + q, t.j * 3.1 - q);
      b[3] = list[(base + (sd < 0.3 ? 1 : 0)) % list.length].map(v => v * (0.94 + sd * 0.12));
    });
  }
}
applyTreeSeason();

// the stream as a smooth ribbon laid into the carved channel
const RIBBON = (() => {
  const out = [];
  for (const [a, b, l] of RSEG) { const n = Math.max(2, Math.ceil(l / 0.12)); for (let q = 0; q < n; q++) { const t = q / n; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); } }
  out.push(RIVER_PATH[RIVER_PATH.length - 1]);
  for (let it = 0; it < 4; it++) for (let k = 1; k < out.length - 1; k++) out[k] = [(out[k - 1][0] + out[k][0] * 2 + out[k + 1][0]) / 4, (out[k - 1][1] + out[k][1] * 2 + out[k + 1][1]) / 4];
  const pts = [];
  for (let k = 0; k < out.length; k++) {
    const [x, y] = out[k], p = out[Math.max(0, k - 1)], q = out[Math.min(out.length - 1, k + 1)], tx = q[0] - p[0], ty = q[1] - p[1], tl = Math.hypot(tx, ty) || 1;
    const h = hf(x, y), last = h < WATER_H + 0.02;
    pts.push({ x, y, h: last ? WATER_H + 0.02 : h + 0.05, nx: -ty / tl, ny: tx / tl, w: 0.05 + 0.15 * Math.pow(k / out.length, 0.8) });
    if (last) break;
  }
  return pts;
})();

// ---------- camera ----------
// World: x = i, y = j, height h. The camera orbits the island centre; isometric is yaw 45°, pitch 30°, no perspective.
const cv = document.getElementById("world"), mainCtx = cv.getContext("2d");
let ctx = mainCtx; // swapped to an offscreen canvas while a tree is cached
const ZU = 0.588, CX = 8.7, CY = 8.7, CZ = 2, DP = 30;
const VIEWS = {
  iso: { pitch: Math.PI / 6, persp: 0, zoom: 1 },
  persp: { pitch: 0.38, persp: 1, zoom: 1.08 },
  top: { pitch: Math.PI / 2 - 0.0005, persp: 0, zoom: 0.92 },
};
let view = "iso";
const cam = { yaw: Math.PI / 4, pitch: Math.PI / 6, persp: 0, zoom: 1, yawV: 0 };
let GLOW_A = 1, GLOW_K = 1;
let W = 0, H = 0, DPR = 1, TW = 40, BASE_S = 28, SC = 28, OX = 0, OY = 0, BASE_OX = 0, BASE_OY = 0;
// opening a place eases the camera in on it, framed beside the drawer; closing eases back out
const camFocus = { on: false, amt: 0, x: 0, y: 0, h: 0, tx: 0, ty: 0, th: 0 };
let cosY = 1, sinY = 0, cosP = 1, sinP = 0, V = [0, 0, 1], CAMPOS = [0, 0, 0];
function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = innerWidth; H = innerHeight;
  cv.width = W * DPR; cv.height = H * DPR; cv.style.width = W + "px"; cv.style.height = H + "px";
  const narrow = W < 640;
  TW = Math.min(W / (N * (narrow ? 0.76 : 1.0)), (H * (narrow ? 0.66 : 1.06)) / (N * 0.5 + 8.5));
  TW = Math.max(16, Math.min(TW, 84));
  BASE_S = TW / Math.SQRT2;
  // fixed-size night lights read far bigger on a small island, so phones get smaller, softer ones
  GLOW_K = clamp(TW / 54, 0.45, 1); GLOW_A = narrow ? 0.55 : 1;
  OX = BASE_OX = W / 2 + TW * 0.2;
  OY = BASE_OY = narrow ? H * 0.4 + TW * 0.38 : H * 0.53;
}
function camUpdate() {
  cosY = Math.cos(cam.yaw); sinY = Math.sin(cam.yaw); cosP = Math.cos(cam.pitch); sinP = Math.sin(cam.pitch);
  SC = BASE_S * cam.zoom;
  V = [sinY * cosP, cosY * cosP, sinP];
  CAMPOS = [CX + V[0] * DP, CY + V[1] * DP, CZ * ZU + V[2] * DP];
}
function P(x, y, h) {
  const dx = x - CX, dy = y - CY, z = (h - CZ) * ZU;
  const rx = dx * cosY - dy * sinY, ry = dx * sinY + dy * cosY;
  const d = ry * cosP + z * sinP, v = z * cosP - ry * sinP;
  const f = 1 + cam.persp * (DP / Math.max(4, DP - d) - 1);
  return [OX + rx * SC * f, OY - v * SC * f, f];
}
const depth = (x, y) => (x - CX) * sinY + (y - CY) * cosY;
function unproject(X, Y, h) {
  const z = (h - CZ) * ZU, a = -(Y - OY) / SC;
  let f = 1, ry = 0;
  for (let k = 0; k < 10; k++) {
    const v = a / f; ry = sinP > 1e-3 ? (z * cosP - v) / sinP : 0;
    const d = ry * cosP + z * sinP; f = 1 + cam.persp * (DP / Math.max(4, DP - d) - 1);
  }
  const rx = (X - OX) / (SC * f);
  return [rx * cosY + ry * sinY + CX, -rx * sinY + ry * cosY + CY];
}

// ---------- lighting ----------
let SUN = [0.5, 0.5, 0.7];
function sunUpdate() {
  const prog = clamp((hourNow - 6) / 13, 0, 1), az = Math.PI * prog;
  const day = hourNow > 5.5 && hourNow < 19.5;
  let v = day ? [Math.cos(az) * 0.9, 0.6, 0.3 + 0.7 * Math.sin(prog * Math.PI)] : [-0.5, 0.7, 0.6];
  const L = Math.hypot(...v); SUN = v.map(q => q / L);
}
function lit(c, f = 1) {
  const L = S.light * f;
  return [clamp(c[0] * L * S.tint[0] + S.bot[0] * 0.05, 0, 255), clamp(c[1] * L * S.tint[1] + S.bot[1] * 0.05, 0, 255), clamp(c[2] * L * S.tint[2] + S.bot[2] * 0.06, 0, 255)];
}
const mix = (a, b, t) => lerp3(a, b, clamp(t, 0, 1));
const C = {
  grass: [196, 162, 74], grass2: [168, 146, 70], slope: [140, 120, 76], rock: [140, 132, 128], snow: [240, 242, 246],
  dirt: [128, 88, 54], cliff: [124, 108, 100], dirtDark: [100, 68, 44], stone: [86, 76, 86],
  water: [54, 118, 146], foam: [226, 240, 246],
  bark: [78, 52, 38], pine: [50, 88, 64], larch: [206, 150, 52],
  maples: [[214, 84, 32], [232, 140, 44], [186, 54, 30], [240, 182, 58], [204, 112, 40]],
  wood: [120, 74, 46], roof: [70, 56, 62], roofRed: [176, 50, 36], plaster: [236, 226, 206], torii: [204, 54, 36],
};
function topColor(c) {
  if (c.type !== "land") return mix(C.water, S.bot, 0.28);
  const h = c.h, v = (c.v - 0.5) * 0.12;
  let base;
  if (h >= 9) base = C.snow; else if (h >= 7) base = mix(C.rock, C.snow, (h - 7) / 2 * 0.6);
  else if (h >= 4.5) base = mix(C.slope, C.rock, (h - 4.5) / 2.5);
  else if (h >= 3) base = mix(C.grass2, C.slope, (h - 3) / 1.5);
  else base = mix(C.grass, C.grass2, c.v);
  return base.map(x => x * (1 + v));
}
function poly(pts, fill) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
// A planar face given counter-clockwise from outside; culled when facing away, shaded by the sun.
function face(pts, col, boost = 1) {
  const a = pts[0], b = pts[1], c = pts[2];
  const e1 = [b[0] - a[0], b[1] - a[1], (b[2] - a[2]) * ZU], e2 = [c[0] - a[0], c[1] - a[1], (c[2] - a[2]) * ZU];
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
  const nl = Math.hypot(n[0], n[1], n[2]) || 1;
  let t = V;
  if (cam.persp > 0.02) { const q = [CAMPOS[0] - a[0], CAMPOS[1] - a[1], CAMPOS[2] - a[2] * ZU]; const ql = Math.hypot(...q); t = lerp3(V, q.map(x => x / ql), cam.persp); }
  if ((n[0] * t[0] + n[1] * t[1] + n[2] * t[2]) / nl <= 0.002) return;
  const sh = 0.6 + 0.46 * Math.max(0, (n[0] * SUN[0] + n[1] * SUN[1] + n[2] * SUN[2]) / nl);
  poly(pts.map(p => P(p[0], p[1], p[2])), rgb(lit(col, sh * boost)));
}
function box(x0, y0, x1, y1, z0, z1, col, boost) {
  face([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], col, boost);
  face([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], col, boost);
  face([[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]], col, boost);
  face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], col, boost);
  face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], col, boost);
}
// ---------- mesh drawing ----------
function projectVerts() { for (const v of verts) { const p = P(v.x, v.y, v.h); v.sx = p[0]; v.sy = p[1]; } }
const depthKey = (x, y, h) => ((x - CX) * sinY + (y - CY) * cosY) * cosP + (h - CZ) * ZU * sinP;
function drawTri(t) {
  const a = verts[t.v[0]], b = verts[t.v[1]], c = verts[t.v[2]];
  if ((b.sx - a.sx) * (c.sy - a.sy) - (b.sy - a.sy) * (c.sx - a.sx) <= 0) return;
  let sh = 0.58 + 0.5 * Math.max(0, t.n[0] * SUN[0] + t.n[1] * SUN[1] + t.n[2] * SUN[2]);
  let col = t.water ? mix(t.col, S.bot, 0.12) : t.col;
  if (ALPEN > 0.01 && t.peak) {
    if (SEASON === "winter") {
      // on an all-white island the blush reads best as warm sunlit faces against cool blue shade
      const lit1 = Math.max(0, t.n[0] * SUN[0] + t.n[1] * SUN[1] + t.n[2] * SUN[2]), g = ALPEN * t.peak;
      const w = 0.45 + 0.55 * lit1;
      col = mix(mix(col, [176, 186, 228], g * 0.22 * (1 - lit1)), [255, 160, 152], g * 0.55 * w); sh *= 1 + g * 0.38 * w;
    } else { const g = ALPEN * t.peak; col = mix(col, [255, 170, 156], g * 0.42); sh *= 1 + g * 0.3; }
  }
  const fill = rgb(lit(col, t.water ? Math.max(sh, 0.92) : sh));
  ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.lineTo(c.sx, c.sy); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = fill; ctx.lineWidth = 0.8; ctx.stroke();
}
function drawLakeSurface() {
  const pts = SHORE.map(([x, y]) => P(x, y, WATER_H));
  const c = P(LAKE.cx, LAKE.cy, WATER_H);
  const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], Math.max(TW * 3, 40) * cam.zoom);
  const ice = SEASON === "winter";
  const deep = lit(mix(ice ? [170, 202, 220] : [40, 98, 126], S.top, 0.2)), shallow = lit(mix(ice ? [206, 226, 236] : [78, 140, 156], S.bot, 0.25));
  g.addColorStop(0, rgba(deep, ice ? 0.8 : 0.86)); g.addColorStop(1, rgba(shallow, ice ? 0.9 : 0.78));
  ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = rgba(lit([236, 244, 246]), 0.35); ctx.lineWidth = 1.2; ctx.stroke();
}
function groundShadow(x, y, h, r) {
  ctx.beginPath();
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2, p = P(x + Math.cos(a) * r, y + Math.sin(a) * r, h); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
  ctx.closePath(); ctx.fillStyle = rgba([0, 0, 0], 0.15 * S.light); ctx.fill();
}
// a closed low-poly solid from triangles; each one is turned to face outward from c, then culled and sun-shaded by face()
function solid(tris, c, col, boost) {
  for (const tri of tris) {
    const [a, b, d] = tri, e1 = [b[0] - a[0], b[1] - a[1], (b[2] - a[2]) * ZU], e2 = [d[0] - a[0], d[1] - a[1], (d[2] - a[2]) * ZU];
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const m = [(a[0] + b[0] + d[0]) / 3 - c[0], (a[1] + b[1] + d[1]) / 3 - c[1], ((a[2] + b[2] + d[2]) / 3 - c[2]) * ZU];
    face(n[0] * m[0] + n[1] * m[1] + n[2] * m[2] >= 0 ? tri : [a, d, b], col, boost);
  }
}
// leaves for each crown blob, made once per tree: mostly near the surface of the blob's cloud, a few inside;
// fewer and a little bigger on phones to keep drawing cheap
function makeLeaves(t) {
  const out = [], few = W < 640;
  t.blobs.forEach(([, , br], q) => {
    const n = Math.round(clamp((br / 0.17) ** 2 * (few ? 20 : 34), 8, few ? 36 : 60));
    for (let m = 0; m < n; m++) {
      const h1 = hash(t.i * 7.7 + q * 3.1 + m, t.j * 1.3 - m), h2 = hash(t.j * 4.9 + m * 1.7, t.i - q + m * 0.3), h3 = hash(m * 2.1 + q, t.i * 0.7 + t.j);
      const zz = h1 * 2 - 1, a = h2 * 6.28, rr = Math.sqrt(1 - zz * zz), d = 0.5 + 0.5 * Math.sqrt(h3);
      out.push({ q, dx: Math.cos(a) * rr * d, dy: Math.sin(a) * rr * d, dz: zz * d, out: d, rot: hash(m, q + t.i) * 6.28, s: (few ? 0.36 : 0.3) * (0.75 + 0.5 * hash(q + m, t.j)), j: (hash(m * 3.3, q * 7.1 + t.j) - 0.5) * 0.14 });
    }
  });
  return out;
}
// Leafy crowns are many small shapes, so while the view holds still each tree is drawn once into its own
// small canvas and stamped from there; while the island turns, zooms or the light changes they draw live.
let TREE_KEY = "", treeStable = false;
function treeCacheKey() {
  const key = [cam.yaw, cam.pitch, cam.zoom, cam.persp].map(v => Math.round(v * 400)).join() + "," + Math.round(hourNow * 30) + SEASON + W + "x" + H + DPR;
  treeStable = key === TREE_KEY; TREE_KEY = key;
}
function drawTreeCached(t) {
  if (!treeStable) { t.spr && (t.spr.key = ""); return drawTree(t); }
  const [bx, by, f] = P(t.i, t.j, t.h), sz = Math.max(4, t.s * TW * cam.zoom * f), w = Math.ceil(sz * 2.4), h = Math.ceil(sz * 3.6), ox = w / 2, oy = h * 0.86;
  let sp = t.spr;
  if (!sp || sp.key !== TREE_KEY) {
    sp = t.spr || (t.spr = { c: document.createElement("canvas") });
    sp.c.width = Math.ceil(w * DPR); sp.c.height = Math.ceil(h * DPR); sp.w = w; sp.h = h; sp.ox = ox; sp.oy = oy; sp.key = TREE_KEY;
    const g = sp.c.getContext("2d"); g.setTransform(DPR, 0, 0, DPR, (ox - bx) * DPR, (oy - by) * DPR);
    ctx = g; try { drawTree(t); } finally { ctx = mainCtx; }
  }
  ctx.drawImage(sp.c, bx - sp.ox, by - sp.oy, sp.w, sp.h);
}
function drawTree(t) {
  const k = t.s * 2.78, R0 = t.s * Math.SQRT2, base = [t.i, t.j, t.h];
  groundShadow(t.i + 0.05, t.j + 0.05, t.h, (t.kind === "ginkgo" ? 0.17 : t.kind === "bush" ? 0.2 : 0.24) * t.s);
  const lx = t.lean * t.s * 1.4, ly = t.lean * t.s * 0.6;
  // trunk: a tapered four-sided post, so it has a lit side and a shaded side from any angle
  const trunk = (z, col, w) => {
    const r0 = w * R0 * 0.36, r1 = r0 * 0.55, zt = t.h + z * k, tx = t.i + lx, ty = t.j + ly, tris = [];
    const B = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [t.i + a * r0, t.j + b * r0, t.h - 0.02]);
    const T = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [tx + a * r1, ty + b * r1, zt]);
    for (let q = 0; q < 4; q++) { const q1 = (q + 1) % 4; tris.push([B[q], B[q1], T[q1]], [B[q], T[q1], T[q]]); }
    solid(tris, [(t.i + tx) / 2, (t.j + ty) / 2, (t.h + zt) / 2], col, 1);
    return [tx, ty, zt];
  };
  // the crown: a cloud of small leaves around each blob, with branches from the top of the trunk to each cloud.
  // Leaves behind the trunk draw first, then the wood, then the leaves in front, so the branches peek through.
  const blobs = (wood) => {
    const bs = SEASON === "winter" ? 0.82 : 1, sc = SC, kD = cosP;
    if (!t.leaves) t.leaves = makeLeaves(t);
    const cl = t.blobs.map(([bx, bz, br, col, ry], q) => {
      const a = hash(t.i * 5.1 + q, t.j * 2.3 - q) * 6.28, off = Math.abs(bx) * R0, R = br * R0 * bs * 1.05;
      return { x: t.i + Math.cos(a) * off + lx * bz * 2, y: t.j + Math.sin(a) * off + ly * bz * 2, z: t.h + bz * k, R, Hh: R * (ry || 1) / ZU * 0.8, col, shades: [] };
    });
    const pts = [];
    for (const L of t.leaves) {
      const c = cl[L.q], x = c.x + L.dx * c.R, y = c.y + L.dy * c.R, z = c.z + L.dz * c.Hh;
      pts.push([depthKey(x, y, z), x, y, z, L, c]);
    }
    pts.sort((A, B) => A[0] - B[0]);
    const mid = depthKey(t.i, t.j, t.h + k * 0.5);
    const leaf = ([, x, y, z, L, c]) => {
      const [px, py, f] = P(x, y, z), r = L.s * c.R * sc * f;
      // lit by the sun on the outside of the cloud, darker toward its core and underside
      const sh = clamp(0.62 + 0.42 * Math.max(0, L.dx * SUN[0] + L.dy * SUN[1] + L.dz * SUN[2]) * L.out + 0.16 * L.dz + L.j, 0.45, 1.2);
      const lv = Math.round(sh * 12);
      const fill = c.shades[lv] || (c.shades[lv] = rgb(lit(c.col, lv / 12)));
      const ca = Math.cos(L.rot) * r, sa = Math.sin(L.rot) * r * kD;
      ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(px - ca, py - sa);
      ctx.quadraticCurveTo(px - sa * 1.1, py + ca * 1.1, px + ca, py + sa); ctx.quadraticCurveTo(px + sa * 1.1, py - ca * 1.1, px - ca, py - sa); ctx.fill();
    };
    let q = 0;
    for (; q < pts.length && pts[q][0] < mid; q++) leaf(pts[q]);
    const top = wood && wood();
    if (top) {
      ctx.strokeStyle = rgb(lit(C.bark, 0.8)); ctx.lineCap = "round";
      const T = P(...top);
      for (const c of cl) {
        const E = P(c.x, c.y, c.z - c.Hh * 0.25), w = Math.max(1, t.s * TW * cam.zoom * 0.028);
        ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(T[0], T[1]); ctx.lineTo(E[0], E[1]); ctx.stroke();
      }
    }
    for (; q < pts.length; q++) leaf(pts[q]);
  };
  const crown = (z, col, w) => blobs(() => trunk(z, col, w));
  if (t.kind === "maple") crown(0.36, C.bark, 0.07);
  else if (t.kind === "ginkgo") crown(0.42, C.bark, 0.055);
  else if (t.kind === "birch") {
    blobs(() => {
      const [tx, ty, zt] = trunk(0.72, [230, 226, 216], 0.05);
      // dark bark marks on the front of the trunk
      const fx = Math.sin(cam.yaw), fy = Math.cos(cam.yaw), r = 0.05 * R0 * 0.5;
      ctx.strokeStyle = rgb(lit([60, 52, 50])); ctx.lineWidth = Math.max(1, t.s * TW * cam.zoom * 0.02);
      for (const q of [0.25, 0.45, 0.65]) {
        const px = t.i + (tx - t.i) * q + fx * r, py = t.j + (ty - t.j) * q + fy * r, pz = t.h + (zt - t.h) * q;
        const A = P(px - fy * r * 0.8, py + fx * r * 0.8, pz), B = P(px + fy * r * 0.6, py - fx * r * 0.6, pz);
        ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
      }
      return [tx, ty, zt];
    });
  } else if (t.kind === "bush") blobs(null);
  else if (t.kind === "bare") crown(0.55, [92, 66, 50], 0.05);
  else {
    // pine and larch: stacked low-poly cones, each tier a little narrower, snow-capped in winter
    const col = t.pcol, L = t.layers, n = 7, a0 = hash(t.i, t.j) * 6.28;
    trunk(0.2, C.bark, 0.05);
    for (let q = 0; q < L; q++) {
      const z0 = t.h + (0.12 + q * 0.6 / L) * k, z1 = z0 + (0.36 * 3 / L + 0.04) * k, w = (0.27 - q * (0.18 / L)) * R0;
      const lc = SEASON === "winter" ? mix(col, [236, 240, 246], q === L - 1 ? 0.8 : 0.32) : col;
      const apex = [t.i + lx * q / L, t.j + ly * q / L, z1], rim = Array.from({ length: n }, (_, m) => { const a = a0 + q * 0.4 + m / n * Math.PI * 2, j = 0.88 + 0.24 * hash(t.i * 3 + m, t.j + q); return [t.i + Math.cos(a) * w * j, t.j + Math.sin(a) * w * j, z0 - 0.04 * k]; });
      const c = [t.i, t.j, z0 + 0.0001], tris = [];
      for (let m = 0; m < n; m++) tris.push([apex, rim[m], rim[(m + 1) % n]], [c, rim[(m + 1) % n], rim[m]]);
      solid(tris, [t.i, t.j, (z0 + z1) / 2], lc, 1.02);
    }
  }
}
// ---------- stream, airstrip, plane, foxes ----------
function drawRibbonSeg(k, t) {
  const a = RIBBON[k], b = RIBBON[k + 1];
  const pts = [P(a.x + a.nx * a.w, a.y + a.ny * a.w, a.h), P(b.x + b.nx * b.w, b.y + b.ny * b.w, b.h), P(b.x - b.nx * b.w, b.y - b.ny * b.w, b.h), P(a.x - a.nx * a.w, a.y - a.ny * a.w, a.h)];
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 0.01, steep = clamp((a.h - b.h) / len / 2.4, 0, 1);
  const flow = 0.5 + 0.5 * Math.sin(k * 0.55 - t * 0.0016 * (1 + steep * 0.6));
  const col = SEASON === "winter" ? mix([196, 222, 236], [236, 244, 250], steep * 0.6) : mix(mix([78, 146, 182], [196, 226, 238], steep * 0.55), [236, 246, 250], flow * (0.05 + steep * 0.12));
  const fill = rgb(lit(mix(col, S.bot, 0.08), 1));
  ctx.beginPath(); pts.forEach((p, q) => q ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = fill; ctx.lineWidth = 1; ctx.stroke();
}
const RW = 0.17;
function drawRunwaySeg(q, n) {
  const { a, b, tan, rad } = RUNWAY, h = RUNWAY.h + 0.07, t0 = q / n, t1 = (q + 1) / n;
  const at = t => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const quad = (u0, u1, w0, w1, col) => {
    const p0 = at(u0), p1 = at(u1);
    poly([P(p0[0] + rad[0] * w0, p0[1] + rad[1] * w0, h), P(p1[0] + rad[0] * w0, p1[1] + rad[1] * w0, h), P(p1[0] + rad[0] * w1, p1[1] + rad[1] * w1, h), P(p0[0] + rad[0] * w1, p0[1] + rad[1] * w1, h)], rgb(lit(col)));
  };
  quad(t0, t1 + 0.002, -RW, RW, [74, 74, 82]);
  if (q % 2 && q > 0 && q < n - 1) quad(t0 + 0.02, t1 - 0.02, -0.015, 0.015, [236, 234, 226]);
  if (q === 0 || q === n - 1) { const m = q === 0 ? t0 + 0.02 : t1 - 0.06; for (let s2 = -3; s2 <= 3; s2++) if (s2) quad(m, m + 0.04, s2 * 0.045 - 0.012, s2 * 0.045 + 0.012, [236, 234, 226]); }
}
const TOWER = (() => { const { c, rad, tan } = RUNWAY; return [c[0] + rad[0] * 0.75 + tan[0] * 0.9, c[1] + rad[1] * 0.75 + tan[1] * 0.9]; })();
function drawTower() {
  const [x, y] = TOWER, h = hf(x, y);
  const conc = [222, 214, 200], concD = [176, 170, 160], trim = [60, 58, 66], glass = [110, 168, 192];
  // straight shaft with a band halfway up, drawn bottom to top so nothing paints over what sits above it
  box(x - 0.12, y - 0.12, x + 0.12, y + 0.12, h, h + 0.46, conc);
  box(x - 0.135, y - 0.135, x + 0.135, y + 0.135, h + 0.46, h + 0.5, concD);
  box(x - 0.12, y - 0.12, x + 0.12, y + 0.12, h + 0.5, h + 0.95, conc);
  box(x - 0.2, y - 0.2, x + 0.2, y + 0.2, h + 0.95, h + 1.0, concD); // deck under the cab
  // glass cab with corner frames: the far frames go behind the glass, the near ones in front
  const post = (sx, sy) => { const m = 0.18; box(x + sx * m - 0.014, y + sy * m - 0.014, x + sx * m + 0.014, y + sy * m + 0.014, h + 1.0, h + 1.24, trim); };
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]], near = ([sx, sy]) => depth(x + sx, y + sy) > depth(x, y);
  corners.filter(c => !near(c)).forEach(c => post(...c));
  box(x - 0.18, y - 0.18, x + 0.18, y + 0.18, h + 1.0, h + 1.24, glass, 1.15);
  corners.filter(near).forEach(c => post(...c));
  box(x - 0.23, y - 0.23, x + 0.23, y + 0.23, h + 1.24, h + 1.3, trim); // roof with overhang
  box(x - 0.1, y - 0.1, x + 0.1, y + 0.1, h + 1.3, h + 1.37, concD);
  const m0 = P(x, y, h + 1.37), m1 = P(x, y, h + 1.6);
  ctx.strokeStyle = rgb(lit([90, 88, 92])); ctx.lineWidth = Math.max(1, TW * cam.zoom * 0.012); ctx.beginPath(); ctx.moveTo(m0[0], m0[1]); ctx.lineTo(m1[0], m1[1]); ctx.stroke();
  ctx.fillStyle = rgb(lit([200, 60, 50], 1.2)); ctx.beginPath(); ctx.arc(m1[0], m1[1], Math.max(1.2, TW * cam.zoom * 0.018), 0, Math.PI * 2); ctx.fill();
  // windsock
  const wx = RUNWAY.b[0] + RUNWAY.rad[0] * 0.45, wy = RUNWAY.b[1] + RUNWAY.rad[1] * 0.45, wh = hf(wx, wy);
  const p0 = P(wx, wy, wh), p1 = P(wx, wy, wh + 0.8), sway = Math.sin(performance.now() * 0.002) * 0.08;
  ctx.strokeStyle = rgb(lit([90, 88, 92])); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
  const s1 = P(wx + RUNWAY.tan[0] * 0.35, wy + RUNWAY.tan[1] * 0.35 + sway, wh + 0.72);
  ctx.fillStyle = rgb(lit([236, 120, 40])); ctx.beginPath(); ctx.moveTo(p1[0], p1[1] - 3); ctx.lineTo(s1[0], s1[1]); ctx.lineTo(p1[0], p1[1] + 3); ctx.closePath(); ctx.fill();
}
// plane: parked at the threshold, or flying a Catmull-Rom circuit around the island
const plane = { mode: "parked", t: 0 };
const FLIGHT = (() => {
  const { a, b } = RUNWAY, h0 = RUNWAY.h + 0.1, ul = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / ul, (b[1] - a[1]) / ul];
  const W = [[a[0], a[1], h0], [a[0] + u[0] * 1.2, a[1] + u[1] * 1.2, h0], [b[0], b[1], h0 + 0.2], [b[0] + u[0] * 2.6, b[1] + u[1] * 2.6, h0 + 2.4]];
  const A = [a[0] - u[0] * 4.6, a[1] - u[1] * 4.6, h0 + 3.0], A2 = [a[0] - u[0] * 1.8, a[1] - u[1] * 1.8, h0 + 0.8];
  const p3 = W[3], a0 = Math.atan2(p3[1] - ICY, p3[0] - ICX), aA = Math.atan2(A[1] - ICY, A[0] - ICX);
  const sg = (u[0] * -Math.sin(a0) + u[1] * Math.cos(a0)) >= 0 ? 1 : -1;
  let sweep = (((aA - a0) * sg) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2); if (sweep < 3) sweep += Math.PI * 2;
  const steps = Math.ceil(sweep / 0.45);
  for (let q = 1; q < steps; q++) { const an = a0 + sg * sweep * q / steps, R = lerp(10.5, 9, q / steps); W.push([ICX + Math.cos(an) * R, ICY + Math.sin(an) * R, lerp(10, 7, (q / steps) ** 2)]); }
  W.push(A, A2, [a[0], a[1], h0], [a[0] + u[0] * 1.3, a[1] + u[1] * 1.3, h0]);
  const segT = [];
  for (let q = 0; q < W.length - 1; q++) {
    const l = Math.hypot(W[q + 1][0] - W[q][0], W[q + 1][1] - W[q][1], (W[q + 1][2] - W[q][2]) * 0.6);
    const alt = (W[q][2] + W[q + 1][2]) / 2 - h0, v = q === 0 ? 0.5 : q === W.length - 2 ? 0.55 : Math.min(4.2, 0.9 + alt * 0.42);
    segT.push(l / v);
  }
  return { W, segT, total: segT.reduce((x, y) => x + y, 0), u };
})();
function cr(p0, p1, p2, p3, t) { const t2 = t * t, t3 = t2 * t; return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3); }
function flightAt(time) {
  const { W, segT } = FLIGHT; let q = 0, tt = time;
  while (q < segT.length - 1 && tt > segT[q]) { tt -= segT[q]; q++; }
  const t = clamp(tt / segT[q], 0, 1), P0 = W[Math.max(0, q - 1)], P1 = W[q], P2 = W[q + 1], P3 = W[Math.min(W.length - 1, q + 2)];
  return [0, 1, 2].map(c => cr(P0[c], P1[c], P2[c], P3[c], t));
}
function stepPlane(dt) {
  if (plane.mode !== "flying") return;
  plane.t += dt;
  if (plane.t >= FLIGHT.total) { plane.mode = "parked"; plane.t = 0; }
}
function planePose() {
  if (plane.mode !== "flying") { const { a } = RUNWAY; return { x: a[0] + FLIGHT.u[0] * 0.15, y: a[1] + FLIGHT.u[1] * 0.15, h: RUNWAY.h + 0.1, hx: FLIGHT.u[0], hy: FLIGHT.u[1], pitch: 0 }; }
  const p = flightAt(plane.t), q = flightAt(Math.min(FLIGHT.total, plane.t + 0.05));
  let hx = q[0] - p[0], hy = q[1] - p[1]; const hl = Math.hypot(hx, hy) || 1; hx /= hl; hy /= hl;
  return { x: p[0], y: p[1], h: p[2], hx, hy, pitch: Math.atan2(q[2] - p[2], hl) * 0.8 };
}
const PLANE_PARTS = [
  { col: [236, 236, 232], pts: [[0.12, 0, 0.07], [-0.05, 0.5, 0.07], [-0.17, 0.5, 0.07], [-0.12, 0, 0.07], [-0.17, -0.5, 0.07], [-0.05, -0.5, 0.07]] },
  { col: [236, 236, 232], pts: [[-0.33, 0, 0.12], [-0.43, 0.19, 0.12], [-0.47, 0.19, 0.12], [-0.45, 0, 0.12], [-0.47, -0.19, 0.12], [-0.43, -0.19, 0.12]] },
  { col: [220, 222, 226], pts: [[0.46, 0, 0.03], [0.46, 0, 0.12], [-0.44, 0, 0.15], [-0.44, 0, 0.06]] },
  { col: [246, 246, 242], pts: [[0.46, 0, 0.08], [0.24, 0.07, 0.12], [-0.42, 0.035, 0.13], [-0.42, -0.035, 0.13], [0.24, -0.07, 0.12]] },
  { col: [70, 120, 170], pts: [[0.3, 0.05, 0.125], [0.36, 0, 0.12], [0.3, -0.05, 0.125]] },
  { col: [204, 54, 40], pts: [[-0.3, 0, 0.12], [-0.45, 0, 0.36], [-0.49, 0, 0.36], [-0.45, 0, 0.12]] },
];
function drawPlane() {
  const o = planePose(), sp = Math.sin(o.pitch), PS = 0.95;
  const W = ([fx, fy, fz]) => [o.x + (fx * o.hx - fy * o.hy) * PS, o.y + (fx * o.hy + fy * o.hx) * PS, o.h + (fz + fx * sp) * PS];
  const g = groundAt(o.x, o.y);
  if (g !== null && o.h - g < 6) {
    ctx.fillStyle = rgba([0, 0, 0], 0.18 * S.light * (1 - (o.h - g) / 6));
    const sh = PLANE_PARTS[0].pts.map(q => { const w = W(q); return P(w[0], w[1], g + 0.02); });
    poly(sh, ctx.fillStyle);
  }
  for (const part of PLANE_PARTS) poly(part.pts.map(q => P(...W(q))), rgb(lit(part.col)));
  const c = P(o.x, o.y, o.h); plane.sx = c[0]; plane.sy = c[1];
}
function launchPlane() {
  if (plane.mode === "flying") return;
  plane.mode = "flying"; plane.t = 0;
  showToast(`<span><b>Koi Valley Tower:</b> Runway 03, wind calm, cleared for takeoff.</span><button class="chip" data-proj="runway" type="button">My runway study</button>`);
}
// me: a desk on the grass behind the mountain
const CK = 0.95, CW = ([u, v, z]) => [CAVE.x + (CAVE.out[0] * u + CAVE.tan[0] * v) * CK, CAVE.y + (CAVE.out[1] * u + CAVE.tan[1] * v) * CK, CAVE.h + 0.05 + z * CK];
let OB_DU = 0, OB_DV = 0;
const CI = ([u, v, z]) => CW([u + OB_DU, v + OB_DV, z]);
function obox(u0, u1, v0, v1, z0, z1, col, boost) {
  const F = pts => face(pts.map(CI), col, boost);
  F([[u1, v0, z0], [u1, v1, z0], [u1, v1, z1], [u1, v0, z1]]);
  F([[u0, v0, z0], [u0, v0, z1], [u0, v1, z1], [u0, v1, z0]]);
  F([[u0, v1, z0], [u0, v1, z1], [u1, v1, z1], [u1, v1, z0]]);
  F([[u0, v0, z0], [u1, v0, z0], [u1, v0, z1], [u0, v0, z1]]);
  F([[u0, v0, z1], [u1, v0, z1], [u1, v1, z1], [u0, v1, z1]]);
}
// a generic oriented box: origin, unit axis, height base
function rbox(ox, oy, ax, ay, oh, u0, u1, v0, v1, z0, z1, col, boost) {
  const W = ([u, v, z]) => [ox + ax * u - ay * v, oy + ay * u + ax * v, oh + z];
  const F = pts => face(pts.map(W), col, boost);
  F([[u1, v0, z0], [u1, v1, z0], [u1, v1, z1], [u1, v0, z1]]);
  F([[u0, v0, z0], [u0, v0, z1], [u0, v1, z1], [u0, v1, z0]]);
  F([[u0, v1, z0], [u0, v1, z1], [u1, v1, z1], [u1, v1, z0]]);
  F([[u0, v0, z0], [u1, v0, z0], [u1, v0, z1], [u0, v0, z1]]);
  F([[u0, v0, z1], [u1, v0, z1], [u1, v1, z1], [u0, v1, z1]]);
}
const CODE_COLS = [[255, 170, 90], [140, 210, 255], [190, 240, 160], [240, 140, 200]];
const HOODIE = [128, 86, 56], PANTS = [38, 38, 44], SKIN = [238, 198, 162], HAIR = [32, 26, 28];
function caveFacing() { return CAVE.out[0] * V[0] + CAVE.out[1] * V[1] > 0.02; }
function drawMe(t) {
  const tp = Math.sin(t * 0.016) > 0 ? 0.012 : 0, tq = Math.sin(t * 0.016 + 1.9) > 0 ? 0.012 : 0;
  const rug = () => poly([[-0.55, -0.5, 0.01], [0.75, -0.5, 0.01], [0.75, 0.5, 0.01], [-0.55, 0.5, 0.01]].map(q => P(...CW(q))), rgb(lit([176, 70, 52])));
  const chair = () => { obox(-0.36, -0.12, -0.13, 0.13, 0.17, 0.21, [120, 82, 52]); obox(-0.38, -0.34, -0.13, 0.13, 0.21, 0.5, [120, 82, 52]); for (const [u, v] of [[-0.34, -0.11], [-0.34, 0.09], [-0.16, -0.11], [-0.16, 0.09]]) obox(u, u + 0.03, v, v + 0.03, 0, 0.17, [100, 68, 44]); };
  const me = () => {
    // legs under the desk, body, arms on the laptop, head with glasses
    obox(-0.22, 0.08, -0.11, -0.02, 0.17, 0.24, PANTS); obox(-0.22, 0.08, 0.02, 0.11, 0.17, 0.24, PANTS);
    obox(0.04, 0.1, -0.11, -0.02, 0, 0.22, PANTS); obox(0.04, 0.1, 0.02, 0.11, 0, 0.22, PANTS);
    obox(-0.3, -0.1, -0.14, 0.14, 0.19, 0.48, HOODIE);
    obox(-0.33, -0.27, -0.12, 0.12, 0.42, 0.52, HOODIE);
    obox(-0.2, 0.2, -0.16, -0.1, 0.33 + tp, 0.39 + tp, HOODIE); obox(-0.2, 0.2, 0.1, 0.16, 0.33 + tq, 0.39 + tq, HOODIE);
    obox(0.2, 0.25, -0.16, -0.1, 0.34 + tp, 0.38 + tp, SKIN); obox(0.2, 0.25, 0.1, 0.16, 0.34 + tq, 0.38 + tq, SKIN);
    obox(-0.3, -0.06, -0.12, 0.12, 0.48, 0.74, SKIN);
    obox(-0.32, -0.08, -0.13, 0.13, 0.7, 0.8, HAIR); obox(-0.33, -0.25, -0.13, 0.13, 0.52, 0.72, HAIR);
    obox(-0.12, -0.05, -0.13, -0.11, 0.66, 0.74, HAIR); obox(-0.12, -0.05, 0.11, 0.13, 0.66, 0.74, HAIR);
    // glasses on the face (u = -0.06 plane) and along the temples
    if (caveFacing()) {
      const G = (u, v, z) => P(...CW([u, v, z]));
      ctx.strokeStyle = rgb(lit([30, 28, 30])); ctx.lineWidth = Math.max(1, TW * cam.zoom * 0.012); ctx.lineJoin = "round";
      for (const [v0, v1] of [[-0.1, -0.015], [0.015, 0.1]]) { const q = [G(-0.055, v0, 0.6), G(-0.055, v1, 0.6), G(-0.055, v1, 0.655), G(-0.055, v0, 0.655)]; ctx.fillStyle = rgba([210, 230, 255], 0.35); ctx.beginPath(); q.forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      const b0 = G(-0.055, -0.015, 0.64), b1 = G(-0.055, 0.015, 0.64); ctx.beginPath(); ctx.moveTo(b0[0], b0[1]); ctx.lineTo(b1[0], b1[1]); ctx.stroke();
      ctx.fillStyle = rgb(lit([40, 30, 30])); for (const v of [-0.058, 0.058]) { const e = G(-0.056, v, 0.625); ctx.beginPath(); ctx.arc(e[0], e[1], Math.max(0.8, TW * cam.zoom * 0.008), 0, Math.PI * 2); ctx.fill(); }
    }
  };
  const desk = () => {
    obox(0.12, 0.62, -0.42, 0.42, 0.28, 0.32, [168, 118, 74]);
    for (const [u, v] of [[0.14, -0.4], [0.14, 0.37], [0.57, -0.4], [0.57, 0.37]]) obox(u, u + 0.03, v, v + 0.03, 0, 0.28, [120, 82, 52]);
    // laptop: base, then the lid leaning back toward me
    obox(0.2, 0.42, -0.17, 0.17, 0.32, 0.335, [176, 178, 186]);
    const L = [[0.42, -0.17, 0.335], [0.42, 0.17, 0.335], [0.47, 0.17, 0.58], [0.47, -0.17, 0.58]].map(q => P(...CW(q)));
    const back = caveFacing();
    poly(L, rgb(lit(back ? [196, 198, 206] : [30, 40, 62])));
    if (back) { const c = P(...CW([0.448, 0, 0.47])); ctx.fillStyle = rgba([255, 255, 255], 0.75 * S.light + 0.2); ctx.beginPath(); ctx.arc(c[0], c[1], Math.max(1.2, TW * cam.zoom * 0.02), 0, Math.PI * 2); ctx.fill(); }
    else {
      const typed = (t * 0.0009) % 8; ctx.lineWidth = Math.max(1, TW * cam.zoom * 0.012); ctx.lineCap = "round";
      for (let r = 0; r < 6; r++) { const len = (0.08 + hash(r, 5) * 0.16) * clamp(typed - r, 0, 1); if (len <= 0) continue; const z = 0.55 - r * 0.035, u = 0.42 + (z - 0.335) * 0.2; const a = P(...CW([u - 0.003, -0.13 + [0, 0.03, 0.06, 0.06, 0.03, 0][r], z])), b = P(...CW([u - 0.003, -0.13 + [0, 0.03, 0.06, 0.06, 0.03, 0][r] + len, z])); ctx.strokeStyle = rgb(CODE_COLS[r % 4]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    }
    obox(0.48, 0.55, 0.26, 0.33, 0.32, 0.4, [226, 92, 50]);
    obox(0.5, 0.56, -0.36, -0.3, 0.32, 0.38, [190, 120, 80]); obox(0.49, 0.57, -0.37, -0.29, 0.38, 0.46, [96, 150, 84]);
  };
  groundShadow(CAVE.x, CAVE.y, CAVE.h, 0.32);
  rug();
  // draw in order of distance from the camera
  const order = caveFacing() ? [chair, me, desk] : [desk, me, chair];
  for (const f of order) f();
  // a little "</>" drifting up now and then
  const ph = (t * 0.0004) % 1;
  if (ph < 0.6) { const c = P(...CW([0.1, 0, 0.95 + ph * 0.6])); ctx.font = `600 ${Math.max(8, TW * cam.zoom * 0.11) | 0}px ui-monospace, monospace`; ctx.textAlign = "center"; ctx.fillStyle = rgba(lit([255, 250, 240]), (1 - ph / 0.6) * 0.85); ctx.fillText("</>", c[0], c[1]); }
  const c = P(...CW([0, 0, 0.5])); CAVE.sx = c[0]; CAVE.sy = c[1];
}
function caveAt(x, y) { return CAVE.sx && Math.hypot(CAVE.sx - x, CAVE.sy - y) < TW * 0.5 && !occluded(...CW([0, 0, 0.6])); }
function visitCave() {
  showToast(`<span><b>You found me.</b> Probably fixing a bug I wrote yesterday.</span><button class="chip" data-place="about" type="button">About me</button>`);
}
// stairs: wooden treads that follow the slope, with posts and a rope
const STAIRS = (() => {
  const out = [];
  let acc = 0;
  for (let k = 1; k < STAIR_LINE.length; k++) {
    const a = STAIR_LINE[k - 1], b = STAIR_LINE[k], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    acc += l;
    if (acc >= 0.17) { acc = 0; const d = [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; out.push({ x: b[0], y: b[1], d, h: hf(b[0], b[1]) }); }
  }
  return out;
})();
function drawTread(k) {
  const s2 = STAIRS[k], col = [146, 104, 66].map(c => c * (0.9 + hash(k, 2) * 0.18));
  rbox(s2.x, s2.y, s2.d[0], s2.d[1], s2.h, -0.06, 0.06, -0.24, 0.24, -0.04, 0.05, col);
  if (k % 3 === 0) for (const sd of [-1, 1]) rbox(s2.x, s2.y, s2.d[0], s2.d[1], s2.h, -0.03, 0.03, sd * 0.29 - 0.03, sd * 0.29 + 0.03, 0, 0.32, [110, 76, 50]);
}
function drawRopes() {
  ctx.strokeStyle = rgb(lit([196, 170, 120])); ctx.lineWidth = Math.max(1, TW * cam.zoom * 0.012);
  for (const sd of [-1, 1]) {
    ctx.beginPath(); let first = true;
    for (let k = 0; k < STAIRS.length; k += 3) { const s2 = STAIRS[k], px = s2.x - s2.d[1] * sd * 0.29, py = s2.y + s2.d[0] * sd * 0.29, [X, Y] = P(px, py, s2.h + 0.3); first ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y); first = false; }
    ctx.stroke();
  }
}
// stepping stones
const STONES = (() => {
  const out = []; let acc = 0.2;
  for (let k = 1; k < STONE_LINE.length; k++) {
    const a = STONE_LINE[k - 1], b = STONE_LINE[k], l = Math.hypot(b[0] - a[0], b[1] - a[1]); acc += l;
    if (acc >= 0.36) { acc = 0; const j = (hash(k, 9) - 0.5) * 0.12, nx = -(b[1] - a[1]) / l, ny = (b[0] - a[0]) / l; out.push({ x: b[0] + nx * j, y: b[1] + ny * j, r: 0.16 + hash(k, 4) * 0.05, rot: hash(k, 1) * 3, col: [168, 164, 156].map(c => c * (0.9 + hash(k, 6) * 0.16)) }); }
  }
  for (const s2 of out) s2.h = hf(s2.x, s2.y);
  return out.filter(s2 => lakeD(s2.x, s2.y) > 1.35 && insideIsland(s2.x, s2.y, 0.9) && Math.abs(hf(s2.x + 0.2, s2.y) - hf(s2.x - 0.2, s2.y)) + Math.abs(hf(s2.x, s2.y + 0.2) - hf(s2.x, s2.y - 0.2)) < 0.5 && !MARKS.some(m => Math.hypot(m.i + 0.5 - s2.x, m.j + 0.5 - s2.y) < 0.75));
})();
function drawStone(s2) {
  const pts = Array.from({ length: 9 }, (_, q) => { const a = s2.rot + q / 9 * Math.PI * 2, r = s2.r * (0.85 + hash(q, s2.rot * 10) * 0.25); return [s2.x + Math.cos(a) * r, s2.y + Math.sin(a) * r * 0.85]; });
  poly(pts.map(([x, y]) => P(x, y, hf(x, y) + 0.02)), rgb(lit(s2.col.map(c => c * 0.75))));
  poly(pts.map(([x, y]) => P(x, y, hf(x, y) + 0.07)), rgb(lit(s2.col, 1.04)));
}
// dock: off the shore between the cabin and the front of the pond, reaching toward the middle
const DOCK = (() => {
  const ang = 0.62, k = Math.round(((ang + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * SHORE.length) % SHORE.length;
  const [sx, sy] = SHORE[k], d = [LAKE.cx - sx, LAKE.cy - sy], dl = Math.hypot(...d);
  return { x: sx, y: sy, ax: d[0] / dl, ay: d[1] / dl };
})();
function drawDockParts() {
  const { x, y, ax, ay } = DOCK, h = WATER_H + 0.12;
  for (const u of [0.55, 1.15]) for (const v of [-0.2, 0.17]) rbox(x, y, ax, ay, WATER_H - 0.1, u, u + 0.06, v, v + 0.06, 0, 0.3, [96, 66, 44]);
  for (let q = 0; q < 8; q++) { const u = -0.35 + q * 0.19; rbox(x, y, ax, ay, h, u, u + 0.16, -0.23, 0.23, -0.04, 0.02, [150, 108, 70].map(c => c * (0.9 + hash(q, 8) * 0.16))); }
}
// zen garden: raked gravel, a few rocks with rings, a wooden border
const ZEN_ROCKS = [[14.9, 6.0, 0.22, 0.28], [15.75, 5.8, 0.15, 0.2], [15.55, 6.5, 0.12, 0.14]];
function drawZen(t) {
  const h = ZEN.h + 0.12, G = (x, y) => P(x, y, h);
  poly([G(ZEN.x0, ZEN.y0), G(ZEN.x1, ZEN.y0), G(ZEN.x1, ZEN.y1), G(ZEN.x0, ZEN.y1)], rgb(lit([228, 222, 206])));
  ctx.lineWidth = 1; ctx.strokeStyle = rgba(lit([186, 178, 160]), 0.9);
  for (let y = ZEN.y0 + 0.1; y < ZEN.y1 - 0.05; y += 0.1) { ctx.beginPath(); for (let x = ZEN.x0 + 0.05; x <= ZEN.x1 - 0.04; x += 0.1) { const w = y + Math.sin(x * 3 + y) * 0.015; const [X, Y] = G(x, w); x === ZEN.x0 + 0.05 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y); } ctx.stroke(); }
  for (const [rx, ry, rr] of ZEN_ROCKS) {
    const ring = R => { ctx.beginPath(); for (let q = 0; q <= 28; q++) { const a = q / 28 * Math.PI * 2, [X, Y] = G(rx + Math.cos(a) * R, ry + Math.sin(a) * R); q ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } };
    ring(rr + 0.32); ctx.fillStyle = rgb(lit([228, 222, 206])); ctx.fill();
    for (const R of [rr + 0.1, rr + 0.2, rr + 0.3]) { ring(R); ctx.stroke(); }
  }
  const W = [124, 92, 62];
  box(ZEN.x0 - 0.06, ZEN.y0 - 0.06, ZEN.x1 + 0.06, ZEN.y0, ZEN.h - 0.1, h + 0.06, W);
  box(ZEN.x0 - 0.06, ZEN.y0, ZEN.x0, ZEN.y1, ZEN.h - 0.1, h + 0.06, W);
}
function drawZenFront() {
  const h = ZEN.h + 0.12, W = [124, 92, 62];
  box(ZEN.x0 - 0.06, ZEN.y1, ZEN.x1 + 0.06, ZEN.y1 + 0.06, ZEN.h - 0.1, h + 0.06, W);
  box(ZEN.x1, ZEN.y0, ZEN.x1 + 0.06, ZEN.y1, ZEN.h - 0.1, h + 0.06, W);
}
function drawZenRock(k) {
  const [x, y, r, hh] = ZEN_ROCKS[k], h = ZEN.h + 0.12, n = 7, col = [128, 122, 118];
  const base = Array.from({ length: n }, (_, q) => { const a = q / n * Math.PI * 2 + k; return [x + Math.cos(a) * r * (0.85 + hash(q, k) * 0.3), y + Math.sin(a) * r * (0.85 + hash(k, q) * 0.3)]; });
  const top = base.map(([bx, by]) => [x + (bx - x) * 0.45, y + (by - y) * 0.45]), th = h + hh;
  for (let q = 0; q < n; q++) { const q1 = (q + 1) % n; face([[...base[q], h], [...base[q1], h], [...top[q1], th], [...top[q], th]], col); }
  face(top.map(([a, b]) => [a, b, th]), col.map(c => c * 1.08));
}
// after dark the animals settle down and sleep where they stop; each has its own bedtime so they don't all drop at once
const bedtime = a => S.light < (a.nap ??= 0.43 + Math.random() * 0.07);
function drawSleeper(a, u, o) {
  const h = hf(a.x, a.y), [x, y] = P(a.x, a.y, h);
  const ah = P(a.x + Math.cos(a.dir) * 0.3, a.y + Math.sin(a.dir) * 0.3, h), face = ah[0] >= x ? 1 : -1;
  const t = performance.now() / 1000, br = 1 + 0.05 * Math.sin(t * 1.7 + (a.phase || 0) * 3); // slow breathing
  const E = (cx, cy, rx, ry, rot, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx * u, cy * u, rx * u, ry * u, rot, 0, Math.PI * 2); ctx.fill(); };
  const dark = rgb(lit([40, 30, 26]));
  ctx.fillStyle = rgba([0, 0, 0], 0.16 * S.light); ctx.beginPath(); ctx.ellipse(x, y, u * 0.95, u * 0.28, 0, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.translate(x, y); ctx.scale(face, 1); ctx.lineCap = "round";
  if (o.ears === "long") { E(-0.05, -0.62 * br, 0.08, 0.3, 1.25, o.furD); E(0.05, -0.58 * br, 0.08, 0.3, 1.35, o.fur); }
  E(-0.08, -0.3 * br, 0.68, 0.32 * br, 0, o.fur);
  if (o.belly) E(0.0, -0.18, 0.5, 0.12, 0, o.belly);
  if (o.tail) { E(0.12, -0.13, 0.62, 0.15, -0.04, o.fur); E(0.7, -0.15, 0.15, 0.1, -0.1, o.tail); } // brush wrapped round the front
  // head tucked down at the front, resting on the ground
  const hx = 0.55, hy = -0.27 - (br - 1) * 0.6;
  if (o.ears === "fox") for (const [ex, col] of [[-0.12, o.furD], [0.04, o.fur]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo((hx + ex - 0.08) * u, (hy - 0.12) * u); ctx.lineTo((hx + ex - 0.2) * u, (hy - 0.34) * u); ctx.lineTo((hx + ex + 0.06) * u, (hy - 0.16) * u); ctx.closePath(); ctx.fill(); }
  if (o.ears === "round") { E(hx - 0.14, hy - 0.2, 0.09, 0.09, 0, o.furD); E(hx + 0.08, hy - 0.22, 0.09, 0.09, 0, o.fur); }
  if (o.ears === "deer") { E(hx - 0.12, hy - 0.2, 0.05, 0.12, -0.9, o.furD); E(hx + 0.02, hy - 0.22, 0.05, 0.12, -0.5, o.fur); }
  if (o.antlers) { ctx.strokeStyle = o.antlers; ctx.lineWidth = Math.max(1, u * 0.06); ctx.beginPath(); ctx.moveTo((hx - 0.05) * u, (hy - 0.15) * u); ctx.quadraticCurveTo((hx - 0.35) * u, (hy - 0.45) * u, (hx - 0.3) * u, (hy - 0.7) * u); ctx.moveTo((hx - 0.2) * u, (hy - 0.38) * u); ctx.lineTo((hx - 0.02) * u, (hy - 0.55) * u); ctx.stroke(); }
  E(hx, hy, 0.24 * (o.head || 1), 0.18 * (o.head || 1), 0.15, o.fur);
  if (o.muzzle) E(hx + 0.2, hy + 0.05, 0.12, 0.08, 0.1, o.muzzle);
  ctx.strokeStyle = dark; ctx.lineWidth = Math.max(0.8, u * 0.035); ctx.beginPath(); ctx.arc((hx + 0.06) * u, (hy - 0.04) * u, u * 0.05, 0.2, Math.PI - 0.2); ctx.stroke(); // closed eye
  ctx.restore();
  // a couple of z's drifting up
  ctx.save(); ctx.font = `600 ${Math.max(8, u * 0.42)}px system-ui, sans-serif`; ctx.textAlign = "center";
  for (let k = 0; k < 2; k++) {
    const q = (t * 0.35 + (a.phase || 0) * 0.37 + k * 0.5) % 1;
    ctx.fillStyle = `rgba(232,238,255,${(0.75 * Math.sin(q * Math.PI)).toFixed(3)})`;
    ctx.fillText("z", x + face * u * (0.45 + q * 0.35), y - u * (0.75 + q * 1.1));
  }
  ctx.restore();
  a.sx = x; a.sy = y - u * 0.3;
}
// foxes
function foxOk(x, y) { const h = hf(x, y); return insideIsland(x, y, 0.9) && lakeD(x, y) > 1.3 && h > WATER_H + 0.35 && h < 4.3 && riverInfo(x, y)[0] > 0.3 && runwayD(x, y) > 0.3 && !MARKS.some(m => Math.hypot(m.i + 0.5 - x, m.j + 0.5 - y) < 1.05) && Math.hypot(x - CAVE.x, y - CAVE.y) > 1.1 && zenD(x, y) > 0.35; }
function foxPath(x0, y0, x1, y1) { for (let q = 1; q <= 10; q++) if (!foxOk(lerp(x0, x1, q / 10), lerp(y0, y1, q / 10))) return false; return true; }
function foxTarget(f, far, away) {
  for (let n = 0; n < 40; n++) {
    const a = away !== undefined ? away + (Math.random() - 0.5) * 1.2 : Math.random() * 6.28, d = 1.5 + Math.random() * (far ? 5 : 3);
    const x = f.x + Math.cos(a) * d, y = f.y + Math.sin(a) * d;
    if (foxPath(f.x, f.y, x, y)) { f.tx = x; f.ty = y; f.state = "run"; return true; }
  }
  return false;
}
function foxHome(x, y) { for (let r = 0; r < 6; r += 0.25) for (let a = 0; a < 6.28; a += 0.4) { const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r; if (foxOk(px, py)) return [px, py]; } return [x, y]; }
const foxes = [[14.4, 15.0], [4.4, 11.4], [14.6, 6.8]].map(p => foxHome(...p)).map(([x, y], k) => ({ x, y, tx: x, ty: y, dir: k * 2, speed: 0, state: "sit", timer: 1 + k * 1.7, phase: 0, hop: 0, scared: 0 }));
function stepFoxes(dt) {
  for (const f of foxes) {
    f.hop = Math.max(0, f.hop - dt * 1.8); f.scared = Math.max(0, f.scared - dt);
    if (f.state === "sit") {
      f.sleep = f.scared > 0 || !bedtime(f) ? Math.max(0, (f.sleep || 0) - dt * 3) : Math.min(1, (f.sleep || 0) + dt * 0.8);
      if (f.sleep > 0 || bedtime(f) && f.scared <= 0) continue; // asleep, or settling down for the night
      f.timer -= dt; if (f.timer < 0) foxTarget(f, Math.random() < 0.4); continue;
    }
    const dx = f.tx - f.x, dy = f.ty - f.y, d = Math.hypot(dx, dy);
    if (d < 0.15) { f.state = "sit"; f.timer = 1.5 + Math.random() * 4; f.speed = 0; continue; }
    const da = ((Math.atan2(dy, dx) - f.dir + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    f.dir += clamp(da, -6 * dt, 6 * dt);
    f.speed = lerp(f.speed, f.scared > 0 ? 2.6 : 1.15, dt * 3);
    const nx = f.x + Math.cos(f.dir) * f.speed * dt, ny = f.y + Math.sin(f.dir) * f.speed * dt;
    if (foxOk(nx, ny)) { f.x = nx; f.y = ny; } else if (!foxTarget(f, false)) { const [hx, hy] = foxHome(f.x, f.y); f.x = hx; f.y = hy; f.state = "sit"; f.timer = 0.6; }
    f.phase += dt * (5 + f.speed * 7);
  }
}
// autumn: fat bears ambling around, fattened up for winter
const bears = [[13.4, 15.4], [5.2, 9.6]].map(p => foxHome(...p)).map(([x, y], k) => ({ x, y, tx: x, ty: y, dir: 1 + k * 2, state: "sit", timer: 2 + k * 3, phase: k, sitting: 0 }));
function stepBears(dt, list = bears, speed = 0.32) {
  for (const b of list) {
    if (b.state === "sit") {
      b.sleep = bedtime(b) ? Math.min(1, (b.sleep || 0) + dt * 0.8) : Math.max(0, (b.sleep || 0) - dt * 3);
      if (b.sleep > 0) { b.sitting = 1; continue; }
    }
    if (b.state === "sit") { b.sitting = Math.min(1, b.sitting + dt * 1.5); b.timer -= dt; if (b.timer < 0) { if (foxTarget(b, false)) b.state = "walk"; else b.timer = 1; } continue; }
    b.sitting = Math.max(0, b.sitting - dt * 2);
    const dx = b.tx - b.x, dy = b.ty - b.y, d = Math.hypot(dx, dy);
    if (d < 0.08) { b.state = "sit"; b.timer = 3 + Math.random() * 5; continue; }
    const want = Math.atan2(dy, dx); let da = ((want - b.dir + Math.PI * 3) % (Math.PI * 2)) - Math.PI; b.dir += clamp(da, -dt * 2, dt * 2);
    const sp = speed * dt, nx = b.x + dx / d * sp, ny = b.y + dy / d * sp; b.phase += dt * 5;
    if (foxOk(nx, ny)) { b.x = nx; b.y = ny; } else { b.state = "sit"; b.timer = 1; }
  }
}
// winter: reindeer wandering through the snow, stopping now and then to nose for lichen
const reindeer = [[12.8, 14.8], [6.2, 10.4]].map(p => foxHome(...p)).map(([x, y], k) => ({ x, y, tx: x, ty: y, dir: 2 + k * 2, state: "sit", timer: 1.5 + k * 2.5, phase: k * 2, sitting: 0 }));
function drawReindeer(r, o = {}) {
  const h = hf(r.x, r.y), [x, y, sf] = P(r.x, r.y, h), u = TW * sf * cam.zoom * 0.22 * (o.scale || 1);
  if ((r.sleep || 0) > 0.5) return drawSleeper(r, u * 1.05, { fur: rgb(lit(o.fur || [128, 92, 64])), furD: rgb(lit(o.furD || [96, 68, 48])), belly: rgb(lit([226, 214, 196])), ears: "deer", antlers: o.antlers === false ? null : rgb(lit([206, 184, 150])) });
  const ah = P(r.x + Math.cos(r.dir) * 0.3, r.y + Math.sin(r.dir) * 0.3, h), face = ah[0] >= x ? 1 : -1;
  const fur = rgb(lit(o.fur || [128, 92, 64])), furD = rgb(lit(o.furD || [96, 68, 48])), pale = rgb(lit([226, 214, 196])), antler = rgb(lit([206, 184, 150])), dark = rgb(lit([40, 30, 26]));
  const walk = r.state === "walk" ? r.phase * 1.4 : 0, graze = r.sitting; // standing still: head dips to graze
  ctx.fillStyle = rgba([0, 0, 0], 0.14 * S.light); ctx.beginPath(); ctx.ellipse(x, y, u * 1.0, u * 0.26, 0, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.translate(x, y); ctx.scale(face, 1); ctx.lineCap = "round";
  // legs: thin, stepping in pairs
  ctx.lineWidth = Math.max(1.2, u * 0.13);
  for (const [lx, ph, col] of [[-0.55, Math.PI, furD], [0.45, 0, furD], [-0.42, 0, fur], [0.58, Math.PI, fur]]) {
    const sw = Math.sin(walk + ph) * 0.14; ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(lx * u, -0.75 * u); ctx.lineTo((lx + sw) * u, 0); ctx.stroke();
  }
  const E = (cx, cy, rx, ry, rot, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx * u, cy * u, rx * u, ry * u, rot, 0, Math.PI * 2); ctx.fill(); };
  E(0, -0.95, 0.78, 0.36, 0, fur); E(0.05, -0.78, 0.55, 0.16, 0, pale); E(-0.78, -1.08, 0.12, 0.1, 0, pale);
  // neck and head (lowered while grazing)
  const hx = 0.82 + graze * 0.3, hy = -1.55 + graze * 0.95 + Math.sin(walk * 0.5) * 0.03;
  ctx.strokeStyle = fur; ctx.lineWidth = u * 0.3; ctx.beginPath(); ctx.moveTo(0.55 * u, -1.05 * u); ctx.lineTo(hx * u, hy * u); ctx.stroke();
  ctx.strokeStyle = pale; ctx.lineWidth = u * 0.14; ctx.beginPath(); ctx.moveTo(0.62 * u, -0.95 * u); ctx.lineTo((hx + 0.04) * u, (hy + 0.12) * u); ctx.stroke();
  E(hx + 0.12, hy, 0.24, 0.15, 0.35 * (1 - graze) + 0.9 * graze, fur); E(hx + 0.3, hy + 0.06 + graze * 0.05, 0.08, 0.06, 0, dark);
  E(hx + 0.08, hy - 0.06, 0.035, 0.035, 0, dark); E(hx - 0.06, hy - 0.12, 0.09, 0.04, -0.6, furD);
  if (o.spots) { ctx.fillStyle = pale; for (const [sx2, sy2] of [[-0.4, -1.12], [-0.15, -1.18], [0.12, -1.12], [-0.28, -0.98], [0.02, -1.0], [0.3, -1.05]]) { ctx.beginPath(); ctx.arc(sx2 * u, sy2 * u, u * 0.05, 0, Math.PI * 2); ctx.fill(); } }
  if (o.ears) { E(hx - 0.04, hy - 0.2, 0.06, 0.13, -0.5, fur); E(hx + 0.1, hy - 0.2, 0.06, 0.13, 0.3, furD); }
  // antlers: two branching sweeps
  if (o.antlers !== false) {
  ctx.strokeStyle = antler; ctx.lineWidth = Math.max(1, u * 0.07);
  for (const off of [-0.05, 0.06]) {
    const bx = (hx + off) * u, by = (hy - 0.14) * u;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx - 0.25 * u, by - 0.35 * u, bx - 0.1 * u, by - 0.65 * u);
    ctx.moveTo(bx - 0.15 * u, by - 0.28 * u); ctx.lineTo(bx + 0.08 * u, by - 0.42 * u);
    ctx.moveTo(bx - 0.17 * u, by - 0.48 * u); ctx.lineTo(bx - 0.36 * u, by - 0.62 * u);
    ctx.moveTo(bx - 0.12 * u, by - 0.58 * u); ctx.lineTo(bx + 0.05 * u, by - 0.74 * u); ctx.stroke();
  }
  }
  ctx.restore();
}
// summer: a doe and her fawn; the fawn trots after its mother
const doe = (() => { const [x, y] = foxHome(13.6, 14.2); return { x, y, tx: x, ty: y, dir: 2.4, state: "sit", timer: 2, phase: 0, sitting: 0 }; })();
const fawn = { x: doe.x - 0.4, y: doe.y + 0.2, tx: doe.x, ty: doe.y, dir: 2.4, state: "sit", timer: 0, phase: 1, sitting: 0 };
function stepDeer(dt) {
  stepBears(dt, [doe], 0.4);
  const bx = doe.x - Math.cos(doe.dir) * 0.45, by = doe.y - Math.sin(doe.dir) * 0.45, d = Math.hypot(bx - fawn.x, by - fawn.y);
  if (d > 0.12 && foxOk(bx, by)) { fawn.tx = bx; fawn.ty = by; fawn.state = "walk"; }
  if (fawn.state === "walk") stepBears(dt, [fawn], 0.5); else fawn.sitting = doe.sitting;
  if (fawn.state === "sit") { fawn.timer = 0.2; fawn.sleep = doe.sleep || 0; }
}
// spring: rabbits hopping about the meadow, pausing to nibble
const rabbits = [[6.4, 12.6], [13.2, 13.2], [9.2, 15.4]].map(p => foxHome(...p)).map(([x, y], k) => ({ x, y, tx: x, ty: y, dir: k * 2.1, state: "sit", timer: 0.8 + k, phase: k, sitting: 0 }));
function drawRabbit(r) {
  const h = hf(r.x, r.y), [x, y0, sf] = P(r.x, r.y, h), u = TW * sf * cam.zoom * 0.16;
  if ((r.sleep || 0) > 0.5) return drawSleeper(r, u * 1.1, { fur: rgb(lit([170, 140, 112])), furD: rgb(lit([136, 108, 84])), ears: "long", head: 1.1 });
  const ah = P(r.x + Math.cos(r.dir) * 0.3, r.y + Math.sin(r.dir) * 0.3, h), face = ah[0] >= x ? 1 : -1;
  const hop = r.state === "walk" ? Math.abs(Math.sin(r.phase * 1.6)) : 0, y = y0 - hop * u * 0.9;
  const fur = rgb(lit([170, 140, 112])), furD = rgb(lit([136, 108, 84])), pale = rgb(lit([244, 238, 228])), pink = rgb(lit([236, 170, 170]));
  ctx.fillStyle = rgba([0, 0, 0], 0.14 * S.light); ctx.beginPath(); ctx.ellipse(x, y0, u * (0.9 - hop * 0.3), u * 0.25, 0, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.translate(x, y); ctx.scale(face, 1);
  const E = (cx, cy, rx, ry, rot, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx * u, cy * u, rx * u, ry * u, rot, 0, Math.PI * 2); ctx.fill(); };
  E(-0.25, -0.2, 0.32, 0.18, 0, furD);
  E(0, -0.55 - hop * 0.05, 0.62, 0.45 - hop * 0.08, -hop * 0.3, fur);
  E(-0.62, -0.62, 0.17, 0.17, 0, pale);
  E(0.5, -0.95, 0.3, 0.27, 0, fur);
  E(0.36, -1.5, 0.09, 0.32, -0.25, furD); E(0.52, -1.48, 0.09, 0.32, 0.15, fur); E(0.52, -1.46, 0.04, 0.22, 0.15, pink);
  E(0.62, -1.0, 0.045, 0.05, 0, "#2a2020"); E(0.8, -0.9, 0.05, 0.04, 0, pink);
  ctx.restore();
}
function drawBear(b) {
  const h = hf(b.x, b.y), [x, y, sf] = P(b.x, b.y, h), u = TW * sf * cam.zoom * 0.26;
  if ((b.sleep || 0) > 0.5) return drawSleeper(b, u * 1.15, { fur: rgb(lit([122, 82, 52])), furD: rgb(lit([92, 60, 38])), belly: rgb(lit([142, 98, 64])), muzzle: rgb(lit([196, 156, 112])), ears: "round", head: 1.25 });
  const ah = P(b.x + Math.cos(b.dir) * 0.3, b.y + Math.sin(b.dir) * 0.3, h), face = ah[0] >= x ? 1 : -1;
  const fur = rgb(lit([122, 82, 52])), furD = rgb(lit([92, 60, 38])), muz = rgb(lit([196, 156, 112])), dark = rgb(lit([40, 30, 24]));
  const walk = b.state === "walk" ? b.phase : 0, sit = b.sitting;
  ctx.fillStyle = rgba([0, 0, 0], 0.16 * S.light); ctx.beginPath(); ctx.ellipse(x, y, u * 1.1, u * 0.3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.translate(x, y - Math.abs(Math.sin(walk)) * u * 0.06); ctx.scale(face, 1);
  const E = (cx, cy, rx, ry, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx * u, cy * u, rx * u, ry * u, 0, 0, Math.PI * 2); ctx.fill(); };
  // legs (back pair darker), waddling
  for (const [lx, ph, col] of [[-0.5, Math.PI, furD], [0.42, 0, furD], [-0.38, 0, fur], [0.55, Math.PI, fur]]) { const sw = Math.sin(walk + ph) * 0.1 * (1 - sit); E(lx + sw, -0.12, 0.17, 0.2, col); }
  // big round belly body, squashing down when sitting
  E(0, -0.62 + sit * 0.12, 0.92, 0.6 - sit * 0.06, fur);
  E(0.1, -0.45 + sit * 0.12, 0.62, 0.36, rgb(lit([142, 98, 64])));
  E(-0.86, -0.72 + sit * 0.12, 0.12, 0.1, furD);
  // head
  const hx = 0.88, hy = -0.95 + sit * 0.2 + Math.sin(walk * 0.5) * 0.03;
  E(hx - 0.2, hy - 0.3, 0.12, 0.12, fur); E(hx + 0.18, hy - 0.3, 0.12, 0.12, fur); E(hx - 0.2, hy - 0.3, 0.06, 0.06, muz);
  E(hx, hy, 0.36, 0.32, fur); E(hx + 0.24, hy + 0.08, 0.17, 0.13, muz);
  E(hx + 0.36, hy + 0.03, 0.06, 0.045, dark); E(hx + 0.1, hy - 0.08, 0.04, 0.045, dark);
  ctx.restore();
}
function drawFox(f) {
  const h = hf(f.x, f.y), [x, y, sf] = P(f.x, f.y, h), u = TW * sf * cam.zoom * 0.2;
  if ((f.sleep || 0) > 0.5 && f.hop <= 0) { const wf = SEASON === "winter"; return drawSleeper(f, u * 0.95, { fur: rgb(lit(wf ? [242, 244, 248] : [216, 104, 40])), furD: rgb(lit(wf ? [206, 212, 222] : [170, 74, 30])), tail: rgb(lit([250, 246, 240])), ears: "fox" }); }
  const ah = P(f.x + Math.cos(f.dir) * 0.3, f.y + Math.sin(f.dir) * 0.3, h), face = ah[0] >= x ? 1 : -1;
  const lift = Math.sin(Math.min(1, f.hop) * Math.PI) * u * 1.6 + (f.state === "run" ? Math.abs(Math.sin(f.phase)) * u * 0.2 : 0);
  ctx.fillStyle = rgba([0, 0, 0], 0.16 * S.light); ctx.beginPath(); ctx.ellipse(x, y, u * 0.85, u * 0.26, 0, 0, Math.PI * 2); ctx.fill();
  const wf = SEASON === "winter";
  const fur = rgb(lit(wf ? [242, 244, 248] : [216, 104, 40])), furD = rgb(lit(wf ? [206, 212, 222] : [170, 74, 30])), white = rgb(lit(wf ? [255, 255, 255] : [246, 238, 228])), dark = rgb(lit([50, 34, 30]));
  const E = (cx, cy, rx, ry, rot, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx * u, cy * u, rx * u, ry * u, rot, 0, Math.PI * 2); ctx.fill(); };
  const T = (pts, col) => { ctx.fillStyle = col; ctx.beginPath(); pts.forEach(([px, py], q) => q ? ctx.lineTo(px * u, py * u) : ctx.moveTo(px * u, py * u)); ctx.closePath(); ctx.fill(); };
  const head = (hx, hy) => {
    T([[hx - 0.13, hy - 0.1], [hx - 0.07, hy - 0.44], [hx + 0.04, hy - 0.14]], furD);
    T([[hx + 0.02, hy - 0.15], [hx + 0.12, hy - 0.46], [hx + 0.2, hy - 0.11]], fur);
    T([[hx + 0.09, hy - 0.38], [hx + 0.12, hy - 0.46], [hx + 0.15, hy - 0.36]], dark);
    E(hx, hy, 0.22, 0.2, 0, fur);
    T([[hx + 0.08, hy - 0.1], [hx + 0.44, hy + 0.04], [hx + 0.08, hy + 0.14]], fur);
    E(hx + 0.13, hy + 0.08, 0.15, 0.08, 0.1, white);
    E(hx + 0.43, hy + 0.04, 0.045, 0.04, 0, dark);
    E(hx + 0.08, hy - 0.04, 0.035, 0.035, 0, dark);
  };
  ctx.save(); ctx.translate(x, y - lift); ctx.scale(face, 1);
  ctx.lineCap = "round"; ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, u * 0.09);
  if (f.state === "sit") {
    E(-0.32, -0.12, 0.58, 0.17, 0.08, fur); E(0.2, -0.1, 0.14, 0.1, 0, white);
    E(-0.02, -0.55, 0.3, 0.44, -0.22, fur); E(0.12, -0.6, 0.13, 0.28, -0.2, white);
    ctx.beginPath(); ctx.moveTo(0.1 * u, -0.3 * u); ctx.lineTo(0.13 * u, 0); ctx.moveTo(0.2 * u, -0.3 * u); ctx.lineTo(0.23 * u, 0); ctx.stroke();
    head(0.12, -1.05);
  } else {
    const sw = Math.sin(f.phase) * 0.75;
    for (const [px, s2] of [[0.36, 1], [0.26, -1], [-0.36, -1], [-0.46, 1]]) { const an = sw * s2; ctx.beginPath(); ctx.moveTo(px * u, -0.48 * u); ctx.lineTo((px + Math.sin(an) * 0.4) * u, (-0.48 + Math.cos(an) * 0.47) * u); ctx.stroke(); }
    E(-0.95, -0.72 + Math.sin(f.phase) * 0.05, 0.44, 0.16, -0.22, fur); E(-1.33, -0.82 + Math.sin(f.phase) * 0.05, 0.14, 0.11, -0.2, white);
    E(0, -0.6, 0.6, 0.24, 0, fur); E(0.12, -0.5, 0.32, 0.1, 0, white);
    head(0.66, -0.84);
  }
  ctx.restore();
  f.sx = x; f.sy = y - u * 0.6 - lift;
}
function sortedDraw(list) { list.map(o => [depth(o.c[0], o.c[1]), o]).sort((a, b) => a[0] - b[0]).forEach(([, o]) => o.d()); }
function drawMark(m) {
  const { i, j, h } = m;
  const night = S.light < 0.7, winCol = night ? [255, 196, 110] : [70, 80, 96], winBoost = night ? 1.6 / Math.max(0.3, S.light) : 1;
  if (m.kind === "cabin") {
    // stone footing, timber corner posts and a top beam, framed windows with sills, a door with a step,
    // and a thick overhanging gable roof with barge boards, a ridge cap and a stone chimney
    const x0 = i + 0.12, x1 = i + 0.92, y0 = j + 0.15, y1 = j + 0.85, wb = h + 0.1, wt = h + 1.1;
    const stoneC = [150, 142, 134], timber = [92, 58, 38], frame = [84, 54, 36], fascia = [52, 40, 46];
    // windows and the door sit on the outside of a wall: those on walls facing away are drawn before the walls
    // so the walls hide them, otherwise their frames show through the front of the house
    const facing = (dx, dy) => depth(i + 0.5 + dx, j + 0.5 + dy) > depth(i + 0.5, j + 0.5);
    const fittings = [
      // windows: dark frame, glass set in the frame, a sill below
      [0, 1, () => { box(i + 0.37, y1, i + 0.65, y1 + 0.03, h + 0.36, h + 0.79, frame); box(i + 0.4, y1 + 0.03, i + 0.62, y1 + 0.035, h + 0.4, h + 0.75, winCol, winBoost); box(i + 0.35, y1, i + 0.67, y1 + 0.07, h + 0.32, h + 0.36, timber); }],
      [0, -1, () => { box(i + 0.37, y0 - 0.03, i + 0.65, y0, h + 0.36, h + 0.79, frame); box(i + 0.4, y0 - 0.035, i + 0.62, y0 - 0.03, h + 0.4, h + 0.75, winCol, winBoost); }],
      [1, 0, () => { box(x1, j + 0.35, x1 + 0.03, j + 0.65, h + 0.36, h + 0.79, frame); box(x1 + 0.03, j + 0.38, x1 + 0.035, j + 0.62, h + 0.4, h + 0.75, winCol, winBoost); box(x1, j + 0.33, x1 + 0.07, j + 0.67, h + 0.32, h + 0.36, timber); }],
      // door on the west wall with a frame and a stone step
      [-1, 0, () => { box(x0 - 0.12, j + 0.34, x0 - 0.04, j + 0.66, h - 0.06, h + 0.04, stoneC); box(x0 - 0.03, j + 0.35, x0, j + 0.65, wb, h + 0.86, frame); box(x0 - 0.035, j + 0.38, x0 - 0.03, j + 0.62, wb, h + 0.82, C.wood); }],
    ];
    for (const [dx, dy, d] of fittings) if (!facing(dx, dy)) d();
    box(x0 - 0.04, y0 - 0.04, x1 + 0.04, y1 + 0.04, h - 0.06, wb, stoneC);
    box(x0, y0, x1, y1, wb, wt, C.plaster);
    for (const [cx, cy] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]]) box(cx - 0.03, cy - 0.03, cx + 0.03, cy + 0.03, wb, wt, timber);
    box(x0 - 0.02, y0 - 0.02, x1 + 0.02, y1 + 0.02, wt - 0.09, wt, timber);
    for (const [dx, dy, d] of fittings) if (facing(dx, dy)) d();
    // roof: slopes lifted by the roof thickness, eave and barge strips along the edges
    const zr = wt, zt = h + 1.85, ym = j + 0.5, X0 = i - 0.02, X1 = i + 1.06, Y0 = j - 0.02, Y1 = j + 1.02, t = 0.07;
    face([[X1, Y0, zr], [X1, Y1, zr], [X1, ym, zt]], C.wood);
    face([[X0, Y0, zr], [X0, ym, zt], [X0, Y1, zr]], C.wood);
    face([[X0, Y0, zr - t], [X1, Y0, zr - t], [X1, Y0, zr], [X0, Y0, zr]], fascia);
    face([[X0, Y1, zr - t], [X0, Y1, zr], [X1, Y1, zr], [X1, Y1, zr - t]], fascia);
    face([[X1, Y0, zr - t], [X1, ym, zt - t], [X1, ym, zt], [X1, Y0, zr]], fascia); face([[X1, ym, zt - t], [X1, Y1, zr - t], [X1, Y1, zr], [X1, ym, zt]], fascia);
    face([[X0, Y0, zr - t], [X0, Y0, zr], [X0, ym, zt], [X0, ym, zt - t]], fascia); face([[X0, ym, zt - t], [X0, ym, zt], [X0, Y1, zr], [X0, Y1, zr - t]], fascia);
    sortedDraw([
      { c: [i + 0.5, j + 0.2], d: () => face([[X0, Y0, zr], [X1, Y0, zr], [X1, ym, zt], [X0, ym, zt]], C.roof) },
      { c: [i + 0.73, j + 0.3], d: () => { box(i + 0.66, j + 0.24, i + 0.8, j + 0.38, zr + 0.2, zt + 0.4, [132, 98, 84]); box(i + 0.64, j + 0.22, i + 0.82, j + 0.4, zt + 0.4, zt + 0.46, [96, 74, 66]); } },
      { c: [i + 0.5, j + 0.8], d: () => face([[X0, ym, zt], [X1, ym, zt], [X1, Y1, zr], [X0, Y1, zr]], C.roof) },
    ]);
    box(X0, ym - 0.035, X1, ym + 0.035, zt - 0.02, zt + 0.04, fascia);
    m.glowW = [[i + 0.51, y1 + 0.05, h + 0.58], [i + 0.51, y0 - 0.05, h + 0.58], [x1 + 0.05, j + 0.5, h + 0.58]];
    m.topW = [i + 0.5, j + 0.5, h + 2.15];
  } else if (m.kind === "pavilion") {
    // a stone plinth with a front step, a timber floor shaded under the eaves, railed posts with
    // a beam ring, and a two-tier hipped roof with thick eaves and a finial
    const stoneC = [168, 158, 148], beam = [130, 38, 28], rail = [104, 62, 38], fascia = [52, 40, 46];
    // soft shadow the wide eaves throw on the ground around the plinth
    poly([[i - 0.12, j - 0.12], [i + 1.18, j - 0.12], [i + 1.18, j + 1.2], [i - 0.12, j + 1.2]].map(([x, y]) => P(x, y, h - 0.07)), rgba([20, 14, 10], 0.2 * S.light));
    box(i + 0.02, j + 0.02, i + 0.98, j + 0.98, h - 0.08, h + 0.1, stoneC);
    box(i + 0.36, j + 0.98, i + 0.64, j + 1.14, h - 0.08, h + 0.02, stoneC);
    box(i + 0.1, j + 0.1, i + 0.9, j + 0.9, h + 0.1, h + 0.17, C.wood);
    face([[i + 0.2, j + 0.2, h + 0.171], [i + 0.8, j + 0.2, h + 0.171], [i + 0.8, j + 0.8, h + 0.171], [i + 0.2, j + 0.8, h + 0.171]], C.wood, 0.62);
    const fz = h + 0.17, top = h + 1.0, P0 = 0.18, P1 = 0.82, pw = 0.055;
    const railX = (x, y0, y1) => () => { box(x - 0.02, y0, x + 0.02, y1, fz + 0.36, fz + 0.41, rail); box(x - 0.015, y0, x + 0.015, y1, fz + 0.14, fz + 0.18, rail); };
    const railY = (y, x0, x1) => () => { box(x0, y - 0.02, x1, y + 0.02, fz + 0.36, fz + 0.41, rail); box(x0, y - 0.015, x1, y + 0.015, fz + 0.14, fz + 0.18, rail); };
    sortedDraw([
      ...[[P0, P0], [P1, P0], [P0, P1], [P1, P1]].map(([px, py]) => ({ c: [i + px, j + py], d: () => box(i + px - pw, j + py - pw, i + px + pw, j + py + pw, fz, top, C.roofRed) })),
      { c: [i + 0.5, j + P0], d: railY(j + P0, i + P0 + pw, i + P1 - pw) },
      { c: [i + P0, j + 0.5], d: railX(i + P0, j + P0 + pw, j + P1 - pw) },
      { c: [i + P1, j + 0.5], d: railX(i + P1, j + P0 + pw, j + P1 - pw) },
      { c: [i + 0.5, j + P0 - 0.01], d: () => box(i + P0 - pw, j + P0 - pw, i + P1 + pw, j + P0 + pw, top - 0.12, top, beam) },
      { c: [i + P0 - 0.01, j + 0.5], d: () => box(i + P0 - pw, j + P0 - pw, i + P0 + pw, j + P1 + pw, top - 0.12, top, beam) },
      { c: [i + P1 + 0.01, j + 0.5], d: () => box(i + P1 - pw, j + P0 - pw, i + P1 + pw, j + P1 + pw, top - 0.12, top, beam) },
      { c: [i + 0.5, j + P1 + 0.01], d: () => box(i + P0 - pw, j + P1 - pw, i + P1 + pw, j + P1 + pw, top - 0.12, top, beam) },
    ]);
    // lower roof: a thick eave slab, then hipped slopes up to a ring
    const a0 = i - 0.16, a1 = i + 1.16, b0 = j - 0.16, b1 = j + 1.16, e0 = top, e1 = top + 0.08, z2 = top + 0.48;
    const c0 = i + 0.3, c1 = i + 0.7, d0 = j + 0.3, d1 = j + 0.7;
    box(a0, b0, a1, b1, e0, e1, fascia);
    face([[a0, b0, e1], [a1, b0, e1], [c1, d0, z2], [c0, d0, z2]], C.roof); face([[a1, b0, e1], [a1, b1, e1], [c1, d1, z2], [c1, d0, z2]], C.roof);
    face([[a1, b1, e1], [a0, b1, e1], [c0, d1, z2], [c1, d1, z2]], C.roof); face([[a0, b1, e1], [a0, b0, e1], [c0, d0, z2], [c0, d1, z2]], C.roof);
    // upper tier: a short red drum and a small pyramid roof with its own eave and a gold finial
    const ridge = (pts) => { ctx.strokeStyle = rgba(lit([150, 128, 132]), 0.75); ctx.lineWidth = Math.max(1, TW * cam.zoom * 0.018); ctx.lineCap = "round"; ctx.beginPath();
      // hip ridges: skip the one at the far corner, which the roof itself hides (all four show from above)
      if (cam.pitch < 1.3) pts = pts.map(r => [depth(r[0][0], r[0][1]), r]).sort((x, y) => x[0] - y[0]).slice(1).map(x => x[1]);
      for (const [p, q] of pts) { const A = P(...p), B = P(...q); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); } ctx.stroke(); };
    ridge([[[a0, b0, e1], [c0, d0, z2]], [[a1, b0, e1], [c1, d0, z2]], [[a1, b1, e1], [c1, d1, z2]], [[a0, b1, e1], [c0, d1, z2]]]);
    box(i + 0.34, j + 0.34, i + 0.66, j + 0.66, z2, z2 + 0.24, beam);
    const u0 = i + 0.22, u1 = i + 0.78, v0 = j + 0.22, v1 = j + 0.78, ue = z2 + 0.24, ut = z2 + 0.64, UT = [i + 0.5, j + 0.5, ut];
    box(u0, v0, u1, v1, ue, ue + 0.05, fascia);
    face([[u0, v0, ue + 0.05], [u1, v0, ue + 0.05], UT], C.roof); face([[u1, v0, ue + 0.05], [u1, v1, ue + 0.05], UT], C.roof);
    face([[u1, v1, ue + 0.05], [u0, v1, ue + 0.05], UT], C.roof); face([[u0, v1, ue + 0.05], [u0, v0, ue + 0.05], UT], C.roof);
    ridge([[[u0, v0, ue + 0.05], UT], [[u1, v0, ue + 0.05], UT], [[u1, v1, ue + 0.05], UT], [[u0, v1, ue + 0.05], UT]]);
    box(i + 0.47, j + 0.47, i + 0.53, j + 0.53, ut - 0.04, ut + 0.16, [214, 168, 72]);
    m.glowW = [[i + 0.5, j + 0.5, h + 0.75]]; // a lamp hung under the eaves
    m.topW = [i + 0.5, j + 0.5, h + 2.3];
  } else if (m.kind === "torii") {
    sortedDraw([
      { c: [i + 0.25, j + 0.5], d: () => box(i + 0.2, j + 0.45, i + 0.3, j + 0.55, h, h + 1.25, C.torii) },
      { c: [i + 0.75, j + 0.5], d: () => box(i + 0.7, j + 0.45, i + 0.8, j + 0.55, h, h + 1.25, C.torii) },
      { c: [i + 0.5, j + 0.2], d: () => {
        // a small stone lantern behind the gate: stepped base, pillar, lit firebox in a dark frame, peaked cap
        const cx = i + 0.5, cy = j + 0.2, st = [150, 146, 140], stD = [112, 108, 106], ink = [52, 48, 52], paper = [236, 220, 190];
        const L = (r, z0, z1, col, b) => box(cx - r, cy - r, cx + r, cy + r, h + z0, h + z1, col, b);
        L(0.11, 0, 0.05, stD); L(0.04, 0.05, 0.3, st); L(0.09, 0.3, 0.35, st);
        L(0.065, 0.35, 0.5, ink); L(0.05, 0.36, 0.49, paper, night ? 1.4 / Math.max(0.3, S.light) : 1);
        L(0.11, 0.5, 0.53, ink);
        const r = 0.11, z = h + 0.53, T = [cx, cy, h + 0.66];
        face([[cx - r, cy - r, z], [cx + r, cy - r, z], T], st); face([[cx + r, cy - r, z], [cx + r, cy + r, z], T], st);
        face([[cx + r, cy + r, z], [cx - r, cy + r, z], T], st); face([[cx - r, cy + r, z], [cx - r, cy - r, z], T], st);
        L(0.018, 0.63, 0.7, stD);
      } },
    ]);
    box(i + 0.12, j + 0.46, i + 0.88, j + 0.54, h + 0.95, h + 1.03, C.torii);
    box(i - 0.02, j + 0.42, i + 1.02, j + 0.58, h + 1.25, h + 1.38, [44, 34, 38]);
    m.glowW = [[i + 0.5, j + 0.2, h + 0.43]];
    m.topW = [i + 0.5, j + 0.5, h + 1.7];
  } else if (m.kind === "lantern") {
    // a stone tōrō: stepped base, pillar, platform, a glowing paper box in a dark frame and an eaved cap,
    // with the red post box beside it on its own little post
    const st = [150, 146, 142], stD = [112, 108, 106], ink = [52, 48, 52], paper = [236, 220, 190], glowB = night ? 1.4 / Math.max(0.3, S.light) : 1;
    const L = (a0, a1, z0, z1, col, b) => box(i + a0, j + a0, i + a1, j + a1, h + z0, h + z1, col, b);
    sortedDraw([
      { c: [i + 0.5, j + 0.5], d: () => {
        L(0.28, 0.72, 0, 0.08, stD); L(0.34, 0.66, 0.08, 0.16, st); L(0.43, 0.57, 0.16, 0.78, st); L(0.32, 0.68, 0.78, 0.88, st);
        const fz0 = h + 0.88, fz1 = h + 1.22, q0 = 0.35, q1 = 0.65, fw = 0.035;
        sortedDraw([
          ...[[q0, q0], [q1, q0], [q0, q1], [q1, q1]].map(([px, py]) => ({ c: [i + px, j + py], d: () => box(i + px - fw, j + py - fw, i + px + fw, j + py + fw, fz0, fz1, ink) })),
          { c: [i + 0.5, j + 0.5], d: () => L(0.37, 0.63, 0.88, 1.22, paper, glowB) },
        ]);
        L(0.26, 0.74, 1.22, 1.28, ink);
        const r0 = i + 0.24, r1 = i + 0.76, s0 = j + 0.24, s1 = j + 0.76, rz = h + 1.28, RT = [i + 0.5, j + 0.5, h + 1.52];
        face([[r0, s0, rz], [r1, s0, rz], RT], st); face([[r1, s0, rz], [r1, s1, rz], RT], st);
        face([[r1, s1, rz], [r0, s1, rz], RT], st); face([[r0, s1, rz], [r0, s0, rz], RT], st);
        L(0.47, 0.53, 1.48, 1.6, stD);
      } },
      { c: [i + 0.86, j + 0.3], d: () => {
        // a classic round red pillar postbox: dark plinth, ten-sided body, a lipped cap rising to a dome,
        // a letter slot with a little hood and a white collection plate
        const cx = i + 0.86, cy = j + 0.3, n = 10, red = [196, 44, 34], redD = [150, 32, 26];
        const ring = (r, z0, z1, col) => { for (let k = 0; k < n; k++) { const a0 = (k / n) * Math.PI * 2, a1 = ((k + 1) / n) * Math.PI * 2;
          face([[cx + r * Math.cos(a0), cy + r * Math.sin(a0), z0], [cx + r * Math.cos(a1), cy + r * Math.sin(a1), z0], [cx + r * Math.cos(a1), cy + r * Math.sin(a1), z1], [cx + r * Math.cos(a0), cy + r * Math.sin(a0), z1]], col); } };
        const cone = (r, z0, z1, col) => { for (let k = 0; k < n; k++) { const a0 = (k / n) * Math.PI * 2, a1 = ((k + 1) / n) * Math.PI * 2;
          face([[cx + r * Math.cos(a0), cy + r * Math.sin(a0), z0], [cx + r * Math.cos(a1), cy + r * Math.sin(a1), z0], [cx, cy, z1]], col); } };
        ring(0.15, h - 0.02, h + 0.06, ink);
        ring(0.12, h + 0.06, h + 0.6, red);
        ring(0.135, h + 0.6, h + 0.65, redD);
        cone(0.135, h + 0.65, h + 0.8, red);
        box(cx - 0.02, cy - 0.02, cx + 0.02, cy + 0.02, h + 0.79, h + 0.84, redD);
        // the slot faces east and the plate south; each is drawn only while its side faces the camera
        if (depth(cx + 1, cy) > depth(cx, cy) || cam.pitch > 1.3) { box(cx + 0.118, cy - 0.06, cx + 0.128, cy + 0.06, h + 0.45, h + 0.475, ink); box(cx + 0.118, cy - 0.07, cx + 0.15, cy + 0.07, h + 0.48, h + 0.5, redD); }
        if (depth(cx, cy + 1) > depth(cx, cy) || cam.pitch > 1.3) box(cx - 0.05, cy + 0.118, cx + 0.05, cy + 0.123, h + 0.24, h + 0.36, [242, 238, 228]);
      } },
    ]);
    m.glowW = [[i + 0.5, j + 0.5, h + 1.05]];
    m.topW = [i + 0.5, j + 0.5, h + 1.85];
  }
}
function drawDock() {
  const m = MARKS[1];
  for (let k = 0; k < 4; k++) box(m.i + 0.32, m.j + 0.7 + k * 0.42, m.i + 0.68, m.j + 1.06 + k * 0.42, WATER_H + 0.05, WATER_H + 0.18, C.wood);
}

// ---------- sky ----------
const stars = Array.from({ length: 170 }, () => [Math.random(), Math.random() * 0.7, Math.random() * 1.4 + 0.4, Math.random() * 6]);
const clouds = Array.from({ length: 5 }, () => ({ x: Math.random(), y: 0.08 + Math.random() * 0.25, s: 0.6 + Math.random() * 0.8, v: 0.004 + Math.random() * 0.006 }));
let _moonC = null;
function moonCanvas(n) { if (!_moonC) _moonC = document.createElement("canvas"); if (_moonC.width !== n) { _moonC.width = n; _moonC.height = n; } return _moonC; }
function drawSky(t) {
  const gr = ctx.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, rgb(S.top)); gr.addColorStop(1, rgb(S.bot));
  ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
  const night = clamp((0.72 - S.light) / 0.36, 0, 1);
  if (night > 0) for (const [sx, sy, sr, ph] of stars) {
    ctx.fillStyle = `rgba(255,248,230,${night * (0.45 + 0.4 * Math.sin(t * 0.0015 + ph))})`;
    ctx.fillRect(sx * W, sy * H, sr, sr);
  }
  drawSkyExtras(t, night);
  const arc = (p) => [W * (0.08 + 0.84 * p), H * 0.62 - Math.sin(p * Math.PI) * H * 0.5];
  const sp = (hourNow - 6) / (19 - 6);
  if (sp > -0.05 && sp < 1.05) {
    const [x, y] = arc(sp), r = Math.max(18, TW * 0.7);
    const warm = 1 - Math.sin(clamp(sp, 0, 1) * Math.PI);
    const halo = ctx.createRadialGradient(x, y, r * 0.4, x, y, r * 4);
    halo.addColorStop(0, `rgba(255,${(230 - warm * 80) | 0},${(170 - warm * 90) | 0},0.55)`); halo.addColorStop(1, "rgba(255,220,160,0)");
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x, y, r * 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgb(255,${(244 - warm * 70) | 0},${(214 - warm * 110) | 0})`; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  const mp = ((hourNow - 19 + 24) % 24) / 11;
  if (mp >= 0 && mp <= 1) {
    const harvest = SEASON === "autumn", [x, y] = arc(mp), r = Math.max(14, TW * 0.5) * (harvest ? 1.7 : 1);
    if (harvest) {
      const hl = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 3); hl.addColorStop(0, `rgba(255,190,110,${0.3 * night})`); hl.addColorStop(1, "rgba(255,190,110,0)");
      ctx.fillStyle = hl; ctx.beginPath(); ctx.arc(x, y, r * 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(250,196,120,${0.92 * night + 0.08})`; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(214,150,90,${0.35 * night})`; for (const [dx, dy, rr] of [[-0.3, -0.2, 0.2], [0.25, 0.15, 0.25], [0.05, -0.4, 0.12]]) { ctx.beginPath(); ctx.arc(x + dx * r, y + dy * r, rr * r, 0, Math.PI * 2); ctx.fill(); }
    } else {
      // crescent = moon disc minus an offset disc, cut out so the sky and aurora show through
      const n = Math.ceil(r * 2 + 4), mc = moonCanvas(n), m = mc.getContext("2d"), c0 = n / 2;
      m.clearRect(0, 0, n, n); m.globalCompositeOperation = "source-over"; m.fillStyle = "rgb(240,236,220)"; m.beginPath(); m.arc(c0, c0, r, 0, Math.PI * 2); m.fill();
      m.globalCompositeOperation = "destination-out"; m.beginPath(); m.arc(c0 + r * 0.42, c0 - r * 0.18, r * 0.9, 0, Math.PI * 2); m.fill();
      ctx.save(); ctx.globalAlpha = 0.9 * night + 0.1; ctx.drawImage(mc, x - c0, y - c0); ctx.restore();
    }
  }
  for (const c of clouds) {
    c.x += c.v / 60; if (c.x > 1.2) c.x = -0.2;
    const x = c.x * W, y = c.y * H, s = c.s * TW * 1.6;
    const col = mix([255, 255, 255], S.bot, 0.35);
    ctx.fillStyle = rgba(lit(col, 1.05), 0.55 + 0.25 * S.light);
    ctx.beginPath(); ctx.ellipse(x, y, s * 1.4, s * 0.38, 0, 0, Math.PI * 2); ctx.ellipse(x - s * 0.5, y - s * 0.2, s * 0.6, s * 0.36, 0, 0, Math.PI * 2); ctx.ellipse(x + s * 0.45, y - s * 0.28, s * 0.7, s * 0.42, 0, 0, Math.PI * 2); ctx.fill();
  }
}

// ---------- koi, food, ripples ----------
const KOI_PROJECTS = PROJECTS.filter(p => p.koi);
const koi = KOI_PROJECTS.map((p, k) => {
  const a = (k / KOI_PROJECTS.length) * Math.PI * 2;
  return { p, x: LAKE.cx + Math.cos(a) * 1.6, y: LAKE.cy + Math.sin(a) * 1.3, dir: a + Math.PI / 2, speed: 0.35, phase: Math.random() * 6, tx: LAKE.cx, ty: LAKE.cy, excite: 0, retarget: 0, hover: false };
});
const food = [], ripples = [];
function inPond(x, y, s = 0.8) { return lakeD(x, y) < s * s; }
function newTarget(f) { for (let n = 0; n < 20; n++) { const x = LAKE.cx + (Math.random() * 2 - 1) * LAKE.rx, y = LAKE.cy + (Math.random() * 2 - 1) * LAKE.ry; if (inPond(x, y, 0.72)) { f.tx = x; f.ty = y; return; } } }
koi.forEach(newTarget);
function stepKoi(dt) {
  if (SEASON === "winter") return;
  for (const f of koi) {
    let tx = f.tx, ty = f.ty, want = f.hover ? 0.08 : 0.32 + f.excite * 0.25;
    let best = null, bd = 1e9;
    for (const fd of food) { const d = Math.hypot(fd.x - f.x, fd.y - f.y); if (d < bd) { bd = d; best = fd; } }
    if (best && bd < 3.5) { tx = best.x; ty = best.y; want = 0.85; if (bd < 0.18) { best.eaten = true; f.excite = 1.6; ripples.push({ x: best.x, y: best.y, r: 0, a: 0.5 }); } }
    else if (Math.hypot(tx - f.x, ty - f.y) < 0.3 || (f.retarget -= dt) < 0) { newTarget(f); f.retarget = 4 + Math.random() * 5; }
    const ang = Math.atan2(ty - f.y, tx - f.x);
    let da = ((ang - f.dir + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    for (const o of koi) if (o !== f) { const d = Math.hypot(o.x - f.x, o.y - f.y); if (d < 0.45) da += (Math.atan2(f.y - o.y, f.x - o.x) - f.dir) * 0.02; }
    f.dir += clamp(da, -2.4 * dt, 2.4 * dt);
    f.speed = lerp(f.speed, want, dt * 1.5);
    const nx = f.x + Math.cos(f.dir) * f.speed * dt, ny = f.y + Math.sin(f.dir) * f.speed * dt;
    if (inPond(nx, ny, 0.8)) { f.x = nx; f.y = ny; } else { f.dir += Math.PI * 0.6 * dt * 4; newTarget(f); }
    f.phase += dt * (4 + f.speed * 10);
    f.excite = Math.max(0, f.excite - dt * 0.5);
  }
  for (let k = food.length - 1; k >= 0; k--) { food[k].t += dt; if (food[k].eaten || food[k].t > 12) food.splice(k, 1); }
  for (let k = ripples.length - 1; k >= 0; k--) { const r = ripples[k]; r.r += dt * 0.9; r.a -= dt * 0.35; if (r.a <= 0) ripples.splice(k, 1); }
}
function koiLook(f) {
  if (f.look) return f.look;
  // base = the most common colour; the rest become patches where they appear along the body
  const cols = f.p.koi, count = {}; for (const c of cols) count[c] = (count[c] || 0) + 1;
  const base = Object.keys(count).sort((a, b) => count[b] - count[a])[0];
  const patches = cols.map((c, k) => c === base ? null : { k, c, dx: (hash(k, cols.length) - 0.5) * 0.5, s: 0.8 + hash(k, 3) * 0.5 }).filter(Boolean);
  return (f.look = { base: hex(base), patches, solid: patches.every(q => Math.abs(hex(q.c)[0] - hex(base)[0]) < 40) });
}
const KOI_W = [0.05, 0.085, 0.1, 0.098, 0.086, 0.068, 0.05, 0.034, 0.024];
function drawKoi(f) {
  const look = koiLook(f), cs = Math.cos(f.dir), sn = Math.sin(f.dir), seg = 0.068, N = KOI_W.length;
  // spine from nose to tail root, swinging more toward the tail
  const sp = [];
  for (let k = 0; k < N; k++) { const back = k * seg - 0.03, lat = Math.sin(f.phase - k * 0.55) * 0.01 * k * k * 0.18; sp.push([f.x - cs * back - sn * lat, f.y - sn * back + cs * lat]); }
  const nrm = sp.map((q, k) => { const a = sp[Math.max(0, k - 1)], b = sp[Math.min(N - 1, k + 1)], dx = a[0] - b[0], dy = a[1] - b[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; });
  const W = (k, side, m = 1) => P(sp[k][0] + nrm[k][0] * KOI_W[k] * side * m, sp[k][1] + nrm[k][1] * KOI_W[k] * side * m, WATER_H);
  const S0 = sp.map(q => P(q[0], q[1], WATER_H)), zoomU = TW * cam.zoom;
  const nose = P(sp[0][0] + cs * 0.05, sp[0][1] + sn * 0.05, WATER_H);
  const bodyPath = (dx = 0, dy = 0) => {
    const L = [], R = [];
    for (let k = 0; k < N; k++) { L.push(W(k, 1)); R.push(W(k, -1)); }
    ctx.beginPath(); ctx.moveTo(nose[0] + dx, nose[1] + dy);
    const pts = [...L, ...R.reverse()];
    let prev = [nose[0], nose[1]];
    ctx.quadraticCurveTo(L[0][0] + dx, L[0][1] + dy, (L[0][0] + L[1][0]) / 2 + dx, (L[0][1] + L[1][1]) / 2 + dy);
    for (let k = 1; k < pts.length - 1; k++) { const a = pts[k], b = pts[k + 1]; ctx.quadraticCurveTo(a[0] + dx, a[1] + dy, (a[0] + b[0]) / 2 + dx, (a[1] + b[1]) / 2 + dy); }
    const last = pts[pts.length - 1]; ctx.quadraticCurveTo(last[0] + dx, last[1] + dy, nose[0] + dx, nose[1] + dy); ctx.closePath();
  };
  // tail: two soft lobes that trail and swish
  const tk = N - 1, tw = Math.sin(f.phase - N * 0.55) * 0.05, tc = [sp[tk][0] - cs * 0.02, sp[tk][1] - sn * 0.02];
  const lobe = (side) => [P(tc[0] - cs * 0.17 - sn * (tw + 0.1 * side), tc[1] - sn * 0.17 + cs * (tw + 0.1 * side), WATER_H), P(tc[0] - cs * 0.09 - sn * (tw * 0.6 + 0.02 * side), tc[1] - sn * 0.09 + cs * (tw * 0.6 + 0.02 * side), WATER_H)];
  const root = P(tc[0], tc[1], WATER_H), tip = P(tc[0] - cs * 0.1 - sn * tw * 0.8, tc[1] - sn * 0.1 + cs * tw * 0.8, WATER_H);
  const finCol = look.patches.length && !look.solid ? hex(f.p.koi[N - 2] || f.p.koi[7]) : look.base;
  // shadow on the pond floor
  ctx.fillStyle = rgba(lit([10, 30, 50]), 0.2); bodyPath(zoomU * 0.03, zoomU * 0.05); ctx.fill();
  // pectoral fins, fanning slowly
  const flap = Math.sin(f.phase * 0.8) * 0.25;
  ctx.fillStyle = rgba(lit(mix(look.base, [255, 255, 255], 0.3)), 0.8);
  for (const side of [1, -1]) {
    const a = W(2, side, 0.8), b = P(sp[3][0] + nrm[3][0] * side * (0.17 + flap * 0.04) - cs * 0.03, sp[3][1] + nrm[3][1] * side * (0.17 + flap * 0.04) - sn * 0.03, WATER_H), c = W(3, side, 0.9);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(b[0], b[1], c[0], c[1]); ctx.closePath(); ctx.fill();
  }
  // tail
  ctx.fillStyle = rgba(lit(mix(finCol, [255, 255, 255], 0.15)), 0.72);
  ctx.beginPath(); ctx.moveTo(root[0], root[1]);
  const [lA, lAm] = lobe(1), [lB, lBm] = lobe(-1);
  ctx.quadraticCurveTo(lAm[0], lAm[1], lA[0], lA[1]); ctx.quadraticCurveTo(tip[0], tip[1], lB[0], lB[1]); ctx.quadraticCurveTo(lBm[0], lBm[1], root[0], root[1]); ctx.fill();
  ctx.strokeStyle = rgba(lit(mix(finCol, [0, 0, 0], 0.15)), 0.35); ctx.lineWidth = 0.7;
  for (const q of [lA, tip, lB]) { ctx.beginPath(); ctx.moveTo(root[0], root[1]); ctx.lineTo((root[0] * 0.3 + q[0] * 0.7), (root[1] * 0.3 + q[1] * 0.7)); ctx.stroke(); }
  // body with its colour patches clipped inside
  ctx.save(); bodyPath(); ctx.fillStyle = rgb(lit(look.base, 1.02)); ctx.fill(); ctx.clip();
  for (const q of look.patches) {
    const k = Math.min(N - 1, q.k + 0.5) | 0, c = P(sp[k][0] + nrm[k][0] * q.dx * 0.1, sp[k][1] + nrm[k][1] * q.dx * 0.1, WATER_H), r = zoomU * KOI_W[k] * 0.85 * q.s;
    ctx.fillStyle = rgb(lit(hex(q.c), 1.02)); ctx.beginPath(); ctx.ellipse(c[0], c[1], r * 1.1, r * 0.85, Math.atan2(S0[0][1] - S0[N - 1][1], S0[0][0] - S0[N - 1][0]), 0, Math.PI * 2); ctx.fill();
  }
  // soft shading along the flanks and a sheen down the back
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.strokeStyle = rgba([255, 255, 255], 0.28 * (0.4 + 0.6 * S.light)); ctx.lineWidth = Math.max(1, zoomU * 0.018);
  ctx.beginPath(); for (let k = 1; k < N - 2; k++) { const q = W(k, 0.35); k > 1 ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke();
  ctx.strokeStyle = rgba([0, 0, 0], 0.12); ctx.lineWidth = Math.max(1, zoomU * 0.03);
  ctx.beginPath(); for (let k = 1; k < N; k++) { const q = W(k, -1); k > 1 ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke();
  ctx.restore();
  // eyes
  ctx.fillStyle = "rgba(30,30,36,0.7)";
  for (const side of [1, -1]) { const e = P(sp[0][0] + nrm[0][0] * side * 0.036 + cs * 0.012, sp[0][1] + nrm[0][1] * side * 0.036 + sn * 0.012, WATER_H); ctx.beginPath(); ctx.arc(e[0], e[1], Math.max(0.6, zoomU * 0.0055), 0, Math.PI * 2); ctx.fill(); }
  if (f.hover || f.excite > 1.5) {
    ctx.strokeStyle = `rgba(255,236,190,${f.hover ? 0.9 : 0.4})`; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let k = 0; k <= 20; k++) { const a = k / 20 * Math.PI * 2, p = P(sp[3][0] + Math.cos(a) * 0.32, sp[3][1] + Math.sin(a) * 0.32, WATER_H); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
    ctx.stroke();
  }
  f.sx = S0[2][0]; f.sy = S0[2][1];
}
const calmRings = [];
function ringW(x, y, r) { ctx.beginPath(); for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI * 2, p = P(x + Math.cos(a) * r, y + Math.sin(a) * r, WATER_H); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } }
function drawWater(t) {
  { const e = RIBBON[RIBBON.length - 1];
    if (SEASON !== "winter") for (let q = 0; q < 3; q++) { const r = (t * 0.0001 + q / 3) % 1; ctx.strokeStyle = `rgba(255,255,255,${(1 - r) * 0.35})`; ctx.lineWidth = 1.2; ringW(e.x, e.y, 0.12 + r * 0.45); ctx.stroke(); } }
  ctx.save();
  // calm water: just a few slow, faint rings where a koi has touched the surface
  ctx.strokeStyle = rgb(mix([255, 255, 255], S.bot, 0.3)); ctx.lineWidth = 1;
  if (SEASON !== "winter") for (let k = 0; k < 4; k++) {
    const per = 9000 + k * 1700, c = Math.floor((t + k * 2300) / per), ph = ((t + k * 2300) % per) / per;
    // each ring starts where a koi is at that moment, then stays put as the fish swims on
    if (!koi.length) break;
    const cr = calmRings[k] || (calmRings[k] = { c: -1, x: 0, y: 0 });
    if (cr.c !== c) { const f = koi[(c + k * 3) % koi.length]; cr.c = c; cr.x = f.x; cr.y = f.y; }
    const x = cr.x, y = cr.y;
    for (const lag of [0, 0.18]) { const q = ph * 2.5 - lag; if (q <= 0 || q >= 1) continue; ctx.globalAlpha = (1 - q) * (1 - q) * (0.22 + 0.14 * S.light); ringW(x, y, 0.06 + q * 0.36); ctx.stroke(); }
  }
  // spring rain: small soft rings where the drops land
  for (const r of rainRings) for (const lag of [0, 0.3]) { const q = r.q - lag; if (q <= 0) continue; ctx.globalAlpha = (1 - q) * (1 - q) * (0.2 + 0.14 * S.light); ringW(r.x, r.y, 0.03 + q * 0.2); ctx.stroke(); }
  ctx.restore();
  for (const r of ripples) { ctx.strokeStyle = `rgba(255,255,255,${r.a})`; ctx.lineWidth = 1.2; ringW(r.x, r.y, r.r * 0.5); ctx.stroke(); }
  for (const fd of food) { const c = P(fd.x, fd.y, WATER_H); ctx.fillStyle = `rgba(214,170,98,${clamp(1 - fd.t / 12, 0, 1)})`; ctx.beginPath(); ctx.arc(c[0], c[1], Math.max(1.5, TW * 0.03), 0, Math.PI * 2); ctx.fill(); }
}

// ---------- leaves & fireflies (world space, so they turn with the island) ----------
const leaves = [];
const maples = trees.filter(t => t.blobs.length);
let windX = 0;
function spawnLeaf(t) {
  t = t || maples[(Math.random() * maples.length) | 0]; if (!t) return;
  const sp = t.kind === "bush" ? 0.3 : 0.5, x = t.i + (Math.random() - 0.5) * sp, y = t.j + (Math.random() - 0.5) * sp;
  leaves.push({ x, y, z: t.h + t.crown * (0.85 + Math.random() * 0.3), ph: Math.random() * 6, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 3, vz: 0.35 + Math.random() * 0.3,
    col: t.blobs.length ? t.blobs[(Math.random() * t.blobs.length) | 0][3] : C.maples[(Math.random() * 5) | 0], life: 0, landed: false, size: 0.05 + Math.random() * 0.03 });
}
function spawnSnow() {
  // a share of the flakes fall over the pond so a light dusting builds up on the ice
  const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()), onPond = Math.random() < 0.25;
  leaves.push({ x: onPond ? LAKE.cx + Math.cos(a) * r * LAKE.rx : ICX + Math.cos(a) * r * 10, y: onPond ? LAKE.cy + Math.sin(a) * r * LAKE.ry : ICY + Math.sin(a) * r * 10, z: 10 + Math.random() * 3, ph: Math.random() * 6, rot: 0, vr: 0, vz: 0.5 + Math.random() * 0.35, col: [250, 252, 255], life: 0, landed: false, size: 0.025 + Math.random() * 0.02, snow: true });
}
function stepLeaves(dt) {
  if (!reduceMotion) {
    if (SEASON === "winter") { if (leaves.length < 320 && Math.random() < dt * 14 * snowAmt) spawnSnow(); }
    else if (leaves.length < 70 && Math.random() < dt * (SEASON === "summer" ? 0.25 : SEASON === "spring" ? 1.6 : 2.2)) spawnLeaf();
  }
  windX *= Math.pow(0.2, dt);
  const rxv = [cosY, -sinY];
  for (let k = leaves.length - 1; k >= 0; k--) {
    const l = leaves[k]; l.life += dt;
    if (!l.landed) {
      l.ph += dt * 2.4;
      const sway = Math.sin(l.ph) * 0.35 + windX * 0.01;
      l.x += rxv[0] * sway * dt + 0.05 * dt; l.y += rxv[1] * sway * dt + 0.03 * dt; l.z -= l.vz * dt; l.rot += l.vr * dt;
      const g = inPond(l.x, l.y, 1) ? WATER_H : groundAt(l.x, l.y);
      if (g === null) { if (l.z < -4) leaves.splice(k, 1); continue; }
      if (l.z <= g) { l.z = g; l.landed = true; l.life = 0; l.stay = l.snow && g === WATER_H ? 20 + Math.random() * 10 : 6; }
    } else if (l.life > l.stay) leaves.splice(k, 1);
  }
}
function drawLeaves() {
  for (const l of leaves) {
    const a = l.landed ? clamp(Math.min(1, (l.stay - l.life) / 6), 0, 1) : 1, [x, y, f] = P(l.x, l.y, l.z), sz = Math.max(2.2, l.size * TW * f * cam.zoom);
    ctx.save(); ctx.translate(x, y); ctx.rotate(l.rot); ctx.scale(1, l.landed ? 0.5 : 0.6 + 0.4 * Math.abs(Math.sin(l.ph)));
    ctx.fillStyle = rgba(lit(l.col, 1.05), a);
    if (l.snow) { ctx.beginPath(); ctx.arc(0, 0, sz * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.restore(); continue; }
    ctx.beginPath(); ctx.moveTo(-sz, 0); ctx.quadraticCurveTo(0, -sz * 0.9, sz, 0); ctx.quadraticCurveTo(0, sz * 0.9, -sz, 0); ctx.fill();
    ctx.restore();
  }
}
const flies = Array.from({ length: 26 }, () => { const t = trees[(Math.random() * trees.length) | 0] || { i: 9, j: 9, h: 2 }; return { i: t.i, j: t.j, h: t.h + 0.6, ph: Math.random() * 10, sp: 0.5 + Math.random() }; });
function glow(x, y, r, c0, a) { a *= GLOW_A; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c0, a)); g.addColorStop(1, rgba(c0, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
function drawNightLights(t) {
  const night = clamp((0.75 - S.light) / 0.4, 0, 1);
  if (night <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  if (!occluded(...CW([0, 0, 0.6]))) { const [gx, gy] = P(...CW([0.2, 0, 0.55])); glow(gx, gy, TW * cam.zoom * 0.45, [140, 186, 255], 0.3 * night); } // laptop screen
  for (const m of MARKS) for (const w of (m.glowW || [])) {
    if (occluded(w[0], w[1], w[2])) continue;
    // the cabin's windows and the pavilion's lamp only spill a soft light, so walls still read as walls and the pond stays dark
    const soft = m.kind === "cabin" || m.kind === "pavilion", [x, y, f] = P(...w), r = TW * f * cam.zoom * (m.kind === "pavilion" ? 0.6 : soft ? 0.42 : 0.55);
    glow(x, y, r, [255, 180, 90], (soft ? 0.22 : 0.38) * night);
  }
  if (SEASON !== "winter") for (const f of flies) {
    const x = f.i + Math.sin(t * 0.0004 * f.sp + f.ph) * 0.6, y = f.j + Math.cos(t * 0.0003 * f.sp + f.ph * 1.3) * 0.6;
    const z = f.h + Math.sin(t * 0.001 + f.ph) * 0.3, [sx, sy] = P(x, y, z);
    // fade out behind the mountain or a hill instead of shining through it
    f.vis = lerp(f.vis ?? 1, occluded(x, y, z) ? 0 : 1, 0.15);
    if (f.vis < 0.02) continue;
    glow(sx, sy, 7 * GLOW_K, [220, 255, 150], f.vis * night * (0.4 + 0.6 * Math.max(0, Math.sin(t * 0.003 * f.sp + f.ph))));
  }
  if (!occluded(...RUNWAY.c, RUNWAY.h + 0.3)) {
    const tp = P(TOWER[0], TOWER[1], hf(...TOWER) + 1.6);
    if (Math.sin(t * 0.004) > 0.2) glow(tp[0], tp[1], TW * 0.5, [255, 70, 50], 0.8 * night);
    for (let q = 0; q <= 8; q++) for (const sd of [-1, 1]) {
      const m = q / 8, x = lerp(RUNWAY.a[0], RUNWAY.b[0], m) + RUNWAY.rad[0] * RW * 1.15 * sd, y = lerp(RUNWAY.a[1], RUNWAY.b[1], m) + RUNWAY.rad[1] * RW * 1.15 * sd;
      const [sx, sy] = P(x, y, RUNWAY.h + 0.05); glow(sx, sy, 5 * GLOW_K, [255, 200, 120], 0.8 * night);
    }
  }
  if (!occluded(LAKE.cx, LAKE.cy, WATER_H + 0.2)) for (const f of koi) if (f.sx) glow(f.sx, f.sy, TW * 0.3, [255, 180, 120], 0.07 * night); // faint, so a school of koi doesn't stack into a hot spot
  ctx.restore();
}

// ---------- scene ----------
function renderScene(t) {
  projectVerts();
  const byKey = (a, b) => a[0] - b[0];
  // underside of the floating island, then the pond bed and far shore, then the water
  under.map(tr => [depthKey(tr.cx, tr.cy, tr.ch), tr]).sort(byKey).forEach(([, tr]) => drawTri(tr));
  const lakeKey = depthKey(LAKE.cx, LAKE.cy, WATER_H);
  const items = [], early = [];
  for (const tr of tris) {
    const k = depthKey(tr.cx, tr.cy, tr.ch);
    if (tr.role === "bed" || (tr.role === "shore" && k < lakeKey)) early.push([k, tr]);
    else items.push([k, () => drawTri(tr)]);
  }
  early.sort(byKey).forEach(([, tr]) => drawTri(tr));
  drawLakeSurface();
  drawWater(t);
  const bias = 0.35;
  for (const tr of trees) items.push([depthKey(tr.i, tr.j, tr.h) + bias, () => drawTreeCached(tr)]);
  for (const m of MARKS) items.push([depthKey(m.i + 0.5, m.j + 0.5, m.h) + bias + 0.1, () => drawMark(m)]);
  for (const f of koi) items.push([depthKey(f.x, f.y, WATER_H) + 0.05, () => { if (SEASON === "winter") ctx.globalAlpha = 0.45; drawKoi(f); ctx.globalAlpha = 1; }]);
  for (let k = 0; k < RIBBON.length - 1; k++) { const a = RIBBON[k], b = RIBBON[k + 1]; items.push([depthKey((a.x + b.x) / 2, (a.y + b.y) / 2, (a.h + b.h) / 2) + 0.3, () => drawRibbonSeg(k, t)]); }
  const RN = 10;
  // flat ground decals sort by their front-most corner so the terrain under them never paints over
  const frontKey = (pts, h) => Math.max(...pts.map(([x, y]) => depthKey(x, y, h)));
  let rk;
  { const { a, b, rad } = RUNWAY, w = 0.3; rk = frontKey([[a[0] + rad[0] * w, a[1] + rad[1] * w], [a[0] - rad[0] * w, a[1] - rad[1] * w], [b[0] + rad[0] * w, b[1] + rad[1] * w], [b[0] - rad[0] * w, b[1] - rad[1] * w]], RUNWAY.h) + 0.05;
    items.push([rk, () => { for (let q = 0; q < RN; q++) drawRunwaySeg(q, RN); }]); RWY_KEY = rk; }
  items.push([Math.max(depthKey(TOWER[0], TOWER[1], RUNWAY.h) + bias, rk + 0.01), drawTower]); // stands beside the runway, so never under it
  items.push([frontKey([[-0.6, -0.55], [0.8, -0.55], [0.8, 0.55], [-0.6, 0.55]].map(([u, v]) => CW([u, v, 0])), CAVE.h) + 0.05, () => drawMe(t)]);
  for (const s2 of STONES) items.push([depthKey(s2.x, s2.y, s2.h) + 0.25, () => drawStone(s2)]);
  items.push([depthKey(DOCK.x + DOCK.ax * 0.4, DOCK.y + DOCK.ay * 0.4, WATER_H) + 0.35, drawDockParts]);
  const zk = frontKey([[ZEN.x0 - 0.1, ZEN.y0 - 0.1], [ZEN.x1 + 0.1, ZEN.y0 - 0.1], [ZEN.x1 + 0.1, ZEN.y1 + 0.1], [ZEN.x0 - 0.1, ZEN.y1 + 0.1]], ZEN.h) + 0.05;
  items.push([zk, () => { drawZen(t); ZEN_ROCKS.map((r, k) => [depthKey(r[0], r[1], ZEN.h), k]).sort((a, b) => a[0] - b[0]).forEach(([, k]) => drawZenRock(k)); drawZenFront(); }]);
  for (const f of foxes) items.push([depthKey(f.x, f.y, hf(f.x, f.y)) + bias, () => drawFox(f)]);
  if (SEASON === "autumn") for (const b of bears) items.push([depthKey(b.x, b.y, hf(b.x, b.y)) + bias, () => drawBear(b)]);
  if (SEASON === "spring") for (const r of rabbits) items.push([depthKey(r.x, r.y, hf(r.x, r.y)) + bias, () => drawRabbit(r)]);
  if (SEASON === "summer") for (const [d, o] of [[doe, { antlers: false, ears: true, fur: [168, 112, 70], furD: [130, 84, 52] }], [fawn, { antlers: false, ears: true, spots: true, scale: 0.65, fur: [184, 124, 78], furD: [146, 96, 60] }]]) items.push([depthKey(d.x, d.y, hf(d.x, d.y)) + bias, () => drawReindeer(d, o)]);
  if (SEASON === "winter") for (const r of reindeer) items.push([depthKey(r.x, r.y, hf(r.x, r.y)) + bias, () => drawReindeer(r)]);
  const pp = planePose(), pg = groundAt(pp.x, pp.y), airborne = pg === null || pp.h - pg > 1.2;
  if (!airborne) items.push([Math.max(depthKey(pp.x, pp.y, pp.h) + bias + 0.1, rk + 0.01), drawPlane]);
  seasonalItems(items, t, bias); moreSeasonalItems(items, t, bias);
  items.sort(byKey);
  for (const it of items) it[1]();
  if (airborne) drawPlane();
}


// ---------- tags (HTML buttons over the scene) ----------
const tagsEl = document.getElementById("tags");
const TAGS = [...MARKS.map(m => ({ key: m.key, label: m.label, m })), { key: "projects", label: "Projects", pond: true }];
for (const t of TAGS) {
  const b = document.createElement("button"); b.className = "tag-btn"; b.textContent = t.label; b.type = "button";
  b.addEventListener("click", e => { e.stopPropagation(); openPlace(t.key); });
  t.el = b; tagsEl.appendChild(b);
}
function occluded(x, y, h) {
  for (let d = 0.45; d < 18; d += 0.35) {
    const px = x + V[0] * d, py = y + V[1] * d, ph = h + V[2] * d / ZU;
    if (ph > 11) return false;
    if (insideIsland(px, py) && hf(px, py) > ph) return true;
  }
  return false;
}
function placeTags() {
  for (const t of TAGS) {
    let x, y, hidden;
    if (t.pond) {
      [x, y] = P(LAKE.cx, LAKE.cy, WATER_H + 1.1);
      hidden = occluded(LAKE.cx, LAKE.cy, WATER_H + 0.2);
    } else if (t.m.topW) {
      [x, y] = P(...t.m.topW);
      hidden = occluded(t.m.i + 0.5, t.m.j + 0.5, t.m.h + 1.1);
    } else continue;
    // a label whose place is hidden behind the mountain hides with it
    if (hidden !== t.far) { t.far = hidden; t.el.classList.toggle("far", hidden); t.el.tabIndex = hidden ? -1 : 0; }
    t.el.style.left = x.toFixed(1) + "px"; t.el.style.top = y.toFixed(1) + "px";
  }
}

// ---------- pointer: drag to turn, tap to interact ----------
const tip = document.getElementById("tip");
const hint = document.getElementById("hint");
function koiAt(x, y) { let best = null, bd = Math.max(16, TW * 0.32); for (const f of koi) { const d = Math.hypot((f.sx || -99) - x, (f.sy || -99) - y); if (d < bd) { bd = d; best = f; } } return best; }
function markAt(x, y) {
  for (const m of MARKS) { const [cx, cy, f] = P(m.i + 0.5, m.j + 0.5, m.h + 0.8); if (Math.hypot(x - cx, (y - cy) * 0.8) < TW * 0.75 * f * cam.zoom) return m; }
  return null;
}
let drag = null, mouse = [-1, -1];
// two fingers pinch to zoom and slide together to pan; once two fingers are down, nothing else fires until every finger lifts
const ZOOM_MIN = 0.7, ZOOM_MAX = 2.5;
const touches = new Map();
let pinch = null, mpan = null, panX = 0, panY = 0;
const pinchDist = () => { const [a, b] = [...touches.values()]; return Math.max(1, Math.hypot(a[0] - b[0], a[1] - b[1])); };
const pinchMid = () => { const [a, b] = [...touches.values()]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
const setPan = (x, y) => { panX = clamp(x, -W * 0.45, W * 0.45); panY = clamp(y, -H * 0.35, H * 0.35); };
// on desktop the middle mouse button (or Shift + drag, for trackpads) pans
cv.addEventListener("mousedown", e => { if (e.button === 1) e.preventDefault(); }); // no autoscroll
cv.addEventListener("pointerdown", e => {
  if (e.pointerType === "mouse" && (e.button === 1 || (e.button === 0 && e.shiftKey))) {
    e.preventDefault();
    if (camFocus.on) return;
    try { cv.setPointerCapture(e.pointerId); } catch (_) {}
    mpan = { id: e.pointerId, x: e.clientX, y: e.clientY, px: panX, py: panY }; holdYaw = null; cam.yawV = 0; tip.hidden = true; cv.style.cursor = "move";
    return;
  }
  if (e.pointerType === "touch") touches.set(e.pointerId, [e.clientX, e.clientY]);
  if (touches.size === 2) {
    for (const id of touches.keys()) try { cv.setPointerCapture(id); } catch (_) {}
    const [mx, my] = pinchMid(); pinch = { d: pinchDist(), z: VIEWS[view].zoomUser || 1, mx, my, px: panX, py: panY }; drag = null; cam.yawV = 0; tip.hidden = true;
    return;
  }
  if (pinch) return;
  holdYaw = null;
  drag = { id: e.pointerId, x: e.clientX, y: e.clientY, lx: e.clientX, lt: performance.now(), yaw: cam.yaw, pitch: cam.pitch, moved: false };
  cam.yawV = 0;
});
cv.addEventListener("pointermove", e => {
  const x = e.clientX, y = e.clientY;
  if (touches.has(e.pointerId)) touches.set(e.pointerId, [x, y]);
  if (mpan) { if (mpan.id === e.pointerId) setPan(mpan.px + x - mpan.x, mpan.py + y - mpan.y); return; }
  if (pinch) {
    if (touches.size === 2) {
      VIEWS[view].zoomUser = clamp(pinch.z * pinchDist() / pinch.d, ZOOM_MIN, ZOOM_MAX);
      if (!camFocus.on) { const [mx, my] = pinchMid(); setPan(pinch.px + mx - pinch.mx, pinch.py + my - pinch.my); }
    }
    return;
  }
  if (drag && drag.id === e.pointerId) {
    const dx = x - drag.x, dy = y - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 5) { drag.moved = true; try { cv.setPointerCapture(e.pointerId); } catch (_) {} cv.style.cursor = "grabbing"; tip.hidden = true; hint.classList.add("seen"); }
    if (drag.moved && camFocus.on) { cv.style.cursor = "default"; return; } // zoomed in on a place: no spinning
    if (drag.moved) {
      const now = performance.now(), k = 0.0085;
      cam.yaw = drag.yaw - dx * k;
      cam.yawV = -(x - drag.lx) * k / Math.max(0.008, (now - drag.lt) / 1000);
      drag.lx = x; drag.lt = now;
      if (view === "persp") cam.pitch = clamp(drag.pitch + dy * 0.005, 0.1, 1.25);
      return;
    }
  }
  if (mouse[0] >= 0) windX += (x - mouse[0]) * 0.8;
  mouse = [x, y];
  for (const fx of foxes) if (fx.sx && Math.hypot(fx.sx - x, fx.sy - y) < TW * 0.9 && fx.scared <= 0) { fx.scared = 1.4; foxTarget(fx, true, Math.atan2(fx.y - unproject(x, y, 2)[1], fx.x - unproject(x, y, 2)[0])); }
  const f = koiAt(x, y), m = f ? null : markAt(x, y);
  koi.forEach(k => k.hover = k === f);
  TAGS.forEach(t => t.el.classList.toggle("hot", !!m && t.m === m));
  if (f) { tip.hidden = false; tip.innerHTML = `${esc(f.p.title)}<small>${f.p.when}</small>`; tip.style.left = x + "px"; tip.style.top = y + "px"; }
  else tip.hidden = true;
  const [wi, wj] = unproject(x, y, WATER_H);
  cv.style.cursor = (f || m || inPond(wi, wj, 0.95) || planeAt(x, y) || caveAt(x, y)) ? "pointer" : camFocus.on ? "default" : "grab";
});
function endDrag(e) {
  touches.delete(e.pointerId);
  if (mpan) { if (mpan.id === e.pointerId) { mpan = null; releasedAt = performance.now(); cv.style.cursor = "grab"; } return; }
  if (pinch) { releasedAt = performance.now(); if (!touches.size) pinch = null; return; }
  if (!drag || drag.id !== e.pointerId) return;
  const wasDrag = drag.moved, still = performance.now() - drag.lt > 80; drag = null; cv.style.cursor = "grab";
  if (wasDrag) { releasedAt = performance.now(); if (still) cam.yawV = 0; cam.yawV = clamp(cam.yawV, -6, 6); return; }
  if (e.type === "pointerup") tap(e.clientX, e.clientY);
}
cv.addEventListener("pointerup", endDrag);
cv.addEventListener("pointercancel", endDrag);
cv.addEventListener("pointerleave", () => { if (!drag) { tip.hidden = true; koi.forEach(k => k.hover = false); mouse = [-1, -1]; } });
function planeAt(x, y) {
  if (plane.mode === "flying" || !plane.sx) return false;
  const c = P(...RUNWAY.c, RUNWAY.h);
  return (Math.hypot(plane.sx - x, plane.sy - y) < TW * 0.7 || Math.hypot(c[0] - x, c[1] - y) < TW * 1.2) && !occluded(...RUNWAY.c, RUNWAY.h + 0.3);
}
function tap(x, y) {
  if (planeAt(x, y)) return launchPlane();
  if (caveAt(x, y)) return visitCave();
  for (const fx of foxes) if (fx.sx && Math.hypot(fx.sx - x, fx.sy - y) < TW * 0.6) { fx.hop = 1; fx.scared = 1.6; foxTarget(fx, true); return; }
  const f = koiAt(x, y); if (f) return openProject(f.p.id);
  const m = markAt(x, y); if (m) return openPlace(m.key);
  const [wi, wj] = unproject(x, y, WATER_H);
  if (inPond(wi, wj, 0.95) && SEASON !== "winter") {
    ripples.push({ x: wi, y: wj, r: 0, a: 0.8 });
    for (let k = 0; k < 4; k++) food.push({ x: wi + (Math.random() - 0.5) * 0.35, y: wj + (Math.random() - 0.5) * 0.35, t: 0 });
    return;
  }
  if (camFocus.on) { closeDrawer(); return; }
  let best = null, bd = TW * 1.2;
  for (const t of maples) { const [tx, ty] = P(t.i, t.j, t.h + t.crown); const d = Math.hypot(tx - x, ty - y); if (d < bd) { bd = d; best = t; } }
  if (best) for (let k = 0; k < 12; k++) spawnLeaf(best);
}
cv.addEventListener("wheel", e => { e.preventDefault(); VIEWS[view].zoomUser = clamp((VIEWS[view].zoomUser || 1) * Math.exp(-e.deltaY * 0.001), ZOOM_MIN, ZOOM_MAX); }, { passive: false });
let holdYaw = null;
document.querySelectorAll(".chip[data-view]").forEach(b => b.addEventListener("click", () => setView(b.dataset.view)));
function setSeason(v) {
  SEASON = v;
  for (const t of tris) triPrep(t, false);
  applyTreeSeason();
  leaves.length = 0;
  document.querySelectorAll(".chip[data-season]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.season === v)));
}
document.querySelectorAll(".chip[data-season]").forEach(b => b.addEventListener("click", () => setSeason(b.dataset.season)));
document.querySelectorAll(".chip[data-season]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.season === SEASON)));
window.__season = setSeason;
function setView(v) {
  view = v;
  document.querySelectorAll(".chip[data-view]").forEach(b => b.setAttribute("aria-pressed", b.dataset.view === v ? "true" : "false"));
}
// after letting go the island glides to a stop and stays put for a few seconds, then eases back to its home angle and position together
const HOME_YAW = Math.PI / 4, HOME_DELAY = 5000;
let releasedAt = -Infinity;
const homeYaw = y => HOME_YAW + Math.round((y - HOME_YAW) / (Math.PI * 2)) * Math.PI * 2;
function stepCamera(dt) {
  const tv = VIEWS[view], k = 1 - Math.pow(0.004, dt);
  // a press that hasn't moved yet (a click or tap) keeps the island where it is instead of starting the trip home
  const resting = (!drag || !drag.moved) && !pinch && !mpan && !camFocus.on && performance.now() - releasedAt < HOME_DELAY;
  if (resting) { cam.yaw += cam.yawV * dt; cam.yawV *= Math.pow(0.02, dt); } else if (!drag) cam.yawV = 0;
  if (!(drag && drag.moved && view === "persp") && !resting) cam.pitch = lerp(cam.pitch, tv.pitch, k);
  cam.persp = lerp(cam.persp, tv.persp, k);
  camFocus.amt = lerp(camFocus.amt, camFocus.on ? 1 : 0, 1 - Math.pow(0.02, dt));
  { const g = 1 - Math.pow(0.06, dt); camFocus.x = lerp(camFocus.x, camFocus.tx, g); camFocus.y = lerp(camFocus.y, camFocus.ty, g); camFocus.h = lerp(camFocus.h, camFocus.th, g); }
  const narrowF = W < 640, fz = 1 + (narrowF ? 0.7 : 0.85) * camFocus.amt;
  cam.zoom = lerp(cam.zoom, tv.zoom * (tv.zoomUser || 1) * fz, k);
  const homing = !(drag && drag.moved) && !pinch && !mpan && !resting;
  if (homing) cam.yaw = holdYaw !== null ? holdYaw : lerp(cam.yaw, homeYaw(cam.yaw), 1 - Math.pow(0.03, dt));
  if (homing || camFocus.on) { const g = 1 - Math.pow(0.03, dt); panX = lerp(panX, 0, g); panY = lerp(panY, 0, g); }
  camUpdate();
  // slide the island so the focused place sits in the middle of what the drawer leaves visible
  OX = BASE_OX + panX; OY = BASE_OY + panY;
  if (camFocus.amt > 0.001) {
    const [fx, fy] = P(camFocus.x, camFocus.y, camFocus.h), narrowF = W < 640;
    const tx = narrowF ? W / 2 : (W - Math.min(440, W)) / 2, ty = narrowF ? H * 0.13 : H * 0.56;
    OX = BASE_OX + panX + (tx - fx) * camFocus.amt; OY = BASE_OY + panY + (ty - fy) * camFocus.amt;
  }
}

const toast = document.getElementById("toast");
let toastTimer = 0;
function showToast(html) { toast.innerHTML = html; toast.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.hidden = true, 11000); }
toast.addEventListener("click", e => {
  const pr = e.target.closest("[data-proj]"); if (pr) { toast.hidden = true; openProject(pr.dataset.proj); }
  const pl = e.target.closest("[data-place]"); if (pl) { toast.hidden = true; openPlace(pl.dataset.place); }
});
// ---------- seasonal extras ----------
let sd2 = 20251; const r2 = () => (sd2 = (sd2 * 16807) % 2147483647, (sd2 - 1) / 2147483646);
function okGround(x, y) {
  if (!insideIsland(x, y, 0.9) || lakeD(x, y) < 1.45 || riverInfo(x, y)[0] < 0.45 || runwayD(x, y) < 0.5 || zenD(x, y) < 0.25 || Math.hypot(x - CAVE.x, y - CAVE.y) < 1.4) return false;
  if (MARKS.some(m => Math.hypot(m.i + 0.5 - x, m.j + 0.5 - y) < 0.8)) return false;
  const h = hf(x, y); return h > WATER_H + 0.2 && h < 4.6;
}
function scatter(n, minGap) {
  const out = [];
  for (let k = 0; k < n * 40 && out.length < n; k++) { const x = r2() * N, y = r2() * N; if (okGround(x, y) && !out.some(q => Math.hypot(q.x - x, q.y - y) < minGap) && !trees.some(t => Math.hypot(t.i - x, t.j - y) < 0.28)) out.push({ x, y, h: hf(x, y), s: r2(), a: r2() * 6.28 }); }
  return out;
}
// spring flowers
const FLOWER_COLS = [[248, 150, 190], [255, 214, 90], [250, 250, 246], [186, 140, 230], [255, 140, 110]];
const FLOWERS = scatter(90, 0.3).map(f => ({ ...f, col: FLOWER_COLS[(f.s * FLOWER_COLS.length) | 0] }));
function drawFlower(f) {
  const u = TW * cam.zoom * 0.05;
  for (let q = 0; q < 3; q++) {
    const a = f.a + q * 2.1, [x, y] = P(f.x + Math.cos(a) * 0.07, f.y + Math.sin(a) * 0.07, f.h + 0.02);
    ctx.strokeStyle = rgb(lit([92, 140, 70])); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - u * 1.2); ctx.stroke();
    ctx.fillStyle = rgb(lit(f.col)); ctx.beginPath(); ctx.arc(x, y - u * 1.3, Math.max(1.3, u * 0.55), 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgb(lit([255, 220, 120])); ctx.beginPath(); ctx.arc(x, y - u * 1.3, Math.max(0.6, u * 0.2), 0, Math.PI * 2); ctx.fill();
  }
}
// butterflies drift between flowers by day
let RWY_KEY = 0; // set each frame in renderScene so things flying over the runway draw above it
const BUTTERFLY_COLS = [[255, 170, 60], [140, 190, 255], [250, 214, 60], [240, 120, 180]];
const butterflies = Array.from({ length: 10 }, (_, k) => { const f = FLOWERS[(k * 7) % Math.max(1, FLOWERS.length)] || { x: 9, y: 12, h: 2 }; return { x: f.x, y: f.y, z: f.h + 0.5, t: null, ph: k, col: BUTTERFLY_COLS[k % 4] }; });
function stepButterflies(dt) {
  for (const b of butterflies) {
    if (!b.t || Math.hypot(b.t.x - b.x, b.t.y - b.y) < 0.15) b.t = FLOWERS[(Math.random() * FLOWERS.length) | 0] || b.t;
    if (!b.t) continue;
    const dx = b.t.x - b.x, dy = b.t.y - b.y, d = Math.hypot(dx, dy) || 1;
    b.ph += dt * 14; b.x += (dx / d * 0.45 + Math.sin(b.ph * 0.17) * 0.3) * dt; b.y += (dy / d * 0.45 + Math.cos(b.ph * 0.13) * 0.3) * dt;
    b.z = lerp(b.z, (groundAt(b.x, b.y) ?? b.t.h) + 0.45 + Math.sin(b.ph * 0.2) * 0.2, dt * 2);
  }
}
function drawButterfly(b) {
  const [x, y] = P(b.x, b.y, b.z), u = TW * cam.zoom * 0.1, w = Math.abs(Math.sin(b.ph)) * 0.9 + 0.1;
  ctx.fillStyle = rgb(lit(b.col));
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + sd * u * 0.55 * w, y - u * 0.2, u * 0.6 * w, u * 0.5, sd * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(x + sd * u * 0.4 * w, y + u * 0.35, u * 0.4 * w, u * 0.32, -sd * 0.3, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = rgb(lit([50, 40, 40])); ctx.fillRect(x - 0.7, y - u * 0.5, 1.4, u);
}
// autumn: fallen leaves under the trees and across the meadow, pumpkins by the buildings
const FALLEN = [];
for (const t of trees) if (t.blobs.length && t.kind !== "bush") for (let q = 0; q < 7; q++) { const a = r2() * 6.28, r = 0.15 + r2() * 0.6, x = t.i + Math.cos(a) * r, y = t.j + Math.sin(a) * r; if (insideIsland(x, y, 0.95) && lakeD(x, y) > 1.3) FALLEN.push({ x, y, h: hf(x, y), a: r2() * 6.28, b: t.blobs[q % t.blobs.length] }); }
for (const f of scatter(60, 0.2)) FALLEN.push({ ...f, b: [0, 0, 0, null] });
const LEAF_FALL_COLS = [[214, 84, 32], [232, 140, 44], [186, 54, 30], [240, 182, 58]];
function drawFallen(f) {
  const [x, y] = P(f.x, f.y, f.h + 0.015), u = TW * cam.zoom * 0.06;
  ctx.fillStyle = rgb(lit(f.b[5] || LEAF_FALL_COLS[((f.a * 10) | 0) % 4], 0.92));
  ctx.beginPath(); ctx.ellipse(x, y, u, u * 0.3, Math.sin(f.a) * 0.5, 0, Math.PI * 2); ctx.fill();
}
const PUMPKIN_SPOTS = [[16.2, 11.3, 1.1], [16.25, 11.75, 0.8], [16.0, 12.05, 0.9], [13.2, 9.35, 0.9], [13.25, 9.75, 0.7], [6.25, 14.75, 1], [6.05, 14.35, 0.8], [14.2, 6.95, 0.9]];
const PUMPKINS = PUMPKIN_SPOTS.filter(([x, y]) => insideIsland(x, y, 0.95) && hf(x, y) > WATER_H + 0.15 && lakeD(x, y) > 1.1).map(([x, y, sc], k) => ({ x, y, h: hf(x, y), sc, carved: k === 0 || isHalloween() }));
function drawPumpkin(p) {
  const [x, y, f] = P(p.x, p.y, p.h), r = TW * f * cam.zoom * 0.1 * p.sc;
  ctx.fillStyle = rgba([0, 0, 0], 0.15 * S.light); ctx.beginPath(); ctx.ellipse(x, y, r * 1.2, r * 0.4, 0, 0, Math.PI * 2); ctx.fill();
  for (const [dx, sc, k] of [[-0.45, 0.7, 0.85], [0.45, 0.7, 0.85], [0, 0.85, 1.05]]) { ctx.fillStyle = rgb(lit([228, 118, 34], k)); ctx.beginPath(); ctx.ellipse(x + dx * r, y - r * 0.75, r * sc, r * 0.78, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.strokeStyle = rgb(lit([92, 112, 52])); ctx.lineWidth = Math.max(1.5, r * 0.18); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y - r * 1.45); ctx.lineTo(x + r * 0.15, y - r * 1.85); ctx.stroke();
  if (p.carved) {
    const lit2 = S.light < 0.7, c = lit2 ? "rgba(255,200,90,0.95)" : "rgba(60,30,20,0.85)";
    ctx.fillStyle = c;
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + sd * r * 0.35, y - r * 1.05); ctx.lineTo(x + sd * r * 0.15, y - r * 0.8); ctx.lineTo(x + sd * r * 0.5, y - r * 0.8); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(x - r * 0.45, y - r * 0.55); ctx.quadraticCurveTo(x, y - r * 0.2, x + r * 0.45, y - r * 0.55); ctx.lineTo(x, y - r * 0.42); ctx.fill();
    if (lit2) { ctx.save(); ctx.globalCompositeOperation = "lighter"; glow(x, y - r * 0.7, r * 2, [255, 160, 60], 0.25); ctx.restore(); }
  }
}
// winter: a Christmas tree by the cabin, lights on the eaves, skaters on the pond
const XMAS = (() => {
  const m = MARKS[0], cx = m.i + 0.5, cy = m.j + 0.5;
  for (let r = 1.3; r < 3; r += 0.2) for (let k = 0; k < 16; k++) {
    const a = Math.PI / 4 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 0.35, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    if (insideIsland(x, y, 0.9) && lakeD(x, y) > 1.35 && hf(x, y) > WATER_H + 0.2 && !trees.some(t => Math.hypot(t.i - x, t.j - y) < 0.5) && runwayD(x, y) > 0.6) return { i: x, j: y, h: hf(x, y), kind: "pine", s: 1.15, lean: 0, layers: 4, pcol: [40, 96, 64], pcol0: [40, 96, 64], blobs: [], crown: 1.6 };
  }
  return null;
})();
const BAUBLE_COLS = [[230, 50, 50], [250, 200, 60], [70, 140, 240], [240, 240, 250]];
function drawXmasTree(t) {
  drawTree(t);
  const [x, y, f] = P(t.i, t.j, t.h), s = t.s * TW * f * cam.zoom, k = t.s * 2.78, L = t.layers, up = z => P(t.i, t.j, t.h + z * k);
  if (cosP < 0.35) return;
  const now = performance.now(), night = S.light < 0.7;
  for (let q = 0; q < L; q++) {
    const sp = 0.6 / L, b = up(0.12 + q * sp), w = s * (0.27 - q * (0.18 / L));
    for (let n = 0; n < 3; n++) {
      const bx = b[0] + (n - 1) * w * 0.55, by = b[1] - s * 0.03 - (n === 1 ? s * 0.04 : 0), col = BAUBLE_COLS[(q * 3 + n) % 4];
      const tw = night ? 0.6 + 0.4 * Math.sin(now * 0.004 + q * 2 + n) : 1;
      ctx.fillStyle = rgba(night ? col : lit(col), tw); ctx.beginPath(); ctx.arc(bx, by, Math.max(1.5, s * 0.028), 0, Math.PI * 2); ctx.fill();
      if (night) { ctx.save(); ctx.globalCompositeOperation = "lighter"; glow(bx, by, s * 0.1, col, 0.35 * tw); ctx.restore(); }
    }
  }
  const top = up(0.12 + 0.6 + 0.36 * 3 / L + 0.04 - 0.6 / L), r = Math.max(3, s * 0.07);
  ctx.fillStyle = "#ffd75e"; ctx.beginPath();
  for (let q = 0; q < 10; q++) { const a = -Math.PI / 2 + q * Math.PI / 5, rr = q % 2 ? r * 0.45 : r; ctx.lineTo(top[0] + Math.cos(a) * rr, top[1] - r * 0.4 + Math.sin(a) * rr); }
  ctx.fill();
  if (night) { ctx.save(); ctx.globalCompositeOperation = "lighter"; glow(top[0], top[1] - r * 0.4, s * 0.3, [255, 220, 120], 0.5); ctx.restore(); }
}
const LIGHT_COLS = [[255, 70, 60], [80, 220, 120], [255, 210, 80], [90, 160, 255]];
function drawEaveLights() {
  const m = MARKS[0], { i, j, h } = m, zr = h + 1.08, X0 = i + 0.02, X1 = i + 1.02, Y = V[1] > 0 ? j + 0.95 : j + 0.05;
  const now = performance.now(), night = S.light < 0.7;
  for (let q = 0; q <= 12; q++) {
    const x = lerp(X0, X1, q / 12), [sx, sy] = P(x, Y, zr - Math.sin(q / 12 * Math.PI * 4) ** 2 * 0.05), col = LIGHT_COLS[q % 4];
    const tw = 0.55 + 0.45 * Math.sin(now * 0.003 + q * 1.3);
    ctx.fillStyle = rgba(col, night ? 0.5 + 0.35 * tw : 0.9); ctx.beginPath(); ctx.arc(sx, sy, Math.max(1.2, TW * cam.zoom * 0.02), 0, Math.PI * 2); ctx.fill();
    if (night) { ctx.save(); ctx.globalCompositeOperation = "lighter"; glow(sx, sy, TW * cam.zoom * 0.07, col, 0.16 * tw); ctx.restore(); }
  }
}
const SKATERS = [{ off: 0, coat: [200, 50, 50], hat: [240, 240, 240] }, { off: Math.PI * 0.9, coat: [60, 110, 200], hat: [230, 180, 60] }];
function skaterPos(sk, t) { const a = t * 0.00032 + sk.off; return [LAKE.cx + Math.cos(a) * LAKE.rx * 0.42, LAKE.cy + Math.sin(2 * a) * LAKE.ry * 0.28]; }
function drawSkater(sk, t) {
  const [wx, wy] = skaterPos(sk, t), [nx, ny] = skaterPos(sk, t + 60), [x, y, f] = P(wx, wy, WATER_H), [x2] = P(nx, ny, WATER_H);
  const u = TW * f * cam.zoom * 0.2, face = x2 >= x ? 1 : -1, glide = Math.sin(t * 0.004 + sk.off);
  ctx.fillStyle = rgba([0, 0, 0], 0.15); ctx.beginPath(); ctx.ellipse(x, y, u * 0.5, u * 0.15, 0, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.translate(x, y); ctx.scale(face, 1); ctx.rotate(0.12);
  ctx.lineCap = "round"; ctx.strokeStyle = rgb(lit([40, 40, 52])); ctx.lineWidth = Math.max(1.4, u * 0.16);
  ctx.beginPath(); ctx.moveTo(0, -u * 0.9); ctx.lineTo(-u * 0.15 + glide * u * 0.25, -u * 0.05); ctx.moveTo(0, -u * 0.9); ctx.lineTo(u * 0.2 - glide * u * 0.35, -u * 0.12 - Math.max(0, -glide) * u * 0.25); ctx.stroke();
  ctx.strokeStyle = "#c9d2dc"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-u * 0.32 + glide * u * 0.25, 0); ctx.lineTo(u * 0.05 + glide * u * 0.25, 0); ctx.stroke();
  ctx.fillStyle = rgb(lit(sk.coat)); ctx.beginPath(); ctx.ellipse(0, -u * 1.25, u * 0.28, u * 0.45, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = rgb(lit(sk.coat)); ctx.lineWidth = Math.max(1.3, u * 0.13); ctx.beginPath(); ctx.moveTo(-u * 0.15, -u * 1.45); ctx.lineTo(-u * 0.7, -u * 1.25 + glide * u * 0.1); ctx.moveTo(u * 0.15, -u * 1.45); ctx.lineTo(u * 0.7, -u * 1.6 - glide * u * 0.1); ctx.stroke();
  ctx.fillStyle = rgb(lit([238, 198, 162])); ctx.beginPath(); ctx.arc(0, -u * 1.95, u * 0.24, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgb(lit(sk.hat)); ctx.beginPath(); ctx.arc(0, -u * 2.05, u * 0.24, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.arc(0, -u * 2.33, u * 0.09, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgb(lit([250, 250, 250])); ctx.fillRect(-u * 0.24, -u * 1.75, u * 0.48, u * 0.09);
  ctx.restore();
}
// summer: birds by day, fireworks by night
const BIRDS = Array.from({ length: 7 }, (_, k) => ({ k, ox: [0, -0.5, -0.5, -1, -1, -1.5, -1.5][k], oy: [0, -0.45, 0.45, -0.9, 0.9, -1.35, 1.35][k] }));
function drawBirds(t) {
  if (S.light < 0.6) return;
  const a = t * 0.00009, R = 8.5, cx = ICX + Math.cos(a) * R, cy = ICY + Math.sin(a) * R, d = [-Math.sin(a), Math.cos(a)], nrm = [Math.cos(a), Math.sin(a)];
  ctx.strokeStyle = rgba(lit([50, 50, 62]), 0.85); ctx.lineCap = "round"; ctx.lineJoin = "round";
  for (const b of BIRDS) {
    const wx = cx + d[0] * b.ox * 0.9 + nrm[0] * b.oy * 0.6, wy = cy + d[1] * b.ox * 0.9 + nrm[1] * b.oy * 0.6, [x, y] = P(wx, wy, 14 + Math.sin(t * 0.001 + b.k) * 0.3);
    const u = TW * cam.zoom * 0.17, fl = Math.sin(t * 0.012 + b.k * 0.9) * 0.6;
    ctx.lineWidth = Math.max(1.2, u * 0.18); ctx.beginPath(); ctx.moveTo(x - u, y - u * fl); ctx.quadraticCurveTo(x - u * 0.4, y - u * 0.4, x, y); ctx.quadraticCurveTo(x + u * 0.4, y - u * 0.4, x + u, y - u * fl); ctx.stroke();
  }
}
const bursts = [];
const FW_COLS = [[255, 90, 90], [255, 210, 90], [120, 200, 255], [190, 140, 255], [140, 255, 170], [255, 150, 210]];
function stepFireworks(dt) {
  const night = clamp((0.7 - S.light) / 0.3, 0, 1);
  if ((SEASON === "summer" || isNewYear()) && night > 0.4 && !reduceMotion && bursts.length < 6 && Math.random() < dt * 0.9) {
    const a = Math.random() * 6.28, r = Math.random() * 5;
    bursts.push({ x: ICX + Math.cos(a) * r, y: ICY + Math.sin(a) * r, h0: 3, h1: 10.5 + Math.random() * 2.5, t: 0, col: FW_COLS[(Math.random() * FW_COLS.length) | 0], parts: Array.from({ length: 46 }, (_, k) => { const an = k / 46 * 6.28 + Math.random() * 0.1, sp = 0.8 + Math.random() * 0.4; return [Math.cos(an) * sp, Math.sin(an) * sp]; }) });
  }
  for (let k = bursts.length - 1; k >= 0; k--) { bursts[k].t += dt; if (bursts[k].t > 2.6) bursts.splice(k, 1); }
}
function drawFireworks() {
  if (!bursts.length) return;
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (const b of bursts) {
    const rise = 0.7;
    if (b.t < rise) { const [x, y] = P(b.x, b.y, lerp(b.h0, b.h1, b.t / rise)); ctx.fillStyle = "rgba(255,230,180,0.9)"; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill(); continue; }
    const e = b.t - rise, [cx, cy] = P(b.x, b.y, b.h1), R = TW * cam.zoom * 2.3, fade = clamp(1 - e / 1.9, 0, 1);
    const d = R * (1 - Math.exp(-e * 2.6)), d0 = R * (1 - Math.exp(-Math.max(0, e - 0.12) * 2.6)), g = e * e * TW * cam.zoom * 0.35;
    ctx.strokeStyle = rgba(b.col, fade); ctx.lineWidth = Math.max(1.6, TW * cam.zoom * 0.045); ctx.lineCap = "round";
    for (const [vx, vy] of b.parts) { ctx.beginPath(); ctx.moveTo(cx + vx * d0, cy + vy * d0 + g * 0.8); ctx.lineTo(cx + vx * d, cy + vy * d + g); ctx.stroke(); }
    ctx.fillStyle = rgba([255, 255, 255], fade * 0.8);
    for (const [vx, vy] of b.parts) { ctx.beginPath(); ctx.arc(cx + vx * d, cy + vy * d + g, Math.max(0.8, TW * cam.zoom * 0.02), 0, Math.PI * 2); ctx.fill(); }
    if (e < 0.25) glow(cx, cy, R * 0.8, b.col, 0.25 * (1 - e / 0.25));
  }
  ctx.restore();
}
function seasonalItems(items, t, bias) {
  if (SEASON === "spring") { for (const f of FLOWERS) items.push([depthKey(f.x, f.y, f.h) + 0.03, () => drawFlower(f)]); if (S.light > 0.6) for (const b of butterflies) items.push([Math.max(depthKey(b.x, b.y, b.z) + 0.4, runwayD(b.x, b.y) < 1 ? RWY_KEY + 0.02 : -1e9), () => drawButterfly(b)]); }
  if (SEASON === "autumn") { for (const f of FALLEN) items.push([depthKey(f.x, f.y, f.h) + 0.01, () => drawFallen(f)]); for (const p of PUMPKINS) items.push([depthKey(p.x, p.y, p.h) + bias, () => drawPumpkin(p)]); }
  if (SEASON === "winter") {
    if (XMAS) items.push([depthKey(XMAS.i, XMAS.j, XMAS.h) + bias, () => drawXmasTree(XMAS)]);
    const m = MARKS[0]; items.push([depthKey(m.i + 0.5, m.j + 0.5, m.h) + bias + 0.12, drawEaveLights]);
    if (S.light > 0.55) for (const sk of SKATERS) { const [x, y] = skaterPos(sk, t); items.push([depthKey(x, y, WATER_H) + 0.08, () => drawSkater(sk, t)]); }
  }
}
// ---------- more seasonal touches ----------
function isHalloween(d = new Date()) { return d.getMonth() === 9 && d.getDate() === 31; }
function isNewYear(d = new Date()) { return (d.getMonth() === 11 && d.getDate() === 31 && hourNow >= 20) || (d.getMonth() === 0 && d.getDate() === 1 && hourNow < 1); }
const shooting = [];
let rainT = 0, rainOn = false, rainSpawn = 0, snowAmt = 0;
const rainRings = []; // where raindrops land on the pond
const rainDrops = Array.from({ length: 140 }, () => [Math.random(), Math.random(), 0.6 + Math.random() * 0.6]);
function stepSkyExtras(dt) {
  const night = clamp((0.72 - S.light) / 0.36, 0, 1);
  if (night > 0.5 && !reduceMotion && Math.random() < dt * 0.12) shooting.push({ x: 0.15 + Math.random() * 0.7, y: 0.05 + Math.random() * 0.25, a: 0.35 + Math.random() * 0.4, t: 0 });
  for (let k = shooting.length - 1; k >= 0; k--) if ((shooting[k].t += dt) > 0.9) shooting.splice(k, 1);
  // spring showers: rain for a while, then it clears
  rainT += dt;
  if (SEASON === "spring" && !reduceMotion) { const c = rainT % 60; rainOn = c > 40 && c < 52; }
  else rainOn = false;
  // winter snows in spells: about half of each minute, easing in and out
  { const c = rainT % 60, want = SEASON === "winter" && c > 5 && c < 35 ? 1 : 0; snowAmt += clamp(want - snowAmt, -dt / 4, dt / 4); }
  if (rainOn) for (rainSpawn += dt * 9; rainSpawn >= 1; rainSpawn--) {
    for (let n = 0; n < 6; n++) { const x = LAKE.cx + (Math.random() * 2 - 1) * LAKE.rx, y = LAKE.cy + (Math.random() * 2 - 1) * LAKE.ry; if (inPond(x, y, 0.9)) { rainRings.push({ x, y, q: 0 }); break; } }
  }
  for (let k = rainRings.length - 1; k >= 0; k--) if ((rainRings[k].q += dt * 0.6) >= 1) rainRings.splice(k, 1);
  if (SEASON === "winter") stepSmoke(dt);
}
function drawSkyExtras(t, night) {
  // northern lights on winter nights
  if (SEASON === "winter" && night > 0.2) {
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (let b = 0; b < 3; b++) {
      const base = H * (0.16 + b * 0.06), col = b === 1 ? [150, 110, 255] : [80, 255, 170];
      ctx.beginPath();
      for (let k = 0; k <= 40; k++) { const x = W * (-0.05 + k / 40 * 1.1), y = base + Math.sin(k * 0.35 + t * 0.0004 * (b + 1) + b) * H * 0.03; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      for (let k = 40; k >= 0; k--) { const x = W * (-0.05 + k / 40 * 1.1), y = base + Math.sin(k * 0.35 + t * 0.0004 * (b + 1) + b) * H * 0.03 + H * (0.12 + 0.04 * Math.sin(k * 0.5 + t * 0.0007)); ctx.lineTo(x, y); }
      const g = ctx.createLinearGradient(0, base, 0, base + H * 0.16); g.addColorStop(0, rgba(col, 0)); g.addColorStop(0.35, rgba(col, 0.16 * night)); g.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = g; ctx.fill();
    }
    ctx.restore();
  }
  // shooting stars
  for (const sh of shooting) {
    const p = sh.t / 0.9, x = (sh.x + Math.cos(sh.a) * p * 0.25) * W, y = (sh.y + Math.sin(sh.a) * p * 0.25) * H, L = 60 * (1 - Math.abs(p - 0.5));
    const g = ctx.createLinearGradient(x, y, x - Math.cos(sh.a) * L, y - Math.sin(sh.a) * L); g.addColorStop(0, `rgba(255,255,240,${0.9 * night})`); g.addColorStop(1, "rgba(255,255,240,0)");
    ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(sh.a) * L, y - Math.sin(sh.a) * L); ctx.stroke();
  }
  // Santa crosses the winter night sky now and then
  if (SEASON === "winter" && night > 0.5) {
    const cyc = (t / 1000) % 45, p = cyc / 9;
    if (p < 1) drawSanta(W * (-0.15 + p * 1.3), H * (0.28 - Math.sin(p * Math.PI) * 0.12), t);
  }
}
function drawSanta(x, y, t) {
  const u = Math.max(6, TW * 0.22), bob = Math.sin(t * 0.008) * u * 0.3;
  ctx.save(); ctx.translate(x, y);
  ctx.strokeStyle = "rgba(230,200,140,0.8)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(u * 1.2, -u * 0.3); ctx.lineTo(u * 9.5, -u * 0.6 + bob); ctx.stroke();
  for (let k = 0; k < 4; k++) {
    const rx = u * (3 + k * 2), ry = -u * 0.7 + bob * (0.5 + k * 0.2) + Math.sin(t * 0.01 + k) * u * 0.2, lg = Math.sin(t * 0.02 + k) * u * 0.35;
    ctx.fillStyle = "#8a5a3a"; ctx.beginPath(); ctx.ellipse(rx, ry, u * 0.8, u * 0.32, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(rx + u * 0.85, ry - u * 0.4, u * 0.28, u * 0.2, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#8a5a3a"; ctx.lineWidth = Math.max(1, u * 0.15); ctx.beginPath(); ctx.moveTo(rx - u * 0.5, ry); ctx.lineTo(rx - u * 0.7 - lg, ry + u * 0.6); ctx.moveTo(rx + u * 0.5, ry); ctx.lineTo(rx + u * 0.7 + lg, ry + u * 0.6); ctx.stroke();
    ctx.strokeStyle = "#d8c8a8"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(rx + u * 0.9, ry - u * 0.55); ctx.lineTo(rx + u * 0.75, ry - u * 0.95); ctx.moveTo(rx + u * 0.9, ry - u * 0.55); ctx.lineTo(rx + u * 1.15, ry - u * 0.9); ctx.stroke();
    if (k === 3) { ctx.fillStyle = "#ff4a3a"; ctx.beginPath(); ctx.arc(rx + u * 1.12, ry - u * 0.38, u * 0.12, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.fillStyle = "#c8322a"; ctx.beginPath(); ctx.moveTo(-u * 1.4, -u * 0.2); ctx.lineTo(u * 1.4, -u * 0.2); ctx.quadraticCurveTo(u * 1.6, u * 0.5, u * 0.8, u * 0.6); ctx.lineTo(-u * 1.2, u * 0.6); ctx.quadraticCurveTo(-u * 1.8, u * 0.3, -u * 1.4, -u * 0.2); ctx.fill();
  ctx.strokeStyle = "#e8c060"; ctx.lineWidth = Math.max(1, u * 0.12); ctx.beginPath(); ctx.moveTo(-u * 1.6, u * 0.85); ctx.quadraticCurveTo(0, u * 1.0, u * 1.7, u * 0.7); ctx.stroke();
  ctx.fillStyle = "#c8322a"; ctx.beginPath(); ctx.arc(0, -u * 0.55, u * 0.45, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#f0d0b0"; ctx.beginPath(); ctx.arc(u * 0.05, -u * 1.1, u * 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(u * 0.12, -u * 0.92, u * 0.25, 0, Math.PI); ctx.fill();
  ctx.fillStyle = "#c8322a"; ctx.beginPath(); ctx.moveTo(-u * 0.3, -u * 1.25); ctx.lineTo(u * 0.35, -u * 1.25); ctx.lineTo(-u * 0.55, -u * 1.75); ctx.fill();
  ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(-u * 0.58, -u * 1.75, u * 0.12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#6a4a2a"; ctx.beginPath(); ctx.ellipse(-u * 0.9, -u * 0.45, u * 0.45, u * 0.38, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function drawRain() {
  if (SEASON === "winter" && !reduceMotion && snowAmt > 0) drawSnowfall();
  if (!rainOn) return;
  ctx.save(); ctx.strokeStyle = rgba(lit([210, 225, 240]), 0.45); ctx.lineWidth = 1;
  const now = performance.now();
  ctx.beginPath();
  for (const [rx, ry, sp] of rainDrops) { const y = ((ry + now * 0.0009 * sp) % 1) * H, x = (rx * W + y * 0.18) % W; ctx.moveTo(x, y); ctx.lineTo(x - 14 * 0.18, y - 14); }
  ctx.stroke(); ctx.fillStyle = "rgba(120,130,150,0.08)"; ctx.fillRect(0, 0, W, H); ctx.restore();
}
// winter: soft snow drifting down across the whole sky, nearer flakes a little bigger and faster
function drawSnowfall() {
  const now = performance.now(), u = Math.min(W, H) / 800;
  ctx.save(); ctx.fillStyle = rgba(lit([248, 250, 255]), 0.8);
  ctx.beginPath();
  const n = Math.round(rainDrops.length * snowAmt);
  for (let k = 0; k < n; k++) {
    const [rx, ry, sp] = rainDrops[k], y = ((ry + now * 0.00005 * sp) % 1) * (H + 20) - 10, x = ((rx * W + Math.sin(now * 0.0006 * sp + rx * 40) * 18 * sp + y * 0.05) % W + W) % W, r = (0.9 + (sp - 0.6) * 2) * Math.max(1, u * 1.4);
    ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2);
  }
  ctx.fill(); ctx.restore();
}
// winter: a snowman and chimney smoke
const SNOWMAN = (() => {
  // the most open patch of ground on the front half of the island, away from trees and landmarks
  const blockers = [...trees.map(t => [t.i, t.j]), ...MARKS.map(m => [m.i + 0.5, m.j + 0.5]), ...STONES.map(s => [s.x, s.y]), [XMAS.x, XMAS.y], [DOCK.x, DOCK.y]];
  let best = null, bestD = 0;
  for (let x = 4; x <= 17; x += 0.25) for (let y = 4; y <= 17; y += 0.25) {
    if (x + y < 20 || !okGround(x, y)) continue;
    let d = 9; for (const [bx, by] of blockers) { const q = Math.hypot(bx - x, by - y) * ((bx + by > x + y) ? 0.6 : 1); if (q < d) d = q; }
    if (d > bestD) { bestD = d; best = { x, y, h: hf(x, y) }; }
  }
  return best;
})();
function drawSnowman(sm) {
  const [x, y, f] = P(sm.x, sm.y, sm.h), u = TW * f * cam.zoom * 0.16;
  ctx.fillStyle = rgba([0, 0, 0], 0.12 * S.light); ctx.beginPath(); ctx.ellipse(x, y, u * 1.4, u * 0.45, 0, 0, Math.PI * 2); ctx.fill();
  for (const [cy, r] of [[-1.0, 1.05], [-2.55, 0.78], [-3.7, 0.55]]) { ctx.fillStyle = rgb(lit([246, 248, 252])); ctx.beginPath(); ctx.arc(x, y + cy * u, r * u, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = rgb(lit([214, 222, 234])); ctx.beginPath(); ctx.arc(x + r * u * 0.25, y + cy * u + r * u * 0.25, r * u * 0.7, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = rgb(lit([246, 248, 252])); ctx.beginPath(); ctx.arc(x - r * u * 0.1, y + cy * u - r * u * 0.1, r * u * 0.78, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = rgb(lit([30, 30, 36])); ctx.fillRect(x - u * 0.55, y - u * 4.3, u * 1.1, u * 0.12); ctx.fillRect(x - u * 0.38, y - u * 5.0, u * 0.76, u * 0.72);
  ctx.fillStyle = rgb(lit([200, 50, 50])); ctx.fillRect(x - u * 0.38, y - u * 4.42, u * 0.76, u * 0.14);
  ctx.fillStyle = rgb(lit([30, 30, 36])); for (const dx of [-0.2, 0.2]) { ctx.beginPath(); ctx.arc(x + dx * u, y - u * 3.8, u * 0.08, 0, Math.PI * 2); ctx.fill(); }
  for (const dy of [-2.8, -2.45, -2.1]) { ctx.beginPath(); ctx.arc(x, y + dy * u, u * 0.08, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = rgb(lit([240, 130, 40])); ctx.beginPath(); ctx.moveTo(x, y - u * 3.68); ctx.lineTo(x + u * 0.65, y - u * 3.6); ctx.lineTo(x, y - u * 3.52); ctx.fill();
  ctx.strokeStyle = rgb(lit([100, 70, 50])); ctx.lineWidth = Math.max(1, u * 0.12); ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x - u * 0.7, y - u * 2.6); ctx.lineTo(x - u * 1.7, y - u * 3.2); ctx.lineTo(x - u * 1.9, y - u * 3.5); ctx.moveTo(x + u * 0.7, y - u * 2.6); ctx.lineTo(x + u * 1.6, y - u * 3.1); ctx.stroke();
  ctx.strokeStyle = rgb(lit([200, 50, 50])); ctx.lineWidth = Math.max(1.5, u * 0.25); ctx.beginPath(); ctx.moveTo(x - u * 0.55, y - u * 3.2); ctx.lineTo(x + u * 0.55, y - u * 3.2); ctx.lineTo(x + u * 0.45, y - u * 2.6); ctx.stroke();
}
const CHIMNEY = (() => { const m = MARKS[0]; return { x: m.i + 0.78, y: m.j + 0.35, z0: m.h + 1.35, z1: m.h + 2.05 }; })();
const smoke = [];
function stepSmoke(dt) {
  if (Math.random() < dt * 2.2 && smoke.length < 20) smoke.push({ x: CHIMNEY.x, y: CHIMNEY.y, z: CHIMNEY.z1, t: 0, dx: (Math.random() - 0.5) * 0.1 });
  for (let k = smoke.length - 1; k >= 0; k--) { const p = smoke[k]; p.t += dt; p.z += dt * 0.45; p.x += dt * (0.12 + p.dx); p.y -= dt * 0.05; if (p.t > 4.5) smoke.splice(k, 1); }
}
function drawChimney() {
  const c = CHIMNEY;
  box(c.x - 0.08, c.y - 0.08, c.x + 0.08, c.y + 0.08, c.z0, c.z1, [150, 90, 70]);
  box(c.x - 0.1, c.y - 0.1, c.x + 0.1, c.y + 0.1, c.z1 - 0.02, c.z1 + 0.05, [244, 246, 250]);
  for (const p of smoke) { const [x, y] = P(p.x, p.y, p.z), r = TW * cam.zoom * (0.06 + p.t * 0.05); ctx.fillStyle = rgba(lit([230, 232, 236]), 0.45 * (1 - p.t / 4.5)); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
}
// spring: petals on the pond and a duck family
const POND_PETALS = Array.from({ length: 26 }, (_, k) => ({ a: r2() * 6.28, r: Math.sqrt(r2()) * 0.85, rot: r2() * 6.28, sp: 0.02 + r2() * 0.03, col: [[248, 196, 210], [252, 220, 230], [242, 174, 196]][k % 3] }));
function drawPondPetal(pt, t) {
  const a = pt.a + t * 0.00002 * (pt.sp * 40), x = LAKE.cx + Math.cos(a) * pt.r * LAKE.rx * 0.8, y = LAKE.cy + Math.sin(a) * pt.r * LAKE.ry * 0.8;
  if (lakeD(x, y) > 0.75) return;
  const [sx, sy] = P(x, y, WATER_H + 0.01), u = TW * cam.zoom * 0.045;
  ctx.fillStyle = rgba(lit(pt.col), 0.95); ctx.beginPath(); ctx.ellipse(sx, sy, u, u * 0.45, pt.rot + t * 0.0002, 0, Math.PI * 2); ctx.fill();
}
const DUCKS = Array.from({ length: 5 }, (_, k) => ({ k, lag: k === 0 ? 0 : 0.22 + k * 0.16 }));
function duckPos(d, t) { const a = t * 0.00012 - d.lag; return [LAKE.cx + Math.cos(a) * LAKE.rx * 0.55, LAKE.cy + Math.sin(a) * LAKE.ry * 0.5, a]; }
function drawDuck(d, t) {
  const [wx, wy, a] = duckPos(d, t), [x, y, f] = P(wx, wy, WATER_H), nx = P(wx - Math.sin(a) * 0.2, wy + Math.cos(a) * 0.2, WATER_H)[0], face = nx >= x ? 1 : -1;
  const u = TW * f * cam.zoom * (d.k === 0 ? 0.18 : 0.1), body = d.k === 0 ? [236, 232, 220] : [246, 214, 90];
  ctx.save(); ctx.translate(x, y + Math.sin(t * 0.004 + d.k) * u * 0.08); ctx.scale(face, 1);
  ctx.fillStyle = rgba([255, 255, 255], 0.25); ctx.beginPath(); ctx.ellipse(0, 0, u * 1.3, u * 0.3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgb(lit(body)); ctx.beginPath(); ctx.ellipse(0, -u * 0.35, u, u * 0.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(u * 0.7, -u * 1.0, u * 0.42, 0, Math.PI * 2); ctx.fill();
  if (d.k === 0) { ctx.fillStyle = rgb(lit([60, 130, 80])); ctx.beginPath(); ctx.arc(u * 0.7, -u * 1.0, u * 0.42, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = rgb(lit([240, 150, 40])); ctx.beginPath(); ctx.moveTo(u * 1.05, -u * 1.05); ctx.lineTo(u * 1.45, -u * 0.95); ctx.lineTo(u * 1.05, -u * 0.85); ctx.fill();
  ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(u * 0.82, -u * 1.1, Math.max(0.7, u * 0.07), 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
// summer: floating lanterns at night, someone fishing off the dock, a kite
const LANTERNS = Array.from({ length: 9 }, () => ({ a: r2() * 6.28, r: 0.2 + r2() * 0.6, sp: 0.4 + r2() }));
function drawPondLantern(l, t) {
  const a = l.a + t * 0.00003 * l.sp, x = LAKE.cx + Math.cos(a) * l.r * LAKE.rx * 0.8, y = LAKE.cy + Math.sin(a) * l.r * LAKE.ry * 0.8;
  if (lakeD(x, y) > 0.7) return;
  const [sx, sy] = P(x, y, WATER_H), u = TW * cam.zoom * 0.07;
  ctx.fillStyle = rgb(lit([110, 70, 50])); ctx.fillRect(sx - u * 0.6, sy - u * 0.25, u * 1.2, u * 0.3);
  ctx.fillStyle = "rgba(255,196,110,0.95)"; ctx.fillRect(sx - u * 0.45, sy - u * 1.15, u * 0.9, u * 0.95);
  ctx.save(); ctx.globalCompositeOperation = "lighter"; glow(sx, sy - u * 0.6, u * 4, [255, 170, 80], 0.35); glow(sx, sy + u * 0.6, u * 3, [255, 170, 80], 0.15); ctx.restore();
}
function drawFisher(t) {
  const { x, y, ax, ay } = DOCK, ex = x + ax * 1.1, ey = y + ay * 1.1, [sx, sy, f] = P(ex, ey, WATER_H + 0.14), u = TW * f * cam.zoom * 0.2;
  const tip = P(ex + ax * 0.9, ey + ay * 0.9, WATER_H + 0.9), bob = P(ex + ax * 1.3, ey + ay * 1.3, WATER_H);
  const by = bob[1] + Math.sin(t * 0.003) * 1.5;
  ctx.lineCap = "round";
  ctx.strokeStyle = rgb(lit([60, 70, 100])); ctx.lineWidth = Math.max(1.5, u * 0.16); ctx.beginPath(); ctx.moveTo(sx, sy - u * 0.15); ctx.lineTo(sx + (tip[0] - sx) * 0.12, sy + u * 0.45); ctx.stroke();
  ctx.fillStyle = rgb(lit([90, 150, 200])); ctx.beginPath(); ctx.ellipse(sx, sy - u * 0.55, u * 0.28, u * 0.42, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgb(lit([238, 198, 162])); ctx.beginPath(); ctx.arc(sx, sy - u * 1.15, u * 0.22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgb(lit([230, 200, 120])); ctx.beginPath(); ctx.ellipse(sx, sy - u * 1.28, u * 0.42, u * 0.1, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(sx, sy - u * 1.3, u * 0.2, Math.PI, 0); ctx.fill();
  ctx.strokeStyle = rgb(lit([110, 80, 50])); ctx.lineWidth = Math.max(1, u * 0.07); ctx.beginPath(); ctx.moveTo(sx, sy - u * 0.6); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
  ctx.strokeStyle = "rgba(240,240,240,0.7)"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(tip[0], tip[1]); ctx.quadraticCurveTo((tip[0] + bob[0]) / 2, (tip[1] + by) / 2 + 6, bob[0], by); ctx.stroke();
  ctx.fillStyle = "#e33"; ctx.beginPath(); ctx.arc(bob[0], by, Math.max(1.3, u * 0.08), 0, Math.PI * 2); ctx.fill();
}
const KITE = (() => { const c = scatter(1, 0)[0] || { x: 6, y: 13, h: 2 }; for (let r = 0; r < 3; r += 0.3) for (let k = 0; k < 12; k++) { const a = k / 12 * 6.28, x = 6.4 + Math.cos(a) * r, y = 13.2 + Math.sin(a) * r; if (okGround(x, y) && !trees.some(t => Math.hypot(t.i - x, t.j - y) < 0.4)) return { x, y, h: hf(x, y) }; } return c; })();
function drawKiteFlyer(t) {
  const k = KITE, [sx, sy, f] = P(k.x, k.y, k.h), u = TW * f * cam.zoom * 0.17;
  ctx.fillStyle = rgb(lit([60, 60, 80])); ctx.fillRect(sx - u * 0.18, sy - u * 0.7, u * 0.12, u * 0.7); ctx.fillRect(sx + u * 0.06, sy - u * 0.7, u * 0.12, u * 0.7);
  ctx.fillStyle = rgb(lit([240, 200, 60])); ctx.beginPath(); ctx.ellipse(sx, sy - u * 1.1, u * 0.3, u * 0.45, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgb(lit([238, 198, 162])); ctx.beginPath(); ctx.arc(sx, sy - u * 1.75, u * 0.24, 0, Math.PI * 2); ctx.fill();
  const hand = [sx + u * 0.35, sy - u * 1.4];
  const kx = k.x - 1.6 + Math.sin(t * 0.0006) * 0.5, ky = k.y - 1.8 + Math.cos(t * 0.0005) * 0.4, [kxs, kys] = P(kx, ky, k.h + 6 + Math.sin(t * 0.0011) * 0.5), ks = TW * cam.zoom * 0.3, rot = Math.sin(t * 0.0013) * 0.25;
  ctx.strokeStyle = "rgba(250,250,250,0.6)"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(hand[0], hand[1]); ctx.quadraticCurveTo((hand[0] + kxs) / 2 + 20, (hand[1] + kys) / 2 + 10, kxs, kys + ks * 0.6); ctx.stroke();
  ctx.save(); ctx.translate(kxs, kys); ctx.rotate(rot);
  ctx.fillStyle = rgb(lit([220, 60, 60])); ctx.beginPath(); ctx.moveTo(0, -ks * 0.7); ctx.lineTo(ks * 0.45, 0); ctx.lineTo(0, ks * 0.6); ctx.lineTo(-ks * 0.45, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgb(lit([250, 210, 70])); ctx.beginPath(); ctx.moveTo(0, -ks * 0.7); ctx.lineTo(ks * 0.45, 0); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(0, ks * 0.6); ctx.lineTo(-ks * 0.45, 0); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgb(lit([60, 120, 220])); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, ks * 0.6); for (let q = 1; q <= 6; q++) ctx.lineTo(Math.sin(t * 0.006 + q) * ks * 0.15, ks * (0.6 + q * 0.18)); ctx.stroke();
  ctx.restore();
}
// autumn: a scarecrow and mushrooms
const SCARECROW = SNOWMAN ? { ...SNOWMAN } : null; // same open patch the snowman uses in winter
function drawScarecrow(sc, t) {
  const [x, y, f] = P(sc.x, sc.y, sc.h), u = TW * f * cam.zoom * 0.15, sway = Math.sin(t * 0.0015) * u * 0.15;
  ctx.strokeStyle = rgb(lit([110, 80, 50])); ctx.lineWidth = Math.max(1.5, u * 0.22); ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - u * 4.2); ctx.moveTo(x - u * 1.8, y - u * 3.0 + sway); ctx.lineTo(x + u * 1.8, y - u * 3.0 - sway); ctx.stroke();
  ctx.fillStyle = rgb(lit([120, 150, 90])); ctx.fillRect(x - u * 0.7, y - u * 3.3, u * 1.4, u * 1.7);
  ctx.fillStyle = rgb(lit([200, 120, 60])); ctx.fillRect(x - u * 1.7, y - u * 3.25 + sway, u * 1.0, u * 0.5); ctx.fillRect(x + u * 0.7, y - u * 3.25 - sway, u * 1.0, u * 0.5);
  ctx.fillStyle = rgb(lit([236, 200, 110])); for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + sd * u * 1.75, y - u * 3.1); ctx.lineTo(x + sd * u * 2.1, y - u * 3.3); ctx.lineTo(x + sd * u * 2.1, y - u * 2.9); ctx.fill(); }
  ctx.fillStyle = rgb(lit([236, 214, 170])); ctx.beginPath(); ctx.arc(x, y - u * 3.85, u * 0.55, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgb(lit([140, 100, 60])); ctx.beginPath(); ctx.ellipse(x, y - u * 4.3, u * 1.1, u * 0.22, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - u * 0.5, y - u * 4.3); ctx.lineTo(x, y - u * 5.1); ctx.lineTo(x + u * 0.5, y - u * 4.3); ctx.fill();
  ctx.fillStyle = "#333"; for (const dx of [-0.2, 0.2]) { ctx.beginPath(); ctx.arc(x + dx * u, y - u * 3.95, u * 0.08, 0, Math.PI * 2); ctx.fill(); }
}
const MUSHROOMS = [];
for (const t of trees) if (t.h < 4.5 && r2() < 0.25) for (let q = 0; q < 3; q++) { const a = r2() * 6.28, r = 0.2 + r2() * 0.25, x = t.i + Math.cos(a) * r, y = t.j + Math.sin(a) * r; if (insideIsland(x, y, 0.95) && lakeD(x, y) > 1.3) MUSHROOMS.push({ x, y, h: hf(x, y), s: 0.7 + r2() * 0.6, red: r2() < 0.6 }); }
function drawMushroom(m) {
  const [x, y] = P(m.x, m.y, m.h), u = TW * cam.zoom * 0.05 * m.s;
  ctx.fillStyle = rgb(lit([240, 230, 210])); ctx.fillRect(x - u * 0.25, y - u * 1.0, u * 0.5, u);
  ctx.fillStyle = rgb(lit(m.red ? [210, 50, 40] : [180, 130, 80])); ctx.beginPath(); ctx.ellipse(x, y - u, u * 0.85, u * 0.6, 0, Math.PI, 0); ctx.fill();
  if (m.red) { ctx.fillStyle = rgb(lit([250, 250, 250])); for (const dx of [-0.35, 0.25]) { ctx.beginPath(); ctx.arc(x + dx * u, y - u * 1.25, u * 0.13, 0, Math.PI * 2); ctx.fill(); } }
}
function moreSeasonalItems(items, t, bias) {
  if (SEASON === "winter") {
    if (SNOWMAN) items.push([depthKey(SNOWMAN.x, SNOWMAN.y, SNOWMAN.h) + bias, () => drawSnowman(SNOWMAN)]);
    const m = MARKS[0]; items.push([depthKey(m.i + 0.5, m.j + 0.5, m.h) + bias + 0.13, drawChimney]);
  }
  if (SEASON === "spring") {
    for (const pt of POND_PETALS) items.push([depthKey(LAKE.cx, LAKE.cy, WATER_H) + 0.02, () => drawPondPetal(pt, t)]);
  }
  if (SEASON === "summer") {
    if (S.light < 0.6) for (const l of LANTERNS) items.push([depthKey(LAKE.cx, LAKE.cy, WATER_H) + 0.06, () => drawPondLantern(l, t)]);
    if (S.light > 0.55 && KITE) items.push([depthKey(KITE.x, KITE.y, KITE.h) + bias, () => drawKiteFlyer(t)]);
  }
  if (SEASON === "autumn") {
    if (SCARECROW) items.push([depthKey(SCARECROW.x, SCARECROW.y, SCARECROW.h) + bias, () => drawScarecrow(SCARECROW, t)]);
    for (const mu of MUSHROOMS) items.push([depthKey(mu.x, mu.y, mu.h) + 0.05, () => drawMushroom(mu)]);
  }
}
function stepSeasonal(dt) {
  stepSkyExtras(dt); if (SEASON === "autumn") stepBears(dt); if (SEASON === "winter") stepBears(dt, reindeer, 0.45); if (SEASON === "spring") stepBears(dt, rabbits, 0.7); if (SEASON === "summer") stepDeer(dt); if (SEASON === "spring") stepButterflies(dt); stepFireworks(dt); }
// ---------- loop ----------
let dirty = true, last = performance.now(), clockTick = 0;
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (tween) { const p = clamp((now - tween.t0) / tween.dur, 0, 1), e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2; setHour(tween.from + tween.d * e); if (p >= 1) { const fin = tween.done; tween = null; fin && fin(); } }
  else if (live && (clockTick += dt) > 20) { clockTick = 0; setHour(localHour()); }
  else if (!live && now - lastScrub > 50000) {
    // 50s after the visitor last scrubbed, time-lapse forward to their real time, then follow the clock again
    const ahead = ((localHour() - hourNow) % 24 + 24) % 24;
    tween = { from: hourNow, d: ahead, t0: now, dur: reduceMotion ? 1 : clamp(ahead * 450, 2500, 9000), done: () => { live = true; } };
  }
  if (dirty) { sunUpdate(); dirty = false; }
  stepCamera(dt);
  treeCacheKey();
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  drawSky(now);
  stepKoi(reduceMotion ? dt * 0.4 : dt); stepLeaves(dt); stepFoxes(dt); stepPlane(dt); stepSeasonal(dt);
  drawFireworks();
  renderScene(now);
  if (SEASON === "summer") drawBirds(now);
  drawLeaves();
  drawNightLights(now);
  drawRain();
  placeTags();
  requestAnimationFrame(frame);
}
window.__setHour = h => { live = false; setHour(h); };
window.__cam = (v, yaw) => { setView(v); if (yaw !== undefined) { cam.yaw = yaw; holdYaw = yaw; } const tv = VIEWS[v]; cam.pitch = tv.pitch; cam.persp = tv.persp; cam.zoom = tv.zoom; };
window.__fly = t => { plane.mode = "flying"; plane.t = t; };
addEventListener("resize", resize);
resize(); camUpdate(); setHour(localHour());
for (let k = 0; k < 25; k++) spawnLeaf();
requestAnimationFrame(frame);
})();
