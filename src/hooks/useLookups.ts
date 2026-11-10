import { useState, useEffect } from 'react';
import { LookupData } from '../types.js';
import { api, Region } from '../lib/ohpea-api-client.js';
import { fallbackLookups } from '../data/fallbackContent.js';

export const useLookups = () => {
  const [lookups, setLookups] = useState<LookupData>(fallbackLookups);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getRegions()
      .then((regions) => {
        if (mounted && Array.isArray(regions) && regions.length > 0) {
          setLookups({
            ...fallbackLookups,
            regions: regions.map((r: Region) => ({
              id: r.id,
              code: r.id,
              label: { en: r.name, om: r.name, am: r.name, ar: r.name, fr: r.name },
              woredas: r.woredas || [],
            })),
          });
        }
      })
      .catch(() => {
        if (mounted) setLookups(fallbackLookups);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { lookups, loading };
};
