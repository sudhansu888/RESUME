import React from 'react';
import { X, ExternalLink, CheckCircle2, Star, Cpu, Layers } from 'lucide-react';
import { Github } from './SocialIcons';

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] glass-panel border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
              {project.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{project.stars} stars</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {project.title}
            </h2>
            <p className="text-cyan-400 text-sm font-medium mt-1">
              {project.tagline}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-sm text-slate-300 leading-relaxed">
            {project.description}
          </div>

          {/* Architecture Highlights */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Key Architectural Benchmarks</span>
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {project.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Matrix */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Technologies &amp; Libraries</span>
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-lg bg-slate-800/70 border border-slate-700/80 text-xs font-mono text-cyan-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-t border-slate-800">
          <div className="text-xs text-slate-500 font-mono">
            Interactive Project Inspect
          </div>
          <div className="flex items-center gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 glass-panel hover:text-white hover:border-cyan-500/40 transition"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repo</span>
            </a>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition shadow-lg shadow-cyan-500/20"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demonstration</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
