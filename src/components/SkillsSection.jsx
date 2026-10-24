import React from 'react';
import { Code2, Layout, Server, Database, Cloud, Wrench, Cpu, Terminal } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export default function SkillsSection() {
  const { resumeData } = useResume();
  const { skills = [], sectionsVisibility = {} } = resumeData;

  if (sectionsVisibility && sectionsVisibility.skills === false) {
    return null;
  }

  const categoryIcons = {
    "Programming Languages": Code2,
    "Frontend Development": Layout,
    "Backend Development": Server,
    "Databases": Database,
    "Cloud & DevOps": Cloud,
    "Tools & Platforms": Wrench,
    "AI & Machine Learning": Cpu,
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-[var(--bg-primary,#030712)] border-t border-slate-900/80">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 tracking-tight">
            Technical Skills
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-1 font-medium">
            Technologies, frameworks &amp; architectures
          </p>
        </div>

        {/* Modular Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((categoryGroup, idx) => {
            const IconComponent = categoryIcons[categoryGroup.category] || Terminal;

            return (
              <div 
                key={categoryGroup.category || idx}
                className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-sm hover:shadow-[0_8px_30px_rgba(0,240,255,0.1)]"
              >
                {/* Card Title Row */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {categoryGroup.category}
                  </h3>
                </div>

                {/* Tech Pills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {categoryGroup.items && categoryGroup.items.map((tech) => (
                    <div 
                      key={tech.name}
                      className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-cyan-500/30 transition-all flex flex-col items-center justify-center text-center gap-1.5 group/tech"
                    >
                      {/* Tech Tag / Monogram Icon */}
                      <span 
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shadow-inner"
                        style={{
                          backgroundColor: `${tech.color || '#00f0ff'}15`,
                          color: tech.color || '#00f0ff',
                          border: `1px solid ${tech.color || '#00f0ff'}35`,
                        }}
                      >
                        {tech.tag || tech.name.slice(0, 2).toUpperCase()}
                      </span>

                      {/* Tech Name */}
                      <span className="text-[11px] text-slate-300 font-medium truncate max-w-full">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Caption */}
        <div className="mt-14 text-center">
          <span className="text-[11px] font-mono text-slate-500 tracking-wider">
            Skills Section — Technology Matrix
          </span>
        </div>

      </div>
    </section>
  );
}
