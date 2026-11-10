/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api, Activity } from '../lib/ohpea-api-client.js';
import { fallbackActivities } from '../data/fallbackContent.js';

export async function getActivities(limit = 4): Promise<Activity[]> {
  try {
    const data = await api.getActivities();
    return Array.isArray(data) && data.length > 0
      ? data.slice(0, limit)
      : (fallbackActivities.slice(0, limit) as unknown as Activity[]);
  } catch {
    return fallbackActivities.slice(0, limit) as unknown as Activity[];
  }
}
