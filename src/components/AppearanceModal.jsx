import React from 'react';
import { X, Moon, Sun, Sparkles, Check, RotateCcw } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { THEME_PRESETS, DEFAULT_THEME_ID } from '../data/themePresets';
import { audioEngine } from '../utils/audioEngine';

export default function AppearanceModal({ isOpen, onClose }) {
  const {
    activeThemeId,
    setActiveThemeId,
    isDarkMode,
    toggleDarkMode,
    reducedMotion,
    toggleReducedMotion,
  } = useResume();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-slate-950 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Appearance &amp; Theme Studio
              </h2>
              <p className="text-xs text-slate-400">
                Personalize visual aesthetics, color palettes, and motion preferences.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Light / Dark Mode Switch */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Display Mode</span>
              <span className="text-[11px] text-slate-400">
                Toggle between futuristic dark navy and clean white light mode.
              </span>
            </div>

            <button
              onClick={() => {
                audioEngine.playClick();
                toggleDarkMode();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition"
            >
              {isDarkMode ? (
                <>
                  <Moon className="w-4 h-4 text-cyan-400" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Reduced Motion Mode</span>
              <span className="text-[11px] text-slate-400">
                Smoothly disables continuous 3D rotations and heavy parallax effects.
              </span>
            </div>

            <button
              onClick={() => {
                audioEngine.playClick();
                toggleReducedMotion();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                reducedMotion
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {reducedMotion ? 'Reduced Motion: ON' : 'Reduced Motion: OFF'}
            </button>
          </div>

          {/* Preset Theme Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Preset Color Palettes
              </span>
              <button
                onClick={() => {
                  audioEngine.playClick();
                  setActiveThemeId(DEFAULT_THEME_ID);
                }}
                className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Blue &amp; White</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEME_PRESETS.map((theme) => {
                const isSelected = activeThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => {
                      audioEngine.playClick();
                      setActiveThemeId(theme.id);
                    }}
                    className={`p-4 rounded-xl cursor-pointer border transition-all space-y-2.5 ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{theme.name}</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-black">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug">
                      {theme.description}
                    </p>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <div
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: theme.colors.primary }}
                        title="Primary Color"
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: theme.colors.secondary }}
                        title="Secondary Color"
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: theme.colors.accent }}
                        title="Accent Glow"
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: theme.colors.background }}
                        title="Background Tone"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition"
          >
            Apply &amp; Done
          </button>
        </div>
      </div>
    </div>
  );
}
