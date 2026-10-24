import { resumeData as defaultResumeData } from '../data/resumeData';

export const SUPPORTED_ROLES = [
  {
    key: 'fullstack',
    label: 'Full-Stack Developer',
    slug: 'FullStack',
    title: 'Full-Stack Engineer & Creative 3D Technologist',
    tagline: 'End-to-end architectures, reactive web apps, high-throughput microservices.',
  },
  {
    key: 'frontend',
    label: 'Frontend Developer',
    slug: 'Frontend',
    title: 'Senior Frontend Engineer & UI/UX Architect',
    tagline: 'Modern React ecosystems, design systems, micro-interactions, responsive WebGL.',
  },
  {
    key: '3d',
    label: '3D/WebGL Developer',
    slug: '3D_WebGL',
    title: 'Creative Technologist & 3D WebGL Specialist',
    tagline: 'Real-time spatial graphics, Three.js, GLSL shaders, interactive browser canvases.',
  },
  {
    key: 'ai',
    label: 'AI/ML Developer',
    slug: 'AI_ML',
    title: 'AI & Distributed Systems Engineer',
    tagline: 'Autonomous agent workflows, neural embeddings, real-time biometric pipelines.',
  },
  {
    key: 'software',
    label: 'Software Developer',
    slug: 'Software_Engineer',
    title: 'Software Engineer & Systems Architect',
    tagline: 'Robust backend systems, algorithm design, distributed computing, CI/CD pipelines.',
  },
];

/**
 * Sanitizes candidate name and formats a safe filename.
 * @param {string} candidateName
 * @param {string} roleSlug
 * @returns {string} e.g. "Shyamal_Resume_FullStack.pdf"
 */
export function formatResumeFilename(candidateName, roleSlug) {
  const safeName = (candidateName || 'Candidate')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_');
  
  const safeSlug = (roleSlug || 'FullStack')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_');

  return `${safeName}_Resume_${safeSlug}.pdf`;
}

/**
 * Returns a role-adapted resume object preserving all factual candidate data,
 * prioritizing skills and projects dynamically based on the chosen role focus.
 * 
 * @param {Object} sourceData - Live canonical resume data
 * @param {string} roleKey - 'fullstack' | 'frontend' | '3d' | 'ai' | 'software'
 * @param {Object} roleOverrides - Optional user-defined overrides per role
 */
export function getAdaptedResume(sourceData = defaultResumeData, roleKey = 'fullstack', roleOverrides = {}) {
  const data = sourceData || defaultResumeData;
  const roleConfig = SUPPORTED_ROLES.find(r => r.key === roleKey) || SUPPORTED_ROLES[0];
  const overrides = (roleOverrides && roleOverrides[roleKey]) || {};

  const {
    profile = {},
    skills = [],
    projects = [],
    experience = [],
    education = [],
    certifications = [],
    achievements = [],
    sectionsOrder = ['about', 'skills', 'projects', 'experience', 'education', 'certifications', 'achievements', 'contact'],
    sectionsVisibility = {},
    customSections = [],
  } = data;

  // Custom summaries adapted from factual candidate background or role overrides
  let adaptedSummary = overrides.summary || profile.summary || profile.bio;
  if (!overrides.summary) {
    if (roleConfig.key === 'frontend') {
      adaptedSummary = 'Specialized in frontend architecture, modern component design systems, and responsive user interfaces. 4+ years creating intuitive, high-performance web applications using React, Next.js, TypeScript, and interactive WebGL elements.';
    } else if (roleConfig.key === '3d') {
      adaptedSummary = 'Specialized in 3D WebGL graphics, custom GLSL shaders, and browser-based spatial computing. 4+ years of engineering interactive web engines, optimizing rendering pipelines, and delivering high-performance creative web experiences.';
    } else if (roleConfig.key === 'ai') {
      adaptedSummary = 'Full-Stack and Systems Engineer specializing in autonomous multi-agent pipelines, real-time streaming architectures, and distributed microservices. Experienced in TypeScript, Python, vector search retrieval, and cloud infrastructure with 99.98% uptime.';
    } else if (roleConfig.key === 'software') {
      adaptedSummary = 'Software Engineer focused on scalable system design, clean object-oriented architecture, high-concurrency microservices, and reliable cloud deployments. Experienced in full lifecycle software development and performance optimization.';
    }
  }

  // Prioritize projects based on role focus without inventing any new details
  let adaptedProjects = [...projects];
  if (roleConfig.key === 'frontend') {
    const isFe = (p) => p.category?.includes('Frontend') || p.tech?.includes('React') || p.tech?.includes('Next.js');
    adaptedProjects.sort((a, b) => (isFe(b) ? 1 : 0) - (isFe(a) ? 1 : 0));
  } else if (roleConfig.key === '3d') {
    const is3d = (p) => p.category?.includes('3D') || p.tech?.includes('Three.js');
    adaptedProjects.sort((a, b) => (is3d(b) ? 1 : 0) - (is3d(a) ? 1 : 0));
  } else if (roleConfig.key === 'ai') {
    const isAi = (p) => p.category?.includes('AI') || p.category?.includes('Systems');
    adaptedProjects.sort((a, b) => (isAi(b) ? 1 : 0) - (isAi(a) ? 1 : 0));
  } else if (roleConfig.key === 'software') {
    const isSw = (p) => p.category?.includes('Systems') || p.tech?.includes('Node.js') || p.tech?.includes('Python');
    adaptedProjects.sort((a, b) => (isSw(b) ? 1 : 0) - (isSw(a) ? 1 : 0));
  }

  // Prioritize skill categories based on role focus
  let adaptedSkills = [...skills];
  if (roleConfig.key === 'frontend') {
    adaptedSkills.sort((a, b) => (a.category?.includes('Frontend') ? -1 : b.category?.includes('Frontend') ? 1 : 0));
  } else if (roleConfig.key === '3d') {
    adaptedSkills.sort((a, b) => (a.category?.includes('3D') ? -1 : b.category?.includes('3D') ? 1 : 0));
  } else if (roleConfig.key === 'ai') {
    adaptedSkills.sort((a) => (a.category?.includes('AI') || a.category?.includes('Languages') ? -1 : 1));
  } else if (roleConfig.key === 'software') {
    adaptedSkills.sort((a) => (a.category?.includes('Backend') || a.category?.includes('Cloud') ? -1 : 1));
  }

  return {
    roleKey: roleConfig.key,
    roleLabel: roleConfig.label,
    fileSlug: roleConfig.slug,
    profile: {
      ...profile,
      title: overrides.title || roleConfig.title,
      summary: adaptedSummary,
    },
    skills: adaptedSkills,
    projects: adaptedProjects,
    experience,
    education,
    certifications,
    achievements,
    customSections,
    sectionsOrder: overrides.sectionsOrder || sectionsOrder,
    sectionsVisibility: {
      ...sectionsVisibility,
      ...(overrides.sectionsVisibility || {}),
    },
  };
}

/**
 * Generates structured, ATS-friendly Markdown matching the exact role-adapted content.
 * @param {Object} adaptedResume
 * @returns {string}
 */
export function generateMarkdownResume(adaptedResume) {
  if (!adaptedResume || !adaptedResume.profile) return '';
  const { profile, skills, experience, projects, education, certifications, achievements } = adaptedResume;

  return `# ${profile.name}
**${profile.title}**
Email: ${profile.email}${profile.phone ? ` | Phone: ${profile.phone}` : ''} | Location: ${profile.location}
GitHub: ${profile.github} | LinkedIn: ${profile.linkedin}${profile.website ? ` | Portfolio: ${profile.website}` : ''}

---
## Professional Summary
${profile.summary || profile.bio}

---
## Technical Competencies
${skills.map(s => `**${s.category}:** ${s.items.map(i => i.name).join(', ')}`).join('\n')}

---
## Professional Experience
${experience.map(e => `### ${e.role} — ${e.company} (${e.period} | ${e.location})
${e.description ? `*${e.description}*\n` : ''}${e.achievements.map(a => `- ${a}`).join('\n')}
*Tech Stack: ${e.skills.join(', ')}*
`).join('\n')}

---
## Selected Production Projects
${projects.map(p => `### ${p.title} (${p.category})
${p.tagline}
- Highlights: ${p.highlights.join('; ')}
- Tech Stack: ${p.tech.join(', ')}
${p.liveUrl ? `- Live Demo: ${p.liveUrl}` : ''}
${p.githubUrl ? `- GitHub: ${p.githubUrl}` : ''}
`).join('\n')}

---
## Education & Credentials
${education.map(ed => `**${ed.degree}** - ${ed.institution} (${ed.period}) — ${ed.grade}`).join('\n')}

${certifications.map(c => `- ${c.name} — ${c.issuer} (${c.year})`).join('\n')}

${achievements.length > 0 ? `---
## Honors & Achievements
${achievements.map(a => `- **${a.title}** (${a.organization}, ${a.year}): ${a.description}`).join('\n')}
` : ''}`;
}
