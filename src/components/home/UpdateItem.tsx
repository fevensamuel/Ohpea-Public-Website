import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext.js';
import { localize } from '../../utils/localize.js';
import { formatDate } from '../../utils/formatDate.js';
import type { Announcement } from '../../lib/ophea-api-client.js';
import { EditorialCountdown } from './EditorialCountdown.js';

const str = (v: unknown): string => (typeof v === 'string' ? v : '');

/**
 * One announcement row. Replaces NewsCard / EventCard / AnnouncementCard on the
 * redesigned Updates page while keeping every field they showed:
 *   news → cover image, published date · event → date badge, time, location,
 *   countdown, "register" link when registrationOpen · vacancy/call → type,
 *   deadline + "closing soon", organisation, location. All link to /updates/:slug.
 */
export function UpdateItem({ item }: { item: Announcement }) {
  const { t, language } = useTranslation();
  const a = item as any;
  const title = localize(item.title, language);
  const summary = localize(item.summary, language);
  const cover = str(a.coverImageUrl);
  const type = String(item.type);
  const isEvent = type === 'event';
  const isNews = type === 'news';

  const when = isEvent ? (a.eventStartAt ? new Date(a.eventStartAt) : null) : null;
  const day = when ? when.getDate() : null;
  const month = when ? when.toLocaleString(language === 'en' ? 'en-US' : 'default', { month: 'short' }) : '';
  const time = when ? when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  const deadline = str(a.deadline);
  const msLeft = deadline ? new Date(deadline).getTime() - Date.now() : 0;
  const closingSoon = !!deadline && msLeft < 7 * 86400000 && msLeft > 0;

  const typeLabel = isNews
    ? t('nav.news')
    : isEvent
    ? t('nav.events')
    : t(`nav.${type === 'vacancy' ? 'vacancies' : type === 'call_for_proposal' || type === 'proposal' ? 'callsProposals' : 'callsResearch'}` as any);

  const meta: string[] = [];
  if (isNews && a.publishedAt) meta.push(formatDate(a.publishedAt, language));
  if (isEvent && time) meta.push(time);
  if (str(a.organizationName)) meta.push(str(a.organizationName));
  if (str(a.location)) meta.push(str(a.location));

  return (
    <li className="border-b border-ink/15">
      <div className="group grid md:grid-cols-12 gap-x-8 gap-y-4 py-9 px-2 items-start hover:bg-sand/70 transition">
        {/* date / marker */}
        <div className="md:col-span-2 flex md:block items-baseline gap-3">
          {isEvent && day !== null ? (
            <>
              <span className="font-display text-5xl leading-none text-olive">{String(day).padStart(2, '0')}</span>
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ochre md:block md:mt-2">{month}</span>
            </>
          ) : (
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ochre">{typeLabel}</span>
          )}
        </div>

        {/* content */}
        <div className="md:col-span-7 min-w-0">
          {isEvent && <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ochre mb-2">{typeLabel}</p>}
          <h3 className="font-display text-2xl md:text-[32px] leading-tight group-hover:italic transition-all">
            <Link to={`/updates/${item.slug}`} data-cursor="link" className="focus-visible:underline">{title}</Link>
          </h3>
          {summary && <p className="mt-3 text-[15px] text-ink/70 leading-relaxed line-clamp-3 max-w-2xl">{summary}</p>}

          {(meta.length > 0 || deadline) && (
            <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] uppercase text-ink/55 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {meta.map((m, i) => <span key={i}>{m}</span>)}
              {deadline && (
                <span className={closingSoon ? 'text-ochre-dark' : ''}>
                  {closingSoon ? t('common.closingSoon') : `${t('countdown.days')}: ${formatDate(deadline, language)}`}
                </span>
              )}
            </p>
          )}

          {isEvent && a.eventStartAt && <div className="mt-5 max-w-xs"><EditorialCountdown target={a.eventStartAt} compact /></div>}

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <Link to={`/updates/${item.slug}`} data-cursor="link" className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase border-b border-ink/40 pb-1 hover:border-ink transition">
              {t('common.readMore')} <span aria-hidden="true">↗</span>
            </Link>
            {isEvent && a.registrationOpen && (
              <Link to="/register" data-cursor="link" className="inline-flex border border-ink/70 px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase hover:bg-ink hover:text-white transition">
                {t('common.becomeMember')}
              </Link>
            )}
          </div>
        </div>

        {/* cover image */}
        <div className="md:col-span-3">
          {cover && (
            <div className="overflow-hidden">
              <img src={cover} alt="" loading="lazy" className="w-full h-44 md:h-40 object-cover group-hover:scale-[1.04] transition-transform duration-700" />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
