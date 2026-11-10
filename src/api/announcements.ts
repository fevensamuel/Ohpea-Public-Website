/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api, Announcement } from '../lib/ohpea-api-client.js';
import { fallbackAnnouncements } from '../data/fallbackContent.js';

export async function getAnnouncements(
  params: { type?: string; limit?: number; page?: number } = {}
): Promise<Announcement[]> {
  try {
    const queryType = params.type && params.type !== 'all' ? (params.type as Announcement['type']) : undefined;
    const res = await api.getAnnouncements({
      type: queryType,
      limit: params.limit,
      page: params.page,
    });
    return res.data && res.data.length > 0 ? res.data : (fallbackAnnouncements as unknown as Announcement[]);
  } catch {
    return fallbackAnnouncements as unknown as Announcement[];
  }
}

export async function getAnnouncementBySlug(slug: string): Promise<Announcement | null> {
  try {
    return await api.getAnnouncement(slug);
  } catch {
    const found = fallbackAnnouncements.find((a) => a.slug === slug || a.id === slug);
    return (found as unknown as Announcement) || null;
  }
}
