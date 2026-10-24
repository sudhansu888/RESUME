import React from 'react';
import { useResume } from '../context/ResumeContext';

/**
 * Real-time Live Resume Preview supporting multiple layout templates:
 * - 'modern-blue'
 * - 'ats-clean'
 * - 'minimal-mono'
 * - 'tech-dev'
 * - 'compact-one'
 */
export default function ResumePreview({ customData = null, customTemplate = null }) {
  const { adaptedResume: ctxAdapted, activeTemplate: ctxTemplate } = useResume();
  const resume = customData || ctxAdapted;
  const template = customTemplate || ctxTemplate || 'modern-blue';

  if (!resume || !resume.profile) return null;

  const {
    profile,
    skills = [],
    projects = [],
    experience = [],
    education = [],
    certifications = [],
    achievements = [],
    customSections = [],
    sectionsOrder = ['about', 'skills', 'projects', 'experience', 'education', 'certifications', 'achievements', 'contact'],
    sectionsVisibility = {},
  } = resume;

  const isVisible = (key) => sectionsVisibility[key] !== false;

  // Base container styles per template
  const getContainerStyle = () => {
    switch (template) {
      case 'ats-clean':
        return 'bg-white text-slate-900 font-sans border border-slate-300';
      case 'minimal-mono':
        return 'bg-white text-slate-800 font-serif border border-slate-200';
      case 'tech-dev':
        return 'bg-[#050b14] text-slate-200 font-mono border border-cyan-500/30';
      case 'compact-one':
        return 'bg-white text-slate-900 font-sans border border-slate-300 text-xs';
      case 'modern-blue':
      default:
        return 'bg-white text-slate-900 font-sans border border-blue-200 shadow-xl';
    }
  };

  const isDarkDev = template === 'tech-dev';

  return (
    <div
      id="live-resume-sheet"
      className={`w-full max-w-[820px] mx-auto p-6 sm:p-10 text-left transition-all duration-200 ${getContainerStyle()}`}
      style={{ minHeight: '1100px' }}
    >
      {/* ===================== HEADER ===================== */}
      {template === 'modern-blue' && (
        <header className="border-b-2 border-blue-600 pb-5 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
                {profile.name}
              </h1>
              <p className="text-sm font-semibold text-blue-600 mt-0.5 tracking-wide">
                {profile.title}
              </p>
            </div>
            <div className="text-xs text-slate-600 sm:text-right font-medium space-y-0.5">
              <div>{profile.location}</div>
              <div>
                <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                  {profile.email}
                </a>
                {profile.phone && <span className="ml-2">• {profile.phone}</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 pt-3">
            {profile.github && (
              <span>
                GitHub: <strong className="text-slate-800">{profile.github.replace('https://', '')}</strong>
              </span>
            )}
            {profile.linkedin && (
              <>
                <span>•</span>
                <span>
                  LinkedIn: <strong className="text-slate-800">{profile.linkedin.replace('https://', '')}</strong>
                </span>
              </>
            )}
            {profile.website && (
              <>
                <span>•</span>
                <span>
                  Portfolio: <strong className="text-blue-600">{profile.website.replace('https://', '')}</strong>
                </span>
              </>
            )}
          </div>
        </header>
      )}

      {template === 'ats-clean' && (
        <header className="border-b-2 border-black pb-4 mb-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-black uppercase">
            {profile.name}
          </h1>
          <p className="text-xs font-bold text-slate-800 mt-1 uppercase tracking-wider">
            {profile.title}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-slate-700 mt-2 font-mono">
            <span>{profile.location}</span>
            <span>|</span>
            <span>{profile.email}</span>
            {profile.phone && (
              <>
                <span>|</span>
                <span>{profile.phone}</span>
              </>
            )}
            {profile.github && (
              <>
                <span>|</span>
                <span>{profile.github.replace('https://', '')}</span>
              </>
            )}
            {profile.linkedin && (
              <>
                <span>|</span>
                <span>{profile.linkedin.replace('https://', '')}</span>
              </>
            )}
          </div>
        </header>
      )}

      {template === 'minimal-mono' && (
        <header className="border-b border-slate-300 pb-5 mb-5">
          <h1 className="text-2xl sm:text-3xl font-normal tracking-wide text-slate-900">
            {profile.name}
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mt-1">
            {profile.title}
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-600 mt-3 font-mono">
            <span>{profile.email}</span>
            {profile.phone && <span>{profile.phone}</span>}
            <span>{profile.location}</span>
            {profile.github && <span>{profile.github.replace('https://', '')}</span>}
          </div>
        </header>
      )}

      {template === 'tech-dev' && (
        <header className="border-b border-cyan-500/40 pb-4 mb-5">
          <div className="flex items-center gap-2 text-xs text-cyan-400 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>developer.identity // profile.init()</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white">
            {profile.name}
          </h1>
          <p className="text-xs font-mono text-cyan-300 mt-1">
            &gt; {profile.title}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-2 font-mono">
            <span>loc: {profile.location}</span>
            <span>•</span>
            <span>mail: {profile.email}</span>
            {profile.phone && <span>• tel: {profile.phone}</span>}
            {profile.github && <span>• git: {profile.github.replace('https://', '')}</span>}
          </div>
        </header>
      )}

      {template === 'compact-one' && (
        <header className="border-b border-slate-900 pb-3 mb-3 flex justify-between items-baseline">
          <div>
            <h1 className="text-xl font-bold uppercase text-slate-950">
              {profile.name}
            </h1>
            <p className="text-xs font-semibold text-blue-700">
              {profile.title}
            </p>
          </div>
          <div className="text-[10px] text-slate-600 text-right space-y-0.5">
            <div>{profile.location} • {profile.email}</div>
            <div>{profile.github?.replace('https://', '')} • {profile.linkedin?.replace('https://', '')}</div>
          </div>
        </header>
      )}

      {/* ===================== DYNAMIC SECTIONS ===================== */}
      {sectionsOrder.map((sectionKey) => {
        if (!isVisible(sectionKey)) return null;

        // 1. Professional Summary / About
        if (sectionKey === 'about') {
          return (
            <section key="about" className="mb-4">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${
                isDarkDev
                  ? 'text-cyan-300 border-cyan-500/30'
                  : 'text-slate-900 border-slate-300'
              }`}>
                {template === 'tech-dev' ? '// 01. Professional Summary' : 'Professional Summary'}
              </h2>
              <p className={`text-xs leading-relaxed text-justify ${isDarkDev ? 'text-slate-300' : 'text-slate-700'}`}>
                {profile.summary || profile.bio}
              </p>
            </section>
          );
        }

        // 2. Technical Skills
        if (sectionKey === 'skills' && skills.length > 0) {
          return (
            <section key="skills" className="mb-4">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${
                isDarkDev
                  ? 'text-cyan-300 border-cyan-500/30'
                  : 'text-slate-900 border-slate-300'
              }`}>
                {template === 'tech-dev' ? '// 02. Technical Competencies' : 'Technical Competencies'}
              </h2>
              <div className="space-y-1.5 text-xs">
                {skills.map((skillGroup, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                    <span className={`font-bold sm:w-44 shrink-0 ${isDarkDev ? 'text-cyan-200' : 'text-slate-900'}`}>
                      {skillGroup.category}:
                    </span>
                    <span className={isDarkDev ? 'text-slate-300' : 'text-slate-700'}>
                      {skillGroup.items.map((i) => i.name).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 3. Professional Experience
        if (sectionKey === 'experience' && experience.length > 0) {
          return (
            <section key="experience" className="mb-4">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b ${
                isDarkDev
                  ? 'text-cyan-300 border-cyan-500/30'
                  : 'text-slate-900 border-slate-300'
              }`}>
                {template === 'tech-dev' ? '// 03. Professional Experience' : 'Professional Experience'}
              </h2>
              <div className="space-y-3.5">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                      <div>
                        <strong className={isDarkDev ? 'text-white' : 'text-slate-950 font-bold'}>
                          {exp.role}
                        </strong>
                        <span className={isDarkDev ? 'text-cyan-300' : 'text-slate-700'}>
                          {' '}— {exp.company}
                        </span>
                      </div>
                      <span className={`text-[11px] font-mono ${isDarkDev ? 'text-slate-400' : 'text-slate-500'}`}>
                        {exp.period} | {exp.location}
                      </span>
                    </div>

                    {exp.description && (
                      <p className={`text-[11px] italic ${isDarkDev ? 'text-slate-400' : 'text-slate-600'}`}>
                        {exp.description}
                      </p>
                    )}

                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className={`list-disc list-outside ml-4 text-[11px] space-y-1 pt-0.5 leading-relaxed ${
                        isDarkDev ? 'text-slate-300' : 'text-slate-800'
                      }`}>
                        {exp.achievements.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 4. Featured Projects
        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-4">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b ${
                isDarkDev
                  ? 'text-cyan-300 border-cyan-500/30'
                  : 'text-slate-900 border-slate-300'
              }`}>
                {template === 'tech-dev' ? '// 04. Selected Production Projects' : 'Selected Production Projects'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className={`p-2.5 rounded border space-y-1 ${
                      isDarkDev
                        ? 'border-slate-800 bg-slate-900/60'
                        : 'border-slate-200 bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className={`font-bold text-xs ${isDarkDev ? 'text-white' : 'text-slate-900'}`}>
                        {p.title}
                      </span>
                      <span className="text-[10px] font-mono text-blue-600 font-semibold">
                        {p.category}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-snug ${isDarkDev ? 'text-slate-300' : 'text-slate-600'}`}>
                      {p.tagline}
                    </p>
                    {p.tech && p.tech.length > 0 && (
                      <div className={`text-[10px] font-mono pt-0.5 ${isDarkDev ? 'text-slate-400' : 'text-slate-500'}`}>
                        <strong>Tech:</strong> {p.tech.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 5. Education
        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-3">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${
                isDarkDev
                  ? 'text-cyan-300 border-cyan-500/30'
                  : 'text-slate-900 border-slate-300'
              }`}>
                Education
              </h2>
              <div className="space-y-1.5 text-xs">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-baseline">
                    <div>
                      <div className={`font-bold ${isDarkDev ? 'text-white' : 'text-slate-900'}`}>
                        {edu.degree}
                      </div>
                      <div className={isDarkDev ? 'text-slate-300' : 'text-slate-700'}>
                        {edu.institution}
                      </div>
                    </div>
                    <div className="text-right text-[11px] font-mono text-slate-500">
                      <div>{edu.period}</div>
                      <div>{edu.grade}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 6. Certifications
        if (sectionKey === 'certifications' && certifications.length > 0) {
          return (
            <section key="certifications" className="mb-3">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${
                isDarkDev
                  ? 'text-cyan-300 border-cyan-500/30'
                  : 'text-slate-900 border-slate-300'
              }`}>
                Certifications &amp; Credentials
              </h2>
              <ul className={`text-xs space-y-1 ${isDarkDev ? 'text-slate-300' : 'text-slate-700'}`}>
                {certifications.map((cert, idx) => (
                  <li key={idx}>
                    • <strong className={isDarkDev ? 'text-white' : 'text-slate-900'}>{cert.name}</strong> — {cert.issuer} ({cert.year})
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        // 7. Achievements
        if (sectionKey === 'achievements' && achievements.length > 0) {
          return (
            <section key="achievements" className="mb-3">
              <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${
                isDarkDev
                  ? 'text-cyan-300 border-cyan-500/30'
                  : 'text-slate-900 border-slate-300'
              }`}>
                Honors &amp; Achievements
              </h2>
              <div className="space-y-2 text-xs">
                {achievements.map((item, idx) => (
                  <div key={idx}>
                    <span className={`font-bold ${isDarkDev ? 'text-white' : 'text-slate-900'}`}>
                      {item.title}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {' '}({item.organization}, {item.year})
                    </span>
                    {item.description && (
                      <p className={`text-[11px] mt-0.5 ${isDarkDev ? 'text-slate-300' : 'text-slate-600'}`}>
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        return null;
      })}

      {/* Custom user-added sections */}
      {customSections && customSections.map((sec, idx) => {
        if (!isVisible(`custom-${idx}`)) return null;
        return (
          <section key={`custom-${idx}`} className="mb-4">
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${
              isDarkDev ? 'text-cyan-300 border-cyan-500/30' : 'text-slate-900 border-slate-300'
            }`}>
              {sec.title}
            </h2>
            <div className={`text-xs whitespace-pre-line ${isDarkDev ? 'text-slate-300' : 'text-slate-700'}`}>
              {sec.content}
            </div>
          </section>
        );
      })}
    </div>
  );
}
