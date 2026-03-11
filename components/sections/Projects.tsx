"use client";

import { useEffect, useRef, useState } from "react";
import { X, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/types";

const projects: Project[] = [
  {
    id: "1",
    featured: true,
    mark: "MILP",
    title: "DUBY (Duty Buddy)",
    subtitle: "Optimization-driven nurse rostering",
    description:
      "Automates 14‑day nurse schedules under staffing, labor, and fairness constraints.",
    detailedDescription:
      "Designed a workforce scheduling system for hospital wards that generates 14‑day rosters for Registered Nurses (RN), Enrolled Nurses (EN), and Healthcare Assistants (HCA). The core engine formulates a Mixed‑Integer Linear Program (MILP) in Python (Pyomo) to optimize shift allocation while respecting coverage, rest rules, leave requests, and fairness for weekends/night shifts. To improve robustness, I added a fallback greedy genetic approach to produce feasible schedules when strict constraints make the MILP infeasible.",
    duration: "Sep 2025 – Present",
    role: "Optimization / Analytics",
    tags: ["Python", "Pyomo", "MILP", "Operations Research", "Workforce Scheduling"],
    features: [
      "Constraint-driven scheduling with coverage and labor rules",
      "Fairness controls for weekend and night shift distribution",
      "Leave requests and rest-rule enforcement",
      "Fallback heuristic to recover feasibility when MILP fails",
    ],
    outcomes: [
      "Automated roster generation for multi-role wards over 14-day horizons",
      "Demonstrated optimization + heuristic strategy for robustness",
    ],
  },
  {
    id: "2",
    featured: true,
    mark: "SIM",
    title: "Runway capacity & surface operations simulation",
    subtitle: "San Diego Intl (KSAN)",
    description:
      "Systems-level runway + ground ops analysis using CAST with realistic demand scenarios.",
    detailedDescription:
      "Conducted a systems-level analysis of runway capacity and surface operations at San Diego International Airport (KSAN). I processed flight movement data (Flightradar24) to generate realistic demand scenarios and traffic profiles, then evaluated operational strategies in CAST (e.g., taxiway restrictions, departure queue management, runway exit configurations, and adaptive arrival separation). The study compared theoretical runway capacity against simulated performance and identified bottlenecks such as taxiway geometry, apron congestion, and pushback queues.",
    duration: "Sep 2025 – Dec 2025",
    role: "Simulation / Analytics",
    tags: ["CAST", "Airport Simulation", "Aviation Systems", "Data Analysis"],
    features: [
      "Demand scenario generation from flight movement data",
      "Strategy comparison across multiple surface-operation policies",
      "Bottleneck identification via throughput and delay propagation analysis",
    ],
    outcomes: [
      "Actionable recommendations to reduce taxi congestion and stabilize runway flow",
    ],
  },
  {
    id: "3",
    featured: true,
    mark: "ABM",
    title: "Pump Protocol",
    subtitle: "Agent-based simulation for petrol station operations",
    description:
      "Interactive simulation to test station configurations and optimize throughput/profitability.",
    detailedDescription:
      "Built an agent-based simulation model of petrol station operations (arrivals, queueing, fueling, departures) to evaluate system performance under different configurations and operational parameters. The tool exposes controls for arrival rates, pump capacity, staffing, and pricing, and visualizes key metrics such as utilization, customer wait time, rejection rates, and profitability in real time.",
    duration: "Jan 2025 – May 2025",
    role: "Simulation / Frontend",
    tags: ["JavaScript", "Agent-Based Modeling", "Simulation", "Data Visualization"],
    features: [
      "Interactive controls for scenario experimentation",
      "Real-time KPI visualization (utilization, wait time, rejection, profit)",
      "Bottleneck discovery through what-if analysis",
    ],
    outcomes: ["A live web demo and video to communicate results clearly"],
  },
  {
    id: "4",
    mark: "QSYS",
    title: "Queue Optima",
    subtitle: "Queueing theory analysis for airport immigration",
    description:
      "M/M/k model to compare queue policies and counter allocations for waiting time + fairness.",
    detailedDescription:
      "Developed a prescriptive analytics tool to evaluate queue management policies for airport immigration operations (LAX case study). Using an M/M/k queueing framework (Poisson arrivals, exponential service times), I compared Unified Queue, Double Queue, and Priority Queue designs and studied how counter allocation and queue structure affect waiting times and system efficiency while prioritizing U.S. citizens and maintaining fairness for international passengers.",
    duration: "May 2024 – Aug 2024",
    role: "Operations Research / Analytics",
    tags: ["Queueing Theory", "Operations Research", "Aviation Operations", "Modeling"],
    features: [
      "Policy comparison (unified/double/priority queue)",
      "Counter allocation experiments and trade-off analysis",
      "Wait time + efficiency evaluation with fairness considerations",
    ],
    outcomes: ["Demonstrated how queue models guide operational policy decisions"],
  },
  {
    id: "5",
    mark: "BI",
    title: "Tai Sin Electric",
    subtitle: "Inventory forecasting & BOM planning (Power BI)",
    description:
      "Forecasting insights + KPI dashboards to improve inventory visibility and replenishment planning.",
    detailedDescription:
      "Collaborated with Tai Sin Electric Limited to build a data-driven inventory forecasting and BOM planning approach. I analyzed transactional and product datasets to identify demand patterns and seasonality, then developed Power BI dashboards to track inventory health, demand trends, and operational KPIs to support faster procurement and production decisions.",
    duration: "Jan 2024 – Apr 2024",
    role: "Data Analytics / BI",
    tags: ["Power BI", "DAX", "Data Analysis", "Forecasting"],
    features: [
      "Interactive dashboards for inventory performance and demand trends",
      "KPI definitions aligned to stakeholder decision-making",
    ],
    outcomes: ["Improved visibility for stock replenishment and BOM planning decisions"],
  },
  {
    id: "6",
    featured: true,
    mark: "GENAI",
    title: "ReVine",
    subtitle: "AI meme-to-video generation",
    description:
      "AI web app that generates personalized Vine memes by inserting a user’s face using reference-to-video generation models.",
    detailedDescription:
      "Built during the Cursor Hackathon Singapore, ReVine is a full-stack web application that lets users upload a face image and generate personalized meme videos based on classic Vine templates. The system orchestrates multiple AI tools for research, prompting, and rapid prototyping, and integrates video generation models hosted on fal with a Supabase backend (storage + authentication) and a fast UI built using Vercel v0. ReVine won 2nd place at the Cursor Hackathon Singapore (fal track) among 500+ participants.",
    duration: "Oct 2025",
    role: "Full-stack / AI application development",
    tags: ["Generative AI", "Video Generation", "Prompt Engineering", "fal", "Supabase", "Vercel v0"],
    features: [
      "Upload a face reference image and generate a meme video",
      "Reference-to-video generation workflow with prompt iteration",
      "Supabase-backed authentication and media storage",
      "Hackathon-first rapid prototyping and deployment pipeline",
    ],
    outcomes: [
      "2nd place — Cursor Hackathon Singapore (fal track)",
      "Demonstrated orchestration of AI tools + full-stack delivery under hackathon constraints",
    ],
  },
  {
    id: "7",
    featured: true,
    mark: "CV",
    title: "PillSnap",
    subtitle: "AI-powered pill identification",
    description:
      "Computer vision pill identification tool that detects, crops, and recognises pills from images to support clinicians and pharmacists.",
    detailedDescription:
      "Developed during the SGHackItRX 2025 hackathon, PillSnap is an AI-powered pill identification system that helps clinicians and pharmacists accurately identify medications from images. The system allows users to capture a photo containing multiple pills, automatically detects and crops individual pills, and identifies them using computer vision models. This reduces manual identification time and supports safer medication reconciliation in clinical workflows.",
    duration: "Aug 2025 – Sep 2025",
    role: "Computer Vision / AI",
    tags: ["Computer Vision", "Image Recognition", "Healthcare AI"],
    features: [
      "Multi-pill image capture with automatic detection and cropping",
      "Computer vision pipeline for pill identification from images",
      "Workflow aligned with clinical medication reconciliation needs",
    ],
    outcomes: [
      "1st Runner-Up — SGHackItRX 2025",
      "Demonstrated potential of AI tools to improve medication safety for healthcare professionals",
    ],
  },
  {
    id: "8",
    mark: "3D/AI",
    title: "Zenpresso Excelsa",
    subtitle: "3D/AI reinterpretation of the Nespresso Pixie",
    description:
      "Conceptual product design project combining Rhino 3D modelling with generative AI exploration.",
    detailedDescription:
      "Zenpresso Excelsa is a visionary reinterpretation of the Nespresso Pixie that blends industrial design with generative AI. Using Rhinoceros 7 for 3D modelling and Stable Diffusion with ControlNet, we explored bold conceptual forms and rapidly iterated from sketches to detailed 3D representations. The project showcases how human design intent and AI-assisted exploration can be combined to accelerate creative concept development.",
    duration: "Sep 2023 – Dec 2023",
    role: "3D Design / Generative AI",
    tags: ["Stable Diffusion", "ControlNet", "Rhino3D"],
    features: [
      "3D remodeling of the Nespresso Pixie in Rhinoceros 7",
      "AI-assisted concept exploration using Stable Diffusion + ControlNet",
      "Rapid iteration from sketches to detailed 3D forms",
    ],
  },
];

function parseStartMonthYear(value?: string): number {
  if (!value) return 0;
  const monthMap: Record<string, number> = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  };

  // Match first occurrence of "Mon YYYY" anywhere in the string.
  const m = value.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b\s+(\d{4})/i);
  if (!m) return 0;

  const mon = monthMap[m[1].toLowerCase()] ?? 0;
  const year = Number(m[2]) || 0;
  if (!year || !mon) return 0;

  // Sort key: YYYYMM
  return year * 100 + mon;
}

export function Projects() {
  const wispsRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const sortedProjects = [...projects].sort(
    (a, b) => parseStartMonthYear(b.duration) - parseStartMonthYear(a.duration)
  );
  const featuredProjects = sortedProjects.filter((p) => p.featured);

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
        setSelectedProject(null);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
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
  }, [selectedProject]);

  return (
    <section id="projects" className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 overflow-hidden">
      {/* Wisps */}
      <div ref={wispsRef} className="absolute inset-0" />

      <h2 className="font-outfit text-5xl md:text-6xl text-center mb-10 text-fuchsia-300 drop-shadow-[0_0_20px_rgba(217,70,239,0.5)] relative z-10">
        Projects
      </h2>

      {featuredProjects.length > 0 && (
        <div className="w-full max-w-6xl relative z-10 mb-10">
          <div className="text-fuchsia-200/80 font-semibold tracking-wide text-sm mb-4">
            Featured Projects
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="w-full text-left bg-black/55 rounded-2xl p-6 border border-fuchsia-400/35 hover:scale-[1.02] hover:shadow-[0px_0px_28px_rgba(217,70,239,0.30)] transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs px-2.5 py-1 rounded-full bg-fuchsia-900/40 border border-fuchsia-500/30 text-fuchsia-200/90">
                    {project.mark ?? "PROJ"}
                  </div>
                  {project.duration && (
                    <div className="text-xs text-purple-100/60">
                      {project.duration}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-fuchsia-200 mb-1">
                  {project.title}
                </h3>
                {project.subtitle && (
                  <div className="text-sm text-fuchsia-200/75 mb-3">
                    {project.subtitle}
                  </div>
                )}
                <p className="text-purple-100/80 text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-black/35 border border-fuchsia-500/20 text-purple-100/85"
                    >
                      {tag}
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
      )}

      <div className="w-full max-w-6xl relative z-10">
        <div className="text-fuchsia-200/80 font-semibold tracking-wide text-sm mb-4">
          All Projects
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="w-full text-left bg-black/45 rounded-2xl p-6 border border-fuchsia-400/25 hover:scale-[1.02] hover:shadow-[0px_0px_24px_rgba(217,70,239,0.24)] transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs px-2.5 py-1 rounded-full bg-black/35 border border-fuchsia-500/20 text-purple-100/85">
                  {project.mark ?? "PROJ"}
                </div>
                {project.role && (
                  <div className="text-xs text-purple-100/60">
                    {project.role}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-fuchsia-200 mb-1">
                {project.title}
              </h3>
              {project.subtitle && (
                <div className="text-sm text-fuchsia-200/75 mb-3">
                  {project.subtitle}
                </div>
              )}
              <p className="text-purple-100/80 text-sm mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-fuchsia-900/30 border border-fuchsia-500/20 text-fuchsia-200/85"
                  >
                    {tag}
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
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="relative bg-black/90 border-2 border-fuchsia-500/50 rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-[0_0_50px_rgba(168,85,247,0.4)] animate-fade-in flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-fuchsia-300 hover:text-fuchsia-200 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="text-xs px-2.5 py-1 rounded-full bg-fuchsia-900/40 border border-fuchsia-500/30 text-fuchsia-200/90">
                  {selectedProject.mark ?? "PROJECT"}
                </div>
                {selectedProject.duration && (
                  <div className="text-xs text-purple-100/60">
                    {selectedProject.duration}
                  </div>
                )}
              </div>
              
              <h3 className="font-outfit text-3xl md:text-4xl text-fuchsia-300 mb-2">
                {selectedProject.title}
              </h3>
              {selectedProject.subtitle && (
                <div className="text-fuchsia-200/80 mb-4">
                  {selectedProject.subtitle}
                </div>
              )}
              
              {(selectedProject.duration || selectedProject.role) && (
                <div className="flex flex-wrap gap-4 text-sm text-fuchsia-200/70 mb-4">
                  {selectedProject.role && (
                    <span>Role: {selectedProject.role}</span>
                  )}
                </div>
              )}
              
              <div className="text-purple-100/85 mb-6 leading-relaxed">
                {selectedProject.detailedDescription ?? selectedProject.description}
              </div>
              
              {selectedProject.features && selectedProject.features.length > 0 && (
                <div className="mb-4">
                  <div className="text-fuchsia-200 text-base font-semibold mb-2">Key Features:</div>
                  <ul className="text-purple-100/85 space-y-2">
                    {selectedProject.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-fuchsia-300 mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedProject.challenges && selectedProject.challenges.length > 0 && (
                <div className="mb-4">
                  <div className="text-fuchsia-200 text-base font-semibold mb-2">Challenges Overcome:</div>
                  <ul className="text-purple-100/85 space-y-2">
                    {selectedProject.challenges.map((challenge, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-fuchsia-300 mr-2">⚡</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedProject.outcomes && selectedProject.outcomes.length > 0 && (
                <div className="mb-4">
                  <div className="text-fuchsia-200 text-base font-semibold mb-2">Outcomes & Impact:</div>
                  <ul className="text-purple-100/85 space-y-2">
                    {selectedProject.outcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-fuchsia-300 mr-2">🎯</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Technologies */}
              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className="mt-6 pt-4 border-t border-fuchsia-500/30">
                  <span className="text-fuchsia-200 text-base font-semibold">Technologies: </span>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedProject.tags.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-sm px-3 py-1.5 rounded-full bg-fuchsia-900/40 border border-fuchsia-500/30 text-fuchsia-200/90"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Links */}
              {(selectedProject.githubLink || selectedProject.demoLink) && (
                <div className="mt-6 pt-4 border-t border-fuchsia-500/30 flex flex-wrap gap-4">
                  {selectedProject.githubLink && (
                    <a
                      href={selectedProject.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-fuchsia-900/40 border border-fuchsia-500/50 rounded-lg text-fuchsia-200 hover:bg-fuchsia-900/60 hover:border-fuchsia-400 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-4 h-4" />
                      View Code
                    </a>
                  )}
                  {selectedProject.demoLink && (
                    <a
                      href={selectedProject.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-fuchsia-900/40 border border-fuchsia-500/50 rounded-lg text-fuchsia-200 hover:bg-fuchsia-900/60 hover:border-fuchsia-400 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

