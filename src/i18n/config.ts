/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StandardLanguage = 'en' | 'om' | 'am' | 'ar' | 'fr';

export interface LanguageOption {
  code: StandardLanguage;
  label: string;
  nativeLabel: string;
  dir: 'ltr' | 'rtl';
  flag: string;
  fontClass: string;
}

export const LANGUAGES: Record<StandardLanguage, LanguageOption> = {
  en: { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr', flag: '🇬🇧', fontClass: 'font-sans' },
  om: { code: 'om', label: 'Afaan Oromo', nativeLabel: 'Afaan Oromoo', dir: 'ltr', flag: '🇪🇹', fontClass: 'font-sans' },
  am: { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ', dir: 'ltr', flag: '🇪🇹', fontClass: 'font-amharic' },
  ar: { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl', flag: '🇸🇦', fontClass: 'font-arabic' },
  fr: { code: 'fr', label: 'French', nativeLabel: 'Français', dir: 'ltr', flag: '🇫🇷', fontClass: 'font-sans' },
};

export const DEFAULT_LANGUAGE: StandardLanguage = 'en';
export const LANGUAGE_STORAGE_KEY = 'ophea_language';

export function normalizeLanguage(raw?: string | null): StandardLanguage {
  if (!raw) return DEFAULT_LANGUAGE;
  const lower = raw.trim().toLowerCase();
  if (lower.startsWith('om') || lower === 'orm') return 'om';
  if (lower.startsWith('am')) return 'am';
  if (lower.startsWith('ar')) return 'ar';
  if (lower.startsWith('fr')) return 'fr';
  if (lower.startsWith('en')) return 'en';
  return DEFAULT_LANGUAGE;
}

export function getInitialLanguage(): StandardLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved) return normalizeLanguage(saved);
  } catch {
    // Local storage not accessible
  }

  if (navigator.languages && navigator.languages.length > 0) {
    for (const lang of navigator.languages) {
      const normalized = normalizeLanguage(lang);
      if (normalized !== DEFAULT_LANGUAGE) return normalized;
    }
  }

  if (navigator.language) {
    return normalizeLanguage(navigator.language);
  }

  return DEFAULT_LANGUAGE;
}

export function applyHtmlLanguageAttributes(lang: StandardLanguage) {
  if (typeof document === 'undefined') return;
  const config = LANGUAGES[lang] || LANGUAGES.en;
  const html = document.documentElement;

  html.setAttribute('lang', config.code);
  html.setAttribute('dir', config.dir);

  document.body.classList.remove('font-sans', 'font-amharic', 'font-arabic');
  document.body.classList.add(config.fontClass);
}
