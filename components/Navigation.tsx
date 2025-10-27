"use client";

import { useEffect, useState, useRef } from "react";
import { Home, User, Briefcase, GraduationCap, FolderGit2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#home", label: "Home", icon: Home },
  { href: "#about", label: "About", icon: User },
  { href: "#experience", label: "Experience", icon: Briefcase },
  { href: "#education", label: "Education", icon: GraduationCap },
  { href: "#projects", label: "Projects", icon: FolderGit2 },
];

export function Navigation() {
  const [scrollProgress, setScrollProgress] = useState<number[]>([1, 0, 0, 0, 0]);
  const [centerOffset, setCenterOffset] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isClickScrollingRef = useRef(false);
  const clickScrollTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      // Don't update if we're in the middle of a click-initiated scroll
      if (isClickScrollingRef.current) return;
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * 0.8; // Start highlighting when section enters bottom 20%
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      
      // Check if at top or bottom of page
      const isAtTop = scrollTop < 50; // Within 50px of top
      const isAtBottom = scrollTop + viewportHeight >= docHeight - 50; // Within 50px of bottom
      
      // Calculate progress for each section
      const newProgress: number[] = [];
      let maxProgress = -1;
      let maxIndex = 0;
      
      navLinks.forEach((link, index) => {
        const element = document.getElementById(link.href.substring(1));
        if (!element) {
          newProgress.push(0);
          return;
        }
        
        // Special handling for first and last sections
        if (isAtTop) {
          // At top of page - only Home should be lit
          const progress = index === 0 ? 1.0 : 0;
          newProgress.push(progress);
          if (progress > maxProgress) {
            maxProgress = progress;
            maxIndex = index;
          }
          return;
        }
        
        if (isAtBottom) {
          // At bottom of page - only Projects should be lit
          const progress = index === navLinks.length - 1 ? 1.0 : 0;
          newProgress.push(progress);
          if (progress > maxProgress) {
            maxProgress = progress;
            maxIndex = index;
          }
          return;
        }
        
        const rect = element.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;
        
        let progress = 0;
        
        // Check if section is visible at all
        if (sectionBottom < 0 || sectionTop > viewportHeight) {
          progress = 0;
        }
        // Section is entering from bottom
        else if (sectionTop > 0 && sectionTop < viewportHeight) {
          // Section is entering viewport from below
          if (sectionTop < triggerPoint) {
            // Start highlighting when crossing trigger point
            const entryProgress = (triggerPoint - sectionTop) / triggerPoint;
            progress = Math.min(1.0, 0.3 + (entryProgress * 0.7));
          } else {
            progress = 0;
          }
        }
        // Section is partially or fully in viewport (top is above viewport top)
        else if (sectionTop <= 0 && sectionBottom > 0) {
          const scrolledIntoSection = Math.abs(sectionTop);
          const visibleHeight = Math.min(sectionBottom, viewportHeight);
          
          // Calculate progress based on how far we've scrolled into the section
          // Reaches full brightness after scrolling 60% of viewport height
          const scrollThreshold = viewportHeight * 0.6;
          
          if (scrolledIntoSection >= scrollThreshold) {
            // Full brightness
            progress = 1.0;
          } else {
            // Gradual increase: 0.3 to 1.0
            const scrollProgress = scrolledIntoSection / scrollThreshold;
            progress = 0.3 + (scrollProgress * 0.7);
          }
          
          // Only reduce progress if section is nearly gone (less than 30% visible)
          const visibleRatio = visibleHeight / viewportHeight;
          if (visibleRatio < 0.3) {
            progress *= (visibleRatio / 0.3);
          }
        }
        
        newProgress.push(progress);
        
        if (progress > maxProgress) {
          maxProgress = progress;
          maxIndex = index;
        }
      });
      
      setScrollProgress(newProgress);
      
      // Calculate smooth center offset to center the most active item
      const itemHeight = 48;
      setCenterOffset(-(maxIndex * itemHeight) - 20);
    };

    // Run on mount to set initial state
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (clickScrollTimeoutRef.current) {
        clearTimeout(clickScrollTimeoutRef.current);
      }
    };
  }, []);

  const scrollToSection = (href: string, index: number) => {
    const element = document.querySelector(href);
    
    // Clear any existing timeout
    if (clickScrollTimeoutRef.current) {
      clearTimeout(clickScrollTimeoutRef.current);
    }
    
    // Immediately set progress for clicked section to show it's active
    setScrollProgress(prev => prev.map((_, i) => i === index ? 1.0 : 0));
    
    // Update center offset to center the clicked item
    const itemHeight = 48;
    setCenterOffset(-(index * itemHeight) - 20);
    
    // Set flag to prevent scroll handler from updating immediately
    isClickScrollingRef.current = true;
    
    // Scroll to section
    element?.scrollIntoView({ behavior: "smooth" });
    
    // Re-enable scroll handler after smooth scroll completes (typically ~1s)
    clickScrollTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 1200);
  };

  // Calculate opacity based on scroll progress (no scaling)
  const getItemStyle = (index: number) => {
    const progress = scrollProgress[index] || 0;
    
    // All icons same size
    const scale = 1;
    // If hovered, jump to 100% brightness
    const opacity = hoveredIndex === index ? 1.0 : 0.3 + (progress * 0.7);

    return { scale, opacity };
  };

  return (
    <nav 
      className="fixed right-6 z-50 flex flex-col gap-2"
      style={{
        top: '50vh',
        transform: `translateY(${centerOffset}px)`,
        transition: 'transform 0.3s ease-out',
      }}
    >
      {navLinks.map((link, index) => {
        const Icon = link.icon;
        const progress = scrollProgress[index] || 0;
        const isActive = progress > 0.3; // Consider active if progress > 30% (starts highlighting early)
        const { scale, opacity } = getItemStyle(index);
        
        return (
          <div
            key={link.href}
            className="relative group"
            style={{
              transform: `scale(${scale})`,
              opacity: opacity,
              transition: 'transform 0.3s ease-out, opacity 0.2s ease-out',
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <button
              onClick={() => scrollToSection(link.href, index)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                isActive
                  ? "bg-fuchsia-500/30 text-fuchsia-300 shadow-[0_0_20px_rgba(217,70,239,0.4)]"
                  : "text-fuchsia-300/60 hover:text-fuchsia-300 hover:bg-fuchsia-500/10"
              )}
              aria-label={link.label}
            >
              <Icon className="w-4 h-4 transition-all duration-500" />
            </button>
            
            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-black/90 backdrop-blur-sm border border-fuchsia-500/30 px-3 py-1.5 rounded text-fuchsia-200 text-xs font-medium whitespace-nowrap">
                {link.label}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

