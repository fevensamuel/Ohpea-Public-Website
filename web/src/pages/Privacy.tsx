import React from 'react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { PageBanner } from '../components/PageBanner.js';

export const Privacy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-12 pb-16">
      <PageBanner
        title={t('footer.privacy')}
        subtitle={t('privacy.subtitle')}
        breadcrumbs={[
          { label: t('nav.home'), to: '/' },
          { label: t('footer.privacy') },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            {t('privacy.s1Title')}
          </h2>
          <p>
            {t('privacy.s1Text')}
          </p>

          <h2 className="text-xl font-bold text-stone-900 dark:text-white pt-4">
            {t('privacy.s2Title')}
          </h2>
          <p>
            {t('privacy.s2Text')}
          </p>

          <h2 className="text-xl font-bold text-stone-900 dark:text-white pt-4">
            {t('privacy.s3Title')}
          </h2>
          <p>
            {t('privacy.s3Text')}
          </p>

          <h2 className="text-xl font-bold text-stone-900 dark:text-white pt-4">
            {t('privacy.s4Title')}
          </h2>
          <p>
            {t('privacy.s4Text')}
          </p>
        </div>
      </div>
    </div>
  );
};
