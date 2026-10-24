import React, { useState } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Github } from './SocialIcons';
import { useResume } from '../context/ResumeContext';
import ProjectModal from './ProjectModal';
import { audioEngine } from '../utils/audioEngine';

// Interactive 3D Tilt Project Card
function TiltProjectCard({ project, onSelect, reducedMotion }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -10, y: x * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: reducedMotion ? 'none' : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className="rounded-2xl overflow-hidden bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 flex flex-col justify-between group shadow-lg hover:shadow-[0_10px_30px_rgba(0,240,255,0.15)]"
    >
      <div>
        {/* Project Screenshot Container */}
        <div 
          className="relative h-44 sm:h-48 overflow-hidden bg-slate-950 cursor-pointer"
          onClick={() => {
            audioEngine.playClick();
            onSelect(project);
          }}
        >
          <img 
            src={project.image || `/project-${project.id}.jpg`} 
            alt={project.title}
            onError={(e) => {
              e.currentTarget.src = '/project-lawshield.jpg';
            }}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        </div>

        {/* Project Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <h3 
              className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer"
              onClick={() => onSelect(project)}
            >
              {project.title}
            </h3>
            {project.category && (
              <span className="text-[10px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 shrink-0">
                {project.category}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {project.tagline}
          </p>

          {/* Tech Badges Row */}
          {project.tech && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.tech.map((t) => (
                <span 
                  key={t}
                  className="px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-medium text-slate-400"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-5 pt-0 flex items-center gap-3">
        {(project.liveUrl || project.demo) && (
          <a
            href={project.liveUrl || project.demo}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              audioEngine.playClick();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700/80 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-all duration-200 shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Demo</span>
          </a>
        )}

        {(project.githubUrl || project.github) && (
          <a
            href={project.githubUrl || project.github}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              audioEngine.playClick();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 hover:border-slate-600 text-xs font-semibold text-slate-300 hover:text-white transition-all duration-200 shadow-sm"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const { resumeData, reducedMotion } = useResume();
  const { projects = [], sectionsVisibility = {} } = resumeData;
  const [selectedProject, setSelectedProject] = useState(null);
  const [activePageIndex, setActivePageIndex] = useState(0);

  if (sectionsVisibility && sectionsVisibility.projects === false) {
    return null;
  }

  // Display projects in groups of 3
  const pageSize = 3;
  const totalPages = Math.ceil(projects.length / pageSize) || 1;
  const startIndex = (activePageIndex % totalPages) * pageSize;
  const currentProjects = projects.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => {
    audioEngine.playClick();
    setActivePageIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    audioEngine.playClick();
    setActivePageIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-[var(--bg-primary,#030712)] border-t border-slate-900/80">
      {/* Background accents */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading & Carousel Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 tracking-tight">
              Featured Projects
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-1 font-medium">
              Real-world systems, 3D engines, and AI platforms
            </p>
          </div>

          {/* Carousel Arrows */}
          {projects.length > 3 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-300 transition-all hover:scale-105"
                title="Previous projects"
                aria-label="Previous projects"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-300 transition-all hover:scale-105"
                title="Next projects"
                aria-label="Next projects"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map((project) => (
            <TiltProjectCard
              key={project.id}
              project={project}
              onSelect={setSelectedProject}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Carousel Indicator Dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  audioEngine.playClick();
                  setActivePageIndex(idx);
                }}
                className={`transition-all rounded-full ${
                  activePageIndex === idx 
                    ? 'w-6 h-2 bg-cyan-400 shadow-[0_0_8px_#00f0ff]' 
                    : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Page ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Section Caption */}
        <div className="mt-14 text-center">
          <span className="text-[11px] font-mono text-slate-500 tracking-wider">
            Projects Section — Interactive 3D Tilt Cards
          </span>
        </div>

      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
