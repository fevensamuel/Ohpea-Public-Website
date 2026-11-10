/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api, PublicStats } from '../lib/ohpea-api-client.js';
import { fallbackStats } from '../data/fallbackContent.js';

export async function getStats(): Promise<PublicStats> {
  try {
    return await api.getStats();
  } catch {
    return fallbackStats;
  }
}

export const fetchPublicStats = getStats;
