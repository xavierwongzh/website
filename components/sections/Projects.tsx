"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/types";

const projects: Project[] = [
  {
    id: "1",
    icon: "🍄",
    title: "Data Visualization Platform",
    description: "Interactive dashboard for exploring complex datasets with beautiful visualizations",
    tags: ["Python", "D3.js", "React"],
    link: "#",
  },
  {
    id: "2",
    icon: "✨",
    title: "ML Prediction Model",
    description: "Machine learning model for predictive analytics with 95% accuracy",
    tags: ["TensorFlow", "Python", "Jupyter"],
    link: "#",
  },
  {
    id: "3",
    icon: "🌙",
    title: "Creative Portfolio",
    description: "Collection of digital art pieces exploring the intersection of code and creativity",
    tags: ["p5.js", "WebGL", "CSS"],
    link: "#",
  },
  {
    id: "4",
    icon: "🔮",
    title: "Analytics Dashboard",
    description: "Real-time analytics platform for business intelligence and decision making",
    tags: ["SQL", "Tableau", "Power BI"],
    link: "#",
  },
];

export function Projects() {
  return (
    <section id="projects" className="relative min-h-screen flex items-center justify-center overflow-hidden projects-bg pb-20 -mt-1">
      {/* Forest floor background */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_20%_80%,rgba(27,94,32,0.2),transparent_40%)]" />
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_80%_80%,rgba(38,166,154,0.15),transparent_40%)]" />
      </div>

      {/* Grass particles */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[rgba(27,94,32,0.1)] to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-outfit text-5xl md:text-6xl text-center mb-12 text-forest-teal drop-shadow-[0_0_20px_rgba(77,208,225,0.5)]">
          Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group relative bg-forest-navy-light/30 border-forest-teal/20 hover:border-forest-teal hover:shadow-[0_10px_40px_rgba(77,208,225,0.3)] transition-all duration-400 hover:-translate-y-3 cursor-pointer overflow-hidden"
            >
              {/* Project glow effect */}
              <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(77,208,225,0.1),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

              <CardHeader>
                <div className="text-5xl mb-4 filter drop-shadow-[0_0_10px_rgba(77,208,225,0.5)]">
                  {project.icon}
                </div>
                <CardTitle className="font-outfit text-2xl text-forest-teal">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-forest-silver">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-forest-emerald/20 text-forest-emerald rounded-xl"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant="ghost"
                  className="text-forest-teal hover:text-forest-white group/btn"
                  asChild
                >
                  <a href={project.link} className="flex items-center gap-2">
                    View Project
                    <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

