"use client";

import { useEffect, useRef, useState } from "react";
import { X, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/types";

const projects: Project[] = [
  {
    id: "1",
    icon: "🍄",
    title: "Data Visualization Platform",
    description: "Interactive dashboard for exploring complex datasets with beautiful visualizations",
    detailedDescription: "A comprehensive data visualization platform that transforms raw data into meaningful insights through interactive and responsive charts, graphs, and dashboards.",
    duration: "3 months",
    role: "Full Stack Developer",
    tags: ["Python", "D3.js", "React", "Flask", "PostgreSQL"],
    features: [
      "Real-time data processing and visualization",
      "Customizable dashboard layouts with drag-and-drop functionality",
      "Multiple chart types including line, bar, pie, and heatmaps",
      "Export functionality for reports in PDF and PNG formats",
      "Responsive design for mobile and tablet devices"
    ],
    challenges: [
      "Optimizing performance for large datasets (1M+ records)",
      "Implementing smooth animations without compromising responsiveness",
      "Creating an intuitive UX for complex data filtering"
    ],
    outcomes: [
      "Reduced data analysis time by 60%",
      "Adopted by 3 departments for daily reporting",
      "Positive user feedback with 4.5/5 satisfaction rating"
    ],
    githubLink: "#",
    demoLink: "#",
  },
  {
    id: "2",
    icon: "✨",
    title: "ML Prediction Model",
    description: "Machine learning model for predictive analytics with 95% accuracy",
    detailedDescription: "Advanced machine learning model for forecasting business metrics using ensemble methods and deep learning techniques to achieve high prediction accuracy.",
    duration: "2 months",
    role: "Data Scientist",
    tags: ["TensorFlow", "Python", "Jupyter", "Scikit-learn", "Pandas"],
    features: [
      "Time series forecasting with LSTM networks",
      "Feature engineering pipeline with automated selection",
      "Model evaluation dashboard with performance metrics",
      "API endpoint for real-time predictions",
      "Automated model retraining schedule"
    ],
    challenges: [
      "Handling imbalanced dataset with limited historical data",
      "Preventing overfitting while maintaining high accuracy",
      "Deploying model with minimal latency requirements"
    ],
    outcomes: [
      "Achieved 95% prediction accuracy on test set",
      "Improved business forecasting accuracy by 40%",
      "Enabled data-driven decision making across teams"
    ],
    githubLink: "#",
  },
  {
    id: "3",
    icon: "🌙",
    title: "Creative Portfolio",
    description: "Collection of digital art pieces exploring the intersection of code and creativity",
    detailedDescription: "An experimental creative coding portfolio showcasing generative art, interactive installations, and WebGL visualizations that blend technology with artistic expression.",
    duration: "Ongoing",
    role: "Creative Developer",
    tags: ["p5.js", "WebGL", "CSS", "Three.js", "GLSL"],
    features: [
      "Generative art pieces with randomized parameters",
      "Interactive 3D visualizations using WebGL",
      "Audio-reactive animations synchronized with music",
      "Gallery view with smooth transitions",
      "Mobile-optimized touch interactions"
    ],
    challenges: [
      "Optimizing WebGL performance across different devices",
      "Creating accessible interactive experiences",
      "Balancing artistic vision with technical constraints"
    ],
    outcomes: [
      "Featured in 2 digital art exhibitions",
      "1000+ visitors within first month",
      "Collaborative opportunities with other artists"
    ],
    demoLink: "#",
  },
  {
    id: "4",
    icon: "🔮",
    title: "Analytics Dashboard",
    description: "Real-time analytics platform for business intelligence and decision making",
    detailedDescription: "Enterprise-grade analytics dashboard providing comprehensive business intelligence through real-time data aggregation, KPI tracking, and predictive insights.",
    duration: "4 months",
    role: "BI Developer",
    tags: ["SQL", "Tableau", "Power BI", "Python", "Azure"],
    features: [
      "Real-time KPI monitoring with automated alerts",
      "Custom report builder with natural language queries",
      "Integration with multiple data sources (CRM, ERP, databases)",
      "Role-based access control for sensitive data",
      "Scheduled report distribution via email"
    ],
    challenges: [
      "Integrating disparate data sources with different schemas",
      "Ensuring data accuracy and consistency across systems",
      "Meeting strict performance requirements for real-time updates"
    ],
    outcomes: [
      "Centralized reporting for 5 business units",
      "Reduced report generation time from hours to minutes",
      "Enabled proactive decision-making with real-time alerts"
    ],
    demoLink: "#",
  },
];

export function Projects() {
  const wispsRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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

      <h2 className="font-outfit text-5xl md:text-6xl text-center mb-12 text-fuchsia-300 drop-shadow-[0_0_20px_rgba(217,70,239,0.5)] relative z-10">
        Projects
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl relative z-10">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="w-full text-left bg-black/50 rounded-2xl p-6 border border-fuchsia-400/30 hover:scale-[1.03] hover:shadow-[0px_0px_28px_rgba(217,70,239,0.35)] transition-all duration-300 cursor-pointer"
          >
            <div className="text-5xl mb-4 filter drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">
              {project.icon}
            </div>
            <h3 className="text-xl font-semibold text-fuchsia-200 mb-2">{project.title}</h3>
            <p className="text-purple-100/80 text-sm mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-fuchsia-900/40 border border-fuchsia-500/30 text-fuchsia-200/90"
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
              <div className="text-5xl mb-4 filter drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">
                {selectedProject.icon}
              </div>
              
              <h3 className="font-outfit text-3xl md:text-4xl text-fuchsia-300 mb-3">
                {selectedProject.title}
              </h3>
              
              {(selectedProject.duration || selectedProject.role) && (
                <div className="flex flex-wrap gap-4 text-sm text-fuchsia-200/70 mb-4">
                  {selectedProject.duration && (
                    <span>⏱️ Duration: {selectedProject.duration}</span>
                  )}
                  {selectedProject.role && (
                    <span>👤 Role: {selectedProject.role}</span>
                  )}
                </div>
              )}
              
              {selectedProject.detailedDescription && (
                <p className="text-purple-100/85 mb-6 leading-relaxed">
                  {selectedProject.detailedDescription}
                </p>
              )}
              
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

