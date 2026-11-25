/**
 * Program detail — editorial redesign.
 * Data: GET /public/programs/{slug} via api.getProgram(slug) (unchanged), merged
 * into state exactly as before. Fields used: title, summary, body, bullets, icon,
 * and imageUrl/iconUrl when the API supplies one.
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, BookOpen, Globe, Handshake, Shield, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { localize } from '../utils/localize.js';
import { api } from '../lib/ophea-api-client.js';
import { EditorialShell } from '../components/home/EditorialShell.js';
import { EditorialPageHero } from '../components/home/EditorialPageHero.js';
import { Reveal } from '../components/home/Reveal.js';
import { SLOT, photo } from '../components/home/images.js';

const iconMap: Record<string, React.ElementType> = { BookOpen, Shield, Award, Handshake, TrendingUp, Users, Globe };
const str = (v: unknown): string => (typeof v === 'string' ? v : '');

export const ProgramDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useTranslation();

  const [program, setProgram] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [position, setPosition] = React.useState(0);

  React.useEffect(() => {
    if (!slug) return;
    let mounted = true;
    api
      .getProgram(slug)
      .then((data) => { if (mounted && data) setProgram((prev: any) => ({ ...prev, ...data })); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    // position in the programs list picks the default photograph
    api.getPrograms().then((list) => {
      if (!mounted || !Array.isArray(list)) return;
      const i = list.findIndex((p: any) => p.slug === slug);
      if (i >= 0) setPosition(i);
    }).catch(() => {});
    return () => { mounted = false; };
  }, [slug]);

  if (loading && !program) {
    return (
      <EditorialShell>
        <main id="main" className="min-h-[70svh] flex items-center justify-center"><p role="status" className="text-sm text-ink/50">…</p></main>
      </EditorialShell>
    );
  }

  if (!program) {
    return (
      <EditorialShell>
        <main id="main">
          <EditorialPageHero size="sm" title={t('program.notFound')} subtitle={t('program.notFoundDesc')} crumbs={[{ label: t('nav.programs'), to: '/programs' }]} />
          <section className="max-w-3xl mx-auto px-6 py-20 text-center">
            <Link to="/programs" data-cursor="link" className="inline-flex border border-ink/70 px-7 py-3.5 font-display text-lg hover:bg-ink hover:text-white transition">
              {t('program.viewAll')}
            </Link>
          </section>
        </main>
      </EditorialShell>
    );
  }

  const Icon = iconMap[program.icon] || Award;
  const title = localize(program.title, language);
  const summary = localize(program.summary, language);
  const body = localize(program.body, language);
  const bullets: string[] = (program.bullets || []).map((b: any) => localize(b, language)).filter(Boolean);
  const heroImage = str(program.imageUrl) || str(program.iconUrl) || photo(SLOT.programDetail[position % SLOT.programDetail.length]);

  return (
    <EditorialShell>
      <main id="main">
        <EditorialPageHero
          image={heroImage}
          title={title}
          subtitle={summary}
          crumbs={[{ label: t('nav.programs'), to: '/programs' }, { label: title }]}
        />

        <Reveal as="section" className="max-w-[1320px] mx-auto px-6 md:px-12 py-24 md:py-32 grid lg:grid-cols-12 gap-14 lg:gap-20">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-12 rounded-full border border-ink/25 text-ochre flex items-center justify-center" aria-hidden="true"><Icon className="w-5 h-5" /></span>
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-ochre">{t('program.overviewScope')}</p>
            </div>
            {body && <p className="font-display text-2xl md:text-[30px] font-light leading-[1.4] text-ink/90 whitespace-pre-line">{body}</p>}
          </div>

          {bullets.length > 0 && (
            <div className="lg:col-span-5">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-ochre mb-5">{t('program.keyDeliverables')}</p>
              <ol className="border-t border-ink/15">
                {bullets.map((b, i) => (
                  <li key={i} className="flex gap-5 py-5 border-b border-ink/15">
                    <span className="font-display text-xl text-ochre w-8 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[15px] leading-relaxed text-ink/80">{b}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </Reveal>

        <section className="relative bg-olive text-white overflow-hidden">
          <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-20 md:py-24 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="font-display text-4xl md:text-5xl font-light leading-[1.08] mb-3">{t('program.getInvolved')}</h2>
              <p className="text-white/80 leading-relaxed">{t('program.getInvolvedDesc')}</p>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/register" data-cursor="link" className="border border-white/85 px-8 py-3.5 font-display text-lg hover:bg-white hover:text-olive transition inline-flex items-center gap-2">
                {t('hero.ctaRegister')} <span aria-hidden="true">↗</span>
              </Link>
              <Link to="/programs" data-cursor="link" className="text-xs font-semibold tracking-[0.16em] uppercase border-b border-white/50 pb-1.5 hover:border-white transition">
                {t('program.allPrograms')}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </EditorialShell>
  );
};
