/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api, Region } from '../lib/ohpea-api-client.js';
import { fallbackLookups } from '../data/fallbackContent.js';

export async function getLookups(): Promise<any> {
  try {
    const regions = await api.getRegions();
    if (Array.isArray(regions) && regions.length > 0) {
      return {
        ...fallbackLookups,
        regions: regions.map((r: Region) => ({
          id: r.id,
          code: r.id,
          label: { en: r.name, om: r.name, am: r.name, ar: r.name, fr: r.name },
          woredas: r.woredas || [],
        })),
      };
    }
    return fallbackLookups;
  } catch {
    return fallbackLookups;
  }
}

export const getRegions = () => api.getRegions();
