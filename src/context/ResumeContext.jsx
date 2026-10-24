/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { resumeData as initialCanonicalData } from '../data/resumeData';
import { THEME_PRESETS, DEFAULT_THEME_ID } from '../data/themePresets';
import { loadSavedResume, saveResumeDraft, clearSavedResumeDraft, THEME_STORAGE_KEY, ROLE_SETTINGS_KEY } from '../utils/resumeStorage';
import { getAdaptedResume } from '../utils/roleAdapter';

const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  // 1. Core Resume Data with initial load from localStorage
  const [resumeData, setResumeData] = useState(() => {
    return loadSavedResume(initialCanonicalData);
  });

  // 2. Undo / Redo History Stack (up to 30 snapshots)
  const historyRef = useRef([initialCanonicalData]);
  const historyIndexRef = useRef(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // 3. Save status indicators: 'saved' | 'saving' | 'unsaved'
  const [saveStatus, setSaveStatus] = useState('saved');
  const autosaveTimerRef = useRef(null);

  // 4. Role Selection & Role-Specific Overrides
  const [activeRole, setActiveRole] = useState('fullstack');
  const [roleOverrides, setRoleOverrides] = useState(() => {
    try {
      const raw = localStorage.getItem(ROLE_SETTINGS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // 5. Resume Template
  // 'modern-blue' | 'ats-clean' | 'minimal-mono' | 'tech-dev' | 'compact-one'
  const [activeTemplate, setActiveTemplate] = useState('modern-blue');

  // 6. Themes & Appearance Customization
  const [activeThemeId, setActiveThemeId] = useState(() => {
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.themeId || DEFAULT_THEME_ID;
      }
    } catch {
      // fallback
    }
    return DEFAULT_THEME_ID;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.isDarkMode === 'boolean') return parsed.isDarkMode;
      }
    } catch {
      // fallback
    }
    return true;
  });

  const [customThemeColors, setCustomThemeColors] = useState(() => {
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.customColors || null;
      }
    } catch {
      // fallback
    }
    return null;
  });

  // 7. Motion & Accessibility
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // 8. Overlays & Navigation State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Apply Theme CSS Custom Properties to Document Root
  const currentTheme = useMemo(() => {
    const base = THEME_PRESETS.find(t => t.id === activeThemeId) || THEME_PRESETS[0];
    return {
      ...base,
      isDark: isDarkMode,
      colors: {
        ...base.colors,
        ...(customThemeColors || {}),
        // If user toggled to light mode on a dark theme, adapt background/text
        ...(!isDarkMode ? {
          background: '#f8fafc',
          cardBg: 'rgba(255, 255, 255, 0.94)',
          textPrimary: '#0f172a',
          textSecondary: '#475569',
          border: 'rgba(37, 99, 235, 0.22)',
        } : {}),
      },
    };
  }, [activeThemeId, isDarkMode, customThemeColors]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const colors = currentTheme.colors;

    root.style.setProperty('--bg-primary', colors.background);
    root.style.setProperty('--bg-secondary', colors.cardBg);
    root.style.setProperty('--accent-cyan', colors.primary);
    root.style.setProperty('--accent-blue', colors.secondary);
    root.style.setProperty('--accent-purple', colors.accent);
    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);

    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({
        themeId: activeThemeId,
        isDarkMode,
        customColors: customThemeColors,
      }));
    } catch {
      // ignore
    }
  }, [currentTheme, activeThemeId, isDarkMode, customThemeColors]);

  // Persist role overrides
  useEffect(() => {
    try {
      localStorage.setItem(ROLE_SETTINGS_KEY, JSON.stringify(roleOverrides));
    } catch {
      // ignore
    }
  }, [roleOverrides]);

  // Autosave resume with debounce
  const triggerAutosave = useCallback((data) => {
    setSaveStatus('unsaved');
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    autosaveTimerRef.current = setTimeout(() => {
      setSaveStatus('saving');
      const ok = saveResumeDraft(data);
      setTimeout(() => {
        setSaveStatus(ok ? 'saved' : 'unsaved');
      }, 400);
    }, 700);
  }, []);

  // Update resume data with undo snapshot tracking
  const updateResumeData = useCallback((updater) => {
    setResumeData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;

      // Slice history up to current index and append new snapshot
      const currentIdx = historyIndexRef.current;
      const newHistory = historyRef.current.slice(0, currentIdx + 1);
      newHistory.push(JSON.parse(JSON.stringify(next)));

      // Cap at 30 snapshots
      if (newHistory.length > 30) {
        newHistory.shift();
      }

      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(false);

      triggerAutosave(next);
      return next;
    });
  }, [triggerAutosave]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      const nextIdx = historyIndexRef.current - 1;
      historyIndexRef.current = nextIdx;
      const targetState = historyRef.current[nextIdx];
      setResumeData(targetState);
      setCanUndo(nextIdx > 0);
      setCanRedo(true);
      triggerAutosave(targetState);
    }
  }, [triggerAutosave]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      const nextIdx = historyIndexRef.current + 1;
      historyIndexRef.current = nextIdx;
      const targetState = historyRef.current[nextIdx];
      setResumeData(targetState);
      setCanUndo(true);
      setCanRedo(nextIdx < historyRef.current.length - 1);
      triggerAutosave(targetState);
    }
  }, [triggerAutosave]);

  // Manual save draft
  const saveDraft = useCallback(() => {
    setSaveStatus('saving');
    const ok = saveResumeDraft(resumeData);
    setSaveStatus(ok ? 'saved' : 'unsaved');
    return ok;
  }, [resumeData]);

  // Discard draft and reload saved
  const discardDraft = useCallback(() => {
    const loaded = loadSavedResume(initialCanonicalData);
    setResumeData(loaded);
    historyRef.current = [loaded];
    historyIndexRef.current = 0;
    setCanUndo(false);
    setCanRedo(false);
    setSaveStatus('saved');
  }, []);

  // Reset to default canonical state
  const resetToDefault = useCallback(() => {
    clearSavedResumeDraft();
    setResumeData(initialCanonicalData);
    historyRef.current = [initialCanonicalData];
    historyIndexRef.current = 0;
    setCanUndo(false);
    setCanRedo(false);
    setSaveStatus('saved');
  }, []);

  // Update role overrides
  const updateRoleOverride = useCallback((roleKey, overrides) => {
    setRoleOverrides((prev) => ({
      ...prev,
      [roleKey]: {
        ...(prev[roleKey] || {}),
        ...overrides,
      },
    }));
  }, []);

  // Compute canonical adapted resume for active role
  const adaptedResume = useMemo(() => {
    return getAdaptedResume(resumeData, activeRole, roleOverrides);
  }, [resumeData, activeRole, roleOverrides]);

  const value = {
    // Resume Data
    resumeData,
    updateResumeData,
    adaptedResume,
    // History
    undo,
    redo,
    canUndo,
    canRedo,
    // Persistence
    saveStatus,
    saveDraft,
    discardDraft,
    resetToDefault,
    // Role selection & tailoring
    activeRole,
    setActiveRole,
    roleOverrides,
    updateRoleOverride,
    // Templates
    activeTemplate,
    setActiveTemplate,
    // Themes
    currentTheme,
    activeThemeId,
    setActiveThemeId,
    isDarkMode,
    setIsDarkMode,
    toggleDarkMode: () => setIsDarkMode(prev => !prev),
    customThemeColors,
    setCustomThemeColors,
    // Motion
    reducedMotion,
    setReducedMotion,
    toggleReducedMotion: () => setReducedMotion(prev => !prev),
    // Modals / Overlays
    isEditorOpen,
    setIsEditorOpen,
    isAppearanceOpen,
    setIsAppearanceOpen,
    isResumeModalOpen,
    setIsResumeModalOpen,
    isSidebarOpen,
    setIsSidebarOpen,
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
