/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { formatNumber } from '../utils/formatNumber.js';
import { useTranslation } from '../i18n/LanguageContext.js';

export function StatCounter({ end, value, suffix = '+', label }: { end?: number; value?: number; suffix?: string; label: string }) {
  const targetEnd = end ?? value ?? 0;
  const { ref, isVisible } = useScrollReveal();
  const [count, setCount] = useState(0);
  const { language } = useTranslation();

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 1600;
    const stepTime = 25;
    const steps = duration / stepTime;
    const increment = targetEnd / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetEnd) {
        setCount(targetEnd);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, targetEnd]);

  return (
    <div ref={ref} className="text-center p-4">
      <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#C9A24A] font-mono tracking-tight">
        {formatNumber(count, language)}
        <span className="text-white/80 ml-0.5">{suffix}</span>
      </div>
      <div className="mt-1.5 text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
