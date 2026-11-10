/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { Announcement } from '../types.js';
import { useTranslation } from '../i18n/LanguageContext.js';
import { formatDate } from '../utils/formatDate.js';

export function NewsCard({ news }: { news: Announcement }) {
  const { t, language, isRtl } = useTranslation();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const title = news.title[language] || news.title.en;
  const summary = news.summary[language] || news.summary.en;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#0B3D2E]/40 transition duration-200 flex flex-col justify-between text-start group">
      <div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(news.publishedAt, language)}</span>
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0B3D2E] dark:group-hover:text-[#C9A24A] transition line-clamp-2">
          {title}
        </h3>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {summary}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Link
          to={`/updates/${news.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0B3D2E] dark:text-[#C9A24A] hover:underline"
        >
          <span>{t('common.readMore')}</span>
          <ArrowIcon className="w-3 h-3 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
