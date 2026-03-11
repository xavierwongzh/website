"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { WorkExperience } from "@/types";

const workData: WorkExperience[] = [
  {
    id: "1",
    year: "Aug 2024 – Jan 2025",
    title: "Data Analyst – Internship",
    company: "Razer Inc.",
    location: "Singapore",
    description: "Developed interactive dashboards, automated reporting workflows,\nand applied machine learning for data-driven marketing decisions",
    responsibilities: [
      "Developed, maintained, and revamped interactive dashboards to analyze marketing impact on sales, standardize revenue mapping, and resolve issues, enabling data-driven decision-making across teams",
      "Implemented automated data uploads to SFTP servers, scheduled SharePoint report distributions, and managed daily to monthly email reports using Power Automate, boosting data transfer efficiency by 25%",
      "Migrated SFMC SFTP server to Razer SFTP server, streamlining data transfers and enhancing security protocols",
      "Spearheaded real-time reporting solutions for high-demand events (Black Friday/Cyber Monday) without relying on Power BI Premium",
      "Investigated and applied machine learning techniques for customer segmentation and revenue forecasting",
      "Migrated materialized views to DBT tables to enhance data consistency and streamline analytical workflows",
      "Collaborated with stakeholders to understand business questions and data requirements, conducting ad-hoc data pulls and in-depth analyses",
      "Documented complex workflows on Atlassian, promoting cross-team knowledge sharing"
    ],
    achievements: [
      "Identified an alternative solution to an SAP feature enhancement, saving the company $2M",
      "Boosted data transfer efficiency by 25% through automation"
    ],
    technologies: ["SQL", "Power BI", "Power Automate", "Python", "Machine Learning", "DAX", "Salesforce Marketing Cloud"]
  },
  {
    id: "2",
    year: "Sep 2023 – Dec 2023",
    title: "Undergrad TA\n10.013 Modelling and Analysis (Calc 1)",
    company: "Singapore University of Technology and Design (SUTD)",
    location: "Singapore",
    description: "Assisted professors in teaching students university-level Mathematics, \nfostering mathematical modeling and problem-solving skills",
    responsibilities: [
      "Guided students through mathematical modeling and problem-solving techniques",
      "Supported lesson planning, assessments, and one-on-one consultations",
      "Helped students apply mathematical principles to turn realistic problems into mathematical models"
    ],
    technologies: ["Mathematical Modeling", "Teaching", "Communication", "Critical Thinking"]
  },
  {
    id: "3",
    year: "May 2023 – Jul 2023",
    title: "RPA Specialist – Transformation & Process Re-Engineering – (National Service Completion)",
    company: "Republic of Singapore Navy",
    location: "Singapore",
    description: "Developed automation solutions and drafted business cases for \nprocess transformation initiatives",
    responsibilities: [
      "Developed Telegram bot in Google Apps Script for automated communications",
      "Drafted Business Cases and Contracts for Outsourcing initiatives",
      "Designed infographics for welfare events to improve internal communications",
      "Worked on RPA Outlook Automation to streamline email workflows",
      "Trained new servicemen in the field and key operational procedures"
    ],
    technologies: ["UiPath", "JavaScript", "C#", "Critical Thinking", "Google Apps Script"]
  },
  {
    id: "4",
    year: "Sep 2022 – Mar 2023",
    title: "Program Director",
    company: "SUTD Makerspace",
    location: "Singapore",
    description: "Planned and organized workshops and projects, including managing the \nSUTD Open House 2023 showcase booth",
    responsibilities: [
      "Planned and organized Cardboard Automata Workshop",
      "Planned and assisted in Acrylic Lamp Workshop",
      "Planned and organized Air Hockey table Project",
      "Planned and assisted in the Fifth Row Showcase Booth at SUTD Open House 2023 (Feb 2023)"
    ],
    technologies: ["CAD", "Project Planning", "Project Management", "Event Planning", "3D Printing", "Conducting Workshops"]
  },
  {
    id: "5",
    year: "Jan 2021 – Sep 2022",
    title: "RPA Specialist – Transformation & Process Re-Engineering – (National Service)",
    company: "Republic of Singapore Navy",
    location: "Singapore",
    description: "Developed UiPath automation solutions and \ntrained servicemen in RPA skills and process documentation",
    responsibilities: [
      "Created step-by-step guides for admin processes through requirement gathering",
      "Developed Robotic Process Automation solutions in UiPath",
      "Created user manuals and technical documentation for automation processes",
      "Coached servicemen in basic Robotic Process Automation skills to encourage automation adoption",
      "Assisted users to complete their own Robotic Process Automation projects",
      "Trained new servicemen in the field and key operational procedures"
    ],
    technologies: ["Communication", "Team Leadership", "UiPath", "C#", "VBA"]
  },
  {
    id: "6",
    year: "Oct 2019 – Mar 2020",
    title: "Research Internship",
    company: "Transforma Robotics",
    location: "Singapore",
    description: "Conducted research on LiDAR technology and SLAM algorithms and \nintegrated SLAM data into a mobile application",
    technologies: ["ROS", "Visual SLAM", "C++", "LiDAR", "Python"]
  },
];

export function WorkExperience() {
  const wispsRef = useRef<HTMLDivElement>(null);
  const [selectedWork, setSelectedWork] = useState<WorkExperience | null>(null);
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
        setSelectedWork(null);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedWork(null);
      }
    };

    if (selectedWork) {
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
  }, [selectedWork]);

  return (
    <section id="experience" className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-1">
      {/* Wisps */}
      <div ref={wispsRef} className="absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <h2 className="font-outfit text-5xl md:text-6xl text-center mb-12 text-fuchsia-300 drop-shadow-[0_0_20px_rgba(217,70,239,0.5)]">
          Work Experience
        </h2>

        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          {workData.map((work) => (
            <button
              key={work.id}
              onClick={() => setSelectedWork(work)}
              className="w-full text-left bg-black/40 border border-fuchsia-500/30 rounded-2xl p-6 hover:bg-black/50 hover:border-fuchsia-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div>
                  <h3 className="font-outfit text-xl md:text-2xl text-fuchsia-300 leading-tight whitespace-pre-line">
                    {work.title}
                  </h3>
                  <p className="text-fuchsia-200 font-semibold mt-1">
                    {work.company}
                  </p>
                  {work.location && (
                    <p className="text-fuchsia-200/70 text-sm mt-1">
                      📍 {work.location}
                    </p>
                  )}
                </div>
                <div className="text-sm text-fuchsia-200/80 font-semibold md:text-right">
                  {work.year}
                </div>
              </div>

              {work.description && (
                <p className="mt-4 text-purple-100/80 italic whitespace-pre-line">
                  {work.description}
                </p>
              )}

              {(work.achievements?.length || work.technologies?.length) ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {work.achievements?.slice(0, 2).map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2.5 py-1 rounded-full bg-fuchsia-900/35 border border-fuchsia-500/25 text-fuchsia-200/90"
                    >
                      {item}
                    </span>
                  ))}
                  {work.technologies?.slice(0, 4).map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2.5 py-1 rounded-full bg-black/30 border border-fuchsia-500/20 text-purple-100/85"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-3 text-xs text-purple-100/60 italic">
                Click for details →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedWork && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="relative bg-black/90 border-2 border-fuchsia-500/50 rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-[0_0_50px_rgba(168,85,247,0.4)] animate-fade-in flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedWork(null)}
              className="absolute top-4 right-4 text-fuchsia-300 hover:text-fuchsia-200 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-8">
              <div className="text-sm text-fuchsia-200 font-semibold mb-3">
                {selectedWork.year}
              </div>
            
            <h3 className="font-outfit text-3xl md:text-4xl text-fuchsia-300 mb-2 whitespace-pre-line">
              {selectedWork.title}
            </h3>
            
            <p className="text-fuchsia-200 font-semibold text-lg mb-2">
              {selectedWork.company}
            </p>
            
            {selectedWork.location && (
              <p className="text-fuchsia-200/70 mb-6">
                📍 {selectedWork.location}
              </p>
            )}
            
            {selectedWork.description && (
              <p className="text-purple-100/85 mb-4 italic whitespace-pre-line">
                {selectedWork.description}
              </p>
            )}
            
            {selectedWork.responsibilities && selectedWork.responsibilities.length > 0 && (
              <div className="mb-4">
                <div className="text-fuchsia-200 text-base font-semibold mb-2">Responsibilities:</div>
                <ul className="text-purple-100/85 space-y-2">
                  {selectedWork.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-fuchsia-300 mr-2">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedWork.achievements && selectedWork.achievements.length > 0 && (
              <div className="mb-4">
                <div className="text-fuchsia-200 text-base font-semibold mb-2">Key Achievements:</div>
                <ul className="text-purple-100/85 space-y-2">
                  {selectedWork.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-fuchsia-300 mr-2">✓</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedWork.technologies && selectedWork.technologies.length > 0 && (
              <div className="mt-6 pt-4 border-t border-fuchsia-500/30">
                <span className="text-fuchsia-200 text-base font-semibold">Technologies: </span>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedWork.technologies.map((tech, idx) => (
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
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

