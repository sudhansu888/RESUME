import React, { forwardRef } from 'react';
import { useResume } from '../context/ResumeContext';

const PrintableResumeSheet = forwardRef(function PrintableResumeSheet(
  { adaptedData = null },
  ref
) {
  const ctx = useResume();
  const resume = adaptedData || ctx?.adaptedResume;
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
    sectionsVisibility = {},
  } = resume;

  const isVisible = (key) => sectionsVisibility[key] !== false;

  return (
    <div
      ref={ref}
      id="printable-ats-resume"
      className="bg-white text-slate-900 font-sans p-6 sm:p-10 max-w-[820px] w-full mx-auto text-left leading-normal selection:bg-blue-100 selection:text-black shadow-none border border-slate-300"
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: '#0f172a',
      }}
    >
      {/* Header */}
      <header className="border-b-2 border-slate-900 pb-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 uppercase">
              {profile.name}
            </h1>
            <p className="text-sm font-semibold text-blue-700 mt-0.5">
              {profile.title}
            </p>
          </div>
          <div className="text-xs font-mono text-slate-600 sm:text-right space-y-0.5">
            {profile.location && <div>{profile.location}</div>}
            {profile.email && (
              <div>
                <a href={`mailto:${profile.email}`} className="text-blue-700 hover:underline">
                  {profile.email}
                </a>
              </div>
            )}
            {profile.phone && <div>{profile.phone}</div>}
          </div>
        </div>

        {/* Contact Links Bar */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 pt-2 font-mono">
          {profile.github && (
            <span>
              GitHub:{' '}
              <a href={profile.github} target="_blank" rel="noreferrer" className="text-slate-800 font-semibold hover:underline">
                {profile.github.replace('https://', '')}
              </a>
            </span>
          )}
          {profile.linkedin && (
            <>
              <span>•</span>
              <span>
                LinkedIn:{' '}
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-slate-800 font-semibold hover:underline">
                  {profile.linkedin.replace('https://', '')}
                </a>
              </span>
            </>
          )}
          {profile.website && (
            <>
              <span>•</span>
              <span>
                Portfolio:{' '}
                <span className="text-blue-700 font-semibold">{profile.website.replace('https://', '')}</span>
              </span>
            </>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {isVisible('about') && (profile.summary || profile.bio) && (
        <section className="mb-4" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {profile.summary || profile.bio}
          </p>
        </section>
      )}

      {/* Technical Competencies */}
      {isVisible('skills') && skills.length > 0 && (
        <section className="mb-4" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Technical Competencies
          </h2>
          <div className="space-y-1.5 text-xs">
            {skills.map((skillGroup) => (
              <div key={skillGroup.category} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                <span className="font-bold text-slate-900 sm:w-44 shrink-0">
                  {skillGroup.category}:
                </span>
                <span className="text-slate-700 text-xs">
                  {skillGroup.items.map((i) => i.name).join(', ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {isVisible('experience') && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div
                key={idx}
                className="space-y-1"
                style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs font-medium">
                  <div>
                    <strong className="text-slate-950 font-bold text-xs">{exp.role}</strong>
                    <span className="text-slate-700"> — {exp.company}</span>
                  </div>
                  <span className="font-mono text-slate-600 text-[11px]">
                    {exp.period} | {exp.location}
                  </span>
                </div>

                {exp.description && (
                  <p className="text-[11px] text-slate-600 italic">
                    {exp.description}
                  </p>
                )}

                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-[11px] text-slate-800 space-y-1 pt-0.5 leading-relaxed">
                    {exp.achievements.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Selected Production Projects */}
      {isVisible('projects') && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            Selected Production Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {projects.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-2.5 rounded border border-slate-200 bg-slate-50/70 space-y-1"
                style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-slate-900 text-xs">{p.title}</span>
                  <span className="text-[10px] font-mono text-blue-700 font-semibold">{p.category}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-snug">{p.tagline}</p>
                {p.tech && (
                  <div className="text-[10px] font-mono text-slate-500 pt-0.5">
                    <strong>Tech:</strong> {p.tech.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200"
        style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
      >
        {isVisible('education') && education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
              Education
            </h2>
            {education.map((ed, i) => (
              <div key={i} className="text-[11px] space-y-0.5 mb-2">
                <div className="font-bold text-slate-900">{ed.degree}</div>
                <div className="text-slate-700">{ed.institution} ({ed.period})</div>
                {ed.grade && <div className="text-slate-500 font-mono text-[10px]">{ed.grade}</div>}
              </div>
            ))}
          </div>
        )}

        {isVisible('certifications') && certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
              Certifications &amp; Credentials
            </h2>
            <ul className="text-[11px] text-slate-700 space-y-1">
              {certifications.map((c, i) => (
                <li key={i}>
                  • <strong className="text-slate-900">{c.name}</strong> — {c.issuer} {c.year ? `(${c.year})` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Honors & Achievements */}
      {isVisible('achievements') && achievements.length > 0 && (
        <section className="mt-3 pt-2 border-t border-slate-200" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
            Honors &amp; Achievements
          </h2>
          <div className="space-y-1.5 text-xs">
            {achievements.map((item, idx) => (
              <div key={idx} className="text-[11px]">
                <strong className="text-slate-900">{item.title}</strong> — {item.organization} ({item.year})
                {item.description && <span className="text-slate-600 block mt-0.5">{item.description}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {customSections && customSections.map((sec, idx) => {
        if (!isVisible(`custom-${idx}`)) return null;
        return (
          <section key={`custom-${idx}`} className="mt-3 pt-2 border-t border-slate-200" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
              {sec.title}
            </h2>
            <div className="text-xs text-slate-700 whitespace-pre-line">
              {sec.content}
            </div>
          </section>
        );
      })}
    </div>
  );
});

export default PrintableResumeSheet;
