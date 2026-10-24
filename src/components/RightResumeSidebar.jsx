import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  Edit3,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { SUPPORTED_ROLES, generateMarkdownResume } from '../utils/roleAdapter';
import { downloadSelectablePdf } from '../utils/pdfGenerator';
import { audioEngine } from '../utils/audioEngine';
import confetti from 'canvas-confetti';

export default function RightResumeSidebar() {
  const {
    adaptedResume,
    activeRole,
    setActiveRole,
    activeTemplate,
    setIsEditorOpen,
    setIsAppearanceOpen,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useResume();

  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      audioEngine.playClick();
      await downloadSelectablePdf(adaptedResume);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyMarkdown = async () => {
    try {
      audioEngine.playClick();
      const md = generateMarkdownResume(adaptedResume);
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Floating Toggle Tab (Visible on right edge when collapsed or on smaller screens) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 no-print">
        <button
          onClick={() => {
            audioEngine.playClick();
            setIsSidebarOpen(!isSidebarOpen);
          }}
          className="flex items-center gap-1 py-3 px-2 rounded-l-2xl bg-slate-900/90 border-l border-t border-b border-cyan-500/40 text-cyan-400 hover:text-white shadow-xl shadow-cyan-500/10 backdrop-blur-md transition-all hover:scale-105"
          title={isSidebarOpen ? "Collapse Resume Panel" : "Open Quick Resume Panel"}
        >
          {isSidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span className="text-[11px] font-mono font-semibold tracking-wider [writing-mode:vertical-lr] rotate-180">
            RESUME HUB
          </span>
        </button>
      </div>

      {/* Slide-out Sidebar Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-slate-950/95 border-l border-cyan-500/25 shadow-2xl backdrop-blur-2xl z-40 transition-transform duration-300 ease-in-out no-print flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Quick Resume Panel
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Live role tailoring &amp; 1-click ATS export
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          
          {/* Quick Edit Resume CTA Button */}
          <button
            onClick={() => {
              audioEngine.playClick();
              setIsEditorOpen(true);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
          >
            <Edit3 className="w-4 h-4 text-cyan-200" />
            <span>Launch Resume Studio / Editor</span>
          </button>

          {/* Role Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="uppercase tracking-wider">Select Role Track</span>
              <span className="text-cyan-400 font-semibold">{SUPPORTED_ROLES.find(r => r.key === activeRole)?.label}</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {SUPPORTED_ROLES.map((role) => {
                const isSelected = activeRole === role.key;
                return (
                  <button
                    key={role.key}
                    onClick={() => {
                      audioEngine.playClick();
                      setActiveRole(role.key);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-950/70 border-cyan-400/80 text-white shadow-md shadow-cyan-500/15'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-white">{role.label}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[220px]">{role.tagline}</div>
                    </div>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mini Live Preview Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 font-mono">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>ACTIVE PREVIEW SNAPSHOT</span>
              <span className="text-cyan-400">{activeTemplate}</span>
            </div>
            <div className="p-2.5 rounded bg-white text-slate-900 font-sans shadow-sm">
              <div className="text-xs font-bold uppercase truncate">{adaptedResume.profile.name}</div>
              <div className="text-[10px] text-blue-700 font-semibold truncate">{adaptedResume.profile.title}</div>
              <div className="text-[9px] text-slate-600 line-clamp-2 mt-1">{adaptedResume.profile.summary}</div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2">
            {/* Download ATS PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-cyan-500/25 transition disabled:opacity-60"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Download ATS PDF</span>
            </button>

            {/* Print Resume */}
            <button
              onClick={() => {
                audioEngine.playClick();
                window.print();
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Native Print / Save as PDF</span>
            </button>

            {/* Copy Markdown */}
            <button
              onClick={handleCopyMarkdown}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Plaintext Markdown'}</span>
            </button>
          </div>

          {/* Technology Highlights */}
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Core Technologies
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['React 19', 'Three.js', 'Vite', 'Tailwind', '@react-pdf', 'WebGL', 'GSAP'].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded bg-slate-800/80 text-[10px] font-mono text-cyan-300 border border-cyan-500/20">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Appearance Switch */}
          <button
            onClick={() => {
              audioEngine.playClick();
              setIsAppearanceOpen(true);
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white flex items-center justify-center gap-2 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Theme &amp; Appearance Settings</span>
          </button>

        </div>
      </aside>
    </>
  );
}
