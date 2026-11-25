/**
 * Programs — editorial redesign.
 * Data: GET /public/programs via api.getPrograms() (unchanged). Loading / empty
 * states and the /programs/:slug links behave exactly as before.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, useTranslation } from '../i18n/LanguageContext.js';
import { api } from '../lib/ophea-api-client.js';
import { localize } from '../utils/localize.js';
import { EditorialShell } from '../components/home/EditorialShell.js';
import { EditorialPageHero } from '../components/home/EditorialPageHero.js';
import { Reveal } from '../components/home/Reveal.js';
import { SLOT, photo } from '../components/home/images.js';

const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const pad = (n: number) => String(n).padStart(2, '0');
export const programPhoto = (prog: any, idx: number): string =>
  str(prog?.imageUrl) || str(prog?.iconUrl) || photo(SLOT.programDetail[idx % SLOT.programDetail.length]);

export const Programs: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .getPrograms()
      .then((data) => { if (mounted) setPrograms(Array.isArray(data) ? data : []); })
      .catch(() => { if (mounted) setPrograms([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  // hover / focus preview (same interaction as the homepage focus areas)
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [dim, setDim] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const activate = (i: number) => {
    setActive(i);
    if (i === shown) return;
    setDim(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { setShown(i); setDim(false); }, 110);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const cur = programs[Math.min(shown, Math.max(programs.length - 1, 0))];

  return (
    <EditorialShell>
      <main id="main">
        <EditorialPageHero
          image={photo(SLOT.programsHero)}
          eyebrow={t('home.strategicPillars')}
          title={t('home.strategicPillarsTitle')}
          subtitle={t('home.strategicPillarsDesc')}
          crumbs={[{ label: t('nav.programs') }]}
        />

        <Reveal as="section" className="max-w-[1320px] mx-auto px-6 md:px-12 py-24 md:py-32">
          {loading ? (
            <p role="status" className="py-12 text-ink/55 text-sm">Loading programs...</p>
          ) : programs.length === 0 ? (
            <p className="py-12 text-ink/55 text-sm">No programs available.</p>
          ) : (
            <div className="grid lg:grid-cols-12 gap-10 items-start">
              <ol className="lg:col-span-8 border-t border-ink/15">
                {programs.map((prog, idx) => {
                  const title = localize(prog.title, language);
                  const summary = localize(prog.summary, language);
                  const bullets: string[] = (prog.bullets || []).map((b: any) => localize(b, language)).filter(Boolean);
                  return (
                    <li key={prog.id}>
                      <Link
                        to={`/programs/${prog.slug}`} data-cursor="link"
                        onMouseEnter={() => activate(idx)} onFocus={() => activate(idx)}
                        className="group flex items-start justify-between gap-6 py-8 px-3 border-b border-ink/15 hover:bg-sand focus-visible:bg-sand transition"
                      >
                        <div className="flex items-baseline gap-6 min-w-0">
                          <span className="font-display text-2xl text-ochre shrink-0">{pad(idx + 1)}</span>
                          <div className="min-w-0">
                            <h2 className="font-display text-3xl md:text-4xl leading-tight group-hover:italic transition-all">{title}</h2>
                            {summary && <p className="mt-2 text-sm md:text-[15px] text-ink/70 leading-relaxed max-w-xl">{summary}</p>}
                            {bullets.length > 0 && (
                              <p className="mt-3 text-[11px] font-semibold tracking-[0.14em] uppercase text-ochre-dark/80 leading-relaxed">
                                {bullets.slice(0, 3).join('  ·  ')}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-ochre text-lg shrink-0 mt-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true">↗</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>

              <div className="hidden lg:block lg:col-span-4 sticky top-28" aria-hidden="true">
                <div className="border border-ink/15 p-3 bg-sand">
                  <img src={programPhoto(cur, shown)} alt="" decoding="async"
                    className={`w-full h-[440px] object-cover transition-opacity duration-300 ${dim ? 'opacity-45' : 'opacity-100'}`} />
                  <div className="pt-4 pb-1 px-1">
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ochre">{pad(active + 1)} / {localize(programs[active]?.title, language)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Reveal>
      </main>
    </EditorialShell>
  );
};
