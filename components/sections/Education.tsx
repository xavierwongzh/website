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
  {
    id: "3",
    year: "Apr 2016 – Mar 2017",
    title: "Polytechnic Foundation Programme\nMechatronics and Aerospace Engineering",
    institution: "Temasek Polytechnic",
  },
];

export function Education() {
  const wispsRef = useRef<HTMLDivElement>(null);
  const [selectedEdu, setSelectedEdu] = useState<Education | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          {educationData.map((edu) => (
            <button
              key={edu.id}
              onClick={() => setSelectedEdu(edu)}
              className="w-full text-left bg-black/40 border border-fuchsia-500/30 rounded-2xl p-6 hover:bg-black/50 hover:border-fuchsia-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div>
                  <h3 className="font-outfit text-xl md:text-2xl text-fuchsia-300 leading-tight whitespace-pre-line">
                    {edu.title}
                  </h3>
                  <p className="text-fuchsia-200 font-semibold mt-1">
                    {edu.institution}
                  </p>
                </div>
                <div className="text-sm text-fuchsia-200/80 font-semibold md:text-right">
                  {edu.year}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {edu.specializations?.slice(0, 2).map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-full bg-fuchsia-900/35 border border-fuchsia-500/25 text-fuchsia-200/90"
                  >
                    {item}
                  </span>
                ))}
                {edu.minors?.slice(0, 2).map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-full bg-black/30 border border-fuchsia-500/20 text-purple-100/85"
                  >
                    {item}
                  </span>
                ))}
                {edu.awards?.slice(0, 2).map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-full bg-black/30 border border-fuchsia-500/20 text-purple-100/85"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-3 text-xs text-purple-100/60 italic">
                Click for details →
              </div>
            </button>
          ))}
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
            
            <h3 className="font-outfit text-3xl md:text-4xl text-fuchsia-300 mb-2 whitespace-pre-line">
              {selectedEdu.title}
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

