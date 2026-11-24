/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StandardLanguage } from '../i18n/config.js';

export function formatDate(dateString?: string | null, lang: StandardLanguage = 'en'): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const localeMap: Record<StandardLanguage, string> = {
      en: 'en-US',
      om: 'om-ET',
      am: 'am-ET',
      ar: 'ar-SA',
      fr: 'fr-FR',
    };

    return new Intl.DateTimeFormat(localeMap[lang] || 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}
