import React from 'react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { LegalPage } from '../components/home/LegalPage.js';

export const Privacy: React.FC = () => {
  const { t } = useTranslation();
  return (
    <LegalPage
      title={t('footer.privacy')}
      subtitle={t('privacy.subtitle')}
      crumb={t('footer.privacy')}
      sections={[1, 2, 3, 4].map((n) => ({ title: t(`privacy.s${n}Title` as any), text: t(`privacy.s${n}Text` as any) }))}
    />
  );
};
