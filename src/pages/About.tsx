import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Target,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { PageBanner } from '../components/PageBanner.js';
import { SectionHeading } from '../components/SectionHeading.js';
import { PartnerGrid } from '../components/PartnerGrid.js';
import { api, Objective, Partner, LocalizedText } from '../lib/ohpea-api-client.js';

function localized(v: LocalizedText | undefined, lang: string): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  return v[lang] || v.en || Object.values(v).find((x) => typeof x === 'string') || '';
}

export const About: React.FC = () => {
  const { t, language, isRtl } = useTranslation();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

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

    return () => {
      mounted = false;
    };
  }, []);

  const officialObjectives = objectives.filter((o) => o.kind === 'official');
  const generalObjective = objectives.find((o) => o.kind === 'general');

  // 13 Specific Objectives (dynamically translated, static content)
  const specificObjectives = Array.from({ length: 13 }, (_, i) => ({
    title: t(`about.objSpecific${i + 1}Title` as any),
    desc: t(`about.objSpecific${i + 1}Desc` as any),
  }));

  return (
    <div className="space-y-16 pb-16">
      <PageBanner
        title={t('about.title')}
        subtitle={t('brandTagline')}
        breadcrumbs={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.about') },
        ]}
      />

      {/* Who We Are */}
      <section id="who-we-are" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-start">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              {t('about.whoWeAre')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white leading-tight">
              {t('about.whoWeAreTitle')}
            </h2>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-sm sm:text-base">
              {t('about.whoWeAreP1')}
            </p>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-sm">
              {t('about.whoWeAreP2')}
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-md transition-colors"
              >
                <span>{t('hero.ctaRegister')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Mission & Vision */}
          <div id="mission-vision" className="space-y-6">
            <div className="bg-emerald-900 text-white rounded-2xl p-8 border border-emerald-800 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('about.mission')}</h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                {t('brandTagline')}
              </p>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 shadow-sm text-stone-900 dark:text-stone-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('about.vision')}</h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* General Objective Highlight */}
      {generalObjective && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-emerald-500/10 border-2 border-amber-400/40 rounded-3xl p-8 sm:p-10 text-center">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-700 dark:text-amber-400 block mb-2">
              {localized(generalObjective.title, language) || 'General Objective'}
            </span>
            <p className="text-base sm:text-xl font-semibold text-stone-900 dark:text-stone-100 max-w-4xl mx-auto leading-relaxed italic">
              &ldquo;{localized(generalObjective.description, language)}&rdquo;
            </p>
          </div>
        </section>
      )}

      {/* 8 Official Objectives */}
      {officialObjectives.length > 0 && (
        <section id="objectives" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t('about.officialObjectives')}
            subtitle={t('about.officialObjectivesSubtitle')}
            className="mb-10"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {officialObjectives.map((obj, idx) => (
              <div
                key={obj.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-amber-400/60 transition-all text-start flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-amber-400 font-bold flex items-center justify-center text-sm mb-4">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">
                    {localized(obj.title, language)}
                  </h4>
                  {obj.description && (
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {localized(obj.description, language)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 13 Specific Objectives Accordion */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t('about.specificObjectives')}
          subtitle={t('about.specificObjectivesSubtitle')}
          className="mb-8"
        />
        <div className="space-y-3">
          {specificObjectives.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden transition-all text-start"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {item.title}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 text-xs text-stone-600 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800 leading-relaxed">
                    {item.desc}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Institutional Partners */}
      {partners.length > 0 && (
        <section id="partners" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title={t('home.partnersTitle')} className="mb-8" />
          <PartnerGrid partners={partners as any} />
        </section>
      )}

      {loading && (
        <div className="text-center py-8 text-stone-400 text-sm">Loading…</div>
      )}
    </div>
  );
};