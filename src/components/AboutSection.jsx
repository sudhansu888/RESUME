import React from 'react';
import { GraduationCap, Cloud, Layers, Box, Brain, Cpu, Sparkles, Award } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export default function AboutSection() {
  const { resumeData } = useResume();
  const { profile, education, certifications, sectionsVisibility } = resumeData;

  if (sectionsVisibility && sectionsVisibility.about === false) {
    return null;
  }

  const interestIconMap = {
    "Full-Stack Development": Layers,
    "3D Graphics & WebGL": Box,
    "AI & Machine Learning": Brain,
    "Cloud Computing": Cloud,
    "System Design": Cpu,
  };

  const topEducation = education?.[0];
  const topCertification = certifications?.[0];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[var(--bg-primary,#030712)] border-t border-slate-900/80">
      {/* Background Glows */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 tracking-tight">
            About Me
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-1 font-medium">
            Turning Ideas into Impact
          </p>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Bio & Credential Cards */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              {profile.bio}
            </p>

            {/* Credential Cards */}
            <div className="space-y-3.5 pt-2">
              
              {/* Education Card */}
              {topEducation && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {topEducation.degree}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      <span className="text-cyan-400 font-medium">{topEducation.grade}</span> • {topEducation.institution}
                    </p>
                  </div>
                </div>
              )}

              {/* AWS / Certification Card */}
              {topCertification && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200">
                  <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {topCertification.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {topCertification.issuer} • {topCertification.badge || topCertification.year}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Hexagonal Portal & Key Interests */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8">
            
            {/* Hexagonal Avatar Portal */}
            <div className="relative group shrink-0">
              {/* Outer Glowing Hex Frame */}
              <div 
                className="w-48 h-52 sm:w-52 sm:h-56 p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_35px_rgba(0,240,255,0.35)] group-hover:shadow-[0_0_50px_rgba(0,240,255,0.55)] transition-all duration-300"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
              >
                <div 
                  className="w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  }}
                >
                  <img 
                    src={profile.photo || "/shyamal.jpg"} 
                    alt={profile.name || "Profile"} 
                    className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Key Interests Box & Quote */}
            <div className="w-full space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Key Interests</span>
                </h4>
                
                <div className="space-y-2">
                  {(profile.keyInterests || [
                    { title: "Full-Stack Development" },
                    { title: "3D Graphics & WebGL" },
                    { title: "AI & Machine Learning" },
                    { title: "Cloud Computing" },
                    { title: "System Design" },
                  ]).map((item, idx) => {
                    const IconComponent = interestIconMap[item.title] || Layers;
                    return (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400 shrink-0">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span>{item.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Motto / Quote */}
              {profile.quote && (
                <div className="text-center sm:text-right pt-1">
                  <span className="text-xs font-mono text-cyan-400/90 tracking-widest italic">
                    &ldquo; {profile.quote} &rdquo;
                  </span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Section Caption */}
        <div className="mt-14 text-center">
          <span className="text-[11px] font-mono text-slate-500 tracking-wider">
            About Me Section — Executive Profile
          </span>
        </div>

      </div>
    </section>
  );
}
