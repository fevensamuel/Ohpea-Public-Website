/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';

export function Logo({ variant = 'default', className = '' }: { variant?: 'default' | 'white' | 'light'; size?: string; className?: string }) {
  const { t } = useTranslation();
  const isLightOrWhite = variant === 'white' || variant === 'light';

  return (
    <Link to="/" className={`flex items-center gap-3 group text-start ${className}`}>
      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0B3D2E] to-[#14573F] border border-[#C9A24A]/40 flex items-center justify-center text-[#C9A24A] shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform shrink-0">
        <Award className="w-6 h-6 text-[#C9A24A]" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className={`text-xl font-extrabold tracking-tight leading-none ${isLightOrWhite ? 'text-white' : 'text-[#0B3D2E] dark:text-white'}`}>
            OPHEA
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8772E] text-white uppercase tracking-wider">
            Oromia
          </span>
        </div>
        <div className={`text-[11px] font-medium leading-tight mt-0.5 max-w-[220px] sm:max-w-[280px] truncate ${isLightOrWhite ? 'text-white/80' : 'text-slate-600 dark:text-slate-300'}`}>
          {t('brandName')}
        </div>
      </div>
    </Link>
  );
}
