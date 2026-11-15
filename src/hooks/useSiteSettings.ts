/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { api, ApiError, SiteSettings } from '../lib/ophea-api-client.js';
import { LookupData } from '../types.js';
import { fallbackSiteSettings, fallbackStats, fallbackLookups } from '../data/fallbackContent.js';

export function useSiteSettings() {
  const [settings, setSettings] = useState<any>(fallbackSiteSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getSiteSettings()
      .then((data) => {
        if (mounted && data) setSettings(data);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { settings, loading };
}

export function useStats() {
  const [stats, setStats] = useState<any>(fallbackStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getStats()
      .then((data) => {
        if (mounted && data) setStats(data);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { stats, loading };
}

export function useLookups() {
  const [lookups, setLookups] = useState<LookupData>(fallbackLookups);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getRegions()
      .then((regions) => {
        if (mounted && Array.isArray(regions) && regions.length > 0) {
          setLookups({
            ...fallbackLookups,
            regions: regions.map((r) => ({
              id: r.id,
              code: r.id,
              label: { en: r.name, om: r.name, am: r.name, ar: r.name, fr: r.name },
              woredas: r.woredas || [],
            })),
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { lookups, loading };
}
