/**
 * About — editorial redesign.
 *
 * Presentation is new; behaviour and data are exactly the original page's:
 *   GET /public/objectives   → api.getObjectives()  (general / 8 official / specific)
 *   GET /public/partners     → api.getPartners()
 *   GET /public/site-settings→ useSiteSettings()    (mission, vision)
 * Specific objectives fall back to the built-in translations when the API has none,
 * mission/vision fall back to brandTagline / hero.subtitle, and the
 * #who-we-are / #mission-vision / #objectives / #partners anchors still work.
 */
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/LanguageContext.js';
import { useSiteSettings } from '../hooks/useSiteSettings.js';
import { api, Objective, Partner, LocalizedText } from '../lib/ophea-api-client.js';
import { EditorialShell } from '../components/home/EditorialShell.js';
import { OdaaMark } from '../components/home/OdaaMark.js';
import { Reveal } from '../components/home/Reveal.js';
import { SLOT, photo } from '../components/home/images.js';
import { ORG_NAME, brandText, scrollToSection } from '../components/home/content.js';

function localized(v: LocalizedText | undefined, lang: string): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  return (v[lang] as string | undefined) || (v.en as string | undefined) || (Object.values(v).find((x) => typeof x === 'string') as string | undefined) || '';
}

const EYEBROW = 'text-[11px] font-semibold tracking-[0.22em] uppercase text-ochre';

export const About: React.FC = () => {
  const { t, language } = useTranslation();
  const location = useLocation();
  const { settings } = useSiteSettings();

  const missionText = brandText(localized(settings?.mission, language) || t('brandTagline'));
  const visionText = brandText(localized(settings?.vision, language) || t('hero.subtitle'));

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  // in-page anchors: /about#mission-vision etc.
  useEffect(() => {
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const timer = window.setTimeout(() => scrollToSection(id), 60);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.getObjectives().catch(() => []),
      api.getPartners().catch(() => []),
    ]).then(([objectivesRes, partnersRes]) => {
      if (!mounted) return;
      setObjectives(Array.isArray(objectivesRes) ? objectivesRes : []);
      setPartners(Array.isArray(partnersRes) ? partnersRes : []);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const officialObjectives = objectives.filter((o) => o.kind === 'official');
  const generalObjective = objectives.find((o) => o.kind === 'general');

  const adminSpecific = objectives.filter((o) => o.kind === 'specific');
  const specificObjectives =
    adminSpecific.length > 0
      ? adminSpecific.map((o) => ({ title: localized(o.title, language), desc: localized(o.description, language) }))
      : Array.from({ length: 13 }, (_, i) => ({
          title: t(`about.objSpecific${i + 1}Title` as any),
          desc: t(`about.objSpecific${i + 1}Desc` as any),
        }));

  const stripNumber = (s: string) => s.replace(/^\s*\d+\s*[.)-]\s*/, '');

  return (
    <EditorialShell>
      <main id="main">
        {/* ============ HERO ============ */}
        <section className="relative min-h-[68svh] w-full overflow-hidden flex flex-col justify-end text-white bg-olive-deeper ohp-grain">
          <img src={photo(SLOT.aboutHero)} alt="" fetchPriority="high" decoding="async" className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/25 to-black/80" />
          <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/15 to-transparent" />

          <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 md:px-14 pb-14 md:pb-16 pt-40">
            <nav aria-label="Breadcrumb" className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70 mb-7">
              <Link to="/" data-cursor="link" className="hover:text-white transition">{t('nav.home', 'Home')}</Link>
              <span className="mx-3" aria-hidden="true">/</span>
              <span aria-current="page" className="text-white">{t('nav.about', 'About')}</span>
            </nav>
            <h1 className="font-display text-5xl sm:text-7xl md:text-[96px] font-light leading-[0.98] tracking-tight max-w-4xl">
              {t('about.title', 'About OPHEA')}
            </h1>
            <p className="mt-6 font-display italic text-2xl md:text-3xl text-[#EAE2D0] max-w-2xl leading-snug">
              {t('brandTagline')}
            </p>
            <p className="mt-8 text-[11px] tracking-[0.2em] uppercase text-white/65 border-t border-white/20 pt-5 max-w-3xl">{ORG_NAME}</p>
          </div>
        </section>

        {/* ============ WHO WE ARE ============ */}
        <Reveal as="section" id="who-we-are" className="max-w-[1320px] mx-auto px-6 md:px-12 py-24 md:py-32 grid lg:grid-cols-12 gap-14 lg:gap-20 items-center scroll-mt-24">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <p className={`${EYEBROW} mb-4`}>{t('about.whoWeAre')}</p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.08] mb-8">{brandText(t('about.whoWeAreTitle'))}</h2>
            <p className="text-ink/75 leading-relaxed mb-5">{brandText(t('about.whoWeAreP1'))}</p>
            <p className="text-ink/75 leading-relaxed mb-9">{brandText(t('about.whoWeAreP2'))}</p>
            <Link to="/register" data-cursor="link" className="border border-ink/70 px-7 py-3.5 font-display text-lg hover:bg-ink hover:text-white transition inline-flex items-center gap-2">
              {t('hero.ctaRegister', 'Become a Member')} <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 relative md:pb-16 md:pl-14">
            <div className="overflow-hidden">
              <img src={photo(SLOT.aboutWho)} alt="A chef plating a dish in a professional kitchen" loading="lazy" decoding="async"
                className="w-full h-[420px] md:h-[560px] object-cover hover:scale-[1.03] transition-transform duration-700" />
            </div>
            <div className="mt-5 md:mt-0 md:absolute md:left-0 md:bottom-0 w-full md:w-[48%] border-0 md:border-[12px] md:border-cream bg-cream overflow-hidden">
              <img src={photo(SLOT.aboutInset)} alt="A guide driving a safari vehicle along a bush track" loading="lazy" decoding="async"
                className="w-full h-[240px] md:h-[270px] object-cover hover:scale-[1.04] transition-transform duration-700" />
            </div>
          </div>
        </Reveal>

        {/* ============ MISSION & VISION ============ */}
        <Reveal as="section" id="mission-vision" className="relative bg-olive text-white py-24 md:py-32 overflow-hidden scroll-mt-24">
          <OdaaMark variant="watermark" className="absolute -right-40 top-1/2 -translate-y-1/2 w-[520px] h-[480px] text-white/[0.06] pointer-events-none select-none" />
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/70 mb-4">01</p>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mb-7">{t('about.mission')}</h2>
              <p className="font-display text-2xl md:text-[30px] font-light leading-snug text-white/95">{missionText}</p>
            </div>
            <div className="lg:border-l lg:border-white/20 lg:pl-20">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/70 mb-4">02</p>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mb-7">{t('about.vision')}</h2>
              <p className="font-display text-2xl md:text-[30px] font-light leading-snug text-white/95">{visionText}</p>
            </div>
          </div>
        </Reveal>

        {/* ============ OBJECTIVES ============ */}
        <section id="objectives" className="scroll-mt-24">
          {generalObjective && (
            <Reveal as="div" className="bg-sand py-20 md:py-28">
              <div className="max-w-[1100px] mx-auto px-6 md:px-12 text-center">
                <p className={`${EYEBROW} mb-6`}>{localized(generalObjective.title, language) || 'General Objective'}</p>
                <blockquote className="font-display italic text-3xl md:text-5xl leading-[1.18] text-olive">
                  &ldquo;{brandText(localized(generalObjective.description, language) || localized(generalObjective.title, language))}&rdquo;
                </blockquote>
              </div>
            </Reveal>
          )}

          {officialObjectives.length > 0 && (
            <Reveal as="div" className="max-w-[1320px] mx-auto px-6 md:px-12 py-24 md:py-32">
              <div className="grid lg:grid-cols-12 gap-10 mb-14">
                <div className="lg:col-span-7">
                  <p className={`${EYEBROW} mb-3`}>STATUTORY MANDATE</p>
                  <h2 className="font-display text-4xl md:text-5xl leading-[1.08]">{t('about.officialObjectives')}</h2>
                </div>
                <p className="lg:col-span-5 text-sm leading-relaxed text-ink/70 lg:pt-8">{t('about.officialObjectivesSubtitle')}</p>
              </div>
              <ol className="grid md:grid-cols-2 gap-x-16 border-t border-ink/15 md:border-t-0">
                {officialObjectives.map((obj, idx) => (
                  <li key={obj.id} className="flex gap-6 py-7 border-b border-ink/15 md:[&:nth-child(-n+2)]:border-t">
                    <span className="font-display text-2xl text-ochre shrink-0 w-9">{String(idx + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-display text-2xl leading-snug mb-1.5">{localized(obj.title, language)}</h3>
                      {obj.description && <p className="text-sm text-ink/65 leading-relaxed">{localized(obj.description, language)}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          )}

          <Reveal as="div" className={`${officialObjectives.length > 0 ? 'bg-sand' : ''} py-24 md:py-32`}>
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 lg:gap-20">
              <div className="lg:col-span-4">
                <p className={`${EYEBROW} mb-3`}>HOW WE DELIVER</p>
                <h2 className="font-display text-4xl md:text-5xl leading-[1.08] mb-5">{t('about.specificObjectives')}</h2>
                <p className="text-sm leading-relaxed text-ink/70 max-w-xs">{t('about.specificObjectivesSubtitle')}</p>
              </div>

              <ul className="lg:col-span-8 border-t border-ink/15">
                {specificObjectives.map((item, idx) => {
                  const open = expandedIndex === idx;
                  const panelId = `specific-objective-${idx}`;
                  return (
                    <li key={idx} className="border-b border-ink/15">
                      <button
                        type="button" data-cursor="link" aria-expanded={open} aria-controls={panelId}
                        onClick={() => setExpandedIndex(open ? null : idx)}
                        className="w-full flex items-center justify-between gap-6 py-5 px-2 text-left hover:bg-cream/70 focus-visible:bg-cream/70 transition cursor-pointer"
                      >
                        <span className="flex items-baseline gap-5">
                          <span className="font-display text-xl text-ochre w-8 shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                          <span className={`font-display text-xl md:text-2xl leading-snug ${open ? 'italic' : ''}`}>{stripNumber(item.title)}</span>
                        </span>
                        <span className="text-ochre text-xl shrink-0 w-5 text-center" aria-hidden="true">{open ? '−' : '+'}</span>
                      </button>
                      {open && (
                        <div id={panelId} role="region" className="pl-[3.25rem] pr-10 pb-6 -mt-1 text-sm text-ink/70 leading-relaxed">
                          {brandText(item.desc)}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* ============ PARTNERS ============ */}
        <Reveal as="section" id="partners" className="max-w-[1320px] mx-auto px-6 md:px-12 py-24 md:py-28 grid lg:grid-cols-12 gap-10 items-center scroll-mt-24">
          <div className="lg:col-span-5">
            <p className={`${EYEBROW} mb-3`}>BUILT TOGETHER</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">{t('home.partnersTitle', 'Our Partners')}</h2>
          </div>
          <div className="lg:col-span-7">
            {partners.length > 0 ? (
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {partners.map((p: any) => {
                  const name = localized(p.name, language);
                  const site = typeof p.website === 'string' ? p.website : '';
                  const inner = (
                    <>
                      {p.logoUrl && <img src={p.logoUrl} alt="" loading="lazy" className="h-10 w-auto max-w-full object-contain mx-auto mb-3 grayscale group-hover:grayscale-0 transition" />}
                      <span>{name}</span>
                    </>
                  );
                  const cls = 'group block h-full border border-ink/15 bg-sand/60 py-6 px-3 text-center text-[11px] font-semibold tracking-[0.12em] uppercase text-ink/60 hover:border-ochre transition';
                  return (
                    <li key={p.id}>
                      {/^https?:\/\//i.test(site)
                        ? <a href={site} target="_blank" rel="noopener noreferrer" data-cursor="link" className={cls}>{inner}</a>
                        : <div className={cls}>{inner}</div>}
                    </li>
                  );
                })}
              </ul>
            ) : !loading ? (
              <p className="text-sm text-ink/55">No partners available.</p>
            ) : null}
          </div>
        </Reveal>

        {loading && <p role="status" className="text-center pb-10 text-sm text-ink/45">Loading…</p>}

        {/* ============ CLOSING CTA ============ */}
        <section className="relative bg-olive-deeper text-white overflow-hidden">
          <OdaaMark variant="watermark" className="absolute -left-10 top-1/2 -translate-y-1/2 w-[420px] h-[390px] text-white/[0.05] pointer-events-none select-none" />
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-12 py-24 md:py-28 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <h2 className="font-display text-4xl md:text-6xl font-light leading-[1.06] max-w-2xl">
              Hospitality is built together.<br /><em className="italic">Build it with us.</em>
            </h2>
            <Link to="/register" data-cursor="link" className="self-start md:self-auto border border-white/85 px-8 py-3.5 font-display text-lg hover:bg-white hover:text-olive-deeper transition inline-flex items-center gap-2 shrink-0">
              {t('common.becomeMember', 'Become a member')} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </main>
    </EditorialShell>
  );
};
