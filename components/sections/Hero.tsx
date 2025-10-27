"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const starsRef = useRef<HTMLDivElement>(null);
  const lightsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create stars with varied sizes and brightness
    if (starsRef.current) {
      const starsContainer = starsRef.current;
      const numberOfStars = 200;

      for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement("div");
        const size = Math.random() * 2 + 1;
        const brightness = Math.random();
        
        star.className = "star animate-twinkle";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 60 + "%"; // Keep stars in upper portion
        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.opacity = (brightness * 0.5 + 0.3).toString();
        star.style.animationDelay = Math.random() * 3 + "s";
        star.style.animationDuration = Math.random() * 3 + 2 + "s";
        starsContainer.appendChild(star);
      }
    }

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
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden hero-bg">
      {/* Nebula/Aurora effect in upper atmosphere */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.2),transparent_70%)] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-1/3 h-1/3 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.25),transparent_60%)] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-2/5 h-2/5 bg-[radial-gradient(ellipse_at_center,rgba(192,132,252,0.15),transparent_60%)] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Stars container */}
      <div ref={starsRef} className="absolute inset-0" />

      {/* Floating mystical lights (fireflies) */}
      <div ref={lightsRef} className="absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="font-outfit text-6xl md:text-8xl font-bold text-forest-teal drop-shadow-[0_0_40px_rgba(77,208,225,0.6)] animate-fade-in-down mb-4">
          Xavier Wong
        </h1>
        <p className="text-xl md:text-2xl text-forest-silver font-light tracking-[0.3em] animate-fade-in-up animation-delay-500 mb-16">
          Exploring worlds of data, design, and dreams
        </p>

        <button
          onClick={scrollToAbout}
          className="flex flex-col items-center gap-2 text-forest-teal/60 hover:text-forest-teal transition-all duration-300 mx-auto group text-sm font-light"
        >
          <span>Begin Journey</span>
          <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
        </button>
      </div>

    </section>
  );
}

