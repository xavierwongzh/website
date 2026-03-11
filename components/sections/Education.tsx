"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Education } from "@/types";

const educationData: Education[] = [
  {
    id: "1",
    year: "Sep 2022 – May 2026",
    title: "Bachelor of Engineering – Engineering Systems and Design",
    institution: "Singapore University of Technology and Design (SUTD)",
    specializations: [
      "Business Analytics & Operations Research",
      "Aviation Systems"
    ],
    minors: [
      "Artificial Intelligence",
      "Design, Technology and Society"
    ],
    activities: [
      "Makerspace Club (Program Director, Sep 2022 – Mar 2023)",
      "SUTD Organisation of Autonomous Robotics",
      "Korean Language Enrichment Club"
    ],
    exchange: "Universitas Gadjah Mada, Freshmore Asian Cross-curricular Trip (2024)"
  },
  {
    id: "2",
    year: "Apr 2017 – Mar 2020",
    title: "Diploma – Mechatronics Engineering (Merit)",
    institution: "Temasek Polytechnic",
    minors: [
      "Psychology (Diploma Plus)"
    ],
    awards: [
      "Bronze Course Medal",
      "Director's List (all AYs)"
    ],
    projects: [
      "Synchronization of WordPress Database and Local Database for Store Menu Items"
    ]
  },
];

export function Education() {
  const wispsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedEdu, setSelectedEdu] = useState<Education | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(educationData.length - 1);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const scrollToCard = (index: number) => {
    if (timelineRef.current && cardRefs.current[index]) {
      const card = cardRefs.current[index];
      if (card) {
        const container = timelineRef.current;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const containerCenter = container.offsetWidth / 2;
        container.scrollTo({
          left: cardCenter - containerCenter,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleCardClick = (edu: Education, index: number) => {
    // Don't open modal or scroll if user was dragging
    if (hasDragged) return;
    
    if (index === centerIndex) {
      // If already centered, open the modal
      setSelectedEdu(edu);
    } else {
      // If not centered, scroll to center
      scrollToCard(index);
    }
  };

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const container = timelineRef.current;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX);
    setScrollLeft(container.scrollLeft);
    container.style.scrollBehavior = 'auto'; // Disable smooth scroll during drag
    container.style.scrollSnapType = 'none'; // Disable snap during drag for fluid movement
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !timelineRef.current) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = x - startX; // 1:1 movement ratio for direct tracking
    
    // Track if there was significant movement
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    
    const container = timelineRef.current;
    const newScrollLeft = scrollLeft - walk;
    
    // Prevent dragging beyond boundaries when first/last cards are centered
    const isFirstCardCentered = centerIndex === 0;
    const isLastCardCentered = centerIndex === educationData.length - 1;
    
    // If first card is centered and trying to drag right (scroll left), don't allow
    if (isFirstCardCentered && walk > 0) {
      return;
    }
    
    // If last card is centered and trying to drag left (scroll right), don't allow
    if (isLastCardCentered && walk < 0) {
      return;
    }
    
    // Calculate boundaries
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const minScrollLeft = 0;
    
    // Clamp scroll position to boundaries
    container.scrollLeft = Math.max(minScrollLeft, Math.min(maxScrollLeft, newScrollLeft));
  };

  const handleMouseUp = () => {
    if (timelineRef.current) {
      timelineRef.current.style.scrollBehavior = 'smooth'; // Re-enable smooth scroll
      timelineRef.current.style.scrollSnapType = 'x mandatory'; // Re-enable snap after drag
    }
    setIsDragging(false);
    // Reset hasDragged after a short delay to allow click detection
    setTimeout(() => setHasDragged(false), 100);
  };

  const handleMouseLeave = () => {
    if (timelineRef.current) {
      timelineRef.current.style.scrollBehavior = 'smooth'; // Re-enable smooth scroll
      timelineRef.current.style.scrollSnapType = 'x mandatory'; // Re-enable snap after drag
    }
    setIsDragging(false);
    setTimeout(() => setHasDragged(false), 100);
  };

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

  // Scroll to the far right (most recent) on mount and center it
  useEffect(() => {
    const centerLastCard = () => {
      if (timelineRef.current && cardRefs.current[educationData.length - 1]) {
        const lastCard = cardRefs.current[educationData.length - 1];
        if (lastCard && lastCard.offsetWidth > 0) {
          const container = timelineRef.current;
          const cardCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2;
          const containerCenter = container.offsetWidth / 2;
          container.scrollLeft = cardCenter - containerCenter;
          return true;
        }
      }
      return false;
    };

    // Try immediately
    if (!centerLastCard()) {
      // If cards aren't rendered yet, try with increasing delays
      const timer1 = setTimeout(() => {
        if (!centerLastCard()) {
          const timer2 = setTimeout(centerLastCard, 300);
          return () => clearTimeout(timer2);
        }
      }, 100);
      
      return () => clearTimeout(timer1);
    }
  }, []);

  // Track which card is in the center
  useEffect(() => {
    let rafId: number;
    let isScrolling = false;
    
    const updateCenterIndex = () => {
      if (!timelineRef.current) return;
      
      const container = timelineRef.current;
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      
      let closestIndex = 0;
      let closestDistance = Infinity;
      
      cardRefs.current.forEach((card, index) => {
        if (card) {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const distance = Math.abs(cardCenter - containerCenter);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });
      
      setCenterIndex(closestIndex);
      isScrolling = false;
    };
    
    const handleScroll = () => {
      // Use requestAnimationFrame for smooth, optimized updates
      if (!isScrolling) {
        isScrolling = true;
        rafId = requestAnimationFrame(updateCenterIndex);
      }
    };
    
    const container = timelineRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      updateCenterIndex(); // Initial check
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
        if (rafId) cancelAnimationFrame(rafId);
      };
    }
  }, []);

  // Close modal when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedEdu(null);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedEdu(null);
      }
    };

    if (selectedEdu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('data-modal-open', 'true');
    } else {
      document.body.style.overflow = 'unset';
      document.body.removeAttribute('data-modal-open');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
      document.body.removeAttribute('data-modal-open');
    };
  }, [selectedEdu]);

  return (
    <section id="education" className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-1">
      {/* Wisps */}
      <div ref={wispsRef} className="absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-outfit text-5xl md:text-6xl text-center mb-16 text-fuchsia-300 drop-shadow-[0_0_20px_rgba(217,70,239,0.5)]">
          Education
        </h2>
        
        <div className="relative">
          {/* Horizontal line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent hidden md:block" />
          
          {/* Timeline items */}
          <div 
            ref={timelineRef} 
            className={`flex overflow-x-auto pb-8 gap-8 md:gap-12 snap-x snap-mandatory pt-8 select-none hide-scrollbar ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ 
              paddingLeft: 'calc(50% - 10rem)', 
              paddingRight: 'calc(50% - 10rem)'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {[...educationData].reverse().map((edu, index) => {
              const isCentered = index === centerIndex;
              const distanceFromCenter = Math.abs(index - centerIndex);
              
              return (
                <div
                  key={edu.id}
                  ref={(el) => { cardRefs.current[index] = el; }}
                  className={`flex-shrink-0 w-80 snap-center transition-all duration-500 ease-out ${
                    isCentered 
                      ? 'opacity-100' 
                      : 'opacity-60'
                  }`}
                  style={{
                    filter: isCentered ? 'blur(0px)' : `blur(${distanceFromCenter * 0.8}px)`
                  }}
                >
                  {/* Marker - aligned with the line */}
                  <div className="flex justify-center -mt-8 mb-4">
                    <div className={`w-16 h-16 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.3),rgba(168,85,247,0.1))] border-2 border-fuchsia-500 relative animate-rune-glow flex items-center justify-center z-10 transition-all duration-500`}>
                      <span className="text-2xl text-fuchsia-300 transition-all duration-500">✦</span>
                    </div>
                  </div>

                  {/* Content card */}
                  <button
                    onClick={() => handleCardClick(edu, index)}
                    className={`w-full text-left bg-black/40 border rounded-lg p-5 hover:bg-black/50 hover:border-fuchsia-400 transition-all duration-500 cursor-pointer ${
                      isCentered 
                        ? 'border-fuchsia-500/50 shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]' 
                        : 'border-fuchsia-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]'
                    }`}
                  >
                    <div className="text-xs text-fuchsia-200 font-semibold mb-2">
                      {edu.year}
                    </div>
                    <h3 className="font-outfit text-lg text-fuchsia-300 mb-2 leading-tight">
                      {edu.title.split(' – ').map((part, idx) => (
                        <span key={idx}>
                          {part}
                          {idx < edu.title.split(' – ').length - 1 && <br />}
                        </span>
                      ))}
                    </h3>
                    <p className="text-fuchsia-200 font-semibold mb-2 text-sm">
                      {edu.institution}
                    </p>
                    
                    <div className="mt-3 text-xs text-purple-100/60 italic">
                      {isCentered ? 'Click for details →' : 'Click to focus'}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
          
          {/* Scroll hint */}
          <div className="text-center mt-6 text-fuchsia-300/50 text-xs">
            ← Drag to explore →
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedEdu && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="relative bg-black/90 border-2 border-fuchsia-500/50 rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-[0_0_50px_rgba(168,85,247,0.4)] animate-fade-in flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedEdu(null)}
              className="absolute top-4 right-4 text-fuchsia-300 hover:text-fuchsia-200 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-8">
              <div className="text-sm text-fuchsia-200 font-semibold mb-3">
                {selectedEdu.year}
              </div>
            
            <h3 className="font-outfit text-3xl md:text-4xl text-fuchsia-300 mb-2">
              {selectedEdu.title.split(' – ').map((part, idx) => (
                <span key={idx}>
                  {part}
                  {idx < selectedEdu.title.split(' – ').length - 1 && <br />}
                </span>
              ))}
            </h3>
            
            <p className="text-fuchsia-200 font-semibold text-lg mb-6">
              {selectedEdu.institution}
            </p>
            
            {selectedEdu.description && (
              <p className="text-purple-100/85 mb-4">
                {selectedEdu.description}
              </p>
            )}
            
            {selectedEdu.specializations && selectedEdu.specializations.length > 0 && (
              <div className="mb-4">
                <span className="text-fuchsia-200 text-base font-semibold">Specializations: </span>
                <span className="text-purple-100/85">{selectedEdu.specializations.join(", ")}</span>
              </div>
            )}
            
            {selectedEdu.minors && selectedEdu.minors.length > 0 && (
              <div className="mb-4">
                <span className="text-fuchsia-200 text-base font-semibold">Minors: </span>
                <span className="text-purple-100/85">{selectedEdu.minors.join(", ")}</span>
              </div>
            )}
            
            {selectedEdu.awards && selectedEdu.awards.length > 0 && (
              <div className="mb-4">
                <span className="text-fuchsia-200 text-base font-semibold">Awards: </span>
                <span className="text-purple-100/85">{selectedEdu.awards.join(", ")}</span>
              </div>
            )}
            
            {selectedEdu.activities && selectedEdu.activities.length > 0 && (
              <div className="mb-4">
                <div className="text-fuchsia-200 text-base font-semibold mb-2">Activities:</div>
                <ul className="text-purple-100/85 space-y-2">
                  {selectedEdu.activities.map((activity, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-fuchsia-300 mr-2">•</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedEdu.projects && selectedEdu.projects.length > 0 && (
              <div className="mb-4">
                <span className="text-fuchsia-200 text-base font-semibold">Final Year Project: </span>
                <span className="text-purple-100/85 italic">{selectedEdu.projects.join(", ")}</span>
              </div>
            )}
            
            {selectedEdu.exchange && (
              <div className="mt-6 pt-4 border-t border-fuchsia-500/30">
                <span className="text-fuchsia-200 text-base font-semibold">Exchange: </span>
                <span className="text-purple-100/85">{selectedEdu.exchange}</span>
              </div>
            )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

