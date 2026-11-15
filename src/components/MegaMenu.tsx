/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Shield,
  Award,
  Handshake,
  TrendingUp,
  Users,
  Globe,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { usePrograms } from '../hooks/usePrograms.js';
import { localize } from '../utils/localize.js';

const programIcons = [BookOpen, Shield, Award, Handshake, TrendingUp, Users, Globe];

export function MegaMenu({ onClose }: { onClose: () => void }) {
  const { t, language } = useTranslation();
  const programsList = usePrograms();


  return (
    <div className="w-[680px] p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl grid grid-cols-2 gap-4 text-start">
      <div className="col-span-2 pb-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0B3D2E] dark:text-[#C9A24A]">
          {t('home.strategicPillarsTitle')}
        </span>
        <Link
          to="/programs"
          onClick={onClose}
          className="text-xs font-bold text-[#E8772E] hover:underline"
        >
          {t('common.viewAll')} &rarr;
        </Link>
      </div>

      {programsList.map((prog, i) => {
        const Icon = programIcons[i] || Award;
        return (
          <Link
            key={prog.slug}
            to={`/programs/${prog.slug}`}
            onClick={onClose}
            className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition flex items-start gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0B3D2E]/10 dark:bg-[#C9A24A]/10 text-[#0B3D2E] dark:text-[#C9A24A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0B3D2E] dark:group-hover:text-[#C9A24A] transition leading-snug">
                  {localize(prog.title, language)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {localize(prog.summary, language)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
