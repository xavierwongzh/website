"use client";

import { useEffect, useState } from "react";
import { Home, User, GraduationCap, FolderGit2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#home", label: "Home", icon: Home },
  { href: "#about", label: "About", icon: User },
  { href: "#education", label: "Education", icon: GraduationCap },
  { href: "#projects", label: "Projects", icon: FolderGit2 },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = navLinks.map((link) => link.href.substring(1));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
      {navLinks.map((link) => {
        const Icon = link.icon;
        const isActive = activeSection === link.href.substring(1);
        
        return (
          <div key={link.href} className="relative group">
            <button
              onClick={() => scrollToSection(link.href)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                isActive
                  ? "bg-forest-teal/20 text-forest-teal scale-110"
                  : "text-forest-teal/50 hover:text-forest-teal hover:bg-forest-teal/10"
              )}
              aria-label={link.label}
            >
              <Icon className="w-4 h-4" />
            </button>
            
            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-forest-navy/90 backdrop-blur-sm border border-forest-teal/20 px-2 py-1 rounded text-forest-teal text-xs font-medium whitespace-nowrap">
                {link.label}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

