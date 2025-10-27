"use client";

import { useEffect, useRef } from "react";
import type { Interest } from "@/types";

const interests: Interest[] = [
  { id: "1", name: "Data Analytics" },
  { id: "2", name: "Machine Learning" },
  { id: "3", name: "Creative Technology" },
  { id: "4", name: "Digital Art" },
  { id: "5", name: "Storytelling" },
];

export function About() {
  const leavesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (leavesRef.current) {
      const leavesContainer = leavesRef.current;
      const numberOfLeaves = 30;

      for (let i = 0; i < numberOfLeaves; i++) {
        const leaf = document.createElement("div");
        leaf.className = "leaf animate-fall";
        leaf.style.left = Math.random() * 100 + "%";
        leaf.style.animationDelay = Math.random() * 15 + "s";
        leaf.style.animationDuration = Math.random() * 10 + 10 + "s";
        leavesContainer.appendChild(leaf);
      }
    }
  }, []);

  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center overflow-hidden about-bg -mt-20">
      {/* Canopy background effects */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_20%_30%,rgba(27,94,32,0.3),transparent_40%)]" />
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_80%_50%,rgba(38,166,154,0.2),transparent_40%)]" />
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_50%_80%,rgba(27,94,32,0.25),transparent_40%)]" />
      </div>

      {/* Falling leaves */}
      <div ref={leavesRef} className="absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 pt-24">
        <h2 className="font-outfit text-5xl md:text-6xl text-center mb-12 text-forest-teal drop-shadow-[0_0_20px_rgba(77,208,225,0.5)]">
          About Me
        </h2>

        <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-center">
          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(77,208,225,0.3),transparent_70%)] animate-pulse" />
              
              {/* Profile placeholder */}
              <div className="relative z-10">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="#1a2f3f"
                    stroke="url(#profileGradient)"
                    strokeWidth="2"
                  />
                  <defs>
                    <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#4dd0e1", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#26a69a", stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <text
                    x="100"
                    y="125"
                    textAnchor="middle"
                    fill="#4dd0e1"
                    fontSize="80"
                    fontFamily="var(--font-outfit)"
                  >
                    X
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* About text */}
          <div className="space-y-6">
            <p className="text-lg md:text-xl text-forest-white leading-relaxed">
              I am an aspiring data analyst and creative technologist with a passion for
              merging analytics and art. I enjoy exploring how technology and imagination
              intertwine to tell stories — from machine learning to digital aesthetics.
            </p>

            <div>
              <h3 className="font-outfit text-2xl text-forest-teal mb-4">Key Interests</h3>
              <div className="flex flex-wrap gap-3">
                {interests.map((interest, index) => (
                  <span
                    key={interest.id}
                    className="px-4 py-2 bg-forest-teal/10 border border-forest-teal rounded-full text-forest-teal hover:bg-forest-teal/20 hover:shadow-[0_0_15px_rgba(77,208,225,0.4)] transition-all duration-300 hover:-translate-y-1 cursor-default"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {interest.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

