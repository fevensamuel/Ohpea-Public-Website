import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, useTranslation } from '../../i18n/LanguageContext.js';
import { OdaaMark } from './OdaaMark.js';
import { ORG_NAME, ORG_SHORT } from './content.js';

const NAV = [
  { to: '/about', key: 'nav.about', fb: 'About' },
  { to: '/programs', key: 'nav.programs', fb: 'Programs' },
  { to: '/membership', key: 'nav.membership', fb: 'Membership' },
  { to: '/updates', key: 'nav.updates', fb: 'Updates' },
  { to: '/contact', key: 'nav.contact', fb: 'Contact' },
];

const DRAWER = [
  { n: '01.', label: 'The Association', to: '/about' },
  { n: '02.', label: 'Our North Star', to: '/about#mission-vision' },
  { n: '03.', label: 'Seven Focus Areas', to: '/programs' },
  { n: '04.', label: 'Ideas into Action', to: '/#stories' },
  { n: '05.', label: 'Membership', to: '/membership' },
  { n: '06.', label: 'Updates', to: '/updates' },
  { n: '07.', label: 'Contact', to: '/contact' },
];

export function HomeHeader() {
  const { t } = useTranslation();
  const { language, setLanguage, languages, currentOption } = useLanguage();

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    window.setTimeout(() => menuBtn.current?.focus(), 0);
  }, []);

  // drawer: lock scroll, move focus in, Esc to close, Tab trap
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusT = window.setTimeout(() => closeBtn.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeDrawer(); return; }
      if (e.key === 'Tab' && drawerRef.current) {
        const f = Array.from(drawerRef.current.querySelectorAll<HTMLElement>('a[href], button'));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(focusT);
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen, closeDrawer]);

  // language menu: outside click + Esc
  useEffect(() => {
    if (!langOpen) return;
    const onDown = (e: MouseEvent) => { if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLangOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [langOpen]);

  const orderedLangs = [languages.en, languages.om, languages.am, languages.ar, languages.fr];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-olive-deeper/90 backdrop-blur-md border-b border-white/10' : ''}`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between text-white">
          <Link to="/" className="flex items-center gap-3.5 group" data-cursor="link" aria-label={`${ORG_SHORT} — ${ORG_NAME}`}>
            <OdaaMark className="w-11 h-11 text-white shrink-0 transition-transform duration-500 group-hover:scale-105" />
            <div className="leading-tight">
              <span className="block text-sm font-semibold tracking-[0.22em] uppercase">{ORG_SHORT}</span>
              <span className="hidden md:block max-w-[210px] text-[9px] leading-[1.35] tracking-[0.16em] uppercase text-white/75">{ORG_NAME}</span>
              <span className="block md:hidden text-[10px] tracking-[0.2em] uppercase text-white/75">Oromia</span>
            </div>
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-10 text-[11px] font-semibold tracking-[0.18em] uppercase">
            {NAV.map((i) => (
              <Link key={i.to} to={i.to} data-cursor="link" className="hover:text-white/75 transition">{t(i.key, i.fb)}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <div className="relative" ref={langRef}>
              <button
                type="button" data-cursor="link" aria-haspopup="listbox" aria-expanded={langOpen}
                aria-label="Change language" onClick={() => setLangOpen((v) => !v)}
                className="text-[11px] font-semibold tracking-[0.18em] uppercase hover:opacity-75 transition"
              >
                {currentOption.code.toUpperCase()} ▾
              </button>
              {langOpen && (
                <ul role="listbox" aria-label="Language"
                  className="absolute right-0 top-full mt-4 w-56 bg-olive-deeper text-white border border-white/15 py-2 shadow-2xl">
                  {orderedLangs.map((opt) => (
                    <li key={opt.code} role="presentation">
                      <button
                        type="button" role="option" aria-selected={language === opt.code} data-cursor="link"
                        onClick={() => { setLanguage(opt.code); setLangOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs tracking-wide hover:bg-white/10 transition ${opt.fontClass} ${language === opt.code ? 'text-white font-semibold' : 'text-white/75'}`}
                      >
                        <span>{opt.nativeLabel}</span>
                        <span className="text-[10px] tracking-[0.18em] text-white/50">{opt.code.toUpperCase()}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              ref={menuBtn} type="button" data-cursor="link" aria-label="Open navigation menu"
              aria-haspopup="dialog" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}
              className="w-10 h-10 border border-white/80 flex flex-col items-center justify-center gap-1.5 hover:bg-white hover:text-olive transition-colors"
            >
              <span className="w-4 h-[1.5px] bg-current" />
              <span className="w-4 h-[1.5px] bg-current" />
              <span className="w-4 h-[1.5px] bg-current" />
            </button>
          </div>
        </div>
      </header>

      {/* FULLSCREEN MENU DRAWER */}
      <div
        ref={drawerRef} role="dialog" aria-modal="true" aria-label="Site navigation"
        aria-hidden={!drawerOpen} inert={!drawerOpen}
        className={`fixed inset-0 z-50 bg-olive-deeper text-white transition-opacity duration-300 flex flex-col justify-between px-8 md:px-16 py-8 overflow-y-auto ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-[0.22em] uppercase text-white/70">{ORG_SHORT} Navigation</span>
          <button ref={closeBtn} type="button" onClick={closeDrawer} aria-label="Close navigation menu" data-cursor="link"
            className="w-10 h-10 border border-white/70 flex items-center justify-center text-lg hover:bg-white hover:text-olive-deeper transition">✕</button>
        </div>

        <div className="grid md:grid-cols-2 gap-12 my-auto py-10 max-w-5xl">
          <ul className="space-y-4 font-display text-4xl md:text-5xl font-light">
            {DRAWER.map((d) => (
              <li key={d.n}>
                <Link to={d.to} onClick={() => setDrawerOpen(false)} data-cursor="link"
                  className="hover:italic hover:pl-3 transition-all block">{d.n} {d.label}</Link>
              </li>
            ))}
          </ul>

          <div className="border-l border-white/15 pl-8 flex flex-col justify-end space-y-6 text-sm text-white/75">
            <p className="uppercase tracking-[0.18em] text-[11px] text-white/50">Rooted in Oromia</p>
            <p className="leading-relaxed max-w-sm">
              {ORG_NAME} brings people, ideas and expertise into one shared conversation.
            </p>
            <div>
              <Link to="/register" onClick={() => setDrawerOpen(false)} data-cursor="link"
                className="inline-block border border-white/60 px-6 py-3 font-display text-base text-white hover:bg-white hover:text-olive-deeper transition">
                {t('common.becomeMember', 'Become a member')}
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-3 text-[11px] tracking-[0.18em] uppercase text-white/50 border-t border-white/15 pt-6">
          <span>Rooted in Oromia. Connected to possibility.</span>
          <span>Hospitality · Tourism · Opportunity</span>
        </div>
      </div>
    </>
  );
}
