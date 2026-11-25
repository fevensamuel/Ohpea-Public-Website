import React from 'react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { LegalPage } from '../components/home/LegalPage.js';

export const Terms: React.FC = () => {
  const { t } = useTranslation();
  return (
    <LegalPage
      title={t('footer.terms')}
      subtitle={t('terms.subtitle')}
      crumb={t('footer.terms')}
      sections={[1, 2, 3, 4].map((n) => ({ title: t(`terms.s${n}Title` as any), text: t(`terms.s${n}Text` as any) }))}
    />
  );
};
