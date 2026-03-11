"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export function Hero() {
  const lightsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    // Create mystical floating lights (fireflies)
    if (lightsRef.current) {
      const lightsContainer = lightsRef.current;
      const numberOfLights = 15;

      for (let i = 0; i < numberOfLights; i++) {
        const light = document.createElement("div");
        const size = Math.random() * 3 + 2;
        
        light.className = "floating-light animate-float";
        light.style.left = Math.random() * 100 + "%";
        light.style.top = Math.random() * 70 + 25 + "%"; // Spread from 25% to 95%
        light.style.width = size + "px";
        light.style.height = size + "px";
        light.style.opacity = (Math.random() * 0.4 + 0.4).toString(); // Vary opacity
        light.style.animationDelay = Math.random() * 10 + "s";
        light.style.animationDuration = Math.random() * 8 + 12 + "s";
        lightsContainer.appendChild(light);
      }
    }
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      const yOffset = -10; // Small offset to ensure overlap
      const y = aboutSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Nebula/Aurora effect in upper atmosphere */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.2),transparent_70%)] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-1/3 h-1/3 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.25),transparent_60%)] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-2/5 h-2/5 bg-[radial-gradient(ellipse_at_center,rgba(192,132,252,0.15),transparent_60%)] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating mystical lights (fireflies) */}
      <div ref={lightsRef} className="absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="font-outfit text-6xl md:text-8xl font-bold text-fuchsia-300 drop-shadow-[0_0_40px_rgba(217,70,239,0.6)] animate-fade-in-down mb-6">
          Xavier Wong
        </h1>
        <div className="text-lg md:text-xl text-purple-100/85 font-light animate-fade-in-up animation-delay-500 mb-10 max-w-3xl mx-auto">
          <p className="mb-4">
            Engineering Systems undergraduate at SUTD focused on aviation operations,
            optimization (OR/MILP), simulation, and data analytics.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {["Aviation Systems", "Operations Research", "Optimization", "Simulation", "Analytics"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-black/40 border border-fuchsia-500/30 text-fuchsia-200/90"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <button
            onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
            className="px-5 py-2.5 rounded-xl bg-fuchsia-600/25 border border-fuchsia-400/40 text-fuchsia-100 hover:bg-fuchsia-600/35 hover:border-fuchsia-300 transition-all shadow-[0_0_30px_rgba(217,70,239,0.18)]"
          >
            View Projects
          </button>
          <a
            href="mailto:xavier_wong@mymail.sutd.edu.sg"
            className="px-5 py-2.5 rounded-xl bg-black/35 border border-fuchsia-500/25 text-purple-100/90 hover:bg-black/45 hover:border-fuchsia-400/40 transition-all"
          >
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/xavierwongzh"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-black/35 border border-fuchsia-500/25 text-purple-100/90 hover:bg-black/45 hover:border-fuchsia-400/40 transition-all"
          >
            LinkedIn
          </a>
        </div>

        <button
          onClick={scrollToAbout}
          className="flex flex-col items-center gap-2 text-purple-200/60 hover:text-fuchsia-300 transition-all duration-300 mx-auto group text-sm font-light"
        >
          <span>Scroll</span>
          <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
}

