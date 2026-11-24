/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCountdown } from '../hooks/useCountdown.js';
import { useTranslation } from '../i18n/LanguageContext.js';

export function CountdownTimer({ targetDateString, className = '' }: { targetDateString?: string | null; className?: string }) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(targetDateString);
  const { t } = useTranslation();

  if (isPast) {
    return (
      <span className="inline-block text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
        {t('common.closed')}
      </span>
    );
  }

  const units = [
    { label: t('countdown.days'), val: days },
    { label: t('countdown.hours'), val: hours },
    { label: t('countdown.minutes'), val: minutes },
    { label: t('countdown.seconds'), val: seconds },
  ];

  return (
    <div className={`flex items-center gap-2 text-start ${className}`}>
      {units.map((u, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center min-w-[50px] sm:min-w-[58px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1.5 shadow-xs"
        >
          <span className="text-base sm:text-lg font-extrabold text-[#0B3D2E] dark:text-[#C9A24A] font-mono leading-tight">
            {String(u.val).padStart(2, '0')}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
