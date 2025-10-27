"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useParallaxEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Hero section parallax
    gsap.to(".hero-content-parallax", {
      y: 100,
      opacity: 0.3,
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // About section animations
    gsap.from(".about-profile", {
      opacity: 0,
      x: -100,
      duration: 1,
      scrollTrigger: {
        trigger: "#about",
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.from(".about-text", {
      opacity: 0,
      x: 100,
      duration: 1,
      delay: 0.3,
      scrollTrigger: {
        trigger: "#about",
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    // Education items stagger
    gsap.from(".education-item", {
      opacity: 0,
      x: -50,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: "#education",
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    // Projects cards stagger
    gsap.from(".project-card", {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 0.6,
      stagger: 0.15,
      scrollTrigger: {
        trigger: "#projects",
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
}

export function useScrollAnimations() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Fade in section titles
    gsap.utils.toArray(".section-title").forEach((title) => {
      gsap.from(title as gsap.TweenTarget, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: title as gsap.DOMTarget,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Parallax backgrounds
    gsap.to(".about-bg", {
      y: 100,
      scrollTrigger: {
        trigger: "#about",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(".education-bg", {
      y: 80,
      scrollTrigger: {
        trigger: "#education",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(".projects-bg", {
      y: 50,
      scrollTrigger: {
        trigger: "#projects",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
}

