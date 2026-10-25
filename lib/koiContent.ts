import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

type Project = {
  id: string; title: string; sub: string; when: string; role: string; text: string; detail?: string;
  features?: string[]; outcomes?: string[]; tags: string[]; links?: [string, string][]; video?: string;
};
type Place = { eyebrow: string; title: string; html: () => string };

// The scene's words live in public/koi-valley/koi.js and only appear when a card opens.
// At build time we lift the same PROJECTS and PLACES out of that file, so search engines,
// link unfurlers and screen readers get the full text without a second copy to keep in sync.
function loadContent() {
  const src = readFileSync(join(process.cwd(), "public/koi-valley/koi.js"), "utf8");
  const start = src.indexOf("const PROJECTS = [");
  const end = src.indexOf("// ---------- drawer ----------");
  if (start < 0 || end < start) throw new Error("koi.js content block not found");
  const run = new vm.Script(`${src.slice(start, end)}\n({ PROJECTS, PLACES, esc, list });`);
  return run.runInNewContext({}) as {
    PROJECTS: Project[]; PLACES: Record<string, Place>; esc: (s: string) => string; list: (i?: string[]) => string;
  };
}

// buttons only work inside the scene, so the text version drops them
const stripButtons = (html: string) => html.replace(/<button\b[^>]*>[\s\S]*?<\/button>/g, "");

export function readableHtml(): string {
  const { PROJECTS, PLACES, esc, list } = loadContent();
  const section = (key: string) => {
    const p = PLACES[key];
    return `<section><h2>${esc(p.title)}</h2>${stripButtons(p.html())}</section>`;
  };
  const projects = PROJECTS.map(p => `<article>
    <h3>${esc(p.title)}: ${esc(p.sub)}</h3>
    <p>${esc(p.when)} · ${esc(p.role)}</p>
    <p>${esc(p.text)}</p>
    ${p.detail ? `<p>${esc(p.detail)}</p>` : ""}
    ${list(p.features)}${list(p.outcomes)}
    <p>${p.tags.map(esc).join(", ")}</p>
    ${p.links ? `<p>${p.links.map(([l, u]) => `<a href="${u}">${esc(l)}</a>`).join(" · ")}</p>` : ""}
  </article>`).join("");
  return section("about") + section("experience") + section("education")
    + `<section><h2>Projects</h2>${projects}</section>` + section("contact");
}

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Xavier Wong",
  url: "https://xavierwongzh.vercel.app",
  email: "mailto:xavierwongzh@gmail.com",
  jobTitle: "Aviation systems, optimization and analytics",
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Singapore University of Technology and Design" },
    { "@type": "CollegeOrUniversity", name: "Temasek Polytechnic" },
  ],
  knowsAbout: ["Aviation operations", "Operations research", "Mixed-integer linear programming", "Simulation", "Data analytics", "Power BI", "Python"],
  sameAs: ["https://www.linkedin.com/in/xavierwongzh", "https://github.com/xavierwongzh"],
};
