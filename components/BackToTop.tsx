"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.pageYOffset > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative group">
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
          isVisible 
            ? "opacity-100 visible text-forest-teal hover:text-forest-teal hover:bg-forest-teal/10 bg-forest-teal/5" 
            : "opacity-0 invisible"
        )}
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
      
      {/* Tooltip */}
      {isVisible && (
        <div className="fixed bottom-8 right-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="bg-forest-navy/90 backdrop-blur-sm border border-forest-teal/20 px-2 py-1 rounded text-forest-teal text-xs font-medium whitespace-nowrap">
            Back to top
          </div>
        </div>
      )}
    </div>
  );
}

