/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Building, ArrowRight, ArrowLeft } from 'lucide-react';
import { Announcement } from '../types.js';
import { useTranslation } from '../i18n/LanguageContext.js';
import { formatDate } from '../utils/formatDate.js';

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const { t, language, isRtl } = useTranslation();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const title = announcement.title[language] || announcement.title.en;
  const summary = announcement.summary[language] || announcement.summary.en;

  const isClosingSoon = announcement.deadline
    ? new Date(announcement.deadline).getTime() - Date.now() < 7 * 86400000 &&
      new Date(announcement.deadline).getTime() - Date.now() > 0
    : false;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-[#0B3D2E]/30 dark:hover:border-[#C9A24A]/40 transition-all duration-200 flex flex-col justify-between text-start group">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0B3D2E]/10 dark:bg-[#C9A24A]/10 text-[#0B3D2E] dark:text-[#C9A24A]">
            {t(`nav.${announcement.type === 'vacancy' ? 'vacancies' : announcement.type === 'call_for_proposal' ? 'callsProposals' : 'callsResearch'}`)}
          </span>
          {announcement.deadline && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isClosingSoon
                  ? 'bg-[#E8772E]/15 text-[#E8772E] font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {isClosingSoon ? t('common.closingSoon') : `${t('countdown.days')}: ${formatDate(announcement.deadline, language)}`}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0B3D2E] dark:group-hover:text-[#C9A24A] transition line-clamp-2">
          {title}
        </h3>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {summary}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          {announcement.organizationName && (
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{announcement.organizationName}</span>
            </span>
          )}
          {announcement.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{announcement.location}</span>
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Link
          to={`/updates/${announcement.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0B3D2E] dark:text-[#C9A24A] hover:underline"
        >
          <span>{t('common.readMore')}</span>
          <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
