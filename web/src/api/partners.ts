/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api, Partner } from '../lib/ophea-api-client.js';
import { fallbackPartners } from '../data/fallbackContent.js';

export async function getPartners(): Promise<Partner[]> {
  try {
    const data = await api.getPartners();
    return Array.isArray(data) && data.length > 0 ? data : (fallbackPartners as unknown as Partner[]);
  } catch {
    return fallbackPartners as unknown as Partner[];
  }
}
