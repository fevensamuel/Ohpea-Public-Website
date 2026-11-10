/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api, SiteSettings } from '../lib/ohpea-api-client.js';
import { fallbackSiteSettings } from '../data/fallbackContent.js';

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await api.getSiteSettings();
  } catch {
    return fallbackSiteSettings as unknown as SiteSettings;
  }
}
