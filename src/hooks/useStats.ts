import { useState, useEffect } from 'react';
import { api, ApiError, PublicStats } from '../lib/ohpea-api-client.js';
import { fallbackStats } from '../data/fallbackContent.js';
import { isDemoMode } from '../lib/demoMode.js';

export const useStats = () => {
  const [stats, setStats] = useState<PublicStats>(fallbackStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api.getStats()
      .then((data) => {
        if (mounted && data) {
          setStats(data);
        }
      })
      .catch((err) => {
        if (mounted) {
          if (err instanceof ApiError) {
            setError(err.message);
          } else {
            setError((err as Error).message || 'Failed to fetch stats');
          }
          if (!isDemoMode()) {
            setStats({} as PublicStats);
          }
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { stats, loading, error };
};
