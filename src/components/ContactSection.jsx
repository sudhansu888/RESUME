import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, Download, Send, AlertCircle } from 'lucide-react';
import { Github, Linkedin } from './SocialIcons';
import { useResume } from '../context/ResumeContext';
import { audioEngine } from '../utils/audioEngine';
import confetti from 'canvas-confetti';

export default function ContactSection({ onOpenResumeModal }) {
  const { resumeData } = useResume();
  const { profile, sectionsVisibility = {} } = resumeData;
  const [copiedEmail, setCopiedEmail] = useState(false);
  
  // Interactive Contact Form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState(null); // { type: 'success' | 'error', message: string }

  if (sectionsVisibility && sectionsVisibility.contact === false) {
    return null;
  }

  const handleCopyEmail = () => {
    audioEngine.playClick();
    if (profile.email) {
      navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const triggerHoloSurge = () => {
    audioEngine.playHoloBurst();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#00f0ff', '#3b82f6', '#ec4899']
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus({ type: 'error', message: 'Please fill out all fields before sending.' });
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setFormStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    audioEngine.playSuccess?.();
    triggerHoloSurge();

    // Generate mailto link as real client-side dispatch
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
    const body = encodeURIComponent(`From: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}`);
    const mailtoUrl = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    setFormStatus({
      type: 'success',
      message: 'Dispatch initiated! Your default mail client has opened to send your inquiry.',
    });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[var(--bg-primary,#030712)] border-t border-slate-900/80">
      {/* Background accents */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 tracking-tight">
            Let's Connect
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-1 font-medium">
            Have a project in mind or want to collaborate? Reach out directly.
          </p>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Contact Channels & Form */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Email Card */}
            {profile.email && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      Email
                    </span>
                    <span className="text-sm font-semibold text-white truncate block">
                      {profile.email}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-all shrink-0 flex items-center gap-1.5"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Social Channels Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.github && (
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Github className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-semibold text-white">GitHub</span>
                  </div>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {profile.linkedin && (
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-semibold text-white">LinkedIn</span>
                  </div>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>Connect</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Quick Contact Dispatch Form */}
            <form onSubmit={handleFormSubmit} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 shadow-lg">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Send Direct Message
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <textarea
                rows={3}
                placeholder="Collaboration inquiry, job proposal, or message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
              />

              {formStatus && (
                <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  formStatus.type === 'error'
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {formStatus.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                  <span>{formStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Collaboration Inquiry</span>
              </button>
            </form>

            {/* Download Resume Full-Width Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  if (onOpenResumeModal) onOpenResumeModal();
                }}
                className="w-full py-3.5 px-6 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <Download className="w-4 h-4 text-cyan-200" />
                <span>Download ATS Resume (PDF)</span>
              </button>
            </div>

          </div>

          {/* Right Column: 3D Holographic Podium with Neon Mail Envelope */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center text-center">
            <div 
              className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden border border-cyan-500/30 group cursor-pointer shadow-[0_0_40px_rgba(0,240,255,0.2)] hover:shadow-[0_0_60px_rgba(0,240,255,0.4)] transition-all duration-300"
              onClick={triggerHoloSurge}
              title="Click to pulse collaboration signal!"
            >
              <img 
                src="/contact-holo.jpg" 
                alt="3D Holographic Projection Podium with Neon Mail Envelope" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Ambient Holographic Reflection */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-50" />
            </div>

            {/* Subtext under Hologram */}
            <p className="text-xs sm:text-sm font-medium text-slate-300 mt-4 tracking-wide">
              Open to high-impact software engineering roles &amp; creative 3D web collaborations!
            </p>
          </div>

        </div>

        {/* Section Caption */}
        <div className="mt-14 text-center">
          <span className="text-[11px] font-mono text-slate-500 tracking-wider">
            Contact Section — Professional Terminal
          </span>
        </div>

      </div>
    </section>
  );
}
