"use client";

import { useEffect, useRef } from "react";
import type { Education } from "@/types";

const educationData: Education[] = [
  {
    id: "1",
    year: "2023-2025",
    title: "Master's Degree",
    institution: "University Name",
    description: "Specialization in Data Science and Analytics",
  },
  {
    id: "2",
    year: "2019-2023",
    title: "Bachelor's Degree",
    institution: "University Name",
    description: "Computer Science and Mathematics",
  },
  {
    id: "3",
    year: "2022",
    title: "Key Certification",
    institution: "Certification Provider",
    description: "Advanced Machine Learning and AI",
  },
];

export function Education() {
  const wispsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wispsRef.current) {
      const wispsContainer = wispsRef.current;
      const numberOfWisps = 15;

      for (let i = 0; i < numberOfWisps; i++) {
        const wisp = document.createElement("div");
        wisp.className = "wisp animate-wisp-float";
        wisp.style.left = Math.random() * 100 + "%";
        wisp.style.top = Math.random() * 100 + "%";
        wisp.style.animationDelay = Math.random() * 8 + "s";
        wisp.style.animationDuration = Math.random() * 4 + 6 + "s";
        wispsContainer.appendChild(wisp);
      }
    }
  }, []);

  return (
    <section id="education" className="relative min-h-screen flex items-center justify-center overflow-hidden education-bg -mt-1">
      {/* Forest mid background */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_30%_40%,rgba(77,208,225,0.05),transparent_30%)]" />
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_70%_60%,rgba(38,166,154,0.05),transparent_30%)]" />
      </div>

      {/* Wisps */}
      <div ref={wispsRef} className="absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <h2 className="font-outfit text-5xl md:text-6xl text-center mb-12 text-forest-teal drop-shadow-[0_0_20px_rgba(77,208,225,0.5)]">
          Education & Milestones
        </h2>

        <div className="space-y-12">
          {educationData.map((edu, index) => (
            <div
              key={edu.id}
              className="grid md:grid-cols-[100px_1fr] gap-6 items-center relative"
            >
              {/* Timeline connector */}
              {index < educationData.length - 1 && (
                <div className="absolute left-[50px] top-[60px] w-0.5 h-[calc(100%+3rem)] bg-gradient-to-b from-forest-teal to-transparent hidden md:block" />
              )}

              {/* Rune marker */}
              <div className="flex justify-center md:justify-start">
                <div className="w-16 h-16 rounded-full bg-[radial-gradient(circle,rgba(77,208,225,0.3),rgba(77,208,225,0.1))] border-2 border-forest-teal relative animate-rune-glow flex items-center justify-center">
                  <span className="text-2xl text-forest-teal">✦</span>
                </div>
              </div>

              {/* Education content */}
              <div className="bg-forest-navy-light/30 border border-forest-teal/20 rounded-lg p-6 hover:bg-forest-navy-light/50 hover:border-forest-teal hover:shadow-[0_0_30px_rgba(77,208,225,0.3)] transition-all duration-300 hover:translate-x-2">
                <div className="text-sm text-forest-emerald font-semibold mb-1">
                  {edu.year}
                </div>
                <h3 className="font-outfit text-2xl md:text-3xl text-forest-teal mb-2">
                  {edu.title}
                </h3>
                <p className="text-forest-emerald font-semibold mb-2">
                  {edu.institution}
                </p>
                <p className="text-forest-silver">
                  {edu.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

