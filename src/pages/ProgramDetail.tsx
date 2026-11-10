import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Shield,
  Award,
  Handshake,
  TrendingUp,
  Users,
  Globe,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Layers,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { PageBanner } from '../components/PageBanner.js';
import { LockedBadge } from '../components/LockedBadge.js';
import { fallbackPrograms } from '../data/fallbackContent.js';

import { api } from '../lib/ohpea-api-client.js';

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Shield,
  Award,
  Handshake,
  TrendingUp,
  Users,
  Globe,
};

export const ProgramDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language, isRtl } = useTranslation();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [program, setProgram] = React.useState<any>(() =>
    fallbackPrograms.find((p) => p.slug === slug || p.id === slug) || null
  );

  React.useEffect(() => {
    if (!slug) return;
    let mounted = true;
    api
      .getProgram(slug)
      .then((data) => {
        if (mounted && data) {
          setProgram((prev: any) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [slug]);

  const programIndex = fallbackPrograms.findIndex(
    (p) => p.slug === slug || p.id === slug
  );

  if (!program) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('program.notFound')}</h2>
        <p className="text-stone-500 mb-6">
          {t('program.notFoundDesc')}
        </p>
        <Link
          to="/programs"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-sm cursor-pointer"
        >
          {t('program.viewAll')}
        </Link>
      </div>
    );
  }

  const Icon = iconMap[program.icon] || Award;
  const title = program.title[language] || program.title.en;
  const summary = program.summary[language] || program.summary.en;
  const body = program.body[language] || program.body.en;

  const bulletKeys = [
    `programs.p${programIndex + 1}Bullet1`,
    `programs.p${programIndex + 1}Bullet2`,
    `programs.p${programIndex + 1}Bullet3`,
  ];

  return (
    <div className="space-y-16 pb-16">
      <PageBanner
        title={title}
        subtitle={summary}
        breadcrumbs={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.programs'), to: '/programs' },
          { label: title },
        ]}
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-sm text-start space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-amber-400 flex items-center justify-center">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  {t('program.pillar')} 0{programIndex + 1}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
                  {title}
                </h1>
              </div>
            </div>
            {program.comingSoon && <LockedBadge />}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {t('program.overviewScope')}
            </h3>
            <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed">
              {body}
            </p>
          </div>

          {/* Key Deliverables */}
          <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {t('program.keyDeliverables')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bulletKeys.map((bk, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
                    {t(bk as any)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Call */}
          <div className="pt-8 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-stone-900 dark:text-white text-sm">
                {t('program.getInvolved')}
              </h4>
              <p className="text-xs text-stone-500">
                {t('program.getInvolvedDesc')}
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link
                to="/register"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition cursor-pointer"
              >
                <span>{t('hero.ctaRegister')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/programs"
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                {t('program.allPrograms')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
