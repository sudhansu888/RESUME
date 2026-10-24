import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Volume2, VolumeX, Edit3, Sun, Moon, Sliders } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { audioEngine } from '../utils/audioEngine';

export default function Navbar({ onOpenResumeModal }) {
  const {
    resumeData,
    setIsEditorOpen,
    setIsAppearanceOpen,
    isDarkMode,
    toggleDarkMode,
  } = useResume();

  const { profile, sectionsVisibility = {} } = resumeData;

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMuted, setIsMuted] = useState(audioEngine.isMuted());

  // Dynamically filter nav links based on sectionsVisibility
  const baseNavLinks = [
    { name: 'Home', href: '#hero', id: 'hero' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Experience', href: '#experience', id: 'experience' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Achievements', href: '#achievements', id: 'achievements' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const navLinks = baseNavLinks.filter((link) => {
    if (link.id === 'hero') return true;
    return sectionsVisibility[link.id] !== false;
  });

  useEffect(() => {
    const handleAudioChange = (e) => {
      if (e.detail && typeof e.detail.muted === 'boolean') {
        setIsMuted(e.detail.muted);
      }
    };
    window.addEventListener('cyber-audio-state', handleAudioChange);
    return () => window.removeEventListener('cyber-audio-state', handleAudioChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'achievements', 'contact'];
      const scrollPosition = window.scrollY + 180;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    const nextMuted = !isMuted;
    audioEngine.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-[#030712]/92 backdrop-blur-xl border-b border-cyan-500/15 shadow-[0_4px_30px_rgba(0,0,0,0.6)]' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Name */}
        <a 
          href="#hero" 
          className="text-lg sm:text-xl font-bold tracking-tight text-white hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          onClick={() => audioEngine.playClick()}
        >
          <span>{profile.name || 'Shyamal'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-inner">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                onMouseEnter={() => audioEngine.playHover()}
                onClick={() => audioEngine.playClick()}
                className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right CTA & Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => {
              audioEngine.playClick();
              toggleDarkMode();
            }}
            className="p-2 rounded-full border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all text-xs"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* Theme Palette Modal */}
          <button
            onClick={() => {
              audioEngine.playClick();
              setIsAppearanceOpen(true);
            }}
            className="p-2 rounded-full border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all text-xs"
            title="Appearance & Theme Studio"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Audio toggle button */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all text-xs"
            title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* Edit Resume Studio CTA Button */}
          <button
            onClick={() => {
              audioEngine.playClick();
              setIsEditorOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 hover:border-cyan-400 transition-all duration-200 shadow-sm"
            title="Launch Resume Studio / Content Editor"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Edit Resume</span>
          </button>

          {/* Download Resume Pill Button */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onOpenResumeModal();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400/50 hover:text-white transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Mobile Hamburger & Edit Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => {
              audioEngine.playClick();
              setIsEditorOpen(true);
            }}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              onOpenResumeModal();
            }}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-200 bg-slate-900/80 border border-slate-700"
          >
            Resume
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#030712]/95 backdrop-blur-2xl border-b border-cyan-500/20 px-4 py-4 space-y-2 mt-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => {
                audioEngine.playClick();
                setMobileMenuOpen(false);
              }}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeSection === link.id
                  ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                audioEngine.playClick();
                setMobileMenuOpen(false);
                setIsEditorOpen(true);
              }}
              className="w-full py-2.5 rounded-xl text-center text-xs font-semibold bg-cyan-950 border border-cyan-500/50 text-cyan-300"
            >
              Open Live Resume Studio
            </button>
            <button
              onClick={() => {
                audioEngine.playClick();
                setMobileMenuOpen(false);
                onOpenResumeModal();
              }}
              className="w-full py-2.5 rounded-xl text-center text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
            >
              Download ATS Resume (PDF)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
