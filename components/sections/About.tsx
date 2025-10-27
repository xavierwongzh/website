"use client";

export function About() {
  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center py-24 px-6">

      {/* Content */}
      <div className="relative z-10 max-w-[58rem] text-center bg-black/35 border border-fuchsia-500/30 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(168,85,247,0.25)]">
        <h2 className="text-4xl font-semibold mb-6 text-fuchsia-300">About Me</h2>
        
        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.3),transparent_70%)] animate-pulse" />
            
            {/* Profile placeholder */}
            <div className="relative z-10">
              <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
                <circle
                  cx="75"
                  cy="75"
                  r="70"
                  fill="#2a1f4a"
                  stroke="url(#profileGradient)"
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#d946ef", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#a855f7", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <text
                  x="75"
                  y="95"
                  textAnchor="middle"
                  fill="#d946ef"
                  fontSize="60"
                  fontFamily="var(--font-outfit)"
                >
                  X
                </text>
              </svg>
            </div>
          </div>
        </div>

        <div className="text-purple-100/85 leading-relaxed mb-6 space-y-4 text-left">
          <p>
            I'm a data analyst and creative technologist with a background in{' '}
            <a 
              href="https://www.sutd.edu.sg/esd/education" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-fuchsia-300 hover:text-fuchsia-200 underline decoration-fuchsia-500/50 hover:decoration-fuchsia-300 transition-colors duration-300"
            >
              Engineering Systems and Design from SUTD
            </a>
            , <br />where I specialized in{' '}
            <a 
              href="https://www.sutd.edu.sg/esd/education/undergraduate/specialisation-tracks/business-analytics-and-operations-research/#tabs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-fuchsia-300 hover:text-fuchsia-200 underline decoration-fuchsia-500/50 hover:decoration-fuchsia-300 transition-colors duration-300"
            >
              Business Analytics & Operations Research
            </a>
            {' '}and{' '}
            <a 
              href="https://www.sutd.edu.sg/esd/education/undergraduate/specialisation-tracks/aviation-systems/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-fuchsia-300 hover:text-fuchsia-200 underline decoration-fuchsia-500/50 hover:decoration-fuchsia-300 transition-colors duration-300"
            >
              Aviation Systems
            </a>
            , along with<br /> minors in{' '}
            <a 
              href="https://www.sutd.edu.sg/istd/education/undergraduate/minors/ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-fuchsia-300 hover:text-fuchsia-200 underline decoration-fuchsia-500/50 hover:decoration-fuchsia-300 transition-colors duration-300"
            >
              Artificial Intelligence
            </a>
            {' '}and{' '}
            <a 
              href="https://www.sutd.edu.sg/hass/education/undergraduate/minors/design-technology-and-society-minor/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-fuchsia-300 hover:text-fuchsia-200 underline decoration-fuchsia-500/50 hover:decoration-fuchsia-300 transition-colors duration-300"
            >
              Design, Technology, and Society
            </a>
            .
          </p>
          
          <p>
            I enjoy blending analytics with aesthetic storytelling, connecting data, design and<br /> AI to create experiences that feel both useful and a little bit magical. From machine learning to <br />interactive visuals, my work bridges logic and creativity to transform complexity into clarity.
          </p>
          
          <p>
            Driven by curiosity and a love for meaningful insight, I aim to build tools and systems that do more than <br />process information. They reveal patterns, inspire understanding, and make technology feel more human.
          </p>
        </div>
      </div>
    </section>
  );
}

