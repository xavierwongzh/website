"use client";

import { useEffect, useRef } from "react";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { WorkExperience } from "@/components/sections/WorkExperience";
import { Education } from "@/components/sections/Education";
import { Projects } from "@/components/sections/Projects";
import { Navigation } from "@/components/Navigation";
import { BackToTop } from "@/components/BackToTop";
import { MouseGlow } from "@/components/MouseGlow";
import { useParallaxEffects, useScrollAnimations } from "@/hooks/useGSAP";

export default function Home() {
  useParallaxEffects();
  useScrollAnimations();
  
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create stars that span Hero and About sections with gradient density
    if (starsRef.current) {
      const starsContainer = starsRef.current;
      const numberOfStars = 300; // Increased for larger area

      for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement("div");
        const size = Math.random() * 2 + 1;
        const brightness = Math.random();
        const topPosition = Math.random() * 200; // Span 200vh (Hero + About sections)
        
        // Calculate density probability based on vertical position
        // 0-50vh (top half of Hero) = 100% density
        // 100vh (bottom of Hero) = 50% density  
        // 200vh (end of About) = 0% density
        let densityProbability;
        if (topPosition < 50) {
          densityProbability = 1; // 100% in top half
        } else {
          densityProbability = 1 - ((topPosition - 50) / 150); // Linear fade from 50vh to 200vh
        }
        
        // Skip this star based on its vertical position probability
        if (Math.random() > densityProbability) {
          continue;
        }
        
        star.className = "star animate-twinkle";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = topPosition + "vh";
        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.opacity = (brightness * 0.5 + 0.3).toString();
        star.style.animationDelay = Math.random() * 3 + "s";
        star.style.animationDuration = Math.random() * 3 + 2 + "s";
        starsContainer.appendChild(star);
      }
    }
  }, []);

  return (
    <main className="relative hero-bg">
      <Navigation />
      <MouseGlow />
      
      {/* Stars container spanning Hero and About sections */}
      <div ref={starsRef} className="absolute inset-0 h-[200vh] pointer-events-none" />
      
      <div className="relative z-10">
        <Hero />
        <About />
        <WorkExperience />
        <Education />
        <Projects />

      <footer className="relative text-purple-200/70 text-center py-12 text-sm">
        <p>Crafted under the moonlight — © Xavier 2025</p>
      </footer>
      </div>

      <BackToTop />
    </main>
  );
}

