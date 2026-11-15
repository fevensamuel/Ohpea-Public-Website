/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api, Program } from '../lib/ophea-api-client.js';
import { fallbackPrograms } from '../data/fallbackContent.js';

export async function getPrograms(): Promise<Program[]> {
  try {
    const data = await api.getPrograms();
    return Array.isArray(data) && data.length > 0 ? data : (fallbackPrograms as unknown as Program[]);
  } catch {
    return fallbackPrograms as unknown as Program[];
  }
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  try {
    return await api.getProgram(slug);
  } catch {
    const found = fallbackPrograms.find((p) => p.slug === slug || p.id === slug);
    return (found as unknown as Program) || null;
  }
}
