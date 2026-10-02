/**
 * Safe Prism.js highlighting helper
 * Protects against ReferenceError: Prism is not defined in bundled ESM contexts
 */

declare global {
  interface Window {
    Prism?: any;
  }
}

export function getPrism(): any {
  if (typeof window !== 'undefined' && window.Prism) {
    return window.Prism;
  }
  return null;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function highlightCode(code: string, language: 'html' | 'javascript' | 'python' | string): string {
  const prism = getPrism();
  const langKey = language === 'html' ? 'markup' : language === 'python' ? 'python' : 'javascript';

  if (prism && prism.languages && prism.languages[langKey]) {
    try {
      return prism.highlight(code, prism.languages[langKey], langKey);
    } catch (e) {
      console.warn('Prism highlighting fallback:', e);
    }
  }

  return escapeHtml(code);
}
