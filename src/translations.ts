/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import en from './i18n/locales/en.json';
import om from './i18n/locales/om.json';
import am from './i18n/locales/am.json';
import ar from './i18n/locales/ar.json';
import fr from './i18n/locales/fr.json';
import { StandardLanguage } from './i18n/config.js';

export const translations = {
  en,
  om,
  am,
  ar,
  fr,
} as const;

export type TranslationDictionary = typeof en;
export type TranslationKey = keyof TranslationDictionary;

export function getTranslation(lang: StandardLanguage): TranslationDictionary {
  return translations[lang] || translations.en;
}
