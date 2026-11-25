import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext.js';
import { OdaaMark } from './OdaaMark.js';

export interface Crumb { label: string; to?: string }

interface Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  crumbs?: Crumb[];
  /** Photograph URL. Omit for a plain forest-green hero with the crest watermark. */
  image?: string;
  /** Tailwind object-position class, e.g. "object-[50%_30%]" */
  imageClass?: string;
  size?: 'lg' | 'md' | 'sm';
  children?: React.ReactNode;
}

const HEIGHT = { lg: 'min-h-[68svh]', md: 'min-h-[52svh]', sm: 'min-h-[40svh]' } as const;

/** Page opener shared by every redesigned inner page. */
export function EditorialPageHero({ title, subtitle, eyebrow, crumbs = [], image, imageClass = 'object-center', size = 'md', children }: Props) {
  const { t } = useTranslation();
  return (
    <section className={`relative ${HEIGHT[size]} w-full overflow-hidden flex flex-col justify-end text-white bg-olive-deeper ohp-grain`}>
      {image ? (
        <>
          <img src={image} alt="" fetchPriority="high" decoding="async" className={`absolute inset-0 w-full h-full object-cover ${imageClass}`} />
          <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/25 to-black/80" />
          <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/10 to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-linear-to-br from-olive-deeper via-olive-dark to-olive" />
          <OdaaMark variant="watermark" className="absolute -right-24 top-1/2 -translate-y-1/2 w-[560px] h-[510px] text-white/[0.06] pointer-events-none select-none" />
        </>
      )}

      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 md:px-14 pb-12 md:pb-16 pt-36">
        <nav aria-label="Breadcrumb" className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70 mb-7 flex flex-wrap items-center gap-y-1">
          <Link to="/" data-cursor="link" className="hover:text-white transition">{t('nav.home', 'Home')}</Link>
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              <span className="mx-3" aria-hidden="true">/</span>
              {c.to ? <Link to={c.to} data-cursor="link" className="hover:text-white transition">{c.label}</Link>
                : <span aria-current="page" className="text-white">{c.label}</span>}
            </React.Fragment>
          ))}
        </nav>
        {eyebrow && <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#EAE2D0] mb-4">{eyebrow}</p>}
        <h1 className="font-display text-5xl sm:text-6xl md:text-[84px] font-light leading-[1] tracking-tight max-w-5xl">{title}</h1>
        {subtitle && <p className="mt-6 font-display italic text-xl md:text-3xl text-[#EAE2D0] max-w-2xl leading-snug">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
