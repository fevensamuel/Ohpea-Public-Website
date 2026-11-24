import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 flex items-center justify-center font-extrabold text-3xl mb-6 shadow-sm">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white mb-3">
        {t('notFound.title')}
      </h1>
      <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto mb-8 leading-relaxed">
        {t('notFound.desc')}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-md transition"
        >
          <Home className="w-4 h-4" />
          <span>{t('notFound.returnHome')}</span>
        </Link>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:bg-stone-50 dark:hover:bg-stone-800 transition"
        >
          <span>{t('notFound.aboutOphea')}</span>
        </Link>
      </div>
    </div>
  );
};
