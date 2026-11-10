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
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Program } from '../types.js';
import { useTranslation } from '../i18n/LanguageContext.js';
import { LockedBadge } from './LockedBadge.js';

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Shield,
  Award,
  Handshake,
  TrendingUp,
  Users,
  Globe,
};

export function ProgramCard({ program, index }: { program: Program; index: number }) {
  const { t, language, isRtl } = useTranslation();
  const IconComponent = iconMap[program.icon] || Award;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const title = program.title[language] || program.title.en;
  const summary = program.summary[language] || program.summary.en;

  // Bullets translation keys
  const bulletKeys = [
    `programs.p${index + 1}Bullet1`,
    `programs.p${index + 1}Bullet2`,
    `programs.p${index + 1}Bullet3`,
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-[#C9A24A]/50 transition-all duration-300 flex flex-col justify-between group text-start">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#0B3D2E]/10 dark:bg-[#C9A24A]/10 text-[#0B3D2E] dark:text-[#C9A24A] flex items-center justify-center group-hover:scale-110 transition-transform">
            <IconComponent className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2">
            {program.comingSoon && <LockedBadge />}
            <span className="text-xs font-mono font-bold text-slate-400">
              0{index + 1}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0B3D2E] dark:group-hover:text-[#C9A24A] transition">
          {title}
        </h3>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {summary}
        </p>

        {/* 3 Bullets like EEA sample */}
        <ul className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
          {bulletKeys.map((bk, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24A] shrink-0 mt-0.5" />
              <span>{t(bk)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Link
          to={`/programs/${program.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B3D2E] dark:text-[#C9A24A] hover:underline"
        >
          <span>{t('home.learnMore')}</span>
          <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
