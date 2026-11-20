/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { Announcement } from '../types.js';
import { useTranslation } from '../i18n/LanguageContext.js';
import { CountdownTimer } from './CountdownTimer.js';
import { localize } from '../utils/localize.js';

export function EventCard({ event }: { event: Announcement }) {
  const { t, language, isRtl } = useTranslation();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const title = localize(event.title, language);
  const summary = localize(event.summary, language);

  const eventDate = event.eventStartAt ? new Date(event.eventStartAt) : new Date();
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString(language === 'en' ? 'en-US' : 'default', { month: 'short' });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:border-[#0B3D2E]/40 transition duration-300 flex flex-col justify-between text-start group">
      <div>
        {event.coverImageUrl && <img src={event.coverImageUrl} alt={title} loading="lazy" className="w-full h-40 object-cover rounded-xl mb-4" />}
        <div className="flex items-start gap-4 mb-4">
          {/* EEA style date badge */}
          <div className="w-14 h-14 rounded-2xl bg-[#0B3D2E] text-white flex flex-col items-center justify-center shrink-0 shadow-md border border-[#C9A24A]/40">
            <span className="text-lg font-black leading-none">{day}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A]">{month}</span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-[#E8772E]" />
              <span>{event.eventStartAt ? new Date(event.eventStartAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 EAT'}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0B3D2E] dark:group-hover:text-[#C9A24A] transition leading-snug">
              {title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {summary}
        </p>

        {event.location && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-[#0B3D2E] dark:text-[#C9A24A]" />
            <span>{event.location}</span>
          </div>
        )}

        {/* Live Countdown */}
        {event.eventStartAt && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <CountdownTimer targetDateString={event.eventStartAt} />
          </div>
        )}
      </div>

      <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Link
          to={`/updates/${event.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0B3D2E] dark:text-[#C9A24A] hover:underline"
        >
          <span>{t('common.readMore')}</span>
          <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
        </Link>
        {event.registrationOpen && (
          <Link
            to="/register"
            className="text-xs font-bold bg-[#E8772E] hover:bg-[#CF6420] text-white px-3 py-1.5 rounded-lg transition"
          >
            {t('common.becomeMember')}
          </Link>
        )}
      </div>
    </div>
  );
}
