/**
 * Schema validation & sanitization for imported and persisted resume data.
 * Protects against XSS injection, validates data types, and ensures minimum required structure.
 */

/**
 * Basic text sanitizer to prevent script injection in user-entered fields.
 * @param {string} text
 * @returns {string}
 */
export function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

/**
 * Validates whether an imported JSON object matches the canonical resume data schema.
 * @param {any} data
 * @returns {{ isValid: boolean, error?: string, sanitizedData?: object }}
 */
export function validateResumeData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { isValid: false, error: 'Imported data must be a valid JSON object.' };
  }

  // Check required profile section
  if (!data.profile || typeof data.profile !== 'object') {
    return { isValid: false, error: 'Resume data must contain a "profile" object.' };
  }

  if (!data.profile.name || typeof data.profile.name !== 'string' || !data.profile.name.trim()) {
    return { isValid: false, error: 'Profile must have a valid non-empty "name".' };
  }

  // Validate or set default empty arrays for expected collections
  const sanitized = {
    ...data,
    profile: {
      name: sanitizeText(data.profile.name),
      title: sanitizeText(data.profile.title || ''),
      status: sanitizeText(data.profile.status || ''),
      bio: sanitizeText(data.profile.bio || ''),
      location: sanitizeText(data.profile.location || ''),
      email: sanitizeText(data.profile.email || ''),
      phone: sanitizeText(data.profile.phone || ''),
      github: sanitizeText(data.profile.github || ''),
      linkedin: sanitizeText(data.profile.linkedin || ''),
      twitter: sanitizeText(data.profile.twitter || ''),
      website: sanitizeText(data.profile.website || ''),
      photo: data.profile.photo || '/shyamal.jpg',
      quote: sanitizeText(data.profile.quote || ''),
      stats: Array.isArray(data.profile.stats) ? data.profile.stats : [],
    },
    sectionsOrder: Array.isArray(data.sectionsOrder) ? data.sectionsOrder : [
      'about', 'skills', 'projects', 'experience', 'education', 'certifications', 'achievements', 'contact'
    ],
    sectionsVisibility: (data.sectionsVisibility && typeof data.sectionsVisibility === 'object') ? data.sectionsVisibility : {
      about: true,
      skills: true,
      projects: true,
      experience: true,
      education: true,
      certifications: true,
      achievements: true,
      contact: true,
    },
    customSections: Array.isArray(data.customSections) ? data.customSections : [],
    skills: Array.isArray(data.skills) ? data.skills.map((cat) => ({
      category: sanitizeText(cat.category || 'General'),
      items: Array.isArray(cat.items) ? cat.items.map((item) => ({
        name: sanitizeText(item.name || ''),
        level: typeof item.level === 'number' ? Math.min(100, Math.max(0, item.level)) : 80,
        tag: sanitizeText(item.tag || item.name?.slice(0, 2).toUpperCase() || 'SK'),
        color: item.color || '#00f0ff',
        highlight: Boolean(item.highlight),
      })) : [],
    })) : [],
    projects: Array.isArray(data.projects) ? data.projects.map((proj, idx) => ({
      id: proj.id || `project-${Date.now()}-${idx}`,
      title: sanitizeText(proj.title || 'Untitled Project'),
      category: sanitizeText(proj.category || 'General'),
      tagline: sanitizeText(proj.tagline || ''),
      description: sanitizeText(proj.description || ''),
      highlights: Array.isArray(proj.highlights) ? proj.highlights.map(sanitizeText) : [],
      tech: Array.isArray(proj.tech) ? proj.tech.map(sanitizeText) : [],
      image: proj.image || '',
      liveUrl: sanitizeText(proj.liveUrl || proj.demo || ''),
      githubUrl: sanitizeText(proj.githubUrl || proj.github || ''),
      featured: Boolean(proj.featured),
    })) : [],
    experience: Array.isArray(data.experience) ? data.experience.map((exp) => ({
      role: sanitizeText(exp.role || ''),
      company: sanitizeText(exp.company || ''),
      period: sanitizeText(exp.period || ''),
      location: sanitizeText(exp.location || ''),
      description: sanitizeText(exp.description || ''),
      achievements: Array.isArray(exp.achievements) ? exp.achievements.map(sanitizeText) : [],
      skills: Array.isArray(exp.skills) ? exp.skills.map(sanitizeText) : [],
      current: Boolean(exp.current),
    })) : [],
    education: Array.isArray(data.education) ? data.education.map((edu) => ({
      degree: sanitizeText(edu.degree || ''),
      institution: sanitizeText(edu.institution || ''),
      period: sanitizeText(edu.period || ''),
      grade: sanitizeText(edu.grade || ''),
      highlights: Array.isArray(edu.highlights) ? edu.highlights.map(sanitizeText) : [],
    })) : [],
    certifications: Array.isArray(data.certifications) ? data.certifications.map((c) => ({
      name: sanitizeText(c.name || ''),
      issuer: sanitizeText(c.issuer || ''),
      year: sanitizeText(c.year || ''),
      badge: sanitizeText(c.badge || ''),
      url: sanitizeText(c.url || ''),
    })) : [],
    achievements: Array.isArray(data.achievements) ? data.achievements.map((a) => ({
      title: sanitizeText(a.title || ''),
      organization: sanitizeText(a.organization || ''),
      year: sanitizeText(a.year || ''),
      badge: sanitizeText(a.badge || ''),
      actionText: sanitizeText(a.actionText || 'View Details'),
      description: sanitizeText(a.description || ''),
      url: sanitizeText(a.url || '#'),
    })) : [],
    journey: Array.isArray(data.journey) ? data.journey : [],
  };

  return { isValid: true, sanitizedData: sanitized };
}
