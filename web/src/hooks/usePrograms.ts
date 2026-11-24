import { useEffect, useState } from 'react';
import { api, Program } from '../lib/ophea-api-client.js';

/** Live programs list from the backend (empty until loaded or if none are published). */
export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  useEffect(() => {
    let mounted = true;
    api.getPrograms()
      .then((d) => { if (mounted && Array.isArray(d)) setPrograms(d); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);
  return programs;
}
