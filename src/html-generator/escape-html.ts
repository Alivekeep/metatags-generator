/**
 * HTML replacements
 */
const replacements = {
  '"': '&quot;',
  '&': '&amp;',
  '\'': '&#39;',
  '<': '&lt;',
  '>': '&gt;'
};

/**
 * Escapes Regular expression
 */
const escapesRegexp: RegExp = /["'&<>]/g;

/**
 * Escape HTML entities
 */
export const escapeHTML = (h: string): string => h.replace(escapesRegexp, (s) => replacements[s]);
