import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Terminal, FileDown, Layers, Cpu, Briefcase, Mail, User, Award, Edit3, Sliders, Sidebar } from 'lucide-react';
import { Github } from './SocialIcons';
import confetti from 'canvas-confetti';
import { useResume } from '../context/ResumeContext';

export default function CommandPalette({ isOpen, onClose, onOpenTerminal, onOpenResumeModal }) {
  const [query, setQuery] = useState('');
  const { resumeData, setIsEditorOpen, setIsAppearanceOpen, setIsSidebarOpen } = useResume();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'edit-resume',
      name: 'Launch Resume Studio / Content Editor (Ctrl+E)',
      category: 'Resume Studio',
      icon: Edit3,
      action: () => { onClose(); setIsEditorOpen(true); }
    },
    {
      id: 'appearance',
      name: 'Open Appearance & Theme Studio',
      category: 'Settings',
      icon: Sliders,
      action: () => { onClose(); setIsAppearanceOpen(true); }
    },
    {
      id: 'sidebar',
      name: 'Toggle Right Resume Quick Panel',
      category: 'Resume Studio',
      icon: Sidebar,
      action: () => { onClose(); setIsSidebarOpen(prev => !prev); }
    },
    {
      id: 'term',
      name: 'Launch Cyber CLI Terminal (~)',
      category: 'Actions',
      icon: Terminal,
      action: () => { onClose(); onOpenTerminal(); }
    },
    {
      id: 'resume',
      name: 'Export / Download ATS Resume (PDF)',
      category: 'Resume Studio',
      icon: FileDown,
      action: () => { onClose(); onOpenResumeModal(); }
    },
    {
      id: 'confetti',
      name: 'Trigger Quantum Confetti Shower',
      category: 'Easter Eggs',
      icon: Sparkles,
      action: () => {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#00f0ff', '#3b82f6', '#8b5cf6', '#ec4899']
        });
        onClose();
      }
    },
    {
      id: 'about',
      name: 'Jump to About & Philosophy',
      category: 'Navigation',
      icon: User,
      action: () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'skills',
      name: 'Jump to Skills Matrix',
      category: 'Navigation',
      icon: Cpu,
      action: () => {
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'projects',
      name: 'Jump to Projects Showcase',
      category: 'Navigation',
      icon: Layers,
      action: () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'experience',
      name: 'Jump to Career Experience',
      category: 'Navigation',
      icon: Briefcase,
      action: () => {
        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'achievements',
      name: 'Jump to Achievements & Credentials',
      category: 'Navigation',
      icon: Award,
      action: () => {
        document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'contact',
      name: 'Jump to Contact Dispatch',
      category: 'Navigation',
      icon: Mail,
      action: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'github',
      name: 'Open GitHub Profile',
      category: 'Links',
      icon: Github,
      action: () => { window.open(resumeData.profile.github, '_blank'); onClose(); }
    }
  ];

  const filtered = query.trim() === ''
    ? actions
    : actions.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl glass-panel border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-slate-900/90 border-b border-slate-800">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command (e.g. 'edit', 'theme', 'skills', 'export')..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans"
            autoFocus
          />
          <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Action list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 bg-slate-950/80">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 font-mono">
              No matching commands found
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-transparent transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Navigation &amp; Quick Actions</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
