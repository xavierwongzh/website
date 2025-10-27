"use client";

import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Education } from "@/components/sections/Education";
import { Projects } from "@/components/sections/Projects";
import { Navigation } from "@/components/Navigation";
import { BackToTop } from "@/components/BackToTop";
import { MouseGlow } from "@/components/MouseGlow";
import { useParallaxEffects, useScrollAnimations } from "@/hooks/useGSAP";

export default function Home() {
  useParallaxEffects();
  useScrollAnimations();

  return (
    <main className="relative">
      <Navigation />
      <MouseGlow />
      
      <Hero />
      <About />
      <Education />
      <Projects />

      <footer className="bg-black text-center py-8 text-forest-silver border-t border-forest-teal/10">
        <p>Crafted under the moonlight — © Xavier 2025</p>
      </footer>

      <BackToTop />
    </main>
  );
}

