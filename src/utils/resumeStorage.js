/**
 * LocalStorage draft persistence and JSON Import / Export management.
 */

import { validateResumeData } from './resumeValidation';

export const RESUME_STORAGE_KEY = 'editable_resume_portfolio_data_v2';
export const THEME_STORAGE_KEY = 'resume_portfolio_theme_settings_v2';
export const ROLE_SETTINGS_KEY = 'resume_portfolio_role_overrides_v2';

/**
 * Loads saved resume draft from localStorage, falling back to default canonical data.
 * @param {object} defaultData
 * @returns {object}
 */
export function loadSavedResume(defaultData) {
  try {
    const raw = localStorage.getItem(RESUME_STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    const { isValid, sanitizedData } = validateResumeData(parsed);
    if (isValid && sanitizedData) {
      // Merge with default sectionsOrder and sectionsVisibility if missing
      return {
        ...defaultData,
        ...sanitizedData,
        sectionsOrder: sanitizedData.sectionsOrder || defaultData.sectionsOrder || [
          'about', 'skills', 'projects', 'experience', 'education', 'certifications', 'achievements', 'contact'
        ],
        sectionsVisibility: {
          ...defaultData.sectionsVisibility,
          ...sanitizedData.sectionsVisibility,
        },
      };
    }
    return defaultData;
  } catch (err) {
    console.warn('Failed to parse saved resume from localStorage:', err);
    return defaultData;
  }
}

/**
 * Saves current resume data draft into localStorage.
 * @param {object} data
 */
export function saveResumeDraft(data) {
  try {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Failed to save resume draft to localStorage:', err);
    return false;
  }
}

/**
 * Purges draft from localStorage to restore to default.
 */
export function clearSavedResumeDraft() {
  try {
    localStorage.removeItem(RESUME_STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('Failed to clear saved resume draft:', err);
    return false;
  }
}

/**
 * Downloads current resume object as a formatted JSON file.
 * @param {object} data
 * @param {string} candidateName
 */
export function exportResumeJson(data, candidateName = 'Shyamal') {
  const safeName = candidateName.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Resume';
  const fileName = `${safeName}_Resume_Data.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/**
 * Parses and validates an uploaded JSON file into canonical resume data.
 * @param {File} file
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export function importResumeJson(file) {
  return new Promise((resolve) => {
    if (!file) {
      return resolve({ success: false, error: 'No file provided.' });
    }
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      return resolve({ success: false, error: 'File must be a JSON document (.json).' });
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parsed = JSON.parse(text);
        const { isValid, error, sanitizedData } = validateResumeData(parsed);
        if (!isValid) {
          return resolve({ success: false, error: error || 'Invalid resume schema.' });
        }
        resolve({ success: true, data: sanitizedData });
      } catch (err) {
        resolve({ success: false, error: `JSON Parse error: ${err.message}` });
      }
    };
    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read file from disk.' });
    };
    reader.readAsText(file);
  });
}
