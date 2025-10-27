"use client";

import { useEffect, useRef } from "react";

export function MouseGlow() {
  const fireflyRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const fireflyPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rotation = useRef(0);
  const orbitAngle = useRef(0);
  const lastMouseMove = useRef(Date.now());
  const isMouseMoving = useRef(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      lastMouseMove.current = Date.now();
      isMouseMoving.current = true;
      
      if (fireflyRef.current) {
        fireflyRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Allow firefly to continue moving in the direction the cursor left
      isMouseMoving.current = true;
      lastMouseMove.current = Date.now();
    };

    const handleScroll = () => {
      // Calculate scroll delta
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      
      // Move firefly opposite to scroll direction (with page content)
      // When scrolling down, page moves up, so firefly should move up in viewport
      fireflyPos.current.y -= scrollDelta;
      
      lastScrollY.current = currentScrollY;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initialize scroll position
    lastScrollY.current = window.scrollY;

    const animate = () => {
      // Check if mouse has stopped moving
      const timeSinceLastMove = Date.now() - lastMouseMove.current;
      if (timeSinceLastMove > 100) {
        isMouseMoving.current = false;
      }

      let targetX, targetY;

      if (isMouseMoving.current) {
        // When cursor is moving, follow it but keep some distance
        const dx = mousePos.current.x - fireflyPos.current.x;
        const dy = mousePos.current.y - fireflyPos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Keep a minimum distance of 20-30 pixels
        if (distance > 30) {
          targetX = mousePos.current.x - (dx / distance) * 25;
          targetY = mousePos.current.y - (dy / distance) * 25;
        } else {
          targetX = fireflyPos.current.x;
          targetY = fireflyPos.current.y;
        }
      } else {
        // When cursor stops, orbit around it
        orbitAngle.current += 0.02;
        const orbitRadius = 40;
        targetX = mousePos.current.x + Math.cos(orbitAngle.current) * orbitRadius;
        targetY = mousePos.current.y + Math.sin(orbitAngle.current) * orbitRadius;
      }

      // Smooth constant speed movement with deceleration near target
      const dx = targetX - fireflyPos.current.x;
      const dy = targetY - fireflyPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0.5) {
        let speed = 2.5; // Base speed in pixels per frame
        
        // Smooth deceleration when close to target
        if (distance < 20) {
          speed = speed * (distance / 20);
        }
        
        velocity.current.x = (dx / distance) * speed;
        velocity.current.y = (dy / distance) * speed;
        
        fireflyPos.current.x += velocity.current.x;
        fireflyPos.current.y += velocity.current.y;
      } else {
        // Very close to target, stop moving
        velocity.current.x *= 0.9;
        velocity.current.y *= 0.9;
      }

      // Calculate rotation based on velocity
      if (Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.y) > 0.1) {
        const targetRotation = Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI);
        
        // Calculate the shortest rotation path
        let rotationDiff = targetRotation - rotation.current;
        
        // Normalize to -180 to 180 range to find shortest path
        while (rotationDiff > 180) rotationDiff -= 360;
        while (rotationDiff < -180) rotationDiff += 360;
        
        rotation.current += rotationDiff * 0.1;
      }

      // Flickering effect
      const flicker = 0.85 + Math.sin(Date.now() * 0.008) * 0.15;

      if (fireflyRef.current) {
        // Allow firefly to go beyond viewport boundaries
        const isOutOfView = 
          fireflyPos.current.x < -100 || 
          fireflyPos.current.x > window.innerWidth + 100 ||
          fireflyPos.current.y < -100 || 
          fireflyPos.current.y > window.innerHeight + 100;
        
        fireflyRef.current.style.left = `${fireflyPos.current.x}px`;
        fireflyRef.current.style.top = `${fireflyPos.current.y}px`;
        fireflyRef.current.style.transform = `translate(-50%, -50%) rotate(${rotation.current}deg)`;
        
        // Fade out when far outside viewport, but keep visible when tracking cursor
        if (isOutOfView && !isMouseMoving.current) {
          fireflyRef.current.style.opacity = "0";
        } else {
          fireflyRef.current.style.opacity = `${flicker}`;
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={fireflyRef} className="firefly-cursor opacity-0">
      {/* Firefly body */}
      <div className="firefly-body" />
      {/* Glow effect */}
      <div className="firefly-glow" />
      {/* Wings */}
      <div className="firefly-wing firefly-wing-left" />
      <div className="firefly-wing firefly-wing-right" />
    </div>
  );
}

