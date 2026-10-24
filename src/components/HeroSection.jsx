import React, { useState } from 'react';
import { Mail, Terminal, ChevronDown, Edit3, Download, Sparkles } from 'lucide-react';
import { Github, Linkedin, Twitter } from './SocialIcons';
import { useResume } from '../context/ResumeContext';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioEngine';

export default function HeroSection({ onOpenTerminal, onOpenResumeModal }) {
  const { resumeData, setIsEditorOpen, reducedMotion } = useResume();
  const { profile } = resumeData;
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const triggerHoloBurst = () => {
    audioEngine.playHoloBurst();
    confetti({
      particleCount: 50,
      spread: 65,
      origin: { y: 0.5 },
      colors: ['#00f0ff', '#3b82f6', '#8b5cf6', '#ec4899']
    });
  };

  const handleMouseMove = (e) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -14, y: x * 16 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen pt-28 pb-16 flex flex-col justify-between items-center overflow-hidden bg-[var(--bg-primary,#030712)] cyber-grid"
    >
      {/* Background Atmospheric Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: 3D Holographic Pedestal & Shyamal's Portrait */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div 
              className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[420px] lg:h-[420px] cursor-pointer group select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={triggerHoloBurst}
              style={{
                perspective: 1200,
              }}
              title="Click portrait to pulse holographic burst!"
            >
              {/* 3D Tilting Platform Container */}
              <div 
                className="w-full h-full relative transition-transform duration-200 ease-out flex items-center justify-center"
                style={{
                  transform: reducedMotion ? 'none' : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Holographic Pedestal Base Image from Design Reference */}
                <img 
                  src="/hero-pedestal.jpg" 
                  alt="3D Holographic Pedestal Platform" 
                  className="w-full h-full object-cover rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.28)] border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300"
                />

                {/* Overlaid Rotating Orbital Energy Rings */}
                <div 
                  className={`absolute inset-8 rounded-full border border-cyan-400/35 pointer-events-none ${
                    reducedMotion ? '' : 'animate-[spin_22s_linear_infinite]'
                  }`} 
                />
                <div 
                  className={`absolute inset-14 rounded-full border border-dashed border-blue-400/40 pointer-events-none ${
                    reducedMotion ? '' : 'animate-[spin_14s_linear_infinite_reverse]'
                  }`} 
                />
                <div 
                  className={`absolute inset-20 rounded-full border border-dotted border-purple-400/30 pointer-events-none ${
                    reducedMotion ? '' : 'animate-[spin_30s_linear_infinite]'
                  }`} 
                />

                {/* Interactive Pulse Flare */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-blue-500/10 rounded-3xl pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity" />

                {/* Center Holographic Portrait Mask with Live Photo */}
                <div 
                  className="absolute top-[18%] left-[26%] w-[48%] h-[48%] rounded-full overflow-hidden p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_30px_rgba(0,240,255,0.65)] group-hover:scale-105 transition-transform duration-300"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 border-2 border-cyan-300 relative">
                    <img 
                      src={profile.photo || '/shyamal.jpg'} 
                      alt={profile.name || "Shyamal Portrait"} 
                      className="w-full h-full object-cover object-top"
                    />
                    {/* Holographic Scanline Overlay on Portrait */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent pointer-events-none animate-pulse" />
                  </div>
                </div>

                {/* Ambient Floor Ring Reflections */}
                <div className="absolute -bottom-4 w-3/4 h-8 bg-cyan-400/20 rounded-full blur-xl pointer-events-none" />

                {/* 3D Hint Badge */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 shadow-lg pointer-events-none whitespace-nowrap">
                  <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Interactive 3D Hologram • Tilt &amp; Click</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Typography, Bio & CTA Buttons */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Status Pill */}
            {profile.status && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{profile.status}</span>
              </div>
            )}

            {/* Greeting & Name */}
            <div className="space-y-1">
              <span className="text-slate-300 text-lg sm:text-xl font-medium tracking-wide">
                Hi, I'm
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 leading-tight">
                {profile.name || 'Shyamal'}
              </h1>
            </div>

            {/* Role / Identity */}
            <p className="text-cyan-400 font-semibold text-base sm:text-lg tracking-wide">
              {profile.title}
            </p>

            {/* Bio Paragraph */}
            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              {profile.bio}
            </p>

            {/* CTA Buttons Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#projects"
                onClick={() => audioEngine.playClick()}
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
              >
                Explore My Work
              </a>

              {/* Edit Resume Button */}
              <button
                onClick={() => {
                  audioEngine.playClick();
                  setIsEditorOpen(true);
                }}
                className="px-5 py-3 rounded-full text-xs sm:text-sm font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/50 hover:border-cyan-400 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all duration-200 flex items-center gap-2"
                title="Open Live Resume Studio"
              >
                <Edit3 className="w-4 h-4 text-cyan-400" />
                <span>Edit Resume</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playClick();
                  onOpenResumeModal();
                }}
                className="px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400/50 hover:text-white transition-all duration-200 hover:scale-105 shadow-sm flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Resume</span>
              </button>
            </div>

            {/* Social Links Row */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-full bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition hover:scale-110"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}

              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-full bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition hover:scale-110"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2.5 rounded-full bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition hover:scale-110"
                  title="Direct Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}

              {profile.twitter && (
                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-full bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition hover:scale-110"
                  title="X / Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}

              <button
                onClick={() => {
                  audioEngine.playClick();
                  onOpenTerminal();
                }}
                className="p-2.5 rounded-full bg-slate-900/70 border border-slate-800 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400 transition hover:scale-110"
                title="Launch Cyber Terminal HUD (~)"
              >
                <Terminal className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Center: Scroll To Explore Indicator & Section Caption */}
      <div className="relative z-10 mt-8 flex flex-col items-center gap-2">
        <a 
          href="#about" 
          className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors group cursor-pointer"
        >
          {/* Mouse Icon */}
          <div className="w-5 h-8 rounded-full border-2 border-slate-600 group-hover:border-cyan-400 flex justify-center pt-1.5 transition-colors">
            <div className="w-1 h-2 rounded-full bg-cyan-400 animate-bounce" />
          </div>
          <span className="text-[11px] font-mono tracking-wider text-slate-400 group-hover:text-cyan-300">
            Scroll to explore
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
        </a>

        {/* Section Label Caption */}
        <div className="text-[11px] font-mono text-slate-500 tracking-wider pt-2">
          Hero Section — 3D Cinematic Introduction
        </div>
      </div>
    </section>
  );
}
