import React, { useState, useEffect, Suspense } from 'react';
import { ResumeProvider, useResume } from './context/ResumeContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import AchievementsSection from './components/AchievementsSection';
import ContactSection from './components/ContactSection';
import PrintableResumeSheet from './components/PrintableResumeSheet';
import RightResumeSidebar from './components/RightResumeSidebar';
import { 
  Terminal, 
  Command, 
  Box, 
  Sparkles, 
  FileText, 
  Printer, 
  Monitor, 
  Zap, 
  GitBranch, 
  Triangle,
  Edit3,
  Sliders
} from 'lucide-react';
import './App.css';

// Lazy load overlay modals so heavy components are deferred on initial page load
const CyberTerminal = React.lazy(() => import('./components/CyberTerminal'));
const ResumeCustomizerModal = React.lazy(() => import('./components/ResumeCustomizerModal'));
const ResumeEditor = React.lazy(() => import('./components/ResumeEditor'));
const AppearanceModal = React.lazy(() => import('./components/AppearanceModal'));
const CommandPalette = React.lazy(() => import('./components/CommandPalette'));

function AppContent() {
  const {
    isEditorOpen,
    setIsEditorOpen,
    isAppearanceOpen,
    setIsAppearanceOpen,
    isResumeModalOpen,
    setIsResumeModalOpen,
  } = useResume();

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle terminal on Backquote (` or ~)
      if (e.key === '`' || e.key === '~') {
        const activeTag = document.activeElement?.tagName;
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          e.preventDefault();
          setIsTerminalOpen((prev) => !prev);
        }
      }
      // Toggle Command Palette on Ctrl+K or Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
      // Toggle Resume Editor on Ctrl+E or Cmd+E
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        const activeTag = document.activeElement?.tagName;
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          e.preventDefault();
          setIsEditorOpen((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsEditorOpen]);

  const capabilityBadges = [
    { name: "3D WebGL Hologram", icon: Box },
    { name: "Live Resume Studio", icon: Edit3 },
    { name: "Selectable ATS PDF", icon: FileText },
    { name: "Native Print Isolation", icon: Printer },
    { name: "Theme Studio & Dark/Light", icon: Sliders },
    { name: "GSAP & Canvas Visuals", icon: Sparkles },
    { name: "Responsive Multi-Layout", icon: Monitor },
    { name: "Production Optimized", icon: Zap },
    { name: "CI/CD (GitHub Actions)", icon: GitBranch },
    { name: "Vercel Deployment", icon: Triangle },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary,#030712)] text-[var(--text-primary,#f8fafc)] relative selection:bg-cyan-500 selection:text-black pb-16 transition-colors duration-300">
      {/* Navigation */}
      <div className="no-print">
        <Navbar
          onOpenResumeModal={() => setIsResumeModalOpen(true)}
        />
      </div>

      {/* Main Content Sections */}
      <main className="no-print">
        <HeroSection
          onOpenTerminal={() => setIsTerminalOpen(true)}
          onOpenResumeModal={() => setIsResumeModalOpen(true)}
        />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <AchievementsSection />
        <ContactSection 
          onOpenResumeModal={() => setIsResumeModalOpen(true)}
        />
      </main>

      {/* Desktop Right Quick Resume Sidebar */}
      <div className="no-print">
        <RightResumeSidebar />
      </div>

      {/* Mockup Capabilities Bottom Bar */}
      <footer className="no-print border-t border-slate-900 bg-slate-950/90 backdrop-blur-md py-4 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-[11px] font-mono text-slate-400 whitespace-nowrap min-w-max">
          {capabilityBadges.map((badge, idx) => {
            const IconComp = badge.icon;
            return (
              <div 
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
              >
                <IconComp className="w-3.5 h-3.5 text-cyan-400" />
                <span>{badge.name}</span>
              </div>
            );
          })}
        </div>
      </footer>

      {/* Floating Action HUD Bottom Right */}
      <div className="no-print fixed bottom-16 right-6 z-30 flex flex-col items-end gap-2.5">
        {/* Quick Edit Resume Pill */}
        <button
          onClick={() => setIsEditorOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 hover:text-white hover:border-cyan-300 shadow-xl shadow-cyan-500/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group font-medium text-xs"
          title="Launch Live Resume Studio (Ctrl+E)"
        >
          <Edit3 className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Edit Resume</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono">
            Ctrl+E
          </kbd>
        </button>

        {/* Command Palette Pill */}
        <button
          onClick={() => setIsPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-white hover:border-cyan-400 shadow-lg shadow-black/50 transition-all hover:scale-105"
        >
          <Command className="w-3.5 h-3.5" />
          <span>Quick Menu</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px]">
            Ctrl+K
          </kbd>
        </button>

        {/* Floating Terminal Button */}
        <button
          onClick={() => setIsTerminalOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-cyan-400 hover:text-cyan-200 hover:border-cyan-300 shadow-xl shadow-cyan-500/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group"
          title="Open Cyber Terminal HUD (~)"
        >
          <div className="relative">
            <Terminal className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <span className="font-mono text-xs font-semibold hidden sm:inline">
            CLI HUD
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
            ~
          </span>
        </button>
      </div>

      {/* Lazy Overlays wrapped in Suspense */}
      <Suspense fallback={null}>
        {/* Full Resume Studio & Content Editor */}
        {isEditorOpen && (
          <ResumeEditor
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
          />
        )}

        {/* Appearance & Themes Studio Modal */}
        {isAppearanceOpen && (
          <AppearanceModal
            isOpen={isAppearanceOpen}
            onClose={() => setIsAppearanceOpen(false)}
          />
        )}

        {/* Interactive Cyber Terminal */}
        <div className="no-print">
          {isTerminalOpen && (
            <CyberTerminal
              isOpen={isTerminalOpen}
              onClose={() => setIsTerminalOpen(false)}
              onOpenResumeModal={() => setIsResumeModalOpen(true)}
            />
          )}
        </div>

        {/* Printable & Customizable ATS Resume Modal */}
        {isResumeModalOpen && (
          <ResumeCustomizerModal
            isOpen={isResumeModalOpen}
            onClose={() => setIsResumeModalOpen(false)}
          />
        )}

        {/* Command Palette Spotlight */}
        <div className="no-print">
          {isPaletteOpen && (
            <CommandPalette
              isOpen={isPaletteOpen}
              onClose={() => setIsPaletteOpen(false)}
              onOpenTerminal={() => setIsTerminalOpen(true)}
              onOpenResumeModal={() => setIsResumeModalOpen(true)}
            />
          )}
        </div>
      </Suspense>

      {/* Direct Ctrl+P Print Fallback (Always available for browser print isolation) */}
      <div className="print-only hidden">
        <PrintableResumeSheet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ResumeProvider>
      <AppContent />
    </ResumeProvider>
  );
}
