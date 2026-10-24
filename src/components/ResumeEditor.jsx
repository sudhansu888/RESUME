import React, { useState, useRef } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Undo2,
  Redo2,
  Download,
  Printer,
  Upload,
  FileJson,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Layers,
  GraduationCap,
  Briefcase,
  Award,
  Code2,
  FileText,
  User,
  Sliders,
  Check,
  AlertCircle,
  Copy,
  Loader2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { exportResumeJson, importResumeJson } from '../utils/resumeStorage';
import { SUPPORTED_ROLES, generateMarkdownResume } from '../utils/roleAdapter';
import { downloadSelectablePdf } from '../utils/pdfGenerator';
import { audioEngine } from '../utils/audioEngine';
import ResumePreview from './ResumePreview';
import confetti from 'canvas-confetti';

export default function ResumeEditor({ isOpen, onClose }) {
  const {
    resumeData,
    updateResumeData,
    adaptedResume,
    undo,
    redo,
    canUndo,
    canRedo,
    saveStatus,
    saveDraft,
    discardDraft,
    resetToDefault,
    activeRole,
    setActiveRole,
    roleOverrides,
    updateRoleOverride,
    activeTemplate,
    setActiveTemplate,
  } = useResume();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'roles' | 'sections' | 'skills' | 'projects' | 'experience' | 'education' | 'achievements' | 'custom'
  const [mobileMode, setMobileMode] = useState('edit'); // 'edit' | 'preview'
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null); // { message, onConfirm }
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  if (!isOpen) return null;

  const showFeedback = (msg, isErr = false) => {
    setFeedbackMsg({ text: msg, isErr });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Profile Field Handler
  const handleProfileChange = (field, value) => {
    updateResumeData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
  };

  // Image upload handler (converts to Base64 data URL with preview)
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('Please select a valid image file (JPG, PNG, WebP).', true);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showFeedback('Image file size must be under 5MB.', true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      handleProfileChange('photo', base64);
      audioEngine.playSuccess?.();
      showFeedback('Profile photo updated successfully!');
    };
    reader.onerror = () => {
      showFeedback('Failed to read image file.', true);
    };
    reader.readAsDataURL(file);
  };

  // JSON Import Trigger
  const handleImportJsonFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await importResumeJson(file);
    if (result.success && result.data) {
      updateResumeData(() => result.data);
      audioEngine.playHoloBurst();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
      showFeedback('Resume data imported and validated successfully!');
    } else {
      showFeedback(result.error || 'Failed to import JSON.', true);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Download PDF from inside Editor
  const handleDownloadPdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      audioEngine.playClick();
      const res = await downloadSelectablePdf(adaptedResume);
      showFeedback(`Downloaded ${res.fileName}`);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
    } catch (err) {
      showFeedback(err?.message || 'Failed to generate PDF.', true);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Copy Markdown
  const handleCopyMarkdown = async () => {
    try {
      audioEngine.playClick();
      const md = generateMarkdownResume(adaptedResume);
      await navigator.clipboard.writeText(md);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2500);
      showFeedback('Copied Markdown resume to clipboard!');
    } catch {
      showFeedback('Could not copy to clipboard.', true);
    }
  };

  // Section Ordering and Visibility
  const sectionsOrder = resumeData.sectionsOrder || [
    'about', 'skills', 'projects', 'experience', 'education', 'certifications', 'achievements', 'contact'
  ];
  const sectionsVisibility = resumeData.sectionsVisibility || {};

  const toggleSectionVisibility = (secKey) => {
    audioEngine.playClick();
    updateResumeData((prev) => ({
      ...prev,
      sectionsVisibility: {
        ...prev.sectionsVisibility,
        [secKey]: prev.sectionsVisibility?.[secKey] === false ? true : false,
      },
    }));
  };

  const moveSection = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= sectionsOrder.length) return;
    audioEngine.playClick();
    const newOrder = [...sectionsOrder];
    const [moved] = newOrder.splice(idx, 1);
    newOrder.splice(targetIdx, 0, moved);
    updateResumeData((prev) => ({
      ...prev,
      sectionsOrder: newOrder,
    }));
  };

  // Add / Remove / Edit Skills
  const handleAddSkillCategory = () => {
    const name = prompt('Enter new skill category name (e.g. "Cloud & DevOps"):');
    if (!name || !name.trim()) return;
    updateResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, { category: name.trim(), items: [] }],
    }));
  };

  const handleDeleteSkillCategory = (catIdx) => {
    setConfirmDialog({
      message: `Delete skill category "${resumeData.skills[catIdx]?.category}"?`,
      onConfirm: () => {
        updateResumeData((prev) => ({
          ...prev,
          skills: prev.skills.filter((_, i) => i !== catIdx),
        }));
      },
    });
  };

  const handleAddSkillItem = (catIdx) => {
    const skillName = prompt('Enter skill name (e.g. "React"):');
    if (!skillName || !skillName.trim()) return;
    updateResumeData((prev) => {
      const nextSkills = [...prev.skills];
      nextSkills[catIdx] = {
        ...nextSkills[catIdx],
        items: [
          ...nextSkills[catIdx].items,
          {
            name: skillName.trim(),
            level: 90,
            tag: skillName.trim().slice(0, 2).toUpperCase(),
            color: '#00f0ff',
            highlight: true,
          },
        ],
      };
      return { ...prev, skills: nextSkills };
    });
  };

  const handleDeleteSkillItem = (catIdx, itemIdx) => {
    updateResumeData((prev) => {
      const nextSkills = [...prev.skills];
      nextSkills[catIdx] = {
        ...nextSkills[catIdx],
        items: nextSkills[catIdx].items.filter((_, i) => i !== itemIdx),
      };
      return { ...prev, skills: nextSkills };
    });
  };

  // Add / Remove / Edit Projects
  const handleAddProject = () => {
    const newProj = {
      id: `project-${Date.now()}`,
      title: 'New Highlight Project',
      category: 'Full-Stack & Systems',
      tagline: 'High impact web application solving key engineering challenge.',
      description: 'Built scalable end-to-end architecture with real-time analytics.',
      highlights: ['Designed high-performance API pipeline', 'Optimized database queries by 40%'],
      tech: ['React', 'Node.js', 'PostgreSQL'],
      image: '/project-lawshield.jpg',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/shyamal',
      featured: true,
    };
    updateResumeData((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
  };

  const handleDeleteProject = (projId) => {
    setConfirmDialog({
      message: 'Delete this project entry?',
      onConfirm: () => {
        updateResumeData((prev) => ({
          ...prev,
          projects: prev.projects.filter((p) => p.id !== projId),
        }));
      },
    });
  };

  // Add Experience
  const handleAddExperience = () => {
    const newExp = {
      role: 'Software Engineer',
      company: 'Tech Corp',
      period: '2024 — Present',
      location: 'Remote',
      description: 'Engineering responsive web apps and scalable cloud services.',
      achievements: [
        'Architected reusable component libraries improving developer velocity by 30%.',
        'Implemented automated CI/CD deployment workflows.',
      ],
      skills: ['React', 'TypeScript', 'Node.js'],
      current: true,
    };
    updateResumeData((prev) => ({
      ...prev,
      experience: [newExp, ...prev.experience],
    }));
  };

  // Add Education
  const handleAddEducation = () => {
    const newEdu = {
      degree: 'Degree or Certification',
      institution: 'University / Institute',
      period: '2020 — 2024',
      grade: 'Distinction / Honors',
      highlights: ['Relevant coursework in Software Architecture and Web Systems'],
    };
    updateResumeData((prev) => ({
      ...prev,
      education: [newEdu, ...prev.education],
    }));
  };

  // Add Achievement
  const handleAddAchievement = () => {
    const newAch = {
      title: 'Honor or Certification',
      organization: 'Issuing Body',
      year: '2024',
      badge: 'Recognition',
      actionText: 'View Credential',
      description: 'Validated expertise in domain architecture and engineering excellence.',
      url: 'https://example.com',
    };
    updateResumeData((prev) => ({
      ...prev,
      achievements: [newAch, ...prev.achievements],
    }));
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 ${
        isFullScreen ? 'p-0' : ''
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full ${
          isFullScreen ? 'h-screen rounded-none' : 'max-w-7xl h-[94vh] rounded-2xl'
        } bg-slate-950 border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col`}
      >
        {/* ================= TOP TOOLBAR ================= */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800 gap-2 select-none shrink-0">
          {/* Title & Autosave Pill */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Resume Studio &amp; Content Editor
                </h2>
                {/* Autosave status indicator */}
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                    saveStatus === 'saved'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                      : saveStatus === 'saving'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                  }`}
                  title={
                    saveStatus === 'saved'
                      ? 'All changes automatically saved to local storage'
                      : saveStatus === 'saving'
                      ? 'Saving changes...'
                      : 'Unsaved changes exist'
                  }
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      saveStatus === 'saved'
                        ? 'bg-emerald-400'
                        : saveStatus === 'saving'
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-rose-400 animate-ping'
                    }`}
                  />
                  <span>
                    {saveStatus === 'saved'
                      ? 'Saved'
                      : saveStatus === 'saving'
                      ? 'Saving...'
                      : 'Unsaved'}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Edit any field below to update your portfolio website, live preview, and ATS PDF in real time.
              </p>
            </div>
          </div>

          {/* Quick Actions (Undo, Redo, Import, Export, Save, Template) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Undo / Redo */}
            <button
              onClick={() => {
                undo();
                audioEngine.playClick();
              }}
              disabled={!canUndo}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                redo();
                audioEngine.playClick();
              }}
              disabled={!canRedo}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-slate-700 mx-1 hidden sm:block" />

            {/* Template Selector Dropdown */}
            <select
              value={activeTemplate}
              onChange={(e) => {
                audioEngine.playClick();
                setActiveTemplate(e.target.value);
              }}
              className="hidden md:block bg-slate-800 border border-slate-700 text-cyan-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
              title="Switch Resume Layout Template"
            >
              <option value="modern-blue">Template: Modern Blue</option>
              <option value="ats-clean">Template: ATS Clean</option>
              <option value="minimal-mono">Template: Minimal Mono</option>
              <option value="tech-dev">Template: Hacker / Dev</option>
              <option value="compact-one">Template: Compact 1-Page</option>
            </select>

            {/* Export JSON */}
            <button
              onClick={() => {
                audioEngine.playClick();
                exportResumeJson(resumeData, resumeData.profile.name);
                showFeedback('Exported resume data as JSON!');
              }}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-mono transition"
              title="Export complete resume as JSON backup"
            >
              <FileJson className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export JSON</span>
            </button>

            {/* Import JSON */}
            <label
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-mono cursor-pointer transition"
              title="Import resume from JSON"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Import</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImportJsonFile}
              />
            </label>

            {/* Save Draft manual */}
            <button
              onClick={() => {
                audioEngine.playClick();
                saveDraft();
                showFeedback('Draft saved successfully to browser storage!');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition"
              title="Save current draft"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="hidden sm:block p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition hover:bg-slate-800"
              title="Close Editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Banners */}
        {feedbackMsg && (
          <div
            className={`px-4 py-2 text-xs flex items-center justify-between transition-all shrink-0 ${
              feedbackMsg.isErr
                ? 'bg-rose-950/90 border-b border-rose-500/40 text-rose-300'
                : 'bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMsg.isErr ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
            <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mobile Edit / Preview Mode Switcher */}
        <div className="lg:hidden flex items-center bg-slate-900 border-b border-slate-800 p-1.5 shrink-0">
          <button
            onClick={() => setMobileMode('edit')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
              mobileMode === 'edit'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Form Controls
          </button>
          <button
            onClick={() => setMobileMode('preview')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
              mobileMode === 'preview'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Preview
          </button>
        </div>

        {/* ================= MAIN SPLIT PANE ================= */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT PANEL: Form Controls */}
          <div
            className={`w-full lg:w-1/2 flex flex-col border-r border-slate-800 bg-slate-950 ${
              mobileMode === 'preview' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Editor Sub-Tabs Navigation */}
            <div className="flex items-center gap-1.5 p-2 bg-slate-900/70 border-b border-slate-800/80 overflow-x-auto shrink-0 select-none">
              {[
                { id: 'profile', label: 'Personal', icon: User },
                { id: 'roles', label: 'Role Tailoring', icon: Sparkles },
                { id: 'sections', label: 'Sections', icon: Layers },
                { id: 'skills', label: 'Skills', icon: Code2 },
                { id: 'projects', label: 'Projects', icon: FileText },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'achievements', label: 'Honors', icon: Award },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      audioEngine.playClick();
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                      isActive
                        ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Form Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

              {/* TAB 1: PERSONAL INFORMATION */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Personal Information &amp; 3D Portrait
                    </h3>
                    <p className="text-xs text-slate-400">
                      Configure your identity, contact information, and portrait photograph.
                    </p>
                  </div>

                  {/* Profile Photo Upload & Settings */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Profile Photograph (Powers 3D Hologram &amp; Portfolio)
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Photo Thumbnail */}
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_20px_rgba(0,240,255,0.3)] bg-slate-950 shrink-0">
                        <img
                          src={resumeData.profile.photo || '/shyamal.jpg'}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      {/* Upload Controls */}
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          <button
                            type="button"
                            onClick={() => photoInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-1.5 transition"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload New Photo (JPG/PNG/WebP)</span>
                          </button>
                          <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoUpload}
                          />
                          <button
                            type="button"
                            onClick={() => handleProfileChange('photo', '/shyamal.jpg')}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                          >
                            Reset to Default
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Supports local image upload (converts to persistent Base64 draft) or external URLs.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Input Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-300 mb-1 block">Full Name</label>
                      <input
                        type="text"
                        value={resumeData.profile.name || ''}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 mb-1 block">Professional Headline</label>
                      <input
                        type="text"
                        value={resumeData.profile.title || ''}
                        onChange={(e) => handleProfileChange('title', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 mb-1 block">Email Address</label>
                      <input
                        type="email"
                        value={resumeData.profile.email || ''}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 mb-1 block">Phone Number</label>
                      <input
                        type="text"
                        value={resumeData.profile.phone || ''}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 mb-1 block">Location</label>
                      <input
                        type="text"
                        value={resumeData.profile.location || ''}
                        onChange={(e) => handleProfileChange('location', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 mb-1 block">Website / Portfolio URL</label>
                      <input
                        type="url"
                        value={resumeData.profile.website || ''}
                        onChange={(e) => handleProfileChange('website', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 mb-1 block">GitHub Profile</label>
                      <input
                        type="url"
                        value={resumeData.profile.github || ''}
                        onChange={(e) => handleProfileChange('github', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 mb-1 block">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={resumeData.profile.linkedin || ''}
                        onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 mb-1 block">
                      Professional Summary / Biography
                    </label>
                    <textarea
                      rows={4}
                      value={resumeData.profile.bio || ''}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs leading-relaxed focus:border-cyan-400 focus:outline-none font-sans"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: ROLE TAILORING */}
              {activeTab === 'roles' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Role-Specific Resume Tailoring
                    </h3>
                    <p className="text-xs text-slate-400">
                      Produce specialized resume versions from verified source data. Each role can have a custom summary and prioritized projects.
                    </p>
                  </div>

                  {/* Role Selector Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SUPPORTED_ROLES.map((role) => {
                      const isSelected = activeRole === role.key;
                      return (
                        <div
                          key={role.key}
                          onClick={() => {
                            audioEngine.playClick();
                            setActiveRole(role.key);
                          }}
                          className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                            isSelected
                              ? 'bg-blue-950/60 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{role.label}</span>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{role.tagline}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Role Specific Summary Override */}
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                    <label className="text-xs font-bold text-cyan-300 block">
                      Custom Summary for Active Role ({SUPPORTED_ROLES.find(r => r.key === activeRole)?.label})
                    </label>
                    <textarea
                      rows={4}
                      value={roleOverrides[activeRole]?.summary || adaptedResume.profile.summary || ''}
                      onChange={(e) => {
                        updateRoleOverride(activeRole, { summary: e.target.value });
                      }}
                      placeholder="Leave blank to use default adapted summary for this role."
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:border-cyan-400 focus:outline-none"
                    />
                    <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                      <span>Stored independently for {activeRole}.</span>
                      <button
                        type="button"
                        onClick={() => {
                          updateRoleOverride(activeRole, { summary: '' });
                          showFeedback('Reset role summary to default adapted version.');
                        }}
                        className="text-cyan-400 hover:underline"
                      >
                        Reset Role Summary
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SECTIONS MANAGER */}
              {activeTab === 'sections' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Resume Sections Order &amp; Visibility
                    </h3>
                    <p className="text-xs text-slate-400">
                      Reorder sections with Up/Down buttons, or hide/show sections to adjust layout density.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {sectionsOrder.map((secKey, idx) => {
                      const isVis = sectionsVisibility[secKey] !== false;
                      return (
                        <div
                          key={secKey}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-mono text-cyan-400 font-bold w-5">
                              {idx + 1}.
                            </span>
                            <span className="text-xs font-semibold text-white capitalize">
                              {secKey} Section
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Hide / Show */}
                            <button
                              onClick={() => toggleSectionVisibility(secKey)}
                              className={`p-1.5 rounded-lg text-xs transition ${
                                isVis
                                  ? 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
                                  : 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                              }`}
                              title={isVis ? 'Hide section' : 'Show section'}
                            >
                              {isVis ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>

                            {/* Move Up */}
                            <button
                              onClick={() => moveSection(idx, -1)}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                              title="Move up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>

                            {/* Move Down */}
                            <button
                              onClick={() => moveSection(idx, 1)}
                              disabled={idx === sectionsOrder.length - 1}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                              title="Move down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: SKILLS MATRIX */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Technical Skills Matrix
                      </h3>
                      <p className="text-xs text-slate-400">
                        Add, remove, reorder categories and technical proficiencies.
                      </p>
                    </div>
                    <button
                      onClick={handleAddSkillCategory}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Category</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {resumeData.skills.map((cat, catIdx) => (
                      <div key={catIdx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={cat.category}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const next = [...prev.skills];
                                next[catIdx] = { ...next[catIdx], category: val };
                                return { ...prev, skills: next };
                              });
                            }}
                            className="font-bold text-xs text-cyan-300 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-none"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAddSkillItem(catIdx)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1 transition"
                            >
                              <Plus className="w-3 h-3" /> Add Skill
                            </button>
                            <button
                              onClick={() => handleDeleteSkillCategory(catIdx)}
                              className="p-1 text-slate-500 hover:text-rose-400 transition"
                              title="Delete category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Items in this category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {cat.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold"
                                  style={{ color: item.color || '#00f0ff', backgroundColor: `${item.color || '#00f0ff'}20` }}
                                >
                                  {item.tag || item.name.slice(0, 2).toUpperCase()}
                                </span>
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateResumeData((prev) => {
                                      const next = [...prev.skills];
                                      const items = [...next[catIdx].items];
                                      items[itemIdx] = { ...items[itemIdx], name: val };
                                      next[catIdx] = { ...next[catIdx], items };
                                      return { ...prev, skills: next };
                                    });
                                  }}
                                  className="text-xs text-white bg-transparent focus:outline-none truncate"
                                />
                              </div>

                              <button
                                onClick={() => handleDeleteSkillItem(catIdx, itemIdx)}
                                className="text-slate-500 hover:text-rose-400 p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Production Projects
                      </h3>
                      <p className="text-xs text-slate-400">
                        Edit projects, highlights, live links, and repository URLs.
                      </p>
                    </div>
                    <button
                      onClick={handleAddProject}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {resumeData.projects.map((proj, idx) => (
                      <div key={proj.id || idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => ({
                                ...prev,
                                projects: prev.projects.map((p) => p.id === proj.id ? { ...p, title: val } : p),
                              }));
                            }}
                            className="text-sm font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-none"
                          />
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-0.5">Category</label>
                            <input
                              type="text"
                              value={proj.category}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateResumeData((prev) => ({
                                  ...prev,
                                  projects: prev.projects.map((p) => p.id === proj.id ? { ...p, category: val } : p),
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-400 block mb-0.5">Tech Stack (comma-separated)</label>
                            <input
                              type="text"
                              value={proj.tech ? proj.tech.join(', ') : ''}
                              onChange={(e) => {
                                const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                updateResumeData((prev) => ({
                                  ...prev,
                                  projects: prev.projects.map((p) => p.id === proj.id ? { ...p, tech: val } : p),
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-400 block mb-0.5">Live Demo URL</label>
                            <input
                              type="url"
                              value={proj.liveUrl || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateResumeData((prev) => ({
                                  ...prev,
                                  projects: prev.projects.map((p) => p.id === proj.id ? { ...p, liveUrl: val } : p),
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-400 block mb-0.5">GitHub Repository URL</label>
                            <input
                              type="url"
                              value={proj.githubUrl || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateResumeData((prev) => ({
                                  ...prev,
                                  projects: prev.projects.map((p) => p.id === proj.id ? { ...p, githubUrl: val } : p),
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-0.5">Tagline / Short Summary</label>
                          <input
                            type="text"
                            value={proj.tagline || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => ({
                                ...prev,
                                projects: prev.projects.map((p) => p.id === proj.id ? { ...p, tagline: val } : p),
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: EXPERIENCE */}
              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Work Experience &amp; Internships
                      </h3>
                      <p className="text-xs text-slate-400">
                        Add and edit roles, organizations, dates, and bullet achievements.
                      </p>
                    </div>
                    <button
                      onClick={handleAddExperience}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Experience</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const next = [...prev.experience];
                                next[idx] = { ...next[idx], role: val };
                                return { ...prev, experience: next };
                              });
                            }}
                            className="text-sm font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              updateResumeData((prev) => ({
                                ...prev,
                                experience: prev.experience.filter((_, i) => i !== idx),
                              }));
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const next = [...prev.experience];
                                next[idx] = { ...next[idx], company: val };
                                return { ...prev, experience: next };
                              });
                            }}
                            className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Period (e.g. 2023 — 2024)"
                            value={exp.period}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const next = [...prev.experience];
                                next[idx] = { ...next[idx], period: val };
                                return { ...prev, experience: next };
                              });
                            }}
                            className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">
                            Achievements (one bullet point per line)
                          </label>
                          <textarea
                            rows={3}
                            value={exp.achievements ? exp.achievements.join('\n') : ''}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n').filter(Boolean);
                              updateResumeData((prev) => {
                                const next = [...prev.experience];
                                next[idx] = { ...next[idx], achievements: lines };
                                return { ...prev, experience: next };
                              });
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: EDUCATION */}
              {activeTab === 'education' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Education &amp; Credentials
                      </h3>
                      <p className="text-xs text-slate-400">
                        Manage degree programs, colleges, graduation periods, and GPA.
                      </p>
                    </div>
                    <button
                      onClick={handleAddEducation}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Education</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const next = [...prev.education];
                                next[idx] = { ...next[idx], degree: val };
                                return { ...prev, education: next };
                              });
                            }}
                            className="text-sm font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              updateResumeData((prev) => ({
                                ...prev,
                                education: prev.education.filter((_, i) => i !== idx),
                              }));
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Institution"
                            value={edu.institution}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const next = [...prev.education];
                                next[idx] = { ...next[idx], institution: val };
                                return { ...prev, education: next };
                              });
                            }}
                            className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Period"
                            value={edu.period}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const next = [...prev.education];
                                next[idx] = { ...next[idx], period: val };
                                return { ...prev, education: next };
                              });
                            }}
                            className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Grade / CGPA"
                            value={edu.grade}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const next = [...prev.education];
                                next[idx] = { ...next[idx], grade: val };
                                return { ...prev, education: next };
                              });
                            }}
                            className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: ACHIEVEMENTS & CERTIFICATIONS */}
              {activeTab === 'achievements' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Achievements &amp; Certifications
                      </h3>
                      <p className="text-xs text-slate-400">
                        Highlight validated certifications and engineering milestones.
                      </p>
                    </div>
                    <button
                      onClick={handleAddAchievement}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Item</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {resumeData.achievements.map((ach, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={ach.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const next = [...prev.achievements];
                                next[idx] = { ...next[idx], title: val };
                                return { ...prev, achievements: next };
                              });
                            }}
                            className="text-sm font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              updateResumeData((prev) => ({
                                ...prev,
                                achievements: prev.achievements.filter((_, i) => i !== idx),
                              }));
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Issuing Organization"
                            value={ach.organization}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const next = [...prev.achievements];
                                next[idx] = { ...next[idx], organization: val };
                                return { ...prev, achievements: next };
                              });
                            }}
                            className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Year"
                            value={ach.year}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResumeData((prev) => {
                                const next = [...prev.achievements];
                                next[idx] = { ...next[idx], year: val };
                                return { ...prev, achievements: next };
                              });
                            }}
                            className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                          />
                        </div>

                        <textarea
                          rows={2}
                          placeholder="Description"
                          value={ach.description || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateResumeData((prev) => {
                              const next = [...prev.achievements];
                              next[idx] = { ...next[idx], description: val };
                              return { ...prev, achievements: next };
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Footer Action Controls */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
              <button
                onClick={() => {
                  setConfirmDialog({
                    message: 'Reset all resume edits and restore original default data?',
                    onConfirm: () => {
                      resetToDefault();
                      showFeedback('Reset all resume data to default version.');
                    },
                  });
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs font-mono transition flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playClick();
                  discardDraft();
                  showFeedback('Discarded changes and reloaded saved draft.');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                Discard Unsaved
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Live Multi-Template Resume Preview */}
          <div
            className={`w-full lg:w-1/2 flex flex-col bg-[#020617] overflow-hidden ${
              mobileMode === 'edit' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Live Preview Header Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono text-cyan-300 font-semibold">
                  Real-time Preview ({activeTemplate})
                </span>
              </div>

              {/* PDF & Print Action Pills */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
                  title="Copy formatted ATS Markdown text"
                >
                  {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedMd ? 'Copied' : 'Markdown'}</span>
                </button>

                <button
                  onClick={() => {
                    audioEngine.playClick();
                    window.print();
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
                  title="Native system print / Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  disabled={isExportingPdf}
                  className="px-3 py-1 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 disabled:opacity-60 transition"
                >
                  {isExportingPdf ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>PDF Export</span>
                </button>
              </div>
            </div>

            {/* Scrollable Live Sheet Canvas */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 flex justify-center">
              <div className="w-full shadow-2xl rounded overflow-hidden">
                <ResumePreview />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-white">Confirm Action</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
