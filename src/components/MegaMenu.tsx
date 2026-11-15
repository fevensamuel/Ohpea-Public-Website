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
import { LockedBadge } from './LockedBadge.js';

const programIcons = [BookOpen, Shield, Award, Handshake, TrendingUp, Users, Globe];

export function MegaMenu({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();

  const programsList = [
    { slug: 'research-and-study', titleKey: 'programs.p1Title', descKey: 'programs.p1Summary' },
    { slug: 'advocacy', titleKey: 'programs.p2Title', descKey: 'programs.p2Summary' },
    { slug: 'training-and-awareness', titleKey: 'programs.p3Title', descKey: 'programs.p3Summary' },
    { slug: 'b2b-bridge', titleKey: 'programs.p4Title', descKey: 'programs.p4Summary', comingSoon: true },
    { slug: 'investment-bridge', titleKey: 'programs.p5Title', descKey: 'programs.p5Summary', comingSoon: true },
    { slug: 'member-networking-jobs', titleKey: 'programs.p6Title', descKey: 'programs.p6Summary' },
    { slug: 'international-relations', titleKey: 'programs.p7Title', descKey: 'programs.p7Summary' },
  ];

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
                  {t(prog.titleKey)}
                </span>
                {prog.comingSoon && <LockedBadge />}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {t(prog.descKey)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
