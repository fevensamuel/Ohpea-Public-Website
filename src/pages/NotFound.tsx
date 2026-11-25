import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/LanguageContext.js';
import { EditorialShell } from '../components/home/EditorialShell.js';
import { SLOT, photo } from '../components/home/images.js';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <EditorialShell>
      <main id="main" className="relative min-h-svh flex items-center justify-center text-center text-white bg-olive-deeper overflow-hidden ohp-grain">
        <img src={photo(SLOT.notFound)} alt="" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-olive-deeper/70" />
        <div className="relative z-10 max-w-2xl px-6 pt-32 pb-24">
          <p className="font-display font-light text-[28vw] sm:text-[200px] leading-none text-white/20 select-none" aria-hidden="true">404</p>
          <h1 className="font-display text-4xl sm:text-6xl font-light leading-[1.05] -mt-6 sm:-mt-14 mb-5">{t('notFound.title')}</h1>
          <p className="text-white/80 leading-relaxed max-w-md mx-auto mb-10">{t('notFound.desc')}</p>
          <div className="flex flex-wrap items-center justify-center gap-7">
            <Link to="/" data-cursor="link" className="border border-white/85 px-8 py-3.5 font-display text-lg hover:bg-white hover:text-olive-deeper transition inline-flex items-center gap-2">
              {t('notFound.returnHome')} <span aria-hidden="true">↗</span>
            </Link>
            <Link to="/about" data-cursor="link" className="text-xs font-semibold tracking-[0.16em] uppercase border-b border-white/50 pb-1.5 hover:border-white transition">
              {t('notFound.aboutOphea')}
            </Link>
          </div>
        </div>
      </main>
    </EditorialShell>
  );
};
