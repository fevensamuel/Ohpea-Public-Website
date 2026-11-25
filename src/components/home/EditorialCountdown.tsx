import React from 'react';
import { useCountdown } from '../../hooks/useCountdown.js';
import { useTranslation } from '../../i18n/LanguageContext.js';

/** Editorial countdown on a dark background; renders nothing once the date has passed. */
export function EditorialCountdown({ target, compact = false }: { target: string; compact?: boolean }) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(target);
  const { t } = useTranslation();
  if (isPast) return null;
  const units = [
    [t('countdown.days', 'Days'), days],
    [t('countdown.hours', 'Hours'), hours],
    [t('countdown.minutes', 'Minutes'), minutes],
    [t('countdown.seconds', 'Seconds'), seconds],
  ] as const;
  return (
    <div className={`grid grid-cols-4 border ${compact ? 'border-ink/20 text-ink' : 'border-white/20'}`} role="timer" aria-label="Time until the event">
      {units.map(([label, val], i) => (
        <div key={label} className={`${compact ? 'px-2 py-3' : 'px-3 py-5'} text-center ${i < 3 ? (compact ? 'border-r border-ink/20' : 'border-r border-white/20') : ''}`}>
          <div className={`font-display font-light tabular-nums ${compact ? 'text-2xl' : 'text-4xl md:text-5xl'}`}>{String(val).padStart(2, '0')}</div>
          <div className={`mt-1 text-[10px] font-semibold tracking-[0.2em] uppercase ${compact ? 'text-ink/55' : 'text-white/65'}`}>{label}</div>
        </div>
      ))}
    </div>
  );
}
