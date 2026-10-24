import React from 'react';
import { Cloud, Trophy, Star, ExternalLink, Code2 } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { audioEngine } from '../utils/audioEngine';

export default function AchievementsSection() {
  const { resumeData } = useResume();
  const { achievements = [], certifications = [], sectionsVisibility = {} } = resumeData;

  if (sectionsVisibility && sectionsVisibility.achievements === false) {
    return null;
  }

  const milestoneIcons = [
    { icon: Cloud, bg: 'bg-amber-950/40', border: 'border-amber-500/30', color: 'text-amber-400' },
    { icon: Trophy, bg: 'bg-purple-950/40', border: 'border-purple-500/30', color: 'text-purple-400' },
    { icon: Star, bg: 'bg-indigo-950/40', border: 'border-indigo-500/30', color: 'text-indigo-400' },
  ];

  return (
    <section id="achievements" className="py-24 relative overflow-hidden bg-[var(--bg-primary,#030712)] border-t border-slate-900/80">
      {/* Background accents */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 tracking-tight">
            Achievements &amp; Certifications
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-1 font-medium">
            Milestones, credentials &amp; recognitions
          </p>
        </div>

        {/* Top Row: Milestone Cards */}
        {achievements.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {achievements.map((item, idx) => {
              const config = milestoneIcons[idx % milestoneIcons.length];
              const IconComponent = config.icon;

              return (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-sm hover:shadow-[0_8px_30px_rgba(0,240,255,0.1)]"
                >
                  <div>
                    {/* Milestone Icon */}
                    <div className={`w-12 h-12 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center ${config.color} mb-4`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Title & Organization */}
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 mt-1">
                      {item.organization}
                    </p>

                    <p className="text-xs font-mono text-cyan-400/80 mt-1">
                      {item.year}
                    </p>

                    {item.description && (
                      <p className="text-xs text-slate-300/80 mt-2 line-clamp-3">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* View Action Button */}
                  {item.url && item.url !== '#' && (
                    <div className="pt-6">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => audioEngine.playClick()}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <span>{item.actionText || 'View Credential'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Section: Certifications */}
        {certifications.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Validated Credentials
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {certifications.map((cert, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors block truncate">
                      {cert.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {cert.issuer} {cert.year ? `(${cert.year})` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Caption */}
        <div className="mt-14 text-center">
          <span className="text-[11px] font-mono text-slate-500 tracking-wider">
            Achievements &amp; Certifications
          </span>
        </div>

      </div>
    </section>
  );
}
