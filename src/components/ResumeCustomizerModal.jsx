import React, { useState } from 'react';
import { X, Printer, Copy, Check, Download, Loader2, AlertCircle, Edit3 } from 'lucide-react';
import confetti from 'canvas-confetti';
import ResumePreview from './ResumePreview';
import { downloadSelectablePdf } from '../utils/pdfGenerator';
import { SUPPORTED_ROLES, generateMarkdownResume } from '../utils/roleAdapter';
import { audioEngine } from '../utils/audioEngine';
import { useResume } from '../context/ResumeContext';

export default function ResumeCustomizerModal({ isOpen, onClose }) {
  const {
    adaptedResume,
    activeRole,
    setActiveRole,
    activeTemplate,
    setActiveTemplate,
    setIsEditorOpen,
  } = useResume();

  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    audioEngine.playClick();
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    audioEngine.playClick();
    setErrorMessage(null);
    setDownloadSuccess(null);

    try {
      setIsGeneratingPdf(true);
      const result = await downloadSelectablePdf(adaptedResume);
      setDownloadSuccess(`Downloaded ${result.fileName}`);
      
      audioEngine.playPdfExport?.();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#00f0ff', '#3b82f6', '#10b981'],
      });

      setTimeout(() => setDownloadSuccess(null), 4500);
    } catch (error) {
      console.error('Failed to generate selectable PDF:', error);
      setErrorMessage(error?.message || 'Could not compile PDF. Try using "Print / System Dialog" instead.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyMarkdown = async () => {
    try {
      audioEngine.playClick();
      const md = generateMarkdownResume(adaptedResume);
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(md);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy markdown:', err);
      setErrorMessage('Clipboard access denied. Please copy manually or check permissions.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 modal-print-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-950 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="no-print flex items-center justify-between p-4 sm:p-5 bg-slate-900/95 border-b border-slate-800">
          <div>
            <h2 id="modal-headline" className="text-base sm:text-lg font-bold text-white">
              ATS Resume Studio &amp; Export Center
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select role focus track and layout template, or edit content in real time
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioEngine.playClick();
                onClose();
                setIsEditorOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Full Content Editor</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Focus Tabs & Template Switcher Bar */}
        <div className="no-print flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-3 sm:px-6 bg-slate-900/50 border-b border-slate-800/80">
          {/* Role Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {SUPPORTED_ROLES.map((role) => (
              <button
                key={role.key}
                onClick={() => {
                  audioEngine.playClick();
                  setActiveRole(role.key);
                  setErrorMessage(null);
                  setDownloadSuccess(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  activeRole === role.key
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/25'
                    : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          {/* Template dropdown */}
          <select
            value={activeTemplate}
            onChange={(e) => {
              audioEngine.playClick();
              setActiveTemplate(e.target.value);
            }}
            className="bg-slate-800 border border-slate-700 text-cyan-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 shrink-0"
          >
            <option value="modern-blue">Template: Modern Blue</option>
            <option value="ats-clean">Template: ATS Clean</option>
            <option value="minimal-mono">Template: Minimal Mono</option>
            <option value="tech-dev">Template: Hacker / Dev</option>
            <option value="compact-one">Template: Compact 1-Page</option>
          </select>
        </div>

        {/* Feedback Banners */}
        {downloadSuccess && (
          <div className="no-print bg-emerald-950/80 border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>✓ {downloadSuccess}</span>
          </div>
        )}
        {errorMessage && (
          <div className="no-print bg-rose-950/80 border-b border-rose-500/40 px-4 py-2 text-xs text-rose-300 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Scrollable Live Resume Sheet Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 flex justify-center">
          <div className="w-full max-w-[800px] shadow-2xl rounded-sm overflow-hidden border border-slate-800/80">
            <ResumePreview />
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="no-print p-4 sm:px-6 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Feature Highlights checklist */}
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-cyan-400">
              <Check className="w-3 h-3" /> ATS-Friendly
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Check className="w-3 h-3" /> Selectable Text
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Check className="w-3 h-3" /> A4 Layout
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Copy Markdown */}
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition"
              title="Copy plain ATS markdown text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>

            {/* Print / System Dialog */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition"
              title="Open browser print dialog for native PDF or paper"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print / System Dialog</span>
            </button>

            {/* Download PDF (Primary) */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition shadow-lg shadow-cyan-500/20 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
