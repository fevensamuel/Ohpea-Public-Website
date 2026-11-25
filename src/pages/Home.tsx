/**
 * OPHEA homepage — editorial redesign.
 *
 * Presentation is new; every data source is the existing one:
 *   GET /public/stats          → useStats()          (count-up ribbon)
 *   GET /public/programs       → api.getPrograms()   (focus-area links → /programs/:slug)
 *   GET /public/announcements  → api.getAnnouncements() (latest items, featured event)
 *   GET /public/partners       → api.getPartners()
 *   GET /public/activities     → api.getActivities()
 *   GET /public/site-settings  → useSiteSettings()   (footer contact + social)
 *   POST /public/newsletter    → api.subscribeNewsletter() (footer form)
 * Static editorial copy and photography live in components/home/content.ts.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage, useTranslation } from '../i18n/LanguageContext.js';
import { useStats } from '../hooks/useStats.js';
import { fallbackAnnouncements, fallbackPartners, fallbackActivities } from '../data/fallbackContent.js';
import { api } from '../lib/ophea-api-client.js';
import type { Program } from '../lib/ophea-api-client.js';
import { localize } from '../utils/localize.js';
import { EditorialShell } from '../components/home/EditorialShell.js';
import { Lightbox } from '../components/home/Lightbox.js';
import { EditorialCountdown } from '../components/home/EditorialCountdown.js';
import { OdaaMark } from '../components/home/OdaaMark.js';
import { Reveal } from '../components/home/Reveal.js';
import { SLOT, photo } from '../components/home/images.js';
import {
  GALLERY_BASE, IMG, MEMBER_BULLETS, MEMBER_PHOTOS, ORG_NAME, ORG_SHORT, PILLARS, PREVIEW_POOL, STORIES,
  scrollToSection,
} from '../components/home/content.js';

const str = (v: unknown): string => (typeof v === 'string' ? v : '');

interface Story { label: string; title: string; desc: string; img: string; alt: string }

/* ---------- count-up number (animates to the live API value once visible) ---------- */
function CountUp({ value, active }: { value: number; active: boolean }) {
  const [display, setDisplay] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const start = from.current;
    if (reduce || start === value) { setDisplay(value); from.current = value; return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 1200);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = p < 1 ? Math.floor(start + (value - start) * eased) : value;
      from.current = v;
      setDisplay(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, active]);

  return <>{display.toLocaleString()}</>;
}

const EYEBROW = 'text-[11px] font-semibold tracking-[0.22em] uppercase text-ochre';
const TEXT_LINK = 'inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase border-b border-ink/40 pb-1.5 hover:border-ink transition';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { stats } = useStats();
  const location = useLocation();

  /* ---------------- live data (same calls + fallbacks as before) ---------------- */
  const [announcements, setAnnouncements] = useState<any[]>(fallbackAnnouncements);
  const [partners, setPartners] = useState<any[]>(fallbackPartners);
  const [activities, setActivities] = useState<any[]>(fallbackActivities);
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    let mounted = true;
    api.getPrograms().then((d) => { if (mounted && Array.isArray(d)) setPrograms(d); }).catch(() => {});
    api.getAnnouncements({ limit: 12 }).then((r) => { if (mounted && r?.data?.length) setAnnouncements(r.data); }).catch(() => {});
    api.getPartners().then((d) => { if (mounted && d?.length) setPartners(d); }).catch(() => {});
    api.getActivities().then((d) => { if (mounted && d?.length) setActivities(d); }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  /* ---------------- scroll: progress bar, hero zoom, floating inset ---------------- */
  const heroImgRef = useRef<HTMLImageElement>(null);
  const insetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      if (heroImgRef.current && !reduce && y < window.innerHeight) {
        heroImgRef.current.style.transform = `scale(${1 + (y / window.innerHeight) * 0.08})`;
      }
      const inset = insetRef.current;
      if (inset) {
        if (window.innerWidth >= 768 && !reduce) {
          const rect = inset.getBoundingClientRect();
          const offset = (window.innerHeight * 0.6 - rect.top) * 0.08;
          inset.style.transform = `translateY(${Math.max(-24, Math.min(24, offset))}px)`;
        } else {
          inset.style.transform = 'none';
        }
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  /* in-page hash links such as /#stories (from the menu and footer) */
  useEffect(() => {
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const timer = window.setTimeout(() => scrollToSection(id), 60);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  /* ---------------- stats count-up trigger ---------------- */
  const statsRef = useRef<HTMLElement>(null);
  const [statsActive, setStatsActive] = useState(false);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setStatsActive(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsActive(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const statItems = [
    { value: Number(stats.totalMembers) || 0, label: 'Total Members', cls: 'border-r border-b lg:border-b-0' },
    { value: Number(stats.accreditedHotels) || 0, label: 'Accredited Hotels', cls: 'lg:border-r border-b lg:border-b-0' },
    { value: Number(stats.certifiedGuides) || 0, label: 'Certified Guides', cls: 'border-r' },
    { value: Number(stats.trainingGraduates) || 0, label: 'Training Graduates', cls: '' },
  ];

  /* ---------------- focus-area hover preview ---------------- */
  const [pillar, setPillar] = useState(0);
  const [previewSrc, setPreviewSrc] = useState(PREVIEW_POOL[0]);
  const [previewDim, setPreviewDim] = useState(false);
  const previewTimer = useRef<number | undefined>(undefined);
  const activatePillar = (i: number) => {
    setPillar(i);
    const next = PREVIEW_POOL[PILLARS[i].slot % PREVIEW_POOL.length];
    if (next !== previewSrc) {
      setPreviewDim(true);
      window.clearTimeout(previewTimer.current);
      previewTimer.current = window.setTimeout(() => { setPreviewSrc(next); setPreviewDim(false); }, 110);
    }
  };

  /* ---------------- membership chapter rail ---------------- */
  const [chapter, setChapter] = useState(0);
  const [memberSrc, setMemberSrc] = useState(MEMBER_PHOTOS[0]);
  const [memberDim, setMemberDim] = useState(false);
  const memberTimer = useRef<number | undefined>(undefined);
  const goChapter = (i: number) => {
    const c = ((i % 3) + 3) % 3;
    setChapter(c);
    setMemberDim(true);
    window.clearTimeout(memberTimer.current);
    memberTimer.current = window.setTimeout(() => { setMemberSrc(MEMBER_PHOTOS[c]); setMemberDim(false); }, 150);
  };
  useEffect(() => () => { window.clearTimeout(previewTimer.current); window.clearTimeout(memberTimer.current); }, []);

  /* ---------------- "Ideas into action": editorial copy, overridden by live activities ---------------- */
  const stories: Story[] = useMemo(() => STORIES.map((s, i) => {
    const a = activities[i];
    const title = a ? localize(a.title, language) : '';
    if (!a || !title) return { ...s };
    const cat = localize(a.category, language);
    const photo = str(a.imageUrl) || (Array.isArray(a.photos) ? str(a.photos[0]) : '');
    return {
      label: `0${i + 1} / ${(cat || 'OPHEA initiative').toUpperCase()}`,
      title,
      desc: localize(a.summary ?? a.description, language),
      img: photo || s.img,
      alt: title,
    };
  }), [activities, language]);

  /* ---------------- lightbox ---------------- */
  const [lightbox, setLightbox] = useState<number | null>(null);
  const galleryItems = useMemo(() => GALLERY_BASE.map((g, i) => (i >= 2 && i <= 4 ? { ...g, src: stories[i - 2].img } : g)), [stories]);
  const viewProps = (i: number, label: string) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': `View photo: ${label}`,
    onClick: () => setLightbox(i),
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightbox(i); } },
  });

  /* ---------------- updates ---------------- */
  const latestOf = (types: string[]) => announcements.find((a) => types.includes(a.type));
  const updateRows = [
    { label: 'VACANCIES', title: 'Careers worth exploring', to: '/updates?type=vacancy', latest: latestOf(['vacancy']) },
    { label: 'CALLS FOR PROPOSALS', title: 'Partnerships with purpose', to: '/updates?type=call_for_proposal', latest: latestOf(['proposal', 'call_for_proposal']) },
    { label: 'ANNOUNCEMENTS', title: 'News from our community', to: '/updates?type=news', latest: latestOf(['news']) },
  ];

  const isUpcoming = (a: any) => !!a.eventStartAt && new Date(a.eventStartAt).getTime() > Date.now();
  const featuredEvent =
    announcements.find((a) => a.type === 'event' && a.featured && isUpcoming(a)) ||
    announcements.find((a) => a.type === 'event' && isUpcoming(a));

  const becomeMember = t('common.becomeMember', 'Become a member');

  return (
    <EditorialShell>
      <main id="main">
        {/* ============ 1. HERO ============ */}
        <section id="hero" className="relative min-h-svh w-full overflow-hidden flex flex-col justify-end text-white bg-olive-deeper ohp-grain">
          <img
            ref={heroImgRef} src={IMG.bale} alt="Bale Mountains in Oromia" fetchPriority="high" decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-150 ease-out will-change-transform"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/20 to-black/80" />
          <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/20 to-transparent" />

          <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 md:px-14 pb-14 md:pb-16 pt-36">
            <div className="inline-block border border-white/65 px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.24em] uppercase mb-7">
              PEOPLE. PLACE. POSSIBILITY.
            </div>

            <div className="flex items-end gap-5 max-w-4xl">
              <svg className="w-12 h-14 text-white/90 shrink-0 mb-2 hidden sm:block" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 44L20 24L31 35L45 16L58 32" opacity="0.5" />
                <path d="M12 28C10 19 20 12 32 12C44 12 54 19 52 28C43 31 21 31 12 28Z" fill="currentColor" fillOpacity="0.16" />
                <path d="M32 54V29M32 40L21 29M32 38L43 29" />
                <path d="M18 54H46" opacity="0.6" />
              </svg>
              <h1 className="font-display text-4xl sm:text-6xl md:text-[72px] font-light leading-[1.03] tracking-tight">
                <span className="font-body font-semibold text-2xl sm:text-3xl md:text-[32px] block mb-2 tracking-tight">
                  Elevating Hospitality. Connecting Opportunities.
                </span>
                <em className="italic font-normal text-[#EAE2D0]">Discovering Oromia.</em>
              </h1>
            </div>

            <p className="mt-6 text-base md:text-lg text-white/85 max-w-xl leading-relaxed">
              We bring people, places and possibilities together to build a more connected, capable and vibrant Oromia.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-7">
              <Link to="/programs" data-cursor="link" className="border border-white/85 px-7 py-3.5 font-display text-lg hover:bg-white hover:text-olive-deeper transition inline-flex items-center gap-2.5">
                Discover the work <span aria-hidden="true">↗</span>
              </Link>
              <Link to="/about" data-cursor="link" className="text-xs font-semibold tracking-[0.16em] uppercase border-b border-white/50 pb-1 hover:border-white transition inline-flex items-center gap-2">
                Explore who we are <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-14 pt-5 border-t border-white/20 flex flex-wrap justify-between gap-3 text-[11px] tracking-[0.18em] uppercase text-white/70">
              <span>Rooted in Oromia. Connected to possibility.</span>
              <span>Hospitality · Tourism · Opportunity</span>
            </div>
          </div>

          <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="relative z-10 flex flex-col items-center gap-2.5 pb-3 group" aria-label="Scroll to explore">
            <span className="text-[9px] font-semibold tracking-[0.26em] uppercase text-white/80">SCROLL TO EXPLORE</span>
            <span className="w-[1px] h-8 bg-white/65 group-hover:h-11 transition-all" />
          </a>
        </section>

        {/* ============ 2. THE ASSOCIATION ============ */}
        <Reveal as="section" id="about" className="max-w-[1320px] mx-auto px-6 md:px-12 py-24 md:py-32 grid lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          <div className="lg:col-span-6 relative md:pb-16 md:pr-14">
            <div className="overflow-hidden cursor-pointer" data-cursor="view" {...viewProps(0, 'A chef plating a dish in a professional kitchen')}>
              <img src={IMG.hospitalityNature} alt="A chef plating a dish in a professional kitchen" loading="lazy" decoding="async"
                className="w-full h-[420px] md:h-[540px] object-cover hover:scale-[1.03] transition-transform duration-700" />
            </div>
            <div ref={insetRef} data-cursor="view" {...viewProps(1, 'Ethiopian coffee ceremony')}
              className="mt-5 md:mt-0 md:absolute md:right-0 md:bottom-0 w-full md:w-[55%] border-0 md:border-[12px] md:border-cream bg-cream transition-transform duration-150 ease-out cursor-pointer overflow-hidden">
              <img src={IMG.coffeeAddis} alt="Ethiopian coffee ceremony" loading="lazy" decoding="async"
                className="w-full h-[250px] md:h-[290px] object-cover hover:scale-[1.04] transition-transform duration-700" />
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className={`${EYEBROW} mb-4`}>THE ASSOCIATION</p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.08] mb-7">Rooted in Oromia.<br />United by possibility.</h2>
            <p className="text-ink/75 leading-relaxed mb-5">{ORG_NAME} brings people, ideas and expertise into one shared conversation.</p>
            <p className="text-ink/75 leading-relaxed mb-7">
              From the highlands of Bale to the warmth of a coffee ceremony, Oromia has a story worth sharing. {ORG_SHORT} is a place for professionals helping shape its next chapter.
            </p>
            <blockquote className="font-display italic text-2xl md:text-[26px] leading-snug text-olive border-l-2 border-ochre pl-5 mb-8">
              Local knowledge.<br />Shared ambition. Lasting connection.
            </blockquote>
            <Link to="/about" data-cursor="link" className={TEXT_LINK}>Get to know {ORG_SHORT} <span aria-hidden="true">↗</span></Link>
          </div>
        </Reveal>

        {/* ============ 3. STATS RIBBON (live from /public/stats) ============ */}
        <section id="stats-section" ref={statsRef} className="bg-ochre text-white" aria-label="Association at a glance">
          <div className="max-w-[1320px] mx-auto grid grid-cols-2 lg:grid-cols-4">
            {statItems.map((s) => (
              <div key={s.label} className={`px-7 py-11 border-white/20 flex flex-col gap-2 ${s.cls}`}>
                <span className="w-7 h-[1px] bg-white/60 mb-2" aria-hidden="true" />
                <strong className="font-display text-4xl md:text-5xl font-normal"><CountUp value={s.value} active={statsActive} /></strong>
                <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/85">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ============ 4. OUR NORTH STAR ============ */}
        <Reveal as="section" id="purpose" className="relative bg-olive text-white py-24 md:py-32 overflow-hidden">
          <OdaaMark variant="watermark" className="absolute -right-12 top-1/2 -translate-y-1/2 w-[500px] h-[460px] text-white/[0.06] pointer-events-none select-none" />
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-14 items-start">
            <div className="lg:col-span-5">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/75 mb-4">OUR NORTH STAR</p>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mb-8">A shared purpose.<br />A greater horizon.</h2>
              <Link to="/about#mission-vision" data-cursor="link" className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase border-b border-white/50 pb-1.5 hover:border-white transition">
                Read about our vision <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/70 mb-3">AT OUR HEART</p>
              <h3 className="font-display text-2xl md:text-[32px] font-light leading-snug text-white/95">
                To connect and strengthen Oromia’s tourism and hospitality community through knowledge, collaboration and opportunity.
              </h3>
              <div className="h-[1px] bg-white/20 my-10" />
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/70 mb-3">OUR APPROACH</p>
              <h3 className="font-display text-2xl md:text-[32px] font-light leading-snug text-white/95">
                A thriving, responsible tourism and hospitality sector that reflects the richness of Oromia.
              </h3>
            </div>
          </div>
        </Reveal>

        {/* ============ 5. SEVEN WAYS FORWARD ============ */}
        <Reveal as="section" id="programs" className="max-w-[1320px] mx-auto px-6 md:px-12 py-24 md:py-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div>
              <p className={`${EYEBROW} mb-3`}>WHAT MOVES US FORWARD</p>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.08]">Seven ways forward.<br />One shared ambition.</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink/70">From building skills to opening doors, discover the areas where our community can make a difference.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 border-t border-ink/15">
              {PILLARS.map((p, i) => {
                const slug = programs[p.programIndex]?.slug;
                return (
                  <Link
                    key={p.n} to={slug ? `/programs/${slug}` : '/programs'} data-cursor="link"
                    onMouseEnter={() => activatePillar(i)} onFocus={() => activatePillar(i)}
                    className="group flex items-center justify-between gap-6 py-6 px-3 border-b border-ink/15 hover:bg-sand focus-visible:bg-sand transition"
                  >
                    <div className="flex items-baseline gap-6">
                      <span className="font-display text-2xl text-ochre">{p.n}</span>
                      <div>
                        <h3 className="font-display text-2xl md:text-3xl group-hover:italic transition-all">{p.title}</h3>
                        <p className="text-sm text-ink/65">{p.desc}</p>
                      </div>
                    </div>
                    <span className="text-ochre group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true">↗</span>
                  </Link>
                );
              })}
            </div>

            <div className="hidden lg:block lg:col-span-4 sticky top-28" aria-hidden="true">
              <div className="border border-ink/15 p-3 bg-sand relative">
                <img src={previewSrc} alt="" decoding="async"
                  className={`w-full h-[420px] object-cover transition-opacity duration-300 ${previewDim ? 'opacity-45' : 'opacity-100'}`} />
                <div className="pt-4 pb-1 px-1">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ochre">{PILLARS[pillar].n} / {PILLARS[pillar].title}</p>
                  <p className="font-display italic text-lg text-ink/85 mt-1">{PILLARS[pillar].desc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Link to="/programs" data-cursor="link" className={TEXT_LINK}>Explore our focus areas <span aria-hidden="true">→</span></Link>
          </div>
        </Reveal>

        {/* ============ 6. IDEAS INTO ACTION ============ */}
        <Reveal as="section" id="stories" className="bg-sand py-24 md:py-32">
          <div className="max-w-[1320px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div>
                <p className={`${EYEBROW} mb-3`}>BETTER WORK. NEW HORIZONS.</p>
                <h2 className="font-display text-4xl md:text-5xl leading-[1.08]">Ideas into action.<br />People at the heart.</h2>
              </div>
              <Link to="/updates" data-cursor="link" className={TEXT_LINK}>Explore our activities <span aria-hidden="true">↗</span></Link>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="md:col-span-2 group cursor-pointer" data-cursor="view" {...viewProps(2, stories[0].title)}>
                <div className="overflow-hidden mb-5">
                  <img src={stories[0].img} alt={stories[0].alt} loading="lazy" decoding="async"
                    className="w-full h-[360px] md:h-[500px] object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                </div>
                <p className={`${EYEBROW} mb-2`}>{stories[0].label}</p>
                <h3 className="font-display text-3xl md:text-4xl mb-2">{stories[0].title}</h3>
                {stories[0].desc && <p className="text-sm text-ink/70 max-w-xl">{stories[0].desc}</p>}
              </div>

              {[1, 2].map((k) => (
                <div key={k} className="group cursor-pointer" data-cursor="view" {...viewProps(k + 2, stories[k].title)}>
                  <div className="overflow-hidden mb-5">
                    <img src={stories[k].img} alt={stories[k].alt} loading="lazy" decoding="async"
                      className="w-full h-[340px] object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                  </div>
                  <p className={`${EYEBROW} mb-2`}>{stories[k].label}</p>
                  <h3 className="font-display text-3xl mb-2">{stories[k].title}</h3>
                  {stories[k].desc && <p className="text-sm text-ink/70">{stories[k].desc}</p>}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ============ 7. 50/50 SPLIT — MEMBERSHIP ============ */}
        <section id="membership" className="grid lg:grid-cols-2 min-h-[92vh]">
          <div className="relative min-h-[460px] overflow-hidden cursor-pointer" data-cursor="view" {...viewProps(5, 'A guide driving a safari vehicle along a bush track')}>
            <img src={IMG.trail} alt="A guide driving a safari vehicle along a bush track" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
          </div>

          <div className="relative bg-olive text-white flex flex-col items-center justify-center px-8 md:px-16 py-20 overflow-hidden text-center">
            <OdaaMark variant="watermark" className="absolute w-[480px] h-[440px] text-white/[0.065] pointer-events-none select-none" />

            <div className="relative z-10 max-w-md flex flex-col items-center">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/80 mb-2">YOUR COMMUNITY. YOUR FUTURE.</p>
              <h2 className="font-display text-4xl md:text-5xl font-normal leading-tight mb-7">Your people.<br />Your next chapter.</h2>

              <div className="w-56 sm:w-64 h-72 mb-8 overflow-hidden ohp-float border border-white/15 cursor-pointer" data-cursor="view" {...viewProps(4, 'Oromia heritage')}>
                <img src={memberSrc} alt="Oromia heritage portrait" loading="lazy" decoding="async"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${memberDim ? 'opacity-35' : 'opacity-100'}`} />
              </div>

              <p className="text-sm leading-relaxed text-white/85 mb-6">Join a growing network of professionals shaping the future of tourism and hospitality in Oromia.</p>

              <ul className="w-full text-left text-xs tracking-wide border-t border-white/20 mb-8">
                {MEMBER_BULLETS.map((b, i) => (
                  <li key={b} className="border-b border-white/20">
                    <button type="button" data-cursor="link" onClick={() => goChapter(i)} aria-current={i === chapter}
                      className={`w-full text-left cursor-pointer py-2.5 transition ${i === chapter ? 'text-white font-semibold' : 'text-white/60 hover:text-white'}`}>
                      {b}
                    </button>
                  </li>
                ))}
              </ul>

              <Link to="/register" data-cursor="link" className="border border-white/80 px-8 py-3.5 font-display text-lg hover:bg-white hover:text-olive transition inline-flex items-center gap-2">
                {becomeMember} <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="absolute right-4 md:right-7 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20">
              <button type="button" data-cursor="link" aria-label="Previous highlight" onClick={() => goChapter(chapter - 1)} className="text-white/75 hover:text-white text-sm p-1 transition">↑</button>
              <div className="w-[2px] h-28 bg-white/25 relative overflow-hidden" aria-hidden="true">
                <div className="w-full h-1/3 bg-white absolute top-0 transition-all duration-300" style={{ top: `${chapter * 33.33}%` }} />
              </div>
              <button type="button" data-cursor="link" aria-label="Next highlight" onClick={() => goChapter(chapter + 1)} className="text-white/75 hover:text-white text-sm p-1 transition">↓</button>
            </div>
          </div>
        </section>

        {/* ============ 8. UPDATES ============ */}
        <Reveal as="section" id="updates" className="max-w-[1320px] mx-auto px-6 md:px-12 py-24 md:py-32 grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5">
            <p className={`${EYEBROW} mb-3`}>THE LATEST FROM {ORG_SHORT}</p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.08] mb-5">What’s next<br />starts here.</h2>
            <p className="text-sm leading-relaxed text-ink/70 mb-7 max-w-sm">Vacancies, calls for proposals and updates from across our community.</p>
            <Link to="/updates" data-cursor="link" className={TEXT_LINK}>All opportunities &amp; updates <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="lg:col-span-7 border-t border-ink/15">
            {updateRows.map((r) => (
              <Link key={r.label} to={r.to} data-cursor="link" className="group flex items-center justify-between py-7 px-3 border-b border-ink/15 hover:bg-sand focus-visible:bg-sand transition">
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ochre">{r.label}</span>
                  <h3 className="font-display text-3xl mt-1 group-hover:pl-2 transition-all">{r.title}</h3>
                  {r.latest && <p className="mt-1.5 text-sm text-ink/65 truncate">Latest: {localize(r.latest.title, language)}</p>}
                </div>
                <span className="text-ochre group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shrink-0 pl-4" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* ============ 8b. FEATURED EVENT (only when the API returns an upcoming event) ============ */}
        {featuredEvent && (
          <Reveal as="section" aria-label="Featured event" className="bg-olive-deeper text-white py-20 md:py-24">
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/70 mb-4">MARK YOUR CALENDAR</p>
                <h2 className="font-display text-4xl md:text-5xl leading-[1.08] mb-5">{localize(featuredEvent.title, language)}</h2>
                {localize(featuredEvent.summary, language) && (
                  <p className="text-white/80 leading-relaxed max-w-xl mb-6">{localize(featuredEvent.summary, language)}</p>
                )}
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/65 flex flex-wrap gap-x-6 gap-y-2">
                  <span>{new Date(featuredEvent.eventStartAt).toLocaleDateString()}</span>
                  {localize(featuredEvent.location, language) && <span>{localize(featuredEvent.location, language)}</span>}
                </p>
              </div>
              <div className="lg:col-span-5">
                <EditorialCountdown target={featuredEvent.eventStartAt} />
                <Link to={`/updates/${featuredEvent.slug}`} data-cursor="link" className="mt-6 inline-flex border border-white/80 px-7 py-3 font-display text-lg hover:bg-white hover:text-olive-deeper transition items-center gap-2">
                  {t('common.readMore', 'Read more')} <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </Reveal>
        )}

        {/* ============ 9. PARTNERS (live from /public/partners) ============ */}
        <Reveal as="section" className="bg-sand py-20 border-t border-ink/10">
          <div className="max-w-[1320px] mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <p className={`${EYEBROW} mb-3`}>BUILT TOGETHER</p>
              <h2 className="font-display text-4xl leading-tight">A stronger sector,<br />together.</h2>
            </div>
            {partners.length > 0 && (
              <ul className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {partners.map((p) => {
                  const name = localize(p.name, language);
                  const site = str(p.website);
                  const inner = (
                    <>
                      {p.logoUrl && <img src={p.logoUrl} alt="" loading="lazy" className="h-10 w-auto max-w-full object-contain mx-auto mb-3 grayscale group-hover:grayscale-0 transition" />}
                      <span>{name}</span>
                    </>
                  );
                  const cls = 'group block h-full border border-ink/15 bg-cream/60 py-6 px-3 text-center text-[11px] font-semibold tracking-[0.12em] uppercase text-ink/60 hover:border-ochre transition';
                  return (
                    <li key={p.id}>
                      {/^https?:\/\//i.test(site)
                        ? <a href={site} target="_blank" rel="noopener noreferrer" data-cursor="link" className={cls}>{inner}</a>
                        : <div className={cls}>{inner}</div>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Reveal>

        {/* ============ 10. CLOSING CTA ============ */}
        <section id="cta" className="relative min-h-[68vh] flex items-center justify-center text-center text-white overflow-hidden bg-olive-deeper">
          <img src={photo(SLOT.homeClosingCta)} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-olive-deeper/75" />
          <Reveal className="relative z-10 max-w-2xl px-6 py-24">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/80 mb-4">A COMMUNITY WITH ROOM TO GROW</p>
            <h2 className="font-display text-4xl sm:text-6xl font-light leading-[1.06] mb-9">Oromia’s next chapter<br />starts with us.</h2>
            <Link to="/register" data-cursor="link" className="border border-white/85 px-8 py-3.5 font-display text-lg hover:bg-white hover:text-olive-deeper transition inline-flex items-center gap-2">
              {becomeMember} <span aria-hidden="true">↗</span>
            </Link>
            <p className="mt-7 text-sm text-white/80">Bring your experience. Find your people. Shape what comes next.</p>
          </Reveal>
        </section>
      </main>

      <Lightbox items={galleryItems} openIndex={lightbox} onClose={() => setLightbox(null)} />
    </EditorialShell>
  );
};
