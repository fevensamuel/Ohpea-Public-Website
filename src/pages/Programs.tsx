import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { PageBanner } from '../components/PageBanner.js';
import { ProgramCard } from '../components/ProgramCard.js';
import { SectionHeading } from '../components/SectionHeading.js';
import { api } from '../lib/ohpea-api-client.js';

export const Programs: React.FC = () => {
  const { t } = useTranslation();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .getPrograms()
      .then((data) => {
        if (mounted) setPrograms(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setPrograms([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-16 pb-16">
      <PageBanner
        title={t('home.strategicPillarsTitle')}
        subtitle={t('home.strategicPillarsDesc')}
        breadcrumbs={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.programs') },
        ]}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          pill={t('home.strategicPillars')}
          title={t('home.strategicPillarsTitle')}
          subtitle={t('home.strategicPillarsDesc')}
          className="mb-12"
        />

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading programs...</div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">No programs available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {programs.map((prog, idx) => (
              <ProgramCard key={prog.id} program={prog} index={idx} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};