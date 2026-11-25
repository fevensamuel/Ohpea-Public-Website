/**
 * Update detail — editorial redesign. Serves /updates/:slug and /news/:slug.
 * Data: GET /public/announcements/{slug} via api.getAnnouncement(slug), seeded from
 * fallbackAnnouncements exactly as before. Every field of the original is kept:
 * type, publishedAt, location, organizationName, share, event countdown + start,
 * deadline, cover image, summary, body, attachment / external links and the
 * registration action (external registrationUrl, otherwise /register).
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../i18n/LanguageContext.js';
import { formatDate } from '../utils/formatDate.js';
import { api } from '../lib/ophea-api-client.js';
import { fallbackAnnouncements } from '../data/fallbackContent.js';
import { EditorialShell } from '../components/home/EditorialShell.js';
import { EditorialPageHero } from '../components/home/EditorialPageHero.js';
import { EditorialCountdown } from '../components/home/EditorialCountdown.js';
import { EditorialShare } from '../components/home/EditorialShare.js';
import { SLOT, photo } from '../components/home/images.js';

export const UpdateDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useTranslation();

  const [item, setItem] = useState<any>(() =>
    fallbackAnnouncements.find((a) => a.slug === slug || a.id === slug) || null
  );
  const [loading, setLoading] = useState(!item);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    api
      .getAnnouncement(slug)
      .then((data) => { if (mounted && data) setItem(data); })
      .catch(() => { /* keep fallback if available */ })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <EditorialShell>
        <main id="main" className="min-h-[70svh] flex items-center justify-center">
          <p role="status" className="text-sm text-ink/50">Loading announcement...</p>
        </main>
      </EditorialShell>
    );
  }

  if (!item) {
    return (
      <EditorialShell>
        <main id="main">
          <EditorialPageHero size="sm" title={t('update.notFound')} subtitle={t('update.notFoundDesc')} crumbs={[{ label: t('nav.updates'), to: '/updates' }]} />
          <section className="max-w-3xl mx-auto px-6 py-20 text-center">
            <Link to="/updates" data-cursor="link" className="inline-flex border border-ink/70 px-7 py-3.5 font-display text-lg hover:bg-ink hover:text-white transition">
              {t('update.backToUpdates')}
            </Link>
          </section>
        </main>
      </EditorialShell>
    );
  }

  const title = typeof item.title === 'string' ? item.title : (item.title?.[language] || item.title?.en || '');
  const summary = typeof item.summary === 'string' ? item.summary : (item.summary?.[language] || item.summary?.en || '');
  const body = typeof item.body === 'string' ? item.body : (item.body?.[language] || item.body?.en || '');

  const typeLabel =
    item.type === 'news' ? t('nav.news')
    : item.type === 'event' ? t('nav.events')
    : item.type === 'vacancy' ? t('nav.vacancies')
    : item.type === 'proposal' || item.type === 'call_for_proposal' ? t('nav.callsProposals')
    : t('nav.callsResearch');

  const heroPhoto = photo(
    item.type === 'news' ? SLOT.updateDetailNews : item.type === 'event' ? SLOT.updateDetailEvent : SLOT.updateDetailOpportunity,
  );
  const cover = item.coverImageUrl || item.coverImage;

  const meta: Array<[string, string]> = [];
  if (item.publishedAt) meta.push(['Published', formatDate(item.publishedAt, language)]);
  if (item.location) meta.push(['Location', item.location]);
  if (item.organizationName) meta.push(['Organisation', item.organizationName]);

  const actionCls = 'inline-flex items-center gap-2 border border-ink/70 px-6 py-3 font-display text-lg hover:bg-ink hover:text-white transition';

  return (
    <EditorialShell>
      <main id="main">
        <EditorialPageHero
          image={heroPhoto}
          eyebrow={typeLabel}
          title={title}
          subtitle={summary}
          crumbs={[{ label: t('nav.updates'), to: '/updates' }, { label: typeLabel }]}
        />

        <article className="max-w-[1320px] mx-auto px-6 md:px-12 py-20 md:py-28 grid lg:grid-cols-12 gap-14 lg:gap-20">
          {/* Side column: facts, countdown, deadline, share */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-28 self-start">
            <dl className="border-t border-ink/15">
              <div className="py-4 border-b border-ink/15 flex justify-between gap-6">
                <dt className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ink/45">Type</dt>
                <dd className="text-sm text-right text-ochre-dark font-semibold">{typeLabel}</dd>
              </div>
              {meta.map(([k, v]) => (
                <div key={k} className="py-4 border-b border-ink/15 flex justify-between gap-6">
                  <dt className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ink/45">{k}</dt>
                  <dd className="text-sm text-right text-ink/80">{v}</dd>
                </div>
              ))}
            </dl>

            {item.type === 'event' && item.eventStartAt && (
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ochre mb-1">{t('update.eventCountdown')}</p>
                <p className="text-sm text-ink/65 mb-4">{t('update.starts')}: {new Date(item.eventStartAt).toLocaleString()}</p>
                <EditorialCountdown target={item.eventStartAt} compact />
              </div>
            )}

            {item.deadline && (
              <div className="border border-ochre/60 bg-sand px-5 py-4 flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-ink">{t('update.deadline')}: {formatDate(item.deadline, language)}</span>
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-ochre-dark">{t('common.open')}</span>
              </div>
            )}

            <EditorialShare title={title} />
          </aside>

          {/* Main column */}
          <div className="lg:col-span-8">
            {cover && (
              <img src={cover} alt={title} loading="lazy" className="w-full max-h-[480px] object-cover mb-12" />
            )}

            {summary && (
              <p className="font-display italic text-2xl md:text-3xl leading-snug text-olive border-l-2 border-ochre pl-6 mb-10">{summary}</p>
            )}

            {body && <p className="text-[17px] leading-[1.8] text-ink/80 whitespace-pre-line">{body}</p>}

            {(item.attachmentUrl || item.externalLink) && (
              <div className="mt-12 flex flex-wrap gap-6">
                {item.attachmentUrl && (
                  <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer" data-cursor="link"
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase border-b border-ink/40 pb-1.5 hover:border-ink transition">
                    Download attachment <span aria-hidden="true">↓</span>
                  </a>
                )}
                {item.externalLink && (
                  <a href={item.externalLink} target="_blank" rel="noopener noreferrer" data-cursor="link"
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase border-b border-ink/40 pb-1.5 hover:border-ink transition">
                    More information <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            )}

            <div className="mt-16 pt-8 border-t border-ink/15 flex flex-wrap items-center justify-between gap-6">
              <Link to="/updates" data-cursor="link" className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase text-ink/70 hover:text-ink transition">
                <span aria-hidden="true">←</span> {t('update.backToUpdates')}
              </Link>

              {item.registrationOpen && (
                item.registrationUrl ? (
                  <a href={item.registrationUrl} target="_blank" rel="noopener noreferrer" data-cursor="link" className={actionCls}>
                    {t('update.applyOnline')} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <Link to="/register" data-cursor="link" className={actionCls}>
                    {t('update.applyOnline')} <span aria-hidden="true">↗</span>
                  </Link>
                )
              )}
            </div>
          </div>
        </article>
      </main>
    </EditorialShell>
  );
};
