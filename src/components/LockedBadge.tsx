/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lock } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';

export function LockedBadge({ label, className = '' }: { label?: string; className?: string }) {
  const { t } = useTranslation();

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 ${className}`}>
      <Lock className="w-2.5 h-2.5" />
      <span>{label || t('common.comingSoon')}</span>
    </span>
  );
}
