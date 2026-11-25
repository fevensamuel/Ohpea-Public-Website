/**
 * Updates — editorial redesign.
 * Data: GET /public/announcements via api.getAnnouncements({type, limit, page}).
 * Tabs, ?type= deep links (used by the homepage), client-side search, paging and
 * error handling are unchanged; only the presentation is new.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from '../i18n/LanguageContext.js';
import { api, Announcement, ApiMeta } from '../lib/ophea-api-client.js';
import { EditorialShell } from '../components/home/EditorialShell.js';
import { EditorialPageHero } from '../components/home/EditorialPageHero.js';
import { UpdateItem } from '../components/home/UpdateItem.js';
import { SLOT, photo } from '../components/home/images.js';

export const Updates: React.FC = () => {
  const { t, language } = useTranslation();
  const [searchParams] = useSearchParams();
  const validTabs = [
    'all',
    'news',
    'event',
    'vacancy',
    'call_for_proposal',
    'call_for_research',
  ] as const;
  type Tab = (typeof validTabs)[number];
  const getTabFromSearchParams = (): Tab => {
    const type = searchParams.get('type');
    return validTabs.find((tab) => tab === type) || 'all';
  };
  const [activeTab, setActiveTab] = useState<
    Tab
  >(getTabFromSearchParams);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [meta, setMeta] = useState<ApiMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'all', labelKey: 'common.all' },
    { id: 'news', labelKey: 'nav.news' },
    { id: 'event', labelKey: 'nav.events' },
    { id: 'vacancy', labelKey: 'nav.vacancies' },
    { id: 'call_for_proposal', labelKey: 'nav.callsProposals' },
    { id: 'call_for_research', labelKey: 'nav.callsResearch' },
  ] as const;

  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setPage(1);
  };

  useEffect(() => {
    setActiveTab(getTabFromSearchParams());
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const queryType: Announcement['type'] | undefined =
      activeTab === 'all'
        ? undefined
        : activeTab === 'call_for_proposal'
        ? 'proposal'
        : activeTab === 'call_for_research'
        ? 'research'
        : (activeTab as Announcement['type']);

    api
      .getAnnouncements({ type: queryType, limit: 10, page })
      .then((res) => {
        if (mounted && res && Array.isArray(res.data)) {
          setAnnouncements(res.data);
          setMeta(res.meta);
        }
      })
      .catch(() => {
        if (mounted) {
          setAnnouncements([]);
          setMeta({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeTab, page]);

  const displayedItems = useMemo(() => {
    if (!searchQuery.trim()) return announcements;
    const q = searchQuery.toLowerCase();
    return announcements.filter((item) => {
      const title = (
        typeof item.title === 'string'
          ? item.title
          : (item.title as any)?.[language] || (item.title as any)?.en || ''
      ).toLowerCase();
      const summary = (
        typeof item.summary === 'string'
          ? item.summary
          : (item.summary as any)?.[language] || (item.summary as any)?.en || ''
      ).toLowerCase();
      return title.includes(q) || summary.includes(q);
    });
  }, [announcements, searchQuery, language]);

  const goToPage = (n: number) => {
    setPage(n);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <EditorialShell>
      <main id="main">
        <EditorialPageHero
          image={photo(SLOT.updatesHero)}
          imageClass="object-[50%_40%]"
          title={t('nav.updates')}
          subtitle={t('updates.subtitle')}
          crumbs={[{ label: t('nav.updates') }]}
        />

        <section className="max-w-[1320px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div role="tablist" aria-label="Filter updates" className="flex flex-wrap gap-x-8 gap-y-3 border-b border-ink/15">
              {tabs.map((tab) => (
                <button
                  key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} data-cursor="link"
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative pb-4 text-[11px] font-semibold tracking-[0.18em] uppercase transition ${
                    activeTab === tab.id ? 'text-ink' : 'text-ink/45 hover:text-ink'
                  }`}
                >
                  {t(tab.labelKey as any)}
                  {activeTab === tab.id && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-ochre" />}
                </button>
              ))}
            </div>

            <div className="w-full lg:w-72">
              <label htmlFor="updates-search" className="sr-only">{t('common.searchPlaceholder')}</label>
              <input
                id="updates-search" type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.searchPlaceholder')}
                className="w-full bg-transparent border-b border-ink/40 focus:border-ink py-2.5 text-[13px] text-ink placeholder:text-ink/45 focus:outline-hidden transition"
              />
            </div>
          </div>

          {loading && (
            <p role="status" className="py-12 text-sm text-ink/50">{t('common.loading', 'Loading…')}</p>
          )}

          {!loading && displayedItems.length === 0 ? (
            <p className="py-16 font-display italic text-2xl text-ink/55">{t('updates.noResults', 'No updates found')}</p>
          ) : (
            <ul className="border-t border-ink/15">
              {displayedItems.map((item) => <UpdateItem key={item.id} item={item} />)}
            </ul>
          )}

          {meta.totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-ink/60">
              <p>
                Showing <span className="font-semibold text-ink">{(meta.page - 1) * meta.pageSize + 1}</span> – <span className="font-semibold text-ink">{Math.min(meta.page * meta.pageSize, meta.total)}</span> of <span className="font-semibold text-ink">{meta.total}</span>
              </p>
              <div className="flex items-center gap-2">
                <button type="button" disabled={meta.page <= 1} data-cursor="link" onClick={() => goToPage(Math.max(1, page - 1))}
                  className="px-4 py-2 border border-ink/30 font-semibold tracking-[0.14em] uppercase hover:bg-ink hover:text-white disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:cursor-not-allowed transition">
                  ← Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pNum) => (
                    <button key={pNum} type="button" data-cursor="link" aria-current={meta.page === pNum ? 'page' : undefined} onClick={() => goToPage(pNum)}
                      className={`w-9 h-9 font-semibold transition ${meta.page === pNum ? 'bg-ink text-white' : 'hover:bg-sand'}`}>
                      {pNum}
                    </button>
                  ))}
                </div>
                <button type="button" disabled={meta.page >= meta.totalPages} data-cursor="link" onClick={() => goToPage(Math.min(meta.totalPages, page + 1))}
                  className="px-4 py-2 border border-ink/30 font-semibold tracking-[0.14em] uppercase hover:bg-ink hover:text-white disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:cursor-not-allowed transition">
                  Next →
                </button>
              </div>
            </nav>
          )}
        </section>
      </main>
    </EditorialShell>
  );
};
