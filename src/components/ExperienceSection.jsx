import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioEngine';

export default function ExperienceSection() {
  const { resumeData } = useResume();
  const { journey = [], experience = [], education = [], sectionsVisibility = {} } = resumeData;
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (sectionsVisibility && sectionsVisibility.experience === false) {
    return null;
  }

  // Construct timeline items dynamically if journey is empty
  const timelineItems = journey.length > 0 ? journey : [
    ...experience.map(e => ({
      period: e.period,
      title: e.role,
      subtitle: e.company,
      detail: e.description || e.achievements?.[0] || '',
      type: 'experience',
      color: 'cyan',
    })),
    ...education.map(ed => ({
      period: ed.period,
      title: ed.degree,
      subtitle: ed.institution,
      detail: ed.grade || '',
      type: 'education',
      color: 'purple',
    }))
  ];

  const triggerOrbEnergy = () => {
    audioEngine.playHoloBurst();
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f0ff', '#8b5cf6', '#3b82f6', '#ec4899']
    });
  };

  return (
    <section id="experience" className="py-24 relative overflow-hidden bg-[var(--bg-primary,#030712)] border-t border-slate-900/80">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 tracking-tight">
            Journey
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-1 font-medium">
            Education, Experience &amp; Engineering Growth
          </p>
        </div>

        {/* 2-Column Grid: Timeline on Left, 3D Pedestal on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Vertical Timeline */}
          <div className="lg:col-span-7">
            <div className="relative border-l-2 border-cyan-500/40 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-9">
              {timelineItems.map((item, idx) => (
                <div 
                  key={idx}
                  onMouseEnter={() => {
                    setHoveredIdx(idx);
                    audioEngine.playHover();
                  }}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="relative group transition-all"
                >
                  {/* Glowing Node on Timeline */}
                  <div 
                    className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 transition-all duration-300 ${
                      hoveredIdx === idx
                        ? 'border-cyan-300 scale-125 shadow-[0_0_15px_#00f0ff]'
                        : 'border-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.7)]'
                    }`}
                  />

                  {/* Year Tag */}
                  <span className="text-xs font-mono font-semibold text-cyan-400 tracking-wider">
                    {item.period}
                  </span>

                  {/* Title & Organization */}
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mt-0.5">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>

                  {/* Detail */}
                  {item.detail && (
                    <p className="text-xs text-slate-300/90 mt-1 leading-relaxed">
                      {item.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Holographic Energy Orb Altar */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div 
              className="relative w-[280px] h-[340px] sm:w-[340px] sm:h-[400px] rounded-3xl overflow-hidden border border-cyan-500/30 group cursor-pointer shadow-[0_0_40px_rgba(0,240,255,0.2)] hover:shadow-[0_0_60px_rgba(0,240,255,0.4)] transition-all duration-300"
              onClick={triggerOrbEnergy}
              title="Click to pulse magical energy!"
            >
              <img 
                src="/journey-orb.jpg" 
                alt="3D Floating Energy Orb on Tiered Pedestal" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Ambient Energy Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl pointer-events-none animate-pulse" />
            </div>
          </div>

        </div>

        {/* Section Caption */}
        <div className="mt-14 text-center">
          <span className="text-[11px] font-mono text-slate-500 tracking-wider">
            Experience &amp; Education — Animated Timeline
          </span>
        </div>

      </div>
    </section>
  );
}
