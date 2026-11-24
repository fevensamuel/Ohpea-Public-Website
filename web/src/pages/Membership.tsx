import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Award,
  Briefcase,
  GraduationCap,
  Building,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { PageBanner } from '../components/PageBanner.js';
import { SectionHeading } from '../components/SectionHeading.js';

export const Membership: React.FC = () => {
  const { t, isRtl } = useTranslation();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const categories = [
    {
      title: t('membership.cat1Title'),
      icon: Award,
      badge: t('membership.cat1Badge'),
      desc: t('membership.cat1Desc'),
      benefits: [
        t('membership.cat1Benefit1'),
        t('membership.cat1Benefit2'),
        t('membership.cat1Benefit3'),
        t('membership.cat1Benefit4'),
      ],
    },
    {
      title: t('membership.cat2Title'),
      icon: Briefcase,
      badge: t('membership.cat2Badge'),
      desc: t('membership.cat2Desc'),
      benefits: [
        t('membership.cat2Benefit1'),
        t('membership.cat2Benefit2'),
        t('membership.cat2Benefit3'),
      ],
    },
    {
      title: t('membership.cat3Title'),
      icon: GraduationCap,
      badge: t('membership.cat3Badge'),
      desc: t('membership.cat3Desc'),
      benefits: [
        t('membership.cat3Benefit1'),
        t('membership.cat3Benefit2'),
        t('membership.cat3Benefit3'),
      ],
    },
    {
      title: t('membership.cat4Title'),
      icon: Building,
      badge: t('membership.cat4Badge'),
      desc: t('membership.cat4Desc'),
      benefits: [
        t('membership.cat4Benefit1'),
        t('membership.cat4Benefit2'),
        t('membership.cat4Benefit3'),
      ],
    },
  ];

  const whyJoinBenefits = [
    t('membership.whyJoinBenefit1'),
    t('membership.whyJoinBenefit2'),
    t('membership.whyJoinBenefit3'),
    t('membership.whyJoinBenefit4'),
    t('membership.whyJoinBenefit5'),
  ];

  return (
    <div className="space-y-16 pb-16">
      <PageBanner
        title={t('nav.membership')}
        subtitle={t('membership.heroSubtitle')}
        breadcrumbs={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.membership') },
        ]}
      />

      {/* Why Join Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-start">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              {t('nav.whyJoin')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white leading-tight">
              {t('membership.whyJoinTitle')}
            </h2>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-sm sm:text-base">
              {t('membership.whyJoinDesc')}
            </p>

            <ul className="space-y-3 pt-2">
              {whyJoinBenefits.map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition"
              >
                <span>{t('hero.ctaRegister')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick steps */}
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 space-y-6 text-start">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">
              {t('home.howToJoinTitle')}
            </h3>
            <div className="space-y-4">
              {[
                { titleKey: 'joinStep1Title', descKey: 'joinStep1Desc' },
                { titleKey: 'joinStep2Title', descKey: 'joinStep2Desc' },
                { titleKey: 'joinStep3Title', descKey: 'joinStep3Desc' },
                { titleKey: 'joinStep4Title', descKey: 'joinStep4Desc' },
              ].map((s, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {t(s.titleKey as any)}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {t(s.descKey as any)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Membership Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t('membership.categoriesTitle')}
          subtitle={t('membership.categoriesSubtitle')}
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs hover:shadow-md flex flex-col justify-between text-start"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-amber-400 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {cat.badge}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white mt-1 mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                    {cat.desc}
                  </p>

                  <div className="space-y-1.5 border-t border-stone-100 dark:border-stone-800 pt-3">
                    {cat.benefits.map((b, bi) => (
                      <div key={bi} className="flex items-start gap-1.5 text-[11px] text-stone-700 dark:text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800">
                  <Link
                    to="/register"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-semibold text-xs transition"
                  >
                    <span>{t('membership.applyCategory')}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
