/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StandardLanguage } from '../i18n/config.js';

export function formatNumber(num: number, lang: StandardLanguage = 'en'): string {
  try {
    const localeMap: Record<StandardLanguage, string> = {
      en: 'en-US',
      om: 'om-ET',
      am: 'am-ET',
      ar: 'ar-SA',
      fr: 'fr-FR',
    };
    return new Intl.NumberFormat(localeMap[lang] || 'en-US').format(num);
  } catch {
    return String(num);
  }
}
